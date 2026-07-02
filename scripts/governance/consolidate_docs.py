#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import shutil
from collections import defaultdict
from datetime import datetime
from pathlib import Path

ROOT = Path.cwd()

SOURCE_GLOBS = [
    "program-governance/**/*.md",
    "audits/frontend/final-vision/**/*.md",
    "audits/frontend/final-truth/**/*.md",
    "audits/frontend/final-status/**/*.md",
    "audits/frontend/global-ui-ux-system/**/*.md",
    "audits/frontend/master-upgrade-protocol/**/*.md",
    "audits/frontend/design-system/**/*.md",
    "audits/frontend/page-upgrade-roadmap/**/*.md",
    "audits/frontend/operations-centers/**/*.md",
    "audits/frontend/layout-authority/**/*.md",
    "audits/frontend/runtime/**/*.md",
    "audits/frontend/readiness/**/*.md",
    "runtime-governance/**/*.md",
    "runtime-state/**/*.md",
    "runtime-router/**/*.md",
    "frontend-shell/**/*.md",
    "frontend-architecture/**/*.md",
]

SKIP_PARTS = {
    ".git",
    "node_modules",
    ".next",
    "dist",
    "build",
    "coverage",
    "__pycache__",
    "archives",
}

OUTPUT_DIR = ROOT / "audits" / "system-consolidation" / "master-docs-consolidation"
ARCHIVE_DIR = ROOT / "archives" / "docs-duplicates"


