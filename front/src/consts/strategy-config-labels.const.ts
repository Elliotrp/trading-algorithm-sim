import { StrategyConfigLabels } from "../interfaces/strategy-config-label.interface";
import {
   ExponentialMovingAverageCrossoverConfig,
   LinearRegressionMachineLearningConfig,
   MeanReversionStrategyConfig,
   MomentumConfig,
   SimpleMovingAverageCrossoverConfig,
   SupportedVectorRegressionMachineLearningConfig,
} from "../interfaces/strategy-config.interface";

export const strategyConfigLabels: StrategyConfigLabels<
   MeanReversionStrategyConfig &
      SimpleMovingAverageCrossoverConfig &
      ExponentialMovingAverageCrossoverConfig &
      MomentumConfig &
      LinearRegressionMachineLearningConfig &
      SupportedVectorRegressionMachineLearningConfig
> = {
   lookback_period: {
      label: "Lookback period",
      suffix: "days",
      description:
         "The number of days to look back when evaluating the rolling average.",
   },
   z_threshold: {
      label: "Z-threshold",
      description:
         "The threshold value for the Z-score to trigger trading signals.",
   },
   longterm_avg_period: {
      label: "Long term average period",
      suffix: "days",
      description:
         "The number of days over which the long-term moving average is calculated.",
   },
   shortterm_avg_period: {
      label: "Short term average period",
      suffix: "days",
      description:
         "The number of days over which the short-term moving average is calculated.",
   },
   momentum_period: {
      label: "Momentum period",
      suffix: "days",
      description:
         "The period for calculating momentum, reflecting the strength of recent price changes.",
   },
   momentum_threshold: {
      label: "Momentum threshold",
      suffix: "%",
      description:
         "The percentage level of momentum required to signal a trading action.",
   },
   training_period: {
      label: "Training period",
      suffix: "days",
      description:
         "The number of days of historical data used to train the machine learning model.",
   },
   features: {
      label: "Features",
      description:
         "The list of features or indicators used as input to the machine learning model.",
   },
   c: {
      label: "Regularization parameter",
      description:
         "The regularization parameter that controls the trade-off between maximizing the margin and minimizing classification error in the SVR model.",
   },
   epsilon: {
      label: "ε-Insensitive loss function",
      description:
         "The epsilon parameter defines the margin of tolerance where no penalty is given for errors.",
   },
};
