import { type ComponentProps } from "solid-js"
import { MiGlyph } from "../../components/logo"

// MiMo "Mi" wordmark — shares the brand glyph from the logo set. ViewBox kept
// at 720×129 so the only caller (NewSessionDesignView) keeps its existing
// `w-full max-w-[720px]` sizing. Uses currentColor so it inherits text color.
export function WordmarkV2(props: Pick<ComponentProps<"svg">, "class">) {
  return <MiGlyph width={720} height={129} fill="currentColor" class={props.class} />
}
