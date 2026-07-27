# Source: https://docs.zerohash.com/docs/onboard-shoppers

# 

Overview

zerohash uses a tiered diligence model for shoppers. The data required to onboard a shopper scale with transaction size and type, as well as aggregate spend. Merchants are responsible for collecting and submitting shopper data via the API (Self Serve onboarding), or may use the zerohash SDK to collect it on their behalf (zerohash Managed onboarding).

Every shopper, regardless of tier or the transaction type, must agree to the zerohash Payment Sender Terms before transacting.

## 

Creating a Shopper

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
> For the Payins API Solution, it is critical that you collect consent from the Shopper to zerohash's user agreements and share confirmation that consent was collected through the `signed_agreements`attribute in the the [POST /participants/customers/new](https://docs.zerohash.com/reference/post_participants-customers-new) endpoint.

## 

Updating a Shopper

Use [PATCH /participants/customers/participant\_code](https://api.cert.zerohash.com/participants/customers/%7Bparticipant_code%7D) to add or update fields on an existing shopper record. This is how merchants progressively collect data as a shopper's transaction activity moves them into higher tiers.

## 

Shopper Statuses

| **Status** | Description |
| --- | --- |
| `submitted` | The shopper has been submitted by the merchant. |
| `approved` | The shopper has been approved and may transact. |
| `pending_approval` | The shopper has been flagged for potential sanctions review. Manual review by the zerohash compliance team is required. |
| `rejected` | Terminal state. The shopper is rejected. |

# 

Tier Requirements by Transaction Type

The fields required on a Shopper Participant vary by transaction type. Transaction type (Perishable vs Non-Transferable vs Transferable) is determined by the Platform's (or Merchant's) `merchant_category_code`. The sections below describe what must be present on the shopper record before a transaction at each tier can be processed.

Ask your zerohash relationship manager for more information on which category of goods and services you fall into (Perishable vs Non-Transferable vs Transferable), based on your `merchant_category_code`.

