import { describe, expect, test } from "bun:test"
import {
  MIMO_PRO_COMPOSER_EFFECT_MS,
  MIMO_PRO_MODEL_KEY,
  modelEffectKey,
  shouldTriggerMimoProComposerEffect,
} from "./mimo-pro-composer-effect"

describe("MiMo Pro composer effect", () => {
  test("uses the MiMo V2.5 Pro model key and effect duration", () => {
    expect(MIMO_PRO_MODEL_KEY).toBe("mimo:mimo-v2.5-pro")
    expect(MIMO_PRO_COMPOSER_EFFECT_MS).toBe(6_525)
  })

  test("builds a stable model effect key only when provider and model are present", () => {
    expect(modelEffectKey({ provider: { id: "mimo" }, id: "mimo-v2.5-pro" })).toBe(MIMO_PRO_MODEL_KEY)
    expect(modelEffectKey(undefined)).toBeUndefined()
  })

  test("does not trigger on initial load into MiMo V2.5 Pro", () => {
    expect(shouldTriggerMimoProComposerEffect(undefined, MIMO_PRO_MODEL_KEY)).toBe(false)
  })

  test("triggers when switching from MiMo V2.5 to MiMo V2.5 Pro", () => {
    expect(shouldTriggerMimoProComposerEffect("mimo:mimo-v2.5", MIMO_PRO_MODEL_KEY)).toBe(true)
  })

  test("does not trigger when MiMo V2.5 Pro remains selected", () => {
    expect(shouldTriggerMimoProComposerEffect(MIMO_PRO_MODEL_KEY, MIMO_PRO_MODEL_KEY)).toBe(false)
  })

  test("does not trigger when switching to another model", () => {
    expect(shouldTriggerMimoProComposerEffect(MIMO_PRO_MODEL_KEY, "mimo:mimo-v2.5")).toBe(false)
    expect(shouldTriggerMimoProComposerEffect("anthropic:claude-sonnet-4", "mimo:mimo-v2.5")).toBe(false)
  })
})
