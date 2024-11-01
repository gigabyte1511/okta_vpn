import VPNConfig from "../../models/VPNConfig";

export async function getVpnConfig(id: number) {
    const config = await VPNConfig.query().findOne("user_id",id).orderBy("created_at", "desc") .first();
    return config;
}
export async function createVpnConfig(userId: number, validUntilDate: Date, transactionId:string) {
    console.log("---validUntilDate---", validUntilDate);

    const config: VPNConfig = await VPNConfig.query().insert({
        user_id: userId,
        valid_until_date: validUntilDate.toISOString(),
        config_json: `"Data": "test123"`,
        name: "config",
        transaction_id:transactionId
    });
    return config;
}
