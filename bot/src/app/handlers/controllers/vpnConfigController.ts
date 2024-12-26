import { API } from "../../api";

export async function getVpnConfigs(chatId: number) {
    const configs = await API.getClientConfigs({chatId:chatId.toString()});
    return configs;
}
export async function createVpnConfig(chatId: number, validUntil: string) {
    const config = await API.createClientConfig({chatId:chatId.toString(), validUntil})
    return config;
}
export async function getUserVpnConfigByID(chatId: number, id: number) {
    const config = await API.getClientConfigByID({chatId:chatId.toString(), id})
    return config;
}
