import User from "../../models/User";
import { Message } from "node-telegram-bot-api";

export async function getUser(chatId: number) {
    return await User.query().findById(chatId)
}

export async function createUser(msg: Message) {
    const chatId = msg.chat.id;
    const userId = msg.from?.id || 0;
    const userLink = msg.from?.username ? `https://t.me/${msg.from?.username}` : '';

    const firstName = msg.from?.first_name;
    const lastName = msg.from?.last_name;
    const fullName = [firstName, lastName].filter(Boolean).join(' ');


    const user: User = await User.query().insert({id:chatId,name:fullName,telegramid:userId,telegramlink:userLink});
    return user;
}

export async function getAllUsers() {
    return await User.query();
}

export async function findOrCreateUser(msg: Message){
    let user = await getUser(msg.chat.id);
	if (!user) {
		user = await createUser(msg);
	}
	return user;
}