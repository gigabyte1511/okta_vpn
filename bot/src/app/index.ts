import TelegramBot from "node-telegram-bot-api";
import config from "config";
import { handleOnStart } from "./handlers/onStartHandler";
import { hadleOnMesssage } from "./handlers/onMessageHandler";
import { handleOnCallback } from "./handlers/onCallback";
import { Model } from "objection";
import knex from "knex";
const knexConfig = require("../../knexfile");

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
const knexInstance = knex(knexConfig.development);
Model.knex(knexInstance);

console.log("OktaVPN bor started.");
