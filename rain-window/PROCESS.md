# Process — Rain Window

## Starting idea — 31 October 2026

The student requested a new Assignment 3 folder inside the existing SD5913 repository. The brief asks for an input–response–feedback loop rather than a static image. Codex proposed extending the previous rainfall calendar into a focused retrospective experiment for a person curious about choosing a day outdoors: change the amount of rain you would accept and inspect how the set of eligible days changes. The student requested the assignment work but has not yet supplied feedback on this particular design.

## First working implementation

The implementation uses buildless HTML/CSS/JavaScript, a local JSON snapshot, and ordinary browser controls. The loop is: change a slider or choose a date → compare the daily rainfall with the limit → recolour eligible dates and update the selected-day comparison and matching count. A next-date button turns the comparison into another choice; Reset makes it reversible. Exact date values remain visible independently of colour.

This is a new interaction built on Assignment 2's data, not an unchanged static visualisation. The saved original response is copied into this folder so the new project does not depend on sibling paths or a live API.

## AI use and decisions

Codex proposed the concept and wrote the implementation, documentation and tests, and assisted with verification. A suggestion retained was a single daily-rain slider, because its consequence can be seen in the set of matching dates. A suggestion changed was to frame this as a current rain-day planner: the data is historical, so the interface explicitly presents an archive experiment and makes no forecast claims. A dependency-heavy charting framework was rejected in favour of plain date buttons and pure comparison functions, making it easier to run and explain.

## Trial with another person — pending

No other-person trial has been observed or reported yet. Automated checks and Codex browser testing are implementation verification; neither is presented as a human participant trial.

Suggested neutral task: give someone the running page without a walkthrough and ask, “Find a day you would choose for a walk.” Observe which control they use first, whether they understand the selected date versus matching dates, what they expect from the next-date button, and how they recover when there are no matches. Do not coach them before their first attempt.

Record the actual date, what they tried, a hesitation or comment, and the resulting design change or reason for keeping the design. Names, recordings and personal information are not needed. This section remains pending until that real evidence is available; no participant feedback has been invented.

## Development history

The first commit records the interaction source and original concept. A follow-up records the portability fix, verification, accessibility and recovery refinements, and the README screenshots. Commit dates represent actual development; no earlier dates are fabricated.

## Observed implementation issue and revision

During the first browser run, the page stayed on its loading text. An HTTP check found that this Windows Python server served `.mjs` as `text/plain`. The browser could not execute the module. The files were renamed to `.js`, with a small `package.json` declaring module semantics for optional Node tests. Repeating the same documented Python-server command then loaded the interaction successfully. This is a concrete revision based on an observed failure, not participant feedback.

The calendar also gained arrow/Home/End navigation and a single Tab stop on the selected date. This lets a keyboard user reach the next action without going through up to 31 date buttons. Data loading gained an abort timeout and guarded Retry, keeping ordinary interruptions recoverable.

## Verification completed

- Ten Node built-in tests passed: the 365-date snapshot and 1,853.3 mm annual total, month lengths, inclusive thresholds, search after 24 September returning 26 September at 2.0 mm, wraparound and repeated actions, a no-match month, a single matching day, invalid selections and invalid archive data.
- Browser actions confirmed a 0 mm limit in September shows no matches and an understandable next action; choosing 31 January then February clamps to 28 February; Home and ArrowDown select 1 then 8 February; Reset restores 24 September and 5 mm.
- The new project's JSON copy was temporarily moved, producing a clear HTTP 404 message with unavailable controls hidden. After restoring the file, Try again recovered the calendar. The data checksum still matched the original. The source snapshot in Assignment 2 was never moved or changed.
- Desktop (1280 px) and mobile (390 px) layouts had no horizontal overflow. Mobile date selection updated the result to 26 September, 2.0 mm, within the 5 mm limit. Captured screenshots are in `screenshots/`.

These checks were performed by Codex and automation. The other-person trial above is still pending and must not be inferred from these results. The student should also review the work and be ready to explain `nextMatch` in `engine.js`: it searches forward, wraps once through the month and returns the next day whose rain is at or below the chosen limit; the click handler then updates the selected date and visible feedback.
