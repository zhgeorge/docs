# Source: https://docs.zerohash.com/docs/on-demand-api-workflow

After you [Link a bank account](https://docs.zerohash.com/docs/link-a-bank-account), you can request crypto buys and sells. Crypto buys debit the end customer bank account, while crypto sells credit the end customer bank account. The platform float is leveraged to exchange crypto while the fiat leg of the transaction settles.

ℹ️ Platforms must be on the Novated liquidity model to use crypto buys and sells via ACH.

## 

Request an on-demand payment

[POST /payments/rfq](https://docs.zerohash.com/reference/post_payments-rfq)

Follow the same requirements as [GET /liquidity/rfq](https://docs.zerohash.com/reference/get_liquidity-rfq). Sells are ACH or RTP credits and Buys are ACH debits.

The quote duration will default to your platform setting, as configured with Client Services. We recommend a one minute quote with this endpoint to accommodate required balance and authorization checks for the ACH payment. However, you may pass in the optional field quote\_expiry with RFQ to override your default.

### 

Request parameters

| Parameter | Description | Required/Optional |
| --- | --- | --- |
| side | The side of the quote `buy` or `sell`. | Required |
| underlying\_currency | The underlying asset for the quote. | Required |
| quoted\_currency | The quoted asset for the quote. | Required |
| quantity | The amount of the `underlying` currency. Either `quantity` or `total` must be provided. | Optional |
| total | **Only for Buy:** The desired amount of the `quoted_currency` for the quote. Either `quantity` or `total` must be provided. | Optional |
| participant\_code | The participant that is requesting to buy/sell. Can be the platform's code or the customer's. | Optional |
| account\_label | The account label associated with the account. | Optional |

> 📘
> 
> ### 
> 
> Use only `quantity` for Sell
> 
> When performing a quote to sell crypto, use `quantity`field and the total amount **not rounded** with all the decimals. This will avoid `not enough credit` errors when executing the RFQ.

### 

Response parameters

| Parameter | Description | Type |
| --- | --- | --- |
| request\_id | The identifier of the RFQ | string |
| participant\_code | The identifier of the participant making the quote request | string |
| quoted\_currency | The asset code for the quoted currency, e.g.`USD` | string |
| side | The participant side of the quote -`buy` or `sell` | string |
| quantity | The amount of the quoted currency | string |
| price | The cost per unit of underlying currency | string |
| quote\_id | The identifier for the quote<br>Note: this is required to execute the quote | string |
| expire\_ts | Timestamp when the quote will expire | timestamp |
| account\_group | The group that the account is a part of | string |
| account\_label | The account label associated with the account | string |
| obo\_participant | on behalf of participant is the details of the participant benefiting the trade if not the submitter | object |
| network\_fee\_notional | fee notional in the currency quoted on the RFQ | string |
| network\_fee\_quantity | fee quantity in the underlying asset | string |
| total\_notional | The calculation:<br>( price \* quantity ) + ( network\_fee\_notional + network\_fee\_quantity ) | string |
| underlying | The asset code for the underlying currency, e.g.`BTC` | string |

## 

Execute quote

[POST /payments/execute](https://docs.zerohash.com/reference/post_payments-execute)

### 

Prerequisite

- An external account must already be created via [POST /payments/external\_accounts](https://docs.zerohash.com/reference/post_payments-external-accounts).
- A quote must be retained from [POST /payments/rfq](https://docs.zerohash.com/reference/post_payments-rfq).

| Parameter | Description | Type |
| --- | --- | --- |
| participant\_code | The code of the participant who wants to create a new ACH transaction, required. | string |
| external\_account\_id | The unique identifier that zerohash generates to identify the external account. Received from [POST /payments/external\_accounts](https://docs.zerohash.com/reference/post_payments-external-accounts), required. | string |
| quote\_id | The unique identifier assigned to the quote that was executed with [POST /payments/rfq](https://docs.zerohash.com/reference/post_payments-rfq), required. | string |
| description | Descriptor that travels with the ACH transaction and is intended to show on the participant bank statement.<br>e.g., “COMPANY1”, please use something that helps the customer identify the transaction.<br>Customer statements will show: \[Zero Hash\] \[ZH contact number\] \[Description\].<br>Note: It is ultimately up to the receiving bank to determine what is shown on the bank statement. Some may ultimately not show the description 10 character limit. | string |
| ach\_signed\_agreement | The time at which the participant agreed to the ACH disclosures. | timestamp |

### 

Sample response

JSON

```
{
  "message": {
    "request_id": "14f8ebb8-7530-4aa4-bef9-9d73d56313f3",
    "quote": {
      "request_id": "ce819fe8-b1d7-43bb-961c-e09ede0988d3",
      "participant_code": "CUST01",
      "quoted_currency": "USD",
      "side": "BUY",
      "quantity": "1",
      "price": "11430.90",
      "quote_id": "5cd07738b861c31e3bd61467BTC1Buy1568311644602",
      "expire_ts": 1568311649602,
      "account_group": "GRP001",
      "account_label": "sub_account_test",
      "obo_participant": {
        "participant_code": "20XRLH",
        "account_group": "WRD1K0",
        "account_label": "general"
      },
      "network_fee_notional": "1",
      "network_fee_quantity": "1",
      "total_notional": "2.00",
      "underlying": "BTC",
      "asset_cost_notional": "2.00"
    },
    "trade_id": "ba97133e-ab15-4c86-86c1-86671b8420bc",
    "status": "Completed",
    "ach_details": {
      "inbound_reference_id": "string"
    },
    "payment_amount": "string",
    "external_account_id": "0f68333e-2114-469d-b505-c850d776e063",
    "quote_id": "ba97133e-ab15-4c86-86c1-86671b8420bc",
    "description": "PLATFORM",
    "ach_signed_timestamp": 1561996924964
  }
}
```

## 

Check payment status

[GET /payments/status](https://docs.zerohash.com/reference/get_payments-status)

Shares the current status of a debit or credit payment. Platforms should use this endpoint to understand funds availability and make their own decisions on how/when to make crypto available to end customers.

Understanding payment statuses follows the existing [GET /payments/status](https://docs.zerohash.com/reference/get_payments-status) flow. Sample response:

JSON

```
{
  "message": [
    {
      "transaction_id": "0f68333e-2114-469d-b505-c850d776e061",
      "participant_code": "ALI123",
      "amount": "12.01",
      "status": "posted",
      "transfer_type": "credit",
      "bank_transfer_id": "0f68333e-2114-469d-b505-c850d776e061",
      "trade_id": "0f68333e-2114-469d-b505-c850d776e061",
      "trade_status": "terminated",
      "velocity_status": "pending",
      "velocity_failed_rule": "participant_transactions(in_flight_transfers_by_participant)",
      "created_at": "1975-08-19T23:15:30.000Z",
      "updated_at": "1975-08-19T23:15:30.000Z"
    }
  ],
  "page": 1,
  "total_pages": 1,
  "page_size": 200,
  "count": 10
}
```

#### 

Payment Statuses

| Status | Description | Final? |
| --- | --- | --- |
| `submitted` | Transaction request has been received | \- |
| `pending_trade` | Transaction request has been approved, but the associated trade has not terminated. | \- |
| `pending` | The associated trade has terminated and the fiat payment has been initiated | \- |
| `posted` | Transaction has settled and cleared any applicable hold days. Transaction will be reconciled with internal ledger. | \- |
| `settled` | Transaction is complete and funds have been credited to platform float | ✔️ |
| `canceled` | ACH On-demand transactions can not be canceled | ✔️ |
| `failed` | Transaction request failed, no payment was initiated | ✔️ |
| `rejected` | Transaction request was rejected due to velocity checks, no payment was initiated | ✔️ |
| `returned` | Transaction request was initially approved but the ACH has returned unsuccessfully, before the transaction reached a 'Settled' state | ✔️ |
| `returned_settled` | Transaction request was initially approved but the ACH has returned unsuccessfully, after the transaction reached a 'Settled' state | ✔️ |

> 📘
> 
> ### 
> 
> Final states
> 
> States marked are all possible end-states for a transaction, though a transaction can move from `settled` → `returned`

### 

Webhook notifications

Webhooks let you know the status of a payment and if funds are available to the end customer or platform. The payload is a JSON object containing the following fields:

| Parameter | Description | Type |
| --- | --- | --- |
| participant\_code | The zerohash identifier for the customer requesting a Fiat transaction. | string |
| type | Indicates if the payment is a credit or a debit for the end customer | string |
| transaction\_id | The unique identifier generated by zerohash for the transaction. | string |
| payment\_status | The current status of the payment. See payment statuses for more. | string |
| reason\_code | The NACHA failure reason code, if the payment\_status is returned. | string |
| reason\_description | The description matching the reason\_code, if the payment\_status is returned. | string |
| expected\_settlement\_date | For payment type of credit, when the funds are expected to settle to the end customer bank account. This is an approximation as receiving banks are ultimately responsible for posting the update. | string; YYYY-MM-DD format |

For more information on the payments webhooks, check out our documentation [here](https://docs.zerohash.com/reference/payments-1).

## 

ACH returns

ACH returns are available in [GET /payments/status](https://docs.zerohash.com/reference/get_payments-status) under the status `returned`. While webhooks share the reason for returns, currently the GET call does not include this information.

### 

Unauthorized returns

An [unauthorized return](https://plaid.com/resources/ach/ach-return/#ACH-return-codes-list) means that the bank account owner has flagged an issue with the transaction. When these returns are received, zerohash immediately locks the end customer account in an effort to mitigate further risk. The zerohash compliance team must evaluate risk before moving the participant back to `approved`, or along to `disabled` (more on [participant statuses](https://docs.zerohash.com/docs/participant-statuses)).

Participant status webhooks alert platforms to movements from approved to locked. In the case of unauthorized returns, those results share a `reason` of `ach`.

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page