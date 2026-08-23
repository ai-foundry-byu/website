"use client"

import { useState } from "react"
import { Stagger, StaggerItem } from "@/components/motion/MotionPrimitives"
import { ShowcaseCard } from "@/components/ds/ShowcaseCard"
import type { ShowcaseItem } from "@/lib/content"

/**
 * The filterable grid on /work. Single-select chips derived from the tags
 * actually present in the data, so a new card with a new tag grows the bar
 * with no code change, and a filter can never be empty; clicking the active
 * chip clears it back to "All".
 *
 * Deliberately no search box and no sort: under a few dozen items those are
 * furniture. Filters are category chips only.
 */
const CHIP_BASE: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontWeight: 500,
  fontSize: "13px",
  lineHeight: 1.2,
  letterSpacing: "0.02em",
  padding: "8px 14px",
  borderRadius: "var(--radius)",
  whiteSpace: "nowrap",
  cursor: "pointer",
  transition: "background var(--dur-fast), color var(--dur-fast), border-color var(--dur-fast)",
}

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...CHIP_BASE,
        ...(selected
          ? { background: "var(--royal)", color: "#fff", border: "1px solid var(--royal)" }
          : {
              background: "transparent",
              color: "var(--navy)",
              border: hover ? "1px solid var(--navy)" : "1px solid var(--border-hairline)",
            }),
      }}
    >
      {children}
    </button>
  )
}

export function WorkShowcaseGrid({ items }: { items: ShowcaseItem[] }) {
  const tags = Array.from(new Set(items.flatMap((i) => i.tags)))
  const [active, setActive] = useState<string | null>(null)
  const shown = active ? items.filter((i) => i.tags.includes(active)) : items

  return (
    <>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto 24px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
          <Chip selected={active === null} onClick={() => setActive(null)}>
            All
          </Chip>
          {tags.map((tag) => (
            <Chip key={tag} selected={active === tag} onClick={() => setActive(tag === active ? null : tag)}>
              {tag}
            </Chip>
          ))}
        </div>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            lineHeight: 1.2,
            color: "var(--text-meta)",
            margin: "12px 0 0",
          }}
        >
          {shown.length} {shown.length === 1 ? "build" : "builds"}
        </p>
      </div>
      <Stagger
        style={{
          maxWidth: "var(--container)",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))",
          gap: "20px",
          alignItems: "stretch",
        }}
      >
        {shown.map((s) => (
          <StaggerItem key={s.name}>
            <ShowcaseCard name={s.name} blurb={s.blurb} tags={s.tags} links={s.links} image={s.image} />
          </StaggerItem>
        ))}
      </Stagger>
    </>
  )
}
