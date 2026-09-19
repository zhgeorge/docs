#!/usr/bin/env python3
"""Normalize the zerohash OpenAPI document for the Mintlify docs site.

Source: the same spec that feeds the ReadMe reference (zh-swagger.json).
Usage:  python3 scripts/prepare_openapi.py ~/Downloads/zh-swagger.json

What it changes, and why:
  1. info.description       drops the ReadMe-only download anchor and points the
                            authentication link at this site's own page.
  2. securitySchemes        the spec only declares the API key and passphrase, but every
                            signed request also needs X-SCX-SIGNED and X-SCX-TIMESTAMP,
                            so both are added and required alongside the others.
  3. servers                the spec ships Cert only; Prod and the EU hosts are added so
                            the reference shows every base URL. Cert stays first.
  4. GET /time              marked as needing no security, which is how the endpoint actually
                            behaves; without this it inherits the global requirement and the
                            reference shows auth headers on the one call that does not need them.
  5. x-readme               removed; it is ReadMe plumbing.
Nothing else is touched: paths, schemas and examples are passed through as they arrive.
"""
import json
import pathlib
import sys

AUTH_PAGE = "/api-reference/authentication"
SERVERS = [
    {"url": "https://api.cert.zerohash.com", "description": "US Cert (test)"},
    {"url": "https://api.cert.zerohash.eu", "description": "EU Cert (test)"},
    {"url": "https://api.zerohash.com", "description": "US Prod"},
    {"url": "https://api.zerohash.eu", "description": "EU Prod"},
]
ADDED_SCHEMES = {
    "apiSigned": {
        "type": "apiKey",
        "in": "header",
        "name": "X-SCX-SIGNED",
        "description": f"Base64 HMAC-SHA256 signature of timestamp + method + route + body. See [Authentication]({AUTH_PAGE}).",
    },
    "apiTimestamp": {
        "type": "apiKey",
        "in": "header",
        "name": "X-SCX-TIMESTAMP",
        "description": f"Unix time in seconds, and the same value signed. See [Authentication]({AUTH_PAGE}).",
    },
}


def main(src: str, out: str = "api-reference/openapi.json") -> None:
    spec = json.loads(pathlib.Path(src).read_text())
    assert str(spec.get("openapi", "")).startswith("3."), f"not OpenAPI 3.x: {spec.get('openapi')}"

    info = spec.setdefault("info", {})
    info["description"] = (
        "The zerohash REST API. Every endpoint except `GET /time` is authenticated with "
        "HMAC-SHA256 request signing over four headers.\n\n"
        f"Read [Authentication]({AUTH_PAGE}) first: it covers the headers, how to build the "
        "signature, the environment base URLs, and IP allowlisting.\n"
    )

    comps = spec.setdefault("components", {})
    schemes = comps.setdefault("securitySchemes", {})
    for key, scheme in ADDED_SCHEMES.items():
        schemes.setdefault(key, scheme)
    if key_desc := schemes.get("apiKey", {}).get("description"):
        schemes["apiKey"]["description"] = key_desc.replace(
            "https://docs.zerohash.com/reference/api-authentication", AUTH_PAGE
        )
    spec["security"] = [{name: [] for name in ("apiKey", "apiSigned", "apiTimestamp", "apiPassphrase")}]

    spec["servers"] = SERVERS
    if time_get := spec.get("paths", {}).get("/time", {}).get("get"):
        time_get["security"] = []          # verified: GET /time answers with no headers at all
    spec.pop("x-readme", None)

    path = pathlib.Path(out)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(spec, separators=(",", ":"), ensure_ascii=False) + "\n")
    ops = sum(1 for p in spec["paths"].values() for m in p if m in ("get", "post", "put", "patch", "delete"))
    print(f"wrote {path} ({path.stat().st_size // 1024} KB) · {len(spec['paths'])} paths · {ops} operations · {len(spec.get('tags', []))} tags")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else str(pathlib.Path.home() / "Downloads/zh-swagger.json"),
         sys.argv[2] if len(sys.argv) > 2 else "api-reference/openapi.json")
