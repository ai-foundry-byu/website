/**
 * The draft co-brand lockup, system v3 (brand/stride-2026-11): the official
 * BYU Marriott School of Business logo, unchanged, on the left; a thin rule;
 * the AF Stride mark and the AI FOUNDRY wordmark on the right. Draft for BYU
 * Marriott approval.
 *
 * The files in public/brand/stride/lockup-stride-*.svg are the system's
 * cobrand outputs byte for byte (final-v3-2026-11-12/system/cobrand). They
 * carry their own clear space (one "B" of BYU, 28.99 units at 1x) and, below
 * it, the outlined "Draft for BYU Marriott approval" line. On the site the
 * clear space is the header and footer padding and the draft label is the
 * fixed chip on every page (DraftLabel), so this component shows the file
 * through a window cut to the lockup's own artwork box (x 28.99 to 686.82,
 * y 28.99 to 96.94: the logo, the rule and our half). The file itself is
 * never edited, and the official logo inside it is never cropped.
 *
 * It renders as <img>, never as inline SVG: the official file's class names
 * (.st0, .st1) would clash with a second inline copy on the same page.
 *
 * Sizing: pass the BYU Marriott logo's width in px. The artwork box is
 * 657.83 x 67.95 at a 300 px logo, so the box is logoWidth * 2.1928 wide.
 * The brief's floor is a 250 px logo; on screens too narrow for that the
 * box shrinks to the column (maxWidth 100%) and the report says so.
 */
const FILE_W = 715.81
const FILE_H = 147.61
const BOX_X = 28.99
const BOX_Y = 28.99
const BOX_W = 657.83
const BOX_H = 67.95
const LOGO_W = 300

export function CobrandLockup({
  tone,
  logoWidth = 250,
  alt,
  className,
  style,
  priority,
}: {
  /** "white" on navy grounds, "color" (Navy and Slate) on light grounds. */
  tone: "white" | "color"
  /** Width of the BYU Marriott logo inside the lockup, in px. Brief floor: 250. */
  logoWidth?: number
  alt: string
  className?: string
  style?: React.CSSProperties
  priority?: boolean
}) {
  const boxWidth = (logoWidth * BOX_W) / LOGO_W
  return (
    <span
      className={className}
      style={{
        display: "block",
        position: "relative",
        overflow: "hidden",
        width: `${boxWidth.toFixed(1)}px`,
        maxWidth: "100%",
        aspectRatio: `${BOX_W} / ${BOX_H}`,
        flex: "none",
        ...style,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- the file must be served unchanged, never re-encoded */}
      <img
        src={`/brand/stride/lockup-stride-${tone}.svg`}
        alt={alt}
        width={FILE_W}
        height={FILE_H}
        fetchPriority={priority ? "high" : undefined}
        style={{
          position: "absolute",
          maxWidth: "none",
          width: `${((FILE_W / BOX_W) * 100).toFixed(4)}%`,
          height: "auto",
          left: `${((-BOX_X / BOX_W) * 100).toFixed(4)}%`,
          top: `${((-BOX_Y / BOX_H) * 100).toFixed(4)}%`,
        }}
      />
    </span>
  )
}
