# Process — first version

## Starting point and tools

The student asked for simple assignment topics and selected option A: a calendar of Hong Kong rainfall in 2025. Codex proposed the options, inspected the existing assignment folder, downloaded the course template, obtained the public data, wrote the Python scripts and this documentation, and generated the first visualisation. Python's standard library handles the download and JSON; Matplotlib draws the image; uv resolves the declared plotting dependency. This document records the first AI-assisted implementation and is pending the student's review.

## What was kept

The implementation kept the proposed twelve-month calendar because it preserves the familiar rhythm of weeks and months while allowing wet and dry periods to be compared. A restrained sequential green palette maps darker squares to larger amounts. Daily values stay visible as dates, and monthly totals and a labelled colour key explain the encoding. The student selected the rainfall topic, but has not yet approved these detailed visual choices.

## What was rejected

During implementation, Codex rejected treating the requested location as a precise observation station. The API returns 22.50 N, 114.25 E rather than the requested coordinates; the README therefore identifies the returned grid point and explains that ERA5 is reanalysis, not a station measurement. It also rejected combining zero rain and missing data: zero gets a distinct colour, while missing or invalid values cause a clear error. These are implementation decisions made by the assistant, not claims about feedback the student has already given.

## Transformation and limitations

The code reads the publisher's response without modifying it. A loop validates all 365 date/value pairs; another places each day in its calendar position. The load_daily and rain_color functions make the validation and encoding explicit. Daily values are grouped into seven labelled colour bands; this improves visual comparison but loses exact differences within a band. Totals are calculated from the original numbers, not the colour categories. The rain-day count means at least 1 mm. No weather events are inferred from date alone.

## Verification and next iteration

The first run produced a PNG and an SVG. Codex inspected the rendered PNG for readable labels, calendar alignment and clipping. The dataset contains 365 ordered dates, with a total of 1853.3 mm and 167 days at or above 1 mm. The raw response is retained byte-for-byte, with its checksum recorded in the README.

The remaining student decisions are whether this visual style communicates the intended idea, whether modelled data is the preferred source, and what should change in the next iteration. This first version does not claim a multi-day development history. Future changes should be committed when they actually happen, and this document should be updated to record the student's real feedback and decisions.

## Validation completed for this draft

The plotting command also succeeded with uv's offline mode after dependency installation. Additional temporary checks exercised colour-band boundaries and confirmed rejection of null rain, negative rain, duplicate dates, a missing value and incorrect units. The original data checksum remained unchanged after rendering.

The official checker passed README, process, script and picture checks. On the uncommitted Windows subfolder its file fallback used backslashes, falsely reporting no data/ file; its history check read the parent essay repository. Calling the official content-check functions with normalised paths confirmed the draft's file requirements. This does not establish a passing submission: a standalone public repository and genuine rainfall-project commit history remain to be created.
