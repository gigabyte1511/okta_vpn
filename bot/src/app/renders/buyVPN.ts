import { Callback } from "../types";

export function renderBuyVPN() {
    return {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "⭐ Оформить подписку",
                        callback_data: `${Callback.SUBSCRIPTION_LIST}`,
                    },
                ],
            ],
        },
    };
}
