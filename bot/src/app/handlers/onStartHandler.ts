import TelegramBot from "node-telegram-bot-api";
import { NavMessage } from "./onMessageHandler";
import { bot } from "..";
import logger from "../logs/logger";

const adminChatIds = [487768250, 554386866];

export function handleOnStart(msg: TelegramBot.Message) {  
    try{
        const chatId = msg.chat.id;
        const keyboard = {
            reply_markup: {
                keyboard: [
                    [{ text: NavMessage.BUYCONFIG },{ text: NavMessage.USERCONFIGS }],
                    [{ text: NavMessage.SUPPORT }, {text: NavMessage.INSTRUCTION}]
                ],
                resize_keyboard: true,
                one_time_keyboard: false,
            },
        };

        if (adminChatIds.includes(msg.chat.id)){
            keyboard.reply_markup.keyboard.push([{ text: NavMessage.ADMIN}])
        }

        bot.sendMessage(
            chatId,
            `Добро пожаловать в OktaVPN, ${msg.from?.first_name}`, //TO DO handle unnamed users
            keyboard
        );
    } 
    catch(error) {
        logger.logError(error,msg.from,["START_ERROR"]);
    }
}
