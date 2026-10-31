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

The first commit records the working interaction and original concept. A follow-up will record verification, accessibility and recovery refinements, and the README screenshot. Commit dates represent actual development; no earlier dates are fabricated.
