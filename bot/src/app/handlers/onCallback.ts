import TelegramBot from "node-telegram-bot-api";
import { Callback, SubscriptionOption } from "../types";
import { bot, botConfig } from "..";
import { renderSubscriptionsList } from "../renders/subscriptionList";
import { renderSelectedSubscription } from "../renders/selectedSubscription";
import { createUser, getUser } from "./controllers/userController";
import { getVpnConfig } from "./controllers/vpnConfigController";
import { generateConfigFile } from "../utils";

export async function handleOnCallback(callbackQuery: TelegramBot.CallbackQuery) {
	const data = callbackQuery.data;
	const message = callbackQuery.message;

	if (data && message && callbackQuery.from) {
		const chatId = message.chat.id;
		const messageId = message.message_id;

		//если вызов колбека по списку подписки
		if (data === `${Callback.SUBSCRIPTION_LIST}`) {
			bot.answerCallbackQuery(callbackQuery.id, { // эта хуйня нужна, чтобы пользователь понял, что взаимодействие с элементом прошло успешно
				show_alert: false,
			});

			bot.editMessageText("Выберите подписку:", {
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

			const [_callback, value] = data.split("/") as [
				string,
				SubscriptionOption
			];

			bot.sendInvoice(
				chatId,
				`OKTA VPN`,                 // Название товара
				`Получение конфигурации VPN на ${value} месяц(ев)`,        // Описание
				`${value}`,        // Полезная нагрузка (payload), которая будет передана при успешной оплате
				botConfig.paymentURL,            // Токен провайдера платежей
				"RUB",                    // Валюта (например, RUB)
				[                         // Массив цен (в копейках)
					{ label: `OKTA VPN`, amount: 19900 }  // Цена: 5000 копеек = 50 рублей
				]
			);
		}

		//получаем конфиг
		if (data.includes(`${Callback.GET_CONFIG}`)) {
			bot.answerCallbackQuery(callbackQuery.id, {
				show_alert: false,
			});

			const [_callback, configId] = data.split("/") as [string, string];

			let user = await getUser(callbackQuery.from.id);
			if (!user) {
				user = await createUser(callbackQuery.from.id);
			}

			const config = await getVpnConfig(callbackQuery.from?.id);
			if (config) {
				const configFilePath = await generateConfigFile(config);

				bot.answerCallbackQuery(callbackQuery.id, {
					show_alert: false,
				});
				bot.sendDocument(
					chatId,
					configFilePath,
					{},
					{
						filename: "vpn_config.conf",
						contentType: "application/octet-stream", // MIME тип файла
					}
				);
			}
		}
	}
}
