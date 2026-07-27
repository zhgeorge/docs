# Source: https://docs.zerohash.com/docs/submit-first-api-call

This is the fastest way to confirm your zerohash integration is wired up correctly. `GET /time` returns the server's current Unix timestamp and requires no authentication. It's the canonical health check before you start signing requests.

## 

Prerequisites

- A zerohash Cert or Prod platform. See [Get Platform Access](https://docs.zerohash.com/docs/get-platform-access)
- `curl` (or any HTTP client).

## 

Endpoints

| Environment | Base URL |
| --- | --- |
| US Cert | `https://api.cert.zerohash.com` |
| US Prod | `https://api.zerohash.com` |
| EU Cert | `https://api.cert.zerohash.eu` |
| EU Prod | `https://api.zerohash.eu` |

## 

Submit Request

Execute a [Get server time](https://docs.zerohash.com/reference/get_time) request

cURL

```
//GET https://api.cert.zerohash.com/time
curl --request GET \
  --url https://api.cert.zerohash.com/time \
  --header 'accept: application/json'
```

## 

Expected response

JSON

```
{
  "message": {
    "epoch": 1715459200000,
    "epoch_units": "milliseconds",
    "iso_8601": "2024-05-11T20:26:40.000Z"
  }
}
```

If you got a 200 with a timestamp roughly equal to the current time, you're hitting zerohash successfully and TLS is good.

## 

Next: authenticated calls

`GET /time` is the only endpoint that doesn't require authentication. Every other endpoint needs four headers — `X-SCX-API-KEY`, `X-SCX-SIGNED`, `X-SCX-TIMESTAMP`, and `X-SCX-PASSPHRASE` that are derived from your API key, passphrase, secret, and the request payload using HMAC-SHA256.

See [API Authentication](https://docs.zerohash.com/docs/authentication) for the full signing recipe.

## 

Troubleshooting

- **401 Unauthorized on** `/time` - `/time` is unauthenticated; a 401 means the base URL is wrong or your platform isn't provisioned. Double-check the environment table above.
- **Connection refused / DNS error** - confirm outbound HTTPS to `*.zerohash.com` isn't blocked by a corporate proxy.
- **TLS errors in corporate networks** - your machine may need an internal CA bundle (e.g. Netskope, Zscaler). Set `REQUESTS_CA_BUNDLE` or your client's equivalent.

Updated about 1 month ago

---

Did this page help you?

Yes

No

Copy Page