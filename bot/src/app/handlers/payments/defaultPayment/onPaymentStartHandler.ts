import TelegramBot from "node-telegram-bot-api";
import { bot } from "../../..";
import { createTransaction } from "../../controllers/transactionController";
import logger from "../../../logs/logger";

export function handleOnPaymentStart(preCheckoutQuery:TelegramBot.PreCheckoutQuery ){
    try{
        bot.answerPreCheckoutQuery(preCheckoutQuery.id, true)
        .then(async()=>{
            await createTransaction(preCheckoutQuery.id, preCheckoutQuery.from.id, preCheckoutQuery.total_amount, "telegram", preCheckoutQuery.invoice_payload);
            preCheckoutQuery.invoice_payload = preCheckoutQuery.id;
            logger.logInfo("payment started",preCheckoutQuery.from,["PAYMENT_START_SUCCESS"]);
        })
    }
    catch(error){
        logger.logError(error,preCheckoutQuery.from,["PAYMENT_START_ERROR"]);
    }
} 