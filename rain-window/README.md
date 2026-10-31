# Rain Window — a day for a walk

An interactive archive for someone curious about choosing a day outdoors in Hong Kong. Instead of only looking at a static rainfall calendar, set a personal daily rain limit, choose a date, and compare that date with the limit. Then find the next date that fits. This is a retrospective experiment using 2025 modelled daily rainfall, **not a weather forecast or a trip-planning service**.

## Run

Requires Python 3 to serve files and a modern browser with JavaScript. There are no package installs, API keys, accounts, fonts from a CDN or runtime external-service dependencies.

From this folder:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open <http://127.0.0.1:8000/>. Stop the server with Ctrl+C. If running from the parent repository, open <http://127.0.0.1:8000/rain-window/> instead. Do not double-click index.html: browser restrictions can prevent loading the JSON over file://.

## Main interaction

1. Choose a month and set a daily rain limit from 0 to 30 mm.
2. Green dates have rain **at or below** that limit; other dates are above it. Every date shows the original daily amount, so colour is not the only feedback.
3. Select a date to see its exact rain and the difference from your limit. Orange outlines the selection independently of whether it matches.
4. Use **Find next matching day** to search forward within the month. The search wraps to the beginning with an explicit message. With no match, it suggests changing the limit or month. Repeated clicks move through matches; there are no network requests or accumulated side effects.
5. **Reset** restores 24 September and a 5 mm limit. No choices are persisted or transmitted.

## Data and credits

`data/rainfall-2025.json` is a byte-for-byte copy of the snapshot used by the earlier `hong-kong-rainfall` project in this repository, retrieved on 29 September 2026. Source: [Open-Meteo Historical Weather API](https://open-meteo.com/en/docs/historical-weather-api), ERA5 reanalysis; attribution under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Requested coordinates: 22.3193 N, 114.1694 E; returned model grid: 22.50 N, 114.25 E. All 365 dates use Asia/Hong_Kong. SHA-256: `ac6b76144b3cc60ecb7095405c0616d91c61be09b166d8c63242cbfaf8078527`.

The earlier assignment supplied the data and calendar idea. This new folder is independently runnable and adds deliberate input, threshold filtering, selected-date feedback, forward search, reset and loading recovery. Its HTML, CSS, JavaScript and small SVG icon were written with Codex assistance; no tutorial code, third-party UI framework, borrowed images or course-template implementation is included. See [PROCESS.md](PROCESS.md).

## Limitations and submission status

A daily total hides the time and duration of rain. One reanalysis grid cell is not a station observation or a citywide average. Matching a personal threshold says nothing about warnings, comfort or safety. The archive covers 2025 only. There is no hosted live version configured; the source can run locally with the command above. A screenshot and verification notes will accompany the completed version.

The assignment requires a trial with another person. That trial is pending and must be recorded from real observation before claiming the full assignment is complete. This folder lives inside the requested public course repository; submit the repository URL with a pointer to `rain-window/` and check any instructor-specific repository layout requirements.
