import { describe, expect, test } from "bun:test"

const keyframes = (css: string, name: string) => {
  const start = css.indexOf(`@keyframes ${name}`)
  if (start === -1) return ""
  const next = css.indexOf("\n  @keyframes ", start + 1)
  return css.slice(start, next === -1 ? undefined : next)
}

describe("MiMo Pro composer effect styles", () => {
  test("uses a Google-style focus halo instead of a border-beam runner", async () => {
    const css = await Bun.file(new URL("../../index.css", import.meta.url)).text()
    const ring = keyframes(css, "mimo-pro-composer-ring")
    const glow = keyframes(css, "mimo-pro-composer-glow")
    const reducedRing = keyframes(css, "mimo-pro-composer-reduced-ring")

    expect(css).toContain("--mimo-pro-composer-effect-duration: 6525ms")
    expect(css).toContain("#4285f4")
    expect(css).toContain("#ea4335")
    expect(css).toContain("#fbbc04")
    expect(css).toContain("#34a853")
    expect(css).not.toContain("offset-path:")
    expect(css).not.toContain("offset-distance:")
    expect(css).not.toContain("offset-rotate:")
    expect(css).not.toContain("rect(")
    expect(css).not.toContain("mimo-pro-composer-runner")
    expect(ring).toContain("background-position")
    expect(ring).toContain("opacity")
    expect(glow).toContain("background-position")
    expect(glow).toContain("opacity")
    expect(css).toContain("inset: -20px")
    expect(css).toContain("border-radius: 36px")
    expect(css).toContain("filter: blur(18px)")
    expect(css).toContain("-webkit-mask:")
    expect(css).toContain("mask:")
    expect(css).toContain("mimo-pro-composer-ring var(--mimo-pro-composer-effect-duration) cubic-bezier(0.22, 1, 0.36, 1) both")
    expect(css).toContain("mimo-pro-composer-glow var(--mimo-pro-composer-effect-duration) cubic-bezier(0.22, 1, 0.36, 1) both")
    expect(glow).toContain("opacity: 0.5")
    expect(glow).toContain("opacity: 0.16")
    expect(glow).toContain("52%")
    expect(ring).not.toContain("transform:")
    expect(ring).not.toContain("rotate(")
    expect(glow).not.toContain("rotate(")
    expect(reducedRing).toContain("opacity")
    expect(reducedRing).not.toContain("background-position")
  })
})
