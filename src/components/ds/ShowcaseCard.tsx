import Image from "next/image"
import { Badge } from "./Badge"
import { Eyebrow } from "./Eyebrow"
import { Icon } from "./Icon"
import type { WorkItem } from "@/lib/content"

/* The /work portfolio cards. One item shape (content.ts WorkItem), two
   presentations:

   - ShowcaseCard: the library card. Thumbnail, kind line with the status
     pill, name, blurb, tags, then the primary link and any secondary ones.
     Every card in the library is this shape, products and repos alike.
   - FeaturedCard: the "Start with these" row. Thumbnail, rank, name, the
     one-line blurb. The whole card is the link.

   The thumbnail is a 16:10 crop of the live thing, or a WorkPlate when there
   is no honest picture (a repo). Hover keeps the approved motion-plan #7
   treatment: royal border plus the four registration ticks (globals
   .reg-card/.reg-tick). Honesty rules live with the data in content.ts. */

const IMG_SIZES = "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 400px"

/* The plate. Ground varies by kind so a run of repos never reads as a wall
   of identical boxes: tools on navy, agents on royal, learning material on
   the subtle surface. Every ink is a declared contrast pairing (white and
   white/75 on navy, white on royal, navy on subtle); royal never touches
   navy. The hairline grid is decoration, not text. */
const PLATE_TONE: Record<string, string> = {
  Tool: "work-plate--navy",
  Marketplace: "work-plate--navy",
  Agent: "work-plate--royal",
  Spec: "work-plate--royal",
  Course: "work-plate--light",
  Reference: "work-plate--light",
  Product: "work-plate--light",
}

export function WorkPlate({ item }: { item: WorkItem }) {
  return (
    <div className={"work-plate " + (PLATE_TONE[item.kind] ?? "work-plate--navy")} aria-hidden="true">
      <span className="work-plate__kind">{item.kind}</span>
      <span className="work-plate__name">
        {item.repo ? <span className="work-plate__host">github.com/ai-foundry-byu/</span> : null}
        <span className="work-plate__repo">{item.repo ?? item.name}</span>
      </span>
    </div>
  )
}

function Thumb({ item, eager = false }: { item: WorkItem; eager?: boolean }) {
  return (
    <div className="work-thumb">
      {item.image ? (
        <Image
          src={item.image}
          alt=""
          fill
          sizes={IMG_SIZES}
          loading={eager ? "eager" : "lazy"}
          style={{ objectFit: "cover" }}
        />
      ) : (
        <WorkPlate item={item} />
      )}
    </div>
  )
}

function Ticks() {
  return (
    <>
      <span aria-hidden="true" className="reg-tick tl" />
      <span aria-hidden="true" className="reg-tick tr" />
      <span aria-hidden="true" className="reg-tick bl" />
      <span aria-hidden="true" className="reg-tick br" />
    </>
  )
}

export function ShowcaseCard({ item }: { item: WorkItem }) {
  const [primary, ...secondary] = item.links
  return (
    <article className="reg-card work-card">
      <Ticks />
      {primary ? (
        <a href={primary.href} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
          <Thumb item={item} />
        </a>
      ) : (
        <Thumb item={item} />
      )}
      <div className="work-card__body">
        <div className="work-card__meta">
          <Eyebrow>{item.kind}</Eyebrow>
          <Badge tone={item.status === "Live" ? "accent" : "default"}>{item.status}</Badge>
        </div>
        <h3 className="work-card__name">{item.name}</h3>
        <p className="work-card__blurb">{item.blurb}</p>
        {item.tags.length ? <p className="work-card__tags">{item.tags.join(" · ")}</p> : null}
        {primary ? (
          <div className="work-card__links">
            <a href={primary.href} target="_blank" rel="noopener noreferrer" className="link-draw work-card__primary">
              {primary.label}{" "}
              <span className="arr">
                <Icon name="arrow--up-right" size={14} />
              </span>
            </a>
            {secondary.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="link-draw work-card__secondary">
                {l.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  )
}

export function FeaturedCard({ item, eager = false }: { item: WorkItem; eager?: boolean }) {
  const href = item.links[0]?.href
  const rank = String(item.featured ?? 0).padStart(2, "0")
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="reg-card work-card work-card--featured">
      <Ticks />
      <Thumb item={item} eager={eager} />
      <div className="work-card__body">
        <h3 className="work-card__name">
          <span className="work-card__rank">{rank}</span>
          {item.name}
        </h3>
        <p className="work-card__blurb">{item.line ?? item.blurb}</p>
        <p className="work-card__tags">
          {item.kind} · {item.status}
        </p>
      </div>
    </a>
  )
}
