#!/usr/bin/env python3
"""Rebuild the Recipes tab from the recipes on docs.zerohash.com.

    python3 scripts/build_recipes.py [--refresh]

ReadMe renders recipes client-side, so the page HTML carries nothing. The content comes from
the same JSON endpoint the page calls, which returns every recipe in one response:

    /zerohash/api-next/v2/versions/1.0/recipes

Each recipe has steps (title, prose, and a line range per language) plus the full snippet in
every language it offers. A recipe page here is the walkthrough as Mintlify <Steps>, where each
step shows just its own lines of code, then the complete example, then the sample response.

Writes recipes/*.mdx, recipes/overview.mdx, and the Recipes tab in docs.json. Re-run any time.
"""
from __future__ import annotations

import argparse
import json
import pathlib
import re
import sys
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "recipes"
DOCS_JSON = ROOT / "docs.json"
CACHE = ROOT / ".cache" / "readme" / "recipes.json"
API = "https://docs.zerohash.com/zerohash/api-next/v2/versions/1.0/recipes"

# Sidebar shape. Slugs not listed here still get a page, under "More".
GROUPS: list[tuple[str, list[str]]] = [
    ("REST API", ["rest-api-authentication-1", "liquidity-quote", "convert-withdraw-quote",
                  "fund-get-transactions", "post-trade-settlement-1"]),
    ("Realtime and webhooks", ["websocket-authentication", "webhook-signatures"]),
    ("SDKs", ["web-sdk-integration", "auth-frontend-sdk", "ios-sdk-auth"]),
    ("Connect", ["connect-create-session", "connect-validate-webhook-signature"]),
]
# ReadMe labels its Rust sample as C and its React samples as JavaScript.
FENCE_BY_NAME = {"Rust": "rust", "React": "jsx"}
LINE_COMMENT = {"python": "#", "ruby": "#", "php": "//", "go": "//", "java": "//",
                "javascript": "//", "jsx": "//", "rust": "//", "swift": "//", "c": "//"}
# An SDK recipe's "response" is a placeholder, not something the API returns.
PLACEHOLDER_RESPONSES = {"", "{}", '{"success":true}', '{ "success": true }'}
# Line icons, to match the rest of the site; ReadMe's emoji are left behind.
ICONS = {
    "rest-api-authentication-1": "key-round", "liquidity-quote": "waves",
    "convert-withdraw-quote": "repeat", "fund-get-transactions": "list",
    "post-trade-settlement-1": "handshake", "websocket-authentication": "radio",
    "webhook-signatures": "shield-check", "web-sdk-integration": "square-code",
    "auth-frontend-sdk": "wallet", "ios-sdk-auth": "smartphone",
    "connect-create-session": "plug", "connect-validate-webhook-signature": "shield",
}
# ReadMe left a placeholder description on one recipe.
DESCRIPTIONS = {"fund-get-transactions": "Sign a request and list a customer's Account Funding deposits."}