![](https://files.readme.io/1953f61ff97c571d85d1f76557bf3616200e55e85096f36f9b5de7fd18d4c674-transferables_and_non-transferrable.png)

![](https://files.readme.io/2ea98cc9c16a8bc7d9ec71b2ca2cca6a719feb1bca72a922855d9e1abd38c9e9-perishables_1.png)

Example: If a Shopper’s total payment volume exceeds $50,000 within a 24-hour period, the shopper must meet Tier 3 requirements before any further payments can be processed.

See more detail on permitted jurisdictions [here](https://docs.zerohash.com/docs/permitted-and-restricted-jurisdictions).

## 

Non-Transferables

Non-Transferable goods and services (e.g. haircuts, airline flights, or store credit that cannot be withdrawn or transferred off-platform) follow a four-tier model. Each tier unlocks higher value transactions for Non-Transferable goods and services.

### 

Tier 1: Non-Transferables

_Transaction size:_ $0 < purchase amount < $2,100

AND

_Lifetime spend:_ ≤ $30,000

_Required fields:_

- `phone_number` OR `email`
- `first_name`
- `last_name`
- `address_one`
- `city`
- `zip`
- `jurisdiction_code`
- `date_of_birth`

### 

Tier 2: Non-Transferables

_Transaction size:_ $1,000 ≤ purchase amount < $50,000

AND

_Lifetime spend:_ ≤ $150,000

All Tier 1 fields, plus:

- `tax_id`
- `id_number`
- `id_number_type`
- `liveness_check`

_Document submission required:_ Yes. Submit corresponding IDV documents via [POST /participants/documents/](https://docs.zerohash.com/reference/post_participants-documents).

### 

Tier 3: Non-Transferables

_Transaction size:_ $50,000 ≤ purchase amount < $500,000

AND

_Lifetime spend:_ < $500,000

All Tier 2 fields, plus:

- `source_of_funds`
- `employment_status`
- `industry`

_Document submission required:_ Yes. Submit corresponding IDV documents via [POST /participants/documents/](https://docs.zerohash.com/reference/post_participants-documents).

### 

Tier 4: Non-Transferables

_Transaction size:_ $500,000 ≤ purchase amount

OR

_Lifetime spend:_ \>= $500,000

All Tier 3 fields. Additionally, the following supporting documents must be submitted via [POST /participants/documents/](https://docs.zerohash.com/reference/post_participants-documents):

| Document Type | `document_type` Value |
| --- | --- |
| Source of funds documentation | `source_of_funds_for_purchase` |
| Proof of employment status | `proof_of_employment_status` |
| Proof of industry | `proof_of_industry` |
| Any additional relevant purchase documentation (e.g. bill of sale) | `miscellaneous` |

_Spend limits:_ No limit. Lifetime spend resets after a Tier 4 transaction is manually approved. 
_Manual approval of transaction:_ Always required. Every Tier 4 transaction must be manually approved by zerohash before it is processed. When a shopper's lifetime spend reaches $500,000 or more, manual approval is required for that transaction.

_Examples:_

- A returning shopper has spent $490,000 via zerohash payins over 5 years. Today, the shopper initiates a transaction that is $20, bringing that transaction to the Tier 4 threshold.
- A net new shopper has $0 in lifetime spend, and is onboarding to initiate a first time transaction of $750,000. This transaction will require Tier 4 diligence.

## 

Transferables

Transferable goods and services (e.g. collectors items, watches, retail) follow the same four-tier structure as Non-Transferables, with identical field requirements and minor variation in spend limits.

### 

Tier 1: Transferables

_Transaction size:_ $0 < purchase amount < $1,000

AND

_Lifetime spend:_ ≤ $30,000

_Required fields:_

- `phone_number` OR `email`
- `first_name`
- `last_name`
- `address_one`
- `city`
- `zip`
- `jurisdiction_code`
- `date_of_birth`

### 

Tier 2: Transferables

_Transaction size:_ $2,100 ≤ purchase amount < $50,000

AND

_Lifetime spend:_ ≤ $150,000

All Tier 1 fields, plus:

- `tax_id`
- `id_number`
- `id_number_type`
- `liveness_check`

_Document submission required:_ Yes. Submit corresponding IDV documents via [POST /participants/documents/](https://docs.zerohash.com/reference/post_participants-documents).

### 

Tier 3: Transferables

_Transaction size:_ $50,000 ≤ purchase amount < $500,000

AND

_Lifetime spend: <_ $500,000

All Tier 2 fields, plus:

- `source_of_funds`
- `employment_status`
- `industry`

_Document submission required:_ Yes. Submit corresponding IDV documents via [POST /participants/documents/](https://docs.zerohash.com/reference/post_participants-documents).

### 

Tier 4: Transferables

_Transaction size:_ $500,000 ≤ purchase amount

OR

_Lifetime spend:_ \>= $500,000

All Tier 3 fields. Additionally, the following supporting documents must be submitted via [POST /participants/documents/](https://docs.zerohash.com/reference/post_participants-documents):

| Document Type | `document_type` Value |
| --- | --- |
| Source of funds documentation | `source_of_funds_for_purchase` |
| Proof of employment status | `proof_of_employment_status` |
| Proof of industry | `proof_of_industry` |
| Any additional relevant purchase documentation (e.g. bill of sale) | `miscellaneous` |

_Spend limits:_ No limit. Lifetime spend resets after a Tier 4 transaction is manually approved. 
_Manual approval of transaction:_ Always required. Every Tier 4 transaction must be manually approved by zerohash before it is processed. When a shopper's lifetime spend reaches $500,000 or more, manual approval is required for that transaction.

_Examples:_

- A returning shopper has spent $490,000 via zerohash payins over 5 years. Today, the shopper initiates a transaction that is $20, bringing that transaction to the Tier 4 threshold.
- A net new shopper has $0 in lifetime spend, and is onboarding to initiate a first time transaction of $750,000. This transaction will require Tier 4 diligence.

## 

Perishables

Perishable goods and services (e.g. items consumed at point-of-sale like food or transit) have a single tier with minimal diligence requirements and a $50 daily spend limit.

### 

**Tier 1: Perishables**

_Transaction size:_ $0 < purchase amount < $50

_Required fields:_

`phone_number` OR `email`

_Spend limits:_ $50/day

**Example:** create a shopper for a perishable transaction using [POST /participants/customers/new](https://docs.zerohash.com/reference/post_participants-customers-new)

JSON

```
{
  "onboarding_profile": "shopper",
  "email": "+13125550100"
}
```

## 

Query Shopper Limits

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

Error Handling (Self Serve Shopper Onboarding)

**Insufficient Shopper Diligence (409)** 
Returned by [POST /pay/rfq](https://docs.zerohash.com/reference/post_pay-rfq-1) or at invocation of the Payins SDK via `POST /client_auth_token` when a Shopper does not yet have the data required to transact at the requested tier.

Sample Response:

JSON

```
{
  "error": "Shopper diligence requirements for this transaction are not met",
  "missing_requirements": [
    "first_name",
    "last_name",
    "address_one",
    "zip",
    "city",
    "jurisdiction_code",
    "email_or_phone_number",
    "date_of_birth"
  ]
}
```

Use the missing\_requirements array to determine which fields need to be collected and submitted via [PATCH /participants/customers/participant\_code](https://api.cert.zerohash.com/participants/customers/%7Bparticipant_code%7D) before retrying the transaction.

**Unsupported Jurisdiction (422)** 
Returned by [POST /pay/rfq](https://docs.zerohash.com/reference/post_pay-rfq-1) or at invocation of the Payins SDK via `POST /client_auth_token`when the Shopper's jurisdiction is not supported for the requested transaction type.

Sample Response:

JSON

```
{
  "error": "Shopper jurisdiction not supported for this transaction"
}
```

See more detail on permitted jurisdictions [here](https://docs.zerohash.com/docs/permitted-and-restricted-jurisdictions).

**Daily Spend Limit Reached (422)** 
Returned by [POST /pay/rfq](https://docs.zerohash.com/reference/post_pay-rfq-1) or at invocation of the Payins SDK via `POST /client_auth_token` when the Shopper has hit their daily spend limit for Perishables or Tier 4 transactions.

- There is only one Tier available for Perishables transactions with a daily maximum spend of $50.
- After one transaction has been made at Transferables or Non-Transferables Tier 4, the Shopper must wait to transact again until lifetime spend resets the following day.

Sample Response:

JSON

```
{
  "error": "Shopper's Daily Spend Limit for this type of transaction have been hit."
}
```

## 

Error Handling (zerohash Managed Shopper Onboarding)

When a transaction is initiated by [POST /pay/rfq](https://docs.zerohash.com/reference/post_pay-rfq-1) or at invocation of the Payins SDK via `POST /client_auth_token`, if the Platform is on zerohash Managed Shopper Onboarding, the onboarding SDK will dynamically render to collect missing requirements.

**Unsupported Jurisdiction (422)** 
Returned by [POST /pay/rfq](https://docs.zerohash.com/reference/post_pay-rfq-1) or at invocation of the Payins SDK via `POST /client_auth_token` when the Shopper's jurisdiction is not supported for the requested transaction type.

Sample Response:

JSON

```
{
  "error": "Shopper jurisdiction not supported for this transaction"
}
```

See more detail on permitted jurisdictions [here](https://docs.zerohash.com/docs/permitted-and-restricted-jurisdictions).

**Daily Spend Limit Reached (422)**

Returned by [POST /pay/rfq](https://docs.zerohash.com/reference/post_pay-rfq-1) or at invocation of the Payins SDK via `POST /client_auth_token`when the Shopper has hit their daily spend limit for Perishables or Tier 4 transactions.

- There is only one Tier available for Perishables transactions with a daily maximum spend of $50.
- After one transaction has been made at Transferables or Non-Transferables Tier 4, the Shopper must wait to transact again until lifetime spend resets the following day.

Sample Response:

JSON

```
{
  "error": "Shopper's Daily Spend Limit for this type of transaction have been hit."
}
```

Updated 27 days ago

---

Did this page help you?

Yes

No

Copy Page