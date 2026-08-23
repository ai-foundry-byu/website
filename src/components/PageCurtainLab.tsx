"use client"

import { useState } from "react"
import {
  PageCurtainStage,
  PageCurtainTabs,
  usePageCurtain,
  type CurtainEffect,
} from "@/components/PageCurtain"

/**
 * Demo harness for the PageCurtain experiment — the interactive part of
 * /lab/page-curtain, kept out of the page file so the route module itself
 * stays a server component with metadata. Faux section content only; nothing
 * here is wired to real routes. Delete alongside PageCurtain.tsx.
 */

const PAGES = ["programs", "work", "network"] as const
type Page = (typeof PAGES)[number]

const LABELS: Record<Page, string> = {
  programs: "Programs",
  work: "Work",
  network: "Network",
}

const CONTENT: Record<
  Page,
  { surface: string; eyebrowClass: string; textClass: string; mutedClass: string; blurb: string }
> = {
  programs: {
    surface: "bg-surface-inverse",
    eyebrowClass: "text-text-on-inverse-muted",
    textClass: "text-text-on-inverse",
    mutedClass: "text-text-on-inverse-muted",
    blurb:
      "A navy section, as the site's dark bands render. The curtain closes over this block, swaps it, and opens on the next.",
  },
  work: {
    surface: "bg-surface-subtle",
    eyebrowClass: "text-text-muted",
    textClass: "text-text-primary",
    mutedClass: "text-text-muted",
    blurb:
      "The off-white band. Wipe direction follows tab order — forward sweeps one way, backward the other.",
  },
  network: {
    surface: "bg-surface-default",
    eyebrowClass: "text-text-muted",
    textClass: "text-text-primary",
    mutedClass: "text-text-muted",
    blurb:
      "White ground. With prefers-reduced-motion set, tabs swap instantly — no curtain, no motion.",
  },
}

const EFFECTS: CurtainEffect[] = ["doors", "wipe", "iris", "fade"]

export function PageCurtainLab() {
  const [effect, setEffect] = useState<CurtainEffect>("doors")
  const curtain = usePageCurtain({ pages: PAGES })

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageCurtainTabs
          curtain={curtain}
          labels={LABELS}
          className="flex gap-1"
          tabClassName="border-b-2 border-transparent px-3 py-1.5 text-sm text-text-muted transition-colors hover:text-text-primary"
          activeTabClassName="!border-surface-accent !text-text-primary font-medium"
        />
        <div className="flex gap-1" role="group" aria-label="Curtain effect">
          {EFFECTS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEffect(e)}
              aria-pressed={effect === e}
              className={`px-3 py-1.5 text-sm capitalize transition-colors ${
                effect === e
                  ? "bg-surface-inverse text-text-on-inverse"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <PageCurtainStage
        curtain={curtain}
        effect={effect}
        curtainClassName="bg-surface-inverse"
        className="mt-3 min-h-[420px] border border-border-subtle"
      >
        {(page) => (
          <div
            data-page={page}
            className={`flex min-h-[420px] flex-col justify-end p-10 ${CONTENT[page].surface}`}
          >
            <div className="flex items-start gap-5">
              <span aria-hidden className="ember-bar mt-1 h-12 w-1 shrink-0" />
              <div>
                <p className={`eyebrow ${CONTENT[page].eyebrowClass}`}>{page}</p>
                <h2
                  className={`mt-2 font-serif text-3xl font-semibold tracking-[-0.02em] ${CONTENT[page].textClass}`}
                >
                  {LABELS[page]}
                </h2>
                <p className={`mt-3 max-w-md text-sm leading-relaxed ${CONTENT[page].mutedClass}`}>
                  {CONTENT[page].blurb}
                </p>
              </div>
            </div>
          </div>
        )}
      </PageCurtainStage>

      <p className="mt-3 text-xs text-text-muted" data-testid="status">
        page: <span data-testid="current-page">{curtain.page}</span>
        {" · "}
        {curtain.isPending ? "transitioning…" : "idle"}
      </p>
    </div>
  )
}
