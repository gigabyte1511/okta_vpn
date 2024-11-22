import { API } from "../../api";

export async function getVpnConfig(userId: number) {
    const config = await API.getClientConfig({clientId:userId.toString()});
    return config;
}
export async function createVpnConfig(userId: number) {
    const config = await API.createClientConfig({clientId:userId.toString()})
    return config;
}
