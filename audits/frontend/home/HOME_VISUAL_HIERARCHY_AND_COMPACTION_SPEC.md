# HOME VISUAL HIERARCHY & COMPACTION SPECIFICATION

**MH-OS Home Executive Operating Surface**

---

## 1. Executive Scan Hierarchy

- **Visual Scan Order:**
  1. Executive Health Strip (topmost, always visible)
  2. Next Best Action (primary actionable focus)
  3. Workforce Room (AI specialist grid, compact)
  4. Workflow Chain (orchestration, compact, persistent)
  5. Escalation Lane (always visible, calm, persistent)
  6. Executive Snapshot (secondary, recedes visually)
  7. AI Guidance (passive, muted, bottom or side)
  8. Operational Surfaces (lowest, background)
- **Primary Surfaces:** Health Strip, Next Best Action, Workforce Room
- **Secondary Surfaces:** Workflow Chain, Escalation Lane
- **Passive Surfaces:** Executive Snapshot, AI Guidance, Operational Surfaces
- **Escalation Visibility:** Always visible, never occluded, but calm and non-alarming unless active
- **AI Guidance Hierarchy:** Passive, never competes with primary actions
- **Compaction:** Workforce Room, Workflow Chain, and Escalation Lane must remain compact at all times
- **Receding Elements:** Executive Snapshot, AI Guidance, legacy dashboard blocks

---

## 2. Surface Weight System

- **Heavy Surfaces:** Health Strip, Next Best Action (visual weight, prominence)
- **Medium Surfaces:** Workforce Room, Workflow Chain
- **Lightweight Surfaces:** Escalation Lane, Executive Snapshot
- **Persistent Surfaces:** Health Strip, Escalation Lane
- **Passive Informational:** AI Guidance, Operational Surfaces
- **Visual Weight Rules:**
  - Only one heavy surface per scan zone
  - Medium surfaces must not compete with heavy
  - Lightweight surfaces use muted backgrounds, minimal borders
- **Card Weight:**
  - Only primary cards (e.g., active specialist) may use strong outlines or shadows
  - All others use flat, borderless, or subtle separation
- **Spacing:**
  - Minimal vertical gaps, tight horizontal compaction
  - No double padding or excessive whitespace
- **Border/Shadow:**
  - Shadows only for heavy/active cards
  - Borders: 1px, muted, or none
- **Calmness:**
  - No harsh contrasts, no animation by default

---

## 3. Typography System

- **Hierarchy:**
  - Executive: Large, bold, high-contrast
  - Primary Action: Slightly smaller, bold
  - Operational Metadata: Small, semi-bold, muted
  - Escalation: Medium, bold, alert color only if active
  - Workflow: Medium, regular, clear
  - AI Guidance: Small, muted, italic or lighter
- **Sizing Philosophy:**
  - 1.25x step for each hierarchy level
  - Never below 13px for metadata
- **Line-Height:**
  - Tight (1.2–1.35) for all compact surfaces
- **Truncation:**
  - All summaries and names truncated with ellipsis if overflow
- **Wrapping:**
  - No wrapping in compact mode; wrap only in expanded or mobile
- **Compactness:**
  - All secondary text single-line by default

---

## 4. Workforce Compaction Rules

- **Specialist Density:**
  - Max 5 visible specialists in primary grid
  - Overflow collapses to pill or avatar row
- **Summary Length:**
  - Max 40 characters, ellipsis if overflow
- **Compact Mode:**
  - All supporting specialists collapsed to avatars or initials
- **Active Specialist Dominance:**
  - Only one active specialist card may be visually dominant
- **Supporting Collapse:**
  - All non-active specialists collapse to icon/avatar row

---

## 5. Workflow Chain Compaction

- **Max Visible Steps:** 5
- **Overflow Handling:**
  - Overflow steps collapse to a single pill with count (e.g., '+3')
- **Blocked-State:**
  - Blocked steps shrink to icon + state only
- **Escalation Visibility:**
  - Escalation always visible, but calm unless active
- **Orchestration Pressure:**
  - Only show orchestration pressure (e.g., overdue) as a subtle badge

---

## 6. Dashboard Legacy Removal Strategy

- **Patterns to Remove:**
  - Card wall, grid blocks, legacy dashboard panels
- **Classic Cards:**
  - Shrink to ribbon or pill format
- **Surfaces to Ribbon:**
  - Next Best Action, Workflow Chain, Escalation Lane
- **Flattening:**
  - Remove all raised panels, flatten all backgrounds

---

## 7. Executive Calmness Doctrine

- **Visual Silence:**
  - No animation, no flashing, no color cycling
- **Whitespace:**
  - Only enough for scan clarity, never for decoration
- **Orchestration Rhythm:**
  - Surfaces update only on action or state change
- **Visual Pacing:**
  - No more than one heavy surface per viewport
- **Motion Restraint:**
  - Motion only for critical state changes, never for passive info

---

## 8. Responsive Density Rules

- **Desktop:**
  - Max density, all compaction rules active
- **Tablet:**
  - Collapse secondary surfaces, reduce visible specialists to 3
- **Mobile:**
  - Only Health Strip, Next Best Action, and compact Workforce visible by default
- **Collapse Behavior:**
  - All secondary/tertiary surfaces collapse to icons or pills
- **Overflow:**
  - All overflow handled by pill or avatar row
- **Compact Orchestration:**
  - Workflow Chain and Escalation Lane collapse to single row

---

## 9. Motion Preparation Doctrine

- **Allowed Motion:**
  - Only for Workflow Chain step transitions, Escalation activation, and Next Best Action highlight
- **Forbidden Motion:**
  - No motion for passive info, metadata, or background surfaces
- **Orchestration Motion:**
  - Subtle fade/slide for step changes only
- **Escalation Motion:**
  - Pulse or highlight only on new escalation

---

## 10. AI Operating Identity

- **AI-Native:**
  - Dynamic Workforce Room, live Workflow Chain, persistent Escalation Lane, context-aware Next Best Action
- **Legacy-Dashboard:**
  - Card wall, grid blocks, static summary panels
- **Visual Disappearance:**
  - All legacy dashboard blocks, card walls, and static panels should fade out over time

---

## 11. Strategic UI Recommendations

- **Immediate Priorities:**
  - Remove card wall/grid blocks
  - Compact Workforce Room and Workflow Chain
  - Make Escalation Lane persistent and calm
  - Move Executive Snapshot lower
- **What NOT to Add:**
  - No new dashboard blocks, no new card walls, no new static panels
- **Move to Secondary Pages:**
  - Deep analytics, historical reports, legacy summaries
- **Remain Static:**
  - Health Strip, unless critical state change
- **Become Dynamic Later:**
  - AI Guidance, Executive Snapshot

---

## 12. Success Criteria

- Home feels premium (minimal, clear, modern)
- Home feels calm (no visual noise, no animation)
- Home feels operational (all actions and states visible at a glance)
- Home feels AI-native (dynamic, context-aware, persistent AI surfaces)
- Executives can scan instantly (clear hierarchy, no clutter)
- Orchestration feels effortless (workflow and escalation always visible, never overwhelming)

Operational rhythm ensures:
- surfaces feel connected
- information appears progressive
- orchestration feels continuous
- scan flow remains uninterrupted
- transitions preserve executive focus

Executive silence means:
- no decorative motion
- no visual shouting
- no unnecessary color alerts
- no visual clutter
- no attention competition between surfaces

AI trust visibility requires:
- AI recommendations remain explainable
- escalation states remain understandable
- workflow continuity remains visible
- orchestration never appears random
- users always understand why the system suggests action