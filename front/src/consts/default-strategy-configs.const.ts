import { Strategy } from "../enums/strategy.enum";
import { IStrategyConfig } from "../interfaces/strategy-config.interface";
import { machineLearningFeatures } from "./machine-learning-feature-options.const";

export const defaultStrategyConfigs = new Map<Strategy, IStrategyConfig>([
   [Strategy.None, {}],
   [
      Strategy.MeanReversion,
      {
         lookback_period: 14,
         z_threshold: 2,
      },
   ],
   [
      Strategy.SimpleMovingAverageCrossover,
      {
         longterm_avg_period: 90,
         shortterm_avg_period: 14,
      },
   ],
   [
      Strategy.ExponentialMovingAverageCrossover,
      {
         longterm_avg_period: 90,
         shortterm_avg_period: 14,
      },
   ],
   [
      Strategy.Momentum,
      {
         momentum_period: 14,
         momentum_threshold: 1,
      },
   ],
   [
      Strategy.LinearRegressionMachineLearning,
      {
         training_period: 60,
         features: machineLearningFeatures.slice(0, 2),
      },
   ],
   [
      Strategy.SupportedVectorRegressionMachineLearning,
      {
         training_period: 60,
         features: machineLearningFeatures.slice(0, 2),
         c: 100,
         epsilon: 0.01,
      },
   ],
]);
