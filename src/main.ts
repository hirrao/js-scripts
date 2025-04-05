import { argv } from "process";
import openDictionary from "./libs/openDictionary.js";
import updateGTNHMods from "./libs/updateGTNHMods.js";
import { input } from "./utils/input.js";
import { tests } from "./tests/tests.js";

const funName = new Map<string, () => number | Promise<number>>([
  ["tests", tests],
  ["open", openDictionary],
  ["gtnh", updateGTNHMods],
]);

const exec = async (fun: string) => {
  const name =
    funName.get(fun) ??
    (() => {
      console.error("No such function.");
      return 0;
    });
  await name();
};

if (argv.length > 2) {
  await exec(argv[2]);
} else {
  await exec(await input("Enter the function name: "));
}
