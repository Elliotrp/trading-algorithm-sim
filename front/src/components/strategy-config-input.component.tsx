import { useState, useEffect } from "react";
import { Strategy } from "../enums/strategy.enum";
import {
   IStrategyConfig,
   MeanReversionStrategyConfig,
   SimpleMovingAverageCrossoverConfig,
   ExponentialMovingAverageCrossoverConfig,
   MomentumConfig,
   LinearRegressionMachineLearningConfig,
   SupportedVectorRegressionMachineLearningConfig,
} from "../interfaces/strategy-config.interface";
import { strategyConfigLabels } from "../consts/strategy-config-labels.const";
import Select from "react-select";
import { machineLearningFeatures } from "../consts/machine-learning-feature-options.const";
import { IMultiselectOption } from "../interfaces/multiselect-option.interface";
import { IStrategyConfigLabel } from "../interfaces/strategy-config-label.interface";

function StrategyConfigInput({
   strategy,
   onChange,
   value,
}: StrategyConfigInputProps) {
   const [config, setConfig] = useState<IStrategyConfig>(value);
   useEffect(() => {
      setConfig(value);
   }, [value]);

   function handleInputChange<T>(field: string, newValue: T) {
      const updatedConfig = { ...config, [field]: newValue };
      setConfig(updatedConfig);
      onChange(updatedConfig);
   }

   function renderSimpleStrategyConfigInput<T extends IStrategyConfig>(
      config: T,
      labels: IStrategyConfigLabel,
      field: keyof T & string,
      inputProps: React.InputHTMLAttributes<HTMLInputElement>,
      stringParseFn: (value: string) => any
   ) {
      inputProps.placeholder = labels.label;
      return (
         <div className="mb-6">
            <div className="flex justify-center items-center space-x-2 relative">
               <label
                  htmlFor={field}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
               >
                  {labels.label}
                  {labels.suffix && (
                     <span className="ml-1">({labels.suffix})</span>
                  )}
               </label>
               <div className="ml-2 group">
                  <span className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 cursor-pointer">
                     ?
                  </span>
                  <div className="absolute left-1/2 transform -translate-x-1/2 hidden group-hover:block w-64 p-2 bg-green-50 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-300 rounded-md shadow-md text-sm top-full mt-2 z-50">
                     {labels.description}
                  </div>
               </div>
            </div>

            <input
               id={field}
               name={field}
               value={config[field]?.toString()}
               onChange={(e) =>
                  handleInputChange(field, stringParseFn(e.target.value))
               }
               className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white dark:bg-zinc-900 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
               {...inputProps}
            />
         </div>
      );
   }

   function renderMultiSelectStrategyConfigInput<
      T extends IStrategyConfig,
      K extends IMultiselectOption
   >(
      config: T,
      labels: IStrategyConfigLabel,
      field: keyof T & string,
      options: K[]
   ) {
      return (
         <div className="mb-6">
            <div className="flex justify-center items-center space-x-2 relative">
               <label
                  htmlFor={field}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
               >
                  {labels.label}
                  {labels.suffix && (
                     <span className="ml-1">({labels.suffix})</span>
                  )}
               </label>
               <div className="ml-2 group">
                  <span className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 cursor-pointer">
                     ?
                  </span>
                  <div className="absolute left-1/2 transform -translate-x-1/2 hidden group-hover:block w-64 p-2 bg-green-50 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-300 rounded-md shadow-md text-sm top-full mt-2 z-50">
                     {labels.description}
                  </div>
               </div>
            </div>
            <Select
               options={options}
               isMulti
               value={config[field] as K[]}
               getOptionValue={(option) => {
                  return option.value;
               }}
               onChange={(newValue) => {
                  handleInputChange(field, newValue);
               }}
               classNames={{
                  control: () =>
                     "bg-white dark:bg-zinc-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none mt-1",
                  option: (state) =>
                     `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                        state.isSelected
                           ? "bg-green-500 dark:bg-green-600 text-white"
                           : state.isFocused
                           ? "bg-zinc-100 dark:bg-zinc-600 text-gray-900 dark:text-gray-100"
                           : "bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100"
                     }`,
                  multiValue: () =>
                     "flex items-center bg-zinc-200 dark:bg-zinc-600 rounded-md p-px",
                  multiValueLabel: () =>
                     "text-gray-700 dark:text-gray-200 px-2",
                  multiValueRemove: () =>
                     "flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-200 hover:text-white rounded-md cursor-pointer p-1",
                  menu: () =>
                     "bg-white dark:bg-zinc-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg mt-1",
                  menuList: () => "py-1",
                  input: () => "text-white",
               }}
               styles={{
                  control: (base, state) => ({
                     ...base,
                     borderColor: state.isFocused
                        ? "#22c55e"
                        : base.borderColor,
                     boxShadow: state.isFocused
                        ? "0 0 0 1px #22c55e"
                        : base.boxShadow,
                     "&:hover": {
                        borderColor: state.isFocused
                           ? "#22c55e"
                           : base.borderColor,
                     },
                  }),
               }}
            ></Select>
         </div>
      );
   }

   if (strategy === Strategy.MeanReversion && isMeanReversionConfig(config)) {
      return (
         <>
            {renderSimpleStrategyConfigInput(
               config,
               strategyConfigLabels.lookback_period,
               "lookback_period",
               {
                  type: "number",
               },
               parseFloat
            )}
            {renderSimpleStrategyConfigInput(
               config,
               strategyConfigLabels.z_threshold,
               "z_threshold",
               {
                  type: "number",
                  min: "0",
                  max: "15",
                  step: "0.1",
               },
               parseFloat
            )}
         </>
      );
   }

   if (
      strategy === Strategy.SimpleMovingAverageCrossover &&
      isSMACrossoverConfig(config)
   ) {
      return (
         <>
            {renderSimpleStrategyConfigInput(
               config,
               strategyConfigLabels.longterm_avg_period,
               "longterm_avg_period",
               {
                  type: "number",
               },
               parseFloat
            )}
            {renderSimpleStrategyConfigInput(
               config,
               strategyConfigLabels.shortterm_avg_period,
               "shortterm_avg_period",
               {
                  type: "number",
               },
               parseFloat
            )}
         </>
      );
   }

   if (
      strategy === Strategy.ExponentialMovingAverageCrossover &&
      isEMACrossoverConfig(config)
   ) {
      return (
         <>
            {renderSimpleStrategyConfigInput(
               config,
               strategyConfigLabels.longterm_avg_period,
               "longterm_avg_period",
               {
                  type: "number",
               },
               parseFloat
            )}
            {renderSimpleStrategyConfigInput(
               config,
               strategyConfigLabels.shortterm_avg_period,
               "shortterm_avg_period",
               { type: "number", placeholder: "Short term period" },
               parseFloat
            )}
         </>
      );
   }

   if (strategy === Strategy.Momentum && isMomentumConfig(config)) {
      return (
         <>
            {renderSimpleStrategyConfigInput(
               config,
               strategyConfigLabels.momentum_period,
               "momentum_period",
               {
                  type: "number",
               },
               parseFloat
            )}
            {renderSimpleStrategyConfigInput(
               config,
               strategyConfigLabels.momentum_threshold,
               "momentum_threshold",
               {
                  type: "number",
               },
               parseFloat
            )}
         </>
      );
   }

   if (
      strategy === Strategy.LinearRegressionMachineLearning &&
      isLinearRegressionMLConfig(config)
   ) {
      return (
         <>
            {renderSimpleStrategyConfigInput(
               config,
               strategyConfigLabels.training_period,
               "training_period",
               {
                  type: "number",
               },
               parseFloat
            )}
            {renderMultiSelectStrategyConfigInput(
               config,
               strategyConfigLabels.features,
               "features",
               machineLearningFeatures
            )}
         </>
      );
   }

   if (
      strategy === Strategy.SupportedVectorRegressionMachineLearning &&
      isSupportedVectorRegressionMLConfig(config)
   ) {
      return (
         <>
            {renderSimpleStrategyConfigInput(
               config,
               strategyConfigLabels.training_period,
               "training_period",
               {
                  type: "number",
               },
               parseFloat
            )}
            {renderMultiSelectStrategyConfigInput(
               config,
               strategyConfigLabels.features,
               "features",
               machineLearningFeatures
            )}
            {renderSimpleStrategyConfigInput(
               config,
               strategyConfigLabels.c,
               "c",
               {
                  type: "number",
                  min: "0.01",
                  max: "1000",
                  step: "0.01",
               },
               parseFloat
            )}
            {renderSimpleStrategyConfigInput(
               config,
               strategyConfigLabels.epsilon,
               "epsilon",
               {
                  type: "number",
                  min: "0.001",
                  max: "0.5",
                  step: "0.01",
               },
               parseFloat
            )}
         </>
      );
   }

   return null;
}

