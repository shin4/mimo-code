import { describe, expect, test } from "bun:test"
import path from "path"

describe("npm bin wrapper", () => {
  test("reports MiMo platform packages when no binary is installed", async () => {
    const proc = Bun.spawn([process.execPath, path.join(import.meta.dir, "../../bin/opencode")], {
      env: {
        PATH: process.env.PATH ?? "",
      },
      stdout: "ignore",
      stderr: "pipe",
    })

    const stderr = await new Response(proc.stderr).text()

    expect(await proc.exited).toBe(1)
    expect(stderr).toInclude("MiMo CLI")
    expect(stderr).toInclude("mimo-")
    expect(stderr).not.toInclude("opencode-")
  })

  test("keeps the Docker image entrypoint aligned with MiMo binary names", async () => {
    const dockerfile = await Bun.file(path.join(import.meta.dir, "../../Dockerfile")).text()

    expect(dockerfile).toContain("dist/mimo-linux-x64-baseline-musl/bin/mimo")
    expect(dockerfile).toContain("dist/mimo-linux-arm64-musl/bin/mimo")
    expect(dockerfile).toContain("/usr/local/bin/mimo")
    expect(dockerfile).toContain("RUN mimo --version")
    expect(dockerfile).toContain('ENTRYPOINT ["mimo"]')
    expect(dockerfile).not.toContain("dist/opencode-")
    expect(dockerfile).not.toContain('ENTRYPOINT ["opencode"]')
  })
})
