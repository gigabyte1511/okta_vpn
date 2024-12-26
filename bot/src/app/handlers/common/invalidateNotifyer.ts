import { bot } from "../.."
import logger from "../../logs/logger";
import { deleteTransaction } from "../controllers/transactionController";
import { InformData } from "../../types";

export const informUsersOfInvalidData = async(informData:InformData[],message:string)=>{
    try{
        for (const data of informData){
            await bot.sendMessage(data.chatId,message);
            await deleteTransaction(data.orderValue);
            logger.logInfo(JSON.stringify(data),data.chatId,["INVALIDATE_SUCCESS"]);
        }
    } catch(error){
        logger.logError(JSON.stringify(error),'',["INVALIDATE_SENDER_ERROR"]);
    }
}