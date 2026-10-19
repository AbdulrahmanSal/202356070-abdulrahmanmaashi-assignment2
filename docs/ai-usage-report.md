# AI Usage Report

## 1. Tools used and use cases

| Tool | Where I used it |
| --- | --- |
| Claude (Anthropic) | Designing and building the three new interactive features, explaining specific implementation choices, and updating all three documentation files for Assignment 2 |

I gave Claude the Assignment 2 brief and my existing Assignment 1 repository
as the starting point, as the brief requires. I asked for one feature from
each required category — dynamic content, data handling, and animation —
rather than every option listed, matching the brief's "choose one that fits"
guidance. I picked the project filter, the public-API advice widget, and a
scroll-reveal animation, then reviewed each piece as it was built rather than
accepting the whole thing at once.

## 2. Benefits and challenges

### Benefits

- **Choosing a real public API quickly.** I didn't know which public APIs
  are reliable, keyless, and CORS-enabled for a browser `fetch` call without
  a backend. Claude suggested `api.adviceslip.com`, which fit the "fun
  facts" example in the brief and didn't need an API key or server-side
  proxy.
- **Catching a failure mode I hadn't thought of.** I hadn't considered that
  a `fetch` request could hang indefinitely rather than fail outright. The
  `Promise.race` timeout pattern was new to me.
- **Keeping the filter and the entrance animation from being two separate
  systems.** My first instinct was to build the project-filter transitions
  and the "fade in on page load" animation separately. Reusing one
  `applyFilter('all')` call on page load for both was a simplification I
  wouldn't have landed on alone.

### Challenges

- **Scope creep risk.** The brief only requires one feature per category; it
  would have been easy to end up with a page that looks over-engineered
  given the brief's own note to focus on "interactivity and usability rather
  than trying to build a perfect design." I kept the three features but
  pushed back on adding more (no tabs, no live search) to stay within that
  spirit.
- **Understanding the animation timing before accepting it.** The
  fade-out-then-hide sequencing on the project filter uses a 250ms
  `setTimeout` that has to match the CSS transition duration exactly, or a
  card would either flash hidden early or sit invisible-but-still-in-the-grid
  for a moment. I asked for this to be explained rather than just trusting
  that the numbers matched, since a mismatch wouldn't throw an error — it
  would just look subtly wrong.
- **Deciding what *not* to add.** Claude's first pass of suggestions included
  more than the brief asks for; narrowing it to one feature per required
  category was a decision I made, not something generated for me.

## 3. Learning outcomes

- **`Promise.race()` as a timeout pattern.** `fetch()` has no built-in
  timeout option. Racing the real request against a `Promise` that rejects
  after a fixed delay is a reusable pattern I hadn't needed before — if the
  API hangs, the user still gets a timely error instead of a frozen "Loading…"
  state.
- **Why the one-frame delay matters for CSS transitions.** Removing `hidden`
  and adding the class that triggers the transition in the exact same
  tick lets the browser treat it as one state change instead of two, so the
  animation never plays. Wrapping the class addition in
  `requestAnimationFrame` forces the browser to paint the "hidden-but-not-yet-
  faded-in" state first. I had not run into this before and would likely have
  shipped a filter that visually "snapped" instead of faded.
- **`IntersectionObserver.unobserve()`.** I learned that a reveal animation
  that should only happen once needs to explicitly stop observing after it
  fires, or it would (depending on options) keep responding to the element
  scrolling in and out, which the assignment brief specifically warns against
  ("avoid distracting or heavy effects").
- **Reduced motion and no-JS are different problems.** I had assumed
  `prefers-reduced-motion` alone would cover accessibility here. It doesn't
  cover a visitor with JavaScript disabled entirely, since in that case the
  class that reveals the content never gets added at all — the existing CSS
  transition rule and the content actually being shown are two separate
  concerns, which is why the site now also has a `<noscript>` fallback.

## 4. Responsible use and modifications

- **I chose the scope**, not Claude: one feature per required category,
  explicitly declining to add more despite it being technically easy to pile
  on additional interactivity, because the brief asks for focus over
  polish.
- **I chose the filter categories** (Java/Python/Verilog) to match my actual
  three projects from Assignment 1, rather than generic placeholder tags.
- **I asked for explanations**, not just working code, for the two trickiest
  mechanics — the `Promise.race` timeout and the fade/hide timing — and can
  account for both (see the Understanding check below).
- **Documentation was reviewed and updated to match the real build**: the
  technical documentation and README describe the features as actually
  implemented in `script.js` and `styles.css`, not a generic description of
  what such a feature could look like.
- **This report describes this conversation's real work** — the filter, the
  advice widget, and the reveal animation — not invented example exchanges.

**Understanding check.** I can explain, without looking anything up: why
`fetch()` needs to be raced against a timeout `Promise` rather than given a
timeout option directly, why the project filter adds its visibility class a
frame after removing `hidden` instead of in the same step, and why
`unobserve()` is called inside the scroll-reveal's `IntersectionObserver`
callback.
