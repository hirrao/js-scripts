import fs from "fs";
import path from "path";
import { config } from "../data/index.js";

//TODO 这个函数远远未完成
const downloadVideo = () => {
  let nums = 0;
  const basePath = config.bilibiliConfig.videoBasePath;
  const entries = fs.readdirSync(basePath);
  entries.forEach((entry) => {
    const dirName = path.join(basePath, entry);
    const stats = fs.statSync(dirName);
    if (!stats.isDirectory()) {
      return;
    }
    const inputFiles = fs
      .readdirSync(dirName)
      .filter((file) => file.endsWith(".m4s"));
    inputFiles.forEach((inputFilePath) => {
      const inputFile = fs.createReadStream(path.join(dirName, inputFilePath), {
        flags: "rb",
        start: 9,
      });
      const outputFilePath = path.join(basePath, entry + `input${nums}`);
      const outputFile = fs.createWriteStream(outputFilePath, { flags: "wb" });
      try {
        inputFile.pipe(outputFile);
      } catch (error) {
        console.error("Error reading file:", error);
        return;
      } finally {
        inputFile.close();
        nums++;
      }
    });
  });
};
