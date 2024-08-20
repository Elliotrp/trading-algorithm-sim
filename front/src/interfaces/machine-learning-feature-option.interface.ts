import { MachineLearningFeatures } from "../enums/machine-learning-features.enum";
import { IMultiselectOption } from "./multiselect-option.interface";

export interface IMachineLearningOption extends IMultiselectOption {
   label: string;
   value: MachineLearningFeatures;
}
