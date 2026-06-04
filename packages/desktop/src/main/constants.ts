import { app } from "electron"

type Channel = "dev" | "beta" | "prod"
const raw = import.meta.env.MIMO_CHANNEL
export const CHANNEL: Channel = raw === "dev" || raw === "beta" || raw === "prod" ? raw : "dev"

export const SETTINGS_STORE = "mimo.settings"
export const DEFAULT_SERVER_URL_KEY = "defaultServerUrl"
export const WSL_ENABLED_KEY = "wslEnabled"
export const PINCH_ZOOM_ENABLED_KEY = "pinchZoomEnabled"

// Honor the documented MIMO_DISABLE_AUTOUPDATE kill switch. Mirrors the truthy
// semantics in packages/core/src/flag/flag.ts ("1"/"true", case-insensitive).
const autoUpdateDisabled = ["1", "true"].includes((process.env.MIMO_DISABLE_AUTOUPDATE ?? "").toLowerCase())
export const UPDATER_ENABLED = app.isPackaged && CHANNEL !== "dev" && !autoUpdateDisabled
