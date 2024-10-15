import { JSONSchema, Model } from "objection";
import User from "./User";

export interface IConfig {
  id: number;
  user?: User[]; // Типизированная связь
}

class VPNConfig extends Model implements IConfig {
  static idColumn: string = "id";
  static tableName: string = "vpn_configs";

  id!: number;
  name!: string;
  config_json!: string;
  valid_until_date!: Date;
  user_id!: number; // Добавляем поле для связи с пользователем

  static jsonSchema: JSONSchema = {
    type: "object",
    required: ["config_json", "user_id"], // Добавляем user_id в обязательные поля
    properties: {
      id: { type: "integer" },
      name: { type: "string" },
      config_json: { type: "string" },
      valid_until_date: { type: "string", format: "date-time" },
      created_at: { type: "string", format: "date-time" },
      user_id: { type: "number" }, // Поле для связи с пользователем
    },
  };

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "vpn_configs.user_id",
        to: "users.id",
      },
    },
  };
}

export default VPNConfig;
