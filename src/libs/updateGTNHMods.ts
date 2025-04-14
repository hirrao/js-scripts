import fs from "fs";
import { argv } from "process";
import { confirm, input } from "../utils/input.js";
import { config } from "../data/index.js";
import { Mods } from "../data/Config/ModsConfig.js";
import { Writable } from "stream";
import chalk from "chalk";

const modPath = config.modsConfig.modPath;

export const updateMods = async (mods: Mods[], update = false) => {
  mods.forEach(async (mod) => {
    const oldFileName = `${mod.name}-${mod.version}.jar`;
    const response = await fetch(
      `https://api.github.com/repos/${mod.url}/releases/latest`,
      {
        headers: {
          Authorization: `Bearer ${config.githubUserConfig.token}`,
          "User-Agent": "jsutil by hirrao",
        },
      },
    );
    if (!response.ok) {
      console.error(await response.json());
      console.log("获取失败");
      return -1;
    }
    const data = await response.json();
    const newVersionTag = data.tag_name as string;
    const newVersionName = (() => {
      if (mod.name === "programmablehatches") {
        return newVersionTag.replace("v", "").split("-")[0];
      } else return newVersionTag;
    })();
    if (mod.version === newVersionName) {
      console.log(`${chalk.blue(mod.name)}已经是最新版本`);
      return 1;
    }
    if (update) {
      console.log(`${chalk.blue(mod.name)}存在更新版本${newVersionTag}`);
      return 0;
    }
    console.log(
      `${chalk.blue(mod.name)}的最新版本是${newVersionTag}, 正在尝试更新`,
    );
    const newFileName = `${mod.name}-${newVersionName}.jar`;
    const fileUrl = `https://github.com/${mod.url}/releases/download/${newVersionTag}/${mod.name}-${newVersionName}.jar`;
    const download = await fetch(fileUrl);
    console.log(`正在下载  ${chalk.yellow(fileUrl)}`);
    const nodeStream = Writable.toWeb(fs.createWriteStream(newFileName));
    if (download.body) {
      await download.body.pipeTo(nodeStream);
    } else {
      console.error("Download body is null");
      return -1;
    }
    if (!(await confirm(`使用${newFileName}替换${oldFileName}`))) {
      return 0;
    }
    modPath.forEach((path) => {
      if (fs.existsSync(`${path}/${oldFileName}`)) {
        fs.unlinkSync(`${path}/${oldFileName}`);
      }
      fs.cpSync(newFileName, `${path}/${newFileName}`);
    });
    mod.version = newVersionName;
    fs.unlinkSync(newFileName);
  });
};

const addMods = async () => {
  const name = await input("输入mod名称");
  const version = await input("输入mod版本");
  const url = await input("输入仓库地址, 格式OWNER/REPO");
  config.modsConfig.mods.push({
    name,
    version,
    url,
  });
};

export const checkUpdateMods = async () => {
  if (argv[3]) {
    const arg = argv[3];
    switch (arg) {
      case "add":
        addMods();
        break;
      case "update":
        updateMods(config.modsConfig.mods, true);
        break;
    }
  } else {
    await updateMods(config.modsConfig.mods);
  }
  return 0;
};

export default checkUpdateMods;
