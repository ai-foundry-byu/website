"use client"

import { useState } from "react"
import Image from "next/image"
import { Icon } from "./Icon"

/* Team member. Headshots rest in navy-tinted monochrome (grayscale + a
   navy color-blend at 45%) and reveal full color on hover, 300ms stamp
   ease. Without a photo an initials plate (Archivo cast) stands in.
   Port of design_handoff .../content/TeamCard.jsx; the img is a next/image
   with sizes matched to the about-page grid. */
export function TeamCard({
  name,
  role,
  bio,
  linkedin,
  photo,
}: {
  name: string
  role?: string
  bio?: string
  linkedin?: string
  photo?: string
}) {
  const [hover, setHover] = useState(false)
  const initials = (name || "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: "1px solid var(--border-hairline)",
        background: "#fff",
        borderRadius: "var(--radius)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          aspectRatio: "1 / 1",
          background: photo ? "transparent" : "rgba(0,46,93,.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {photo ? (
          <>
            <Image
              src={photo}
              alt={name}
              fill
              sizes="(max-width: 640px) 50vw, 240px"
              style={{
                objectFit: "cover",
                filter: hover ? "none" : "grayscale(100%)",
                transition: "filter var(--dur-base) var(--ease-stamp)",
              }}
            />
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background: "var(--navy)",
                mixBlendMode: "color",
                opacity: hover ? 0 : 0.45,
                transition: "opacity var(--dur-base) var(--ease-stamp)",
                pointerEvents: "none",
              }}
            />
          </>
        ) : (
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontStretch: "var(--w-cast)",
              fontSize: "40px",
              color: "var(--slate)",
            }}
          >
            {initials}
          </span>
        )}
      </div>
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
        <h4 style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "var(--size-h4)", margin: 0 }}>{name}</h4>
        {role ? (
          <span className="caption" style={{ color: "var(--text-meta)" }}>
            {role}
          </span>
        ) : null}
        {bio ? (
          <p className="caption" style={{ color: "var(--text-primary)", margin: "6px 0 0" }}>
            {bio}
          </p>
        ) : null}
        {linkedin ? (
          <a
            href={linkedin}
            className="link-draw"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              fontSize: "13px",
              color: "var(--royal)",
              textDecoration: "none",
              marginTop: "8px",
              alignSelf: "flex-start",
            }}
          >
            LinkedIn{" "}
            <span className="arr">
              <Icon name="launch" size={14} />
            </span>
          </a>
        ) : null}
      </div>
    </div>
  )
}
