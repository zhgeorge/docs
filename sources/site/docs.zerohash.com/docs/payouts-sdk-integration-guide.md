# Source: https://docs.zerohash.com/docs/payouts-sdk-integration-guide

> 📘
> 
> ### 
> 
> This feature is available in SDK version v2.10.9 and later.

## 

Introduction

The Payouts SDK product allows marketplaces, payment service providers, employer of record platforms, and more to offer stablecoins or crypto as a payout option.

![](https://files.readme.io/22d5e9791c6168852a9945f7f94dd21e1b340afc98062180178c334615596a30-rtest11.png)

## 

Definitions

| Term | Definition |
| --- | --- |
| Payout | The conversion of fiat to stablecoin and an automatic on-chain transfer to a destination address. |
| Platform | The company that's in contract with zerohash and directly interacts with zerohash's API's or SDK's. |
| Payor | An optional participant in the flow. If omitted, the Platform will take the role of the Payor.<br>A non-natural person (typically a business) that is a customer of the Platform. This is the core front-end that the Beneficiary interacts with. |
| Beneficiary | The natural person that receives the stablecoin payout. |

## 

High Level Flow

1. Submit Payor
2. Query Payor
3. Fund Float Account
4. Submit Beneficiary
5. Query Beneficiary
6. Connect External Account
7. Initiate Payout
8. Query Payouts
9. Network Fee Procedures
10. Email Receipt Requirements

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
    "submitter_first_name": "Josh",  // new addition to these specs 11.6.24 (to be a required field in the future)
    "submitter_last_name": "Doe",  // new addition to these specs 11.6.24 (to be a required field in the future)
    "submitter_title": "Senior Legal Council", // new addition to these specs 11.6.24 (to be a required field in the future)
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

Your Payor **will not** become `approved` unless you also supply the proper documents via [POST /participants/entity/documents](https://docs.zerohash.com/reference/post_participants-entity-documents) endpoint. Depending on the `entity_type` that was used in the original [POST /participants/entity/new](https://docs.zerohash.com/reference/post_participants-entity-new) call, the document requirements vary. See details [here](https://docs.zerohash.com/reference/post_participants-entity-new).

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

NOTE:

- Even in Cert, zerohash will run each submitted Beneficiary through our Sanction Checks, subjecting the Beneficiaries to real validations. This means that if your entry is an actual sanctioned individual, the Beneficiary will be sent to a `rejected` status. Another way to test the `rejected` scenario is to enter an SSN of "111111111". If you'd like to test an `approved` scenario - ensure you as close-to-reality sample as possible.
- zerohash requires that the `jurisdiction_code` is not null and contains both a Country (ie, Brazil "BR") and a Subdivision (ie, Sao Palo "SP") to form BR-SP, for example. If your systems don't contain the subdivision and you only collect Country and Postal Code, we recommend performing a mapping on your side to derive the correct Subdivision, using the Country and Postal code as inputs. See this [step-by-step guide](https://docs.zerohash.com/docs/iso-3166-subdivision-conversions) on how to use an external API (ie, Google Geocoding API) to make a conversion between your data structure, to ours.
- The API will allow for either a `tax_id` or (`id_number` and `id_number_type`). So, US persons with an SSN for example, can submit their SSN without additionally needing to undergo ID verification

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

**This is the first step where the Platform will invoke an SDK UI**

### 

6a. Account Link SDK - Request Access Token

The Platform should [request a client access token](https://docs.zerohash.com/reference-link/post_client-auth-token) specifying:

| Field | Description | Example Value | Required? |
| --- | --- | --- | --- |
| `participant_code` | The 6-digit alpha numeric code associated with the Customer that is looking to withdraw (the response of the original [POST /participants/customers/new](https://docs.zerohash.com/reference/post_participants-customers-new) call) | CUST01 | Y |
| `permissions` | The array of permissions that will be granted to the returned JWT token | `["crypto-acccount-link"]` | Y |

Example `POST /client_auth_token` request:

JSON

```
 {
    "participant_code": "CUST01",
    "permissions": ["crypto-account-link"]
}
```

After a successful `POST /client_auth_token` call, the next step is to start the `Account Link SDK` flow, see the example below for doing it in a `React` application. Keep in mind that if you're using a _Native Mobile App_ (Swift, Flutter, etc) instead of using `zh-web-sdk` you should follow the `WebView` approach, described [here](https://docs.zerohash.com/reference/sdk-integration-with-mobile-apps)

TypeScript

```
import React from 'react';
import ZeroHashSDK, { AppIdentifier } from 'zh-web-sdk';

const App = () => {
  const sdk = new ZeroHashSDK({
    zeroHashAppsURL: "https://web-sdk.cert.zerohash.com",
    cryptoAccountLinkPayoutsJWT: "<JWT_TOKEN_HERE>" 
  });

    sdk.openModal({
    appIdentifier: AppIdentifier.CRYPTO_ACCOUNT_LINK_PAYOUTS, 
  })
  return <></>;
}

export default App;
```

### 

6b. Account Link SDK - Link Account

At this point, the Customer is interacting with the front end SDK. The Customer will ultimately link their account.

Once the Customer successfully creates an Account we'll send a `postMessage` event with type `CRYPTO_ACCOUNT_LINK_EXTERNAL_ACCOUNT_CREATED`. The purpose of this event is to inform the Platform's Front end that the Customer's `external_account` was created and the Platform's FE can fetch that information from the [GET /payments/external\_accounts](https://docs.zerohash.com/reference/get_payments-external-accounts) endpoint. Usually this will happen with the purpose of displaying these accounts on the screen for the Customer to choose from

Here is an example of how a `React` application could consume the `CRYPTO_ACCOUNT_LINK_EXTERNAL_ACCOUNT_CREATED` `postMessage` event:

Javascript

```
 useEffect(() => {
    window.addEventListener('message', message => {
      if (message.data.type === 'CRYPTO_ACCOUNT_LINK_EXTERNAL_ACCOUNT_CREATED') {
        // A new external account for the end-user  was created, do stuff here
      }
    })
    return () => {
      window.removeEventListener('message', () => {})
    }
  }, [])
```

Once the account is successfully linked a Webhook Event will be sent, see more details on **Section 4**

### 

6c. Account Link SDK - Consume External Account Webhooks

> 📘
> 
> ### 
> 
> NOTE: Your Platform must be configured with a valid webhook URL in order to receive these webhooks. Please get in touch with a zerohash representative so that they can set this up for you. Also, your Platform will need to be specifically enabled to receive these webhooks (the zerohash rep will also make this configuration).

After the Customer successfully links an account on the SDK front end, the Platform can consume the [external account webhook events](https://docs.zerohash.com/reference/external-account-status-updates).

**Note:** the `x-zh-hook-payload-type` is `external_account_status_changed` (more details on webhooks [here](https://docs.zerohash.com/reference/webhook-security))

#### 

Pending Status

All external accounts pass through the `pending` status, even for a brief second. Example webhook payload:

JSON

```
{
	"account_nickname": "johns-usdc-eth-wallet",
	"external_account_id": "c476a81f-a29f-4e22-88db-1f521d7cf004",
	"external_account_status": "pending",
	"participant_code": "CUST01",
	"timestamp": 1729195673718
}
```

#### 

Approved Status

Given zerohash performs validations on the front end, in theory 100% of the created external accounts will go into an `approved` status. Example webhook payload:

JSON

```
{
	"account_nickname": "johns-usdc-eth-wallet",
	"external_account_id": "c476a81f-a29f-4e22-88db-1f521d7cf004",
	"external_account_status": "approved",
	"participant_code": "CUST01",
	"timestamp": 1729195673719
}
```

#### 

Closed Status

Platforms have the ability to close already-created external accounts via the [POST /payments/external\_accounts/{external\_account\_id}/close](https://docs.zerohash.com/reference/post_payments-external-accounts-external-account-id-close) endpoint. This will also trigger a webhook event. Example payload:

JSON

```
{
	"account_nickname": "johns-usdc-eth-wallet",
	"external_account_id": "c476a81f-a29f-4e22-88db-1f521d7cf004",
	"external_account_status": "closed",
	"participant_code": "CUST01",
	"timestamp": 1729195673720
}
```

#### 

Locked Status

zerohash's Compliance and Transaction Monitoring team are constantly reviewing external accounts and participants associated with those accounts to ensure that regulations are being followed, bad actors are unable to transact, etc. If we manually intervene and are looking to block activity related to an external account, the team will place the account initially into a `locked` status while they perform further analysis on the account. Example webhook payload:

JSON

```
{
	"account_nickname": "johns-usdc-eth-wallet",
	"external_account_id": "c476a81f-a29f-4e22-88db-1f521d7cf004",
	"external_account_status": "locked",
	"participant_code": "CUST01",
	"timestamp": 1729195673721
}
```

#### 

Disabled Status

Once zerohash's Compliance and Transaction Monitoring team have conducted its analysis, it's possible that the external account will be closed. The external account status will then reflect this. Example webhook payload:

JSON

```
{
	"account_nickname": "johns-usdc-eth-wallet",
	"external_account_id": "c476a81f-a29f-4e22-88db-1f521d7cf004",
	"external_account_status": "closed",
	"participant_code": "CUST01",
	"timestamp": 1729195673722
}
```

### 

6d Account Link SDK - Query External Accounts

The Platform can also query the [GET /payments/external\_accounts](https://docs.zerohash.com/reference/get_payments-external-accounts) to view information about the linked account. Example response:

JSON

```
{
    "request_id": "53fb4efd-bf98-4a48-8d89-11097983793e",
    "message": [
        {
            "external_account_id": "c476a81f-a29f-4e22-88db-1f521d7cf004",
            "account_nickname": "",
            "participant_code": "CUST01",
            "platform_code": "PLAT01",
            "created_at": "2024-10-26T01:11:49.077Z",
            "updated_at": "2024-10-26T01:11:49.149Z",
            "status": "approved",
            "status_reason": "",
            "type": "crypto",
            "details": {
                "network": "ETH",
                "supported_assets": [
                    "USDC"
                ],
                "address": "0xa6b0Cd1baaa15AE97D8135f0E87F61af27c6cB89",
                "destination_tag": ""
            }
        },
```

## 

7\. Initiate Payout

### 

7a. Payouts SDK - Request Access Token

Now that the external account has been created, the Platform can use the Crypto Withdraw SDK. The next step is to [request a client access token](https://docs.zerohash.com/reference-link/post_client-auth-token) specifying:

| Field | Description | Example Value | Required? |
| --- | --- | --- | --- |
| `participant_code` | The 6-digit alpha numeric code associated with the Customer that is looking to withdraw (the response of the original [POST /participants/customers/new](https://docs.zerohash.com/reference/post_participants-customers-new) call) | CUST01 | Y |
| `permissions` | The array of permissions that will be granted to the returned JWT token | `["crypto-payouts"]` | Y |
| `external_account_id` | The UUID associated with the [external account](https://docs.zerohash.com/reference/get_payments-external-accounts) | 0f68333e-2114-469d-b505-c850d776e063 | Y |
| `quoted_asset` | The fiat currency being used to fund the trade | USD | Y |
| `withdrawal_request_amount` | The amount, in `quoted_asset` terms, to be withdrawn | 200 | Y |
| `reference_id` | Platform reference id for a specific transaction | 0bd7f7f0-cf26-495f-b2df-e8afe8481ba3 | N |

Example `POST /client_auth_token` request:

JSON

```
 {
    "participant_code": "CUST01",
    "permissions": ["crypto-payouts"],
    "withdrawal_details": {
        "external_account_id": "c476a81f-a29f-4e22-88db-1f521d7cf004",
        "quoted_asset": "USD",   
        "withdrawal_request_amount": "200"
    },
   "reference_id": "0bd7f7f0-cf26-495f-b2df-e8afe8481ba3"
}
```

#### 

Starting the Withdrawal flow

After a successful `POST /client_auth_token` call, the next step is to start the `Withdrawal SDK` flow, see the example below for doing it in a `React` application. Keep in mind that if you're using a _Native Mobile App_ (Swift, Flutter, etc) instead of using `zh-web-sdk` you should follow the `WebView` approach, described [here](https://docs.zerohash.com/reference/sdk-integration-with-mobile-apps)

> 📘
> 
> ### 
> 
> You can see the full integration guide for Withdrawals on the link below
> 
> [https://docs.zerohash.com/reference/sdk-modules-crypto-withdrawals](https://docs.zerohash.com/reference/sdk-modules-crypto-withdrawals)

TypeScript

```
import React from 'react';
import ZeroHashSDK, { AppIdentifier } from 'zh-web-sdk';

const App = () => {
  const sdk = new ZeroHashSDK({
    zeroHashAppsURL: "https://web-sdk.cert.zerohash.com",
    payoutsJWT: "<JWT_TOKEN_HERE>" 
  });

    sdk.openModal({
    appIdentifier: AppIdentifier.PAYOUTS,
  })
  return <></>;
}

export default App;
```

The Customer will be shown the Withdrawal screen with a pre-populated withdrawal request, highlighting the following data points:

| Data Point | Description | Example |
| --- | --- | --- |
| Transfer Request Amount | The amount of `quoted_asset` they want to transfer | 200 |
| Destination Wallet | The wallet nickname and address of where the Payout is going to | John's USDC on Ethereum Wallet (\*\*cB89) |
| Withdrawal Fee | The transaction fee being assessed on the withdrawal | 1.50 |
| Network Fee | The blockchain-assessed network fee on the withdrawal, in `quoted_asset` terms | 1.25 |
| Withdrawal Receive Amount | The amount of the stablecoin or crypto asset that the user will be receiving | 197.25 |

### 

7b. Payouts SDK - Initiate Payout

At this point, the Customer is interacting with the front end SDK. The Customer will ultimately initiate the Payout.

### 

7c. Payouts SDK - Consume Payments Webhook

> 📘
> 
> ### 
> 
> NOTE: Your Platform must be configured with a valid webhook URL in order to receive these webhooks. Please get in touch with a zerohash representative so that they can set this up for you. Also, your Platform will need to be specifically enabled to receive these webhooks (the zerohash rep will also make this configuration).

After the Customer successfully initiates the payout via the SDK, the Platform should be prepared to consume the [payments webhook events](https://docs.zerohash.com/reference/payments-status-changes)

**Note:** the `x-zh-hook-payload-type` is `payment_status_changed` (more details on webhooks [here](https://docs.zerohash.com/reference/webhook-security))

#### 

Status Summary

The Payout will initially enter a status of `submitted`. From here, it's possible (yet rare) that zerohash has issues internally processing the transaction. If this happens, it will enter a terminal status of `failed`. When the transaction has been successfully broadcasted on-chain, it will enter a status of `posted`. A terminal status of `settled` is reached when the Withdrawal has been confirmed on-chain and received by the Customer.

#### 

Submitted Status

The Withdrawal will initially and briefly enter a status of `submitted`. Example payload:

JSON

```
   "payment_id":"0f68333e-2114-469d-b505-c850d776e061",
   "obo_participant":{
      "participant_code":"CUST01",
      "account_group":"PLAT01",
      "account_label":"general"
   },
   "payment_details":{
      "withdrawal_request_id":"",
      "trade_id":"b752503c-1c42-4dfe-ad1d-7b39da5db59c",
      "on_chain_transaction_id":"",
      "network_fee_notional":"",
      "network_fee_quantity":"",
      "withdrawal_fee_notional": "",
      "destination_address":"0xa6b0Cd1baaa15AE97D8135f0E87F61af27c6cB89"
   },
   "asset":"USDC",
   "network":"ETH",
   "payment_type":"withdrawal",
   "external_account_id":"c476a81f-a29f-4e22-88db-1f521d7cf004",
   "participant_code":"CUST01",
   "quantity":"",
   "status":"submitted",
   "created_at":"2024-09-26T13:05:22.657Z",
   "updated_at":"2024-09-26T13:05:22.657Z",
   "total":"200",
   "reference_id": "0bd7f7f0-cf26-495f-b2df-e8afe8481ba3"
}
```

#### 

Posted Status

The Payout will transition into a status of `posted`, which means that the asset has been **broadcasted on-chain**. Note the presence of the `on_chain_transaction_id` field, which represents the on-chain hash. Typically it's expected for this to be represented to the Customer on the Platform's "Transaction History" or equivalent page in order to allow the Customer to trace the transaction. Example payload:

JSON

```
{
   "payment_id":"0f68333e-2114-469d-b505-c850d776e061",
   "obo_participant":{
      "participant_code":"CUST01",
      "account_group":"PLAT01",
      "account_label":"general"
   },
   "payment_details":{
      "withdrawal_request_id":"14f8ebb8-7530-4aa4-bef9-9d73d56313f3",
      "trade_id":"b752503c-1c42-4dfe-ad1d-7b39da5db59c",
      "on_chain_transaction_id":"0x55dfac6137387a81e32fc353fca45eea3124cd42564a4112192323add8dee1da",
      "network_fee_notional":"1.25",
      "network_fee_quantity":".00032",
      "withdrawal_fee_notional": "1.50",
      "destination_address":"0xa6b0Cd1baaa15AE97D8135f0E87F61af27c6cB89"
   f
   "asset":"USDC",
   "network":"ETH",
   "payment_type":"withdrawal",
   "external_account_id":"c476a81f-a29f-4e22-88db-1f521d7cf004",
   "participant_code":"CUST01",
   "quantity":"197.25",
   "status":"posted",
   "created_at":"2024-09-26T13:05:22.657Z",
   "updated_at":"2024-09-26T13:05:22.657Z",
   "total":"200",
   "reference_id": "0bd7f7f0-cf26-495f-b2df-e8afe8481ba3"
}  
```

#### 

Settled Status

When the Payout transitions to a `settled` status, the transaction has been fully settled on-chain and the balance should be reflected on the Customer's destination exchange or wallet account. Example payload:

JSON

```
{
   "payment_id":"0f68333e-2114-469d-b505-c850d776e061",
   "obo_participant":{
      "participant_code":"CUST01",
      "account_group":"PLAT01",
      "account_label":"general"
   },
   "payment_details":{
      "withdrawal_request_id":"14f8ebb8-7530-4aa4-bef9-9d73d56313f3",
      "trade_id":"b752503c-1c42-4dfe-ad1d-7b39da5db59c",
      "on_chain_transaction_id":"0x55dfac6137387a81e32fc353fca45eea3124cd42564a4112192323add8dee1da",
      "network_fee_notional":"1.25",
      "network_fee_quantity":".00032",
      "withdrawal_fee_notional": "1.50",
      "destination_address":"0xa6b0Cd1baaa15AE97D8135f0E87F61af27c6cB89"
   },
   "asset":"USDC",
   "network":"ETH",
   "payment_type":"withdrawal",
   "external_account_id":"c476a81f-a29f-4e22-88db-1f521d7cf004",
   "participant_code":"CUST01",
   "quantity":"197.25",
   "status":"settled",
   "created_at":"2024-09-26T13:05:22.657Z",
   "updated_at":"2024-09-26T13:05:22.657Z",
   "total":"200",
   "reference_id": "0bd7f7f0-cf26-495f-b2df-e8afe8481ba3"
}  
```

#### 

Failed Status

In rare instances, the Payout may transition to a `failed` status. This could be due to either zerohash processing issues or issues with the blockchain itself. Example payload:

JSON

```
{
   "payment_id":"0f68333e-2114-469d-b505-c850d776e061",
   "obo_participant":{
      "participant_code":"CUST01",
      "account_group":"PLAT01",
      "account_label":"general"
   },
   "payment_details":{
      "withdrawal_request_id":"14f8ebb8-7530-4aa4-bef9-9d73d56313f3",
      "trade_id":"b752503c-1c42-4dfe-ad1d-7b39da5db59c",
      "on_chain_transaction_id":"0x55dfac6137387a81e32fc353fca45eea3124cd42564a4112192323add8dee1da",
      "network_fee_notional":"1.25",
      "network_fee_quantity":".00032",
      "withdrawal_fee_notional": "1.50",
      "destination_address":"0xa6b0Cd1baaa15AE97D8135f0E87F61af27c6cB89"
   },
   "asset":"USDC",
   "network":"ETH",
   "payment_type":"withdrawal",
   "external_account_id":"c476a81f-a29f-4e22-88db-1f521d7cf004",
   "participant_code":"CUST01",
   "quantity":"197.25",
   "status":"failed",
   "created_at":"2024-09-26T13:05:22.657Z",
   "updated_at":"2024-09-26T13:05:22.657Z",
   "total":"200",
   "reference_id": "0bd7f7f0-cf26-495f-b2df-e8afe8481ba3"
}  
```

### 

7d. Payouts SDK - Query Payments

The Platform can also query the [GET /payments](https://docs.zerohash.com/reference/get_payments) to view information about the Payout. Example response:

JSON

```
{
    "request_id": "a502a26d-3734-497e-826b-d8d5734221e7",
    "participant_code": "CUST01",
    "platform_code": "PLAT01",
    "obo_participant": {
        "participant_code": "CUST01",
        "account_group": "PLAT01",
        "account_label": "general"
    },
    "payment_id": "0f68333e-2114-469d-b505-c850d776e061",
    "asset": "USDC",
    "network": "ETH",
    "quoted_asset": "USD",
    "status": "submitted",
    "external_account_id": "c476a81f-a29f-4e22-88db-1f521d7cf004",
    "created_at": "2024-11-15T23:02:06.836Z",
    "total": "200",
    "reference_id": "0bd7f7f0-cf26-495f-b2df-e8afe8481ba3"
}
```

### 

8\. Complete End of Day (EOD) Settlement

After each session, the Platform will be required to top up their float account to its original level. This is referred to as a **Net Delivery Obligation (NDO)**. First, here are the standard settlement session and its schedules:

| Session | NDO Wire Due |
| --- | --- |
| Monday | By Tuesday EOD |
| Tuesday | By Wednesday EOD |
| Wednesday | By Thursday EOD |
| Thursday | By Friday EOD |
| Friday | By Monday EOD |

For Bank Holidays in the US, the NDO will be due during the next valid business day.

## 

9\. Network Fee Procedure

The Platform will be paying for the network fee associated with any Payouts. There are 2 options:

1. Fund the network fee [account](https://docs.zerohash.com/docs/what-is-an-account). Account details:

- Participant\_code: PLAT01 (the Platform's participant\_code)
- Account\_group: PLAT01
- Account\_label: network\_fee
- Asset: USD

All network fees will paid out of this account in real-time

2. Don’t fund the network fee account. This account will build up a payable balance

zerohash will add the amount of the receivable balance on this account to the end of month invoice, coupling it with the Payout usage activity amount due.

## 

10\. Email Receipt Requirements

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
| Transmission Amount | The transmission amount for the Payout, in quoted currency terms | $10 | `total` [GET /payments](https://docs.zerohash.com/reference/get_payments) or [POST /payments](https://docs.zerohash.com/reference/post_payments) response |
| Amount Received by Beneficiary | The amount of the underlying Payout received by the Beneficiary | 10 USDC | `total` [GET /payments](https://docs.zerohash.com/reference/get_payments) or [POST /payments](https://docs.zerohash.com/reference/post_payments) response |
| Fees | Any added fee values included in the Payout. If there are no fees, then this needs to be expressly stated.<br>This includes processing fees (ie, a fee assessed by the Platform to the Payor) **or** blockchain network fees. | "$0", "1.99", "$0 Fees", or "No Fees" | \- Payouts does not currently support processing fees<br>\- If the Payor is incurring the network fee, take `network_fee_notional` from [GET /payments](https://docs.zerohash.com/reference/get_payments). If not, no need to include it in the receipt |
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

Updated 20 days ago

---

Did this page help you?

Yes

No

Copy Page