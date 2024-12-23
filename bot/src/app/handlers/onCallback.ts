import TelegramBot from "node-telegram-bot-api";
import { Callback, SubscriptionOption } from "../types";
import { bot, botConfig } from "..";
import { renderSubscriptionsList } from "../renders/subscriptionList";
import { renderSelectedSubscription } from "../renders/selectedSubscription";
import { findOrCreateUser } from "./controllers/userController";
import { getLastTransaction } from "./controllers/transactionController";
import { sendPaymentInvoice } from "./payments/common/sendInvoiceToUser";
import { sendConfigToUserAfterPayment, sendExistConfigToUser } from "./common/vpnConfigSender";
import Cryptomus from "./payments/cryptoPayment/cryptomus";
import logger from "../logs/logger";

export async function handleOnCallback(callbackQuery: TelegramBot.CallbackQuery) {
	try{
		const data = callbackQuery.data;
		const message = callbackQuery.message;

		if (data && message && callbackQuery.from && message.from?.id) {
			const chatId = message.chat.id;
			const messageId = message.message_id;
			const userId = message.from.id;

			//если вызов колбека по списку подписки
			if (data === `${Callback.SUBSCRIPTION_LIST}`) {
				bot.answerCallbackQuery(callbackQuery.id, { // эта хуйня нужна, чтобы пользователь понял, что взаимодействие с элементом прошло успешно
					show_alert: false,
				});

				bot.editMessageText("💎 Выберите подписку:", {
					chat_id: chatId,
					message_id: messageId,
					reply_markup: renderSubscriptionsList(),
				});
			}

			//если коллбек по выбору подписки
			if (data.includes(`${Callback.SUBSCRIPTION_SELECTED}`)) {
				bot.answerCallbackQuery(callbackQuery.id, {
					show_alert: false,
				});

				const [_callback, value] = data.split("/") as [
					string,
					SubscriptionOption
				];

				bot.answerCallbackQuery(callbackQuery.id, {
					show_alert: false,
				});

				bot.editMessageText(
					`Выбрана подписка на ${value} месяц(ев). Следуйте инструкциям для оплаты`,
					{
						chat_id: chatId,
						message_id: messageId,
						reply_markup: renderSelectedSubscription(value),
					}
				);
			}

			//отправляем чек на оплату
			if (data.includes(`${Callback.PAYMENT}`)) {
				bot.answerCallbackQuery(callbackQuery.id, {
					show_alert: false,
				});
				await findOrCreateUser(chatId);

				const [_callback, subScriptionValue,paymentMethodName] = data.split("/") as [
					string,
					SubscriptionOption,
					string
				];

				const paymentMethod = botConfig.payment.find(pm => pm.name === paymentMethodName);
				paymentMethod 
					? sendPaymentInvoice(chatId,subScriptionValue,paymentMethod)
					: bot.sendMessage(chatId, `Не найдены доступные методы оплаты. Пожалуйста, свяжитесь с поддержкой.`);
			}

			//получаем статус платежа
			if (data.includes(`${Callback.GET_PAYMENT_STATUS}`)) {
				bot.answerCallbackQuery(callbackQuery.id, {
					show_alert: false,
				});
				await findOrCreateUser(chatId);

				const transaction = await getLastTransaction(chatId);
				if (transaction){
					const { id: transactionId, type: transactionType, orderValue: transactionValue } = transaction;
					let transactionStatus = transaction.state;

					//если крипта, то узнаем по запросу статус платежа
					if (transactionType === "crypto"){
						const paymentData = botConfig.payment.find(payment=>payment.type === "crypto")
						if (paymentData?.token){
							const cryptomus = new Cryptomus(paymentData?.token);
							transactionStatus = await cryptomus.checkPayment(chatId);
						}
					}

					//если успешный статус, то отправляем существующий конфиг
					if (transactionStatus && transactionValue){
						const configExist = await sendExistConfigToUser(chatId);

						//если транзакция есть/оплата есть, но конфига нет - отправляем новый
						if (configExist === false){
							const month = Number((transactionValue as string).split('__')[0]);
							await sendConfigToUserAfterPayment(month,chatId,userId);
						}
					}
					else {
						const messageToUser = `⏳ <b>Транзакция</b> <i>#${transactionId}</i> ожидает завершения. Если возникли вопросы - обратитесь в поддержку, мы с радостью поможем!`;
						bot.sendMessage(chatId,messageToUser,{ parse_mode: 'HTML' });
					}
				} 
				else {
					bot.sendMessage(chatId, "Вы не совершали оплату")
				}
			}

			//колбек на получение конфига
			if (data.includes(`${Callback.GET_CONFIG}`)) {
				bot.answerCallbackQuery(callbackQuery.id, {
					show_alert: false,
				});
				sendExistConfigToUser(chatId);
			}
		}
	}
	catch(error){
		logger.logError(error,callbackQuery?.message?.chat,[`${callbackQuery.data}`,"CALLBACK_ERROR"]);
	}
}
