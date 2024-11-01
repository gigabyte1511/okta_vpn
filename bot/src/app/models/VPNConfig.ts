import { JSONSchema, Model, RelationMappings } from "objection";
import User from "./User";
import Transaction from "./Transaction";

export interface IConfig {
    id: number;
    user?: User[];
    transaction?: Transaction;
}

class VPNConfig extends Model implements IConfig {
    static idColumn: string = "id";
    static tableName: string = "vpn_configs";

    id!: number;
    name!: string;
    config_json!: string;
    valid_until_date!: Date;
    user_id!: number;
    transaction_id!: string;

    static jsonSchema: JSONSchema = {
        type: "object",
        required: ["config_json", "user_id", "transaction_id"], 
        properties: {
            id: { type: "integer" },
            name: { type: "string" },
            config_json: { type: "string" },
            valid_until_date: { type: "string", format: "date-time" },
            created_at: { type: "string", format: "date-time" },
            user_id: { type: "number" },
            transaction_id: { type: "string" },
        },
    };

    static relationMappings: RelationMappings = {
        user: {
            relation: Model.BelongsToOneRelation,
            modelClass: User,
            join: {
                from: "vpn_configs.user_id",
                to: "users.id",
            },
        },
        transaction: {
            relation: Model.BelongsToOneRelation,
            modelClass: Transaction,
            join: {
                from: "vpn_configs.transaction_id",
                to: "transactions.id",
            },
        },
    };
}

export default VPNConfig;
