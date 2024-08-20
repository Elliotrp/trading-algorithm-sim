import { Strategy } from "../enums/strategy.enum";

export const strategyDescriptions: Record<Strategy, string> = {
   [Strategy.None]: "",

   [Strategy.MeanReversion]: `The Mean Reversion strategy is based on the idea that prices and returns eventually move back towards their historical average`,

   [Strategy.SimpleMovingAverageCrossover]: `The Simple Moving Average (SMA) Crossover strategy identifies potential buy or sell signals based on the crossover of short-term and long-term moving averages.`,

   [Strategy.ExponentialMovingAverageCrossover]: `The Exponential Moving Average (EMA) Crossover strategy is similar to the SMA Crossover but gives more weight to recent prices, making it more responsive to price changes.`,

   [Strategy.Momentum]: `The Momentum strategy aims to capitalize on the continuation of existing trends in the market. It assumes that a security that is rising will continue to rise, and one that is falling will continue to fall.`,

   [Strategy.LinearRegressionMachineLearning]: `The Linear Regression Machine Learning strategy uses a statistical approach to predict future prices by fitting a linear relationship between the historical data and the target variable.`,

   [Strategy.SupportedVectorRegressionMachineLearning]: `The Supported Vector Regression (SVR) Machine Learning strategy applies a machine learning model that uses support vectors to predict future price movements. It is particularly effective in capturing complex relationships between input features.`,
};
