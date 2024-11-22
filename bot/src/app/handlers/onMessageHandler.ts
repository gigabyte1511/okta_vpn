import TelegramBot from "node-telegram-bot-api";
import { bot, botConfig } from "..";
import User from "../models/User";
import { renderBuyVPN } from "../renders/buyVPN";
import { renderUserConfigsList } from "../renders/userConfigsList";
import { renderSubscriptionsList } from "../renders/subscriptionList";
import { Callback } from "../types";
import logger from '../logs/logger';
import { getVpnConfig } from "./controllers/vpnConfigController";

export enum NavMessage {
    PROFILE = "Профиль",
    SUPPORT = "Поддержка",
    USERCONFIGS = "Мои конфиги",
    BUYCONFIG = "Купить",
}

export function hadleOnMesssage(msg: TelegramBot.Message) {
    try{
        handleNavMessage(msg);
    }
    catch(error) {
        logger.logError(error,msg.from,["navigationError"]);
    }
    // There will be more messge types
}

//в зависимости от типа сообщения отдаем в рендер определенный набор
function handleNavMessage(msg: TelegramBot.Message) {
    const text = msg.text || "";
    if (text === NavMessage.SUPPORT) {
        handleNavSupportMsg(msg);
    } else if (text === NavMessage.USERCONFIGS) {
        handleNavMyConfigsMsg(msg);
    } else if (text === NavMessage.BUYCONFIG) {
        handlBuyConfigMsg(msg);
    }
}

// выбор подписки
function handlBuyConfigMsg(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;

    if (msg.from) {
        const keyboard = {
            reply_markup: renderSubscriptionsList(),
        };
        bot.sendMessage(chatId, "Выберите подписку:", keyboard);
    }
}

//обратиться в поддержку
function handleNavSupportMsg(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    const keyboard = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "Поддержка", url: botConfig.supportURL }
                ],
                [
                    { text: "Узнать статус платежа", callback_data: Callback.GET_PAYMENT_STATUS}
                ]
            ],
        },
    };

    bot.sendMessage(chatId, "Пишите сюда для помощи:", keyboard);
}

//рендер списка сообщений
async function handleNavMyConfigsMsg(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;

    if (msg.from) {
        const userWithConfigs = await User.query()
            .findById(msg.from.id)
            .withGraphFetched("vpnConfigs");

        if (!userWithConfigs) {
            bot.sendMessage(chatId, "Здесь будут ваши VPN", renderBuyVPN());
            return;
        }

        const vpnConfigs = await getVpnConfig(chatId);
        if (!vpnConfigs) {
            bot.sendMessage(chatId, "У вас нет активных VPN", renderBuyVPN());
            return;
        }
        bot.sendMessage(
            chatId,
            "Ваш лист VPN:",
            renderUserConfigsList(vpnConfigs)
        );
    }
}
