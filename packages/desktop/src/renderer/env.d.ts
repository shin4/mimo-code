import type { ElectronAPI } from "../preload/types"

declare global {
  interface Window {
    api: ElectronAPI
    __MIMO__?: {
      deepLinks?: string[]
    }
  }
}
