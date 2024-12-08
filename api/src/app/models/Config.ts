import { JSONSchema, Model } from "objection";

class Config extends Model {
    static idColumn: string = "id";
    static tableName: string = "configs";

    id!: number;
    user_id!: string;
    config_mobileconfig!: Buffer;
    config_p12!: Buffer;
    config_sswan!: Buffer;
    valid_until_date!: string;
    created_at!: string;

    static jsonSchema: JSONSchema = {
        type: "object",
        required: [
            "user_id",
            "config_mobileconfig",
            "config_p12",
            "config_sswan",
            "valid_until_date",
        ],
        properties: {
            id: { type: "integer" },
            user_id: { type: "string" },
            config_mobileconfig: { type: "string", contentEncoding: "base64" },
            config_p12: { type: "string", contentEncoding: "base64" },
            config_sswan: { type: "string", contentEncoding: "base64" },
            valid_until_date: { type: "string", format: "date-time" },
            created_at: { type: "string", format: "date-time" },
        },
    };
}

export default Config;
