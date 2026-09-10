# zerohash developer docs (Mintlify)

Mintlify site for the zerohash developer documentation, deployed automatically from `main`.

- **Guides** (`docs/*.mdx`), the **Documentation** navigation in `docs.json`, and `changelog.mdx` are
  **generated** from the public ReadMe site at <https://docs.zerohash.com> by `scripts/sync_readme_docs.py`.
  Do not hand-edit them — edit the source in ReadMe and re-run the sync.
- The **landing page** (`index.mdx` + `landing.css`) and the rest of `docs.json` (theme, logo, colors,
  navbar, Changelog tab) are hand-maintained in this repo.
- The **setup wizard** (`setup-wizard.mdx`, rendered by `wizard.js` + `wizard.css`) is hand-maintained too.
  Mintlify injects every root-level `.js`/`.css` file on every page; `wizard.js` only acts when it finds
  `#zh-wizard-root` (the wizard page) or `.zh-products` (the landing page's "Generate custom guide" mode,
  which links to `/setup-wizard?products=fund,trade,…`). The wizard's product facts, endpoints and payloads
  were transcribed from the guides in `docs/`; each generated section links to its source page. The sync
  script keeps the page registered in `docs.json` under a hidden **Tools** group. To rebuild the
  standalone, shareable copy of the wizard: `python3 scripts/build_wizard_artifact.py`.
- The **changelog's month navigation** is `changelog.js` + `changelog.css`: on `/changelog` it replaces the
  sidebar's single "Changelog" entry with one link per month (built from the rendered `<Update>` entries, so
  it tracks the synced changelog automatically) and highlights the month you're reading.

## Syncing content from ReadMe

```bash
python3 -m venv .venv && .venv/bin/pip install -r scripts/requirements.txt
.venv/bin/python scripts/sync_readme_docs.py
```

The script reads ReadMe's sidebar to discover every guide and its position in the hierarchy, fetches each
page (HTML is cached for 24h under `.cache/readme/`), converts the article to Mintlify MDX (callouts →
`<Note>/<Info>/<Warning>`, code tabs → `<CodeGroup>`, accordions → `<Accordion>`, tables → pipe tables),
rebuilds the Documentation tab from the sidebar tree, regenerates `changelog.mdx` from the individual
changelog posts, and records what it wrote in `scripts/readme-sync-manifest.json`. Pages that disappear
from ReadMe are removed from `docs/`.

Useful flags:

| Flag | Effect |
| --- | --- |
| `--refresh` | Ignore the HTML cache and re-fetch everything |
| `--only <slug> ...` | Convert just those guide slugs (skips nav + changelog); handy when debugging the converter |
| `--no-nav` | Leave `docs.json` untouched |
| `--no-changelog` | Leave `changelog.mdx` untouched |

Links to parts of ReadMe that are not mirrored here (API reference, recipes, legal pages) are kept as
absolute `docs.zerohash.com` URLs. Images stay on ReadMe's CDN (`files.readme.io`).

After a sync, review the diff, then:

```bash
mint validate        # strict build check
mint broken-links    # internal link check
mint dev             # preview at http://localhost:3000
```

## Local preview

```bash
npm i -g mint
mint dev
```

## Publishing

Pushing to `main` triggers the Mintlify GitHub App deployment.
