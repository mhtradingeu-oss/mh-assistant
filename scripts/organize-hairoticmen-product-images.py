#!/usr/bin/env python3
import argparse
import os
import re
import shutil
from pathlib import Path

ROOT = Path(os.environ.get("MH_ASSISTANT_ROOT", Path(__file__).resolve().parents[1]))
PROJECT = os.environ.get("MH_IMAGE_PROJECT") or os.environ.get("MH_DEFAULT_PROJECT") or "project-name"
IMAGES_ROOT = ROOT / f"data/brand-assets/{PROJECT}/products/images"

IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp"}

def slugify(name: str) -> str:
    name = name.lower().strip()
    name = re.sub(r"\b(\d+)\s*ml\b", r"\1ml", name)
    name = re.sub(r"\b(\d+)\s*ltr\b", r"\1ltr", name)
    name = re.sub(r"\b(\d+)\s*l\b", r"\1l", name)
    name = re.sub(r"[^a-z0-9]+", "-", name)
    name = re.sub(r"-+", "-", name)
    return name.strip("-")

def clean_product_name(path: Path) -> str:
    return path.stem.strip()

def is_junk(path: Path) -> bool:
    name = path.name
    return (
        name == ".DS_Store"
        or name.startswith("._")
        or path.suffix.lower() not in IMAGE_EXTS
    )

def unique_target(path: Path) -> Path:
    if not path.exists():
        return path
    stem = path.stem
    suffix = path.suffix
    parent = path.parent
    i = 2
    while True:
        candidate = parent / f"{stem}-{i}{suffix}"
        if not candidate.exists():
            return candidate
        i += 1

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="Actually move files. Without this, dry-run only.")
    parser.add_argument("--delete-junk", action="store_true", help="Delete .DS_Store and AppleDouble files.")
    args = parser.parse_args()

    if not IMAGES_ROOT.exists():
        raise SystemExit(f"Missing images root: {IMAGES_ROOT}")

    files = sorted([p for p in IMAGES_ROOT.iterdir() if p.is_file()])
    if not files:
        print("No direct product image files found in images root.")
        return

    moved = 0
    skipped = 0
    junk = 0

    print(f"=== {PROJECT} product image organizer ===")
    print(f"Mode: {'APPLY' if args.apply else 'DRY RUN'}")
    print(f"Images root: {IMAGES_ROOT}")
    print("")

    for src in files:
        if is_junk(src):
            junk += 1
            if args.delete_junk:
                print(f"[JUNK DELETE] {src.name}")
                if args.apply:
                    src.unlink(missing_ok=True)
            else:
                print(f"[JUNK SKIP] {src.name}")
            continue

        product_name = clean_product_name(src)
        slug = slugify(product_name)
        if not slug:
            skipped += 1
            print(f"[SKIP] Cannot slugify: {src.name}")
            continue

        target_dir = IMAGES_ROOT / slug
        target = unique_target(target_dir / "front.png")

        print(f"[MOVE] {src.name}")
        print(f"  -> {target.relative_to(ROOT)}")

        if args.apply:
            target_dir.mkdir(parents=True, exist_ok=True)
            shutil.move(str(src), str(target))

        moved += 1

    print("")
    print("=== Summary ===")
    print(f"Moved/planned: {moved}")
    print(f"Junk found: {junk}")
    print(f"Skipped: {skipped}")
    print("")
    if not args.apply:
        print("Dry-run only. To apply:")
        print(f"MH_IMAGE_PROJECT={PROJECT} python3 scripts/{Path(__file__).name} --apply --delete-junk")

if __name__ == "__main__":
    main()
