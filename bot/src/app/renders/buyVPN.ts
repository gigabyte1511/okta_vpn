import { Callback } from "../types";

export function renderBuyVPN() {
    return {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Buy VPN",
                        callback_data: `${Callback.SUBSCRIPTION_LIST}`,
                    },
                ],
            ],
        },
    };
}
