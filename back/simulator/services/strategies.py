from abc import ABC, abstractmethod
import datetime as dt
import yfinance as yf
import pandas as pd
from decimal import Decimal
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVR
import numpy as np
from .technical_indicators import calculate_macd, calculate_rsi

class Strategy(ABC):

    def __init__(self, config: dict) -> None:
        super().__init__()

    @abstractmethod
    def execute(self):
        pass

    def initialise_data(
            self,
            symbol: str,
            start_date: dt.datetime = dt.datetime.today(),
            end_date: dt.datetime = dt.datetime.today()) -> pd.DataFrame:
        ticker: yf.Ticker = yf.Ticker(symbol)
        self._data = ticker.history(start = start_date, end = end_date, interval = "1d")
        return self._data
    
class MeanReversion(Strategy):

    def __init__(self, config: dict) -> None:
        super().__init__(config)
        self._lookback_period = dt.timedelta(days = config.get("lookback_period"))
        self._z_threshold = config.get("z_threshold")
    
    def execute(self, date: dt.datetime) -> Decimal:
        if date not in self._data.index:
            return 0

        lookback_window = self._data[date - self._lookback_period:date]["Close"]
        mean = lookback_window.mean()
        std = lookback_window.std()
        current_value = self._data.loc[date, "Close"]
        z_score = (current_value - mean) / std
        
        if z_score > self._z_threshold:
            return -1
        if z_score < -self._z_threshold:
            return 1
        
        return 0

    def initialise_data(
            self,
            symbol: str,
            start_date: dt.datetime,
            end_date: dt.datetime) -> pd.DataFrame:
        start_date = start_date - self._lookback_period
        return super().initialise_data(symbol, start_date, end_date)
    
class SimpleMovingAverageCrossover(Strategy):
        
    def __init__(self, config: dict) -> None:
        super().__init__(config)
        self._longterm_avg_period = dt.timedelta(days = config.get("longterm_avg_period"))
        self._shortterm_avg_period = dt.timedelta(days = config.get("shortterm_avg_period"))

    def execute(self, date: dt.datetime) -> Decimal:
        if date not in self._data.index:
            return 0

        longterm_window = self._data[date - self._longterm_avg_period:date]["Close"]
        longterm_mean = longterm_window.mean()

        shortterm_window = self._data[date - self._shortterm_avg_period:date]["Close"]
        shortterm_mean = shortterm_window.mean()

        if longterm_mean > shortterm_mean:
            return 1
        else:
            return -1


    def initialise_data(
            self,
            symbol: str,
            start_date: dt.datetime,
            end_date: dt.datetime) -> pd.DataFrame:
        start_date = start_date - self._longterm_avg_period
        return super().initialise_data(symbol, start_date, end_date)

class ExponentialMovingAverageCrossover(Strategy):
        
    def __init__(self, config: dict) -> None:
        super().__init__(config)
        self._longterm_avg_period = config.get("longterm_avg_period")
        self._shortterm_avg_period = config.get("shortterm_avg_period")
        self._exponential_decay_span = config.get("exponential_decay_span")

    def execute(self, date: dt.datetime) -> Decimal:
        if date not in self._data.index:
            return 0

        longterm_mean = self._longterm_mean.loc[date]
        shortterm_mean = self._shortterm_mean.loc[date]

        if longterm_mean > shortterm_mean:
            return 1
        else:
            return -1

    def initialise_data(
            self,
            symbol: str,
            start_date: dt.datetime,
            end_date: dt.datetime) -> pd.DataFrame:
        start_date = start_date - dt.timedelta(days = self._longterm_avg_period)

        super().initialise_data(symbol, start_date, end_date)
        self._longterm_mean = self._data["Close"].ewm(span=self._longterm_avg_period, adjust=False).mean()
        self._shortterm_mean = self._data["Close"].ewm(span=self._shortterm_avg_period, adjust=False).mean()
        return self._data
    
class Momentum(Strategy):

    def __init__(self, config: dict) -> None:
        super().__init__(config)
        self._momentum_period = dt.timedelta(days = config.get("momentum_period"))
        self._momentum_threshold = config.get("momentum_threshold")

    def initialise_data(
            self,
            symbol: str,
            start_date: dt.datetime,
            end_date: dt.datetime) -> pd.DataFrame:
        start_date = start_date - self._momentum_period
        return super().initialise_data(symbol, start_date, end_date)

    def execute(self, date: dt.datetime) -> Decimal:
        if date not in self._data.index:
            return 0
        
        momentum_window = self._data[date - self._momentum_period:date]["Close"]

        current_value = momentum_window.iloc[-1]
        previous_value = momentum_window.iloc[1]

        percentage_change = 100 * (current_value - previous_value) / previous_value

        if (percentage_change > self._momentum_threshold):
            return 1

        if (-percentage_change < self._momentum_threshold):
            return -1
        
        return 0

