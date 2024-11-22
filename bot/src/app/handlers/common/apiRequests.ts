import logger from "../../logs/logger";
const apiLink = "http://api_server:9001";

const configEndpoints = {
    getConfig: `${apiLink}/config/get`,
    createConfig: `${apiLink}/config/create`,
    deleteConfig: `${apiLink}/config/delete`,
    listClients: `${apiLink}/config`,
}

async function makeRequest(url: string, method: string, body?: object) {
    try{
        const options: RequestInit = {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: body ? JSON.stringify(body) : undefined,
        };

        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Ошибка запроса: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    }
    catch(error){
        logger.logError(error,{},[`${url}`,`${JSON.stringify(body)}`,"requestApiError"]);
    }
}

export const api = {
    getConfig: async (clientId: string) => {
        return makeRequest(configEndpoints.getConfig, "POST", { clientId });
    },
    
    createConfig: async (clientId: string) => {
        return makeRequest(configEndpoints.createConfig, "POST", { clientId });
    },
    
    deleteConfig: async (clientId: string) => {
        return makeRequest(configEndpoints.deleteConfig, "POST", { clientId });
    },
    
    listClients: async (clientId: string) => {
        return makeRequest(configEndpoints.listClients, "POST",{ clientId });
    },
};