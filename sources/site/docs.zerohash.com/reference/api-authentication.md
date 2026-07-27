# Source: https://docs.zerohash.com/reference/api-authentication

Our authentication method utilizes HMAC-SHA256 signing with API keys and a passphrase for secure access to zerohash API endpoints. Platforms must authenticate by including their public API key and signed request, along with a passphrase in the request headers. 
These credentials are used to generate a signature for each request, ensuring its integrity and authenticity. Requests are then sent with the necessary authentication headers, allowing clients to securely access and interact with the API endpoints.

## 

Request headers

To Authenticate with us, you will need to set the following headers:

| Header | Description |
| --- | --- |
| X-SCX-API-KEY | Your public key |
| X-SCX-SIGNED | Signature for your request |
| X-SCX-TIMESTAMP | Unix timestamp(number of seconds since the Unix Epoch.) |
| X-SCX-PASSPHRASE | Your passphrase |

### 

Sample headers

Text

```
"X-SCX-API-KEY": "h2yFu1uijCDEqkbdop4GAF",
"X-SCX-SIGNED": "PFMlg+bMFVjjAiGPLR/zJCStmiiOIeyz5NIOZEmpfH0=",
"X-SCX-TIMESTAMP": 1550175822,
"X-SCX-PASSPHRASE": "passphrase"
```

## 

Request signing

To sign requests, zerohash uses a combination of the request parameters. All parameters that are included in the request signature must be sent in the same order as the request.

1. To build a signature, you need to concatenate the **timestamp**+**method**+**route**+**request body** values of your request to a string.

 1. A request to the [GET /accounts](https://docs.zerohash.com/reference/get_accounts). 
 `1714445421GET/accounts?account_owner=00SCXM&account_group=BBLGTW{}`

 1. For a `GET` request, request body should be set to an empty JSON object `{}`.
 2. Query parameters are included in the **route** input for the request signature.
 2. A request to the [POST /convert\_withdraw/execute](https://docs.zerohash.com/reference/post_convert-withdraw-execute)

 1. `1714445704POST/convert_withdraw/execute{'quote_id': 'UUID'}`
 2. Request bodies are passed on in the **request body** input on POST, PATCH and DELETE calls.
2. Generate an HMAC digest using your private key (using HMAC SHA-256).

 1. Private Key = `2mC4ZvVd4goRkuJm+rjr9byUiaUW1b6tVN4xy9QXNSE=`
3. Encode the HMAC digest in Base64.

 1. Using a private key, you will produce a base64 encoded digest `+p94Yo3z33zvTmoA+BFtzQIW+qJz1X8IZcnuudpX6A8=`.

## 

Authentication Snippets

REST API Authentication

Open Recipe

Updated about 2 months ago

---

Did this page help you?

Yes

No

Updated about 2 months ago

---

Did this page help you?

Yes

No