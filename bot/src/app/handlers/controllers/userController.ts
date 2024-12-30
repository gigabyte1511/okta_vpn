import User from "../../models/User";
import { bot } from "../..";

export async function getUser(chatId: number) {
    return await User.query().findById(chatId)
}

export async function createUser(chatId:number) {
    const chat = await bot.getChat(chatId);
  
    // Извлекаем данные
    const userId = chat.id || 0; // ID пользователя/чата
    const userLink = chat.username ? `https://t.me/${chat.username}` : ''; // Ссылка на профиль
    const fullName = [chat.first_name, chat.last_name].filter(Boolean).join(' '); // Полное имя

    const user: User = await User.query().insert({id:chatId,name:fullName,telegramid:userId,telegramlink:userLink});
    return user;
}

export async function getAllUsers() {
    return await User.query();
}

export async function findOrCreateUser(chatId: number){
    let user = await getUser(chatId);
	if (!user) {
		user = await createUser(chatId);
	}
	return user;
}