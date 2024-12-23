import TelegramBot from "node-telegram-bot-api";
import { bot, botConfig } from "..";
import { renderBuyVPN } from "../renders/buyVPN";
import { renderSubscriptionsList } from "../renders/subscriptionList";
import { Callback } from "../types";
import { getVpnConfig } from "./controllers/vpnConfigController";
import { renderUserConfigsList } from "../renders/userConfigsList";

export enum NavMessage {
    SUPPORT = "💬 Поддержка",
    USERCONFIGS = "🛠️ Мои конфигурации",
    BUYCONFIG = "🛒 Купить",
    INSTRUCTION = "🌐 Инструкция"
}

export function hadleOnMesssage(msg: TelegramBot.Message) {
    handleNavMessage(msg)
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
    } else if (text === NavMessage.INSTRUCTION){
        handleInstructionMsg(msg)
    }
}

function handleInstructionMsg(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;

    if (msg.from) {
        const instructionText = "🌐 <b>Инструкция по установке VPN</b>\n\n" +
    "Выберите подходящий способ настройки в зависимости от вашего устройства:\n\n" +
    "1. <b><i>Файл .p12 (для Windows и macOS):</i></b>\n" +
    "   - Скачайте файл конфигурации `.p12`.\n" +
    "   На Windows:\n" +
    "   - Откройте Панель управления → Сеть и Интернет → Центр управления сетями.\n" +
    "   - Настройте новое VPN-соединение, используя импортированный сертификат.\n" +
    "   На macOS:\n" +
    "   - Откройте Keychain Access (Связка ключей) и импортируйте файл `.p12`.\n" +
    "   - Настройте VPN в Системных настройках → Сеть.\n\n" +
    "2. <b><i>Файл .mobileconfig (для iOS и macOS):</i></b>\n" +
    "   - Скачайте файл `.mobileconfig` на устройство.\n" +
    "   - Нажмите на файл, чтобы открыть.\n" +
    "   - Следуйте инструкциям на экране для установки профиля.\n" +
    "   - После установки профиль появится в настройках VPN.\n\n" +
    "3. <b><i>Файл strongSwan (для Android):</i></b>\n" +
    "   - Установите приложение [strongSwan VPN Client](https://play.google.com/store/apps/details?id=org.strongswan.android).\n" +
    "   - Скачайте файл конфигурации.\n" +
    "   - В приложении strongSwan:\n" +
    "   - Нажмите “Импортировать VPN-профиль”.\n" +
    "   - Выберите файл конфигурации.\n" +
    "   - Укажите свои учетные данные, если потребуется.\n" +
    "   - Подключитесь к серверу VPN.\n\n";
        bot.sendMessage(chatId, instructionText,{ parse_mode: 'HTML' });
    }
}

// выбор подписки
function handlBuyConfigMsg(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;

    if (msg.from) {
        const keyboard = {
            reply_markup: renderSubscriptionsList(),
        };
        bot.sendMessage(chatId, "💎 Выберите подписку:", keyboard);
    }
}

//обратиться в поддержку
function handleNavSupportMsg(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    const keyboard = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "💬 Поддержка", url: botConfig.supportURL }
                ],
                [
                    { text: "📋 Узнать статус платежа", callback_data: Callback.GET_PAYMENT_STATUS}
                ]
            ],
        },
    };

    bot.sendMessage(chatId, "Мы здесь, чтобы помочь:", keyboard);
}

//рендер списка сообщений
async function handleNavMyConfigsMsg(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;

    if (msg.from) {
        const vpnConfigs = await getVpnConfig(chatId);
        if (vpnConfigs.success === false) {
            bot.sendMessage(chatId, "У вас нет активных VPN", renderBuyVPN());
            return;
        }
        else {
            bot.sendMessage(
                chatId,
                "Ваш лист конфигураций:",
                renderUserConfigsList([vpnConfigs.data.files])
            );
        }
    }
}
