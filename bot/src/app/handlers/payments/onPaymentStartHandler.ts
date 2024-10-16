import TelegramBot from "node-telegram-bot-api";
import { bot } from "../..";

export function handleOnPaymentStart(preCheckoutQuery:TelegramBot.PreCheckoutQuery ){
    bot.answerPreCheckoutQuery(preCheckoutQuery.id, true);
    console.log("Pre-checkout query получен:", preCheckoutQuery);
} 