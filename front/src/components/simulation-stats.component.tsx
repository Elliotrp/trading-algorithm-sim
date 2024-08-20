import { SimulationResponse } from "../interfaces/simulation-response.interface";

interface Props {
   simulationResults: SimulationResponse;
}

function SimulationStats({ simulationResults }: Props) {
   if (simulationResults === undefined) {
      return;
   }

   const tradingPercentage = calculatePercentageGainLoss(
      simulationResults.Values.Value
   );
   const stockPercentage = calculatePercentageGainLoss(
      simulationResults.Values.Stock
   );
   const beatMarket = tradingPercentage > stockPercentage;

   return (
      <div className="trading-results">
         <h3
            className={
               beatMarket
                  ? "font-semibold text-green-500"
                  : "font-semibold text-red-500"
            }
         >
            {beatMarket ? "You beat the market by " : "The market beat you by "}
            {(tradingPercentage - stockPercentage).toFixed(2)}%
         </h3>
         <p>Trading strategy: {tradingPercentage.toFixed(2)}%</p>
         <p>Stock: {stockPercentage.toFixed(2)}%</p>
      </div>
   );
}

function calculatePercentageGainLoss(values: number[]): number {
   const initialVal = values[0];
   const finalValue = values[values.length - 1];
   return (100 * (finalValue - initialVal)) / initialVal;
}

export default SimulationStats;
