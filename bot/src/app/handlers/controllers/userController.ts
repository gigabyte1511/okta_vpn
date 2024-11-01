import User from "../../models/User";

export async function getUser(userId: number) {
    return await User.query().findById(userId)
}

export async function createUser(userId: number) {
    const user: User = await User.query().insert({id:userId});
    return user;
}

export async function findOrCreateUser(chatId:number){
    let user = await getUser(chatId);
	if (!user) {
		user = await createUser(chatId);
	}
	return user;
}