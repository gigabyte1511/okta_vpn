import { Callback, SubscriptionOption } from "../types";

export function renderSubscriptionsList() {
    return {
        inline_keyboard: [
            [
                {
                    text: "1 месяц",
                    callback_data: `${Callback.SUBSCRIPTION_SELECTED}/${SubscriptionOption.MONTH_1}`,
                },
                {
                    text: "2 месяца",
                    callback_data: `${Callback.SUBSCRIPTION_SELECTED}/${SubscriptionOption.MONTH_2}`,
                },
            ],
            [
                {
                    text: "6 месяцев",
                    callback_data: `${Callback.SUBSCRIPTION_SELECTED}/${SubscriptionOption.MONTH_6}`,
                },
                {
                    text: "12 месяцев",
                    callback_data: `${Callback.SUBSCRIPTION_SELECTED}/${SubscriptionOption.MONTH_12}`,
                },
            ],
        ],
    };
}
