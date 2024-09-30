import TelegramBot from "node-telegram-bot-api";
import { bot, botConfig } from "../..";
import { ProfileCallback } from "./callBacks/handleProfileCallbacks";
import { SupportCallback } from "./callBacks/handleSupportCallbacks";

export enum NavMessage {
  PROFILE = "Profile",
  SUPPORT = "Support",
  USERCONFIGS = "My configs",
}

export function hadleOnMesssage(msg: TelegramBot.Message) {
  handleNavMessage(msg);
}

function handleNavMessage(msg: TelegramBot.Message) {
  const text = msg.text || "";
  if (text === NavMessage.PROFILE) {
    handleNavProfileMsg(msg);
  } else if (text === NavMessage.SUPPORT) {
    handleNavSupportMsg(msg);
  } else if (text === NavMessage.USERCONFIGS) {
    handleNavMyConfigsMsg(msg);
  }
}

function handleNavProfileMsg(msg: TelegramBot.Message) {
  const chatId = msg.chat.id;
  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Buy VPN",
            callback_data: `${NavMessage.PROFILE}_${ProfileCallback.SELECT_SUBSCRIPTION}`,
          },
        ],
      ],
    },
  };
  bot.sendMessage(chatId, "You don't have subscription", keyboard);
}
function handleNavSupportMsg(msg: TelegramBot.Message) {
  const chatId = msg.chat.id;
  const keyboard = {
    reply_markup: {
      inline_keyboard: [[{ text: "Get Support", url: botConfig.supportURL }]],
    },
  };

  bot.sendMessage(chatId, "Push here to get support:", keyboard);
}
function handleNavMyConfigsMsg(msg: TelegramBot.Message) {
  const chatId = msg.chat.id;
  const config = true;
  if (config) {
    bot.sendMessage(chatId, "USER CONFIG");
  } else {
    bot.sendMessage(chatId, "There will be your configs list");
  }
}
