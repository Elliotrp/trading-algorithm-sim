import { SimulationRequest } from "./simulation-request.interface";
import { SimulationResponse } from "./simulation-response.interface";

export interface ISimulationResults
   extends SimulationResponse,
      SimulationRequest {}
