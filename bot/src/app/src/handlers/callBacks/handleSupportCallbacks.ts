import TelegramBot from "node-telegram-bot-api";
import { NavMessage } from "../onMessageHandler";
import { bot, botConfig } from "../../..";

export enum SupportCallback {
  GET = "get",
}
enum SubscriptionOption {
  MONTH_1 = "$1$",
  MONTH_2 = "$2$",
  MONTH_6 = "$6$",
  MONTH_12 = "$12$",
}
const PAY = "pay";

export function handleSupportCallbacks(
  callbackQueryID: string,
  data: string,
  message: TelegramBot.Message
) {
  const chatId = message.chat.id;
  const messageId = message.message_id;
  `${NavMessage.SUPPORT}_${SupportCallback.GET}`;
  if (data === `${NavMessage.SUPPORT}_${SupportCallback.GET}`) {
    bot.answerCallbackQuery(callbackQueryID, {
      //   text: "Info has been sent!",
      show_alert: false,
    });

    bot.editMessageText("Getting support", {
      chat_id: chatId,
      message_id: messageId,
    });
  }
}
