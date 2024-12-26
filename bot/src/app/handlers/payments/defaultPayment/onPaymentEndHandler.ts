import TelegramBot from "node-telegram-bot-api";
import { sendConfigToUserAfterPayment } from "../../common/vpnConfigSender";
import logger from "../../../logs/logger";

export async function handleOnPaymentEnd(msg: TelegramBot.Message) {
    try{
        const successfulPayment = msg.successful_payment;
        if (successfulPayment){
            //с чека забираем постинфо и месяц
            const invoicePayload = successfulPayment?.invoice_payload;
            const monthFromPayload = JSON.parse(invoicePayload).month;
            const month = Number(monthFromPayload);

            //данные пользователя
            const chatId = msg.chat.id;
            const userId = msg?.from?.id;
            logger.logInfo("payment ended",chatId,["PAYMENT_END_SUCCESS"]);
            sendConfigToUserAfterPayment(month, chatId, userId || 0);
        } else throw new Error(JSON.stringify(msg));
    }
    catch(error){
        logger.logError(error,msg?.from,["PAYMENT_END_ERROR"]);
    }
}