import { JSONSchema, Model, RelationMappings } from "objection";
import User from "./User";

class Transaction extends Model {
    static idColumn: string = "id";
    static tableName: string = "transactions";

    id!: string;
    chat_id!: number;
    amount?: number;
    state?: boolean;
    type?: string;
    orderValue?: string;

    static jsonSchema: JSONSchema = {
        type: "object",
        required: ["chat_id"],
        properties: {
            id: { type: "string" },
            chat_id: { type: "number" },
            amount: { type: "number" },
            created_at: { type: "string", format: "date-time" },
            state: {type: "boolean"},
            type: {type: "string"},
            orderValue: {type: "string"}
        },
    };

    static relationMappings: RelationMappings = {
        user: {
            relation: Model.BelongsToOneRelation,
            modelClass: User,
            join: {
                from: "transactions.chat_id",
                to: "users.id",
            },
        },
    };
}

export default Transaction;