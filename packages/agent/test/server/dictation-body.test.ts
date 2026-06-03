import { describe, expect, test } from "bun:test"
import {
  buildDictationBody,
  DICTATION_MODEL,
  DICTATION_SYSTEM_PROMPT,
} from "@/server/routes/instance/httpapi/handlers/dictation-body"
import type { DictationRequest } from "@/server/routes/instance/httpapi/groups/dictation"

const ok = (r: ReturnType<typeof buildDictationBody>) => {
  if (!r.ok) throw new Error(`expected ok, got error: ${r.message}`)
  return r
}

type Msg = {
  role: "system" | "user"
  content: string | Array<{ type: string; text?: string; input_audio?: { data?: string } }>
}

const messages = (r: ReturnType<typeof buildDictationBody>) => (ok(r).body as { messages: Msg[] }).messages
const requestBody = (r: ReturnType<typeof buildDictationBody>) =>
  ok(r).body as {
    model: string
    messages: Msg[]
    temperature: number
    max_tokens: number
    stream: false
    thinking?: { type: string }
    reasoning_effort?: unknown
  }

describe("buildDictationBody", () => {
  const sampleRate = 16_000
  const wav = wavDataUrl(speechLike(2.1, sampleRate), sampleRate)

  test("keeps the system prompt stable and puts dynamic context in user content", () => {
    const body = buildDictationBody({
      audio: { dataUrl: wav, mime: "audio/wav", durationSeconds: 8 },
      context: {
        draft: "fix cache metrics",
        items: ["file: packages/app/src/components/prompt-input.tsx"],
        recentMessages: [{ role: "assistant", text: "We were discussing cached token accounting." }],
      },
    } as DictationRequest)

    const msgs = messages(body)
    expect(msgs[0]).toEqual({ role: "system", content: DICTATION_SYSTEM_PROMPT })
    expect(msgs[0].content).not.toContain("fix cache metrics")
    expect(JSON.stringify(msgs[1])).toContain("fix cache metrics")
    expect((ok(body).body as { model: string }).model).toBe(DICTATION_MODEL)
  })

  test("disables MiMo thinking for short-form dictation requests", () => {
    const body = requestBody(buildDictationBody({ audio: { dataUrl: wav, mime: "audio/wav" } } as DictationRequest))

    expect(body.model).toBe(DICTATION_MODEL)
    expect(body.thinking).toEqual({ type: "disabled" })
    expect("reasoning_effort" in body).toBe(false)
    expect(body.temperature).toBe(0)
    expect(body.max_tokens).toBe(1024)
    expect(body.stream).toBe(false)
  })

  test("keeps dictation prompt focused on actual spoken transcription", () => {
    const body = requestBody(
      buildDictationBody({
        audio: { dataUrl: wav, mime: "audio/wav" },
        context: {
          draft: "继续修复",
          items: ["file: packages/agent/src/server/routes/instance/httpapi/handlers/dictation-body.ts"],
          recentMessages: [{ role: "user", text: "不要把上下文当成要回答的问题。" }],
        },
      } as DictationRequest),
    )
    const user = body.messages[1]
    if (!Array.isArray(user.content)) throw new Error("expected user content parts")
    const text = user.content.find((part) => part.type === "text")?.text ?? ""

    expect(DICTATION_SYSTEM_PROMPT).toContain("only the words that were actually spoken")
    expect(DICTATION_SYSTEM_PROMPT).toContain("Do not answer")
    expect(DICTATION_SYSTEM_PROMPT).toContain("Do not infer missing speech from context")
    expect(DICTATION_SYSTEM_PROMPT).toContain("Output only the final transcript text")
    expect(text).toContain("Context hints")
    expect(text).toContain("Current draft hint: 继续修复")
    expect(text).toContain("Explicit context hints:")
    expect(text).toContain("Recent text hints:")
    expect(text).not.toContain("Task: transcribe the following audio clip into text.")
  })

  test("sends wav data URL as MiMo input_audio", () => {
    const user = messages(buildDictationBody({ audio: { dataUrl: wav, mime: "audio/wav" } } as DictationRequest))[1]
    expect(user.role).toBe("user")
    expect(user.content).toContainEqual({ type: "input_audio", input_audio: { data: wav } })
  })

  test("rejects empty, non-wav, too-long, and oversized audio", () => {
    expect(buildDictationBody({ audio: { dataUrl: "", mime: "audio/wav" } } as DictationRequest).ok).toBe(false)
    expect(buildDictationBody({ audio: { dataUrl: "data:audio/webm;base64,AAAA", mime: "audio/webm" } } as DictationRequest).ok).toBe(false)
    expect(
      buildDictationBody({ audio: { dataUrl: wav, mime: "audio/wav", durationSeconds: 61 } } as DictationRequest).ok,
    ).toBe(false)
    expect(
      buildDictationBody({
        audio: { dataUrl: `data:audio/wav;base64,${"A".repeat(67_000_000)}`, mime: "audio/wav" },
      } as DictationRequest).ok,
    ).toBe(false)
  })

  test("rejects short and silent wav audio before calling MiMo", () => {
    const short = buildDictationBody({
      audio: { dataUrl: wavDataUrl(tone(0.3, 0.04, sampleRate), sampleRate), mime: "audio/wav" },
    } as DictationRequest)
    const silence = buildDictationBody({
      audio: { dataUrl: wavDataUrl(new Float32Array(sampleRate * 2), sampleRate), mime: "audio/wav" },
    } as DictationRequest)

    expect(short.ok).toBe(false)
    expect(short.ok ? "" : short.message).toContain("too_short")
    expect(silence.ok).toBe(false)
    expect(silence.ok ? "" : silence.message).toContain("no_speech")
  })
})

function tone(seconds: number, amplitude: number, sampleRate: number) {
  const samples = new Float32Array(Math.floor(seconds * sampleRate))
  samples.forEach((_, index) => {
    samples[index] = Math.sin((2 * Math.PI * 220 * index) / sampleRate) * amplitude
  })
  return samples
}

function speechLike(seconds: number, sampleRate: number) {
  const samples = new Float32Array(Math.floor(seconds * sampleRate))
  samples.forEach((_, index) => {
    samples[index] = index < sampleRate * 0.2 ? 0 : Math.sin((2 * Math.PI * 220 * index) / sampleRate) * 0.04
  })
  return samples
}

function wavDataUrl(samples: Float32Array, sampleRate: number) {
  const bytes = new Uint8Array(44 + samples.length * 2)
  const view = new DataView(bytes.buffer)
  writeAscii(view, 0, "RIFF")
  view.setUint32(4, 36 + samples.length * 2, true)
  writeAscii(view, 8, "WAVE")
  writeAscii(view, 12, "fmt ")
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeAscii(view, 36, "data")
  view.setUint32(40, samples.length * 2, true)

  samples.forEach((sample, index) => {
    const clamped = Math.max(-1, Math.min(1, sample))
    view.setInt16(44 + index * 2, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true)
  })

  return `data:audio/wav;base64,${Buffer.from(bytes).toString("base64")}`
}

function writeAscii(view: DataView, offset: number, value: string) {
  Array.from(value).forEach((char, index) => view.setUint8(offset + index, char.charCodeAt(0)))
}
