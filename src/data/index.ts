import path from "path";
import { ModsConfig } from "./Config/ModsConfig.js";
import { BilibiliConfig } from "./Config/BilibiliConfig.js";
import fs from "fs";
import { GithubUserConfig } from "./Config/GithubUserConfig.js";
import { defaultConfig } from "./Config/DefaultConfig.js";
import merge from "lodash.merge";

export interface Config {
  modsConfig: ModsConfig;
  bilibiliConfig: BilibiliConfig;
  githubUserConfig: GithubUserConfig;
}

const configDir = path.join(import.meta.dirname, "../../config");
const filePath = path.join(configDir, "./config.json");

export const createConfig = (): Config => {
  console.log("Creating config file...");
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(path.dirname(configDir));
  }
  fs.writeFileSync(filePath, JSON.stringify(defaultConfig, null, 2), "utf-8");
  return config;
};

export const readConfig = (): Config => {
  if (!fs.existsSync(filePath)) {
    return createConfig();
  }
  const read = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return merge({}, defaultConfig, read);
};

export const saveConfig = (config: Config) => {
  console.log("Saving config file...");
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2), "utf-8");
};

export const config = readConfig();

process.on("exit", () => {
  saveConfig(config);
});
