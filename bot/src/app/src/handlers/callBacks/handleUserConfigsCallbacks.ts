import TelegramBot from "node-telegram-bot-api";
import { NavMessage } from "../onMessageHandler";
import { bot, botConfig } from "../../..";

export enum ProfileCallback {
  SELECT_SUBSCRIPTION = "select_subscription",
  BACK = "back",
}
enum SubscriptionOption {
  MONTH_1 = "$1$",
  MONTH_2 = "$2$",
  MONTH_6 = "$6$",
  MONTH_12 = "$12$",
}
const PAY = "pay";

export function handleUserConfigsCallbacks(
  callbackQueryID: string,
  data: string,
  message: TelegramBot.Message
) {
  const chatId = message.chat.id;
  const messageId = message.message_id;
}
