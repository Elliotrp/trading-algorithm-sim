export interface SimulationResponse {
   Id: string;
   Values: {
      Date: Date[];
      Stock: number[];
      Signal: number[];
      Value: number[];
   };
   Buys: {
      Date: Date[];
      Bought: string[];
      BuyPrice: number[];
   };
   Sells: {
      Date: Date[];
      Sells: string[];
      SellPrice: number[];
   };
}
