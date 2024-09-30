import TelegramBot from "node-telegram-bot-api";
import { handleOnStart } from "./src/handlers/onStartHandler";
import { hadleOnMesssage } from "./src/handlers/onMessageHandler";
import { handleOnCallback } from "./src/handlers/onCallback";
import config from "config";

interface BotConfig {
  token: string;
  paymentURL: string;
  supportURL: string;
}

export const botConfig: BotConfig = config.get("bot");

export const bot = new TelegramBot(botConfig.token, { polling: true });

bot.onText(/\/start/, handleOnStart);
bot.on("message", hadleOnMesssage);
bot.on("callback_query", handleOnCallback);
console.log("OktaVPN bor started.");
