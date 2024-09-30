import TelegramBot from "node-telegram-bot-api";
import { NavMessage } from "./onMessageHandler";
import { handleProfileCallbacks } from "./callBacks/handleProfileCallbacks";
import { handleUserConfigsCallbacks } from "./callBacks/handleUserConfigsCallbacks";
import { handleSupportCallbacks } from "./callBacks/handleSupportCallbacks";

export function handleOnCallback(callbackQuery: TelegramBot.CallbackQuery) {
  const data = callbackQuery.data;
  const message = callbackQuery.message;
  if (data && message) {
    if (data.includes(NavMessage.PROFILE)) {
      handleProfileCallbacks(callbackQuery.id, data, message);
    }
    if (data.includes(NavMessage.SUPPORT)) {
      handleSupportCallbacks(callbackQuery.id, data, message);
    }
    if (data.includes(NavMessage.USERCONFIGS)) {
      handleUserConfigsCallbacks(callbackQuery.id, data, message);
    }
  }
}
