import { Callback } from "../types";
import VPNConfig from "../models/VPNConfig";

export function renderUserConfigsList(configs: any) {
    const renderedConfigs = [configs].map((config) => {
        return [
            {
                text: `${config.success}`,
                callback_data: `${Callback.GET_CONFIG}/${Math.random()}`,
            },
        ];
    });
    return {
        reply_markup: {
            inline_keyboard: renderedConfigs,
        },
    };
}
