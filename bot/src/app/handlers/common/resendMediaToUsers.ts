import { bot } from "../..";
import logger from "../../logs/logger";

export const resendMediaToUsers = async(chatId:number,userList:string[])=>{
    //узнаем тип контента
    await bot.sendMessage(chatId, 'Впишите тип контента, который вы хотите отправить? (фото/видео/гиф)');
    bot.once('message', async (message) => {
        const mediaType = message?.text?.toLowerCase() || "";

        if (!['фото', 'видео', 'гиф'].includes(mediaType)) {
            await bot.sendMessage(chatId, 'Неверный тип. Пожалуйста, выберите из фото, видео или гиф.');
            return;
        }

        //ждем сам файл
        await bot.sendMessage(chatId, `Отправьте файл-${mediaType}:`);
        bot.once('message', async (mediaMessage) => {
            let fileId:string;
            try {
                if (mediaType === 'фото' && mediaMessage.photo) {
                    fileId = mediaMessage.photo[mediaMessage.photo.length - 1].file_id;
                } else if (mediaType === 'видео' && mediaMessage.video) {
                    fileId = mediaMessage.video.file_id;
                } else if (mediaType === 'гиф' && mediaMessage.animation) {
                    fileId = mediaMessage.animation.file_id;
                } else {
                    await bot.sendMessage(chatId, 'Ошибка: файл не распознан.');
                    return;
                }

                //забираем подпись
                await bot.sendMessage(chatId, 'Введите текст для подписи:');
                bot.once('message', async (captionMessage) => {
                    const caption = captionMessage?.text || '';
                
                    if (mediaType === 'фото') {
                        await bot.sendPhoto(chatId, fileId, { caption });
                    } else if (mediaType === 'видео') {
                        await bot.sendVideo(chatId, fileId, { caption });
                    } else if (mediaType === 'гиф') {
                        await bot.sendAnimation(chatId, fileId, { caption });
                    }
                
                    //отсылаем превью
                    await bot.sendMessage(chatId, 'Так будет выглядеть ваше сообщение. Отправить его всем? (да/нет)');
                    bot.once('message', async (confirmationMessage) => {
                        const confirmation = confirmationMessage?.text?.toLowerCase();
                
                        if (confirmation === 'да') {
                            for (const user of userList) {
                                try{
                                    if (mediaType === 'фото') {
                                        await bot.sendPhoto(user, fileId as string, { caption });
                                    } else if (mediaType === 'видео') {
                                        await bot.sendVideo(user, fileId, { caption });
                                    } else if (mediaType === 'гиф') {
                                        await bot.sendAnimation(user, fileId, { caption });
                                    }
                                } catch(error){
                                    logger.logError(JSON.stringify(error),user,["NEWSLETTER_SEND_ERROR"])
                                }
                            }
                            await bot.sendMessage(chatId, 'Сообщение успешно отправлено всем пользователям.');
                        } else {
                            await bot.sendMessage(chatId, 'Рассылка отменена.');
                        }
                    });
                });								
            } catch (error) {
                logger.logError(JSON.stringify(error),chatId,["NEWSLETTER_COMMON_ERROR"]);
                await bot.sendMessage(chatId, 'Что-то пошло не так. Попробуйте ещё раз.');
            }
        });
    });
}