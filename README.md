# Calculator Hub

A multi-page collection of 11 small calculator tools, sharing one visual style and a set of common helpers. Built with plain HTML, Tailwind CSS (via CDN), custom CSS animations, and vanilla JavaScript — no build step, no framework, no backend.

## Pages

`index.html` is the hub/home page: a searchable grid of cards linking out to each tool. Every other page is a self-contained calculator with a "← All calculators" link back to the hub.

| Page | Tool | What it does |
|---|---|---|
| `basic.html` | Basic Calculator | Standard +, −, ×, ÷, % keypad calculator. |
| `scientific.html` | Scientific Calculator | Trig (sin/cos/tan + inverses), hyperbolic functions, log/ln, powers, roots, factorial, constants (π, e), DEG/RAD toggle, memory (MC/MR/M+/M−), calculation history, copy/paste, and a "quick calc" expression input. |
| `tip.html` | Tip Calculator | Bill splitting with quick-pick tip percentages (10/15/18/20%) or a custom %, split across any number of people. Uses a distinct glassmorphic (frosted-glass) card style. |
| `bmi.html` | BMI Calculator | Body Mass Index from weight (kg) and height (cm), with a category (Underweight/Normal/Overweight/Obese). |
| `age.html` | Age Calculator | Exact age in years/months/days between a date of birth and an "as of" date, plus total days. |
| `percentage.html` | Percentage Calculator | Two modes: "X% of Y" and "X is what % of Y". |
| `discount.html` | Discount Calculator | Final price and amount saved after a percentage-off discount. |
| `interest.html` | Simple Interest Calculator | Interest and total payable from principal, annual rate, and time in years. |
| `emi.html` | EMI / Loan Calculator | Monthly installment, total payment, and total interest for a loan (principal, annual rate, tenure in months). |
| `unit.html` | Unit Converter | Converts between units of length, weight, and temperature. |
| `datediff.html` | Date Difference Calculator | Total days (and weeks + remainder days) between two calendar dates. |

## Shared files

- **`style.css`** — all custom styling: the pastel gradient background with floating blur "blobs," sparkle/twinkle decorations, button ripple and shake/pop animations, the hub card grid, the standard `.tool-card` styling used by most calculators, and a separate `.glass-*` frosted-glass style used only by the Tip Calculator. Includes responsive breakpoints and a `prefers-reduced-motion` override.
- **`shared.js`** — common helpers used across pages:
  - `showResult(boxEl, headline, ...detailLines)` — renders a result box (used by BMI, Age, Percentage, Discount, Interest, EMI, Unit Converter, Date Difference).
  - `spawnRipple(evt, btn)` — Material-style click ripple on keypad buttons (Basic & Scientific calculators).
  - `burstSparkles(btn)` — sparkle particle burst fired from the equals button on a successful calculation (Scientific calculator).
- **`hub.js`** — powers the live search box on the home page, filtering the tool cards by a `data-name` keyword list on each card.
- Each calculator page also loads its own dedicated script (`age.js`, `basic.js`, `bmi.js`, `datediff.js`, `discount.js`, `emi.js`, `interest.js`, `percentage.js`, `scientific.js`, `tip.js`, `unit.js`), loaded after `shared.js`.

### `script.js` (unused / legacy)
This file contains an older, monolithic version of the app — the scientific calculator engine plus the logic for percentage, discount, simple interest, EMI, unit conversion, and date difference, all combined into one script. No HTML page currently includes `<script src="script.js">`; each page now loads its own split-out file instead. It appears to be left over from before the app was broken into per-tool pages and can likely be deleted, unless it's still needed as a reference/backup.

## Tech stack

- **Tailwind CSS**, loaded from the CDN (`cdn.tailwindcss.com`) for layout and utility styling.
- **Custom CSS** (`style.css`) for animations, gradients, glassmorphism, and the hub/tool card components layered on top of Tailwind.
- **Vanilla JavaScript** — no frameworks or external JS libraries. Each calculator's math and DOM logic lives in its own small script file.
- Favicons are inline SVG data URIs, so there are no separate image assets.

## File structure

```
.
├── index.html        # Hub / home page (search + tool grid)
├── hub.js
├── shared.js
├── style.css
│
├── basic.html         basic.js
├── scientific.html    scientific.js
├── tip.html            tip.js
├── bmi.html            bmi.js
├── age.html            age.js
├── percentage.html    percentage.js
├── discount.html      discount.js
├── interest.html       interest.js
├── emi.html             emi.js
├── unit.html            unit.js
├── datediff.html       datediff.js
│
└── script.js          # unused legacy combined script (see note above)
```

## Running it

Static files only — open `index.html` in a browser, or serve the folder with any static file server. No installation or build step required. An internet connection is needed once, to load Tailwind from its CDN.

## Notes

- Result/error validation is done inline per calculator (e.g. rejecting empty or non-finite inputs) before any calculation runs.
- The Basic and Scientific calculators evaluate expressions with `Function(...)` (a `Function` constructor `eval`-style call) rather than a math parser — fine for a self-contained personal tool, but worth knowing if this code is reused somewhere untrusted input could reach it.
