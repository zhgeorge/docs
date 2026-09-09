#!/usr/bin/env python3
"""Mirror the public developer docs at docs.zerohash.com (ReadMe) into this Mintlify repo.

What it does
  1. Reads the ReadMe sidebar tree (categories -> pages -> subpages) from any guide page.
  2. Fetches every guide page and every changelog post (HTML cached under .cache/readme/).
  3. Converts each article to Mintlify MDX:  docs/<slug>.mdx
  4. Rebuilds the Documentation tab in docs.json from the ReadMe sidebar hierarchy.
  5. Regenerates changelog.mdx from the individual changelog posts.
  6. Writes scripts/readme-sync-manifest.json (slug -> source URL, title, content hash).

Usage
  python3 -m venv .venv && .venv/bin/pip install -r scripts/requirements.txt
  .venv/bin/python scripts/sync_readme_docs.py            # full sync (uses cache when fresh)
  .venv/bin/python scripts/sync_readme_docs.py --refresh  # ignore the HTML cache
  .venv/bin/python scripts/sync_readme_docs.py --only staking fiat   # convert a few slugs (debugging)
  .venv/bin/python scripts/sync_readme_docs.py --no-changelog

The landing page (index.mdx, landing.css) and everything outside docs/, changelog.mdx and the
Documentation tab of docs.json are left untouched.
"""
from __future__ import annotations

import argparse
import concurrent.futures as cf
import hashlib
import json
import os
import re
import sys
import time
from datetime import datetime
from pathlib import Path

import requests
from bs4 import BeautifulSoup, Comment, NavigableString, Tag
from markdownify import MarkdownConverter

BASE = "https://docs.zerohash.com"
REPO = Path(__file__).resolve().parent.parent
DOCS_DIR = REPO / "docs"
CACHE_DIR = REPO / ".cache" / "readme"
MANIFEST = REPO / "scripts" / "readme-sync-manifest.json"
DOCS_JSON = REPO / "docs.json"
CHANGELOG_MDX = REPO / "changelog.mdx"
CACHE_TTL_HOURS = 24
WORKERS = 4

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/128.0 Safari/537.36")

CALLOUT_MAP = {"callout_default": "Note", "callout_info": "Info", "callout_warn": "Warning",
               "callout_error": "Warning", "callout_okay": "Check"}

LANG_BY_LABEL = {
    "json": "json", "text": "", "curl": "bash", "shell": "bash", "bash": "bash", "sh": "bash",
    "javascript": "javascript", "js": "javascript", "node": "javascript", "node.js": "javascript",
    "typescript": "typescript", "ts": "typescript", "python": "python", "py": "python",
    "java": "java", "go": "go", "golang": "go", "ruby": "ruby", "php": "php", "swift": "swift",
    "kotlin": "kotlin", "dart": "dart", "http": "http", "yaml": "yaml", "yml": "yaml", "xml": "xml",
    "html": "html", "css": "css", "sql": "sql", "graphql": "graphql", "csharp": "csharp", "c#": "csharp",
    "objective-c": "objectivec", "objectivec": "objectivec", "groovy": "groovy", "gradle": "groovy",
    "toml": "toml", "diff": "diff", "markdown": "markdown", "md": "markdown", "plaintext": "",
}

# --------------------------------------------------------------------------------------
# fetching
# --------------------------------------------------------------------------------------
session = requests.Session()
session.headers["User-Agent"] = UA


def cache_path(url: str) -> Path:
    rel = url.replace(BASE, "").strip("/") or "index"
    return CACHE_DIR / (rel.replace("/", "__") + ".html")


def fetch(url: str, refresh: bool = False) -> str | None:
    p = cache_path(url)
    if p.exists() and not refresh:
        age_h = (time.time() - p.stat().st_mtime) / 3600
        if age_h < CACHE_TTL_HOURS:
            return p.read_text(encoding="utf-8")
    for attempt in range(4):
        try:
            r = session.get(url, timeout=45)
        except requests.RequestException:
            time.sleep(2 * (attempt + 1))
            continue
        if r.status_code == 200:
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text(r.text, encoding="utf-8")
            return r.text
        if r.status_code in (429, 403, 502, 503):
            time.sleep(4 * (attempt + 1))
            continue
        return None
    return None


