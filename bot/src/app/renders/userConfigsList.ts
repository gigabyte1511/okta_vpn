import { Callback } from "../types";
import { NavMessage } from "../handlers/onMessageHandler";
import VPNConfig from "../models/VPNConfig";

export function renderUserConfigsList(configs: VPNConfig[]) {
  const renderedConfigs = configs.map((config) => {
    return [
      {
        text: `${config.name} - active until ${config.valid_until_date}`,
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
