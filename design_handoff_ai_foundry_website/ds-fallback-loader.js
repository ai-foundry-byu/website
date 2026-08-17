/* Renders the design-system components from their .jsx sources in preview
   pages, without waiting for the compiled bundle. Requires React, ReactDOM,
   and Babel standalone to be loaded first. Exposes window.loadAIF(relRoot). */
window.loadAIF = async function (rel) {
  if (window.AIF) return window.AIF;
  var files = [
    "components/forms/Button.jsx",
    "components/forms/Input.jsx",
    "components/forms/Textarea.jsx",
    "components/forms/Select.jsx",
    "components/display/Eyebrow.jsx",
    "components/display/SectionHeader.jsx",
    "components/display/Card.jsx",
    "components/display/Stat.jsx",
    "components/navigation/NavBar.jsx",
    "components/navigation/Footer.jsx",
    "components/display/Icon.jsx",
    "components/display/Badge.jsx",
    "components/display/Table.jsx",
    "components/feedback/Dialog.jsx",
    "components/feedback/EmptyState.jsx",
    "components/feedback/Progress.jsx",
    "components/content/TeamCard.jsx",
    "components/content/ShowcaseCard.jsx",
    "components/content/ValueRow.jsx",
    "components/content/NameCarousel.jsx",
  ];
  var texts = await Promise.all(files.map(function (f) {
    return fetch(rel + f).then(function (r) {
      if (!r.ok) throw new Error("missing " + f);
      return r.text();
    });
  }));
  var src = texts.join("\n")
    .replace(/^import[^\n]*$/gm, "")
    .replace(/^export /gm, "");
  var names = ["Button", "Field", "Input", "Textarea", "Select", "Eyebrow", "SectionHeader", "Card", "Stat", "Icon", "Badge", "Table", "Dialog", "EmptyState", "Progress", "TeamCard", "ShowcaseCard", "NavBar", "Footer", "ValueRow", "NameCarousel"];
  var wrapped = "window.AIF=(function(){\n" + src + "\nreturn {" + names.map(function (n) { return n + ":" + n; }).join(",") + "};\n})();";
  var code = Babel.transform(wrapped, { presets: [["react", { runtime: "classic" }]] }).code;
  (0, eval)(code);
  return window.AIF;
};
