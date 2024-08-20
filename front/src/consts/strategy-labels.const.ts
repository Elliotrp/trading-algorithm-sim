import { Strategy } from "../enums/strategy.enum";

export const strategyLabels: Record<Strategy, string> = {
   [Strategy.None]: "Select a strategy",
   [Strategy.MeanReversion]: "Mean reversion",
   [Strategy.SimpleMovingAverageCrossover]: "Simple moving average crossover",
   [Strategy.ExponentialMovingAverageCrossover]:
      "Exponential moving average crossover",
   [Strategy.Momentum]: "Momentum",
   [Strategy.LinearRegressionMachineLearning]:
      "Machine learning (linear regression)",
   [Strategy.SupportedVectorRegressionMachineLearning]:
      "Machine learning (supported vector regression)",
};
