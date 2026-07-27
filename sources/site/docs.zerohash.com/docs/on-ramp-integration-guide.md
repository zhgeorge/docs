# Source: https://docs.zerohash.com/docs/on-ramp-integration-guide

## 

Introduction

zerohash's On ramp product allows any business to quickly launch an experience that allows their end customers to convert fiat to crypto

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

The Platform will need to onboard its business to the zerohash platform. They then need to add additional users, create API keys, and whitelist IP addresses. See instructions [here](https://docs.zerohash.com/docs/get-platform-access).

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
    }],
}
```

Note: The End Customer will be agreeing to the zerohash terms and conditions. The platform indicates to zerohash that they accepted the terms by sending a value in the `signed_agreement` object as shown above.

- `type`: the type of user agreement being signed. For On and Off Ramps, the End Customer is signing the standard user agreement, so a value of `user_agreement` is expected.
- `signed_timestamp`: is the timestamp that the End Customer accepted the terms and conditions.
- `region`: represents the zerohash entity that the End Customer is entering into a contract with. The only acceptable value right now is `US`.

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

3\. Fund Fiat Accounts

There are 3 types of fiat accounts needed for this flow:

- **Float Account:** The account that will fund real-time onramp transactions. Onramp transactions **will fail** if the balance in this account is insufficient.
- **Settlement Reserve Account:** The account that will be used to top-up the settlement account, once a day
- **Settlement Account:** The account that will be credited 1x a day in order to complete daily settlement. The deposit into this account will be initiated by the Payment Service Provider

For the following examples, we’ll assume Platform's platform code is PLAT01.

The Platform will fund each of the above accounts by sending fiat to the proper bank account, tagging each wire with a memo equal to the Platform's `participant_code`. Including the wire memo means that we can auto-credit the correct account when we receive the wire/ACH.

Here are the [account](https://docs.zerohash.com/docs/what-is-an-account) details:

| | Float Account | Settlement Reserve Account | Settlement Account |
| --- | --- | --- | --- |
| Participant code | 00SCXM | \[Platform's participant code\] | \[Platform's participant code\] |
| Account group | \[Platform's participant code\] | \[Platform's participant code\] | \[Platform's participant code\] |
| Account label | general | settlement\_reserve | general |
| Account type | Available | Available | Available |
| Asset | USD | USD | USD |
| Wire Memo | PLAT01 - FLOAT | PLAT01 - RESERVE | PLAT01 - SETTLEMENT |

For the example, let's say the Float Account is funded with $50,000 and the Settlement Reserve Account is funded with $25,000:

| | Asset | Current Balance | Change |
| --- | --- | --- | --- |
| Float Account | USD | $50,000 | (+$50,000) |
| Settlement Reserve Account | USD | $25,000 | (+$25,000) |

Note: For the Wire Memo, some payment providers don't support a fixed memo for the wire or ACH. In these cases please reach out to your ZH contact so we can investigate alternatives.

> ℹ️
> 
> ### 
> 
> In Cert, your platform will be pre-funded with Float account funds.

## 

4\. Get Assets

In order to know which assets are support, the Platform can query the [GET /assets](https://docs.zerohash.com/reference/get_assets). If "rfq\_liquidity\_enabled": true, then it is supported

## 

5\. Get Quote

The Platform will now get the initial quote via the [POST /convert\_withdraw/rfq](https://docs.zerohash.com/reference/post_convert-withdraw-rfq) endpoint:

JSON

```
{
	"participant_code" : "CUST01",
	"side" : "buy",
	"underlying" : "BTC",
	"quoted_currency" : "USD",
	"total" : 20,
	"withdrawal_address" : "2N8PYGKSQRpHa5VDNZ4iLwxi5crpRWb3TR1"
}
```

Response:

JSON

```
{
   "message": {
       "request_id": "64f34a8d-f5f5-4e37-b01d-7c6814aed4bc",
       "participant_code": "CUST01",
       "quoted_currency": "USD",
       "side": "buy",
       "quantity": "0.00087097",
       "price": "22962.90",
       "quote_id": "5aaaa8af-5d0c-4d55-868b-b56ea19a5443",
       "expire_ts": 1661449335103,
       "account_group": "00SCXM",
       "withdrawal_address" : "2N8PYGKSQRpHa5VDNZ4iLwxi5crpRWb3TR1"
       "account_label": "general",
       "obo_participant": {
           "participant_code": "CUST01",
           "account_group": "PLAT01",
           "account_label": "general"
       },
       "network_fee_notional": "1.50",
       "network_fee_quantity": "0.00001",
       "total_notional": "21.5",
       "underlying": "BTC",
       "asset_cost_notional": "20"
   }
}
```

Note:

- `fee_inclusive` = true can be enacted to ensure that the End Customer spends a maximum of `total` and the fees will be deducted from there
- Typically for onramps the quote length is 30 seconds, although this is configurable

## 

6\. Execute Quote

The platform will then execute a [POST /convert\_withdraw/execute](https://docs.zerohash.com/reference/post_convert-withdraw-execute) call using the `quote_id` from the response above. Here is the is the response of this endpoint:

JSON

```
{
  "message": {
    "request_id": "945c41ba-c06e-4e69-aaf6-ea27cb7c75b2",
    "quote": {
      "request_id": "7a8a8526-3614-4373-9ab4-0069dc643109",
      "participant_code": "CUST01",
      "quoted_currency": "USD",
      "side": "buy",
      "quantity": "0.00087097",
      "price": "22962.90",
      "quote_id": "dc179192-5bdf-41f2-9ffa-badb1396a0a7",
      "expire_ts": 1568311649602,
      "account_group": "GRP001",
      "account_label": "general",
      "obo_participant": {
        "participant_code": "20XRLH",
        "account_group": "WRD1K0",
        "account_label": "general"
      },
      "network_fee_notional": "1.50",
      "network_fee_quantity": "0.00001",
      "total_notional": "21.5",
      "underlying": "BTC",
      "asset_cost_notional": "20",
      "withdrawal_address": "2N8PYGKSQRpHa5VDNZ4iLwxi5crpRWb3TR1",
      "payment_processor": {
        "name": "payment processor name",
        "id": "payment processor id"
      },
      "spread_notional": ".22",
      "spread_bps": "100",
      "withdrawal_request_id": "Dea97133e-ab15-4c86-86c1-86671b8420nr"
    },
    "trade_id": "ba97133e-ab15-4c86-86c1-86671b8420bc",
    "status": "Completed"
  }
}
```

Note: After this, fiat is being taken from the float account, a trade is being created and settled, and an automatic and immediate on-chain transfer is being sent to the `withdrawal_address`

## 

7\. Query Withdrawal

When monitoring a withdrawal, the Platform can query the [GET /withdrawals/requests/Dea97133e-ab15-4c86-86c1-86671b8420nr](https://docs.zerohash.com/reference/get_withdrawals-requests-id) endpoint.

#### 

Response:

C

```
{
    "id":"Dea97133e-ab15-4c86-86c1-86671b8420nr",
    "withdrawal_account_id": 152089,
    "participant_code": "CUST01",
    "account_group": "PLAT01",
    "account_label": null,
    "requestor_participant_code": "PLAT01",
    "asset": "BTC",
    "requested_amount": "20",
    "settled_amount": "20",
    "gas_price": null,
    "status": "SETTLED",
    "on_chain_status": "PENDING",
    "client_withdrawal_request_id": "zh_withdrawal_17845eeffd5f71abaa85e9722e76c931a",
    "requested_timestamp": 1659542191772,
    "transaction_id": "3899526c5f986297d3b2ba29f2c4c8b0fb486bef2fc76f7c11aae2b1faf3fe76",
    "input_data": null,
    "fee_amount": 0.00001,
    "quoted_fee_amount": 0.00001 
} 
```

| Parmeter | Description |
| --- | --- |
| status | The zerohash internal settlement status.
- `PENDING`: The request has been created and is pending approval from users.
- `APPROVED`: The request is approved but not settled.
- `REJECTED`: The request is rejected and in a terminal state.
- `SETTLED`: The funds have been deducted from the participan

 |
| on\_chain\_status | The blockchain status.

- `PENDING`: The withdrawal has been broadcasted on-chain but is not yet confirmed.
- `CONFIRMED`: The withdrawal has been sufficiently confirmed on-chain.

 |
| transaction\_id | The on-chain transaction hash, useful to display out to customers so that they can follow the transaction if they wish. |

## 

8\. Network Fee Procedures

The Platform will be paying for the network fee associated with any Onramp transactions. There are 2 options:

1. Fund the network fee [account](https://docs.zerohash.com/docs/what-is-an-account). Account details:

- Participant\_code: PLAT01 (the Platform's participant\_code)
- Account\_group: PLAT01
- Account\_label: network\_fee
- Asset: USD

All network fees will paid out of this account in real-time

2. Don’t fund the network fee account. This account will build up a payable balance

zerohash will add the amount of the receivable balance on this account to the end of month invoice, coupling it with the Onramp usage activity amount due.

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
| Order Type | The type of order | Onramp Transaction | N/a, can hard-code to "Onramp Transaction Transmission" |
| Transmission Amount | The transmission amount for the transaction, in quoted currency terms | $10 | `total` [POST /convert\_withdraw/rfq](https://docs.zerohash.com/reference/post_convert-withdraw-rfq) or [POST /convert\_withdraw/execute](https://docs.zerohash.com/reference/post_convert-withdraw-execute) response |
| Amount Received by End Customer | The amount of the underlying crypto received by the End Customer | 10 USDC | `quantity` [POST /convert\_withdraw/rfq](https://docs.zerohash.com/reference/post_convert-withdraw-rfq) or [POST /convert\_withdraw/execute](https://docs.zerohash.com/reference/post_convert-withdraw-execute) response |
| Fees | Any added fee values included in the transaction. If there are no fees, then this needs to be expressly stated.<br>This includes processing fees (ie, a fee assessed by the Platform to the End Customer) **or** blockchain network fees. | "$0", "1.99", "$0 Fees", or "No Fees" | 
- any `fees` from [POST /convert\_withdraw/rfq](https://docs.zerohash.com/reference/post_convert-withdraw-rfq) or [POST /convert\_withdraw/execute](https://docs.zerohash.com/reference/post_convert-withdraw-execute) response

- If the End Customer is incurring the network fee, take `network_fee_notional` from [POST /convert\_withdraw/rfq](https://docs.zerohash.com/reference/post_convert-withdraw-rfq) or [POST /convert\_withdraw/execute](https://docs.zerohash.com/reference/post_convert-withdraw-execute) response

 |
| Date/Time | Date and timestamp of the transaction transmission (meaning the time that the fiat was converted and settled into crypto within the zerohash system) | 2024-10-11 18:38:00 | `settled_timestamp` from [GET /trades](https://docs.zerohash.com/reference/get_trades) |
| Account ID | Zero Hash’s unique account identifier for the End Customer ( the “participant code” within zerohash). | CUST01 | `participant_code` from [POST /convert\_withdraw/rfq](https://docs.zerohash.com/reference/post_convert-withdraw-rfq) or [POST /convert\_withdraw/execute](https://docs.zerohash.com/reference/post_convert-withdraw-execute) |

## 

15\. End of Day Settlement:

Platform's will typically use a Payment Service Provider (PSP) to process the USD leg of the transaction. PSP's will be required to settle with zerohash on a daily basis (excluding weekends and holidays). PSP's will typically withhold both 1) chargebacks and 2) PSP fees. As a result, zerohash will receive a settlement amount that is less than the Net Delivery Obligation (NDO) - in this example the NDO is **$500**. To compensate for this, zerohash will sweep funds from the Settlement Reserve Account to the Settlement Account, completing end of day settlement.

Here are the account changes after the PSP's wire lands at zerohash:

| | Asset | Current Balance | Change |
| --- | --- | --- | --- |
| Float Account | USD | $49,500 | |
| Settlement Reserve Account | USD | $25,000 | |
| End Customer Account | USDC | 0 | |
| Platform USDC Account | USDC | 0 | |
| Settlement Account | USD | $497.5 | +$497.5 |

In order to get the Settlement Account to the correct amount (500), zerohash will initiate a transfer from the Settlement Reserve Account to the Settlement Account:

| | Asset | Current Balance | Change |
| --- | --- | --- | --- |
| Float Account | USD | $49,500 | |
| Settlement Reserve Account | USD | $24,997.5 | (-$2.5) |
| End Customer Account | USDC | 0 | |
| Platform USDC Account | USDC | 0 | |
| Settlement Account | USD | $500 | +$2.5 |

Once the NDO has been met, zerohash will automatically settle the $500 to the Float Account:

| | Asset | Current Balance | Change |
| --- | --- | --- | --- |
| Float Account | USD | $50,000 | +$500 |
| Settlement Reserve Account | USD | $24,997.5 | |
| End Customer Account | USDC | 0 | |
| Platform USDC Account | USDC | 0 | |
| Settlement Account | USD | $0 | \-$500 |

Updated 21 days ago

---

Did this page help you?

Yes

No

Copy Page