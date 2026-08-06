# Warfarin CDSS v2.2 Test Report

Date: 2026-08-04

## Static validation

- JavaScript syntax checked for every `.js` module with Node.js `--check`.
- All JavaScript `document.getElementById` references were compared with HTML IDs: no missing IDs.
- HTML IDs checked for duplicates: none found.
- All script files referenced by `index.html` exist.

## Regimen planner tests

Tested weekly targets: 14, 17.5, 21, 22.5, 35, and 52.5 mg/week.

For each target:

- Generated 1–3 unique candidates.
- Candidate total matched target weekly dose.
- Each candidate contained seven days.
- Every daily dose could be composed from selected strengths.
- Thirty-day supply plus two buffer days produced 32 dated doses.
- Recommended dispensing quantities were non-negative whole tablets.

Additional cases:

- No-split mode rejects doses not aligned to a whole-tablet step instead of silently rounding.
- Half-tablet and quarter-tablet decomposition tested.
- Restricted-strength generation tested with only 3 mg and 5 mg tablets.
- Patient on-hand inventory is subtracted before whole-tablet rounding.

## Clinical safety boundaries retained

- Pregnancy and procedural hard stops unchanged.
- INR ≥4.5 remains clinician-review/hard-stop territory.
- Markedly subtherapeutic mechanical-valve cases are not automatically dosed.
- No booster, bridging, reversal, or automatic DOAC prescribing logic was imported from the reference file.

## Limitation

A full browser automation suite is not bundled. The included `tests/engine-tests.html` can be opened locally to run browser-based engine tests.
