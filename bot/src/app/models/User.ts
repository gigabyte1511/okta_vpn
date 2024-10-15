import { JSONSchema, Model, RelationMappings } from "objection";
import VPNConfig from "./VPNConfig";

class User extends Model {
  static idColumn: string = "id";
  static tableName: string = "users";

  id!: number;
  vpnConfigs?: VPNConfig[];

  static jsonSchema: JSONSchema = {
    type: "object",
    required: ["id"],
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
        to: "vpn_configs.user_id",
      },
    },
  };
}

export default User;
