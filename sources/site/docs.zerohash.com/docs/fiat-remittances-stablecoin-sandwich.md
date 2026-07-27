# Source: https://docs.zerohash.com/docs/fiat-remittances-stablecoin-sandwich

## 

Introduction

Our API-powered cross-currency remittances product enables marketplaces, employment of record platforms, and fintechs to use stablecoins as an efficient bridge between fiat currencies. The benefits include:

- **Efficient cross-border payouts:** Send funds in one currency (ie, USD) and deliver in another (ie, ARS) using stablecoins (ie, USDC) as an intermediary for speed and cost-efficiency
- **Simplified global coverage:** Avoid managing multiple local banking integrations or correspondent banking relationships
- **Reduced costs and delays:** Stablecoins enable near-instant settlement with lower fees compared to traditional FX and wire networks

zerohash enables instant fiat payouts to over 130 countries across all major regions—including Latin America (ie, Brazil, Mexico, Colombia), Africa (ie, Nigeria, Kenya, South Africa), Asia-Pacific (ie, India, Philippines, Indonesia), the Middle East (ie, UAE, Saudi Arabia), and Europe (ie, Netherlands, Germany, Poland). Contact Zero Hash directly for the full list of supported countries, currencies and local payment networks.

## 

Definitions

| Term | Definition |
| --- | --- |
| Payout | The end to end transaction that consists of a fiat to stablecoin conversion, the disbursement of stablecoins, and the eventual stablecoin to local currency conversion and delivery |
| Platform | The company that's in contract with zerohash and directly interacts with zerohash's API's or SDK's. |
| Payor | A non-natural person (typically a business) that is a customer of the Platform. This is the core front-end that the Beneficiary interacts with.<br>The Payor may be the Platform. |
| Beneficiary | The natural person that receives the stablecoin payout. |

## 

High Level Flow

1. Submit Payor
2. Query Payor
3. Fund Float Account
4. Submit Beneficiary
5. Query Beneficiary
6. Connect External Account
7. Query External Accounts
8. Get FX Quote
9. Initiate FX Quote
10. Query Payouts
11. Network Fee Procedures
12. Email Receipt Requirements

## 

Initial Setup

