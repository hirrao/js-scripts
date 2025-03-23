import { Mods } from "../data/modsConfig/index.js";
import { updateMods } from "../libs/updateGTNHMods.js";

const mod: Mods[] = [
  {
    name: "TwistSpaceTechnology",
    version: "0.6.14",
    url: "Nxer/Twist-Space-Technology-Mod",
  },
];

export const tests = () => {
  updateMods(mod);
  return 0;
};
