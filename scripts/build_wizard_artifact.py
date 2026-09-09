#!/usr/bin/env python3
"""Bundle the docs' setup wizard (wizard.css + wizard.js) into a standalone HTML page.

The canonical wizard lives at /setup-wizard on the docs site, where Mintlify injects
wizard.js and wizard.css. This produces a single self-contained file of the same wizard —
for sharing outside the docs (e.g. as a Claude artifact) — so the two never drift.

Usage: python3 scripts/build_wizard_artifact.py [out.html]
"""
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
out = Path(sys.argv[1]) if len(sys.argv) > 1 else REPO / "build" / "zerohash-setup-wizard.html"
css = (REPO / "wizard.css").read_text(encoding="utf-8")
js = (REPO / "wizard.js").read_text(encoding="utf-8")

# Outside the docs, doc links must be absolute and the page needs its own font + shell.
js = js.replace('const DOCS = "/docs/";', 'const DOCS = "https://docs.zerohash.com/docs/";')
js = js.replace('location.origin + u', '"https://docs.zerohash.com" + u')

html = f"""<meta charset="utf-8">
<title>zerohash Setup Wizard</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
<style>
  body {{ margin: 0; background: #fafaf7; color: #191918; font-family: Inter, "Helvetica Neue", Arial, sans-serif; -webkit-font-smoothing: antialiased; }}
  :root[data-theme="dark"] body {{ background: #0d0e0d; color: #ededea; }}
  @media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) body {{ background: #0d0e0d; color: #ededea; }} }}
  .topbar {{ display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 28px; border-bottom: 1px solid #e6e6e0; background: #ffffff; position: sticky; top: 0; z-index: 5; }}
  .dark .topbar {{ background: #141514; border-color: #242522; }}
  .brand {{ display: flex; align-items: baseline; gap: 10px; }}
  .brand .word {{ font-weight: 700; letter-spacing: -0.02em; font-size: 17px; }}
  .brand .sub {{ font-family: ui-monospace, Menlo, monospace; font-size: 12px; color: #6f6f68; letter-spacing: .06em; text-transform: uppercase; }}
  .topbar a {{ font-size: 13px; color: #6f6f68; text-decoration: none; }}
  .zh-wiz {{ --scroll-mt: 80px; }}
{css}
</style>
<div class="topbar"><div class="brand"><span class="word">zerohash</span><span class="sub">setup wizard</span></div><a href="https://docs.zerohash.com" target="_blank" rel="noopener">docs.zerohash.com ↗</a></div>
<div id="zh-wizard-root" class="zh-wiz"></div>
<script>
// mirror the viewer's theme onto the .dark class the docs CSS expects
(function () {{
  const apply = () => {{ const t = document.documentElement.getAttribute("data-theme"); const dark = t === "dark" || (!t && matchMedia("(prefers-color-scheme: dark)").matches); document.documentElement.classList.toggle("dark", dark); }};
  apply(); matchMedia("(prefers-color-scheme: dark)").addEventListener("change", apply);
  new MutationObserver(apply).observe(document.documentElement, {{ attributes: true, attributeFilter: ["data-theme"] }});
}})();
{js}
</script>
"""
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(html, encoding="utf-8")
print(f"wrote {out} ({len(html.encode()) // 1024} KB)")
