import { api } from "../common/apiRequests";

export async function getVpnConfig(id: number) {
    const config = await api.getConfig(id.toString());
    return config;
}
export async function createVpnConfig(userId: number) {
    const config = await api.createConfig(userId.toString());
    return config;
}
