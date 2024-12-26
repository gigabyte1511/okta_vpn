import axios, { AxiosResponse } from 'axios'
import config from "config";
import { ApiConfig } from '../types';

export const apiConfig: ApiConfig = config.get("api");


const axiosInstance = axios.create({
    baseURL: apiConfig.baseURL,
})

const methods = {
    POST: axiosInstance.post,
}

export class API {
    static async performApiRequest<T>(
      method: string,
      path: string,
      data?: any,
      config?: any,
    ): Promise<{ success: true; data: T } | { success: false; message: string }> {
        const methodFn = methods[method]
        if (!methodFn) {
          throw new Error(`Unknown method: ${method}`)
        }
        try {
          const response: AxiosResponse<T> = await methodFn(path, data, config)
          return { success: true, data: response.data };
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data) {
                console.error("Axios error:", error.response.data);
                return {
                    success: false,
                    message: error.response.data.details || "An error occurred",
                };
            }

            console.error(`Unexpected Error: ${(error as Error).message}`);
            return {
                success: false,
                message: "Unexpected error occurred",
            };
        }
    }
    static async getConfigsList() {
        const result = await API.performApiRequest<{ message: string, clients: {clientName: string, valid: boolean}[] }>(
            'POST',
            `/config/list`,)
            return result
    }
    static async getClientConfig(params:{chatId: string}) {
            const result = await API.performApiRequest<{message: string, configs: {name: string, files:{ mobileconfig: string, sswan: string, p12: string}}[] }>(
                'POST',
                `/config/get`,
                params,        )
                return result
    } 
    static async createClientConfig(params:{chatId: string, validUntil:string}) {
        const result = await API.performApiRequest<{message: string, config: {name: string, files:{ mobileconfig: string, sswan: string, p12: string}} }>(
          'POST',
          `/config/create`,
          params,          )
          return result
    } 
    static async revokeAndDeleteClient(params:{chatId: string}) {
        const result = await API.performApiRequest<{ message: string }>(
          'POST',
          `/config/delete`, 
          params,         )
          return result
    }
    static async deleteExiredConfigs() {
        const result = await API.performApiRequest<{ message: string, configNames: string[] }>(
          'POST',
          `/config/expired/delete` )
          return result
    }
}