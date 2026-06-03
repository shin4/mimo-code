import { type ComponentProps } from "solid-js"

// MiMo brand logo set — the "Mi" pixel-art monogram.
//
// The glyph is defined ONCE as greedy-merged rectangles in a 22×18 grid-unit
// box (orange "M" + lowercase "i"). The same grid generates the app icon and
// favicons (see packages/desktop/icons/* and packages/ui/src/assets/favicon).
// `MiGlyph` scales + centers it into any viewBox, so each mark keeps its
// existing dimensions (and CSS hooks) while sharing one source of truth.

const MI_W = 22
const MI_H = 18
const MI_RECTS: ReadonlyArray<readonly [number, number, number, number]> = [
  [0, 0, 16, 3], // M solid top bar
  [19, 0, 3, 3], // i dot
  [0, 3, 4, 15], // M left leg
  [7, 3, 2, 5], // M center peak
  [12, 3, 4, 15], // M right leg
  [19, 5, 3, 13], // i stem
]

export function MiGlyph(props: {
  width: number
  height: number
  fill?: string
  class?: string
  dataComponent?: string
  ref?: ComponentProps<"svg">["ref"]
}) {
  const scale = Math.min(props.width / MI_W, props.height / MI_H)
  const ox = (props.width - MI_W * scale) / 2
  const oy = (props.height - MI_H * scale) / 2
  const fill = props.fill ?? "var(--icon-strong-base)"
  return (
    <svg
      ref={props.ref}
      data-component={props.dataComponent}
      viewBox={`0 0 ${props.width} ${props.height}`}
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      classList={{ [props.class ?? ""]: !!props.class }}
    >
      {MI_RECTS.map(([x, y, w, h]) => (
        <rect x={ox + x * scale} y={oy + y * scale} width={w * scale} height={h * scale} fill={fill} />
      ))}
    </svg>
  )
}

export const Mark = (props: { class?: string }) => (
  <MiGlyph width={16} height={20} dataComponent="logo-mark" class={props.class} />
)

export const Splash = (props: Pick<ComponentProps<"svg">, "ref" | "class">) => (
  <MiGlyph width={80} height={100} dataComponent="logo-splash" ref={props.ref} class={props.class} />
)

export const Logo = (props: { class?: string }) => <MiGlyph width={234} height={42} class={props.class} />
