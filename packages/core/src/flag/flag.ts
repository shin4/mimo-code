import { Config } from "effect"

function truthy(key: string) {
  const value = process.env[key]?.toLowerCase()
  return value === "true" || value === "1"
}

export const Flag = {
  OTEL_EXPORTER_OTLP_ENDPOINT: process.env["OTEL_EXPORTER_OTLP_ENDPOINT"],
  OTEL_EXPORTER_OTLP_HEADERS: process.env["OTEL_EXPORTER_OTLP_HEADERS"],

  // Getter (not a captured value) so tests can repoint the MiMo provider at a
  // local TestLLMServer at runtime via process.env.MIMO_BASE_URL.
  get MIMO_BASE_URL() {
    return process.env["MIMO_BASE_URL"]
  },
  MIMO_MODEL: process.env["MIMO_MODEL"],
  MIMO_AUTO_HEAP_SNAPSHOT: truthy("MIMO_AUTO_HEAP_SNAPSHOT"),
  MIMO_GIT_BASH_PATH: process.env["MIMO_GIT_BASH_PATH"],
  get MIMO_CONFIG() {
    return process.env["MIMO_CONFIG"]
  },
  // Getter (not captured at module load) so tests can set it at runtime —
  // config loading reads it per-call when seeding/loading config content.
  get MIMO_CONFIG_CONTENT() {
    return process.env["MIMO_CONFIG_CONTENT"]
  },
  MIMO_DISABLE_AUTOUPDATE: truthy("MIMO_DISABLE_AUTOUPDATE"),
  MIMO_DISABLE_PRUNE: truthy("MIMO_DISABLE_PRUNE"),
  MIMO_DISABLE_AUTOCOMPACT: truthy("MIMO_DISABLE_AUTOCOMPACT"),
  MIMO_FAKE_VCS: process.env["MIMO_FAKE_VCS"],
  MIMO_SERVER_PASSWORD: process.env["MIMO_SERVER_PASSWORD"],
  MIMO_SERVER_USERNAME: process.env["MIMO_SERVER_USERNAME"],
  MIMO_DB: process.env["MIMO_DB"],
  MIMO_WORKSPACE_ID: process.env["MIMO_WORKSPACE_ID"],

  MIMO_EXPERIMENTAL_FILEWATCHER: Config.boolean("MIMO_EXPERIMENTAL_FILEWATCHER").pipe(
    Config.withDefault(false),
  ),
  MIMO_EXPERIMENTAL_DISABLE_FILEWATCHER: Config.boolean("MIMO_EXPERIMENTAL_DISABLE_FILEWATCHER").pipe(
    Config.withDefault(false),
  ),

  get MIMO_DISABLE_PROJECT_CONFIG() {
    return truthy("MIMO_DISABLE_PROJECT_CONFIG")
  },
  get MIMO_CONFIG_DIR() {
    return process.env["MIMO_CONFIG_DIR"]
  },
  get MIMO_PURE() {
    return truthy("MIMO_PURE")
  },
  get MIMO_PERMISSION() {
    return process.env["MIMO_PERMISSION"]
  },
  get MIMO_PLUGIN_META_FILE() {
    return process.env["MIMO_PLUGIN_META_FILE"]
  },
  get MIMO_CLIENT() {
    return process.env["MIMO_CLIENT"] ?? "desktop"
  },
}
