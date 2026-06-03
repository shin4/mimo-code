declare global {
  const MIMO_VERSION: string
  const MIMO_CHANNEL: string
}

export const InstallationVersion = typeof MIMO_VERSION === "string" ? MIMO_VERSION : "local"
export const InstallationChannel = typeof MIMO_CHANNEL === "string" ? MIMO_CHANNEL : "local"
export const InstallationLocal = InstallationChannel === "local"
