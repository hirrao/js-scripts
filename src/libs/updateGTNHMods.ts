import fs from "fs";
import { argv } from "process";
import { confirm, input } from "../utils/input.js";
import { config } from "../data/index.js";
import { Mods } from "../data/modsConfig/index.js";
import { Writable } from "stream";

const modPath = config.modsConfig.modPath;

export const updateMods = async (mods: Mods[]) => {
  mods.forEach(async (mod) => {
    const oldFileName = `${mod.name}-${mod.version}.jar`;
    const response = await fetch(
      `https://api.github.com/repos/${mod.url}/releases/latest`,
    );
    if (!response.ok) {
      console.log("获取失败");
      return -1;
    }
    const data = await response.json();
    const newVersion = data.tag_name;
    if (mod.version === newVersion) {
      console.log(`${mod.name}已经是最新版本`);
      return 1;
    }
    const newFileName = `${mod.name}-${newVersion}.jar`;
    const download = await fetch(
      `https://github.com/${mod.url}/releases/download/${newVersion}/${mod.name}-${newVersion}.jar`,
    );
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
      fs.unlinkSync(`${path}/${oldFileName}`);
      fs.cpSync(newFileName, `${path}/${newFileName}`);
    });
    fs.unlinkSync(newFileName);
    mod.version = newVersion;
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

export const updateGTNHMods = async () => {
  if (argv[3]) {
    addMods();
  } else {
    await updateMods(config.modsConfig.mods);
  }
  return 0;
};
