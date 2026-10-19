# Technical Documentation

## Overview

This builds directly on the Assignment 1 site: the same three files do the
work, `index.html` for content, `css/styles.css` for presentation, `js/script.js`
for behaviour — but three new features are added on top: a project filter,
a public-API widget, and a scroll-triggered reveal animation. There is still
no build step, no bundler, and no dependency beyond one web font and one
public API.

| Layer | File | Responsibility |
| --- | --- | --- |
| Structure | `index.html` | Semantic sections, form markup, filter bar, advice widget, accessibility attributes |
| Presentation | `css/styles.css` | Design tokens, layout, both themes, filter/advice styling, reveal and hover transitions |
| Behaviour | `js/script.js` | Eight features — see below |

This document covers what changed for Assignment 2. The Assignment 1
foundations (design tokens, theme toggle, nav highlighting, form validation,
responsive breakpoints) are unchanged and are not repeated here in full —
only where a new feature touches them.

---

## What's new: three features

### 1. Project filter (dynamic content)

Each `.project` article carries a `data-tags` attribute (`java`, `python`, or
`verilog`). Four buttons above the grid (`All`, `Java`, `Python`, `Verilog`)
each carry a `data-filter` value. Clicking one:

1. Marks that button `.is-active` and `aria-pressed="true"`, and clears the
   others — so screen readers and sighted users agree on which filter is on.
2. Calls `applyFilter(tag)`, which walks every card and compares its
   `data-tags` to the clicked filter.

A matching card gets `hidden = false` and, one animation frame later,
`.is-visible` — the one-frame delay matters: if the class were added in the
same frame as removing `hidden`, the browser would collapse "hidden → shown"
into a single paint and the opacity transition would never play. A
non-matching card loses `.is-visible` immediately (so it starts fading out)
but keeps `hidden = false` for 250ms — the length of the CSS transition —
before actually being set `hidden = true`. Without that delay the card would
vanish instantly and only *then* fade, which is backwards.

`applyFilter('all')` also runs once on page load, which means the project
cards fade in on first paint the same way they fade when the filter changes —
one mechanism serves both the "dynamic content" requirement and part of the
"animation" requirement, rather than writing two separate systems.

If no card matches a filter, `#projects-empty` ("No projects match this
filter.") is shown — currently unreachable with only three tagged projects,
but kept so the UI doesn't go silently blank if a project is removed later
without updating the filter buttons.

### 2. Dev-advice widget (data handling + error handling)

A small card in the hero fetches a random tip from `api.adviceslip.com`, a
public, CORS-enabled, keyless API, both on page load and when the "New tip"
button is clicked.

```js
Promise.race([fetch(API_URL), timeout])
```

`fetch` has no built-in timeout, so a hung request would leave the button
disabled and the text reading "Loading…" forever. Racing it against a
`Promise` that rejects after 6 seconds guarantees the user always gets an
outcome.

States handled:

| Situation | What the user sees |
| --- | --- |
| Request in flight | "Loading a tip…", button disabled |
| Success | The fetched tip, saved to `localStorage` under `lastAdvice` |
| Failure, cached tip exists | The last successful tip, labelled "(saved tip — couldn't reach the server just now)" |
| Failure, no cache | "Couldn't load a tip right now. Check your connection and try again.", styled in the error colour |

The `localStorage` read/write is wrapped in `try/catch`, consistent with the
theme toggle's storage handling from Assignment 1 — private-browsing modes
can throw rather than silently fail.

### 3. Scroll-reveal animation (transitions)

The `About`, `Skills`, and `Contact` sections carry a `.reveal` class. A
second, independent `IntersectionObserver` (separate from the one that
highlights the nav) watches them with `threshold: 0.15` and adds
`.is-visible` the first time 15% of a section is on screen, then
`unobserve()`s it — the reveal happens once, not every time the section
scrolls in and out, which the assignment brief's "avoid distracting effects"
guideline argues against.

```css
.reveal { opacity: 0; transform: translateY(24px); transition: opacity .6s ease, transform .6s ease; }
.reveal.is-visible { opacity: 1; transform: none; }
```

Project cards get a separate, smaller hover effect — `translateY(-4px)` plus
a soft shadow — satisfying the assignment's "hover effect on a card"
requirement independently of the reveal/filter animation.

**Reduced motion and no-JS fallbacks.** The existing
`@media (prefers-reduced-motion: reduce)` rule from Assignment 1 disables all
transitions globally; since the JS still adds `.is-visible` on schedule, a
reduced-motion visitor still ends up with the same final, fully-visible
state — just without the animated path there. Separately, because `.project`
and `.reveal` start at `opacity: 0` in CSS, a visitor with JavaScript blocked
entirely would never see that class added — so a `<noscript>` block in
`<head>` forces both back to `opacity: 1; transform: none; display: block;`
if scripting is unavailable.

---

## Everything else

The HTML landmark structure, design-token system, theme toggle, time-of-day
greeting, nav highlighting, lightbox, form validation, responsive
breakpoints, and browser-compatibility notes are unchanged from Assignment 1
and are not repeated in this document.

## Known limitations and next steps

- The advice widget depends on a third-party API staying available; if
  `api.adviceslip.com` goes down permanently, that one feature degrades to
  the cached-tip or error state rather than failing outright, but it won't
  show *new* tips.
- The project filter's categories (Java/Python/Verilog) are hand-matched to
  the three current projects; adding a project in a new language needs both
  a new `data-tags` value and a new filter button.
- There is no automated test suite in this repository. Before submission the
  features were checked with a one-off headless-browser script: the filter, the
  advice widget (success, failure, timeout and cached fallback, with the API
  mocked), form validation, theme persistence, the lightbox, the scroll reveal,
  a 375 px phone layout, and the page with JavaScript disabled. The script is
  kept with the AI evidence rather than in this repository.
