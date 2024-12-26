import { ConfigsAPIResponse } from "../api";
import { Callback } from "../types";

export function renderUserConfigsList(configs: ConfigsAPIResponse[]) {
    const renderedConfigs = configs.map((config) => {
        return [
            {
                text: `🌐 Config #${config.name}`,
                callback_data: `${Callback.GET_CONFIG}/${config.name}`,
            },
        ];
    });
    return {
        reply_markup: {
            inline_keyboard: renderedConfigs,
        },
    };
}
