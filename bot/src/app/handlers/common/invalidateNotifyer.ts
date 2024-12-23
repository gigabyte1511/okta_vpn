import { bot } from "../.."
import logger from "../../logs/logger";

export const informUsersOfInvalidData = async(chatIDs:string[],message:string)=>{
    try{
        for (const chatId of chatIDs){
            bot.sendMessage(chatId,message);
        }
    } catch(error){
        logger.logError(JSON.stringify(error),'',["INVALIDATE_SENDER_ERROR"]);
    }
}