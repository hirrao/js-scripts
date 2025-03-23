export interface Mods {
  name: string;
  version: string;
  url: string;
}

export interface ModsConfig {
  modPath: string[];
  mods: Mods[];
}
