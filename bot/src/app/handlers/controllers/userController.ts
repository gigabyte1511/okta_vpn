import User from "../../models/User";

export async function getUser(chatId: number) {
    return await User.query().findById(chatId)
}

export async function createUser(chatId: number) {
    const user: User = await User.query().insert({id:chatId});
    return user;
}

export async function findOrCreateUser(chatId:number){
    let user = await getUser(chatId);
	if (!user) {
		user = await createUser(chatId);
	}
	return user;
}