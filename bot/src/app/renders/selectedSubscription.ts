import { Callback, SubscriptionOption } from "../types";

export function renderSelectedSubscription(value: SubscriptionOption) {
    return {
        inline_keyboard: [
            [
                {
                    text: "Оплатить",
                    callback_data: `${Callback.PAYMENT}/${value}`,
                },
            ],
            [
                {
                    text: "Назад",
                    callback_data: `${Callback.SUBSCRIPTION_LIST}`,
                },
            ],
        ],
    };
}
