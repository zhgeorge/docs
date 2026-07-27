# Source: https://docs.zerohash.com/docs/request-ids

## 

Overview

The `X-REQUEST-ID` header is a unique identifier attached to each API request. It helps both clients and servers trace, debug, and correlate requests throughout distributed systems.

## 

Why Use `X-REQUEST-ID`?

- **Traceability**: Track a request across multiple services and logs.
- **Debugging**: Quickly identify and troubleshoot issues by referencing the request ID.
- **Idempotency**: Prevent duplicate processing by reusing the same request ID for [retries](https://docs.zerohash.com/docs/error-handling#retrying-timeouts-and-transient-errors%3E).

## 

How to Use

### 

1\. Generate a Unique Request ID

- Use a version 4 UUID.
- Example: `4b5ef19e-4ad5-4750-8bf6-3e5238b976ec`

### 

2\. Add the Header to Your API Request

Include the header in every request to the API, case-insensitive:

```
X-REQUEST-ID: 4b5ef19e-4ad5-4750-8bf6-3e5238b976ec
```

#### 

Example (cURL):

Bash

```
curl -X POST https://api.cert.zerohash.com/participants/customers/new \
  -H "X-REQUEST-ID: 4b5ef19e-4ad5-4750-8bf6-3e5238b976ec" \
  -H 'X-SCX-SIGNED: auto-generated on fly' \
  -H 'X-SCX-TIMESTAMP: auto-generated on fly' \
  -H 'accept: application/json' \
  -H 'content-type: application/json' \
  -d '{ ... }'
```

#### 

Example (JavaScript/Node.js):

JavaScript

```
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

axios.post('https://api.cert.zerohash.com/participants/customers/new', data, {
  headers: {
    'X-REQUEST-ID': uuidv4(),
    'X-SCX-SIGNED': 'auto-generated on fly',
  	'X-SCX-TIMESTAMP': 'auto-generated on fly'
  }
});
```

## 

Best Practices

- Always send a new `X-REQUEST-ID` for each request.
- Log the request ID on the client side for troubleshooting.
- If retrying a request, reuse the same request ID.

## 

Server Behavior

- The server will echo the `X-REQUEST-ID` in response header.
- If omitted, the server may generate one automatically.
- Use the request ID when contacting support for faster resolution.

**Note**: The `X-REQUEST-ID` header is for request tracking and is not used for authentication. Always include your authentication headers as required.

---

## 

Idempotency on Specific Endpoints

### 

Transfers

The `client_transfer_id` field in the [POST /transfers](https://docs.zerohash.com/reference/post_transfers-1) request body acts as a crucial guard against duplicate transfer creation.

**Uniqueness Constraint:** The value of `client_transfer_id` must be unique across your entire platform for a rolling 72-hour period. zerohashash enforces this constraint to prevent unintended duplication of transfers.

**Protection Mechanism:** If a [POST /transfers](https://docs.zerohash.com/reference/post_transfers-1) request is sent with a `client_transfer_id` that already exists and is associated with a successfully created transfer within the 72-hour window, the API will reject the request with the following specific error:

`{"error":true,"message":"Request does not contain an unique client_transfer_id"}`

**Handling Failed or Timed-Out Transfer Requests** 
Due to the `client_transfer_id` constraint, you must not simply retry a [POST /transfers](https://docs.zerohash.com/reference/post_transfers-1) request using the same `client_transfer_id` if the initial request fails or times out the transfer may still have been created on the zerohash side.

The recommended retry logic is as follows:

**Initial Failure/Timeout:** When the original [POST /transfers](https://docs.zerohash.com/reference/post_transfers-1) call fails or times out, do not immediately retry the POST with the same `client_transfer_id`.

**Query Status:** First, use the [GET /transfers](https://docs.zerohash.com/reference/get_transfers-1) endpoint to query the status of the potential transfer. You can filter this endpoint using the specific `client_transfer_id` that was used in the failed request.

**Determine Next Step:**

If the transfer exists (i.e., the query returns a successful transfer record): The original request succeeded, and no further action is needed.

If the transfer does not exist (i.e., the query returns no record): The original request truly failed or was never received. In this case, you can retry the transfer request with the original `client_transfer_id`.

This methodology ensures you never attempt to create the same transfer twice using the same identifier or duplicate a transfer, relying on the [GET /transfers](https://docs.zerohash.com/reference/get_transfers-1) endpoint to determine the fate of the ambiguous initial request.

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page