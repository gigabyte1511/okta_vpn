import { Callback } from "../types";

export function renderAdminPanel() {
    return {
        inline_keyboard: [
            [
                {
                    text: "Создать рассылку",
                    callback_data: `${Callback.CREATE_NEWSLETTER}`,
                },
            ],
            [
                {
                    text: "Получить список пользователей",
                    callback_data: `${Callback.GET_CLIENTLIST}`,
                },
            ]
        ],        
    };
}