def fetch(refresh: bool) -> dict:
    if CACHE.exists() and not refresh:
        return json.loads(CACHE.read_text())
    req = urllib.request.Request(API, headers={"User-Agent": "Mozilla/5.0", "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.load(resp)
    CACHE.parent.mkdir(parents=True, exist_ok=True)
    CACHE.write_text(json.dumps(data, ensure_ascii=False))
    return data


def mirrored(slug: str) -> bool:
    return (ROOT / "docs" / f"{slug}.mdx").exists()


def page_title(slug: str) -> str:
    """The mirrored guide's own title, so a bare URL can be linked by name."""
    m = re.search(r'^title:\s*"?([^"\n]+)"?', (ROOT / "docs" / f"{slug}.mdx").read_text(), re.M)
    return (m.group(1).strip() if m else slug.replace("-", " ").title())


def local_link(url: str) -> str:
    """Point a guide link at this site when the page is mirrored here."""
    m = re.fullmatch(r"https://docs\.zerohash\.com/docs/([a-z0-9-]+)(#[\w-]+)?/?", url)
    return f"/docs/{m.group(1)}{m.group(2) or ''}" if m and mirrored(m.group(1)) else url


def prose(text: str) -> str:
    """ReadMe markdown to MDX: autolinks become links, stray angle brackets get escaped."""
    text = (text or "").strip()
    def label(url: str) -> str:
        target = local_link(url)
        if target.startswith("/docs/"):
            slug = target[len("/docs/"):].split("#")[0]
            return page_title(slug)
        return url
    text = re.sub(r"<(https?://[^>\s]+)>", lambda m: f"[{label(m.group(1))}]({local_link(m.group(1))})", text)
    text = re.sub(r"(?<![(\[])\bhttps://docs\.zerohash\.com/docs/[a-z0-9-]+(?:#[\w-]+)?",
                  lambda m: local_link(m.group(0)), text)
    return text.replace("<", r"\<")


def spans(rng: str) -> list[tuple[int, int]]:
    out = []
    for part in (rng or "").split(","):
        part = part.strip()
        if not part:
            continue
        a, _, b = part.partition("-")
        try:
            lo = int(a)
            hi = int(b) if b else lo
        except ValueError:
            continue
        out.append((lo, hi))
    return out


def excerpt(code: str, rng: str, fence: str) -> str | None:
    """The lines a step covers. Gaps between ranges are marked with a comment."""
    parts = spans(rng)
    if not parts:
        return None
    lines = code.split("\n")
    chunks = []
    for lo, hi in parts:
        chunk = lines[max(0, lo - 1):hi]
        if chunk:
            chunks.append("\n".join(chunk))
    if not chunks:
        return None
    # an excerpt lifted out of a function keeps its original indentation; drop the common part
    # before joining, so the gap marker lines up with the code rather than sitting at column 0
    pad = [len(l) - len(l.lstrip()) for c in chunks for l in c.split("\n") if l.strip()]
    cut = min(pad) if pad else 0
    chunks = ["\n".join(l[cut:] if l.strip() else l for l in c.split("\n")) for c in chunks]
    gap = f"{LINE_COMMENT.get(fence, '//')} ..."
    return f"\n{gap}\n".join(chunks)


def fence_of(option: dict) -> str:
    return FENCE_BY_NAME.get(option.get("name") or "", option.get("language") or "text")


def block(code: str, fence: str, title: str, indent: str = "") -> str:
    body = "\n".join(indent + line if line.strip() else line for line in code.rstrip().split("\n"))
    return f"{indent}```{fence} {title}\n{body}\n{indent}```"


def recipe_page(item: dict) -> str:
    content = item["content"]
    options = (content.get("snippet") or {}).get("code_options") or []
    steps = content.get("steps") or []
    title = (item.get("title") or item["slug"]).strip()
    desc = prose(DESCRIPTIONS.get(item["slug"]) or item.get("description") or "")

    out = ["---", f'title: "{title}"']
    if desc:
        out.append(f'description: "{desc.replace(chr(34), chr(39))}"')
    out += ["---", ""]

    if steps:
        out.append("<Steps>")
        for step in steps:
            out.append(f'  <Step title="{(step.get("title") or "Step").strip().replace(chr(34), chr(39))}">')
            body = prose(step.get("body") or "")
            if body:
                out += ["    " + line if line.strip() else "" for line in body.split("\n")] + [""]
            ranges = step.get("line_numbers") or []
            cuts = []
            for i, option in enumerate(options):
                rng = ranges[i] if i < len(ranges) else ""
                text = excerpt(option.get("code") or "", rng, fence_of(option))
                if text:
                    cuts.append((option, text))
            if len(cuts) == 1:
                out += [block(cuts[0][1], fence_of(cuts[0][0]), cuts[0][0].get("name") or "", "    "), ""]
            elif cuts:
                out.append("    <CodeGroup>")
                for option, text in cuts:
                    out += [block(text, fence_of(option), option.get("name") or "", "    "), ""]
                out += ["    </CodeGroup>", ""]
            out.append("  </Step>")
            out.append("")
        out += ["</Steps>", ""]

    if options:
        out += ["## Full example", ""]
        if len(options) == 1:
            out += [block(options[0].get("code") or "", fence_of(options[0]), options[0].get("name") or ""), ""]
        else:
            out.append("<CodeGroup>")
            out.append("")
            for option in options:
                out += [block(option.get("code") or "", fence_of(option), option.get("name") or ""), ""]
            out += ["</CodeGroup>", ""]

    response = (content.get("response") or "").strip()
    if response.replace(" ", "").replace("\n", "") not in {r.replace(" ", "") for r in PLACEHOLDER_RESPONSES}:
        fence = "json" if response.startswith(("{", "[")) else "text"
        out += ["## Response", "", block(response, fence, "Response"), ""]

    return "\n".join(out).rstrip() + "\n"


def overview_page(items: dict[str, dict], groups: list[tuple[str, list[str]]]) -> str:
    out = ["---", 'title: "Recipes"',
           'description: "Short, complete walkthroughs: signing a request, taking a quote, verifying a webhook, dropping in an SDK"',
           "---", "",
           "Each recipe is one task, start to finish: the steps, the code for every language it supports, and the response you should see. Copy the full example at the bottom of a page and adapt it.",
           "",
           "New to the API? Start with [REST API Authentication](/recipes/rest-api-authentication-1), then read [Authentication](/api-reference/authentication) for the reference detail.",
           ""]
    for name, slugs in groups:
        present = [s for s in slugs if s in items]
        if not present:
            continue
        out += [f"## {name}", "", "<CardGroup cols={2}>"]
        for slug in present:
            it = items[slug]
            icon = ICONS.get(slug, "book-open")
            title = (it.get("title") or slug).replace('"', "'")
            body = prose(DESCRIPTIONS.get(slug) or it.get("description") or "").replace("\n", " ") \
                or "A short, complete walkthrough."
            out += [f'  <Card title="{title}" href="/recipes/{slug}" icon="{icon}">',
                    f"    {body}", "  </Card>", ""]
        out += ["</CardGroup>", ""]
    return "\n".join(out).rstrip() + "\n"


def write_nav(groups: list[tuple[str, list[str]]], items: dict[str, dict]) -> None:
    cfg = json.loads(DOCS_JSON.read_text())
    tab = {"tab": "Recipes", "groups": [{"group": "Overview", "pages": ["recipes/overview"]}]}
    for name, slugs in groups:
        pages = [f"recipes/{s}" for s in slugs if s in items]
        if pages:
            tab["groups"].append({"group": name, "pages": pages})
    tabs = [t for t in cfg["navigation"]["tabs"] if t.get("tab") != "Recipes"]
    names = [t.get("tab") for t in tabs]
    i = names.index("Changelog") if "Changelog" in names else len(tabs)
    cfg["navigation"]["tabs"] = tabs[:i] + [tab] + tabs[i:]
    DOCS_JSON.write_text(json.dumps(cfg, indent=2, ensure_ascii=False) + "\n")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--refresh", action="store_true", help="re-fetch instead of using the cache")
    ap.add_argument("--no-nav", action="store_true", help="do not touch docs.json")
    args = ap.parse_args()

    data = fetch(args.refresh)
    items = {it["slug"]: it for it in data["data"]}
    listed = {s for _, slugs in GROUPS for s in slugs}
    groups = GROUPS + ([("More", sorted(set(items) - listed))] if set(items) - listed else [])

    OUT.mkdir(parents=True, exist_ok=True)
    kept = set()
    for slug, item in items.items():
        path = OUT / f"{slug}.mdx"
        path.write_text(recipe_page(item), encoding="utf-8")
        kept.add(path.name)
        steps = len(item["content"].get("steps") or [])
        langs = len((item["content"].get("snippet") or {}).get("code_options") or [])
        print(f"  {slug:38} {steps} steps · {langs} language{'' if langs == 1 else 's'}")
    (OUT / "overview.mdx").write_text(overview_page(items, groups), encoding="utf-8")
    kept.add("overview.mdx")

    for stale in sorted(p for p in OUT.glob("*.mdx") if p.name not in kept):
        stale.unlink()
        print(f"  removed {stale.name} (no longer a recipe)")

    if not args.no_nav:
        write_nav(groups, items)
        print("• docs.json Recipes tab rebuilt")
    print(f"{len(items)} recipes written to recipes/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
