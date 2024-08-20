import {
   StrategyConfigLabel,
   strategyConfigLabels,
} from "../consts/strategy-config-labels.const";
import { strategyLabels } from "../consts/strategy-labels.const";
import { ISimulationResults } from "../interfaces/simulation-results.interface";
import { IStrategyConfig } from "../interfaces/strategy-config.interface";
import SimulationStats from "./simulation-stats.component";
import StockChart from "./stock-chart.component";

interface Props {
   simulationResults: ISimulationResults | undefined;
}

function SimulationResults({ simulationResults }: Props) {
   const formatArrayWithValues = (data: any) => {
      if (
         Array.isArray(data) &&
         data.every(
            (item) =>
               typeof item === "object" && item !== null && "label" in item
         )
      ) {
         return data.map((item) => item.label).join(", ");
      }
      return JSON.stringify(data, null, 2);
   };

   return (
      <>
         {simulationResults ? (
            <div id="results" className="mt-20">
               <div
                  id="statistics"
                  className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md"
               >
                  <h2 className="font-semibold text-lg">
                     {strategyLabels[simulationResults.strategy]} -{" "}
                     {simulationResults?.symbol}
                  </h2>
                  <div className="mb-2">
                     {Object.keys(simulationResults.strategy_config || {}).map(
                        (key: string) => {
                           const labels: StrategyConfigLabel | undefined =
                              strategyConfigLabels?.[
                                 key as keyof IStrategyConfig
                              ] as StrategyConfigLabel | undefined;

                           if (!labels) {
                              return null;
                           }

                           return (
                              <p key={key} className="text-xs">
                                 {labels.label}:{" "}
                                 {formatArrayWithValues(
                                    simulationResults.strategy_config?.[
                                       key as keyof IStrategyConfig
                                    ]
                                 ) || ""}{" "}
                                 {labels.suffix}
                              </p>
                           );
                        }
                     )}
                     <p className="text-xs mt-1">
                        Start date:{" "}
                        {simulationResults.start_date.toLocaleString()}
                     </p>
                     <p className="text-xs">
                        End date: {simulationResults.end_date.toLocaleString()}
                     </p>
                  </div>
                  <SimulationStats
                     simulationResults={simulationResults}
                  ></SimulationStats>
                  <div
                     id="chart"
                     className="bg-gray-200 dark:bg-gray-600 h-96 mb-6"
                  >
                     <StockChart data={simulationResults}></StockChart>
                  </div>
               </div>
            </div>
         ) : null}
      </>
   );
}

export default SimulationResults;
