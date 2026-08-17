import {
  ArrowRight,
  ArrowUpRight,
  Checkmark,
  Close,
  Launch,
  Menu,
  Warning,
  type CarbonIconType,
} from "@carbon/icons-react"

/**
 * Carbon icon (IBM design language, same family as IBM Plex), colored by
 * currentColor, default 20px. Port of design_handoff .../display/Icon.jsx:
 * the handoff fetched SVGs from a CDN and flagged that as a substitution
 * decision; per its integration map this uses @carbon/icons-react instead,
 * keeping the same @carbon/icons names.
 *
 * Use sparingly: link arrows, dialogs, feedback, nav. Structural glyphs
 * stay unicode: + (values expand), · (carousel separator). No emoji, ever.
 */
const ICONS: Record<string, CarbonIconType> = {
  "arrow--right": ArrowRight,
  "arrow--up-right": ArrowUpRight,
  checkmark: Checkmark,
  close: Close,
  launch: Launch,
  menu: Menu,
  warning: Warning,
}

export function Icon({
  name,
  size = 20,
  title,
  style,
}: {
  name: keyof typeof ICONS | (string & {})
  size?: number
  title?: string
  style?: React.CSSProperties
}) {
  const Glyph = ICONS[name]
  if (!Glyph) return null
  return (
    <span
      aria-hidden={title ? undefined : true}
      title={title}
      style={{ display: "inline-flex", width: size, height: size, lineHeight: 0, flex: "none", ...style }}
    >
      <Glyph size={32} width="100%" height="100%" fill="currentColor" aria-label={title} />
    </span>
  )
}
