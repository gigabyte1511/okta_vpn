import { API } from "../api"
import logger from "../logs/logger";
import { informUsersOfInvalidData } from "./common/invalidateNotifyer";

export const handleInvalidateConfig = async()=>{
    const response = await API.deleteExiredConfigs();
    const informMessage = "Время действия вашей конфигурации истекло!"

    if(response.success){
        const informObjectArray = response.data.configNames.map((el)=>{
            const stringParts = el.split("-");
            return {chatId:stringParts[0],orderValue:stringParts[1]}
        });
        
        informUsersOfInvalidData(informObjectArray, informMessage);
    }else{
        logger.logError(JSON.stringify(response),'',["INVALIDATE_API_ERROR"]);
    }
}