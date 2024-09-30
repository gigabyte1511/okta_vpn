import TelegramBot from "node-telegram-bot-api";
import { NavMessage } from "../onMessageHandler";
import { bot, botConfig } from "../../..";

export enum ProfileCallback {
  SELECT_SUBSCRIPTION = "select_subscription",
  BACK = "back",
}
enum SubscriptionOption {
  MONTH_1 = "$1$",
  MONTH_2 = "$2$",
  MONTH_6 = "$6$",
  MONTH_12 = "$12$",
}
const PAY = "pay";

export function handleProfileCallbacks(
  callbackQueryID: string,
  data: string,
  message: TelegramBot.Message
) {
  const chatId = message.chat.id;
  const messageId = message.message_id;
  const subscriptionOptions = Object.values(SubscriptionOption);
  if (
    data === `${NavMessage.PROFILE}_${ProfileCallback.SELECT_SUBSCRIPTION}` ||
    data === `${NavMessage.PROFILE}_${ProfileCallback.BACK}`
  ) {
    bot.answerCallbackQuery(callbackQueryID, {
      //   text: "Info has been sent!",
      show_alert: false,
    });

    bot.editMessageText("Select subscription:", {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: renderSubscriptionOptionsKeyboard(),
    });
  }

  if (
    subscriptionOptions.some(
      (option) =>
        data ===
        `${NavMessage.PROFILE}_${ProfileCallback.SELECT_SUBSCRIPTION}_${option}`
    )
  ) {
    const [_callback, value] = data.split("$");
    bot.answerCallbackQuery(callbackQueryID, {
      //   text: "Info has been sent!",
      show_alert: false,
    });

    bot.editMessageText(
      `Selected ${value} month subscription. Prepare to pay`,
      {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: renderSubscriptionPayKeyboard(),
      }
    );
  }
  if (
    subscriptionOptions.some(
      (option) =>
        data ===
        `${NavMessage.PROFILE}_${ProfileCallback.SELECT_SUBSCRIPTION}_${option}_${PAY}`
    )
  ) {
    bot.answerCallbackQuery(callbackQueryID, {
      //   text: "Info has been sent!",
      show_alert: false,
    });

    bot.sendMessage(chatId, `Done ${data?.split("$")[1]}`);
  }
}

function renderSubscriptionOptionsKeyboard() {
  return {
    inline_keyboard: [
      [
        {
          text: "1 month",
          callback_data: `${NavMessage.PROFILE}_${ProfileCallback.SELECT_SUBSCRIPTION}_${SubscriptionOption.MONTH_1}`,
        },
        {
          text: "2 month",
          callback_data: `${NavMessage.PROFILE}_${ProfileCallback.SELECT_SUBSCRIPTION}_${SubscriptionOption.MONTH_2}`,
        },
      ],
      [
        {
          text: "6 month",
          callback_data: `${NavMessage.PROFILE}_${ProfileCallback.SELECT_SUBSCRIPTION}_${SubscriptionOption.MONTH_6}`,
        },
        {
          text: "12 month",
          callback_data: `${NavMessage.PROFILE}_${ProfileCallback.SELECT_SUBSCRIPTION}_${SubscriptionOption.MONTH_12}`,
        },
      ],
    ],
  };
}

function renderSubscriptionPayKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "Pay", url: botConfig.paymentURL }],
      [
        {
          text: "Back",
          callback_data: `${NavMessage.PROFILE}_${ProfileCallback.BACK}`,
        },
      ],
    ],
  };
}
