import { createVpnConfig, getVpnConfig } from "../controllers/vpnConfigController";
import { findOrCreateUser } from "../controllers/userController";
import { bot } from "../..";
import { getLastTransactionByParameter,updateTransaction } from "../controllers/transactionController";
import fs from 'fs/promises'
import path from 'path';

const sendConfigFromBuffer = async(files:Object, chatId:number)=>{
    for (const [fileName, base64Content] of Object.entries(files)) {
        const fileBuffer = Buffer.from(base64Content, 'base64');
        const fileString = fileName.replace(/^[^.]+/, 'config');
        const tempFilePath = path.join(__dirname, fileString);
    
        await fs.writeFile(tempFilePath, fileBuffer);
        await bot.sendDocument(chatId, tempFilePath);
        await fs.unlink(tempFilePath);
    }
}

//генерируем и отправляем конфиг пользователю
export async function sendConfigToUserAfterPayment(month:number, chatId:number, userId: number){
    //существующий конфиг отправляем (переделать под массив)
    const getConfigResponse = await getVpnConfig(chatId);
    if (getConfigResponse.success === true){
        await sendConfigFromBuffer(getConfigResponse.data.files, chatId);
        return;
    }

    //создаем конфиг с датой валидацией
    const validUntilDate = new Date();
    validUntilDate.setMonth(validUntilDate.getMonth() + month);
    const transactionId = await getLastTransactionByParameter(chatId,"id");

    const createConfigResponse = await createVpnConfig(chatId, validUntilDate.toISOString());

    if (createConfigResponse.success === true){
        await bot.sendMessage(chatId, `🎉 <b>Поздравляем с успешным приобретением!</b> 🎉\n\n` + 
    `Перед установкой, пожалуйста, ознакомьтесь с инструкцией 📋. Это поможет вам быстро и без проблем настроить все!`)
        await sendConfigFromBuffer(createConfigResponse.data.files,chatId);
        await updateTransaction(transactionId as string,{state:true});
    } else {
        throw new Error(JSON.stringify(createConfigResponse))
    }
}


//отправляем существующий, если есть
export async function sendExistConfigToUser(chatId:number,indexConfigToSend?:number){
    await findOrCreateUser(chatId);

    const allConfigs = await getVpnConfig(chatId);

    if (allConfigs.success === true) {
        //либо отправляем файл по индексу, либо все конфиги сразу
        const configToSend = indexConfigToSend !== undefined 
            ? new Array(allConfigs.data.files[indexConfigToSend])
            : allConfigs.data.files

        await sendConfigFromBuffer(configToSend,chatId);
    } 
    return allConfigs.success;
}

