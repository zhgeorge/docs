# Source: https://docs.zerohash.com/docs/api-security

## 

Authentication

zerohash Uses HMAC SHA-256 verification to ensure the authenticity of every API request. See Authentication section here for more details.

## 

Rate Limiting

- zerohash will rate limit based on IP Address
- You will be rate limited once you breach 2,000 requests over a rolling 10 second timeframe, across all endpoints
- Example: If you hit `GET /liquidity/rfq` 1,000 times and GET /trades 1,001 times over a 5 seconds period, you will be unable to access the API for the next 10 seconds. 11 seconds later, you will be able to access the API again 
 Error Code when the limit is breached: HTTP/1.1 429
 - Error Message: Too Many Requests
 - The Rate Limit specs above apply to both Prod and Cert

## 

IP Allowlisting

We have implemented a dual-layer IP Allowlisting feature:

**Layer 1** 
We need to know every IP address that a connected-platform will be interacting with our API from. This initially will be communicated to zerohash via Slack, but eventually will be self-service via the Portal.

- Most Corporate Non-public VPNs are accepted for connectivity to the zerohash Platform. Public VPNs are not permitted.
- A Static IP in either Ipv4 or Ipv6
- Individual/Personal IPs will not be permitted

**Layer 2** 
From this master list, platforms have the ability to attach IP addresses to specific API keys. This is done via the Portal. More details below.

## 

API Keys

### 

General

API keys are created by users on the Portal UI by navigating to the **API Keys** page under the Administration tab clicking the Add API Key button:

![](https://files.readme.io/5e924a1-image.png)

You will be presented with a few options to fill out:

![](https://files.readme.io/365d04b-image.png) 

**Nickname:** Personalized identifier for the key. Only relevant for display purposes on the UI after the key has been created.

**Passphrase:** Another personalized identifier for the key. Should be saved by the user and will be used as the X-SCX-PASSPHRASE header when signing requests.

**Expiration Date:** Optional expiration date. If left untouched, the key will never expire. This is helpful if you'd like to enforce a regular cadence of key change-out for increased security.

**Allowed IPs:** This option gives the user the ability to specify a list of IP addresses that can successfully interact with zerohash's APIs. If enabled, zerohash will evaluate the originating IP and compare with the Allow List. If the IP is present within the list, the request will not be rejected. If left untouched, no IP validation will be done.

- Supported formats: IPv4 and IPv6
- Maximum number of IPs: 10

**API Permissions:** Users can specify which of the products a particular key is allowed to interact with. If your organization is only intending on using a subset of products, you can use this feature to limit the risk of unwanted activity. You can also specify read-only keys which may be desired for use cases such as client-side monitoring, alerting, or dash-boarding.

### 

API Key Approvals

You can also configure your platform to require that newly created API Keys require a certain number of approvals. This is configurable by zerohash personnel only, so please reach out if interested.

There is also an audit trail you can view by clicking on the Details button.

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page