#!/usr/bin/env python3
"""Build the search index behind the homepage "Ask anything else" row.

    python3 scripts/build_faq_index.py

Reads every published page and writes one passage per heading: the heading plus the first
couple of sentences under it, stripped of MDX. The homepage fetches this once, the first time
someone asks a question, and scores it in the browser.

Output is faq-index.txt, not .json: `mint dev` serves root .txt files but not .json, and the
index is useless if it 404s in the preview. The content is JSON either way.
"""
from __future__ import annotations

import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "faq-index.txt"
SOURCES = [
    ("docs", "/docs/"),
    ("recipes", "/recipes/"),
    ("api-reference", "/api-reference/"),
]
SINGLES = [("agents.mdx", "/agents"), ("legal.mdx", "/legal")]
TABLE_RULE = re.compile(r"^\s*\|?[\s|:-]{5,}\|?\s*$")
MAX_PASSAGES = 6          # per page, from the top
PASSAGE_CHARS = 260
SKIP = {"recipes/overview.mdx"}   # its own cards duplicate every recipe
# Dozens of near-identical state disclosure pages would crowd out build content on generic words.
# They are still published; they just do not belong in a "how do I build this" answer.
SKIP_PATTERNS = (
    "kiosk-disclosures", "refund-policies", "licenses-and-disclosures", "state-complaints",
    "promotional-material", "texas-statements", "bitlicense", "privacy", "terms-of-service",
    "code-of-conduct", "tax-guidelines", "forms-", "legal",
    # one-off migration notices: accurate, but not an answer to "how do I build this"
    "preparing-for-the-ethereum",
)


def clean(md: str) -> str:
    md = re.sub(r"```.*?```", " ", md, flags=re.S)                  # code blocks
    md = re.sub(r"(?m)^\s*\|?[\s|:-]{5,}\|?\s*$", " ", md)          # table rules
    md = re.sub(r"<[^>]+>", " ", md)                                 # jsx and html
    md = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", md)                    # images
    md = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", md)                 # links keep their text
    md = re.sub(r"[`*_>#|]", " ", md)
    md = md.replace("\\<", "<").replace("&amp;", "&")
    return re.sub(r"[ \t]+", " ", md)


def frontmatter(text: str) -> tuple[dict, str]:
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    if not m:
        return {}, text
    fm = {}
    for line in m.group(1).split("\n"):
        k, _, v = line.partition(":")
        if _ and not line.startswith(" "):
            fm[k.strip()] = v.strip().strip('"')
    return fm, text[m.end():]


def passages(body: str) -> list[dict]:
    out, current, buf = [], None, []

    def flush():
        if current is None:
            return
        text = clean(" ".join(buf)).strip()
        if len(text) > 30:
            out.append({"h": current, "t": text[:PASSAGE_CHARS].rsplit(" ", 1)[0]})

    fenced = False
    for line in body.split("\n"):
        if line.lstrip().startswith("```"):     # a passage may cut a code block in half,
            fenced = not fenced                 # so skip code line by line rather than by regex
            continue
        if fenced:
            continue
        if TABLE_RULE.match(line):              # buf is joined before clean(), so a line-based
            continue                            # rule has to be dropped here, not there
        h = re.match(r"^(#{2,4})\s+(.*)", line)
        if h:
            flush()
            current, buf = clean(h.group(2)).strip(), []
        elif current is not None:
            if len(" ".join(buf)) < PASSAGE_CHARS * 2:
                buf.append(line)
        elif line.strip():
            current, buf = "", [line]           # intro text before the first heading
    flush()
    return out[:MAX_PASSAGES]


def main() -> None:
    pages = []
    files = [(p, prefix) for folder, prefix in SOURCES for p in sorted((ROOT / folder).glob("*.mdx"))]
    files += [(ROOT / name, path) for name, path in SINGLES]
    for path, prefix in files:
        rel = str(path.relative_to(ROOT))
        if rel in SKIP or not path.exists():
            continue
        if any(pat in path.stem for pat in SKIP_PATTERNS):
            continue
        fm, body = frontmatter(path.read_text(encoding="utf-8"))
        url = prefix if prefix.startswith("/") and not prefix.endswith("/") else prefix + path.stem
        entry = {
            "u": url,
            "t": fm.get("title") or path.stem.replace("-", " ").title(),
            "d": fm.get("description", ""),
            "p": passages(body),
        }
        if entry["p"] or entry["d"]:
            pages.append(entry)
    OUT.write_text(json.dumps({"pages": pages}, separators=(",", ":"), ensure_ascii=False) + "\n", encoding="utf-8")
    n = sum(len(p["p"]) for p in pages)
    print(f"wrote {OUT.name}: {len(pages)} pages, {n} passages, {OUT.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
