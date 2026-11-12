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
 * draft label is the fixed chip on every page, so this component shows the
 * file through a window cut to the lockup's own artwork box (x 28.99 to
 * 686.82, y 28.99 to 96.94: the logo, the rule and our half) and puts the
 * clear space back as padding: one B of BYU on every side, B = 38.26/396 of
 * the Marriott logo's width (24.15 px at a 250 px logo), plus a 4 px margin
 * so the measured clear space is never a rounding error away from the rule
 * (28.2 px at 250). Nothing may sit in that padding. The file itself is never edited, and the official logo
 * inside it is never cropped.
 *
 * It renders as <img>, never as inline SVG: the official file's class names
 * (.st0, .st1) would clash with a second inline copy on the same page.
 *
 * Sizing: pass the BYU Marriott logo's width in px; the brief's floor is
 * 250 and the component refuses less. It never shrinks to its column (flex
 * none, no max-width): a lockup squeezed below a 250 px logo breaks the
 * brief, so the header and footer show it only where it fits (768 px and
 * up) and use the secondary version or the official logo alone below that.
 */
const FILE_W = 715.81
const FILE_H = 147.61
const BOX_X = 28.99
const BOX_Y = 28.99
const BOX_W = 657.83
const BOX_H = 67.95
const LOGO_W = 300
/** Width of the "B" in BYU over the official file's width (38.26 / 396 units). */
export const B_RATIO = 38.26 / 396
export const MIN_LOGO_W = 250
/** Margin over one B, px: the clear space is B + this, never B exactly. */
export const CLEAR_MARGIN = 4
/** The padding (clear space) for a Marriott logo of width w, px. */
export function clearSpace(w: number) {
  return Math.ceil((w * B_RATIO + CLEAR_MARGIN) * 10) / 10
}

export function CobrandLockup({
  tone,
  logoWidth = MIN_LOGO_W,
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
  const w = Math.max(logoWidth, MIN_LOGO_W)
  const boxWidth = (w * BOX_W) / LOGO_W
  const boxHeight = (boxWidth * BOX_H) / BOX_W
  const b = clearSpace(w)
  return (
    <span
      className={className}
      data-lockup="cobrand"
      style={{ display: "block", flex: "none", boxSizing: "content-box", padding: `${b}px`, ...style }}
    >
      <span
        data-lockup-art=""
        style={{
          display: "block",
          position: "relative",
          overflow: "hidden",
          width: `${boxWidth.toFixed(2)}px`,
          height: `${boxHeight.toFixed(2)}px`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- the file must be served unchanged, never re-encoded */}
        <img
          src={`/brand/stride/lockup-stride-${tone}.svg`}
          alt={alt}
          width={FILE_W}
          height={FILE_H}
          data-marriott-w={((boxWidth * LOGO_W) / BOX_W).toFixed(2)}
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
    </span>
  )
}

/**
 * The official BYU Marriott School of Business logo alone, white on navy:
 * public/brand/byu-marriott/msb_left_white.svg is the school's file byte for
 * byte (viewBox 396 x 75, nothing cropped). Used below 768 px, where the
 * horizontal lockup cannot fit at a 250 px logo: in the phone header (so the
 * first viewport of every page shows the school's logo) and in the phone
 * footer. The AF mark appears in the hero. Clear space as padding, as for
 * the lockup.
 */
export function MarriottLogo({ width = MIN_LOGO_W, alt, className, priority }: { width?: number; alt: string; className?: string; priority?: boolean }) {
  const w = Math.max(width, MIN_LOGO_W)
  const b = clearSpace(w)
  return (
    <span className={className} data-lockup="marriott" style={{ display: "block", flex: "none", boxSizing: "content-box", padding: `${b}px` }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- the official file is served unchanged, never re-encoded */}
      <img
        src="/brand/byu-marriott/msb_left_white.svg"
        alt={alt}
        width={w}
        height={(w * 75) / 396}
        data-lockup-art=""
        data-marriott-w={w.toFixed(2)}
        fetchPriority={priority ? "high" : undefined}
        style={{ display: "block", width: `${w}px`, height: "auto", maxWidth: "none" }}
      />
    </span>
  )
}