class LinearRegressionMachineLearning(Strategy):

    def __init__(self, config: dict) -> None:
        super().__init__(config)
        self._training_period = dt.timedelta(days = config.get("training_period"))
        self._features = list(map(lambda f: f["value"], config.get("features")))

    def initialise_data(
            self,
            symbol: str,
            start_date: dt.datetime = dt.datetime.today(),
            end_date: dt.datetime = dt.datetime.today()) -> pd.DataFrame:
        rolling_average_buffer = dt.timedelta(days = 70)
        super().initialise_data(symbol, start_date - self._training_period - rolling_average_buffer, end_date)
        self._engineer_features()
        self._train_and_predict(start_date)

        return self._data
    
    def _engineer_features(self) -> None:
        
        if 'SMA_10' in self._features:
            self._data['SMA_10'] = self._data['Close'].rolling(window=10).mean()
        
        if 'SMA_50' in self._features:
            self._data['SMA_50'] = self._data['Close'].rolling(window=50).mean()

        if 'RSI' in self._features:
            self._data['RSI'] = calculate_rsi(self._data['Close'])

        if 'MACD' in self._features:
            self._data['MACD'], self._data['MACD_Signal'] = calculate_macd(self._data['Close'])
            self._features.append('MACD_Signal')

        self._data['Return'] = self._data['Close'].pct_change()
        self._data['Future_Return'] = self._data['Return'].shift(-1)
        self._data['Target'] = np.where(self._data['Future_Return'] > 0, 1, 0)

        self._data.dropna(subset = self._features + ['Target'], inplace=True)
    
    def _train_and_predict(self, start_date: dt.datetime) -> None:
        train = self._data.loc[:start_date].copy()
        test = self._data.loc[start_date:].copy()

        # scaler = StandardScaler()
        # train[self._features] = scaler.fit_transform(train[self._features])
        # test[self._features] = scaler.transform(test[self._features])

        x_train = train[self._features]
        y_train = train['Target']
        x_test = test[self._features]

        self._model = LinearRegression()
        self._model.fit(x_train, y_train)

        predictions = self._model.predict(x_test)
        self._predictions = pd.DataFrame({
            'Date': self._data.loc[start_date:].index,
            'Prediction': predictions
        }).set_index('Date')

    def execute(self, date: dt.datetime) -> Decimal:
        if date not in self._data.index:
            return 0
        
        return Decimal(self._predictions.loc[date, 'Prediction'])
    


class SupportedVectorRegressionMachineLearning(Strategy):

    def __init__(self, config: dict) -> None:
        super().__init__(config)
        self._training_period = dt.timedelta(days=config.get("training_period"))
        self._c = config.get("c")
        self._epsilon = config.get("epsilon")
        self._features = list(map(lambda f: f["value"], config.get("features")))
        self._scaler = StandardScaler()

    def initialise_data(
            self,
            symbol: str,
            start_date: dt.datetime = dt.datetime.today(),
            end_date: dt.datetime = dt.datetime.today()) -> pd.DataFrame:
        rolling_average_buffer = dt.timedelta(days=70)
        super().initialise_data(symbol, start_date - self._training_period - rolling_average_buffer, end_date)
        self._engineer_features()
        self._train_and_predict(start_date)

        return self._data
    
    def _engineer_features(self) -> None:
        if 'SMA_10' in self._features:
            self._data['SMA_10'] = self._data['Close'].rolling(window=10).mean()
        
        if 'SMA_50' in self._features:
            self._data['SMA_50'] = self._data['Close'].rolling(window=50).mean()

        if 'RSI' in self._features:
            self._data['RSI'] = calculate_rsi(self._data['Close'])

        if 'MACD' in self._features:
            self._data['MACD'], self._data['MACD_Signal'] = calculate_macd(self._data['Close'])
            self._features.append('MACD_Signal')

        self._data['Return'] = self._data['Close'].pct_change()
        self._data['Future_Return'] = self._data['Return'].shift(-1)
        self._data['Target'] = np.where(self._data['Future_Return'] > 0, 1, 0)

        self._data.dropna(subset=self._features + ['Target'], inplace=True)
    
    def _train_and_predict(self, start_date: dt.datetime) -> None:
        train = self._data.loc[:start_date].copy()
        test = self._data.loc[start_date:].copy()

        x_train = self._scaler.fit_transform(train[self._features])
        y_train = train['Target']
        x_test = self._scaler.transform(test[self._features])

        self._model = SVR(kernel='linear', C=self._c, epsilon=self._epsilon)
        self._model.fit(x_train, y_train)

        predictions = self._model.predict(x_test)
        self._predictions = pd.DataFrame({
            'Date': self._data.loc[start_date:].index,
            'Prediction': predictions
        }).set_index('Date')

    def execute(self, date: dt.datetime) -> Decimal:
        if date not in self._data.index:
            return 0
        
        return Decimal(self._predictions.loc[date, 'Prediction'])
