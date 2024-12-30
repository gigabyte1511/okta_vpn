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

const chatIds = [
    122150105, 125224913, 1325895547, 1454367205,
    1929767513, 487768250, 554386866, 581384480, 855749782
  ];
  
  async function processChats(chatIds:number[]) {
    for (const chatId of chatIds) {
      try {
        // Получаем данные о чате
        const chat = await bot.getChat(chatId);
  
        // Извлекаем данные
        const userId = chat.id || 0; // ID пользователя/чата
        const userLink = chat.username ? `https://t.me/${chat.username}` : ''; // Ссылка на профиль
        const fullName = [chat.first_name, chat.last_name].filter(Boolean).join(' '); // Полное имя
  
        // Добавляем/обновляем данные в БД
        await knex("users")
          .insert({
            id: chatId,
            name: fullName,
            telegramid: userId,
            telegramlink: userLink,
          })
          .onConflict("id") // Если запись с таким ID уже существует
          .merge(); // Обновляем поля, если запись найдена
  
        console.log(`Chat ${chatId} processed successfully.`);
      } catch (err) {
        console.error(`Error processing chat ${chatId}:`, err.message);
      }
    }
  }
  
  // Запуск обработки
  processChats(chatIds);

console.log("OktaVPN bor started.");
