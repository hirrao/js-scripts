import path from "path";
import { ModsConfig } from "./modsConfig/index.js";
import fs from "fs";

export interface Config {
  modsConfig: ModsConfig;
}

const filePath = path.join(import.meta.dirname, "../../config.json");

export const createConfig = (): Config => {
  const config = {
    modsConfig: {
      modPath: [],
      mods: [],
    },
  };
  console.log("Creating config file...");
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2), "utf-8");
  return config;
};

export const readConfig = (): Config => {
  if (!fs.existsSync(filePath)) {
    return createConfig();
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

export const saveConfig = (config: Config) => {
  console.log("Saving config file...");
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2), "utf-8");
};

export const config = readConfig();
