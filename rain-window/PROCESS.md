# Process — Rain Window

## Starting idea — 31 October 2026

The student requested a new Assignment 3 folder inside the existing SD5913 repository. The brief asks for an input–response–feedback loop rather than a static image. Codex proposed extending the previous rainfall calendar into a focused retrospective experiment for a person curious about choosing a day outdoors: change the amount of rain you would accept and inspect how the set of eligible days changes. The initial concept was proposed by Codex; the later feedback relayed by the student is recorded below.

## First working implementation

The implementation uses buildless HTML/CSS/JavaScript, a local JSON snapshot, and ordinary browser controls. The loop is: change a slider or choose a date → compare the daily rainfall with the limit → recolour eligible dates and update the selected-day comparison and matching count. A next-date button turns the comparison into another choice; Reset makes it reversible. Exact date values remain visible independently of colour.

This is a new interaction built on Assignment 2's data, not an unchanged static visualisation. The saved original response is copied into this folder so the new project does not depend on sibling paths or a live API.

## AI use and decisions

Codex proposed the concept and wrote the implementation, documentation and tests, and assisted with verification. A suggestion retained was a single daily-rain slider, because its consequence can be seen in the set of matching dates. A suggestion changed was to frame this as a current rain-day planner: the data is historical, so the interface explicitly presents an archive experiment and makes no forecast claims. A dependency-heavy charting framework was rejected in favour of plain date buttons and pure comparison functions, making it easier to run and explain.

## Classmate feedback relayed by the student — recorded 31 October 2026

The student supplied the following wording and attributed it to a classmate who tried the experience. Codex did not observe the session. The session date, initial task instructions and whether an explanation was given beforehand were not supplied, so those details are not asserted here. No name or recording is included.

> 滑块挺容易理解，拖一下就能看到哪些日期符合条件。不过一开始我以为橙色框代表推荐日期，后来才明白它表示当前选中的日期。‘找下一个’会不会跳到下个月，我也有点不确定。

In English: the slider and its effect on matching dates were easy to understand, but the orange outline initially looked like a recommendation rather than the current selection. The participant was also unsure whether the next-date action could move into another month.

### Decision and implemented response

- Keep the slider and immediate date filtering: the reported feedback indicates this relationship was understandable.
- Explain the orange outline beside the calendar: “Green fill = within your limit. Orange outline = your selection.” Rename its legend entry to “Your selection.”
- Rename the action to “Next match in this month” and add persistent help explaining that it stays in the current month and wraps to that month's first matching date. Name the month in the result message as well.

These are wording changes addressing the two reported uncertainties. The selection and search rules remain the same. Codex checked the revised labels at desktop and mobile widths, and confirmed that searching after 30 September selects 1 September while keeping September selected. The existing ten tests still passed. Updated screenshots show the new help and action label. No follow-up classmate trial or improvement in participant performance is claimed.

## Development history

The first commit records the interaction source and original concept. A follow-up records the portability fix, verification, accessibility and recovery refinements, and the README screenshots. A further commit records the student-relayed feedback and the resulting label improvements. Commit dates represent actual development; no earlier dates are fabricated.

## Observed implementation issue and revision

During the first browser run, the page stayed on its loading text. An HTTP check found that this Windows Python server served `.mjs` as `text/plain`. The browser could not execute the module. The files were renamed to `.js`, with a small `package.json` declaring module semantics for optional Node tests. Repeating the same documented Python-server command then loaded the interaction successfully. This is a concrete revision based on an observed failure, not participant feedback.

The calendar also gained arrow/Home/End navigation and a single Tab stop on the selected date. This lets a keyboard user reach the next action without going through up to 31 date buttons. Data loading gained an abort timeout and guarded Retry, keeping ordinary interruptions recoverable.

## Verification completed

- Ten Node built-in tests passed: the 365-date snapshot and 1,853.3 mm annual total, month lengths, inclusive thresholds, search after 24 September returning 26 September at 2.0 mm, wraparound and repeated actions, a no-match month, a single matching day, invalid selections and invalid archive data.
- Browser actions confirmed a 0 mm limit in September shows no matches and an understandable next action; choosing 31 January then February clamps to 28 February; Home and ArrowDown select 1 then 8 February; Reset restores 24 September and 5 mm.
- The new project's JSON copy was temporarily moved, producing a clear HTTP 404 message with unavailable controls hidden. After restoring the file, Try again recovered the calendar. The data checksum still matched the original. The source snapshot in Assignment 2 was never moved or changed.
- Desktop (1280 px) and mobile (390 px) layouts had no horizontal overflow. Mobile date selection updated the result to 26 September, 2.0 mm, within the 5 mm limit. Captured screenshots are in `screenshots/`.

These checks were performed by Codex and automation and are separate from the student-relayed feedback above. A follow-up classmate trial of the revised wording has not been reported. The student should also review the work and be ready to explain `nextMatch` in `engine.js`: it searches forward, wraps once through the month and returns the next day whose rain is at or below the chosen limit; the click handler then updates the selected date and visible feedback.