def fetch_many(urls: list[str], refresh: bool) -> dict[str, str | None]:
    out: dict[str, str | None] = {}
    with cf.ThreadPoolExecutor(WORKERS) as ex:
        futs = {ex.submit(fetch, u, refresh): u for u in urls}
        for i, f in enumerate(cf.as_completed(futs), 1):
            out[futs[f]] = f.result()
            if i % 40 == 0 or i == len(urls):
                print(f"  fetched {i}/{len(urls)}", flush=True)
    return out


# --------------------------------------------------------------------------------------
# sidebar -> navigation tree
# --------------------------------------------------------------------------------------
def parse_sidebar(html: str) -> list[dict]:
    soup = BeautifulSoup(html, "lxml")
    nav = soup.select_one("nav#hub-sidebar")
    if nav is None:
        sys.exit("Could not find the ReadMe sidebar (nav#hub-sidebar); page layout may have changed.")

    def parse_list(ul: Tag) -> list[dict]:
        items = []
        for li in ul.find_all("li", recursive=False):
            a = li.find("a", recursive=False) or li.select_one("a")
            if a is None or not a.get("href", "").startswith("/docs/"):
                continue
            node = {"label": a.get_text(" ", strip=True), "href": a["href"].split("#")[0].rstrip("/")}
            sub = li.find("ul", recursive=False)
            if sub is not None:
                node["children"] = parse_list(sub)
            items.append(node)
        return items

    tree = []
    for sec in nav.select(".rm-Sidebar-section"):
        heading = sec.select_one(".rm-Sidebar-heading")
        ul = sec.find("ul")
        tree.append({"section": heading.get_text(strip=True) if heading else "Docs",
                     "items": parse_list(ul) if ul else []})
    return tree


def walk(items: list[dict]):
    for it in items:
        yield it
        yield from walk(it.get("children", []))


def slug_of(href: str) -> str:
    return href.rsplit("/", 1)[-1]


def nav_to_mintlify(items: list[dict]) -> list:
    """ReadMe item list -> Mintlify pages list (strings and nested {group, pages})."""
    pages: list = []
    for it in items:
        children = it.get("children", [])
        if not children:
            pages.append(f"docs/{slug_of(it['href'])}")
            continue
        own_page = children[0]["href"] != it["href"]  # parent that is itself a real page
        group_pages = ([f"docs/{slug_of(it['href'])}"] if own_page else []) + nav_to_mintlify(children)
        # de-duplicate while keeping order (ReadMe repeats the parent as first child for pure groups)
        seen, deduped = set(), []
        for p in group_pages:
            key = p if isinstance(p, str) else json.dumps(p, sort_keys=True)
            if key not in seen:
                seen.add(key)
                deduped.append(p)
        pages.append({"group": it["label"], "pages": deduped})
    return pages


def build_documentation_tab(tree: list[dict]) -> dict:
    groups = []
    for sec in tree:
        items = sec["items"]
        # A section whose only entry is a parent page with the same name collapses into one group.
        if len(items) == 1 and items[0].get("children") and items[0]["label"].lower() == sec["section"].lower():
            pages = nav_to_mintlify(items)[0]["pages"]
        else:
            pages = nav_to_mintlify(items)
        groups.append({"group": sec["section"], "pages": pages})
    return {"tab": "Documentation", "groups": groups}


# --------------------------------------------------------------------------------------
# HTML -> MDX
# --------------------------------------------------------------------------------------
KNOWN_SLUGS: set[str] = set()            # guide slugs that exist on ReadMe (filled in main)
UNRESOLVED: dict[str, set[str]] = {}     # linked guide slug -> pages linking to it
CURRENT_PAGE = {"slug": ""}


def rewrite_href(href: str) -> str:
    if not href:
        return href
    href = href.strip()
    m = re.search(r"https?://", href)
    if m and m.start() > 0:
        href = href[m.start():]  # repair hrefs with stray characters before the scheme
    if href.startswith(BASE):
        href = href[len(BASE):] or "/"
    if re.match(r"^/null(?:/null)*(?:#|$)", href):
        return href[href.find("#"):] if "#" in href else ""  # broken editor link -> same-page anchor
    # ReadMe version / project prefixes: /v1.0/docs/x, /update/docs/x, /zerohash/reference/x
    pm = re.match(r"^/(?:v[\d.]+|update|zerohash)(/(?:docs|reference|reference-link|page|recipes|changelog)(?:/.*)?)$", href)
    if pm:
        href = pm.group(1)
    if re.match(r"^[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:/.*)?$", href):
        return "https://" + href  # bare domain without a scheme
    if href == "/docs":
        return "/docs/getting-started"
    if href.startswith("/docs/"):
        path, _, frag = href.partition("#")
        slug = path[6:].split("?")[0].rstrip("/")
        if slug in KNOWN_SLUGS:
            return f"/docs/{slug}" + (f"#{frag}" if frag else "")
        # target does not exist on ReadMe either; keep the source behaviour and report it
        UNRESOLVED.setdefault(slug, set()).add(CURRENT_PAGE["slug"])
        return BASE + href
    if href.startswith(("/reference", "/page/", "/recipes", "/changelog", "/reference-link")):
        return BASE + href  # not mirrored here; keep pointing at ReadMe
    return href


