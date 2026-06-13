export const AppInfo = {
  id: "mio",
  projectConfigDir: ".mio",
  legacyProjectConfigDir: ".mimo",
  configBasename: "mio",
  legacyConfigBasename: "mimo",
  configSchema: "https://raw.githubusercontent.com/shin4/mio/main/schema/config.json",
  wellKnownConfigPath: ".well-known/mio",
  configFiles: ["mio.jsonc", "mio.json"] as const,
  legacyConfigFiles: ["mimo.jsonc", "mimo.json"] as const,
  desktopStore: {
    settings: "mio.settings",
    legacySettings: "mimo.settings",
    global: "mio.global.dat",
    legacyGlobal: "mimo.global.dat",
  },
} as const
