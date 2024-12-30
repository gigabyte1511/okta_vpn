import { JSONSchema, Model, RelationMappings } from "objection";
import Transaction from "./Transaction";

class User extends Model {
    static idColumn: string = "id";
    static tableName: string = "users";

    id!: number;
    transactions?: Transaction[];
    name?:string;
    telegramid?: number;
    telegramlink?: string;

    static jsonSchema: JSONSchema = {
        type: "object",
        required: [],
        properties: {
            id: { type: "number" },
            name: {type: "string"},
            telegramid: {type: "number"},
            telegramlink: {type: "string"},
            created_at: { type: "string", format: "date-time" },
        },
    };

    static relationMappings: RelationMappings = {
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
