import VPNConfig from "../../models/VPNConfig";

export async function getVpnConfig(id: number) {
    return await VPNConfig.query().first();
}
export async function createVpnConfig(userId: number, validUntilDate: Date) {
    console.log("---validUntilDate---", validUntilDate);

    const config: VPNConfig = await VPNConfig.query().insert({
        user_id: userId,
        valid_until_date: validUntilDate.toISOString(),
        config_json: `"Data": "test123"`,
        name: "config",
    });
    return config;
}
