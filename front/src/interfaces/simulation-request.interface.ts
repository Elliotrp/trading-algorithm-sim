import { Strategy } from "../enums/strategy.enum";
import { IStrategyConfig } from "./strategy-config.interface";

export interface SimulationRequest {
   symbol: string;
   start_date: Date;
   end_date: Date;
   strategy: Strategy;
   strategy_config: IStrategyConfig;
}
