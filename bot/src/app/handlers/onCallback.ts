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
import { API } from "../api";
import { resendMediaToUsers } from "./common/resendMediaToUsers";
import { handleNavMyConfigsMsg } from "./onMessageHandler";
import { getVpnConfigs } from "./controllers/vpnConfigController";

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

				logger.logInfo("invoice sended",chatId,["INVOICE_SUCCESS"]);
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
						const monthFromTransaction = JSON.parse(transactionValue).month;
						const configExist = await getVpnConfigs(chatId);

						//если транзакция есть/оплата есть, но конфига нет - отправляем новый
						if (configExist.success === false){
							const month = Number(monthFromTransaction);
							await sendConfigToUserAfterPayment(month,chatId,userId);
							logger.logInfo("config created",chatId,["SEND_CONFIG_FROM_STATUS_SUCCESS"]);
						}

						if (configExist.success === true){
							const messageToUser = `✅ <b>Транзакция</b> <i>#${transactionId}</i> успешно завершена. Получите ваши конфигурации по кнопке ниже:`;
							bot.sendMessage(chatId,messageToUser,{ parse_mode: 'HTML' });
							await handleNavMyConfigsMsg(message);
							logger.logInfo("config already exist",chatId,["GET_CONFIG_FROM_STATUS_SUCCESS"]);
						}
					}
					else {
						const messageToUser = `⏳ <b>Транзакция</b> <i>#${transactionId}</i> ожидает завершения. Если возникли вопросы - обратитесь в поддержку, мы с радостью поможем!`;
						bot.sendMessage(chatId,messageToUser,{ parse_mode: 'HTML' });
						logger.logInfo("transaction not completed",chatId,["GET_CONFIG_FROM_STATUS_UNDEFINED"]);
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
				sendExistConfigToUser(chatId, Number(data.split('/')[1].split('-')[1]));
				logger.logInfo("get config by button success",chatId,["GET_CONFIG_MENU_SUCCESS"]);
			}

			//колбек на получение пользователей
			if (data.includes(`${Callback.GET_CLIENTLIST}`)) {
				bot.answerCallbackQuery(callbackQuery.id, {
					show_alert: false,
				});

				const userList = await API.getConfigsList();
				if (userList.success === true){
					let sendMessage = "<b>Список пользователей:</b>\n\n";
					for (const user of userList.data.clients){
						sendMessage+=`<i>- ${user.clientName}: ${user.valid ? "Действующий" : "Просроченный"}</i>\n`;
					}
					bot.sendMessage(chatId,sendMessage,{parse_mode:'HTML'});
				}
			}

			//колбек на получение отправку рассылки
			if (data.includes(`${Callback.CREATE_NEWSLETTER}`)) {
				bot.answerCallbackQuery(callbackQuery.id, {
					show_alert: false,
				});
				const configsList = await API.getConfigsList();

			
				if (configsList.success === true) {
					const userList = Array.from(new Set(
						configsList.data.clients
							.map(client => client.clientName.split('-')[0]) // Убираем суффиксы после "-"
					));
					await resendMediaToUsers(chatId,userList);
				}
			}			
		}
	}
	catch(error){
		logger.logError(error,callbackQuery?.message?.chat,[`${callbackQuery.data}`,"CALLBACK_ERROR"]);
	}
}
