import { createVpnConfig, getVpnConfig } from "../controllers/vpnConfigController";
import { generateConfigFile } from "../../utils";
import { findOrCreateUser } from "../controllers/userController";
import { bot } from "../..";
import { getLastTransactionByParameter,updateTransaction } from "../controllers/transactionController";

//генерируем и отправляем конфиг пользователю
export async function sendConfigToUserAfterPayment(month:string, chatId:number){
    const configExist = await getVpnConfig(chatId);
    
    if (configExist === false){
        //создаем конфиг с датой валидацией
        const validUntilDate = new Date();
        validUntilDate.setMonth(validUntilDate.getMonth() + Number(month));
        const transactionId = await getLastTransactionByParameter(chatId,"id")
        const config = await createVpnConfig(chatId);


        const configFilePath = await generateConfigFile(config);

        bot.sendDocument(
            chatId,
            configFilePath,
            {caption: "Оплата заверешена! Конфиг и настройка..."},
            {
                filename: "vpn_config.conf",
                contentType: "application/octet-stream", // MIME тип файла
            }
        );
        updateTransaction(transactionId as string,{state:true});
    }
}


//отправляем существующий, если есть
export async function sendExistConfigToUser(chatId:number, message: string){
    await findOrCreateUser(chatId);

    const config = await getVpnConfig(chatId);
    if (config) {
        //const configFilePath = await generateConfigFile(config);
        bot.sendMessage(chatId,message)
        return true;
    } 
    else {
        return false;
    }
}

