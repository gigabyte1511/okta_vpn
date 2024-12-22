import { JSONSchema, Model, RelationMappings } from "objection";
import Transaction from "./Transaction";

class User extends Model {
    static idColumn: string = "id";
    static tableName: string = "users";

    id!: number;
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