def escape_mdx_text(text: str) -> str:
    """Escape characters MDX would otherwise interpret in prose (outside code)."""
    text = text.replace("{", "\\{").replace("}", "\\}")
    text = text.replace("<", "&lt;")                         # MDX treats any `<` as a JSX start
    text = text.replace("$", "\\$")                          # remark-math delimiters
    return text


def guess_lang(label: str, code: str) -> str:
    lab = (label or "").strip().lower()
    if lab in LANG_BY_LABEL:
        return LANG_BY_LABEL[lab]
    for k, v in LANG_BY_LABEL.items():
        if k in lab and len(k) > 2:
            return v
    s = code.strip()
    if s.startswith(("{", "[")):
        return "json"
    if s.startswith(("curl ", "$ curl", "wget ")):
        return "bash"
    return ""


def fence_for(code: str) -> str:
    longest = max((len(m) for m in re.findall(r"`+", code)), default=0)
    return "`" * max(3, longest + 1)


class MdxConverter(MarkdownConverter):
    """markdownify tuned for Mintlify MDX output."""

    class Options(MarkdownConverter.DefaultOptions):
        heading_style = "ATX"
        bullets = "-"
        autolinks = False
        escape_asterisks = True
        escape_underscores = True
        escape_misc = False

    # ---- text ----
    def process_text(self, el, *args, **kw):
        text = super().process_text(el, *args, **kw)
        # never escape inside code/pre
        parent_names = {p.name for p in el.parents if isinstance(p, Tag)}
        if parent_names & {"code", "pre"}:
            return text
        return escape_mdx_text(text)

    # ---- links & images ----
    def convert_a(self, el, text, parent_tags=None, **kw):
        href = rewrite_href(el.get("href", ""))
        if el.find("img") is not None and not el.get_text(strip=True):
            return text  # linked image: keep just the image
        text = (text or "").strip()
        if not text:
            return ""
        if not href or not re.match(r"^(?:https?://|mailto:|tel:|/|#)", href):
            return text  # empty, javascript:, or placeholder hrefs -> plain text
        title = el.get("title")
        title_part = f' "{title}"' if title else ""
        return f"[{text}]({href}{title_part})"

    def convert_img(self, el, text, parent_tags=None, **kw):
        src = el.get("src") or el.get("data-src") or ""
        if not src:
            return ""
        alt = (el.get("alt") or el.get("title") or "").replace('"', "'").strip()
        return f"\n\n![{alt}]({src})\n\n"

    # ---- headings: drop anchor widgets, keep text ----
    def convert_hn(self, n, el, text, parent_tags=None, **kw):
        ht = el.select_one(".heading-text")
        label = (ht.get_text(" ", strip=True) if ht else el.get_text(" ", strip=True))
        if not label.strip():
            return ""  # empty heading in the source
        label = escape_mdx_text(label)
        n = min(n + getattr(self, "heading_shift", 0), 6)
        return f"\n\n{'#' * n} {label}\n\n"

    def convert_h1(self, el, text, **kw): return self.convert_hn(1, el, text, **kw)
    def convert_h2(self, el, text, **kw): return self.convert_hn(2, el, text, **kw)
    def convert_h3(self, el, text, **kw): return self.convert_hn(3, el, text, **kw)
    def convert_h4(self, el, text, **kw): return self.convert_hn(4, el, text, **kw)
    def convert_h5(self, el, text, **kw): return self.convert_hn(5, el, text, **kw)
    def convert_h6(self, el, text, **kw): return self.convert_hn(6, el, text, **kw)

    # ---- code ----
    def convert_pre(self, el, text, parent_tags=None, **kw):
        code_el = el.find("code") or el
        code = code_el.get_text()
        lang = guess_lang(el.get("data-lang") or "", code)
        f = fence_for(code)
        return f"\n\n{f}{lang}\n{code.rstrip()}\n{f}\n\n"

    def convert_code(self, el, text, parent_tags=None, **kw):
        if el.parent and el.parent.name == "pre":
            return text
        raw = el.get_text()
        if not raw.strip():
            return ""
        ticks = "``" if "`" in raw else "`"
        return f"{ticks}{raw}{ticks}"

    # ---- tables: pipe tables with <br /> for in-cell breaks ----
    def convert_table(self, el, text, parent_tags=None, **kw):
        rows = el.find_all("tr")
        if not rows:
            return ""

        def cell_md(td: Tag) -> str:
            for br in td.find_all("br"):
                br.replace_with(NavigableString("ZHBRTOKEN"))
            td.name = "div"  # keep markdownify's own td/th handler (which appends " |") out of the way
            inner = self.convert_soup(td)
            inner = re.sub(r"\s*\n\s*", " ", inner).strip()
            inner = inner.replace("ZHBRTOKEN", "<br />").replace("|", "\\|")
            return inner or " "

        table_rows = []
        for tr in rows:
            table_rows.append([cell_md(c) for c in tr.find_all(["td", "th"], recursive=False)])
        width = max(len(r) for r in table_rows)
        table_rows = [r + [" "] * (width - len(r)) for r in table_rows]
        head, body = table_rows[0], table_rows[1:]
        lines = ["| " + " | ".join(head) + " |", "|" + " --- |" * width]
        lines += ["| " + " | ".join(r) + " |" for r in body]
        return "\n\n" + "\n".join(lines) + "\n\n"

    # ---- misc ----
    def convert_hr(self, el, text, parent_tags=None, **kw):
        return "\n\n---\n\n"

    def convert_br(self, el, text, parent_tags=None, **kw):
        return "  \n"

    def convert_iframe(self, el, text, parent_tags=None, **kw):
        src = el.get("src", "")
        if not src:
            return ""
        return f'\n\n<iframe src="{src}" width="100%" height="400" frameBorder="0" allowFullScreen />\n\n'

    def convert_span(self, el, text, parent_tags=None, **kw):
        return text

    def convert_style(self, el, text, parent_tags=None, **kw):
        return ""

    def convert_script(self, el, text, parent_tags=None, **kw):
        return ""


