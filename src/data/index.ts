import path from "path";
import { ModsConfig } from "./Config/ModsConfig.js";
import { BilibiliConfig } from "./Config/BilibiliConfig.js";
import fs from "fs";
import { GithubUserConfig } from "./Config/GithubUserConfig.js";

export interface Config {
  modsConfig: ModsConfig;
  bilibiliConfig: BilibiliConfig;
  githubUserConfig: GithubUserConfig;
}

const configDir = path.join(import.meta.dirname, "../../config");
const filePath = path.join(configDir, "./config.json");

export const createConfig = (): Config => {
  const config = {
    modsConfig: {
      modPath: [],
      mods: [],
    },
    bilibiliConfig: {
      videoBasePath: "",
    },
    githubUserConfig: {
      token: "",
    },
  };
  console.log("Creating config file...");
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(path.dirname(configDir));
  }
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

process.on("exit", () => {
  saveConfig(config);
});
