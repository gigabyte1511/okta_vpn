import { bot } from "../..";
import User from "../../models/User";

export async function getUser(id: number) {
  return await User.query().first();
}
export async function createUser(id: number) {
  const user: User = await User.query().insert({
    id,
  });
  return user;
}
