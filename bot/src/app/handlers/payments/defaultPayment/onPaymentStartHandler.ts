import TelegramBot from "node-telegram-bot-api";
import { bot } from "../../..";
import { createTransaction } from "../../controllers/transactionController";
import logger from "../../../logs/logger";

export function handleOnPaymentStart(preCheckoutQuery:TelegramBot.PreCheckoutQuery ){
    try{
        logger.info(`User ${preCheckoutQuery.from.id} started payment telegram`);

        bot.answerPreCheckoutQuery(preCheckoutQuery.id, true)
        .then(()=>{
            createTransaction(preCheckoutQuery.id, preCheckoutQuery.from.id, preCheckoutQuery.total_amount, "telegram", preCheckoutQuery.invoice_payload);
            preCheckoutQuery.invoice_payload = preCheckoutQuery.id;
            console.log("Pre-checkout query записан:", preCheckoutQuery);
        })
    }
    catch(error){
        const err = error as Error;
        logger.error(JSON.stringify({
            message:err.message,
            userId:preCheckoutQuery.from,
            timestamp:new Date().toISOString().slice(0, 19),
            tags:["paymentStartError"]
        }))
    }
} 