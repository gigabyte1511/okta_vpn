import { createVpnConfig, getUserVpnConfigByID } from "../controllers/vpnConfigController";
import { findOrCreateUser } from "../controllers/userController";
import { getLastTransactionByParameter,updateTransaction } from "../controllers/transactionController";
import { bot } from "../..";
import fs from 'fs/promises'
import path from 'path';
import { ConfigsAPIResponse } from "../../api";
import logger from "../../logs/logger";

const sendConfigFromBuffer = async(config:ConfigsAPIResponse, chatId:number)=>{
    
    for (const [extension, base64Content] of Object.entries(config.files)) {
        const fileBuffer = Buffer.from(base64Content, 'base64');
        const fileName = `${config.name}.${extension}`;
        const tempFilePath = path.join(__dirname, fileName);
        
        await fs.writeFile(tempFilePath, fileBuffer);
        await bot.sendDocument(chatId, tempFilePath);
        await fs.unlink(tempFilePath);
    }
}

//генерируем и отправляем конфиг пользователю
export async function sendConfigToUserAfterPayment(month:number, chatId:number, userId: number){
    //создаем конфиг с датой валидацией
    const validUntilDate = new Date();
    validUntilDate.setMonth(validUntilDate.getMonth() + month);
    const createConfigResponse = await createVpnConfig(chatId, validUntilDate.toISOString());

    if (createConfigResponse.success === true){
        await bot.sendMessage(chatId, `🎉 <b>Поздравляем с успешным приобретением!</b> 🎉\n\n` + 
        `Перед установкой, пожалуйста, ознакомьтесь с инструкцией 📋. Это поможет вам быстро и без проблем настроить все!`,{parse_mode:"HTML"});
        await sendConfigFromBuffer(createConfigResponse.data.config,chatId);
        
        const orderValue = createConfigResponse.data.config.name.split("-")[1];
        const transactionId = await getLastTransactionByParameter(chatId,"id");
        updateTransaction(transactionId as string,{state:true, orderValue:orderValue});
        logger.logInfo("config created after payment",chatId,["CREATE_CONFIG_SUCCESS"]);
    } else {
        throw new Error(JSON.stringify(createConfigResponse))
    }
}


//отправляем существующий, если есть
export async function sendExistConfigToUser(chatId:number, indexConfigToSend:number){
    await findOrCreateUser(chatId);
    const config = await getUserVpnConfigByID(chatId, Number(indexConfigToSend));

    if (config.success === true) {
        //либо отправляем файл по индексу, либо все конфиги сразу
        // const configToSend = indexConfigToSend !== undefined 
        //     ? new Array(allConfigs.data.files[indexConfigToSend])
        //     : allConfigs.data.files

        await sendConfigFromBuffer(config.data.config,chatId);
        logger.logInfo("send existed config",chatId,["SEND_EXISTED_CONFIG_SUCCESS"]);
    } else {
        bot.sendMessage(chatId, "Запрашиваемая конфигурация не найдена. Если возникли вопросы - обратитесь в поддержку.")
    }
    return config.success;
}

