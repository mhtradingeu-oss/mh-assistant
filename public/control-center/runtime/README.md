# Control Center Runtime Modules

## Goal
Gradually decompose the legacy Control Center runtime into isolated operational modules.

---

# Why This Exists

Current issues:
- app.js owns too many systems
- command runtime is tightly coupled
- shell state is distributed
- overlay lifecycle is fragmented
- responsive ownership is duplicated
- runtime and CSS overlap responsibilities

This directory will contain the canonical runtime decomposition.

---

# Planned Runtime Modules

## command-runtime.js
Owns:
- command lifecycle
- command overlay
- command state
- keyboard interactions
- command accessibility
- command focus management

---

## shell-runtime.js
Owns:
- viewport mode
- shell state
- responsive shell behavior
- mobile shell classes

---

## sidebar-runtime.js
Owns:
- sidebar lifecycle
- sidebar responsive behavior
- sidebar overlay state

---

## overlay-runtime.js
Owns:
- overlay coordination
- backdrop lifecycle
- interaction locks
- overlay accessibility

---

## topbar-ui.js
Owns:
- operational context rendering
- topbar visual state
- workspace context rendering
- AI operational actions

NO shell runtime ownership.

---

# Critical Rules

## Never
- move multiple runtime systems at once
- rewrite runtime behavior blindly
- combine redesign with extraction

## Always
- extract smallest stable units
- preserve runtime behavior
- preserve accessibility
- preserve mobile behavior
- commit every stable milestone

---

# Current Phase

Runtime Mapping + Isolation Planning

No production runtime extraction has started yet.