def should_skip(path: Path) -> bool:
    return any(part in SKIP_PARTS for part in path.parts)


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def read_text_safe(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        return path.read_text(encoding="utf-8", errors="replace")


def collect_files() -> list[Path]:
    files: set[Path] = set()
    for pattern in SOURCE_GLOBS:
        for p in ROOT.glob(pattern):
            if p.is_file() and not should_skip(p):
                files.add(p)
    return sorted(files, key=lambda p: str(p))


def write_bundle(files: list[Path], hashes: dict[Path, str]) -> Path:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    bundle = OUTPUT_DIR / "MH_OS_MASTER_SOURCE_BUNDLE.md"

    lines: list[str] = []
    lines.append("# MH-OS Master Source Bundle")
    lines.append("")
    lines.append("> Generated file. Do not treat this as the final master plan. Use it as the consolidated source pack.")
    lines.append("")
    lines.append(f"- Generated at: {datetime.utcnow().isoformat()}Z")
    lines.append(f"- Source file count: {len(files)}")
    lines.append("")
    lines.append("## Source Index")
    lines.append("")
    lines.append("| # | Path | SHA256 |")
    lines.append("|---:|---|---|")
    for i, path in enumerate(files, 1):
        rel = path.relative_to(ROOT)
        lines.append(f"| {i} | `{rel}` | `{hashes[path][:16]}` |")

    lines.append("")
    lines.append("---")
    lines.append("")

    for i, path in enumerate(files, 1):
        rel = path.relative_to(ROOT)
        content = read_text_safe(path).strip()
        lines.append(f"# Source {i}: `{rel}`")
        lines.append("")
        lines.append(f"- SHA256: `{hashes[path]}`")
        lines.append("")
        lines.append("```markdown")
        lines.append(content)
        lines.append("```")
        lines.append("")
        lines.append("---")
        lines.append("")

    bundle.write_text("\n".join(lines), encoding="utf-8")
    return bundle


def write_reports(files: list[Path], hashes: dict[Path, str]) -> tuple[Path, Path]:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    by_hash: dict[str, list[Path]] = defaultdict(list)
    by_name: dict[str, list[Path]] = defaultdict(list)

    for path in files:
        by_hash[hashes[path]].append(path)
        by_name[path.name.lower()].append(path)

    exact_groups = {h: ps for h, ps in by_hash.items() if len(ps) > 1}
    same_name_groups = {n: ps for n, ps in by_name.items() if len(ps) > 1}

    dup_report = OUTPUT_DIR / "DUPLICATE_DOCS_REPORT.md"
    lines: list[str] = []
    lines.append("# Duplicate Docs Report")
    lines.append("")
    lines.append(f"- Generated at: {datetime.utcnow().isoformat()}Z")
    lines.append(f"- Total scanned files: {len(files)}")
    lines.append(f"- Exact duplicate hash groups: {len(exact_groups)}")
    lines.append(f"- Same filename groups: {len(same_name_groups)}")
    lines.append("")
    lines.append("## Exact Duplicates")
    lines.append("")
    lines.append("Only exact duplicates are safe for automatic archiving.")
    lines.append("")
    if not exact_groups:
        lines.append("_No exact duplicate files found._")
    else:
        for h, ps in exact_groups.items():
            lines.append(f"### Hash `{h}`")
            keeper = ps[0]
            lines.append(f"- Keep: `{keeper.relative_to(ROOT)}`")
            for p in ps[1:]:
                lines.append(f"- Archive candidate: `{p.relative_to(ROOT)}`")
            lines.append("")

    lines.append("")
    lines.append("## Same Filename Groups")
    lines.append("")
    lines.append("These are not necessarily duplicates. Review manually.")
    lines.append("")
    if not same_name_groups:
        lines.append("_No repeated filenames found._")
    else:
        for name, ps in same_name_groups.items():
            lines.append(f"### `{name}`")
            for p in ps:
                lines.append(f"- `{p.relative_to(ROOT)}`")
            lines.append("")

    dup_report.write_text("\n".join(lines), encoding="utf-8")

    manifest = OUTPUT_DIR / "CONSOLIDATION_MANIFEST.md"
    m: list[str] = []
    m.append("# MH-OS Docs Consolidation Manifest")
    m.append("")
    m.append(f"- Generated at: {datetime.utcnow().isoformat()}Z")
    m.append("")
    m.append("## Recommended Canonical Master File")
    m.append("")
    m.append("Use this file as the single final system operating model:")
    m.append("")
    m.append("`program-governance/MH_OS_FINAL_EXECUTION_START_PLAN.md`")
    m.append("")
    m.append("## Generated Support Files")
    m.append("")
    m.append("- `audits/system-consolidation/master-docs-consolidation/MH_OS_MASTER_SOURCE_BUNDLE.md`")
    m.append("- `audits/system-consolidation/master-docs-consolidation/DUPLICATE_DOCS_REPORT.md`")
    m.append("")
    m.append("## Rule")
    m.append("")
    m.append("Do not delete semantically similar documents automatically. Archive only exact hash duplicates automatically.")
    manifest.write_text("\n".join(m), encoding="utf-8")

    return dup_report, manifest


def archive_exact_duplicates(files: list[Path], hashes: dict[Path, str]) -> list[tuple[Path, Path]]:
    by_hash: dict[str, list[Path]] = defaultdict(list)
    for path in files:
        by_hash[hashes[path]].append(path)

    moved: list[tuple[Path, Path]] = []
    stamp = datetime.utcnow().strftime("%Y%m%d-%H%M%S")
    archive_root = ARCHIVE_DIR / stamp

    for _, paths in by_hash.items():
        if len(paths) <= 1:
            continue

        # Keep first sorted file as canonical copy.
        for src in paths[1:]:
            rel = src.relative_to(ROOT)
            dest = archive_root / rel
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(src), str(dest))
            moved.append((src, dest))

    return moved


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="Archive exact duplicate files. Default is dry-run only.")
    args = parser.parse_args()

    files = collect_files()
    hashes = {p: sha256_file(p) for p in files}

    bundle = write_bundle(files, hashes)
    dup_report, manifest = write_reports(files, hashes)

    print("===== DOC CONSOLIDATION DRY RUN =====")
    print(f"Scanned files: {len(files)}")
    print(f"Bundle: {bundle}")
    print(f"Duplicate report: {dup_report}")
    print(f"Manifest: {manifest}")

    if args.apply:
        moved = archive_exact_duplicates(files, hashes)
        print("")
        print("===== ARCHIVE EXACT DUPLICATES =====")
        print(f"Moved exact duplicates: {len(moved)}")
        for src, dest in moved:
            print(f"{src} -> {dest}")
    else:
        print("")
        print("Dry-run only. No source files were moved.")
        print("Run with --apply only after reviewing DUPLICATE_DOCS_REPORT.md.")


if __name__ == "__main__":
    main()
