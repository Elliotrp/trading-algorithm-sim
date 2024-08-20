import datetime as dt
from decimal import Decimal
from typing import Type
import pandas as pd
from .strategies import Strategy
import uuid

class SimulationEngine:

    def __init__(self, symbol: str, start_date: dt.datetime, end_date: dt.datetime, strategy: Type[Strategy], strategy_config: dict) -> None:
        self._symbol = symbol
        self._start_date = start_date
        self._end_date = end_date
        self._strategy = strategy
        self._strategy_config = strategy_config
        self._position = Decimal(0)
        self._signals = []
        self._buys = []
        self._buy_dates = []
        self._buy_price = []
        self._sells = []
        self._sell_dates = []
        self._sell_price = []
        self._value = []

    def execute(self):
        strategy = self._strategy(self._strategy_config)

        print("Getting data", dt.datetime.now())
        self._data = strategy.initialise_data(self._symbol, self._start_date, self._end_date)
        print("Data received", dt.datetime.now())

        tradingStartIndex = self._data.index.searchsorted(self._start_date, side='left')
        
        self._initialCapital = Decimal(self._data.iloc[tradingStartIndex]['Close'])
        self._capital = self._initialCapital

        print("Executing strategy", dt.datetime.now())
        for date in self._data[self._start_date:].index:
            signal = strategy.execute(date)
            bought, sold = self._place_trade(signal, date)
            self._log_results(date, signal, bought, sold)

        print("Strategy executed", dt.datetime.now())

        self._construct_output()

    def _construct_output(self) -> None:
        self.output_data = {
            'Id': uuid.uuid4(),
            'Values': pd.DataFrame(dict(
                Date = self._data[self._start_date:].index,
                Stock = self._data[self._start_date:]["Close"].round(2),
                Signal = self._signals,
                Value = self._value)),
            'Buys': pd.DataFrame(dict(
                Date = self._buy_dates,
                Bought = self._buys,
                BuyPrice = self._buy_price
            )),
            'Sells': pd.DataFrame(dict(
                Date = self._sell_dates,
                Sells = self._sells,
                SellPrice = self._sell_price
            ))
        }

    def _log_results(self, date: dt.datetime, signal: Decimal, bought: Decimal, sold: Decimal) -> None:
        self._signals.append(signal)
        current_stock_price = Decimal(self._data.loc[date, "Close"])
        current_value = self._capital + (self._position * current_stock_price)
        self._value.append(round(current_value, 2))

        if (bought != 0):
            self._buys.append(round(bought, 2))
            self._buy_dates.append(date)
            self._buy_price.append(round(current_stock_price, 2))
        
        if (sold != 0):
            self._sells.append(round(sold, 2))
            self._sell_dates.append(date)
            self._sell_price.append(round(current_stock_price, 2))

    def _place_trade(self, signal: Decimal, date: dt.datetime) -> tuple:
        if signal >= 1:
            return self._buy_long(signal, date), 0

        if signal <= -1:
            return 0, self._sell_long(signal, date)
        
        return 0, 0

    def _buy_long(self, signal: Decimal, date: dt.datetime) -> Decimal:
        if self._capital <= 0:
            return 0
        
        totalCost = min(signal * self._initialCapital, self._capital)
        strikePrice = Decimal(self._data.loc[date, "Close"])
        stockOrder = totalCost / strikePrice
        self._position += stockOrder
        self._capital -= totalCost
        return totalCost

    def _sell_long(self, signal: Decimal, date: dt.datetime) -> Decimal:
        if self._position <= 0:
            return 0
        
        totalStock = min(- signal * self._position, self._position)
        strikePrice = Decimal(self._data.loc[date, "Close"])
        totalValue = totalStock * strikePrice
        self._position -= totalStock
        self._capital += totalValue
        return totalValue
