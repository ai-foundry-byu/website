import type { Metadata } from "next"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { Badge } from "@/components/ds/Badge"
import { Eyebrow } from "@/components/ds/Eyebrow"
import { Progress } from "@/components/ds/Progress"
import { Reveal } from "@/components/motion/MotionPrimitives"
import { getRoadmapStats, type RoadmapStats } from "@/lib/roadmap-stats"
import {
  CERT_GOAL,
  ROADMAP,
  ROADMAP_EYEBROW,
  ROADMAP_HEADING,
  ROADMAP_LEAD,
  ROADMAP_STATS_NOTE,
  SCHOOL_FULL,
  type RoadmapItem,
} from "@/lib/content"

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "What AI Foundry, an experiential learning program of the " +
    SCHOOL_FULL +
    ", is building, and where each piece of it currently stands.",
  alternates: { canonical: "/roadmap" },
}

/** The counts are read live on every request, never cached into the build. */
export const dynamic = "force-dynamic"

/**
 * Roadmap, rebuilt to design_handoff .../ui_kits/roadmap: three phases with
 * royal cast numerals, hairline item rows, status badges (live = royal
 * border, active/planned = slate), and the cert Progress bar.
 *
 * The design shows a labeled sample value in the progress bar; here it and
 * the per-item counts read live via roadmap-stats, per the handoff
 * integration map and this page's founding rule: a number nobody has to
 * remember to update cannot go stale. A missing reading renders a dash.
 */
const tone = (s: RoadmapItem["status"]) => (s === "live" ? "accent" : "default")

function itemStat(item: RoadmapItem, stats: RoadmapStats): string | null {
  if (!item.stat) return null
  const value = stats[item.stat.field as keyof RoadmapStats]
  const shown = typeof value === "number" ? String(value) : "—"
  return `${shown} ${item.stat.caption}`
}

export default async function RoadmapPage() {
  const stats = await getRoadmapStats()
  return (
    <>
      <SiteHeader />
      <main>
        <section style={{ padding: "64px 24px 0" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <Eyebrow>{ROADMAP_EYEBROW}</Eyebrow>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontStretch: "var(--w-plate)",
                fontSize: "var(--size-h1)",
                lineHeight: 1.05,
                letterSpacing: "-0.005em",
                margin: "14px 0 0",
                color: "var(--navy)",
              }}
            >
              {ROADMAP_HEADING}
            </h1>
            <p style={{ fontSize: "var(--size-body)", lineHeight: 1.55, color: "var(--text-meta)", maxWidth: "60ch", margin: "16px 0 0" }}>
              {ROADMAP_LEAD}
            </p>
          </div>
        </section>
        <section style={{ padding: "40px 24px 64px" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "44px" }}>
            {ROADMAP.map((ph) => (
              <Reveal key={ph.n}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "16px",
                    borderBottom: "1px solid var(--border-strong)",
                    paddingBottom: "12px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontStretch: "var(--w-cast)",
                      fontSize: "34px",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                      color: "var(--royal)",
                    }}
                  >
                    {ph.n}
                  </span>
                  <h2
                    style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontStretch: "var(--w-plate)", fontSize: "24px", lineHeight: 1.15, margin: 0 }}
                  >
                    {ph.title}
                  </h2>
                  <span className="caption" style={{ color: "var(--text-meta)" }}>
                    {ph.subtitle}
                  </span>
                </div>
                {ph.items.map((it) => {
                  const statLine = itemStat(it, stats)
                  return (
                    <div
                      key={it.name}
                      style={{
                        borderBottom: "1px solid var(--border-hairline)",
                        padding: "16px 0",
                        display: "flex",
                        gap: "20px",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "var(--size-h4)", margin: "0 0 4px" }}>
                          {it.name}
                        </h4>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", lineHeight: 1.55, color: "var(--text-primary)", margin: 0, maxWidth: "66ch" }}>
                          {it.detail}
                        </p>
                        {statLine ? (
                          <p className="caption" style={{ color: "var(--text-meta)", margin: "8px 0 0", fontVariantNumeric: "tabular-nums" }}>
                            {statLine}
                          </p>
                        ) : null}
                        {it.goal ? (
                          <div style={{ marginTop: "12px", maxWidth: "420px" }}>
                            <Progress value={stats.claudeArchCerts ?? 0} max={CERT_GOAL} label="Certified" />
                          </div>
                        ) : null}
                      </div>
                      <Badge tone={tone(it.status)}>{it.status}</Badge>
                    </div>
                  )
                })}
              </Reveal>
            ))}
            <p className="caption" style={{ color: "var(--text-meta)", margin: 0 }}>
              {ROADMAP_STATS_NOTE}
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
