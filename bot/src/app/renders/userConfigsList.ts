import { Callback } from "../types";

export function renderUserConfigsList(configs: [Record<string, string>]) {
    const renderedConfigs = configs.map((config) => {
        return [
            {
                text: `🌐 Config #${configs.indexOf(config) + 1}`,
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
