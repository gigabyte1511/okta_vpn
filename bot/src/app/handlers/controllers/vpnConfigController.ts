import { API } from "../../api";

export async function getVpnConfig(chatId: number) {
    const config = await API.getClientConfig({chatId:chatId.toString()});
    return config;
}
export async function createVpnConfig(chatId: number, validUntil: string) {
    const config = await API.createClientConfig({chatId:chatId.toString(), validUntil})
    return config;
}
