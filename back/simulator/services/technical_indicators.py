import pandas as pd

def calculate_rsi(series: pd.Series, period=14) -> pd.Series:
    """Calculate the Relative Strength Index (RSI) for a given series."""
    delta = series.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()

    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    return rsi

def calculate_macd(series: pd.Series, short_window=12, long_window=26, signal_window=9) -> pd.Series:
    """Calculate the MACD and MACD Signal Line."""
    short_ema = series.ewm(span=short_window, adjust=False).mean()
    long_ema = series.ewm(span=long_window, adjust=False).mean()

    macd = short_ema - long_ema

    macd_signal = macd.ewm(span=signal_window, adjust=False).mean()

    return macd, macd_signal