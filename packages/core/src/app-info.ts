export const AppInfo = {
  id: "mimo",
  projectConfigDir: ".mimo",
  legacyProjectConfigDir: ".opencode",
  configBasename: "mimo",
  legacyConfigBasename: "opencode",
  configSchema: "https://platform.xiaomimimo.com/mimo-code/config.json",
  wellKnownConfigPath: ".well-known/mimo",
  configFiles: ["mimo.jsonc", "mimo.json"] as const,
  legacyConfigFiles: ["opencode.jsonc", "opencode.json"] as const,
  desktopStore: {
    settings: "mimo.settings",
    legacySettings: "opencode.settings",
    global: "mimo.global.dat",
    legacyGlobal: "opencode.global.dat",
  },
} as const