def decode_cf_email(hexstr: str) -> str:
    """Undo Cloudflare's email obfuscation (first byte is an XOR key for the rest)."""
    try:
        key = int(hexstr[:2], 16)
        return "".join(chr(int(hexstr[i:i + 2], 16) ^ key) for i in range(2, len(hexstr), 2))
    except ValueError:
        return ""


def restore_emails(body: Tag) -> None:
    for span in body.select("span.__cf_email__[data-cfemail], a.__cf_email__[data-cfemail]"):
        email = decode_cf_email(span["data-cfemail"])
        if email:
            span.replace_with(NavigableString(email))
    for a in body.select('a[href^="/cdn-cgi/l/email-protection"]'):
        email = decode_cf_email(a["href"].split("#", 1)[-1])
        if not email:
            a.unwrap()
            continue
        a["href"] = f"mailto:{email}"
        if a.get_text(strip=True) in ("", "[email protected]"):
            a.string = email


def preprocess_body(body: Tag) -> None:
    """Strip ReadMe chrome and reshape widgets into elements the converter handles."""
    for c in body.find_all(string=lambda s: isinstance(s, Comment)):
        c.extract()
    restore_emails(body)
    for sel in ["style", "script", ".heading-anchor", ".heading-anchor-icon", ".UpdatedAt",
                ".rm-Pagination", ".PageThumbs", ".rm-ToC", ".callout-icon"]:
        for t in body.select(sel):
            t.decompose()
    # <details class="Accordion"><summary>Title</summary>…</details>  ->  <zh_accordion data-title>
    # (placeholder tag names use underscores: markdownify dispatches to convert_<tagname>)
    for d in body.select("details"):
        summary = d.find("summary")
        title = summary.get_text(" ", strip=True) if summary else "Details"
        if summary:
            summary.decompose()
        d.name = "zh_accordion"
        d["data-title"] = title
    # ReadMe CodeTabs: toolbar buttons hold the labels; pres hold the code
    for ct in body.select(".CodeTabs"):
        labels = [b.get_text(" ", strip=True) for b in ct.select(".CodeTabs-toolbar button")]
        pres = ct.select(".CodeTabs-inner pre")
        for i, pre in enumerate(pres):
            pre["data-lang"] = labels[i] if i < len(labels) else ""
            pre["data-label"] = labels[i] if i < len(labels) else ""
        for tb in ct.select(".CodeTabs-toolbar"):
            tb.decompose()
        ct.name = "zh_codetabs"
    # callouts -> placeholder elements the converter turns into Mintlify components
    for co in body.select("blockquote.callout"):
        kind = next((CALLOUT_MAP[c] for c in co.get("class", []) if c in CALLOUT_MAP), "Note")
        co.name = "zh_callout"
        co["data-kind"] = kind
    # tables: drop the rdmd wrapper divs so the table converts directly
    for wrap in body.select(".rdmd-table, .rdmd-table-inner"):
        wrap.unwrap()
    # lightbox wrappers around images
    for lb in body.select(".lightbox, .lightbox-inner"):
        lb.unwrap()


