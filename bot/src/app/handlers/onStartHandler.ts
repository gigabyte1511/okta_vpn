import TelegramBot from "node-telegram-bot-api";
import { NavMessage } from "./onMessageHandler";
import { bot } from "..";
import logger from "../logs/logger";

export function handleOnStart(msg: TelegramBot.Message) {  
    logger.info(`User ${msg.from?.id} started interaction`);
    const chatId = msg.chat.id;
    const keyboard = {
        reply_markup: {
            keyboard: [
                [{ text: NavMessage.BUYCONFIG }],
                [{ text: NavMessage.USERCONFIGS }, { text: NavMessage.SUPPORT }],
            ],
            resize_keyboard: true,
            one_time_keyboard: false,
        },
    };

    bot.sendMessage(
        chatId,
        `Добро пожаловать в OktaVPN, ${msg.from?.first_name}`, //TO DO handle unnamed users
        keyboard
    );
}
