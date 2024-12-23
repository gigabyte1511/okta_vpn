import { API } from "../api"
import logger from "../logs/logger";
import { informUsersOfInvalidData } from "./common/invalidateNotifyer";

export const handleInvalidateConfig = async()=>{
    const response = await API.deleteExiredConfigs();
    if(response.success){
        informUsersOfInvalidData(response.data.chatIDs, response.data.message);
        console.log(response)
    }else{
        logger.logError(JSON.stringify(response),'',["INVALIDATE_API_ERROR"]);
    }
}