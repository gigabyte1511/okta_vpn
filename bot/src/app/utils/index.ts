import VPNConfig from "../models/VPNConfig";
import fs from "fs";
import path from "path";

export async function generateConfigFile(config: VPNConfig) {
  const configFilePath = path.join(__dirname, "vpn_config.conf");
  fs.writeFileSync(configFilePath, config.config_json);
  return configFilePath;
}
