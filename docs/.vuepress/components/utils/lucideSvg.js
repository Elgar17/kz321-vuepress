/**
 * Lucide 图标内联数据（ISC License, lucide）— 避免 SSR / VuePress 对 lucide 包 ESM 解析问题
 */
const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
};

function esc(v) {
  return String(v).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function renderNodes(nodes) {
  return nodes
    .map(([tag, attrs]) => {
      const inner = Object.entries(attrs)
        .map(([k, val]) => `${k}="${esc(val)}"`)
        .join(" ");
      return `<${tag} ${inner} />`;
    })
    .join("");
}

export function lucideToSvg(iconNode, opts = {}) {
  const { size = 24, className = "lucide" } = opts;
  const svgAttrs = {
    ...defaultAttributes,
    width: size,
    height: size,
    class: className,
  };
  const top = Object.entries(svgAttrs)
    .map(([k, v]) => `${k}="${esc(v)}"`)
    .join(" ");
  return `<svg ${top}>${renderNodes(iconNode)}</svg>`;
}

export const iconKeyboard = [
  ["path", { d: "M10 8h.01" }],
  ["path", { d: "M12 12h.01" }],
  ["path", { d: "M14 8h.01" }],
  ["path", { d: "M16 12h.01" }],
  ["path", { d: "M18 8h.01" }],
  ["path", { d: "M6 8h.01" }],
  ["path", { d: "M7 16h10" }],
  ["path", { d: "M8 12h.01" }],
  ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }],
];

export const iconGlobe = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" }],
  ["path", { d: "M2 12h20" }],
];

export const iconSearch = [
  ["path", { d: "m21 21-4.34-4.34" }],
  ["circle", { cx: "11", cy: "11", r: "8" }],
];

export const iconX = [
  ["path", { d: "M18 6 6 18" }],
  ["path", { d: "m6 6 12 12" }],
];

export const iconDelete = [
  [
    "path",
    {
      d: "M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z",
    },
  ],
  ["path", { d: "m12 9 6 6" }],
  ["path", { d: "m18 9-6 6" }],
];

export const iconCornerDownLeft = [
  ["path", { d: "M20 4v7a4 4 0 0 1-4 4H4" }],
  ["path", { d: "m9 10-5 5 5 5" }],
];
