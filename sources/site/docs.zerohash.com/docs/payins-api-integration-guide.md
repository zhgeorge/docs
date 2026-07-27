# Source: https://docs.zerohash.com/docs/payins-api-integration-guide

See core product page [here](https://docs.zerohash.com/docs/payins).

## 

Definitions

| Term | Definition |
| --- | --- |
| Platform | The company that is under contract with zerohash and integrates directly with the zerohash's API |
| Merchant | A business entity (non-natural person) that serves as the customer-facing front-end in the transaction flow. Typically, the Merchant is a customer of the Platform and is where the Shopper initiates their interaction. In some cases, the Merchant and Platform may be the same entity. |
| Shopper | The natural person that pays for the good or service |

## 

How the Integration Works

A high-level summary of each step of the Payins API integration

| Step | Notes |
| --- | --- |
| Merchant onboarding | Onboard the merchants that sell goods and services through your platform. Only applicable when Platform is not acting as the Merchant (ex. PSPs that acquire merchants) |
| Shopper onboarding | Onboard Shoppers making their first crypto or stablecoin purchases |
| Initiate Shopper's payment | Generate deposit instructions for Shoppers |
| Initiate refund | Link external account where Shopper will receive funds and facilitate repayment |

## 

Payins prerequisites

Complete these checks before you call `POST /pay/rfq`.

| Pre-condition | If missing, `POST /pay/rfq` returns |
| --- | --- |
| Ask zerohash to enable this product for you | `401` — `"Your Platform is not configured to use the Pay product"` |
| Transacting participant has signed the `ACCOUNT_FUNDING_PAY` agreement | `401` — `"Participant has not signed the required agreement for Pay"` |
| API key has Pay `READ_AND_WRITE` permission | `403` — `"This api key does not have write permission to this endpoint"` (`GET` endpoints return the read-permission variant) |

## 

1\. Submit Merchant

> ℹ️
> 
> ### 
> 
> Who this applies to
> 
> This guide is relevant when the Platform has many merchants. If the Platform is itself the merchant, this step is not required.

Begin by submitting the Merchant via [POST /participants/entity/new.](https://docs.zerohash.com/reference/post_participants-entity-new) See more information [here](https://docs.zerohash.com/docs/merchant-onboarding-guide).

## 

2\. Query Merchant

You can query already-submitted Merchants via the [GET /participants](https://docs.zerohash.com/reference/get_participants) endpoint. If you'd like to query a specific Merchant, use the`participant_code` parameter.

## 

3\. Fund Refund Account

To enable future refunds, you must pre-fund your Refund account by sending a wire transfer to the designated bank account provided by our settlement team. Ensure the wire **memo** is tagged with your Platform code + "\_refund" (ie, PLAT01\_refund):

Here are the [account](https://docs.zerohash.com/docs/what-is-an-account) details:

- Participant\_code: 00SCXM
- Account\_group: PLAT01 (replace with your `participant_code`)
- Account\_label: pay\_refund
- Account\_type: available
- Asset: USD

## 

4\. Submit Shopper

Next, you'll need to onboard the end users (ie, "Shoppers"). Depending on transaction type and the Shopper's transaction volume and residence, we have differing level of diligence requirements. See more information on Shopper Onboarding [here](https://docs.zerohash.com/docs/onboard-shoppers).

Use [POST /participants/customers/new](https://docs.zerohash.com/reference/post_participants-customers-new) to create a new shopper. Set `onboarding_profile = "shopper"` and `partial = true` to distinguish this participant from a standard participant.

**Sample Request**

JSON

```
{
  "onboarding_profile": "shopper",
  "email": "shopper@example.com",
  "partial": true
}
```

Shoppers with `onboarding_profile = "shopper"` and `partial = true` are auto-approved upon creation as long as the minimum required data is present: a `phone_number` or `email`. No additional fields are required at creation time — further data can be added later via PATCH as the shopper's transaction tier requires it.

> 📘
> 
> ### 
> 
> Signature Collection
> 
> For the Payins API Solution, it is critical that you collect consent from the Shopper to zerohash's user agreements and share confirmation that consent was collected through the [POST /participants/customers/new](https://docs.zerohash.com/reference/post_participants-customers-new) endpoint.

## 

5\. Query Shopper

To retrieve general information about the Shopper, query the [GET /participants](https://docs.zerohash.com/reference/get_participants) endpoint. You can use the `participant_code` filter to retrieve an individual Shopper.

## 

6\. Query Shopper Limits

To retrieve transaction limits for a Shopper's tier, query the [GET /pay/limits](https://docs.zerohash.com/reference/get_pay-limits) endpoint. You can use the `participant_code` attribute to retrieve an individual Shopper. Use the `merchant_participant_code` attribute to query total volume aggregated for a particular merchant.

Example Response:

JSON

```
{
  "message": {
    "request_id": "test-request-id",
    "participant_code": "SHOPP1",
    "merchant_participant_code": "MERCH1",
    "merchant_classification": "NON-TRANSFERABLE-3",
    "current_level": 2,
    "current_limits": [
      {
        "limit": "1000.00",
        "spent": "250.00",
        "remaining": "750.00",
        "window": "daily"
      }
    ],
    "platform_totals": [
      {
        "window": "daily",
        "currency": "USD",
        "total_amount": "5000.00",
        "transaction_count": 12
      }
    ],
    "merchant_totals": [
      {
        "window": "daily",
        "currency": "USD",
        "total_amount": "250.00",
        "transaction_count": 3
      }
    ]
  }
}
```

## 

7\. Accounts

The Platform will have the following [accounts](https://docs.zerohash.com/docs/what-is-an-account) at zerohash:

| Account | Description | Technical Details |
| --- | --- | --- |
| Settlement Account | The fiat account that contains the balance of **successful payments** | \- `participant_code` = \[your platform code or merchant's participant code\]<br>\- `account_group` = \[your platform code\] - `account_label` = pay<br>\- `account_type` = available<br>\- `asset` = USD (or other fiat currency being used) |
| Refund Float Account | The fiat account, funded by the Platform, that is used to refund Shoppers. The balances here will be converted to a crypto or stablecoin asset and sent on-chain to the Shopper. See section, "11. Refund a Payment" below for details | \- `participant_code` = 00SCXM<br>\- `account_group` = \[your platform code\] - `account_label` = pay\_refund<br>\- `account_type` = available<br>\- `asset` = USD (or other fiat currency being used) |
| Error Account | The fiat account that accumulates due to error scenarios (over payment, under payment, incorrect asset or network, late payment | \- `participant_code` = \[your platform code or merchant's participant code\]<br>\- `account_group` = \[your platform code\]<br>\- `account_label` = pay\_error<br>\- `account_type` = available<br>\- `asset` = USD (or other fiat currency being used) |

## 

8\. Initiate Payment

### 

Request a quote - [POST /pay/rfq](https://docs.zerohash.com/reference/post_pay-rfq-1)

Generate quote for the payment amount.

**Example Request:**

JSON

```
{
  "participant_code": "SHOPP1",
  "pay_asset": "USDC",
  "quoted_total": "100.00",
  "quoted_currency": "USD",
  "account_label": "pay",
  "client_reference_id": "order-12345",
  "merchant_participant_code": "MERCH01" //optional, only use when Platform!= Merchant
}
```

Interpretation of this request - the Shopper (`SHOPP1`) is making a $100 payment to the Merchant (`MERCH01`)using `USDC` as the payment asset. `quoted_currency` is an enum with one supported value: `USD`.

If the Shopper (`SHOPP1`) has sufficient PII data for the diligence Tier required for the transaction, [POST /pay/rfq](https://docs.zerohash.com/reference/post_pay-rfq-1) will return the quote with a and `deposit_address`.

**Example Response:**

JSON

```
{
  "request_id": "14f8ebb8-7530-4aa4-bef9-9d73d56313f3",
  "participant_code": "SHOPP1",
  "pay_asset": "USDC",
  "rate": "1",
  "quoted_currency": "USD",
  "quoted_total": "100",
  "underlying_quantity": "100",
  "price_expire_ts": null,
  "deposit_address": "0x5f59B625036ccB4f7aD27Ca4Cb896e4452AfFDAF",
  "transaction_id": "550e8400-e29b-41d4-a716-446655440000",
  "client_reference_id": "order-1001",
  "is_static": true
}
```

| Field | Type | Notes |
| --- | --- | --- |
| `request_id` | UUID string | Echoed back from Zero Hash for request correlation. |
| `participant_code` | string | Shopper participant code. |
| `pay_asset` | string | Network-qualified asset, such as `USDC.SOL`, `USDC.BASE`, or `BTC`. |
| `rate` | decimal string | Quoted rate at the moment of RFQ. |
| `quoted_currency` | string | Enum: `USD`. |
| `quoted_total` | decimal string | Amount in `quoted_currency`. |
| `underlying_quantity` | decimal string | Amount in `pay_asset`. |
| `price_expire_ts` | ISO 8601 UTC string or `null` | May be `null` for stablecoins. |
| `deposit_address` | string | Blockchain address on the `pay_asset` network. |
| `transaction_id` | UUID string | Use this as the path parameter for `POST /pay/{id}/rfq`. This is distinct from the settled `transaction_id` in webhook payloads and `GET /pay/transactions` rows. |
| `client_reference_id` | string, optional | Whatever you sent on the request, echoed back. This is a free-form string. |
| `is_static` | boolean | Indicates whether the deposit address is reused or generated per RFQ |

### 

Error Responses

**KYC Requirements Not Met**

If the Shopper (`SHOPP1`) has **insufficient** PII data for the [Shopper Tier](https://docs.zerohash.com/docs/onboard-shoppers) required for the transaction, [POST /pay/rfq](https://docs.zerohash.com/reference/post_pay-rfq-1) will return an error message identifying missing requirements:

JSON

```
{
  "error": "Shopper KYC requirements for this transaction are not met",
  "missing_requirements": [
    "first_name",
    "last_name",
    "date_of_birth"
  ]
}
```

You can use these guidelines to update the Shopper accordingly via [PATCH /participants/customers,](https://docs.zerohash.com/reference/patch_participants-customers-participant-code) and then call [POST /pay/rfq](https://docs.zerohash.com/reference/post_pay-rfq-1) again.

**Manual Approval Required**

Manual approval by zerohash is required for transactions at or above $500,000, or when a Shopper's lifetime spend reaches $500,000 or more. When a Platform calls [POST /pay/rfq](https://docs.zerohash.com/reference/post_pay-rfq-1) to generate a quote and `deposit_address` for a transaction that breaches $500,000, the response will look like this:

JSON

```
{
   "error": "Manual approval required for this transaction",
  "transaction_id": "txn_01HZF7QWXJ8XK3VYNS6TKDM4G2"
}
```

This response means that the transaction has been submitted for zerohash approval. You will receive a [webhook](https://docs.zerohash.com/reference/payins-transaction-updates) once the status of the transaction has been updated, and can then use the `transaction_id` returned in the response as the path parameter when calling [POST /pay/{id}/rfq](https://docs.zerohash.com/reference/post_pay-rfq-1) to refresh the quote.

### 

End customer initiates on-chain payment

On the Platform's user interface, the Shopper is presented with the deposit\_address returned by [POST /pay/rfq](https://docs.zerohash.com/reference/post_pay-rfq-1), and the amount to deposit. They use their Metamask wallet, for example, to trigger a withdrawal into the `deposit_address` for the amount of the payment.

### 

Payment Successful

#### 

Successful Payment (exact amount)

Once a successful payment is received for the **exact amount**, we'll send a **webhook** to you that looks like this:

JSON

```
{
  "participant_code": "SHOPP1",
  "fund_asset": "USDC.BASE",
  "rate": "1",
  "quoted_currency": "USD",
  "source_address": "external",
  "deposit_address": "0xb07C48f0BF25A97034c818Dc643A98e42703D20c",
  "quantity": "100",
  "notional": "100",
  "fund_id": "6767a149-4771-4166-ba07-a2542e361318",
  "fund_timestamp": 1756376889792000000,
  "deposit_timestamp": 1756376889499000000,
  "transaction_id": "d1d731ed-952c-410e-b62b-eb00e3d096fc",
  "account_label": "general",
  "success": true,
  "status_reason_code": "DEPOSIT_PROCESSED",
  "reference_id": "04918aef-41d1-4dfb-82b8-2fdc232a8d88",
  "raw_fee_bps": "",
  "deposit_fee_bps": "",
  "raw_fee_notional": "",
  "deposit_fee_notional": ""
}
```

#### 

Successful Payment (over payment)

Once a successful payment is received where the Shopper sent **too much**, we'll send a **webhook** to you that looks like this:

JSON

```
{
  "participant_code": "SHOPP1",
  "fund_asset": "USDC.BASE",
  "rate": "1",
  "quoted_currency": "USD",
  "source_address": "external",
  "deposit_address": "0xb07C48f0BF25A97034c818Dc643A98e42703D20c",
  "quantity": "100",
  "notional": "100",
  "fund_id": "6767a149-4771-4166-ba07-a2542e361318",
  "fund_timestamp": 1756376889792000000,
  "deposit_timestamp": 1756376889499000000,
  "transaction_id": "d1d731ed-952c-410e-b62b-eb00e3d096fc",
  "account_label": "general",
  "success": true,
  "status_reason_code": "DEPOSIT_PROCESSED",
  "status_reason": "over payment",
  "reference_id": "04918aef-41d1-4dfb-82b8-2fdc232a8d88",
  "raw_fee_bps": "",
  "deposit_fee_bps": "",
  "raw_fee_notional": "",
  "deposit_fee_notional": ""
}
```

### 

Payment Unsuccessful

| Failure scenario | Expected remediation steps |
| --- | --- |
| Under payment | Shopper to contact Platform → Platform to facilitate a withdraw via `POST /payments` to Shopper's wallet |
| Depeg | Shopper to contact Platform → Platform to contact zerohash via Slack or Email to facilitate withdrawals back to the Shopper manually |
| Above max threshold | Shopper to contact Platform → Platform to contact zerohash via Slack or Email to facilitate withdrawals back to the Shopper manually |
| Quarantine | Shopper to contact Platform → Platform to contact zerohash via Slack or Email. Note: zerohash will likely `disable` this Shopper, as this scenario is typically triggered due receiving a deposit from a high-risk source address |
| Late payment | Shopper to contact Platform → Platform to facilitate a withdraw via `POST /payments` to Shopper's wallet |
| Wrong asset or network | Shopper to contact Platform → Platform to facilitate a withdraw via `POST /payments` to Shopper's wallet |

#### 

Payment Unsuccessful (under payment)

Upon a payment for an **insufficient amount**, a webhook notification will be triggered as follows

JSON

```
{
  "participant_code": "SHOPP1",
  "fund_asset": "USDC.BASE",
  "rate": "1",
  "quoted_currency": "USD",
  "source_address": "external",
  "deposit_address": "0xb07C48f0BF25A97034c818Dc643A98e42703D20c",
  "quantity": "90",
  "notional": "",
  "fund_id": "6767a149-4771-4166-ba07-a2542e361318",
  "fund_timestamp": 1756376889792000000,
  "deposit_timestamp": 1756376889499000000,
  "transaction_id": "d1d731ed-952c-410e-b62b-eb00e3d096fc",
  "account_label": "general",
  "success": false,
  "status_reason_code": "PROCESSING_FAILED",
  "status_reason": "under payment",
  "reference_id": "04918aef-41d1-4dfb-82b8-2fdc232a8d88",
  "raw_fee_bps": "",
  "deposit_fee_bps": "",
  "raw_fee_notional": "",
  "deposit_fee_notional": ""
}
```

#### 

Successful Payment (depeg)

If a stablecoin becomes depegged, to mitigate zerohahs's risk, we will manually mark the asset as depegged on our side. This will block all “sell” transactions converting that stablecoin to USD. Should we receive a payment deposit during this period, we will not convert the deposit to fiat. Instead, the funds will be moved to a dedicated depeg account, and a webhook notification will be triggered as follows:

JSON

```
{
  "participant_code": "SHOPP1",
  "fund_asset": "USDC.BASE",
  "rate": "1",
  "quoted_currency": "USD",
  "source_address": "external",
  "deposit_address": "0xb07C48f0BF25A97034c818Dc643A98e42703D20c",
  "quantity": "100",
  "notional": "",
  "fund_id": "6767a149-4771-4166-ba07-a2542e361318",
  "fund_timestamp": 1756376889792000000,
  "deposit_timestamp": 1756376889499000000,
  "transaction_id": "d1d731ed-952c-410e-b62b-eb00e3d096fc",
  "account_label": "general",
  "success": false,
  "status_reason_code": "PROCESSING_FAILED",
  "status_reason": "depeg",
  "reference_id": "04918aef-41d1-4dfb-82b8-2fdc232a8d88",
  "raw_fee_bps": "",
  "deposit_fee_bps": "",
  "raw_fee_notional": "",
  "deposit_fee_notional": ""
}
```

#### 

Above max threshold

zerohash has certain liquidation maximums on our end. If a large deposit is received above this threshold, a webhook notification will be triggered as follows:

JSON

```
{
  "participant_code": "SHOPP1",
  "fund_asset": "USDC.BASE",
  "rate": "1",
  "quoted_currency": "USD",
  "source_address": "external",
  "deposit_address": "0xb07C48f0BF25A97034c818Dc643A98e42703D20c",
  "quantity": "10000000",
  "notional": "",
  "fund_id": "6767a149-4771-4166-ba07-a2542e361318",
  "fund_timestamp": 1756376889792000000,
  "deposit_timestamp": 1756376889499000000,
  "transaction_id": "d1d731ed-952c-410e-b62b-eb00e3d096fc",
  "account_label": "general",
  "success": false,
  "status_reason_code": "PROCESSING_FAILED",
  "status_reason": "above max threshold",
  "reference_id": "04918aef-41d1-4dfb-82b8-2fdc232a8d88",
  "raw_fee_bps": "",
  "deposit_fee_bps": "",
  "raw_fee_notional": "",
  "deposit_fee_notional": ""
}
```

#### 

Quarantine

If zerohash detects that the source address of the payment deposit is high-risk, a webhook notification will be triggered as follows:

JSON

```
{
  "participant_code": "SHOPP1",
  "fund_asset": "USDC.BASE",
  "rate": "1",
  "quoted_currency": "USD",
  "source_address": "external",
  "deposit_address": "0xb07C48f0BF25A97034c818Dc643A98e42703D20c",
  "quantity": "10000000",
  "notional": "",
  "fund_id": "6767a149-4771-4166-ba07-a2542e361318",
  "fund_timestamp": 1756376889792000000,
  "deposit_timestamp": 1756376889499000000,
  "transaction_id": "d1d731ed-952c-410e-b62b-eb00e3d096fc",
  "account_label": "general",
  "success": false,
  "status_reason_code": "PROCESSING_FAILED",
  "status_reason": "For Zero Hash Compliance reasons, the deposit has not been converted to fiat and the crypto has been credited to a Zero Hash holding account",
  "reference_id": "04918aef-41d1-4dfb-82b8-2fdc232a8d88",
  "raw_fee_bps": "",
  "deposit_fee_bps": "",
  "raw_fee_notional": "",
  "deposit_fee_notional": ""
}
```

#### 

Late payment

If zerohash receives a payment deposit past the Payment Window, a webhook notification will be triggered as follows:

JSON

```
{
  "participant_code": "SHOPP1",
  "fund_asset": "USDC.BASE",
  "rate": "1",
  "quoted_currency": "USD",
  "source_address": "external",
  "deposit_address": "0xb07C48f0BF25A97034c818Dc643A98e42703D20c",
  "quantity": "10000000",
  "notional": "",
  "fund_id": "6767a149-4771-4166-ba07-a2542e361318",
  "fund_timestamp": 1756376889792000000,
  "deposit_timestamp": 1756376889499000000,
  "transaction_id": "d1d731ed-952c-410e-b62b-eb00e3d096fc",
  "account_label": "general",
  "success": false,
  "status_reason_code": "DEPOSIT_WINDOW_EXPIRED",
  "status_reason": "payment session has expired",
  "reference_id": "04918aef-41d1-4dfb-82b8-2fdc232a8d88",
  "raw_fee_bps": "",
  "deposit_fee_bps": "",
  "raw_fee_notional": "",
  "deposit_fee_notional": ""
}
```

#### 

Wrong asset or network

If zerohash receives a payment deposit for an asset that was not selected by the Shopper on the Select Asset page, a webhook notification will be triggered as follows:

JSON

```
{
  "participant_code": "SHOPP1",
  "fund_asset": "ETH",
  "rate": "1",
  "quoted_currency": "USD",
  "source_address": "external",
  "deposit_address": "0xb07C48f0BF25A97034c818Dc643A98e42703D20c",
  "quantity": ".15",
  "notional": "",
  "fund_id": "6767a149-4771-4166-ba07-a2542e361318",
  "fund_timestamp": 1756376889792000000,
  "deposit_timestamp": 1756376889499000000,
  "transaction_id": "d1d731ed-952c-410e-b62b-eb00e3d096fc",
  "account_label": "general",
  "success": false,
  "status_reason_code": "PROCESSING_FAILED",
  "status_reason": "deposit currency does not match the expected currency",
  "reference_id": "04918aef-41d1-4dfb-82b8-2fdc232a8d88",
  "raw_fee_bps": "",
  "deposit_fee_bps": "",
  "raw_fee_notional": "",
  "deposit_fee_notional": ""
}
```

## 

9\. Query payments

You can query our REST endpoint [GET /pay/transactions](https://docs.zerohash.com/reference/get_pay-transactions-1) to retroactively view payment details.

### 

Query parameters

All filters combine with `AND`. The response shape matches the [List payin transactions](https://docs.zerohash.com/reference/get_pay-transactions-1) reference page.

| Query param | Type | Notes |
| --- | --- | --- |
| `participant_code` | string | Required for default listing. |
| `page` | integer | Default `1`. |
| `page_size` | integer | Default `50`, capped at `50`. Passing `100` is silently clamped. |
| `transaction_id` | string | Exact match on the settled transaction ID. |
| `pay_asset` | string | Asset filter, such as `USDC.SOL`. Response rows return this value as `fund_asset`. |
| `success` | boolean | `true` returns only settled-with-success transactions. |
| `client_reference_id` | string | Exact match on the value you sent in the RFQ. |
| `deposit_timestamp_gte` | integer, Unix seconds | Lower-bound inclusive. |
| `deposit_timestamp_gt` | integer, Unix seconds | Lower-bound exclusive. |
| `deposit_timestamp_lte` | integer, Unix seconds | Upper-bound inclusive. |
| `deposit_timestamp_lt` | integer, Unix seconds | Upper-bound exclusive. |

**Sample Response:**

JSON

```
    {
      "participant_code": "SHOPP1",
      "fund_asset": "USDC",
      "quoted_currency": "USD",
      "deposit_address": "0xabc123usdcwalletaddress",
      "rate": "1.00",
      "quantity": "100.00",
      "notional": "100.00",
      "fund_timestamp": 1712756400,
      "transaction_id": "111e8400-e29b-41d4-a716-446655440000",
      "account_label": "pay",
      "fund_id": "fund-usdc-1001",
      "success": true,
      "status_reason": "",
      "status_reason_code": "",
      "is_first_deposit": true,
      "raw_fee_bps": "25",
      "actual_fee_bps": "25",
      "raw_fee_notional": "0.25",
      "actual_fee_notional": "0.25",
      "deposit_timestamp": 1712756700,
      "source_address": "0xsenderwallet123",
      "deposited_asset": "USDC",
      "client_reference_id": "order-1001",
      "source": {
        "source_type": "on_chain",
        "integration": "ethereum"
      },
      "deposit_fee_type": "DEPOSIT_FEE_TYPE_FLAT",
      "fee_tier_breakdown": []
    }
  ],
  "page": 1,
  "page_size": 50,
  "total_pages": 1
}
```

## 

10\. Settlement

Withdrawals from Merchant or Platform participant accounts to external bank accounts can be initiated through [POST /withdrawals/requests.](https://docs.zerohash.com/reference/post_withdrawals-requests)

## 

11\. Refund a Payment

In order to initiate a refund, you should use the following endpoints:

- [POST /payments/external\_accounts](https://docs.zerohash.com/reference/post_payments-external-accounts) - links a crypto account where the Shopper will receive their refund
- [POST /payments](https://docs.zerohash.com/reference/post_payments) - initiates a conversion from USD (using Refund account) to the crypto asset. This API call will also automatically and immediately send the funds on-chain.

> 🚧
> 
> ### 
> 
> IMPORTANT: You **cannot** rely on the deposit’s source address as the refund destination. Blockchain transactions are not inherently bidirectional, and returning funds to the sender address may result in loss of funds or failed deliveries.
> 
> Some Platforms may choose to pair their zerohash integration with their own transaction monitoring tools. In situations where zerohash accepts a deposit, but the Platform’s monitoring logic flags and rejects it, the Platform may opt to return the deposit by using the POST /convert\_withdraw/rfq and POST /convert\_withdraw/execute endpoint.
> 
> The required flow is to always request and confirm a return address directly from the Shopper before initiating the return.
> 
> Please speak to a zerohash solutions engineer for guidance if interested in this flow.

Updated 27 days ago

---

Did this page help you?

Yes

No

Copy Page