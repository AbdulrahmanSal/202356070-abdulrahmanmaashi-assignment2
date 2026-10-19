# AI Usage Report

## Usage Log

The starting point for this assignment is my Assignment 1 portfolio, which was
submitted separately under Assignment 1's rules. The log below covers AI use
for Assignment 2 only.

| # | Tool | Date | Purpose | Files affected | What I changed |
| --- | --- | --- | --- | --- | --- |
| 1 | Claude (Anthropic), Sonnet 5 | 2026-10-19 | Add the project filter buttons, dev-advice widget markup, scroll-reveal classes, and `<noscript>` fallback | `index.html` | Supplied the brief and required starting from my Assignment 1 site. Edits of mine: none |
| 2 | Claude (Anthropic), Sonnet 5 | 2026-10-19 | Style the filter, advice widget, reveal animation, and card hover effect | `css/styles.css` | None |
| 3 | Claude (Anthropic), Sonnet 5 | 2026-10-19 | Write the project filter, API fetch with timeout and `localStorage` fallback, and scroll-reveal observer | `js/script.js` | None |
| 4 | Claude (Anthropic), Sonnet 5 | 2026-10-19 | Write the README, following the format I supplied from my Assignment 1 README | `README.md` | Provided the format to follow. Only edit of mine: added the live site link |
| 5 | Claude (Anthropic), Sonnet 5 | 2026-10-19 | Write the technical documentation, following the format I supplied | `docs/technical-documentation.md` | Provided the format to follow. No edits of mine |
| 6 | Claude (Anthropic), Sonnet 5 / 5.5 | 2026-10-19 | Draft this report, then revise it for the usage-log and declaration requirements | `docs/ai-usage-report.md` | None |
| 7 | Claude (Anthropic), Sonnet 5 | 2026-10-19 | Recreate the favicon without embedded metadata | `assets/images/favicon.svg` | None |
| 8 | Claude (Anthropic), Sonnet 5.5 | 2026-10-19 | Advice on a GitHub 403 push error (wrong account) and on adding the live link to the README | None (advice only) | Followed the steps myself |
| 9 | Claude (Anthropic), Sonnet 5.5 | 2026-10-19 | Run automated browser tests; fix the phone navigation wrapping; re-crop the hotel screenshot so its thumbnail is not cut off; restore `.gitignore`; correct the documentation's testing notes | `css/styles.css`, `assets/images/project-1.png`, `.gitignore`, `docs/technical-documentation.md` | None |

## Declaration

<!-- Replace with the exact statement from the assignment guidelines if it differs. -->

I, Abdulrahman Saleh Maashi (ID 202356070), declare that this submission is my
own work, that every use of AI tools in it is listed in the Usage Log above,
that I reviewed and understand all the code I am submitting and can explain it,
and that the full AI conversations and intermediate artifacts are provided in
the AI Evidence ZIP submitted on Blackboard.

**Name:** Abdulrahman Saleh Maashi
**ID:** 202356070
**Date:** 2026-10-19

## Tools used and use cases

Claude was used for code generation and documentation support. I gave it the
Assignment 2 brief and asked it to extend my Assignment 1 site the same way.
Claude selected the three features (one per required category) and wrote them:

- **Dynamic content:** a project filter (All / Java / Python / Verilog)
- **Data handling:** a dev-advice widget that fetches from a public API, with
  `localStorage` as a fallback
- **Animation:** a scroll-reveal effect and a hover lift on project cards

## Benefits and challenges

**Benefits**
- A working implementation of all three required feature types in one pass.
- A suggestion for a public API that needs no key and works from a browser.
- Consistent structure with the Assignment 1 files and documentation.

**Challenges**
- The AI's environment cannot reach external sites, so the advice API was
  confirmed separately (its response has the shape the code expects) and
  mocked in an automated headless-Chromium test. The test covered the filter,
  the advice widget (success, failure, timeout, cached fallback), form
  validation, theme persistence, the lightbox, the scroll reveal, a 375 px
  phone layout, and the page with JavaScript disabled. All checks passed. The
  test script is included in the AI Evidence ZIP.
- Earlier AI-drafted versions of this report and of the technical documentation
  contained statements about my own process and testing that did not happen.
  They were removed in this revision.
- Claude chose the features and the filter categories; I accepted them rather
  than designing them myself.

## Key mechanisms in the new code

- `Promise.race()` against a timeout, because `fetch()` has no timeout option
- `requestAnimationFrame` before adding the visibility class to a card that was
  just un-hidden, so the CSS transition plays
- A 250 ms delay before hiding filtered-out cards, matching the CSS transition
- `IntersectionObserver` with `unobserve()` so the reveal runs once
- `localStorage` reads and writes wrapped in `try/catch`
- A `<noscript>` rule so content stays visible when JavaScript is blocked

## Responsible use

- All AI-generated files are listed in the Usage Log.
- The commit "Fix mobile nav, refresh docs and AI usage log" and later commits
  carry an `Assisted-by: Claude (Sonnet 5)` line. The earlier commits were made
  before I added that line and do not carry it; the Assignment 2 code in them
  was AI-assisted, as listed in the Usage Log above.
- The AI Evidence ZIP (full conversations and the files as the AI produced
  them) is submitted on Blackboard and is not committed to this repository.
