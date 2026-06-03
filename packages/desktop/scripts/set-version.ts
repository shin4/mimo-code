#!/usr/bin/env bun

// Patches @opencode-ai/desktop's package.json version so electron-builder stamps
// the release version into the built app and the generated updater metadata.
// The agent's in-app version comes from the MIMO_VERSION env var
// (see packages/agent/script/build.ts) — keep the two in sync.
//
// Usage: bun scripts/set-version.ts 1.2.0   (or set MIMO_VERSION)

const raw = process.argv[2] ?? process.env.MIMO_VERSION
if (!raw) throw new Error("version is required (pass as an argument or set MIMO_VERSION)")
const version = raw.replace(/^v/, "")

const file = new URL("../package.json", import.meta.url)
const pkg = await Bun.file(file).json()
pkg.version = version
await Bun.write(file, `${JSON.stringify(pkg, null, 2)}\n`)

console.log(`set ${pkg.name} version to ${version}`)
