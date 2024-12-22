import { createVpnConfig, getVpnConfig } from "../controllers/vpnConfigController";
import { findOrCreateUser } from "../controllers/userController";
import { bot } from "../..";
import { getLastTransactionByParameter,updateTransaction } from "../controllers/transactionController";

//генерируем и отправляем конфиг пользователю
export async function sendConfigToUserAfterPayment(month:string, chatId:number, userId: number){
    const configExist = await getVpnConfig(chatId);
    
    if (configExist.success === false){
        //создаем конфиг с датой валидацией
        const validUntilDate = new Date();
        validUntilDate.setMonth(validUntilDate.getMonth() + Number(month));
        const transactionId = await getLastTransactionByParameter(chatId,"id")
        const config = await createVpnConfig(chatId,userId);
        console.log(config);
        bot.sendMessage(chatId,'Успешная оплата, вот конфиг')
        //тут конфиг
        updateTransaction(transactionId as string,{state:true});
    }
}


//отправляем существующий, если есть
export async function sendExistConfigToUser(chatId:number, message: string){
    await findOrCreateUser(chatId);

    const config = await getVpnConfig(chatId);
    if (config.success === true) {
        bot.sendMessage(chatId,message)
        return true;
    } 
    return config.success;
}

