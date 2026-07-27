# Source: https://docs.zerohash.com/reference/post_deposits-crypto-deposit-id-travel-rule

⚠️

This reference guide is currently experiencing difficulties and will be back online shortly.

`ERR-YR5GEB`

deposit\_id

string

required

The unique identifier of the crypto deposit

Travel Rule submission payload: sender type, wallet type, and conditionally CASP DID, sender PII, source address, and a base64-encoded wallet screenshot.

sender\_type

string

enum

required

Whether the deposit originates from the customer's own wallet (me\_to\_me) or a third party (you\_to\_me).

me\_to\_meyou\_to\_me

Allowed:

`me_to_me``you_to_me`

wallet\_type

string

enum

required

Whether the source wallet is hosted by an exchange/CASP or self-custodied.

exchangeself\_custody

Allowed:

`exchange``self_custody`

casp\_did

string

Decentralized identifier of the originating CASP. Applicable when wallet\_type is exchange.

submitted\_source\_address

string

On-chain source address of the deposit. Applicable when wallet\_type is self\_custody.

sender\_pii

object

Personally identifiable information of the sender. Applicable when sender\_type is you\_to\_me.

sender\_pii object

screenshot

string

Base64-encoded wallet screenshot. Required by the Travel Rule service above a jurisdictional notional threshold for self-custody deposits.

screenshot\_mime\_type

string

MIME type of the screenshot. Required when screenshot is provided.

X-SCX-SIGNED

string

required

HMAC-SHA256 signature of the request, base64-encoded. See the [Authentication guide](https://docs.zerohash.com/reference/api-authentication) for the exact signing formula.

X-SCX-TIMESTAMP

string

required

Current Unix timestamp in seconds. Must be within 60 seconds of server time or the request is rejected.

# 

200

Successfully submitted Travel Rule information. Returns the resulting submission status.

object

message

object

status

string

enum

Result of the Travel Rule submission. Possible values: approved, pending\_review.

`approved` `pending_review`

# 

400

Bad Request

# 

403

Forbidden

# 

404

Not Found

# 

500

Internal Server Error

# 

503

Service Unavailable

Updated 6 days ago

---

Did this page help you?

Yes

No

ShellNodeRubyPHPPython

```
xxxxxxxxxx
1
curl --request POST \
2
     --url https://api.cert.zerohash.com/deposits/crypto/deposit_id/travel-rule \
3
     --header 'accept: application/json' \
4
     --header 'content-type: application/json' \
5
     --data '
6
{
7
  "sender_type": "me_to_me",
8
  "wallet_type": "exchange"
9
}
10
'
```

```
xxxxxxxxxx
 
1
{
2
  "message": {
3
    "status": "approved"
4
  }
5
}
```

Updated 6 days ago

---

Did this page help you?

Yes

No