class PageConverter(MdxConverter):
    def convert_zh_callout(self, el, text, parent_tags=None, **kw):
        kind = el.get("data-kind", "Note")
        inner = text.strip()
        # a leading heading inside the callout becomes the component title
        m = re.match(r"^#{1,6}\s+(.+?)\n+(.*)$", inner, re.S)
        if m:
            title, rest = m.group(1).strip(), m.group(2).strip()
            if not rest:  # heading-only callout: the heading text is the whole message
                return f"\n\n<{kind}>\n{title}\n</{kind}>\n\n"
            if title.lower().rstrip(":") in {"note", "info", "warning", "tip", "caution", "important", "check"}:
                return f"\n\n<{kind}>\n{rest}\n</{kind}>\n\n"
            return f'\n\n<{kind} title="{title.replace(chr(34), "&quot;")}">\n{rest}\n</{kind}>\n\n'
        return f"\n\n<{kind}>\n{inner}\n</{kind}>\n\n"

    def convert_zh_accordion(self, el, text, parent_tags=None, **kw):
        title = el.get("data-title", "Details").replace('"', "&quot;")
        return f'\n\n<Accordion title="{title}">\n{text.strip()}\n</Accordion>\n\n'

    def convert_zh_codetabs(self, el, text, parent_tags=None, **kw):
        pres = el.find_all("pre")
        if len(pres) <= 1:
            return text
        blocks = []
        for pre in pres:
            code = (pre.find("code") or pre).get_text().rstrip()
            label = pre.get("data-label") or ""
            lang = guess_lang(label, code) or "text"
            f = fence_for(code)
            title = f' {label}' if label else ""
            blocks.append(f"{f}{lang}{title}\n{code}\n{f}")
        return "\n\n<CodeGroup>\n\n" + "\n\n".join(blocks) + "\n\n</CodeGroup>\n\n"

    def convert_pre(self, el, text, parent_tags=None, **kw):
        code = (el.find("code") or el).get_text()
        lang = guess_lang(el.get("data-lang") or "", code)
        f = fence_for(code)
        return f"\n\n{f}{lang}\n{code.rstrip()}\n{f}\n\n"


def yaml_str(s: str) -> str:
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"'


def clean_description(s: str) -> str:
    s = re.sub(r"\s+", " ", s or "").strip()
    if len(s) > 200:
        cut = s[:200]
        s = cut[: cut.rfind(" ")] + "…"
    return s


