import { subscriptionPricesMap, SubscriptionOption, Payment } from "../../../types";
import { bot } from "../../..";
import Cryptomus from "../cryptoPayment/cryptomus";
import logger from "../../../logs/logger";
import { generateOrderId } from "./generateOrderId";

export const sendPaymentInvoice = async (
    chatId: number,
    subscriptionValue: SubscriptionOption,
    paymentObject: Payment
) => {
    const subscriptionPrice = subscriptionPricesMap[subscriptionValue];

    if (!paymentObject) {
        console.error(`Метод оплаты не найден`);
        return;
    }

    //если дефолтный метод телеговский
    if (paymentObject.type === "telegram" ){
        bot.sendInvoice(
            chatId,
            `Оплата через ${paymentObject.name}`, //заголовок
            `Получение конфигурации VPN на ${subscriptionValue} месяц(ев)`, //описание
            generateOrderId(subscriptionValue), //полезная нагрузка (payload)
            paymentObject.token, //токен провайдера платежей
            "RUB", //валюта
            [
                { label: `OKTA VPN`, amount: subscriptionPrice }
            ]
        );
    }

    //если крипта
    if (paymentObject.type === "crypto"){
        const cryptomus = new Cryptomus(paymentObject.token);
        const orderId = subscriptionValue;
    
        try {
            const paymentLink = await cryptomus.createPayment(subscriptionPrice+"", orderId, chatId);
            bot.sendMessage(chatId, `Ссылка на оплату: ${paymentLink}`);
        } catch (error) {
            bot.sendMessage(chatId, 'Произошла ошибка при создании платежа.');
        }
    }

    logger.info(`User ${chatId} receive invoice`);
};