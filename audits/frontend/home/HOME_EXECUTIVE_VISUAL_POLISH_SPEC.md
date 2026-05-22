# HOME EXECUTIVE VISUAL POLISH SPECIFICATION

## 1. Executive Visual Goal
Deliver a calm, premium, and highly readable executive Home surface that enables rapid operational scan, clear orchestration, and effortless focus transitions. The interface should feel silent, intentional, and visually continuous, supporting executive cognition without distraction or visual fatigue.

## 2. Surface Continuity Rules
- All executive surfaces must visually connect through consistent background gradients, border weights, and radius tokens.
- No abrupt color, shadow, or border transitions between adjacent executive panels.
- Use only the approved gradient and border tokens for all Home executive surfaces.
- Maintain a seamless flow between Workforce Room, Workflow Chain, Escalation Lane, and Executive Strip.

## 3. Visual Silence Rules
- Minimize visual noise: avoid unnecessary icons, lines, or decorative elements.
- Use muted color tokens for secondary and meta information.
- Avoid drop shadows except where required for focus or separation.
- Keep backgrounds and overlays subtle and non-distracting.

## 4. Premium Spacing Rhythm
- Apply only spacing tokens (density, gap, padding) defined in the global system.
- Maintain a consistent vertical rhythm between all executive surfaces.
- Use compact and medium density tokens for all gaps and padding.
- No custom pixel values for spacing; only tokens.

## 5. Alignment & Edge Discipline
- All executive panels must align to the same left and right grid edges.
- Text, icons, and indicators must align to the baseline grid.
- No floating or misaligned elements; use flex/grid alignment primitives.
- Maintain consistent border radius and edge discipline for all cards and chips.

## 6. Home Surface Priority Order
1. Executive Health Strip
2. Next Best Action
3. Workforce Room
4. Workflow Chain
5. Escalation Lane
6. Executive Snapshot
7. AI Guidance Panel

## 7. What Must Stay Quiet
- All meta, summary, and secondary text
- Escalation Lane backgrounds and borders
- Workflow Chain connectors and inactive steps
- Workforce Room supporting specialists
- All non-primary indicators

## 8. What May Receive Subtle Emphasis
- Active specialist in Workforce Room
- Current step in Workflow Chain
- Critical escalation severity
- Executive Health Strip primary value
- Next Best Action title and urgency

## 9. Forbidden Polish Patterns
- Custom colors, gradients, or shadows outside the token system
- Heavy drop shadows or glows
- Overlapping or floating elements
- Animation or motion beyond focus/hover states
- Large icons or visual metaphors
- Card-like heavy backgrounds
- Unaligned or uneven edge treatments

## 10. Safe Implementation Order
1. Validate all typography and density tokens are applied
2. Polish surface continuity (backgrounds, borders, radius)
3. Refine spacing rhythm (gap, padding, margin)
4. Align all panels and content to grid/edge
5. Silence meta and secondary elements
6. Apply subtle emphasis to primary/active states
7. Final QA for visual noise and scan speed

## 11. Validation Checklist
- [ ] All surfaces use only approved tokens
- [ ] No custom spacing or color values
- [ ] All panels align to grid edges
- [ ] No visual noise or unnecessary elements
- [ ] Primary/active states are subtly emphasized
- [ ] Meta/secondary elements are visually quiet
- [ ] No forbidden polish patterns present
- [ ] Executive scan is smooth and effortless

## 12. Success Criteria
- Home surface feels calm, premium, and visually silent
- Executive scan is rapid and low effort
- No visual competition or cognitive overload
- All surfaces are visually continuous and aligned
- Only intended elements receive emphasis
- No forbidden patterns or overrides present