def convert_guide(html: str, slug: str, sidebar_label: str | None) -> tuple[str, str] | None:
    soup = BeautifulSoup(html, "lxml")
    article = soup.select_one("article.rm-Article")
    if article is None:
        return None
    header = article.select_one("header")
    title, excerpt = slug, ""
    if header is not None:
        h1 = header.find("h1")
        title = h1.get_text(" ", strip=True) if h1 else header.get_text(" ", strip=True)
        if h1:
            h1.extract()
        excerpt = header.get_text(" ", strip=True)  # ReadMe shows this under the title, like Mintlify's description
        header.decompose()
    elif soup.title:
        title = soup.title.get_text(strip=True)
    body = article.select_one(".rm-Markdown") or article
    preprocess_body(body)
    meta = soup.select_one('meta[name="description"]')
    meta_desc = clean_description(meta["content"]) if meta and meta.get("content") else ""

    conv = PageConverter()
    conv.heading_shift = 1 if body.find("h1") is not None else 0
    md = conv.convert_soup(body)
    md = re.sub(r"[ \t]+\n", "\n", md)
    md = re.sub(r"\n{3,}", "\n\n", md).strip() + "\n"
    md = md.replace("\u00a0", " ")

    description = clean_description(excerpt)
    if not description and meta_desc:
        # ReadMe's SEO description is usually just the page's opening text; don't show it twice
        body_plain = re.sub(r"\s+", " ", re.sub(r"[#*_`\\\[\]]", "", md))[:800].lower()
        probe = re.sub(r"\s+", " ", meta_desc.rstrip("\u2026").rstrip())[:60].lower()
        if probe not in body_plain:
            description = meta_desc

    fm = ["---", f"title: {yaml_str(title)}"]
    if sidebar_label and sidebar_label.strip() and sidebar_label.strip() != title.strip():
        fm.append(f"sidebarTitle: {yaml_str(sidebar_label.strip())}")
    if description:
        fm.append(f"description: {yaml_str(description)}")
    fm.append("---")
    return title, "\n".join(fm) + "\n\n" + md


def convert_changelog_post(html: str, url: str) -> dict | None:
    soup = BeautifulSoup(html, "lxml")
    article = soup.select_one("article.rm-Changelog-post") or soup.select_one("article")
    if article is None:
        return None
    title_el = article.select_one("h1")
    title = title_el.get_text(" ", strip=True) if title_el else url.rsplit("/", 1)[-1]
    date_el = article.select_one(".DateLine")
    date_txt = date_el.get_text(" ", strip=True) if date_el else ""
    body = article.select_one(".rm-Markdown")
    if body is None:
        return None
    preprocess_body(body)
    conv = PageConverter()
    md = conv.convert_soup(body) if hasattr(conv, "convert_soup") else conv.convert(str(body))
    md = re.sub(r"\n{3,}", "\n\n", md).strip()
    # release type, if the post follows the standard template
    rtype = ""
    m = re.search(r"#+\s*Release Type\s*\n+(.+?)\n", md)
    if m:
        rtype = re.sub(r"[*_`]", "", m.group(1)).strip()
    # drop the redundant "Release Details / Release Date" lines (the Update label carries the date)
    md = re.sub(r"#+\s*Release Details\s*\n+(?:\*\*)?Release Date:?(?:\*\*)?[^\n]*\n+", "", md)
    md = re.sub(r"#+\s*Release Type\s*\n+[^\n]+\n+", "", md)
    # demote headings so they nest under the Update component nicely
    md = re.sub(r"^(#{1,5}) ", lambda mm: "#" * min(len(mm.group(1)) + 2, 6) + " ", md, flags=re.M)
    iso = ""
    try:
        iso = datetime.strptime(re.sub(r"(\d+)(st|nd|rd|th)", r"\1", date_txt), "%B %d, %Y").date().isoformat()
    except ValueError:
        pass
    return {"url": url, "slug": url.rsplit("/", 1)[-1], "title": title, "date": date_txt,
            "iso": iso, "type": rtype, "body": md}


def build_changelog(posts: list[dict]) -> str:
    """One page of release entries, newest first, with no left column.

    Each entry is an <Update> whose label is the release date (Mintlify renders it as a
    pill beside the entry and anchors it as #<date>). The `zh-cl-page` marker div is the
    hook changelog.css uses to hide the sidebar on this page only.
    """
    posts = sorted(posts, key=lambda p: p["iso"] or "0000", reverse=True)

    out = ["---",
           'title: "Changelog"',
           'sidebarTitle: "Changelog"',
           'description: "Product updates, new features, and platform changes across zerohash, newest first."',
           # wide mode drops the right-hand table of contents (it would just repeat the
           # dates) while keeping Mintlify's prose typography for the entry bodies —
           # custom mode loses it: headings fall to weight 400 and body text to gray.
           'mode: "wide"',
           "---", "",
           '<div className="zh-cl-page" />', ""]

    for p in posts:
        label = p["date"] or "Undated"
        desc = p["type"].replace('"', "'")
        attrs = f' label="{label}"' + (f' description="{desc}"' if desc else "")
        out += [f"<Update{attrs}>", f"### {escape_mdx_text(p['title'])}", "", p["body"],
                "</Update>", ""]
    return "\n".join(out)


