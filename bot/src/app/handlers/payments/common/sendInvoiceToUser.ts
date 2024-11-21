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
    try{
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
        
            const paymentLink = await cryptomus.createPayment(subscriptionPrice+"", orderId, chatId);
            bot.sendMessage(chatId, `Ссылка на оплату: ${paymentLink}`);
        }
    }
    catch(error){
        const err = error as Error;
        logger.error(JSON.stringify({
            message:err.message,
            userId:chatId,
            timestamp:new Date().toISOString().slice(0, 19),
            tags:["sendInvoiceError"]
        }))
        bot.sendMessage(chatId, 'Произошла ошибка при создании платежа.');
    }
};