# Source: https://docs.zerohash.com/docs/remittance-integration-guide

## 

Definitions

| Term | Definition | Example |
| --- | --- | --- |
| Platform | The company that's in contract with zerohash and directly interacts with zerohash's API's or SDK's. | Remittance Co. LLC |
| Sender | The initiator of the Remittance (a fully-onboarded natural person subject to Sender Tiers). | John Smith |
| Sender Currency | The currency that the Sender is using to fund the Remittance. | USD |
| Remittance Token | The stablecoin or crypto asset being used to move value cross-border. | USDC |
| Remittance Conversion | The conversion of the Sender Currency to stablecoin or crypto. | A buy of USDC for USD (symbol: USDC/USD) |
| Beneficiary | The receiver of the Remittance (not onboarded, but diligence is required). | Hector Garcia |
| Beneficiary Currency | The currency that the Beneficiary is using to fund the Remittance. | MXN |

## 

High Level Flow

1. Fund Fiat Accounts
2. Submit Sender
3. Query Sender Limits
4. Submit Beneficiary
5. Query Beneficiary
6. Update Beneficiary
7. Initiate Conversion
8. Query Conversion
9. Initiate Transfer
10. Query Transfer
11. Initiate Withdrawal
12. Query Withdrawal
13. Transitioning from Tier 1 to Tier 2
14. Transitioning from Tier 2 to Tier 3
15. End of Day Settlement

## 

Initial Setup

### 

Onboarding

