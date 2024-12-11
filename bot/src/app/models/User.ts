import { JSONSchema, Model, RelationMappings } from "objection";
import VPNConfig from "./VPNConfig";
import Transaction from "./Transaction";

class User extends Model {
    static idColumn: string = "id";
    static tableName: string = "users";

    id!: number;
    vpnConfigs?: VPNConfig[];
    transactions?: Transaction[];

    static jsonSchema: JSONSchema = {
        type: "object",
        required: [],
        properties: {
            id: { type: "number" },
            created_at: { type: "string", format: "date-time" },
        },
    };

    static relationMappings: RelationMappings = {
        vpnConfigs: {
            relation: Model.HasManyRelation,
            modelClass: VPNConfig,
            join: {
                from: "users.id",
                to: "vpn_configs.chat_id",
            },
        },
        transactions: {
            relation: Model.HasManyRelation,
            modelClass: Transaction,
            join: {
                from: "users.id",
                to: "transactions.chat_id",
            },
        },
    };
}

export default User;
