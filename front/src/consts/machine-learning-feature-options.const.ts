import { MachineLearningFeatures } from "../enums/machine-learning-features.enum";
import { IMachineLearningOption } from "../interfaces/machine-learning-feature-option.interface";

export const machineLearningFeatures: IMachineLearningOption[] = [
   {
      value: MachineLearningFeatures.ShortTermAverage,
      label: "Short term average",
   },
   {
      value: MachineLearningFeatures.LongTermAverage,
      label: "Long term average",
   },
   {
      value: MachineLearningFeatures.RSI,
      label: "RSI",
   },
   {
      value: MachineLearningFeatures.MACD,
      label: "MACD",
   },
   {
      value: MachineLearningFeatures.Volume,
      label: "Volume",
   },
];
