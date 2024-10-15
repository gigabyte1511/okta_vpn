import { Callback, SubscriptionOption } from "../types";
import { NavMessage } from "../handlers/onMessageHandler";
import VPNConfig from "../models/VPNConfig";

export function renderSubscriptionsList() {
  return {
    inline_keyboard: [
      [
        {
          text: "1 month",
          callback_data: `${Callback.SUBSCRIPTION_SELECTED}/${SubscriptionOption.MONTH_1}`,
        },
        {
          text: "2 month",
          callback_data: `${Callback.SUBSCRIPTION_SELECTED}/${SubscriptionOption.MONTH_2}`,
        },
      ],
      [
        {
          text: "6 month",
          callback_data: `${Callback.SUBSCRIPTION_SELECTED}/${SubscriptionOption.MONTH_6}`,
        },
        {
          text: "12 month",
          callback_data: `${Callback.SUBSCRIPTION_SELECTED}/${SubscriptionOption.MONTH_12}`,
        },
      ],
    ],
  };
}
