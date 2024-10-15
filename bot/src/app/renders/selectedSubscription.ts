import { botConfig } from "..";
import { Callback, SubscriptionOption } from "../types";

export function renderSelectedSubscription(value: SubscriptionOption) {
  return {
    inline_keyboard: [
      [
        {
          text: "Pay",
          //   url: botConfig.paymentURL,
          callback_data: `${Callback.PAYMENT}/${value}`,
        },
      ],
      [
        {
          text: "Back",
          callback_data: `${Callback.SUBSCRIPTION_LIST}`,
        },
      ],
    ],
  };
}
