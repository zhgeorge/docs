# Source: https://docs.zerohash.com/docs/fund-integration-guide-api

See core product page [here](https://docs.zerohash.com/docs/fund-overview)

# 

Setup

In this guide, the Platform is [setup](https://docs.zerohash.com/docs/fund-overview#setup) to use the **Onboarding API (Reliance)** plus the **Account** **Funding API**.

![](https://files.readme.io/4c178522a0187c0ff83d1acba150bbd3a573a72b43cf8e89199c1bf70f273b83-image.png)

# 

Flow

The following example illustrates a platform configuration where incoming stablecoin deposits are automatically converted to USD and subsequently swept to the Platform’s master ledger account.

## 

Webhook configuration

Talk to your zerohash representative to have your Platform configured for the following webhooks:

- Onboarding
- Account Funding

## 

Onboarding via API (Reliance)

The Platform will use an external, non-zerohash KYC provider to perform proper verification of the Customer. After a successful verification, pass the results to zerohash via API.

> 📘
> 
> ### 
> 
> Natural vs. Non-natural person
> 
> Platforms can choose to onboard end users (ie, Natural Persons) or entities (ie, Non-natural persons). Both examples will be shown below

### 

Submit customer

#### 

Natural Person

Example request - [POST /participants/customers/new](https://docs.zerohash.com/reference/post_participants-customers-new)

JSON

```
{
   "first_name":"John",
   "last_name":"Smith",
   "email":"jsmith@example.com",
   "phone_number":"9545551234",
   "address_one":"1 Main St.",
   "address_two":"Suite 1000",
   "city":"Chicago",
   "state":"IL",
   "zip":"12345",
   "country":"United States",
   "date_of_birth":"1985-09-02",
   "citizenship":"United States",
   "tax_id":"123456789",
   "risk_rating":"low",
   "kyc":"pass",
   "kyc_timestamp":1630623005000,
   "sanction_screening":"pass",
   "sanction_screening_timestamp":1630623005000,
   "idv":"pass",
   "liveness_check":"pass",
   "signed_timestamp":1630623005000,
   "metadata":{
      
   },
   "signed_agreements":[
      {
         "type":"fund_auto_convert",
         "region":"us",
         "signed_timestamp":1712008721000
      }
   ]
}
```

zerohash will respond with a `participant_code` that uniquely identifies the customer.

If you fail to indicate that the End Customer has agreed to the account funding-specific terms, in the `signed_agreements` object shown above, `/fund` API calls will fail.

There may be situations where the Platform is restricted from submitting Customers who reside in non-permitted jurisdictions. The Platform will receive an error that looks like:

JSON

```
{
    "errors": [
        "The submitting platform is not allowed to operate in the participant's resident state",
        "participant is not in an allowed jurisdiction"
    ]
}
```

See more detail on permitted jurisdictions [here](https://docs.zerohash.com/docs/permitted-and-restricted-jurisdictions).

The preferred approach is for the Platform to not allow customers to onboard on _their side_ (through a feature flag, for example). However, if a request with a Customer in a blocked jurisdiction does get submitted to zerohash via API, the Platform should fail gracefully and display a descriptive error message on-screen.

#### 

Non-natural person

> 📘
> 
> ### 
> 
> Partial vs. Full Non-natural person
> 
> **Partial:** zerohash offers approved Platforms the ability to submit a stripped-down KYB data packet. This is typically reserved for licensed financial institutions, but is subject to review on a case-by-case basis.
> 
> **Full:** default comprehensive KYB data packet

##### 

Partial Non-natural person

To submit a partial non-natural person customer, use the [POST /participants/entity/new](https://docs.zerohash.com/reference/post_participants-entity-new) endpoint. Example request:

JSON

```
{    
    "request_id": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
    "platform_code": "PLAT01",
    "legal_name": "Entity A",
    "contact_number": "15553765432",
    "address_one": "1 Main St.",
    "address_two": "Suite 1000",
    "city": "Chicago",
    "postal_code": "12345",
    "jurisdiction_code": "US-IL",
    "tax_id": "883987654",
    "id_issuing_authority": "United States",
    "sanction_screening": "pass",
    "sanction_screening_timestamp": 1603378501286,
    "signed_agreements": [
  {
    "type": "fund_auto_convert",
    "region": "us",
    "signed_timestamp": 1603378501286
  }
]  
}
```

Example response:

JSON

```
{
  "message": {
    "platform_code": "PLAT01",
    "participant_code": "CUST01",
    "status": "approved",
    "entity_name": "Entity A",
    "legal_name": "Entity A",
    "subdomain": "",
    "address_one": "1 Main St.",
    "address_two": "Suite 1000",
    "jurisdiction_code": "US-IL",
    "city": "Chicago",
    "postal_code": "12345",
    "date_established": "",
    "risk_rating": "",
    "risk_vendor": "",
    "entity_type": "",
    "metadata": {},
    "signed_timestamp": 0,
    "tax_id": "883987654",
    "contact_number": "15553765432",
    "website": "",
    "id_issuing_authority": "United States",
    "sanction_screening": "pass",
    "sanction_screening_timestamp": 1603378501000,
    "expected_annual_volume": "",
    "submitter_email": "",
    "submitter_first_name": "",
    "submitter_last_name": "",
    "submitter_title": "",
    "beneficial_owners": [],
    "control_persons": [],
    "id_number_type": "",
    "id_number": "",
    "self_certification_timestamp": 0,
    "signed_agreements": [
      {
        "type": "fund_auto_convert",
        "region": "us",
        "signed_timestamp": 1603378501286
      }
    ]
  }
}
```

##### 

Full Non-natural person

To submit a full non-natural person customer, use the [POST /participants/entity/new](https://docs.zerohash.com/reference/post_participants-entity-new) endpoint. Example request:

JSON

```
{
  "request_id": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
  "platform_code": "PLAT01",
  "entity_name": "Entity A",
  "legal_name": "Entity A",
  "contact_number": "15553765432",
  "website": "https://entitya.com",
  "date_established": "2020-01-15",
  "entity_type": "llc",
  "address_one": "1 Main St.",
  "address_two": "Suite 1000",
  "city": "Chicago",
  "postal_code": "12345",
  "jurisdiction_code": "US-IL",
  "tax_id": "883987654",
  "id_issuing_authority": "United States",
  "risk_rating": "low",
  "sanction_screening": "pass",
  "sanction_screening_timestamp": 1603378501286,
  "signed_timestamp": 1603378501286,
  "submitter_email": "compliance@entitya.com",
  "control_persons": [
    {
      "name": "Jane Smith",
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane.smith@entitya.com",
      "address_one": "1 Main St.",
      "city": "Chicago",
      "postal_code": "12345",
      "jurisdiction_code": "US-IL",
      "citizenship_code": "US",
      "date_of_birth": "1985-06-15",
      "tax_id": "123456789",
      "id_number_type": "ssn",
      "id_number": "123456789",
      "id_issuing_authority": "United States",
      "sanction_screening": "pass",
      "sanction_screening_timestamp": 1603378501286,
      "control_person": 1,
      "kyc": "pass",
      "kyc_timestamp": 1603378501286
    }
  ],
  "beneficial_owners": [
    {
      "name": "Jane Smith",
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane.smith@entitya.com",
      "address_one": "1 Main St.",
      "city": "Chicago",
      "postal_code": "12345",
      "jurisdiction_code": "US-IL",
      "citizenship_code": "US",
      "date_of_birth": "1985-06-15",
      "tax_id": "123456789",
      "sanction_screening": "pass",
      "sanction_screening_timestamp": 1603378501286,
      "beneficial_owner": 25,
      "kyc": "pass",
      "kyc_timestamp": 1603378501286
    }
  ],
  "signed_agreements": [
    {
      "type": "fund_auto_convert",
      "region": "us",
      "signed_timestamp": 1603378501286
    }
  ]
}
```

Example response:

JSON

```
{
  "message": {
    "platform_code": "PLAT01",
    "participant_code": "WFG012",
    "status": "submitted",
    "entity_name": "Entity A",
    "legal_name": "Entity A",
    "subdomain": "",
    "address_one": "1 Main St.",
    "address_two": "Suite 1000",
    "jurisdiction_code": "US-IL",
    "city": "Chicago",
    "postal_code": "12345",
    "date_established": "2020-01-15",
    "risk_rating": "low",
    "risk_vendor": "unknown",
    "entity_type": "llc",
    "metadata": {},
    "signed_timestamp": 1603378501000,
    "tax_id": "883987654",
    "contact_number": "15553765432",
    "website": "https://entitya.com",
    "id_issuing_authority": "United States",
    "sanction_screening": "pass",
    "sanction_screening_timestamp": 1603378501000,
    "expected_annual_volume": "unknown",
    "submitter_email": "compliance@entitya.com",
    "submitter_first_name": "",
    "submitter_last_name": "",
    "submitter_title": "",
    "id_number_type": "",
    "id_number": "",
    "self_certification_timestamp": 0,
    "control_persons": [
      {
        "user_code": "USHJ7K",
        "first_name": "Jane",
        "middle_name": "",
        "last_name": "Smith",
        "name": "Jane Smith",
        "email": "jane.smith@entitya.com",
        "address_one": "1 Main St.",
        "address_two": "",
        "city": "Chicago",
        "state_or_province": "",
        "postal_code": "12345",
        "country": "",
        "jurisdiction_code": "US-IL",
        "date_of_birth": "1985-06-15",
        "place_of_birth_name": "",
        "place_of_birth_country_code": "",
        "citizenship": "",
        "citizenship_code": "US",
        "tax_id": "123456789",
        "id_number_type": "ssn",
        "id_number": "123456789",
        "id_issuing_authority": "United States",
        "sanction_screening": "pass",
        "sanction_screening_timestamp": 1603378501000,
        "role": "",
        "control_person": 1,
        "kyc": "pass",
        "kyc_timestamp": 1603378501286
      }
    ],
    "beneficial_owners": [
      {
        "user_code": "BOWN3R",
        "beneficial_owner": 25,
        "first_name": "Jane",
        "middle_name": "",
        "last_name": "Smith",
        "name": "Jane Smith",
        "email": "jane.smith@entitya.com",
        "address_one": "1 Main St.",
        "address_two": "",
        "city": "Chicago",
        "state_or_province": "",
        "postal_code": "12345",
        "country": "",
        "jurisdiction_code": "US-IL",
        "date_of_birth": "1985-06-15",
        "place_of_birth_name": "",
        "place_of_birth_country_code": "",
        "citizenship": "",
        "citizenship_code": "US",
        "tax_id": "123456789",
        "id_number_type": "ssn",
        "id_number": "",
        "id_issuing_authority": "",
        "sanction_screening": "pass",
        "sanction_screening_timestamp": 1603378501000,
        "role": "",
        "kyc": "pass",
        "kyc_timestamp": 1603378501286
      }
    ],
    "signed_agreements": [
      {
        "type": "fund_auto_convert",
        "signed_timestamp": 1603378501,
        "region": "us"
      }
    ],
    "b_notice_receipt": false,
    "is_w_form_certified": false,
    "physical_delivery": false,
    "signature": "",
    "payee_exemption": 0,
    "is_not_subject_backup_withholding": false,
    "fatca_reporting_exemption": 0,
    "dba_name": "",
    "other_entity_type": ""
  }
}
```

##### 

Idempotency

You can make your requests idempotent by using the `request_id` field. If a subsequent call is made with a previously used `request_id`, then the request would fail with an error code 400, error message “requestID already used with different participant data”.

## 

Initialize Account Funding Flow

### 

Create deposit address

To create a deposit address, use the hit the [POST /fund/rfq](https://docs.zerohash.com/reference/post_fund-rfq) endpoint. Example request:

JSON

```
{
   "participant_code":"CUST01",
   "fund_asset":"USDC.ETH",
   "client_fund_id":"abc123"
}
```

Notes:

- See `client_fund_id` release notes on behavior [here](https://docs.zerohash.com/changelog/reference_id-field-added-to-account-funding-api-and-sdk).

Example response:

JSON

```
{
  "message": {
    "request_id": "14f8ebb8-7530-4aa4-bef9-9d73d56313f3",
    "participant_code": "CUST01",
    "fund_asset": "USDC.ETH",
    "rate": "1",
    "quoted_currency": "USD",
    "expiry_timestamp": null,
    "deposit_address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    "deposit_fee_bps": 100,
    "subsequent_deposit_fee_floor": "1.00",
    "first_deposit_fee_floor": "1.00",
    "minimum_deposit": "1",
    "maximum_deposit": "500000",
    "reference_id": "abc123"
  }
}
```

### 

Customer deposits crypto or stablecoins

You should now be prompting the customer to deposit to the `deposit_address` from the above response. **All deposits made to this address will be auto-converted to USD and transferred to your account on our ledger.**

#### 

Deposit received

The transaction has received the proper amount of on-chain confirmations (for USDC in this case, it is 1) and zerohash initiates a series of movements:

Accounts for this example:

| account\_id | account\_owner | account\_group | account\_label | account\_type | asset |
| --- | --- | --- | --- | --- | --- |
| 47a854fa-d0e4-405b-831b-f1a86bbf7988 | CUST01 | PLAT01 | general | available | USDC.ETH |
| 52c29f2d-8298-4e8c-84bc-7773960bee12 | CUST01 | PLAT01 | general | available | USD |

1. **Deposit:** Using our account nomenclature, the movement would appear as:

| account\_owner | account\_group | account\_label | account\_type | movement\_type | asset | change |
| --- | --- | --- | --- | --- | --- | --- |
| CUST01 | PLAT01 | general | available | deposit | USDC.ETH | +1,000 |

2. **Conversion:** Automatically, zerohash will convert the USDC to USD. This technically creates a trade, which has a movement\_type of final\_settlement:

| account\_owner | account\_group | account\_label | account\_type | movement\_type | asset | change |
| --- | --- | --- | --- | --- | --- | --- |
| CUST01 | PLAT01 | general | available | final\_settlement | USDC.ETH | \-1,000 |
| CUST01 | PLAT01 | general | available | final\_settlement | USD | +1,000 |

3. **Transfer:** Automatically, zerohash will transfer the USD from the end customer account to the platform's:

| account\_owner | account\_group | account\_label | account\_type | movement\_type | asset | change |
| --- | --- | --- | --- | --- | --- | --- |
| CUST01 | PLAT01 | general | available | transfer | USD | \-1,000 |
| PLAT01 | PLAT01 | general | available | transfer | USD | +1,000 |

### 

Webhook event triggered

You will then receive a webhook with payload type = DEPOSIT\_FUND\_COMPLETE. Example payload:

JSON

```
{
  "participant_code": "CUST01",
  "fund_asset": "USDC.ETH",
  "rate": "1",
  "quoted_currency": "USD",
  "source_address": "3xJ9KzymPqfHBqp2fGKoHtBcEn7LP5gSYNzGKS1vJcBr",
  "deposit_address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "quantity": "500",
  "notional": "495.00",
  "fund_id": "a1b2c3d4-5678-9012-abcd-ef1234567890",
  "fund_timestamp": 1745262000000000000,
  "deposit_timestamp": 1745261950000000000,
  "transaction_id": "4vJ9GKzymPqfHBqp2fGKoHtBcEn7LP5gSYNzGKS1vJcBr2xJ9KzymPqfHBqp2fG",
  "account_label": "general",
  "success": true,
  "reason": "Deposit processed",
  "reference_id": "abc123",
  "raw_fee_bps": "100",
  "deposit_fee_bps": "100",
  "raw_fee_notional": "5.00",
  "deposit_fee_notional": "5.00",
  "source": {}
}
```

### 

Query transactions

You can retroactively query the [GET /fund/transactions](https://docs.zerohash.com/reference/get_fund-transactions) endpoint to view details of prior Account Funding events. View the [code recipe](https://docs.zerohash.com/recipes/fund-get-transactions) for additional assistance. Example response:

JSON

```
{
  "message": [
    {
      "participant_code": "CUST01",
      "fund_asset": "USDC.ETH",
      "rate": "1",
      "quoted_currency": "USD",
      "source_address": "3xJ9KzymPqfHBqp2fGKoHtBcEn7LP5gSYNzGKS1vJcBr",
      "deposit_address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      "quantity": "500",
      "notional": "500",
      "success": true,
      "status_reason": "",
      "status_reason_code": "DEPOSIT_PROCESSED",
      "fund_timestamp": 1745262000000,
      "deposit_timestamp": 1745261950000,
      "transaction_id": "4vJ9GKzymPqfHBqp2fGKoHtBcEn7LP5gSYNzGKS1vJcBr2xJ9KzymPqfHBqp2fG",
      "account_label": "general",
      "fund_id": "a1b2c3d4-5678-9012-abcd-ef1234567890",
      "is_first_deposit": true,
      "raw_fee_bps": "100",
      "deposit_fee_bps": "100",
      "raw_fee_notional": "5",
      "deposit_fee_notional": "5",
      "deposited_asset": "USDC.SOL",
      "reference_id": "abc123"
    }
  ],
  "page": 1,
  "page_size": 50,
  "total_pages": 1
}
```

## 

Reconciliation - query the movements endpoint

The platform can now query `GET /movements` in order to view all related ledger movements to this Account Funding event.

Example response - [GET /movements?parent\_link\_id=](https://docs.zerohash.com/reference/get_accounts-account-id-movements)

JSON

```
{
  "message": [
    {
      "movement_timestamp": 1550174570000,
      "account_id": "47a854fa-d0e4-405b-831b-f1a86bbf7988",
      "movement_id": "5d4d962d-dc37-4ddc-b0c5-b8980d1d4421",
      "movement_type": "deposit",
      "transfer_type": null,
      "deposit_reference_id": null,
      "withdrawal_request_id": null,
      "parent_link_id": "5155f7c9-95cb-4556-ab89-c178943a7111",
      "trade_id": null,
      "change": "1000"
    },
    {
      "movement_timestamp": 1550174571000,
      "account_id": "47a854fa-d0e4-405b-831b-f1a86bbf7988",
      "movement_id": "3d4d962d-dc37-4ddc-b0c5-b8980d1d4422",
      "movement_type": "final_settlement",
      "transfer_type": null,
      "deposit_reference_id": null,
      "withdrawal_request_id": null,
      "parent_link_id": "5155f7c9-95cb-4556-ab89-c178943a7111",
      "trade_id": null,
      "change": "-1000"
    },
    {
      "movement_timestamp": 1550174572000,
      "account_id": "52c29f2d-8298-4e8c-84bc-7773960bee12",
      "movement_id": "80818b7b-92ec-4882-a371-a59fb3f8bce0",
      "movement_type": "final_settlement",
      "transfer_type": null,
      "deposit_reference_id": null,
      "withdrawal_request_id": null,
      "parent_link_id": "5155f7c9-95cb-4556-ab89-c178943a7111",
      "trade_id": null,
      "change": "1000"
    },
    {
      "movement_timestamp": 1550174573000,
      "account_id": "52c29f2d-8298-4e8c-84bc-7773960bee12",
      "movement_id": "80818b7b-92ec-4882-a371-a59fb3f8bce0",
      "movement_type": "transfer",
      "transfer_type": null,
      "deposit_reference_id": null,
      "withdrawal_request_id": null,
      "parent_link_id": "5155f7c9-95cb-4556-ab89-c178943a7111",
      "trade_id": null,
    "change": "-1000"
    },
    {
      "movement_timestamp": 1550174574000,
      "account_id": "77c29f2d-8298-4e8c-84bc-7773960bee10",
      "movement_id": "80818b7b-92ec-4882-a371-a59fb3f8bce0",
      "movement_type": "transfer",
      "transfer_type": null,
      "deposit_reference_id": null,
      "withdrawal_request_id": null,
      "parent_link_id": "5155f7c9-95cb-4556-ab89-c178943a7111",
      "trade_id": null,
      "change": "1000"
    }
  ]
}
```

## 

Deposit returns

> 🚧
> 
> ### 
> 
> IMPORTANT: You **cannot** rely on the deposit’s source address as the return destination. Blockchain transactions are not inherently bidirectional, and returning funds to the sender address may result in loss of funds or failed deliveries.
> 
> Some Platforms may choose to pair their zerohash integration with their own transaction monitoring tools. In situations where zerohash accepts a deposit, but the Platform’s monitoring logic flags and rejects it, the Platform may opt to return the deposit by using the POST /withdrawal/requests endpoint.
> 
> The required flow is to always request and confirm a return address directly from the customer before initiating the return.
> 
> Please speak to a zerohash sales engineer for guidance if interested in this flow.

## 

Settlement

zerohash will, one time per day, send a fiat settlement wire to the Platform where the amount represents the sum of all converted deposits from the prior trading session. Here is the settlement schedule:

| Session | Start | End | Expected Settlement Time\* |
| --- | --- | --- | --- |
| Monday | Monday 9:00a EST | Tuesday 8:59:59a EST | Tuesday EOD |
| Tuesday | Tuesday 9:00a EST | Wednesday 8:59:59a EST | Wednesday EOD |
| Wednesday | Wednesday 9:00a EST | Thursday 8:59:59a EST | Thursday EOD |
| Thursday | Thursday 9:00a EST | Friday 8:59:59a EST | Friday EOD |
| Friday | Friday 9:00a EST | Monday 8:59:59a EST | Monday EOD |

During US holidays, Platforms should expect their settlements to arrive by EOD on the next business day. For example, for the August 30th 2024 session, the settlement will arrive by Tuesday EOD (because Monday was Labor Day)

### 

Tracking the settlement amount

The recommended way to track the impending settlement amount is to query the [GET /accounts/{account\_id}](https://docs.zerohash.com/reference/get_accounts-account-id) endpoint. In order to retrieve the correct `account_id` to use in that call, use the following query parameters when hitting the [GET /accounts](https://docs.zerohash.com/reference/get_accounts) endpoint:

- `participant_code`: \[your platform code\]
- `account_group`: \[your platform code\]
- `account_label`: general
- `account_type`: available
- `asset`: \[fiat currency code, typically "USD"\]

Use the `account_id` in the response to query associated accounts. Example response:

JSON

```
{
    "message": [
        {
            "asset": "USD"
            "account_owner": "PLAT01",
            "account_type": "available",
            "account_group": "PLAT01",
            "account_label": "general",
            "balance": "25000",
            "account_id": "af063ca6-836f-4677-8ebf-edbe1d049938",
            "last_update": 1727214271011
        }
    ]
}
```

### 

Retroactively querying settlements in the past

Platform settlements are technically a `withdrawal`. In order to query settlements from the past, use the [GET /withdrawals/requests](https://docs.zerohash.com/reference/get_withdrawals-requests) endpoint. The response will show all withdrawals made from the Platform's account, or one of your Customer's (Customer withdrawals are extremely rare and reserved for edge case Account Funding failures only).

In order to filter for withdrawals made from the Platform account only, query [GET /withdrawals/requests](https://docs.zerohash.com/reference/get_withdrawals-requests) using the `participant_code` query parameter, where the value is the Platform's platform code:

Example `GET /withdrawals/requests?participant_code=PLAT01` response:

JSON

```
{
    "message": [
        {
            "id": "152b8276-0585-45ec-bf62-85e134b3ff43",
            "withdrawal_account_id": 346030,
            "participant_code": "PLAT01",
            "account_group": "PLAT01",
            "account_label": null,
            "requestor_participant_code": "PLAT01",
            "asset": "USDC.SOL",
            "requested_amount": "25000",
            "settled_amount": "25000",
            "gas_price": null,
            "status": "SETTLED",
            "on_chain_status": "",
            "client_withdrawal_request_id": null,
            "requested_timestamp": 1727921516403,
            "transaction_id": "HND48J83HGR55LLP",
            "input_data": null,
            "fee_amount": "",
            "quoted_fee_amount": null,
            "quoted_fee_notional": null,
            "trade_id": null,
            "quoted_fee_asset": null,
            "withdrawal_fee": "",
            "parent_link_id": null,
            "parent_link_id_source": null
        }
    ]
}
```

Updated about 2 months ago

---

Did this page help you?

Yes

No

Copy Page