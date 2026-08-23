import React from "react";

/* Data table: rail-style caps header over hairline rows, tabular figures.
   columns: [{key, label, align?}]; rows: array of objects. */
export function Table({ columns = [], rows = [] }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)", fontSize: "var(--size-ui)", lineHeight: 1.4, fontVariantNumeric: "tabular-nums" }}>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key} style={{ textAlign: c.align || "left", fontWeight: 600, fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-meta)", padding: "8px 12px 8px 0", borderBottom: "1px solid var(--border-strong)" }}>{c.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {columns.map((c) => (
              <td key={c.key} style={{ textAlign: c.align || "left", padding: "9px 12px 9px 0", borderBottom: "1px solid var(--border-hairline)", color: "var(--text-primary)" }}>{r[c.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
