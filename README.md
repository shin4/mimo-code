# MiMo-Code

MiMo-Code is a native desktop coding agent for the MiMo model family. It is
built to make MiMo models first-class participants in the agent runtime rather
than treating them as a generic OpenAI-compatible provider: coding, reasoning,
multimodal understanding, audio dictation, speech synthesis, and other
MiMo-native capabilities are expected to shape both product behavior and runtime
design.

This repository is maintained as an independent project with the current `main`
branch as the initial baseline. MiMo-Code is developed on the OpenCode Desktop V2
route and builds on the OpenCode Harness foundation while adapting request
shaping, model selection, context packaging, and desktop workflows for MiMo.

> **Disclaimer:** MiMo-Code is an independent, community-maintained project. It is
> not an official Xiaomi product and is not affiliated with, sponsored by, or
> endorsed by Xiaomi Inc. It connects to the MiMo model platform purely as a
> third-party client.

## Project Direction

- Use the full MiMo model family natively, including coding, reasoning,
  multimodal, audio, and TTS capabilities.
- Extend the OpenCode Harness into a MiMo-first coding agent instead of shipping
  a provider-only skin over an upstream desktop client.
- Incorporate Reasonix-inspired cost-control ideas: stable prefix cache inputs,
  visible token and cost accounting, lightweight context by default, and model
  selection that matches each task to the cheapest capable MiMo model.
- Keep project state isolated so MiMo-Code can run beside upstream OpenCode
  without mixing local agent configuration.

MiMo-Code uses isolated project configuration by default so it can be installed
next to upstream OpenCode without sharing local project state. Project config
lives in `mimo.json` or `mimo.jsonc`, and project-local agents, commands,
skills, plugins, tools, and plans live under `.mimo/`.

MiMo-Code does not automatically read or write `.opencode/`, `opencode.json`,
`opencode.jsonc`, or `OPENCODE_*` environment variables. To import an existing
OpenCode project by hand, copy `.opencode` to `.mimo` and copy `opencode.json`
or `opencode.jsonc` to `mimo.json` or `mimo.jsonc`.

## Repository Layout

- `packages/agent` - local agent runtime, HTTP API, tools, storage, and MiMo provider wiring.
- `packages/app` - shared Solid UI used by the desktop shell.
- `packages/desktop` - Electron desktop application.
- `packages/core` - shared runtime utilities, schemas, storage helpers, and compatibility services.
- `packages/llm` - schema-first LLM routing package used by the MiMo native runtime.
- `packages/sdk/js` - generated JavaScript SDK.

## Development

Install dependencies from the repository root:

```bash
bun install
```

Run the desktop app:

```bash
bun run dev:desktop
```

Run the shared web app against a local agent server:

```bash
bun run dev:agent
bun run dev:app
```

## Verification

Tests are intentionally not run from the repository root. Run package checks
from package directories:

```bash
cd packages/agent
bun typecheck
```

Common package checks:

```bash
cd packages/app && bun typecheck
cd packages/core && bun typecheck
cd packages/desktop && bun typecheck
cd packages/llm && bun typecheck
```

If API or SDK output changes, regenerate the JavaScript SDK:

```bash
./packages/sdk/js/script/build.ts
```
