import{c as n,j as e,a as r}from"./index-DsEjXmEw.js";/**
 * @license lucide-react v0.447.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=n("Minus",[["path",{d:"M5 12h14",key:"1ays0h"}]]);/**
 * @license lucide-react v0.447.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=n("TrendingDown",[["polyline",{points:"22 17 13.5 8.5 8.5 13.5 2 7",key:"1r2t7k"}],["polyline",{points:"16 17 22 17 22 11",key:"11uiuu"}]]);/**
 * @license lucide-react v0.447.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=n("TrendingUp",[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]]);function y({label:l,value:a,trend:s,trendValue:t,icon:i,className:c}){const d={up:u,down:m,neutral:p},x={up:"text-success",down:"text-error",neutral:"text-foreground/50"},o=s?d[s]:null;return e.jsxs("div",{className:r("flex items-start gap-3",c),children:[i&&e.jsx("div",{className:"p-2 bg-primary/20 rounded-lg text-primary",children:i}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsx("p",{className:"text-sm text-foreground/60 mb-1",children:l}),e.jsxs("div",{className:"flex items-baseline gap-2",children:[e.jsx("p",{className:"text-2xl font-bold text-foreground",children:a}),s&&t&&o&&e.jsxs("div",{className:r("flex items-center gap-1 text-sm font-medium",x[s]),children:[e.jsx(o,{size:16}),e.jsx("span",{children:t})]})]})]})]})}export{p as M,y as S,u as T};
