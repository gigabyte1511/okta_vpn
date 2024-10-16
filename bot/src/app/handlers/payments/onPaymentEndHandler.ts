import TelegramBot from "node-telegram-bot-api";
import { sendConfigToUser } from "../common/sendConfigToUser";

export function handleOnPaymentEnd(msg: TelegramBot.Message) {
    const successfulPayment = msg.successful_payment;
    const invoicePayload = successfulPayment?.invoice_payload || "";  // Получаем месяц
    console.log(`Оплата по заказу ${invoicePayload} завершена успешно!`);
    sendConfigToUser(invoicePayload, msg)
}