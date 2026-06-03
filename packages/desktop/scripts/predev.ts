import { $ } from "bun"

await $`bun ./scripts/copy-icons.ts ${process.env.MIMO_CHANNEL ?? "dev"}`

await $`cd ../agent && bun script/build.ts`
