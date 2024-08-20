import axios, { AxiosInstance } from "axios";
import { SimulationResponse } from "../interfaces/simulation-response.interface";
import { SimulationRequest } from "../interfaces/simulation-request.interface";

const apiClient: AxiosInstance = axios.create({
   baseURL: "http://127.0.0.1:8000/",
   headers: {
      "Content-Type": "application/json",
   },
});

const handleError = (error: any): void => {
   console.error(error);
};

export const postSimulation = async (
   request: SimulationRequest
): Promise<SimulationResponse | undefined> => {
   try {
      const response = await apiClient.post<SimulationResponse>(
         "simulator/simulation/",
         request
      );
      return response.data;
   } catch (error) {
      handleError(error);
      return;
   }
};
