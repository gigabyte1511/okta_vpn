import TelegramBot from "node-telegram-bot-api";
import { bot } from "../../..";
import { createTransaction } from "../../controllers/transactionController";
import logger from "../../../logs/logger";

export function handleOnPaymentStart(preCheckoutQuery:TelegramBot.PreCheckoutQuery ){
    try{
        bot.answerPreCheckoutQuery(preCheckoutQuery.id, true)
        .then(()=>{
            createTransaction(preCheckoutQuery.id, preCheckoutQuery.from.id, preCheckoutQuery.total_amount, "telegram", preCheckoutQuery.invoice_payload);
            preCheckoutQuery.invoice_payload = preCheckoutQuery.id;
        })
    }
    catch(error){
        logger.logError(error,preCheckoutQuery.from,["paymentStartError"]);
    }
} 