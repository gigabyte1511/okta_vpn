import { Callback } from "../types";
import VPNConfig from "../models/VPNConfig";

export function renderUserConfigsList(configs: VPNConfig[]) {
    const renderedConfigs = configs.map((config) => {
        return [
            {
                text: `${config.name} - действителен до ${config.valid_until_date}`,
                callback_data: `${Callback.GET_CONFIG}/${config.id}`,
            },
        ];
    });
    return {
        reply_markup: {
            inline_keyboard: renderedConfigs,
        },
    };
}
