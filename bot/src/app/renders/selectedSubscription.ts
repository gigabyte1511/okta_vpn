import { Callback, SubscriptionOption } from "../types";
import { botConfig } from "..";

export function renderSelectedSubscription(value: SubscriptionOption) {
    const keyboardObject = {
        inline_keyboard: [
            [
                {
                    text: "Назад",
                    callback_data: `${Callback.SUBSCRIPTION_LIST}`,
                },
            ],
        ],
    }
    for (const paymentMethod of botConfig.payment){
        keyboardObject.inline_keyboard.unshift(
            [
                {
                    text:paymentMethod.name,
                    callback_data: `${Callback.PAYMENT}/${value}/${paymentMethod.name}`
                }
            ]
        )
    }
    return keyboardObject;
}
