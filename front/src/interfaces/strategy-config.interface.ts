import { MachineLearningFeatures } from "../enums/machine-learning-features.enum";

export interface MeanReversionStrategyConfig extends IStrategyConfig {
   lookback_period: Number;
   z_threshold: Number;
}

export interface SimpleMovingAverageCrossoverConfig extends IStrategyConfig {
   longterm_avg_period: Number;
   shortterm_avg_period: Number;
}

export interface ExponentialMovingAverageCrossoverConfig
   extends SimpleMovingAverageCrossoverConfig {}

export interface MomentumConfig extends IStrategyConfig {
   momentum_period: Number;
   momentum_threshold: Number;
}

export interface LinearRegressionMachineLearningConfig {
   training_period: number;
   features: MachineLearningFeatures[];
}

export interface SupportedVectorRegressionMachineLearningConfig
   extends LinearRegressionMachineLearningConfig {
   c: number;
   epsilon: number;
}

export interface IStrategyConfig {}
