"use client"

import { useMemo, useState } from "react"
import { ShowcaseCard } from "@/components/ds/ShowcaseCard"
import { Input } from "@/components/ds/Input"
import { Select } from "@/components/ds/Select"
import { WORK_KINDS, WORK_STATUSES, type WorkItem, type WorkKind, type WorkStatus } from "@/lib/content"

/**
 * The /work library: every entry in one grid, with search, Kind and Status
 * facets, and a sort. All client-side; the list is small and static.
 *
 * Facets are single-select per group (click the active chip to clear it),
 * and both groups combine with the search. Each chip's count is what you
 * would get if you clicked it given the OTHER active filters, so a count
 * never promises results that are not there, and a chip that would empty
 * the grid is disabled rather than hidden (the vocabulary stays visible).
 * Chips come from the data: a new kind in content.ts grows the bar.
 *
 * No entrance motion on the grid: it is the thing you filter, and a
 * whileInView reveal on a grid this tall never reaches its threshold on a
 * phone. The grid is a fixed 3 / 2 / 1 column ladder (globals .work-grid), not
 * auto-fit, so a card is the same width whatever the filter leaves.
 */

const SORTS = ["A to Z", "Featured first", "By kind"] as const
type Sort = (typeof SORTS)[number]

/* A to Z, not Featured first: the six featured cards sit directly above
   the library, so a featured-first default would open the library on a
   verbatim repeat of what the visitor just scrolled past. */
const DEFAULT_SORT: Sort = "A to Z"

function matches(item: WorkItem, q: string) {
  if (!q) return true
  const hay = [item.name, item.blurb, item.kind, item.status, item.repo ?? "", ...item.tags].join(" ").toLowerCase()
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((t) => hay.includes(t))
}

function sortItems(items: WorkItem[], sort: Sort, order: Map<WorkItem, number>) {
  const byList = (a: WorkItem, b: WorkItem) => (order.get(a) ?? 0) - (order.get(b) ?? 0)
  const byFeatured = (a: WorkItem, b: WorkItem) => (a.featured ?? 99) - (b.featured ?? 99) || byList(a, b)
  const out = [...items]
  if (sort === "A to Z") out.sort((a, b) => a.name.localeCompare(b.name))
  else if (sort === "By kind")
    out.sort((a, b) => WORK_KINDS.indexOf(a.kind) - WORK_KINDS.indexOf(b.kind) || byFeatured(a, b))
  else out.sort(byFeatured)
  return out
}

function Chip({
  selected,
  disabled,
  onClick,
  label,
  count,
}: {
  selected: boolean
  disabled: boolean
  onClick: () => void
  label: string
  count: number
}) {
  return (
    <button
      type="button"
      className="work-chip"
      aria-pressed={selected}
      disabled={disabled && !selected}
      onClick={onClick}
    >
      {label} <span className="work-chip__count">{count}</span>
    </button>
  )
}

function FacetRow({
  label,
  values,
  active,
  setActive,
  countFor,
}: {
  label: string
  values: readonly string[]
  active: string | null
  setActive: (v: string | null) => void
  countFor: (v: string) => number
}) {
  return (
    <div className="work-facet" role="group" aria-label={label}>
      <span className="work-facet__label">{label}</span>
      <div className="work-facet__chips">
        {values.map((v) => {
          const n = countFor(v)
          return (
            <Chip
              key={v}
              label={v}
              count={n}
              selected={active === v}
              disabled={n === 0}
              onClick={() => setActive(active === v ? null : v)}
            />
          )
        })}
      </div>
    </div>
  )
}

export function WorkLibrary({ items }: { items: WorkItem[] }) {
  const [q, setQ] = useState("")
  const [kind, setKind] = useState<WorkKind | null>(null)
  const [status, setStatus] = useState<WorkStatus | null>(null)
  const [sort, setSort] = useState<Sort>(DEFAULT_SORT)

  const order = useMemo(() => new Map(items.map((it, i) => [it, i])), [items])
  const kinds = WORK_KINDS.filter((k) => items.some((i) => i.kind === k))
  const statuses = WORK_STATUSES.filter((s) => items.some((i) => i.status === s))

  const searched = items.filter((i) => matches(i, q))
  const shown = sortItems(
    searched.filter((i) => (!kind || i.kind === kind) && (!status || i.status === status)),
    sort,
    order,
  )
  const filtered = q.trim() !== "" || kind !== null || status !== null

  const clear = () => {
    setQ("")
    setKind(null)
    setStatus(null)
  }

  return (
    <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
      <div className="work-controls">
        {/* Own labels, not the ds Field: Field marks every non-required
            control "(optional)", which is form language, not a filter's. */}
        <label className="work-controls__search">
          <span className="work-label">Search</span>
          <Input
            type="search"
            placeholder="Try “evals”, “safety” or “healthcare”"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <label className="work-controls__sort">
          <span className="work-label">Sort</span>
          <Select options={[...SORTS]} defaultValue={DEFAULT_SORT} onChange={(e) => setSort(e.target.value as Sort)} />
        </label>
      </div>
      <FacetRow
        label="Kind"
        values={kinds}
        active={kind}
        setActive={(v) => setKind(v as WorkKind | null)}
        countFor={(k) => searched.filter((i) => i.kind === k && (!status || i.status === status)).length}
      />
      <FacetRow
        label="Status"
        values={statuses}
        active={status}
        setActive={(v) => setStatus(v as WorkStatus | null)}
        countFor={(s) => searched.filter((i) => i.status === s && (!kind || i.kind === kind)).length}
      />
      <div className="work-showing">
        <p aria-live="polite" style={{ margin: 0 }}>
          {shown.length === items.length ? `Showing all ${items.length}` : `Showing ${shown.length} of ${items.length}`}
        </p>
        {filtered ? (
          <button type="button" className="work-clear link-draw" onClick={clear}>
            Clear filters
          </button>
        ) : null}
      </div>
      {shown.length ? (
          <div className="work-grid">
            {shown.map((it) => (
              <ShowcaseCard key={it.name} item={it} />
            ))}
          </div>
        ) : (
          <div className="work-empty">
            <p style={{ margin: 0 }}>Nothing matches that. Try another word, or clear the filters.</p>
          </div>
        )}
    </div>
  )
}
