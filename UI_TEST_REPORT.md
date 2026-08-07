# UI v2.3 Regression Test Report

## Scope
Presentation-layer revision with compact clinical header, patient context bar, result hierarchy, workflow styling, and expandable long calendar.

## Results
- JavaScript syntax: PASS for all modules
- HTML IDs: 98
- Duplicate IDs: 0
- Missing JavaScript DOM references: 0
- Unintended calculation-engine hash changes: 0
- CSS brace validation: PASS
- Internal asset references: PASS
- ZIP integrity: tested after packaging

## Functional preservation
All files under `js/engine/`, `js/guidelines/`, `js/components/`, `store.js`, `hash.js`, and `uuid.js` are byte-identical to the Bangkok Hospital Theme baseline. `js/app.js` changed only to populate the new patient context bar.

## Defect found and corrected
The first context-bar implementation read TTR from `result.ttr`; the existing TTR engine returns `result.percent`. This was corrected before packaging.

## Limitations
Automated visual regression screenshots and assistive-technology testing are not bundled. Manual browser review is still recommended at 320, 375, 768, and 1280 px widths.
