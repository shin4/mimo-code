export const MIMO_PRO_MODEL_KEY = "mimo:mimo-v2.5-pro"
export const MIMO_PRO_COMPOSER_EFFECT_MS = 6_525

type ModelEffectInput =
  | {
      id: string
      provider: {
        id: string
      }
    }
  | undefined

export function modelEffectKey(model: ModelEffectInput) {
  if (!model) return
  return `${model.provider.id}:${model.id}`
}

export function shouldTriggerMimoProComposerEffect(previous: string | undefined, current: string | undefined) {
  return !!previous && previous !== current && current === MIMO_PRO_MODEL_KEY
}
