import TelegramBot from "node-telegram-bot-api";
import config from "config";

import { handleOnStart } from "./handlers/onStartHandler";
import { hadleOnMesssage } from "./handlers/onMessageHandler";
import { handleOnCallback } from "./handlers/onCallback";
import { handleOnPaymentStart } from "./handlers/payments/defaultPayment/onPaymentStartHandler";
import { handleOnPaymentEnd } from "./handlers/payments/defaultPayment/onPaymentEndHandler";
import { handleInvalidateConfig} from "./handlers/invalidatorHandler";
import { BotConfig } from "./types";

import { Model } from "objection";
import knex from "knex";
const knexConfig = require("../../knexfile");



export const botConfig: BotConfig = config.get("bot");

export const bot = new TelegramBot(botConfig.token, { polling: true });

//старт сообщения и коллбеки
bot.onText(/\/start/, handleOnStart);
bot.on("message", hadleOnMesssage);
bot.on("callback_query", handleOnCallback);

//платежи интегрированные в тг
bot.on("pre_checkout_query", handleOnPaymentStart);
bot.on("successful_payment", handleOnPaymentEnd);

//бд
const knexInstance = knex(knexConfig.development);
Model.knex(knexInstance);

//инвалидатор конфигов
const timeUntilNextCheckMs = 20000;
setInterval(handleInvalidateConfig,timeUntilNextCheckMs)

console.log("OktaVPN bor started.");