The Platform will need to onboard its business to the zerohash platform. They then need to add additional users, create API keys, and whitelist IP addresses. See instructions [here](https://docs.zerohash.com/docs/getting-started).

### 

PSP integration

Platforms will typically accompany their zerohash integration with a PSP integration. This is to allow your customers to purchase crypto using a card or a popular digital wallet (ie, Apple pay) - the company responsible for this part of the flow is the PSP.

The PSP is responsible for the processing of the fiat leg of the transaction, zerohash is responsible for the crypto or stablecoin side (unless of course you are using any of zerohash's fiat product offerings directly).

If using a PSP, there are certain requirements that must be met which are mentioned [here](https://docs.zerohash.com/docs/psp-integrations).

## 

1\. Fund Fiat Accounts

There are 3 types of fiat accounts needed for this flow:

- **Float Account:** The account that will fund real-time remittance transactions. Remittance transactions **will fail** if the balance in this account is insufficient.
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

## 

2\. Submit Sender

Once API keys are created and approved, the Platform can begin to integrate to the API. For the following examples, we’ll assume the Platform's platform code is PLAT01.

### 

Sender Tiers

We've established a tiering system for all Senders. Depending on their volume over a certain time period, Senders will have different onboarding requirements, which the Platform will be responsible for collecting and relaying to zerohash:

![](https://files.readme.io/80fa1e3c97cefc632616f5a95755a3bf026bf74a9e185c5718ff0dc6cd944ec2-Table_2.3_1.png)

Interpretation:

- **24 hours:** A Sender can remit up to $999 over a 24 hour period. If the Sender wants remit $1,000 or higher over a 24 hour period, zerohash must collect Tier 2 data first. If the Sender wants remit $3,000 or higher over a 24 hour period, zerohash must collect Tier 3 data first. A Sender cannot remit more than $10,000 over a 24 hour period.
- **30 days:** A Sender can remit up to $3,000 over a 30 day period. If the Sender wants remit $3,001 or higher over a 30 day period, zerohash must collect Tier 2 data first. If the Sender wants remit $10,000 or higher over a 30 day period, zerohash must collect Tier 3 data first. A Sender cannot remit more than $20,000 over a 30 day period.
- **180 days:** A Sender can remit up to $30,000 over a 180 day period. If the Sender wants remit $30,001 or higher over a 180 day period, zerohash must collect Tier 3 data first. A Sender cannot remit more than $60,000 over a 180 day period.
- **Lifetime:** If a Sender wants to remit $9,001 or higher over their lifetime, zerohash must collect Tier 2 data first.

### 

Sender - Submit via API

The Platform submits the Sender via [POST /participants/customers/new](https://docs.zerohash.com/reference/post_participants-customers-new).

[POST /participants/customers/new](https://docs.zerohash.com/reference/post_participants-customers-new) Tier 1 example request:

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

[POST /participants/customers/new](https://docs.zerohash.com/reference/post_participants-customers-new) Tier 2 example request:

JSON

```
{
    "first_name": "John",
    "last_name": "Smith",
    "email": "jsmith@gmail.com",
    "phone_number": "+12345838374",
    "date_of_birth": "1985-09-02",
    "ip_address": "66.249.73.192",
    "address_one": "1 Main St.",
    "address_two": "Suite 1000",
    "id_number": "123456789",
    "id_number_type": "ssn",
    "liveness_check": "pass",
    "city": "Chicago",
    "zip": "12345",
    "jurisdiction_code": "US-IL",
    "partial": true,
    "sanction_screening": "pass",
    "sanction_screening_timestamp": 1603378501282,
    "signed_agreements": [
        {
            "type": "user_agreement",
            "region": "us",
            "signed_timestamp": 1730906918901
        }
    ]
}
```

[POST /participants/customers/new](https://docs.zerohash.com/reference/post_participants-customers-new) Tier 3 example request:

JSON

```
{
    "first_name": "John",
    "last_name": "Smith",
    "email": "jsmith@gmail.com",
    "phone_number": "+12345832133",
    "date_of_birth": "1985-09-02",
    "ip_address": "66.249.73.192",
    "address_one": "1 Main St.",
    "address_two": "Suite 1000",
    "id_number": "123456789",
    "id_number_type": "ssn",
    "liveness_check": "pass",
    "city": "Chicago",
    "zip": "12345",
    "jurisdiction_code": "US-IL",
    "source_of_funds": "salary",
    "employment_status": "full_time",
    "industry": "food_beverages",
    "partial": true,
    "sanction_screening": "pass",
    "sanction_screening_timestamp": 1603378501282,
    "signed_agreements": [
        {
            "type": "user_agreement",
            "region": "us",
            "signed_timestamp": 1730907129144
        }
    ]
}
```

Note: The Sender will be agreeing to the zerohash terms and conditions. The platform indicates to zerohash that they accepted the terms by sending a value in the `signed_agreement` object as shown above.

- `type`: the type of user agreement being signed. For Remittances, the Sender is signing the standard user agreement, so a value of `user_agreement` is expected.
- `signed_timestamp`: is the timestamp that the Sender accepted the terms and conditions.
- `region`: represents the zerohash entity that the Sender is entering into a contract with. The only acceptable value right now is `US`.

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
     "participant_code": "SENDR1",
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

Note: The response contains a `participant_code` for the Sender. This uniquely identifies the Sender indefinitely and should be use in subsequent API calls where applicable. We’ll use **SENDR1** as the `participant_code` throughout the examples.

## 

3\. Query Sender Limits

A Platform can query the API to understand the Sender's remaining limits via the `GET /participant/[participant_code]/limits` endpoint.

`GET /participant/SENDR1/limits` response:

JSON

```
{
    "participant_code": "SENDR1",
    "limits": [{
            "type": [
                "trades"
            ],
            "period": 24,
            "balance":"0"
            "limit": "999",
            "asset": "USD"
        },
        {
            "type": [
                "trades"
            ],
            "period": 720,
            "balance":"0"
            "limit": "3000",
            "asset": "USD"
        },
        {
            "type": [
                "trades"
            ],
            "period": 0,
            "balance":"0"
            "limit": "9000",
            "asset": "USD"
        },
        {
            "type": [
                "trades"
            ],
            "period": 4320,
            "balance":"0"
            "limit": "0",
            "asset": "USD"
        }
    ]
}
```

Interpretation:

- The Sender (SENDR1) can remit a maximum of 999 in notional remittance volume over the next 24 hours. If the Sender wants to remit any more, zerohash is required to collect Tier 2 data.
- The Sender can remit a maximum of 3,000 in notional remittance volume over the next 720 hours (30 days). If the Sender wants to remit any more, zerohash is required to collect Tier 2 data.
- The Sender can remit a maximum of 9,000 in notional remittance volume over its lifetime. If the Sender wants to remit any more, zerohash is required to collect Tier 2 data.
- The Sender does not have a limit for the period of 4320 hours (180 days) as this does not apply to Tier 1.

Note:

- The `limit` represents the notional remittance volume that is permitted over the next `period`. When a remittance transaction becomes older than `period`, that transaction value is refunded back into the `limit` balance.
- When the `limit` becomes 0 or a transaction would take the `limit` into a negative value, zerohash will reject subsequent API calls to initiate any remittances ([POST /liquidity/rfq](https://docs.zerohash.com/reference/post_liquidity-rfq) and [POST /liquidity/execute](https://docs.zerohash.com/reference/post_liquidity-execute)).
- A `period` of 0 means a lifetime `limit`.
- The `period` unit is **hours**

## 

4\. Submit Beneficiary

The Platform will need to submit a Beneficiary via [POST /participants/beneficiaries/new](https://docs.zerohash.com/reference/post_participants-beneficiaries-new):

JSON

```
{
    "first_name": "Hector",
    "last_name": "Garcias",
    "address_one": "1 Main St.", // optional
    "address_two": "Suite 1000", // optional
    "jurisdiction_code": "MX-CMX",
    "date_of_birth": "1985-09-02", // optional
}
```

Note:

- The Beneficiary is not agreeing to any zerohash terms and conditions, so the `signed_timestamp` array is not required.
- `date_of_birth`, `address_1`, and `address_2` are optional fields, however, they are _required in high risk jurisdictions._
- `jurisdiction_code`follows the ISO 3166-2 standard.

> 📘
> 
> ### 
> 
> We highly recommend submitting the date\_of\_birth. This reduce the percentage of beneficiaries getting stuck in a pending\_approval state. The date\_of\_birth is an important field to reduce the risk of sending assets to a sanctioned person

[POST /participants/beneficiaries/new](https://docs.zerohash.com/reference/post_participants-beneficiaries-new) response:

JSON

```
{
    "participant_code": "BENEF1",
    "created_at": 1603378501789,
    "first_name": "Hector",
    "last_name": "Garcias",
    "jurisdiction_code": "MX-CMX",
    "date_of_birth": "1985-09-02"
}
```

Note: The response contains a `participant_code` for the Beneficiary. This uniquely identifies the Beneficiary indefinitely and should be use in subsequent API calls where applicable. We’ll use **BENEF1** as the `participant_code` throughout the examples.

You should expect that Beneficiaries transition from `submitted` to `approved`, `rejected`, `pending_approval` **~instantly**.

### 

Beneficiary State Logic

After a successful [POST /participants/beneficiaries/new](https://docs.zerohash.com/reference/post_participants-beneficiaries-new) submission, the initial status of the Beneficiary will be `submitted`. At this point, zerohash is running an automated compliance screening. If the person passes this check, the status will transition to an `approved` state. If the compliance screening results in a hit, the status will transition to a `pending_approval` status. Note: there is also a scenario where the Beneficiary transitions directly into a `rejected` state, depending on the compliance score. zerohashs compliance team will become alerted and will manually review the Beneficiary within 24 hours. If the determination after that review is that the Beneficiary should not have been flagged, the status will transition to `approved`. Otherwise, the status will transition to `rejected`.

## 

5\. Query Beneficiary

Platforms can query already-submitted Beneficiaries via the [GET /participants](https://docs.zerohash.com/reference/get_participants) endpoint. A common query parameter is the `participant_code`, however the full list can be found on the [API reference](https://docs.zerohash.com/reference/get_participants).

`GET /participants?participant_code=BENEF1` response:

JSON

```
{
    "participant_code": "477S50",
    "participant_name": "Hector Garcias",
    "email": "q5rlag_56c977eb-d91f-487c-a2be-5e1550d8b91f@p.zerohash.com",
    "status": "pending_approval",
    "reason_code": null,
    "country": "Mexico",
    "state": "CMX",
    "jurisdiction_code": "MX-CMX",
    "updated_at": 1730375356473,
    "lifetime_remaining_limit": "0",
    "daily_remaining_limit": "0",
    "limit_currency": "USD",
    "limits": [{
            "currency": "USD",
            "types": [
                "trades"
            ],
            "period": 24,
            "balance": "0",
            "remaining_limit": "0"
        },
        {
            "currency": "USD",
            "types": [
                "trades"
            ],
            "period": 720,
            "balance": "0",
            "remaining_limit": "0"
        },
        {
            "currency": "USD",
            "types": [
                "trades"
            ],
            "period": 0,
            "balance": "0",
            "remaining_limit": "0"
        },
        {
            "currency": "USD",
            "types": [
                "trades"
            ],
            "period": 4320,
            "balance": "0",
            "remaining_limit": "0"
        }
    ]
}
```

## 

6\. Update Beneficiary

The Platform has the ability to update any already-submitted Beneficiary record using the [PATCH /participants/beneficiaries/{participant\_code}](https://docs.zerohash.com/reference/patch_participants-beneficiaries-participant-code) endpoint.

JSON

```
{
    "address_one": "1 Main St.",
    "address_two": "Suite 10001",
    "date_of_birth": "1985-09-02",
    "platform_updated_at": 1730113960212
}
```

Note that if the Platform didn't originally submit the optional fields (`date_of_birth`, `address_1`, or `address_2`) on the [POST /participants/beneficiaries/new](https://docs.zerohash.com/reference/post_participants-beneficiaries-new) endpoint, they can use the Update Beneficiary endpoint to attach these values onto a Beneficiary record. These additional fields may allow Beneficiaries to transition from a `pending_approval` status to `approved` as the additional information may allow the sanction screening checks to pass.

## 

7\. Initiate Conversion

The Platform will now convert the Sender Currency to the Remittance Token using the [POST /liquidity/rfq](https://docs.zerohash.com/reference/post_liquidity-rfq) and [POST /liquidity/execute](https://docs.zerohash.com/reference/post_liquidity-execute) endpoint.

[POST /liquidity/rfq](https://docs.zerohash.com/reference/post_liquidity-rfq) request:

JSON

```
{
  "participant_code":"SENDR1",
  "side": "buy",
  "underlying": "USDC", -- Remittance Token
  "quoted_currency": "USD", -- Sender Currency
  "total": "500", -- the total amount being charged to the Sender for the remittance
  "payment_processor": {         
      "name": "checkout.com", -- the name of the PSP clearing the fiat leg of the trade
      "id": "5cd07738b861c31e3bd61467BTC1Buy1568311644602" -- the  unique ID that must be tied back to the PSPs transaction - this will be used by Zero Hash to reconcile with the PSP
    }
}
```

Note:

- The Sender is used for the `participant_code`
- There is a credit check against the [Float Account](https://docs.zerohash.com/docs/remittance-integration-guide#1-fund-float-account). The balance on the account must be at least the amount of the submitted `total`

[POST /liquidity/rfq](https://docs.zerohash.com/reference/post_liquidity-rfq) response:

JSON

```
{
  "request_id": "ce819fe8-b1d7-43bb-961c-e09ede0988d3",
  "participant_code": "PLAT01",
  "quoted_currency": "USD",
  "side": "BUY",
  "quantity": "500",
  "price": "1.00",
  "quote_id": "32ad471b-824e-4f04-94ff-45c4439b4fe9",
  "expire_ts": 1568311649602,
  "account_group": "PLAT01",
  "account_label": "general",
  "obo_participant": {
    "participant_code": "SENDR1",
    "account_group": "PLAT01",
    "account_label": "general"
  },
  "total_notional": "500.00",
  "underlying": "USDC",
  "asset_cost_notional": "500.00",
  "spread_notional": "0",
  "spread_bps": "0",
  "payment_processor": {         
      "name": "checkout.com",
      "id": "5cd07738b861c31e3bd61467BTC1Buy1568311644602"
    }
}
```

Note:

- The `quote_id` will be used in the next call to execute the quote. The quote is valid for a configurable length of time. 5 or 30 seconds is recommended for Remittances.

[POST /liquidity/execute](https://docs.zerohash.com/reference/post_liquidity-execute) request:

JSON

```
{ 
   "quote_id": "32ad471b-824e-4f04-94ff-45c4439b4fe9"
}
```

[POST /liquidity/execute](https://docs.zerohash.com/reference/post_liquidity-execute) response:

JSON

```
{
    "request_id": "006c3b73-f06b-4002-8a4d-511cb0528443",
    "quote": {
        "request_id": "f2a841c1-4ef4-46e2-a0d6-4dac637df54b",
        "participant_code": "PLAT01",
        "quoted_currency": "USD",
        "side": "buy",
        "quantity": "500",
        "price": "1",
        "quote_id": "32ad471b-824e-4f04-94ff-45c4439b4fe9",
        "expire_ts": 1733239888234,
        "account_group": "PLAT01",
        "account_label": "general",
        "obo_participant": {
            "participant_code": "SENDR1",
            "account_group": "PLAT01",
            "account_label": "general"
        },
        "total_notional": "500",
        "settlement_type": null,
        "issuer_fee_rate": null,
        "issuer_fee_amount": null,
        "issuer_fee_payor_type": null,
        "underlying": "USDC.ETH",
        "asset_cost_notional": "500",
        "spread_notional": "0",
        "spread_bps": "0",
        "payment_processor": {         
            "name": "checkout.com",
            "id": "5cd07738b861c31e3bd61467BTC1Buy1568311644602"
    },
        "transaction_timestamp": 1733239883906
    },
    "trade_id": "2531e08e-b40b-40a7-b555-55261e518310",
    "status": "Completed",
    "trade_ids_list": [
        "2531e08e-b40b-40a7-b555-55261e518310"
    ]
}
```

Note:

- This call executes the quote initiates the USDC/USD trade
- Here are the account changes after a successful execution:

| | Asset | Current Balance | Change |
| --- | --- | --- | --- |
| Float Account | USD | $49,500 | (-$500) |
| Settlement Reserve Account | USD | $25,000 | |
| Sender Account | USDC | 500 | +500 |

## 

8\. Query Conversion

To query a specific conversion, you can get the trade using [GET /trades/{trade\_id}](https://docs.zerohash.com/reference/get_trades-trade-id) endpoint where `trade_id` is the trade\_id from the [POST /liquidity/execute](https://docs.zerohash.com/reference/post_liquidity-execute) response.

Trades do not settle instantaneously — they pass through internal processing and credit checks first. Do not assume settlement completes within a fixed window (e.g. a 30-second timeout). Poll [GET /trades/:trade\_id](https://docs.zerohash.com/reference-link/get_trades-trade-id) and only proceed once `trade_state` is `terminated` with `settlement_state: settled`.

This means that the amount has settled to the customers balance, the customers account balance will be updated, and a [webhook notification](https://docs.zerohash.com/reference-link/account-balance) will be sent to notify platforms of the [movements that contributed to the balance update](https://docs.zerohash.com/reference-link/accounts-4#webhook-notifications). More information on trade states [here](https://docs.zerohash.com/docs/zero-hash-transaction-states).

## 

9\. Initiate Transfer

The Platform will then initiate a transfer (this is just an internal transfer on the zerohash ledger) via the [POST /transfers](https://docs.zerohash.com/reference/post_transfers) endpoint:

[POST /transfers](https://docs.zerohash.com/reference/post_transfers) request:

JSON

```
{
    "from_participant_code":"SENDR1",
    "from_account_group":"PLAT01",
    "to_participant_code":"PLAT01",
    "to_account_group":"PLAT01",
    "asset":"USDC",
    "amount":"500"
}
```

[POST /transfers](https://docs.zerohash.com/reference/post_transfers) response:

JSON

```
{
    "id": 1106955,
    "client_transfer_id": null,
    "created_at": "2024-12-03T16:00:38.972Z",
    "updated_at": "2024-12-03T16:00:38.972Z",
    "status": "approved",
    "from_participant_code": "SENDR1",
    "from_account_group": "PLAT01",
    "from_account_label": null,
    "to_participant_code": "PLAT01",
    "to_account_group": "PLAT01",
    "to_account_label": null,
    "amount": "500",
    "movement_id": null,
    "admin_transfer": false,
    "parent_link_id": null,
    "parent_link_id_source": null,
    "asset": "USDC.ETH",
    "prefunded": false
}
```

Note:

- The transfer will settle instantly to the Platform's USDC account.
- Here are the account changes after a successful transfer:

| | Asset | Current Balance | Change |
| --- | --- | --- | --- |
| Float Account | USD | $49,500 | |
| Settlement Reserve Account | USD | $25,000 | |
| Sender Account | USDC | 0 | (-500) |
| Platform USDC Account | USDC | 500 | +500 |

## 

10\. Query Transfer

To query a specific transfer you can get the transfer using [GET /transfers/{id}](https://docs.zerohash.com/reference/get_transfers-id) endpoint where id is the id from the [POST /transfers response](https://docs.zerohash.com/reference/post_transfers).

Ensure `status` is in `settled` before proceeding. This means that the amount has been successfully transferred to the recipient.

## 

11\. Initiate Withdrawal

The Platform will then withdraw the Remittance Token on-chain via the [POST /withdrawals/requests](https://docs.zerohash.com/reference/post_withdrawals-requests) endpoint.

[POST /withdrawals/requests](https://docs.zerohash.com/reference/post_withdrawals-requests) request:

JSON

```
{ 
   "address":"0xcDA0D6adCD0f1CCeA6795F9b1F23a27ae643FE7C",
   "participant_code":"PLAT01",
   "amount":"500",
   "asset":"USDC",
   "account_group":"PLAT01",
   "sender_participant_code": "SENDR1",
   "beneficiary_participant_code": "BENEF1",
}
```

Note:

- This request moves the Remittance Token on-chain to the provided `address`
- The `sender_participant_code` and `beneficiary_participant_code` are needed in order for zerohash to be Travel Rule-compliant
- The network fee associated with the transfer is incurred by the Platform. By default, this will be payable in USD

[POST /withdrawals/requests](https://docs.zerohash.com/reference/post_withdrawals-requests) response:

JSON

```
{
    "message": {
        "id": "1be57e68-80cf-4994-ad2b-c305965c9115",
        "withdrawal_account_id": 342298,
        "participant_code": "PLAT01",
        "account_group": "PLAT01",
        "account_label": null,
        "requestor_participant_code": "PLAT01",
        "asset": "USDC.ETH",
        "requested_amount": "500",
        "settled_amount": null,
        "gas_price": null,
        "status": "APPROVED",
        "on_chain_status": null,
        "client_withdrawal_request_id": null,
        "requested_timestamp": 1726090966370,
        "transaction_id": null,
        "input_data": null,
        "fee_amount": null,
        "quoted_fee_amount": null,
        "quoted_fee_notional": null,
        "trade_id": null,
        "quoted_fee_asset": null,
        "withdrawal_fee": "",
        "parent_link_id": null,
        "parent_link_id_source": null,
        "amount_in_usd": 500,
        "sender_participant_code": "SENDR1",
        "beneficiary_participant_code": "BENEF1",
    }
}
```

Note

- The withdrawal will initially be in an APPROVED `status`
 - See guide [here](https://docs.zerohash.com/docs/withdrawal-api-response-field-interpretation#has-the-balance-been-deducted-from-the-zero-hash-ledger) for explanation on the `status` and `on_chain_status` fields
- Here are the account changes after a successful transfer:

| | Asset | Current Balance | Change |
| --- | --- | --- | --- |
| Float Account | USD | $49,500 | |
| Settlement Reserve Account | USD | $25,000 | |
| Sender Account | USDC | 0 | |
| Platform USDC Account | USDC | 0 | (-500) |

## 

12\. Query Withdrawal

The Platform can retrieve information related to **all** withdrawals via the [GET /withdrawals/requests](https://docs.zerohash.com/reference/get_withdrawals-requests) endpoint.

Additionally, Platforms can check an individual withdrawal via [GET /withdrawals/requests/id](https://docs.zerohash.com/reference/get_withdrawals-requests-id) where the `id` is the `withdrawal_request_id`.

[GET /withdrawals/requests/id](https://docs.zerohash.com/reference/get_withdrawals-requests-id) response. In this example, the withdrawal is fully settled on-chain:

JSON

```
{
    "message": [
        {
            "id": "1be57e68-80cf-4994-ad2b-c305965c9115",
            "withdrawal_account_id": 342298,
            "participant_code": "PLAT01",
            "account_group": "PLAT01",
            "account_label": null,
            "requestor_participant_code": "PLAT01",
            "asset": "USDC.ETH",
            "requested_amount": "500",
            "settled_amount":"500",
            "gas_price": null,
            "status": "SETTLED",
            "on_chain_status": "CONFIRMED",
            "client_withdrawal_request_id": null,
            "requested_timestamp": 1726090966370,
            "transaction_id": "0xe0875f35e9e526d60bfc57f0df92d308ab44a34d7dd5c06f100c0dd07def7125",
            "input_data": null,
            "fee_amount": null,
            "quoted_fee_amount": null,
            "quoted_fee_notional": null,
            "trade_id": null,
            "quoted_fee_asset": null,
            "withdrawal_fee": "",
            "parent_link_id": null,
            "parent_link_id_source": null,
            "sender_participant_code": "SENDR1",
            "beneficiary_participant_code": "BENEF1",
        }
    ]
}
```

## 

13\. Transitioning from Tier 1 to Tier 2

In order to transition a Sender from Tier 1 to Tier 2, and allow them to remit

- more than $999 over a 24 hour period, or
- more than $3,000 over a 30 day period, or
- more than $9,000 over the Sender's lifetime

The Platform must do the following:

1. Submit a physical document via the [POST /participants/documents](https://docs.zerohash.com/reference/post_participants-documents) endpoint

Example [POST /participants/documents](https://docs.zerohash.com/reference/post_participants-documents) request:

JSON

```
{
    "document": "{{base 64 encoded file}}",
    "mime": "pdf",
    "file_name": "john_smith_passport.pdf",
    "participant_code": "SENDR1"
}
```

2. Update the existing Sender participant via the [PATCH /participants/customers/{participant\_code}](https://docs.zerohash.com/reference/patch_participants-customers-participant-code) endpoint, changing the following fields:

- `id_number`
- `id_number_type`
- `liveness_check`
- `tax_id`

Example [PATCH /participants/customers/{participant\_code}](https://docs.zerohash.com/reference/patch_participants-customers-participant-code) request:

JSON

```
{
  "id_number": "L12345678",
  "id_number_type": "us_passport",
  "liveness_check": "pass"
  "tax_id": "123456789"
}
```

## 

14\. Transitioning from Tier 2 to Tier 3

In order to transition a Sender from Tier 2 to Tier 3, and allow them to remit

- more than $2,999 over a 24 hour period, or
- more than $9,999 over a 30 day period, or
- more than $60,000 over a 180 day period

The Platform must do the following:

1. Update the existing Sender participant via the [PATCH /participants/customers/{participant\_code}](https://docs.zerohash.com/reference/patch_participants-customers-participant-code) endpoint, changing the following fields:
 - `source_of_funds`
 - `industry`
 - `employment_status`

## 

15\. End of Day Settlement:

There are 2 different types of settlement sessions:

- **Net buy session:** There is more buy volume than sell (therefore zerohash receive a settlement)
- **Net sell session:** There is more sell volume than buy (therefore zerohash will disperse a settlement)

### 

Net Buy

- zerohash will receive a settlement directly from the PSP
- The funds will be credited to the Platform's float account

### 

Net Sell

- Platform can request a USD withdrawal on the client portal or via API to their respective bank

Updated 5 days ago

---

Did this page help you?

Yes

No

Copy Page