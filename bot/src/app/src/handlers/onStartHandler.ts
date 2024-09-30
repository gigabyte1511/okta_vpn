import TelegramBot from "node-telegram-bot-api";
import { bot } from "../..";
import { NavMessage } from "./onMessageHandler";

export function handleOnStart(msg: TelegramBot.Message) {
  const chatId = msg.chat.id;

  const keyboard = {
    reply_markup: {
      keyboard: [
        [{ text: NavMessage.PROFILE }, { text: NavMessage.SUPPORT }],
        [{ text: NavMessage.USERCONFIGS }],
      ],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  };

  bot.sendMessage(
    chatId,
    `Welcome to OktaVPN, ${msg.from?.first_name}`, //TO DO handle unnamed users
    keyboard
  );
}
