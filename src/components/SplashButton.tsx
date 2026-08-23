"use client"

import styles from "./SplashButton.module.css"

/**
 * EXPERIMENT (corbin-experiments branch): a call-to-action button whose
 * offset outline ring melts away on hover and splashes back in on leave.
 * Preview at /lab/splash-button (unlinked, noindexed).
 *
 * Two things to settle before this ships anywhere public:
 *
 *   Brand: the default #1f63f4 and the derived gradient are off-palette
 *   for this site — globals.css commits us to flat BYU navy/white with no
 *   gradients. If it graduates, point --splash-color at a semantic token
 *   and decide whether the gradient survives brand review.
 *
 *   Client boundary: MotionCta documents the intent to keep client
 *   components to small leaves. This is another such leaf — a <button>
 *   that hydrates only so consumers can attach onClick. Site CTAs today
 *   are links; if this ends up wrapping navigation, it wants the same
 *   link treatment MotionCta has, not a <button>.
 */

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Button color; the gradient and ring are derived from it. */
  color?: string
}

export function SplashButton({ color, className, style, children, ...props }: Props) {
  const mergedStyle = color
    ? ({ "--splash-color": color, ...style } as React.CSSProperties)
    : style

  return (
    <button
      type="button"
      className={className ? `${styles.button} ${className}` : styles.button}
      style={mergedStyle}
      {...props}
    >
      {children}
    </button>
  )
}
