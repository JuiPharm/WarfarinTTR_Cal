# Clinical Web Application Design System

> **Purpose:** Reusable UI/UX standard for professional healthcare and other high-trust workflow applications.  
> **Scope:** Presentation, interaction, accessibility, workflow state, responsive behavior, and design governance.  
> **Non-goal:** This document does not define domain calculations, clinical rules, authorization policy, or business logic.

## 1. Design objectives

1. **Trust before decoration** — The interface must look stable, restrained, and predictable.
2. **Task completion before marketing** — Professional tools should optimize the workflow rather than imitate a public website.
3. **Context preservation** — Keep the current subject, status, and critical values visible while users move between steps.
4. **Safety before convenience** — Blocked, stale, or incomplete results must never look actionable.
5. **Progressive disclosure** — Show essential information first and reveal detailed tables, calendars, logs, or advanced settings on demand.
6. **Accessibility by default** — Keyboard access, readable contrast, semantic labels, and 44×44 px touch targets are baseline requirements.
7. **Presentation is separate from logic** — Theme changes must not modify calculations or domain rules.

## 2. Brand adaptation model

A project may inherit an organizational brand without copying the interaction model of its public website.

Use brand assets for:

- Logo and product lockup
- Primary and accent colors
- Typography family
- Corner radius and illustration style
- Footer and document identity

Do not automatically import:

- Consumer navigation menus
- Promotional hero banners
- Appointment or marketing CTAs unrelated to the workflow
- Decorative imagery that competes with operational information

### Recommended header for professional applications

```text
[Organization logo]  Product name / module              Environment · Data status
```

Recommended desktop height: **64–72 px**. Keep the header compact so the workflow remains visible.

## 3. Semantic color system

Brand colors and semantic colors must have separate responsibilities.

```css
:root {
  --brand-primary: #003366;
  --brand-primary-dark: #002d62;
  --brand-accent: #00a8b5;

  --surface: #ffffff;
  --surface-subtle: #f4f6f9;
  --text-primary: #2c3e50;
  --text-secondary: #667085;
  --border: #d8e1ea;

  --status-success: #067647;
  --status-warning: #9a6700;
  --status-danger: #c9362b;
  --status-info: #175cd3;
}
```

Rules:

- Primary brand color: navigation, major actions, headings.
- Accent/teal: active workflow, health information, secondary CTA.
- Green: completed, confirmed, or within target only.
- Amber: caution, review, incomplete, or stale.
- Red: blocked, destructive, emergency, or hard stop only.
- Never use color as the only indicator; pair it with text, icons, borders, or status labels.

## 4. Typography

Preferred stack:

```css
font-family: "Sarabun", "Noto Sans Thai", Inter, system-ui, sans-serif;
```

Recommended scale:

| Element | Desktop | Mobile | Weight |
|---|---:|---:|---:|
| Product title | 22–28 px | 20–24 px | 700 |
| Page/step title | 24–30 px | 21–25 px | 650–700 |
| Card title | 18–22 px | 17–20 px | 600–650 |
| Body | 15–17 px | 16 px | 400 |
| Metadata | 12–14 px | 13–14 px | 400–600 |

Body line-height should be approximately **1.55–1.7**. Avoid long uppercase labels in Thai.

## 5. Page architecture

A reliable workflow page should follow this order:

1. Compact brand header
2. Global safety or environment notice
3. Session/user controls
4. Sticky context bar
5. Workflow stepper
6. Active step content
7. Sticky or persistent workflow actions
8. Audit/export footer

### Sticky context bar

Show the smallest set of values required to avoid context loss, for example:

```text
Subject · Category/indication · Target/status · Latest result · Quality metric · Current plan
```

The context bar should remain visible on desktop and may become a two-column static block on mobile.

## 6. Workflow states

Every generated result should use an explicit state.

| State | Meaning | UI behavior |
|---|---|---|
| Not generated | No valid output | Empty state; export disabled |
| Current | Matches current inputs | Normal display |
| Stale | Inputs changed after generation | Dim output; warning banner; confirm/export disabled |
| Blocked | A hard stop prevents action | Red status; downstream controls disabled |
| Confirmed | Authorized snapshot | Locked values; show confirmer and timestamp |

A workflow step should similarly support:

- Not started
- Current
- Complete
- Needs review
- Blocked

## 7. Results hierarchy

Separate three concepts visually:

1. **Decision/recommendation** — What the system concludes.
2. **Implementation options** — Alternative plans that satisfy the conclusion.
3. **Operational output** — Quantity, calendar, packet schedule, documents.

