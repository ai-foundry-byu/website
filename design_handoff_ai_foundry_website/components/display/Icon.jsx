import React from "react";

/* Carbon icon (IBM design language, matches IBM Plex) fetched from CDN and
   inlined so it inherits currentColor. Names per @carbon/icons, e.g.
   "arrow--right", "close", "checkmark", "launch". */
const cache = {};
export function Icon({ name, size = 20, title, style }) {
  const [svg, setSvg] = React.useState(cache[name] || "");
  React.useEffect(() => {
    let on = true;
    if (cache[name]) { setSvg(cache[name]); return; }
    fetch("https://cdn.jsdelivr.net/npm/@carbon/icons@11/svg/32/" + name + ".svg")
      .then((r) => (r.ok ? r.text() : ""))
      .then((t) => { cache[name] = t || ""; if (on) setSvg(cache[name]); })
      .catch(() => {});
    return () => { on = false; };
  }, [name]);
  return <span aria-hidden={title ? undefined : true} title={title}
    style={{ display: "inline-flex", width: size, height: size, fill: "currentColor", lineHeight: 0, flex: "none", ...style }}
    dangerouslySetInnerHTML={{ __html: svg.replace("<svg ", '<svg width="100%" height="100%" ') }} />;
}
