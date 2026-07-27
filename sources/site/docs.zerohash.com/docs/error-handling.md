# Source: https://docs.zerohash.com/docs/error-handling

## 

Common error HTTP status codes

| Status Code | Description | Remediation Steps |
| --- | --- | --- |
| 400 Bad Request | The server could not understand the request, most likely due to invalid syntax. | Please check if the request you are sending is syntactically and semantically correct. Contact zerohash if you continue to experience issues. |
| 401 Unauthorized | The server could not authenticate your request. | Ensure your API keys, credentials, and request URL are valid. |
| 403 Forbidden | You are not authorized to access the requested resource. | Ensure your API keys, credentials, and request URL are valid. Also, check if your IP address is allow-listed in our platform. Lastly, please confirm the resource you're trying to access belongs to your platform. |
| 404 Not Found | The requested resource was not found. | Check your request URL and entity identifiers - ensure they exist. |
| 409 Conflict | The request could not be completed due to a conflict with the current state. This often means you are trying to create a duplicate entity or a failure in acquiring a lock. | Check your request. Contact zerohash if you continue to experience issues. |
| 429 Too Many Requests | The client has triggered the Rate Limit thresholds. | Wait 10 seconds to be able to successfully send another request. |
| 500 Internal Server Error | The server has encountered an internal error. | Please capture the details of your request and contact zerohash for further troubleshooting. |
| 502 Bad Gateway | There was a glitch in our internal infrastructure, or the request timed out. | Make an idempotence check and retry if necessary. See below for details. |
| 503 Service Unavailable | The server has encountered a transient internal error. It could also mean it failed to acquire an internal lock (in that case, it's not an error, just a race condition). | Generally safe to retry. See below for details. |
| 504 Gateway Timeout | There was a glitch in our internal infrastructure, or the request timed out. | Make an idempotence check and retry if necessary. See below for details. |
| 1020 Access Denied | Error 1020 Access Denied is caused when a firewall rule has been violated on a site protected by Cloudflare. | Contact ZH support and provide a list of IPs that should be added to the allowlist. |

## 

Retrying timeouts and transient errors

Retrying 502, 503, and 504 HTTP status codes will greatly increase the resilience of your application. However, some endpoints are **not** safe to retry without first running an idempotence check. Not following this rule could result in undesired side effects.

All **GET** requests are idempotent and safe to retry. For example, if GET /liquidity/rfq returns 502 Bad Gateway, it can be retried without additional checks.

When it comes to **POST** requests, the general rule is:

- When receiving 502 Bad Gateway or 504 Gateway Timeout status codes, the state is indeterminate and an **idempotency check** is required before retrying.
- When receiving 503 Service Unavailable, it should be safe to retry the request without an idempotence check.

The table below shows how to retry some endpoints, more specifically for Liquidity.

| Endpoint | Status Codes | Idempotence check |
| --- | --- | --- |
| POST /liquidity/execute | 502, 503, 504 | Safe to be retried. |
| POST /liquidity/execute | 404 | Use the quote\_id as the client\_trade\_id query parameter to run `GET /trades`.<br>If the trade is not found, the quote has expired. Retry by getting a new RFQ: `GET /liquidity/rfq` → `POST /liquidity/execute` |
| POST /convert\_withdraw/execute | 502, 503, 504 | Safe to be retried. |
| POST /convert\_withdraw/execute | 404 | Use the quote\_id as the client\_trade\_id query parameter to run GET /trades. If the trade is not found, the quote has expired. Retry by getting a new RFQ: GET /convert\_withdraw/rfq → POST /convert\_withdraw/execute |
| POST /participants/customers/new | 400 | Two types of responses if there is a participant data conflict:<br>**400 Participant already exists with this email for this platform:**<br>\- Returned when ZH receives different data (e.g. name, ssn, DoB) for an existing participant email.<br>**400 Participant data already used with different requestID:**<br>\- Returned on 2nd request when same payload received twice and X-REQUEST-ID is not supplied in the header.<br>\- Returned on 2nd request when same payload received twice with different X-REQUEST-ID.<br>\- Returned on 2nd request when two different payloads received with same X-REQUEST-ID.<br>Use a GET request to validate if a customer creation was successful.<br>Note: Other 400 responses may include format errors in payload such as email, country, ID number, etc |

Please do **not** retry 500 Internal Server Error, which indicates an issue with our API. If you are experiencing problems, please contact our support team.

## 

Retry backoff

When retrying, please add a backoff to avoid overloading our systems or making a problem worse. We recommend an **exponential backoff** algorithm, i.e, start with a small backoff (eg: 100 - 500ms) and exponentially increase it after successive retries.

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page