### Hero result pattern

```text
Current value → Proposed value     Change
Target/status                       Follow-up
```

Use large numbers for the main decision and keep provenance or explanatory text immediately below.

## 8. Alternative comparison cards

Each option card should contain comparable fields in the same order:

- Option name
- Primary total/result
- Difference from target
- Number of patterns or steps
- Number of resources/items used
- Complexity
- Warning or trade-off
- Explicit “Select this option” action or selected label

Do not distinguish selection by border color alone.

## 9. Tables, calendars, and dense data

- Use the weekly or summary pattern as the primary visualization.
- Put long 30–90-day calendars inside an expandable `<details>` section.
- Keep table headers visible when scrolling.
- Use text labels and accessible descriptions for visual pills, icons, or shapes.
- On mobile, prefer cards or horizontal scrolling over shrinking text below 14 px.
- Print output must remain understandable without color.

## 10. Components

### Buttons

- Primary: filled brand color.
- Secondary: outlined or subtle surface.
- High-priority health CTA: accent/teal when it is not a danger action.
- Destructive: red, with confirmation.
- Minimum interactive target: **44×44 px**.
- Disabled actions must explain what is missing when practical.

### Cards

- Radius: **8–12 px**.
- Shadow: subtle; avoid floating every container.
- Hover elevation only for interactive cards.
- Non-interactive clinical cards should not move on hover.

### Alerts

Use three levels:

1. Global notice — persistent but visually quiet.
2. Contextual warning — appears only when relevant.
3. Hard stop — dominant, blocks downstream action.

Avoid repeated warnings that cause alert fatigue.

### Form fields

- Visible labels are mandatory.
- Show units in labels or adjacent suffixes.
- Use inline validation with a clear correction instruction.
- Never silently coerce or correct a value.
- Keep related fields in groups of two columns on desktop and one column on mobile.

## 11. Responsive behavior

Breakpoints may vary, but the following behavior is recommended:

- Desktop: two-column forms and result panels.
- Tablet: context bar 3 columns; candidate cards 1–2 columns.
- Mobile: one-column content; sticky action bar; context bar 2 columns.
- Large data grids: horizontal scroll or expandable secondary view.
- Header marketing content should collapse before workflow content.

## 12. Accessibility checklist

- WCAG 2.1 AA contrast target.
- Semantic headings in logical order.
- Every input has an associated label.
- Keyboard navigation for all actions and option cards.
- Visible `:focus-visible` indicator.
- Statuses include text, not color alone.
- Charts have text summaries or accessible labels.
- Icons have accessible names or are hidden from assistive technology when decorative.
- Error messages use `role="alert"` when immediate announcement is required.
- Reduced-motion preference is respected.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    transition: none !important;
    animation: none !important;
  }
}
```

## 13. Privacy and trust communication

Use precise statements. For example:

- “Data is processed in this browser.”
- “No clinical data is transmitted by this application.”
- “External brand images may require a network request.”

Do not claim compliance with HIPAA, GDPR, or local health-data law solely because an application uses local storage.

## 14. Theme implementation rule

Theme work should normally be limited to:

```text
index.html presentation markup
css/design-system.css
css/components.css
css/workflow.css
icons and brand assets
```

Calculation engines, business rules, data schemas, and audit behavior must remain unchanged unless the project explicitly requests a functional revision.

Before release, compare hashes or diffs of logic modules against the approved baseline.

## 15. Quality assurance

Minimum checks after a theme change:

- JavaScript syntax passes.
- CSS braces and selectors parse.
- No duplicate HTML IDs.
- Every JavaScript element reference exists.
- All internal assets exist.
- Keyboard navigation works.
- Mobile widths 320, 375, 768, and desktop 1280 px are reviewed.
- Print/PDF view remains readable.
- Domain engine file hashes match the baseline.
- ZIP/build artifact integrity passes.

## 16. Reusable acceptance criteria

- [ ] Brand identity is visible but does not obstruct the workflow.
- [ ] The current subject and critical context remain visible.
- [ ] Primary result is identifiable within three seconds.
- [ ] Recommendation, alternatives, and operational output are visually distinct.
- [ ] Blocked and stale outputs cannot be mistaken for current actionable output.
- [ ] Long secondary content is collapsed by default.
- [ ] Mobile touch targets are at least 44×44 px.
- [ ] Information remains understandable without color.
- [ ] Theme changes do not alter approved calculation logic.
- [ ] Regression checks and artifact integrity pass.
