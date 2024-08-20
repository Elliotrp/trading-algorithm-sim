import "../index.css";
import SimulationInputForm from "./simulation-input-form.component";
import { useState } from "react";
import { ISimulationResults } from "../interfaces/simulation-results.interface";
import { SimulationRequest } from "../interfaces/simulation-request.interface";
import { postSimulation } from "../services/simulation.service";
import SimulationResults from "./simulation-results.component";

function Simulation() {
   const [simulationResults, setSimulationResults] = useState<
      ISimulationResults[]
   >([]);

   const handleFormSubmit = async (
      simulationRequest: SimulationRequest
   ): Promise<void> => {
      const simulationResponse = await postSimulation(simulationRequest);

      if (!simulationResponse) {
         return;
      }

      const simulationResult = {
         ...simulationResponse,
         ...simulationRequest,
      };

      setSimulationResults([simulationResult, ...simulationResults]);
   };

   return (
      <>
         <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 shadow-md rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">
               Stock Trader 1000
            </h1>
            <SimulationInputForm
               onFormSubmit={handleFormSubmit}
            ></SimulationInputForm>
            {simulationResults.map((simulationResult: ISimulationResults) => {
               return (
                  <SimulationResults
                     key={simulationResult.Id}
                     simulationResults={simulationResult}
                  ></SimulationResults>
               );
            })}
         </div>
      </>
   );
}

export default Simulation;
