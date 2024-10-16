import { createVpnConfig } from "../controllers/vpnConfigController";
import { generateConfigFile } from "../../utils";
import { getUser,createUser } from "../controllers/userController";
import { bot } from "../..";
import TelegramBot from "node-telegram-bot-api";

//генерируем и отправляем конфиг пользователю
export async function sendConfigToUser(month:string, msg:TelegramBot.Message){
    const userId = msg?.from?.id || 0;

    let user = await getUser(userId);
    if (!user) {
        user = await createUser(userId);
    }

    //создаем конфиг с датой валидацией
    const validUntilDate = new Date();
    validUntilDate.setMonth(validUntilDate.getMonth() + Number(month));

    const config = await createVpnConfig(
        userId,
        validUntilDate
    );

    const configFilePath = await generateConfigFile(config);

    bot.sendDocument(
        msg.chat.id,
        configFilePath,
        {caption:"Оплата прошла успешно. Вот ваша хуета ебучая."},
        {
            filename: "vpn_config.conf",
            contentType: "application/octet-stream", // MIME тип файла
        }
    );
}