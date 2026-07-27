# Source: https://docs.zerohash.com/docs/off-ramp-integration-guide

## 

Introduction

zerohash's Off Ramp product allows any business to quickly launch an experience that allows their end customers to convert crypto to fiat

## 

Definitions

| Term | Definition |
| --- | --- |
| Platform | The company that's in contract with zerohash and directly interacts with zerohash's API's or SDK's. |
| End Customer | The end retail customer that has a direct relationship with the Platform and zerohash. |

## 

High Level Flow

1. Submit End Customer
2. Query End Customer
3. Fund Float Account
4. Get Assets
5. Get Quote
6. Execute Quote
7. Query Withdrawal
8. Network Fee Procedures
9. Email Receipt Requirements
10. End of Day Settlement

## 

Initial Setup

### 

General

The Platform will need to onboard its business to the zerohash platform. They then need to add additional users, create API keys, and whitelist IP addresses. See instructions [here](https://docs.zerohash.com/docs/get-platform-access).

### 

Webhooks

You'll want to listen to our [Account Balance webhook events](https://docs.zerohash.com/reference/account-balance) - this will notify you of a crypto deposit to a zerohash account, among other balance updating events.

To get configured, reach out to your zerohash rep who can quickly configure your webhook callback URK

## 

1\. Submit End Customer

Once API keys are created and approved, the Platform can begin to integrate to the API. For the following examples, we’ll assume the Platform's platform code is PLAT01.

The Platform submits the End Customer via [POST /participants/customers/new](https://docs.zerohash.com/reference/post_participants-customers-new):

JSON

```
{
    "first_name": "John",
    "last_name": "Smith",
    "email": "jsmith@gmail.com",
    "phone_number": "+12345834789",
    "date_of_birth": "1985-09-02",
    "ip_address": "999.168.252.199",
    "address_one": "1 Main St.",
    "address_two": "Suite 1000",
    "city": "Chicago",
    "zip": "12345",
    "jurisdiction_code": "US-IL",
    "partial": true,
    "sanction_screening": "pass",
    "sanction_screening_timestamp": 1603378501282,
    "signed_agreements": [{
        "type": "user_agreement",
        "region": "us",
        "signed_timestamp": 1603378501286
    }]
}
```

Note: The End Customer will be agreeing to the zerohash terms and conditions. The platform indicates to zerohash that they accepted the terms by sending a value in the `signed_agreement` object as shown above.

- `type`: the type of user agreement being signed. For On and Off Ramps, the End Customer is signing the standard user agreement, so a value of `user_agreement` is expected.
- `signed_timestamp`: is the timestamp that the End Customer accepted the terms and conditions.
- `region`: represents the zerohash entity that the End Customer is entering into a contract with. The only acceptable values right now are `US` and `EU`

[POST /participants/customers/new](https://docs.zerohash.com/reference/post_participants-customers-new) response:

JSON

```
 {
     "first_name": "John",
     "last_name": "Smith",
     "email": "jsmith@gmail.com",
     "address_one": "1 Main St.",
     "address_two": "Suite 1000",
     "country": "United States",
     "state": "IL",
     "jurisdiction_code": "US-IL",
     "city": "Chicago",
     "zip": "12345",
     "date_of_birth": "1985-09-02",
     "id_number_type": "unknown",
     "id_number": "",
     "non_us_other_type": "",
     "id_issuing_authority": "",
     "signed_timestamp": -62135596800000,
     "risk_rating": "",
     "metadata": {},
     "platform_code": "PLAT01",
     "participant_code": "CUST01",
     "tax_id": "",
     "citizenship": "",
     "citizenship_code": "",
     "kyc": "unknown",
     "kyc_timestamp": null,
     "onboarded_location": "US-IL",
     "sanction_screening": "pass",
     "sanction_screening_timestamp": null,
     "liveness_check": "unknown",
     "phone_number": "+12345834789",
     "employment_status": "unknown",
     "industry": "unknown",
     "source_of_funds": "unknown",
     "signed_agreements": [{
         "region": "us",
         "signed_timestamp": 1603378501,
         "type": "user_agreement"
     }]
 }
```

Note: The response contains a `participant_code` for the End Customer. This uniquely identifies the End Customer indefinitely and should be use in subsequent API calls where applicable. We’ll use **CUST01** as the `participant_code` throughout the examples.

## 

2\. Query End Customer

The Platform can query the End Customer via the [GET /participants/{email}](https://docs.zerohash.com/reference/get_participants-email) endpoint or the Platform can query all End Customers via the [GET /participants](https://docs.zerohash.com/reference/get_participants) endpoint

## 

3\. Create Deposit Address

Begin by creating a crypto deposit address for your customer via the [POST /deposits/digital\_asset\_addresses](https://docs.zerohash.com/reference/post_deposits-digital-asset-addresses) endpoint.

Example request:

JSON

```
 {
     "participant_code": "CUST01",
     "asset": "SOL"
 }
```

Example response (see `address` field for where crypto should be deposited to):

JSON

```
{
  "message": {
    "address": "7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV",
    "participant_code": "CUST01",
    "platform_code": "PLAT01",
    "asset": "SOL",
    "account_label": "general",
    "created_at": 1590663417000
  }
}
```

## 

4\. Initiate deposit

The Customer will initiate an on-chain deposit to the above `address`. Once zerohash has received it, we will:

- Update the Customer balance on our ledger
- Send an Account Balance webhook to the Platform. Example payload:

JSON

```
{
    "account_group": "PLAT01",
    "account_label": "general",
    "account_type": "available",
    "asset": "SOL",
    "balance": "1",
    "movements": [
        {
            "account_id": "363d0c5f-1163-47c9-8de2-97cfbecdd1e6",
            "change": "1.00",
            "deposit_reference_id": "5VfydnLu4XQL8QMcXUZW6ZFAsCRHFyj4WT5ftvHc7TCXqvL1F9YWnwvQdBUcSVR9pRZaZG5w9j4NrQXaJnpFVKZ8",
            "movement_id": "bcc65fa1-1a1d-4a77-9f0b-cad3968b50db",
            "movement_timestamp": 1590663417999,
            "movement_type": "deposit"
        }
    ],
    "participant_code": "CUST01",
    "run_id": "4149614",
    "run_type": "deposit",
    "timestamp": 1743593652
}
```

## 

5\. Get Quote

Now, you can **off ramp the deposited crypto into fiat** by using our `rfq endpoints`/rfq endpoints.

There are 2 ways to monetize this transaction:

- **Spreads:** zerohash can pre-configure a percentage amount inflates the sale price, allowing zerohash and the Platform to collectively monetize the transaction
- **Fees:** Additionally, you can choose to charge explicit, non-percentage-based fees. See `fees` object below.

The first step is to get a quote via the [POST /liquidity/rfq](https://docs.zerohash.com/reference/post_liquidity-rfq) endpoint:

JSON

```
{
  "participant_code": "CUST01",
  "side": "sell",
  "underlying": "SOL",
  "quoted_currency": "USD",
  "quantity": "1",
  "fees": [
    { "amount": "2.50", "name": "processing-1" }
  ]
}
```

Response:

JSON

```
{
  "message": {
    "request_id": "14f8ebb8-7530-4aa4-bef9-9d73d56313f3",
    "participant_code": "CUST01",
    "quoted_currency": "USD",
    "underlying": "SOL",
    "side": "sell",
    "quantity": "1",
    "price": "500.00",
    "quote_id": "32ad471b-824e-4f04-94ff-45c4439b4fe9",
    "expire_ts": 1751830000000,
    "account_group": "PLAT01",
    "account_label": "general",
    "obo_participant": {
      "participant_code": "CUST01",
      "account_group": "PLAT01",
      "account_label": "general"
    },
    "asset_cost_notional": "500.00",
    "spread_notional": "2.50",
    "spread_bps": "50",
    "commission_notional": null,
    "commission_bps": null,
    "total_notional": "495.00",
    "fees": [
      { "name": "processing-1", "amount": "2.50" }
    ]
  }
}
```

Note:

- `fee_inclusive` = true can be enacted to ensure that the End Customer spends a maximum of `total` and the fees will be deducted from there
- Typically for onramps the quote length is 30 seconds, although this is configurable

## 

6\. Execute Quote

The platform will then execute a [POST /liquidity/execute](https://docs.zerohash.com/reference/post_liquidity-execute) call using the `quote_id` from the response above:

JSON

```
{
  "quote_id": "32ad471b-824e-4f04-94ff-45c4439b4fe9"
}
```

Response:

JSON

```
{
  "message": {
    "request_id": "14f8ebb8-7530-4aa4-bef9-9d73d56313f3",
    "quote": {
      "request_id": "14f8ebb8-7530-4aa4-bef9-9d73d56313f3",
      "participant_code": "CUST01",
      "quoted_currency": "USD",
      "underlying": "SOL",
      "side": "sell",
      "quantity": "1",
      "price": "500.00",
      "quote_id": "32ad471b-824e-4f04-94ff-45c4439b4fe9",
      "expire_ts": 1751830000000,
      "account_group": "PLAT01",
      "account_label": "general",
      "obo_participant": {
        "participant_code": "CUST01",
        "account_group": "PLAT01",
        "account_label": "general"
      },
      "asset_cost_notional": "500.00",
      "spread_notional": "2.50",
      "spread_bps": "50",
      "commission_notional": null,
      "commission_bps": null,
      "total_notional": "495.00",
      "fees": [
        { "name": "processing-1", "amount": "2.50" }
      ]
    },
    "trade_id": "ba97133e-ab15-4c86-86c1-86671b8420bc",
    "trade_ids_list": [
      "ba97133e-ab15-4c86-86c1-86671b8420bc"
    ],
    "status": "Completed",
    "ach_details": null
  }
}
```

After the trade settles, the end result is a credit to the Platform's Float Account:

- `participant_code`: 00SCXM
- `account_group`: \[platform `participant_code`\]
- `account_label`: general
- `asset`: USD
- `account_type`: available

## 

7\. Query Deposit and Trade

Platforms can retroactively query deposits and trades via our REST endpoints. See examples below:

[GET /deposits](https://docs.zerohash.com/reference/get_deposits-crypto) or [GET /deposits/{deposit\\\_id}](https://api.cert.zerohash.com/deposits/crypto/%7Bdeposit_id%7D) example response:

JSON

```
{
  "message": [
    {
      "settle_timestamp": 1751830000000,
      "account_id": "80289ce5-072b-4739-929d-dcc5ccc542f3",
      "movement_id": "21bdbb11-712f-4cb7-a178-4f277c80cde0",
      "participant_code": "CUST01",
      "account_group": "CUST01_default",
      "account_label": "general",
      "asset": "SOL",
      "amount": "1.0000",
      "reference_id": "5VfydnLu4XQL8QMcXUZW6ZFAsCRHFyj4WT5ftvHc7TCXqvL1F9YWnwvQdBUcSVR9pRZaZG5w9j4NrQXaJnpFVKZ8",
      "source": null,
      "received_address": "7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV",
      "run_id": "12613",
      "state_reason": null,
      "travel_rule_status": "not_required"
    }
  ],
  "page": 1,
  "page_size": 15,
  "total_pages": 1,
  "count": 1
}
```

[GET /trades](https://docs.zerohash.com/reference/get_trades) or [GET /trades/{trade\\\_id}](https://docs.zerohash.com/reference/get_trades-trade-id) example response:

JSON

```
{
  "message": [
    {
      "batch_trade_id": null,
      "trade_id": "ba97133e-ab15-4c86-86c1-86671b8420bc",
      "client_trade_id": "32ad471b-824e-4f04-94ff-45c4439b4fe9",
      "trade_reporter": "api@PLAT01.com",
      "trade_reporter_code": "PLAT01",
      "reporting_party": null,
      "settlement_schedule": null,
      "platform_code": "PLAT01",
      "market_identifier_code": null,
      "symbol": "SOL/USD",
      "product_type": "spot",
      "trade_type": "regular",
      "trade_price": "500.00",
      "trade_quantity": "1",
      "trade_state": "terminated",
      "physical_delivery": true,
      "transaction_timestamp": 1751830050000,
      "accepted_timestamp": 1751830050500,
      "defaulted_timestamp": null,
      "settled_timestamp": 1751830051200,
      "comment": null,
      "last_update": 1751830051200,
      "parties_anonymous": false,
      "settlement_price_index_id": null,
      "contract_size": 1,
      "underlying": "SOL",
      "quoted_currency": "USD",
      "settlement_timestamp": null,
      "expiry_timestamp": null,
      "bank_fee": null,
      "spread_notional": "2.50",
      "spread_bps": "50",
      "issuer_fee_rate": null,
      "issuer_fee_amount": null,
      "issuer_fee_payor_type": null,
      "origin": "rest_api",
      "parties": [
        {
          "participant_code": "CUST01",
          "side": "sell",
          "asset": "SOL",
          "amount": "1",
          "liquidity_indicator": null,
          "client_order_id": null,
          "order_id": null,
          "obligations_outstanding_timestamp": null,
          "current_obligations_met_timestamp": 1751830051200,
          "settlement_state": "settled",
          "execution_id": null,
          "settling": true,
          "account_label": "general",
          "collateral_percentage": null,
          "account_profile": null,
          "trader": null,
          "zrn": null,
          "manual_order_indicator": null
        },
        {
          "participant_code": "00SCXM",
          "side": "buy",
          "asset": "USD",
          "amount": "500.00",
          "liquidity_indicator": null,
          "client_order_id": null,
          "order_id": null,
          "obligations_outstanding_timestamp": null,
          "current_obligations_met_timestamp": 1751830051200,
          "settlement_state": "settled",
          "execution_id": null,
          "settling": true,
          "account_label": "inventory",
          "collateral_percentage": null,
          "account_profile": null,
          "trader": null,
          "zrn": null,
          "manual_order_indicator": null
        }
      ],
      "session_id": "",
      "payment_processor": null,
      "fees": [
        { "name": "processing-1", "amount": "2.50" }
      ],
      "network_fee_notional": null,
      "network_fee_quantity": null,
      "total_notional": "495.00",
      "asset_cost_notional": "500.00"
    }
  ],
  "page": 1,
  "page_size": 15,
  "total_pages": 1,
  "count": 1
}
```

## 

8\. Network Fee Procedures

The lone network fee consideration with this flow has to do with the creation of the deposit address. Typically, the Platform will incur this fee

## 

9\. Email Receipt Requirements

zerohash requires that the End Customer receives an email receipt for each transaction. We also insist that the email contain

1. Certain fields and values, which can be obtained using our API
2. Adequate support contact information

### 

Fields

Here are the required field names and their associated API fields:

| Email Receipt Field Name | Description | Example | API Location |
| --- | --- | --- | --- |
| Order Number | Unique order identifier | 9a738372-0855-4b25-8c65-5de0aa858b8b | `trade_id` from [GET /trades](https://docs.zerohash.com/reference/get_trades) |
| Order Type | The type of order | Onramp Transaction | N/a, can hard-code to "Off Ramp Transaction Transmission" |
| Transmission Amount | The transmission amount for the transaction, in quoted currency terms | $10 | `total` from [POST /liquidity/rfq](https://docs.zerohash.com/reference/post_liquidity-rfq) or [POST /convert\_withdraw/execute](https://docs.zerohash.com/reference/post_convert-withdraw-execute) response |
| Amount Received by End Customer | The amount of the underlying crypto received by the End Customer | 10 USDC | `quantity` from [POST /liquidity/rfq](https://docs.zerohash.com/reference/post_liquidity-rfq) or [POST /liquidity/execute](https://docs.zerohash.com/reference/post_liquidity-execute) response |
| Fees | Any added fee values included in the transaction. If there are no fees, then this needs to be expressly stated.<br>This includes processing fees (ie, a fee assessed by the Platform to the End Customer) **or** blockchain network fees. | "$0", "1.99", "$0 Fees", or "No Fees" | `fees` from [POST /liquidity/rfq](https://docs.zerohash.com/reference/post_liquidity-rfq) and [POST /liquidity/execute](https://docs.zerohash.com/reference/post_liquidity-execute) endpoints |
| Date/Time | Date and timestamp of the transaction transmission (meaning the time that the fiat was converted and settled into crypto within the zerohash system) | 2024-10-11 18:38:00 | `settled_timestamp` from [GET /trades](https://docs.zerohash.com/reference/get_trades) |
| Account ID | Zero Hash’s unique account identifier for the End Customer ( the “participant code” within zerohash). | CUST01 | `participant_code` from \[[POST /liquidity/rfq](https://docs.zerohash.com/reference/post_liquidity-rfq)\]([https://docs.zerohash.com/reference/post\_convert-withdraw-rfq](https://docs.zerohash.com/reference/post_convert-withdraw-rfq)) and [POST /liquidity/execute endpoint](https://docs.zerohash.com/reference/post_liquidity-execute) |

Updated 21 days ago

---

Did this page help you?

Yes

No

Copy Page