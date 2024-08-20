import { useState, useEffect } from "react";
import { Strategy } from "../enums/strategy.enum";
import { SimulationRequest } from "../interfaces/simulation-request.interface";
import { IStrategyConfig } from "../interfaces/strategy-config.interface";
import { Option } from "../interfaces/symbol-option.interface";
import StrategyConfigInput from "./strategy-config-input.component";
import { defaultStrategyConfigs } from "../consts/default-strategy-configs.const";
import { symbolOptions } from "../consts/symbol-options.const";
import { strategyLabels } from "../consts/strategy-labels.const";
import { strategyDescriptions } from "../consts/strategy-descriptions.const";

interface Props {
   onFormSubmit: (formModel: SimulationRequest) => Promise<void>;
}

function SimulationInputForm({ onFormSubmit }: Props) {
   const [symbol, setSymbol] = useState("default");
   const [strategy, setStrategy] = useState<Strategy>(Strategy.None);
   const [strategyConfig, setStrategyConfig] = useState<IStrategyConfig>(
      defaultStrategyConfigs.get(strategy) || {}
   );

   const sixMonthsAgo = new Date();
   sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
   const [startDate, setStartDate] = useState(
      sixMonthsAgo.toISOString().slice(0, -1)
   );

   const yesterday = new Date();
   yesterday.setDate(yesterday.getDate() - 1);

   const [endDate, setEndDate] = useState(yesterday.toISOString().slice(0, -1));

   const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);

   const handleSubmit = async () => {
      setSubmitButtonDisabled(true);
      const request: SimulationRequest = {
         symbol: symbol,
         strategy: strategy as Strategy,
         strategy_config: strategyConfig,
         start_date: new Date(startDate),
         end_date: new Date(endDate),
      };
      await onFormSubmit(request);
      setSubmitButtonDisabled(false);
   };

   useEffect(() => {
      if (
         symbol !== "default" &&
         strategy !== Strategy.None &&
         startDate &&
         endDate
      ) {
         setSubmitButtonDisabled(false);
      } else {
         setSubmitButtonDisabled(true);
      }
   }, [symbol, strategy, strategyConfig, startDate, endDate]);

   return (
      <>
         <form id="simulation-form">
            <div className="mb-4">
               <label
                  htmlFor="symbol"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
               >
                  Select Stock
               </label>
               <select
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  id="symbol"
                  name="symbol"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
               >
                  <option value="default" label="Select a symbol" disabled />
                  {symbolOptions.map((option: Option) => {
                     return (
                        <option
                           key={option.value}
                           value={option.value}
                           label={option.label}
                        />
                     );
                  })}
               </select>
            </div>

            <div className="mb-4">
               <div className="flex justify-center items-center space-x-2">
                  <label
                     htmlFor="strategy"
                     className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                  >
                     Select Trading Strategy
                     {strategy !== Strategy.None && (
                        <div className="relative group ml-2">
                           <span className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 cursor-pointer">
                              ?
                              <div className="absolute hidden group-hover:block w-72 p-2 bg-green-50 dark:bg-green-900 border-l-4 border-green-500 text-green-700 dark:text-green-300 rounded-md shadow-md text-sm left-full top-full mt-1 ml-2">
                                 {strategyDescriptions[strategy]}
                              </div>
                           </span>
                        </div>
                     )}
                  </label>
               </div>
               <select
                  value={strategy}
                  onChange={(e) => {
                     setStrategy(e.target.value as Strategy);
                     setStrategyConfig(
                        defaultStrategyConfigs.get(
                           e.target.value as Strategy
                        ) || {}
                     );
                  }}
                  id="strategy"
                  name="strategy"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
               >
                  {Object.values(Strategy).map((key) => {
                     return (
                        <option
                           disabled={key === Strategy.None}
                           key={key}
                           value={key}
                           label={strategyLabels[key]}
                        ></option>
                     );
                  })}
               </select>
            </div>
            <StrategyConfigInput
               strategy={strategy}
               value={strategyConfig}
               onChange={(e) => setStrategyConfig(e)}
            ></StrategyConfigInput>
            <div className="grid grid-cols-2 gap-4 mb-4">
               <div>
                  <label
                     htmlFor="start-date"
                     className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                     Start Date
                  </label>
                  <input
                     type="datetime-local"
                     id="start-date"
                     name="start-date"
                     className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                     value={startDate}
                     onChange={(e) => setStartDate(e.target.value)}
                  />
               </div>
               <div>
                  <label
                     htmlFor="end-date"
                     className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                     End Date
                  </label>
                  <input
                     type="datetime-local"
                     id="end-date"
                     name="end-date"
                     className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                     value={endDate}
                     onChange={(e) => setEndDate(e.target.value)}
                  />
               </div>
            </div>

            <div className="flex justify-center">
               <button
                  type="button"
                  id="run-simulation"
                  onClick={handleSubmit}
                  disabled={submitButtonDisabled}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
               >
                  Run Simulation
               </button>
            </div>
         </form>
      </>
   );
}

export default SimulationInputForm;