# --------------------------------------------------------------------------------------
# main
# --------------------------------------------------------------------------------------
def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--refresh", action="store_true", help="ignore the HTML cache")
    ap.add_argument("--only", nargs="*", default=None, help="only convert these guide slugs")
    ap.add_argument("--no-changelog", action="store_true")
    ap.add_argument("--no-nav", action="store_true", help="do not rewrite docs.json navigation")
    args = ap.parse_args()

    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    DOCS_DIR.mkdir(exist_ok=True)

    print("• reading sidebar tree")
    seed = fetch(f"{BASE}/docs/getting-started", args.refresh)
    if seed is None:
        sys.exit("Could not fetch the seed page.")
    tree = parse_sidebar(seed)
    label_for: dict[str, str] = {}
    for sec in tree:
        for it in walk(sec["items"]):
            slug = slug_of(it["href"])
            # a leaf label is the most specific name for the page
            if not it.get("children") or slug not in label_for:
                label_for[slug] = it["label"]
    slugs = list(dict.fromkeys(label_for))
    KNOWN_SLUGS.update(slugs)
    print(f"  {len(tree)} sections, {len(slugs)} guide pages")

    targets = [s for s in slugs if not args.only or s in args.only]
    urls = [f"{BASE}/docs/{s}" for s in targets]
    print(f"• fetching {len(urls)} guide pages")
    pages = fetch_many(urls, args.refresh)

    manifest = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}
    written, failed = 0, []
    print("• converting to MDX")
    for slug in targets:
        html = pages.get(f"{BASE}/docs/{slug}")
        if html is None:
            failed.append(slug)
            continue
        CURRENT_PAGE["slug"] = slug
        res = convert_guide(html, slug, label_for.get(slug))
        if res is None:
            failed.append(slug)
            continue
        title, mdx = res
        (DOCS_DIR / f"{slug}.mdx").write_text(mdx, encoding="utf-8")
        manifest[slug] = {"source": f"{BASE}/docs/{slug}", "title": title,
                          "sha256": hashlib.sha256(mdx.encode()).hexdigest()[:16],
                          "synced_at": datetime.utcnow().strftime("%Y-%m-%dT%H:%MZ")}
        written += 1
    print(f"  wrote {written} pages" + (f", failed: {failed}" if failed else ""))

    if not args.only:
        stale = sorted(p.stem for p in DOCS_DIR.glob("*.mdx") if p.stem not in label_for)
        for s in stale:
            (DOCS_DIR / f"{s}.mdx").unlink()
            manifest.pop(s, None)
        if stale:
            print(f"  removed {len(stale)} pages no longer on ReadMe: {stale}")

    if not args.no_nav and not args.only:
        print("• rebuilding docs.json Documentation tab")
        cfg = json.loads(DOCS_JSON.read_text())
        tabs = cfg["navigation"]["tabs"]
        doc_tab = build_documentation_tab(tree)
        others = [t for t in tabs if t.get("tab") not in ("Documentation", "Integration Guides")]
        cfg["navigation"]["tabs"] = [doc_tab] + others
        DOCS_JSON.write_text(json.dumps(cfg, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    if not args.no_changelog and not args.only:
        print("• changelog")
        sm = fetch(f"{BASE}/sitemap.xml", args.refresh) or ""
        post_urls = sorted({u.rstrip("/") for u in re.findall(r"<loc>([^<]+)</loc>", sm)
                            if "/changelog/" in u})
        print(f"  fetching {len(post_urls)} posts")
        posts_html = fetch_many(post_urls, args.refresh)
        CURRENT_PAGE["slug"] = "changelog"
        posts = [p for u in post_urls if (p := convert_changelog_post(posts_html[u] or "", u))]
        CHANGELOG_MDX.write_text(build_changelog(posts), encoding="utf-8")
        print(f"  wrote changelog.mdx with {len(posts)} entries")

    if UNRESOLVED:
        print(f"• {len(UNRESOLVED)} linked guide slugs do not exist on ReadMe (fix at the source; "
              f"left pointing at {BASE}):")
        for s, srcs in sorted(UNRESOLVED.items()):
            print(f"    /docs/{s}  <- {', '.join(sorted(srcs))}")
        manifest["_unresolved_links"] = {s: sorted(v) for s, v in UNRESOLVED.items()}

    MANIFEST.write_text(json.dumps(manifest, indent=1, sort_keys=True) + "\n", encoding="utf-8")
    print("done.")


if __name__ == "__main__":
    main()
