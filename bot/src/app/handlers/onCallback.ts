import TelegramBot from "node-telegram-bot-api";
import { Callback, SubscriptionOption } from "../types";
import { bot, botConfig } from "..";
import { renderSubscriptionsList } from "../renders/subscriptionList";
import { renderSelectedSubscription } from "../renders/selectedSubscription";
import { createUser, getUser } from "./controllers/userController";
import {
  createVpnConfig,
  getVpnConfig,
} from "./controllers/vpnConfigController";
import { generateConfigFile } from "../utils";

export async function handleOnCallback(
  callbackQuery: TelegramBot.CallbackQuery
) {
  const data = callbackQuery.data;
  const message = callbackQuery.message;
  if (data && message && callbackQuery.from) {
    const chatId = message.chat.id;
    const messageId = message.message_id;

    if (data === `${Callback.SUBSCRIPTION_LIST}`) {
      bot.answerCallbackQuery(callbackQuery.id, {
        //   text: "Info has been sent!",
        show_alert: false,
      });

      bot.editMessageText("Select subscription:", {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: renderSubscriptionsList(),
      });
    }
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
        `Selected ${value} month subscription. Prepare to pay`,
        {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: renderSelectedSubscription(value),
        }
      );
    }
    if (data.includes(`${Callback.PAYMENT}`)) {
      bot.answerCallbackQuery(callbackQuery.id, {
        show_alert: false,
      });

      const [_callback, value] = data.split("/") as [
        string,
        SubscriptionOption
      ];

      let user = await getUser(callbackQuery.from.id);
      if (!user) {
        user = await createUser(callbackQuery.from.id);
      }
      // const validUntilDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      console.log("---value---", value);

      console.log("---Number(value)---", Number(value));

      const validUntilDate = new Date();
      validUntilDate.setMonth(validUntilDate.getMonth() + Number(value));

      const config = await createVpnConfig(
        callbackQuery.from?.id,
        validUntilDate
      );

      const configFilePath = await generateConfigFile(config);

      bot.answerCallbackQuery(callbackQuery.id, {
        show_alert: false,
      });

      bot.editMessageText(
        `Payment has been recieved! Your new VPN config will be available until ${validUntilDate}`
      );
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