type StrategyConfigInputProps = {
   strategy: Strategy | "";
   onChange: (config: IStrategyConfig) => void;
   value: IStrategyConfig;
};

export default StrategyConfigInput;
function isMeanReversionConfig(
   config: IStrategyConfig
): config is MeanReversionStrategyConfig {
   return (
      typeof (config as MeanReversionStrategyConfig).lookback_period ===
         "number" &&
      typeof (config as MeanReversionStrategyConfig).z_threshold === "number"
   );
}

function isSMACrossoverConfig(
   config: IStrategyConfig
): config is SimpleMovingAverageCrossoverConfig {
   return (
      typeof (config as SimpleMovingAverageCrossoverConfig)
         .longterm_avg_period === "number" &&
      typeof (config as SimpleMovingAverageCrossoverConfig)
         .shortterm_avg_period === "number"
   );
}

function isEMACrossoverConfig(
   config: IStrategyConfig
): config is ExponentialMovingAverageCrossoverConfig {
   return (
      typeof (config as ExponentialMovingAverageCrossoverConfig)
         .longterm_avg_period === "number" &&
      typeof (config as ExponentialMovingAverageCrossoverConfig)
         .shortterm_avg_period === "number"
   );
}

function isMomentumConfig(config: IStrategyConfig): config is MomentumConfig {
   return (
      typeof (config as MomentumConfig).momentum_period === "number" &&
      typeof (config as MomentumConfig).momentum_threshold === "number"
   );
}

function isLinearRegressionMLConfig(
   config: IStrategyConfig
): config is LinearRegressionMachineLearningConfig {
   return (
      typeof (config as LinearRegressionMachineLearningConfig)
         .training_period === "number" &&
      typeof (config as LinearRegressionMachineLearningConfig).features ===
         "object"
   );
}

function isSupportedVectorRegressionMLConfig(
   config: IStrategyConfig
): config is SupportedVectorRegressionMachineLearningConfig {
   return (
      typeof (config as SupportedVectorRegressionMachineLearningConfig)
         .training_period === "number" &&
      typeof (config as SupportedVectorRegressionMachineLearningConfig)
         .features === "object"
   );
}
