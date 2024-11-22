import TelegramBot from "node-telegram-bot-api";
import { sendConfigToUserAfterPayment } from "../../common/vpnConfigSender";
import logger from "../../../logs/logger";

export async function handleOnPaymentEnd(msg: TelegramBot.Message) {
    try{
        const successfulPayment = msg.successful_payment;
        if (successfulPayment){
            const invoicePayload = successfulPayment?.invoice_payload;
            sendConfigToUserAfterPayment(invoicePayload.split('__')[0], msg?.from?.id || 0)
        }
    }
    catch(error){
        logger.logError(error,msg?.from,["paymentEndError"]);
    }
}