The Platform will need to onboard its business to the zerohash platform. They then need to add additional users, create API keys, and whitelist IP addresses. See instructions [here](https://docs.zerohash.com/docs/getting-started).

## 

1\. Submit Payor

Once API keys are created and approved, the Platform can begin to integrate to the API. For the following examples, we’ll assume the Platform's platform code is PLAT01.

### 

Payor Information

The Platform submits the Payor via [POST /participants/entity/new](https://docs.zerohash.com/reference/post_participants-entity-new)

JSON

```
{
    "platform_code": "PLAT01",
    "entity_name": "Freelancer Platform XYZ",
    "legal_name": "Freelancer Platform XYZ Inc.",
    "contact_number": "15553765432",
    "website": "www.freelancerplatform.com",
    "date_established": "2018-01-15",
    "entity_type": "llc",
    "address_one": "1 Main St.",
    "address_two": "Suite 1000",
    "city": "Chicago",
    "postal_code": "12345",
    "jurisdiction_code": "US-IL",
    "tax_id": "883987654",
    "id_issuing_authority": "United States",
    "risk_rating": "low",
    "risk_vendor": "passbase",
    "sanction_screening": "pass",
    "sanction_screening_timestamp":1677252628000,
    "metadata":{},
    "signed_timestamp":1677252629000,
    "submitter_email": "josh_doe@gmail.com",
    "submitter_first_name": "Josh"  // new addition to these specs 11.6.24 (to be a required field in the future)
    "submitter_last_name": "Doe"  // new addition to these specs 11.6.24 (to be a required field in the future)
    "submitter_title": "Senior Legal Council" // new addition to these specs 11.6.24 (to be a required field in the future)
    "control_persons":[
      {
        "name": "Joe Doe",
        "email": "joe.doe@test.com",
        "address_one": "1 South St.",
        "address_two": "Suite 2000",
        "city": "Chicago",
        "postal_code": "12345",
        "jurisdiction_code": "US-IL",
        "date_of_birth": "1980-01-30",  
        "citizenship_code": "US", 
        "tax_id": "123456789",
        "id_number_type": "us_passport",
        "id_number": "332211200",
        "kyc": "pass",
        "kyc_timestamp": 1630623005000,
        "sanction_screening":"pass",
        "sanction_screening_timestamp":1677252628000,
        "control_person": 1
      }
    ],
    "beneficial_owners":[
      {
        "name": "Jane Doe Jr",
        "beneficial_owner":1,
        "email": "janedoejr@test.com",
        "address_one": "1 North St.",
        "address_two": "Suite 3000",
        "city": "Chicago",
        "postal_code": "12345",
        "jurisdiction_code": "US-IL",
        "date_of_birth": "1980-01-30",
        "citizenship_code": "US", 
        "tax_id": "012345578",
        "id_number_type": "us_drivers_license",
        "id_number": "P11122243333",
        "kyc": "pass",
        "kyc_timestamp": 1630623005000,
        "sanction_screening": "pass",
        "sanction_screening_timestamp":1677252628000
      }
    ]
}
```

You’ll receive a `participant_code` in the response - this is the Payor participant code that uniquely identifies the entity indefinitely. We’ll use **PAYOR1** as the `participant_code` throughout the examples.

See [response](https://docs.zerohash.com/reference/post_participants-entity-new) for expected shape.

The Platform must submit at least 1 `beneficial_owners` and 1 `control_persons`. If these persons do not have an SSN, the Platform must submit a document via [POST /participants/entity/documents](https://docs.zerohash.com/reference/post_participants-entity-documents).

### 

Payor Documents

Your Payor **will not** become `approved` unless you also supply the proper documents via [POST /participants/entity/documents](https://docs.zerohash.com/reference/post_participants-entity-documentsz) endpoint. Depending on the `entity_type` that was used in the original [POST /participants/entity/new](https://docs.zerohash.com/reference/post_participants-entity-new) call, the document requirements vary. See details [here](https://docs.zerohash.com/reference/post_participants-entity-new).

The Platform submits the Payor documents via [POST /participants/entity/documents](https://docs.zerohash.com/reference/post_participants-entity-documents):

JSON

```
{
    "document": "...", // base 64 encoded file that you wish to upload (10mb limit)
    "mime": "image/png",
    "document_type": "articles_of_incorporation",
    "file_name": "test.png",
    "participant_code": "PAYOR1"
}
```

### 

State Logic

After a successful [POST /participants/entity/new](https://docs.zerohash.com/reference/post_participants-entity-new) submission, the initial status of the entity will be `submitted`. In order to transition this to `approved`, the Platform must then submit all required documents, via [POST /participants/entity/documents](https://docs.zerohash.com/reference/post_participants-entity-documents).

## 

2\. Query Payor

Platforms can query already-submitted Payors via the [GET /participants](https://docs.zerohash.com/reference/get_participants) endpoint. If you'd like to query a specific Payor use the`participant_code` parameter.

## 

3\. Fund Float Account

The Platform will fund their float account by sending fiat to the proper bank account. Here are the [account](https://docs.zerohash.com/docs/what-is-an-account) details:

- Participant\_code: 00SCXM
- Account\_group: PLAT01
- Account\_label: general
- Account\_type: available
- Asset: USD

> ℹ️
> 
> ### 
> 
> In Cert, your platform will be pre-funded with Float account funds.

## 

4\. Submit Beneficiary

The Platform submits a Beneficiary via [POST /participants/beneficiaries/new](https://docs.zerohash.com/reference/post_participants-beneficiaries-new)

Available to select Platforms only: you can conditionally submit either a `phone_number` or an `email`\- you must submit at least one, otherwise the request will fail.

JSON

```
{
    "first_name": "Lucas",
    "last_name": "Martinez",
    "email": "lmartinez+1@gmail.com",
    "address_one": "Calle San Martín 305",
    "address_two": "305",
    "city": "Buenos Aires",
    "zip": "C1000",
    "jurisdiction_code": "AR-X",
    "citizenship_code": "AR",
    "date_of_birth": "1985-09-02",
    "id_number_type": "non_us_passport",
    "id_number": "A12345678",
    "employment_status": "part_time", // optional
    "industry": "consulting", // optional
    "source_of_funds": "salary", // optional
    "signed_agreements": [
    {
        "type": "payment_services_terms",
        "region": "us",
        "signed_timestamp": 1726005278070
    }
]
}
```

NOTE:

- Even in Cert, zerohash will run each submitted Beneficiary through our Sanction Checks, subjecting the Beneficiaries to real validations. This means that if your entry is an actual sanctioned individual, the Beneficiary will be sent to a `rejected` status. Another way to test the `rejected` scenario is to enter an SSN of "111111111". If you'd like to test an `approved` scenario - ensure you as close-to-reality sample as possible.
- zerohash requires that the `jurisdiction_code` is not null and contains both a Country (ie, Brazil "BR") and a Subdivision (ie, Sao Palo "SP") to form BR-SP, for example. If your systems don't contain the subdivision and you only collect Country and Postal Code, we recommend performing a mapping on your side to derive the correct Subdivision, using the Country and Postal code as inputs. See this [step-by-step guide](https://docs.zerohash.com/docs/iso-3166-subdivision-conversions) on how to use an external API (ie, Google Geocoding API) to make a conversion between your data structure, to ours.
- The API will allow for either a `tax_id` or (`id_number` and `id_number_type`). So, US persons with an SSN for example, can submit their SSN without additionally needing to undergo ID verification.

[POST /participants/beneficiaries/new](https://docs.zerohash.com/reference/post_participants-beneficiaries-new) response:

JSON

```
{
    "message": {
        "first_name": "Lucas",
        "last_name": "Martinez",
        "email": "lmartinez+2@gmail.com",
        "address_one": "Calle San Martín 305",
        "address_two": "305",
        "jurisdiction_code": "AR-X",
        "city": "Buenos Aires",
        "zip": "C1000",
        "date_of_birth": "1985-09-02",
        "id_number_type": "non_us_passport",
        "id_number": "A12345678",
        "metadata": {},
        "platform_code": "PLAT01",
        "participant_code": "BENEF1",
        "citizenship_code": "AR",
        "phone_number": "",
        "signed_agreements": [
            {
                "region": "us",
                "signed_timestamp": 1726005278,
                "type": "payment_services_terms"
            }
        ],
        "employment_status": "part_time",
        "industry": "consulting",
        "source_of_funds": "salary"
    }
}
```

You’ll receive a `participant_code` in the response - this is the Beneficiary participant code that uniquely identifies the natural person indefinitely. We’ll use **BENEF1** as the `participant_code` throughout the examples.

You should expect that Beneficiaries transition from `submitted` to `approved`, `rejected`, `pending_approval` **~instantly**.

### 

Beneficiary State Logic

After a successful [POST /participants/beneficiaries/new](https://docs.zerohash.com/reference/post_participants-beneficiaries-new) submission, the initial status of the Beneficiary will be `submitted`. At this point, zerohash is running an automated compliance screening. If the person passes this check, the status will transition to an `approved` state. If the compliance screening results in a hit, the status will transition to a `pending_approval` status. Note: there is also a scenario where the Beneficiary transitions directly into a `rejected` state, depending on the compliance score. zerohash’s compliance team will become alerted and will manually review the Beneficiary within 24 hours. If the determination after that review is that the Beneficiary should not have been flagged, the status will transition to `approved`. Otherwise, the status will transition to `rejected`.

### 

Beneficiary Rejection Scenario

In Cert, if the Platform would like to test a rejection scenario, please submit a Beneficiary like the following, passing an `id_number` equal to `111111111`:

JSON

```
{
    "first_name": "Lucas",
    "last_name": "Martinez",
    "email": "lmartinez+1@gmail.com",
    "address_one": "Calle San Martín 305",
    "address_two": "305",
    "city": "Buenos Aires",
    "zip": "C1000",
    "jurisdiction_code": "AR-X",
    "citizenship_code": "AR",
    "date_of_birth": "1985-09-02",
    "id_number_type": "ssn",
    "id_number": "111111111",
    "employment_status": "part_time", 
    "industry": "consulting",  
    "source_of_funds": "salary", 
    "signed_agreements": [
    {
        "type": "payment_services_terms",
        "region": "us",
        "signed_timestamp": 1726005278070
    }
]
}
```

### 

Beneficiary Pending Approval Scenario

In Cert, if the Platform would like to test a rejection scenario, please submit a Beneficiary like the following, passing an `first_name` equal to `Joseph` and `last_name` equal to `Kony`

JSON

```
{
    "first_name": "Joseph",
    "last_name": "Kony",
    "email": "lmartinez+1@gmail.com",
    "address_one": "Calle San Martín 305",
    "address_two": "305",
    "city": "Buenos Aires",
    "zip": "C1000",
    "jurisdiction_code": "AR-X",
    "citizenship_code": "AR",
    "date_of_birth": "1985-09-02",
    "id_number_type": "non_us_passport",
    "id_number": "A12345678",
    "employment_status": "part_time", 
    "industry": "consulting",  
    "source_of_funds": "salary", 
    "signed_agreements": [
    {
        "type": "payment_services_terms",
        "region": "us",
        "signed_timestamp": 1726005278070
    }
]
}
```

## 

5\. Query Beneficiary

Platforms can query already-submitted Beneficiaries via the [GET /participants](https://docs.zerohash.com/reference/get_participants) endpoint. A common query parameter is the `participant_code`, however the full list can be found on the [API reference](https://docs.zerohash.com/reference/get_participants).

`GET /participants/?participant_code=BENEF1` response:

JSON

```
{
    "message": [
        {
            "participant_code": "BENEF1",
            "participant_name": "Lucas Martinez",
            "email": "lmartinez+2@gmail.com",
            "status": "approved",
            "reason_code": null,
            "country": "Argentina",
            "state": "X",
            "jurisdiction_code": "AR-X",
            "updated_at": 1728607508503,
            "lifetime_remaining_limit": "0",
            "daily_remaining_limit": "0",
            "limit_currency": "USD",
            "limits": []
        }
    ],
    "page": 1,
    "page_size": 200,
    "total_pages": 1,
    "count": 1
}
```

## 

6\. Connect External Account

The Platform will connect the Beneficiary to an external account via [POST /payments/external\_accounts](https://docs.zerohash.com/reference/post_payments-external-accounts):

JSON

```
{
	"participant_code": "BENEF1",
	"type": "fiat", // enum: crypto, fiat
	"details": {
		"network": "transferencias30",
		"supported_assets": ["ARS"],
		"account_number": "1234567890" <-- cbu accountn number associated with the Argentinian
	}
}
```

[POST /payments/external\_accounts](https://docs.zerohash.com/reference/post_payments-external-accounts) response:

JSON

```
{
    "request_id": "a9e2c6fb-f738-4ecb-986c-befd70678707",
    "external_account_id": "107e8a2a-c835-4b76-b49d-a633d45727b9",
    "participant_code": "BENEF1",
    "platform_code": "PLAT01",
    "account_nickname": "",
    "created_at": "2024-10-11T00:52:21.865Z",
    "status": "pending",
    "type": "fiat",
  	"details": {
	  	"network": "transferencias30",
	  	"supported_assets": ["ARS"],
	  	"account_number": "1234567890"
	}
    }
}
```

### 

Create External Account Rejection Scenarios

| Scenario | Response |
| --- | --- |
| Beneficiary is not in an `approved` status | "participant is not approved" |
| Beneficiary `participant_code` does not exist | "participant {participant\_code} not found" |
| Invalid `supported_assets` and/or `network`. The `supported_asset.name`/`network` combination results in a supported Payout asset. | "{supported\_assets.network} is not supported" |

Note: Each Beneficiary can have a maximum of 100 external accounts

## 

7\. Query External Accounts

Platforms can view all previously-connected external accounts via [GET /payments/external\_accounts](https://docs.zerohash.com/reference/get_payments-external-accounts) (shown initially in a `pending` status below):

JSON

```
{
    "request_id": "4be99510-95b8-44f4-add2-ca8f943f9449",
    "message": [
        {
            "external_account_id": "2cc93b20-ee43-4877-8cdc-863e61829015",
            "account_nickname": "",
            "participant_code": "BENEF1",
            "platform_code": "PLAT01",
            "type":"crypto",
          	"details": {
	          	"network": "transferencias30",
	          	"supported_assets": ["ARS"],
	          	"account_number": "1234567890"
	}
},
            "created_at": "2024-08-15T22:39:24.171Z",
            "updated_at": "2024-08-15T22:39:24.171Z",
            "status_reason": "",
            "external_account_status": "pending"
            ]
        },
```

### 

External Account State Logic

The external account will initially enter a status of `pending`. Immediately and automatically after an external account submission, zerohash will run the bank accounts through various checks. If the checks pass, the external account will enter a state of `approved`. Else, `rejected`.

### 

External Account Webhook Examples

`pending` example:

JSON

```
{
    "account_nickname": "",
    "external_account_id": "2cc93b20-ee43-4877-8cdc-863e61829015",
    "external_account_status": "pending",
    "participant_code": "BENEF1",
    "timestamp": 1727364785998
}
```

`approved` example:

JSON

```
{
    "account_nickname": "",
    "external_account_id": "2cc93b20-ee43-4877-8cdc-863e61829015",
    "external_account_status": "approved",
    "participant_code": "BENEF1",
    "timestamp": 1727364785998
}
```

`rejected` example:

JSON

```
{
    "account_nickname": "",
    "external_account_id": "2cc93b20-ee43-4877-8cdc-863e61829015",
    "external_account_status": "rejected",
    "participant_code": "BENEF1",
    "timestamp": 1727364785998
}
```

## 

8\. Get FX Quote

The Platform will get an FX quote from zerohash to show to the Beneficiary using the [POST /payments/rfq](https://docs.zerohash.com/reference/post_payments-rfq) endpoint:

JSON

```
{
  "participant_code": "BENEF1",
  "quoted_currency": "USD",
  "underlying_currency": "ARS",
  "side": "buy",
  "total": "125", 
}
```

NOTE: The Platform does not have to specify the blockchain network being used in the middle of the Payout - we abstract this away, selecting the most efficient network at the time of the quote:

zerohash will respond:

JSON

```
{
  "message": {
    "request_id": "0f68333e-2114-469d-b505-c850d776e063",
    "participant_code": "BENEF1",
    "underlying_currency": "ARS",
    "quoted_currency": "USD",
    "side": "buy",
    "quantity": "125",
    "price": "1070.995",
    "quote_id": "cffcafdb-8275-4cf0-d7a2-83a6a216d906",
    "expire_ts": 1710358723796,
    "account_group": "ABC123",
    "account_label": "general",
    "obo_participant": {
      "participant_code": "BENEF1",
      "account_group": "PAYOR1",
      "account_label": "general"
    },
    "blockchain_network": "USDC.POLYGON",
    "quote_notional": "133874",
    "disclosed_spread": "1.88", <-- the spread that the Platform and Zero Hash collectively collect 
    "disclosed_spread_rate": "1.5"  <-- the spread rate (in basis points) that the Platform and Zero Hash collectively decide to charge 
  }
}
```

## 

9\. Execute FX quote

The Platform will execute the quote via the [POST /payments/execute](https://docs.zerohash.com/reference/post_payments-execute) endpoint:

JSON

```
{
"quote_id": "cffcafdb-8275-4cf0-d7a2-83a6a216d906"
}
```

Response example:

JSON

```
{
  "request_id": "0f68333e-2114-469d-b505-c850d776e063",
  "transaction_id": "0f68333e-2114-469d-b505-c850d776e063", <-- Zero Hash-generated UUID
  "status": "pending"
}
```

> 🚧
> 
> ### 
> 
> zerohash will not initially return back the blockchain hash on the POST /payments/execute response, but it will be included in all future webhook messages associated with this payment.

Here are the next steps and associated statuses that will ensue:

- `submitted` - the Payout has been started (1st status)
- `posted` - the Payout has been converted to fiat and successfully broadcasted on-chain
- `crypto_settled` - the Payout's crypto leg has been settled on-chain
- `fiat_settled` - the Payout's crypto-leg has been converted to the local fiat currency and final fiat leg has been delivered to the Beneficiary's bank account

## 

10\. Query Payouts

The Platform can view **all Payouts** via [GET /payments](https://docs.zerohash.com/reference/get_payments) (shown initially in a submitted status below):

JSON

```
{
  "message": [
    {
      "payment_id": "0f68333e-2114-469d-b505-c850d776e061",
      "obo_participant": {
         "participant_code": "PAYOR1",
         "account_group": "PLAT01",
         "account_label": "general"
      },      
      "payment_details": {
         	"withdrawal_id": "",
	        "trade_id": "",
	        "on_chain_transaction_id ": "",
          "network_fee_notional": "",
          "network_fee_quantity": "",
      }
      "asset": "ARS",
      "network": "transferencias30",
      "payment_type":"payout",
      "external_account_id": "2cc93b20-ee43-4877-8cdc-863e61829015"
      "participant_code": "BENEF1",
      "amount": "133874",
      "status": "submitted",
      "failure_reason": "",
      "created_at": "2024-08-19T23:15:30.000Z",
      "updated_at": "2024-08-19T23:15:35.000Z"
    }
  ]
}
```

Platforms can also query an individual Payout via the `GET /payments/id` endpoint.

### 

Payouts Webhook Examples

`submitted` example:

JSON

```
{
   "payment_id":"0f68333e-2114-469d-b505-c850d776e061",
   "obo_participant":{
      "participant_code":"PAYOR1",
      "account_group":"PLAT01",
      "account_label":"general"
   },
   "payment_details":{
      "withdrawal_request_id":"",
      "trade_id":"b752503c-1c42-4dfe-ad1d-7b39da5db59c",
      "on_chain_transaction_id":"",
      "network_fee_notional":"",
      "network_fee_quantity":"",
      "destination_address":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
   },
   "asset":"ARS",
   "network":"transferencias30",
   "payment_type":"payout",
   "external_account_id":"2cc93b20-ee43-4877-8cdc-863e61829015",
   "participant_code":"BENEF1",
   "quantity": "",
   "status":"submitted",
   "created_at":"2024-09-26T13:05:22.657Z",
   "updated_at":"2024-09-26T13:05:22.657Z",
   "total": "133874""
}
```

`posted` example:

JSON

```
{
   "payment_id":"0f68333e-2114-469d-b505-c850d776e061",
   "obo_participant":{
      "participant_code":"PAYOR1",
      "account_group":"PLAT01",
      "account_label":"general"
   },
   "payment_details":{
      "withdrawal_request_id":"14f8ebb8-7530-4aa4-bef9-9d73d56313f3",
      "trade_id":"b752503c-1c42-4dfe-ad1d-7b39da5db59c",
      "on_chain_transaction_id":"FLaUcxdNxRwnaSXp6pXeRSfANXEHouqYbqF6X1bgRxg2",
      "network_fee_notional":".01",
      "network_fee_quantity":".001",
      "destination_address":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
   },
   "asset":"USDC",
   "network":"SOL",
   "payment_type":"payout",
   "external_account_id":"2cc93b20-ee43-4877-8cdc-863e61829015",
   "participant_code":"BENEF1",
   "quantity":"",
   "status":"posted",
   "created_at":"2024-09-26T13:05:22.657Z",
   "updated_at":"2024-09-26T13:05:22.657Z",
   "total":"125.50"
}  
```

`crypto_settled` example:

JSON

```
{
   "payment_id":"0f68333e-2114-469d-b505-c850d776e061",
   "obo_participant":{
      "participant_code":"PAYOR1",
      "account_group":"PLAT01",
      "account_label":"general"
   },
   "payment_details":{
      "withdrawal_request_id":"14f8ebb8-7530-4aa4-bef9-9d73d56313f3",
      "trade_id":"b752503c-1c42-4dfe-ad1d-7b39da5db59c",
      "on_chain_transaction_id":"FLaUcxdNxRwnaSXp6pXeRSfANXEHouqYbqF6X1bgRxg2",
      "network_fee_notional":".01",
      "network_fee_quantity":".001",
      "destination_address":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
   },
   "asset":"USDC",
   "network":"SOL",
   "payment_type":"payout",
   "external_account_id":"2cc93b20-ee43-4877-8cdc-863e61829015",
   "participant_code":"BENEF1",
   "quantity":"",
   "status":"settled",
   "created_at":"2024-09-26T13:05:22.657Z",
   "updated_at":"2024-09-26T13:05:22.657Z",
   "total": "133874"
}    
```

`fiat_settled` example:

JSON

```
{
   "payment_id":"0f68333e-2114-469d-b505-c850d776e061",
   "obo_participant":{
      "participant_code":"PAYOR1",
      "account_group":"PLAT01",
      "account_label":"general"
   },
   "payment_details":{
      "withdrawal_request_id":"14f8ebb8-7530-4aa4-bef9-9d73d56313f3",
      "trade_id":"b752503c-1c42-4dfe-ad1d-7b39da5db59c",
      "on_chain_transaction_id":"FLaUcxdNxRwnaSXp6pXeRSfANXEHouqYbqF6X1bgRxg2",
      "network_fee_notional":".01",
      "network_fee_quantity":".001",
      "destination_address":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
   },
   "asset":"USDC",
   "network":"SOL",
   "payment_type":"payout",
   "external_account_id":"2cc93b20-ee43-4877-8cdc-863e61829015",
   "participant_code":"BENEF1",
   "quantity":"",
   "status":"failed",
   "created_at":"2024-09-26T13:05:22.657Z",
   "updated_at":"2024-09-26T13:05:22.657Z",
   "total": "133874"
}   
```

## 

11\. Network Fee Procedure

The Platform or zerohash will pay for the network fee associated with any Payouts. If the Platform is paying, there are 2 options:

1. Fund the network fee [account](https://docs.zerohash.com/docs/what-is-an-account). Account details:

- Participant\_code: PLAT01 (the Platform's participant\_code)
- Account\_group: PLAT01
- Account\_label: network\_fee
- Asset: USD

All network fees will paid out of this account in real-time

2. Don’t fund the network fee account. This account will build up a payable balance

zerohash will add the amount of the receivable balance on this account to the end of month invoice, coupling it with the Payout usage activity amount due.

## 

12\. Email Receipt Requirements

zerohash requires that the Payor receives an email receipt for each Payout. We also insist that the email contain

1. Certain fields and values, which can be obtained using our API
2. Adequate support contact information

### 

Fields

Here are the required field names and their associated API fields:

| Email Receipt Field Name | Description | Example | API Location |
| --- | --- | --- | --- |
| Order Number | Unique order identifier | 9a738372-0855-4b25-8c65-5de0aa858b8b | `payment_id` from [GET /payments](https://docs.zerohash.com/reference/get_payments) or [POST /payments](https://docs.zerohash.com/reference/post_payments) response |
| Order Type | The type of order | Payout Transmission<br>(must present this value verbatim) | N/a, can hard-code to "Payout Transmission" |
| Transmission Amount | The transmission amount for the Payout, in quoted currency terms | $125 | `total` [GET /payments](https://docs.zerohash.com/reference/get_payments) or [POST /payments](https://docs.zerohash.com/reference/post_payments) response |
| Amount Received by Beneficiary | The amount of the underlying Payout received by the Beneficiary | 133,874 ARS | `total` [GET /payments](https://docs.zerohash.com/reference/get_payments) or [POST /payments](https://docs.zerohash.com/reference/post_payments) response |
| Fees | Any added fee values included in the Payout. If there are no fees, then this needs to be expressly stated.<br>This includes processing fees (ie, a fee assessed by the Platform to the Payor) **or** blockchain network fees. | "$0", "1.99", "$0 Fees", or "No Fees" | \- Payouts does not currently support processing fees<br>\- If the Payor is incurring the network fee, take `network_fee_notional` from [\[GET /payments\]](https://docs.zerohash.com/reference/get_payments). If not, no need to include it in the receipt |
| Date/Time | Date and timestamp of the Payout's transmission (meaning the time that the fiat was converted and settled into USDC within the zerohash system) | 2024-10-11 18:38:00 | `created_at` from [GET /payments](https://docs.zerohash.com/reference/get_payments) or [POST /payments](https://docs.zerohash.com/reference/post_payments) response |
| Account ID | zerohash’s unique account identifier for the Payor ( the “participant code” within zerohash). | BENEF1 | `participant_code` from [GET /payments](https://docs.zerohash.com/reference/get_payments) or [POST /payments](https://docs.zerohash.com/reference/post_payments) response |

### 

Support Information

| Field | Value (examples) |
| --- | --- |
| Platform Contact Email | [support@paymentcompanyname.com](mailto:support@paymentcompanyname.com) |
| Platform Phone | (123) 123-1234 |
| Platform Address | 123 Main Street<br>New York, NY 10014 |
| Platform Support Contact Email (if different from above) | [paymentcompanyname@zerohash.com](mailto:paymentcompanyname@zerohash.com) - this is an email that is used to contact zerohash directly |
| zerohash Contact Information | Zero Hash LLC (NMLS ID 1699379)<br>327 N Aberdeen St<br>Chicago, IL 60607<br>855-744-7333<br>[support@zerohash.com](mailto:support@zerohash.com)<br>[www.zerohash.com](http://www.zerohash.com)<br>This value should be included in the email verbatim |

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page