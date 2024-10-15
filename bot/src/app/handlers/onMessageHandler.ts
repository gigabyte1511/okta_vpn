import TelegramBot from "node-telegram-bot-api";
import { bot, botConfig } from "..";
import User from "../models/User";
import { renderBuyVPN } from "../renders/buyVPN";
import { renderUserConfigsList } from "../renders/userConfigsList";
import { renderSubscriptionsList } from "../renders/subscriptionList";

export enum NavMessage {
  PROFILE = "Profile",
  SUPPORT = "Support",
  USERCONFIGS = "My configs",
  BUYCONFIG = "Buy config",
}

export function hadleOnMesssage(msg: TelegramBot.Message) {
  handleNavMessage(msg);
  // There will be more messge types
}

function handleNavMessage(msg: TelegramBot.Message) {
  const text = msg.text || "";
  if (text === NavMessage.SUPPORT) {
    handleNavSupportMsg(msg);
  } else if (text === NavMessage.USERCONFIGS) {
    handleNavMyConfigsMsg(msg);
  } else if (text === NavMessage.BUYCONFIG) {
    handlBuyConfigMsg(msg);
  }
}

function handlBuyConfigMsg(msg: TelegramBot.Message) {
  const chatId = msg.chat.id;
  console.log("handleNavMyConfigsMsg");

  if (msg.from) {
    const keyboard = {
      reply_markup: renderSubscriptionsList(),
    };
    bot.sendMessage(chatId, "Select subscription:", keyboard);
  }
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
async function handleNavMyConfigsMsg(msg: TelegramBot.Message) {
  const chatId = msg.chat.id;
  console.log("handleNavMyConfigsMsg");

  if (msg.from) {
    const userWithConfigs = await User.query()
      .findById(msg.from.id)
      .withGraphFetched("vpnConfigs");
    console.log("---msg.from---", msg.from);

    console.log("---userWithConfigs---", userWithConfigs);
    if (!userWithConfigs) {
      bot.sendMessage(chatId, "There will be your configs", renderBuyVPN());
      return;
    }

    const vpnConfigs = userWithConfigs.vpnConfigs;
    if (!vpnConfigs) {
      bot.sendMessage(chatId, "You don't have active configs", renderBuyVPN());
      return;
    }
    bot.sendMessage(
      chatId,
      "Your configs list:",
      renderUserConfigsList(vpnConfigs)
    );
  }
}
