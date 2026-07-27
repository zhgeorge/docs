# Source: https://docs.zerohash.com/docs/wallet-link-sdk-integration-guide

![Account Link SDK](https://files.readme.io/2ca0a22aea584e7a18bd3d6365f2819da355dba63d685c9ff07e1c06788accbb-a_123444_processed.png)

Account Link SDK

![Withdraw SDK](https://files.readme.io/4f752c3a895a07ca478f7a11ab70a4279ad42f16107de64c1d0cfcb49620d54c-Withdraw_SDK_No_Background.png)

Withdraw SDK

## 

General

> 📘
> 
> ### 
> 
> Please note that for Web usage you must install zh-web-sdk v2.10.6 or higher

The [Account Link SDK](https://docs.zerohash.com/reference/sdk-modules-crypto-account-link) is an embeddable widget that allows End Customers to link an external wallet. On the SDK front end, the Customer will select/enter the following:

- Asset (ie, USDC)
- Network (ie, Ethereum or Solana)
- Address
- Wallet Nickname

The [Crypto Withdraw SDK](https://docs.zerohash.com/reference/sdk-modules-crypto-withdrawals) is also an embeddable widget that allows End Customers to trigger the withdrawal to their linked crypto wallet.

## 

Account Link Front End Validations

Each account link attempt is validated, by zerohash on the front end, in the following ways:

- The Customer-entered address must be valid according to the Asset and Network they entered. For example, a Bitcoin address would not be allowed to be linked if the Asset entered was USDC
- The Customer-entered address must pass our compliance checks. For example, if the address is flagged as OFAC-sanctioned, the link request would be rejected

## 

JWT Token Expiration

- The Withdraw SDK JWT token expires **5 minutes** after it's generated
- The Account Funding SDK JWT expires **1 hour** after it's generated

## 

Example

The high-level flow is the following:

1. Fund Float Account
2. Account Link SDK - Request Access Token
3. Account Link SDK - Link Account
4. Account Link SDK - Consume External Account Webhook OR Frontend Event
5. Account Link SDK - Query External Accounts
6. Crypto Withdraw SDK - Request Access Token
7. Crypto Withdraw SDK - Initiate Withdrawal
8. Crypto Withdraw SDK - Consume Payments Webhook
9. Crypto Withdraw SDK - Query Payments
10. Complete EOD Settlement

### 

Context for this Example

From a use case perspective, we'll assume the Platform is a Prediction Market which allows their End Customer to fund their account using USDC, using the [Account Funding](https://docs.zerohash.com/docs/fund-overview) product. After End Customers win their bet or otherwise wish to take funds off the platform to another location, the Prediction Market also allows End Customers to withdraw their funds in the form of USDC, leveraging the Account Link and Crypto Withdraw SDK.

For Fund, from a technical Setup perspective, we'll assume that the Platform is under the [Onboarding API + Fund SDK](https://docs.zerohash.com/docs/fund-integration-guide-sdk) setup.

The Customer `participant_code` will be CUST01 and the Platform's is PLAT01.

### 

1\. Fund Float Account

The first step is for the Platform to fund its fiat (ie, USD) float account. This will be used to fund subsequent withdrawal requests, since technically each withdrawal request will result in a purchase of the withdrawal asset followed by an immediate withdrawal. Here are the [account](https://docs.zerohash.com/docs/what-is-an-account) details:

- Participant\_code: 00SCXM
- Account\_group: PLAT01
- Account\_label: general
- Account\_type: available
- Asset: \[fiat currency\] (ie, USD)

> 📘
> 
> ### 
> 
> After each trade session, the Platform will be required to "top up" their float account for the amount that was cumulatively withdrawn. See section 10. Complete EOD Settlement for details.

### 

2\. Account Link SDK - Request Access Token

The Platform should [request an access token](https://docs.zerohash.com/reference/post_client-auth-token) specifying:

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

After a successful `POST /client_auth_token` call, the next step is to start the `Account Link SDK` flow, see the example below for doing it in a `React` application. Keep in mind that if you're using a _Native Mobile App_ (Swift, Flutter, etc) instead of using `zh-web-sdk` you should follow the `WebView` approach, described [here.](https://docs.zerohash.com/reference/sdk-integration-with-mobile-apps)

TypeScript

```
import React from 'react';
import ZeroHashSDK, { AppIdentifier } from 'zh-web-sdk';

const App = () => {
  const sdk = new ZeroHashSDK({
    zeroHashAppsURL: "https://web-sdk.cert.zerohash.com",
    cryptoAccountLinkJWT: "<JWT_TOKEN_HERE>" 
  });

    sdk.openModal({
    appIdentifier: AppIdentifier.CRYPTO_ACCOUNT_LINK, // "crypto-account-link"
  })
  return <></>;
}

export default App;
```

### 

3\. Account Link SDK - Link Account

At this point, the End Customer is interacting with the frontend SDK. The End Customer will ultimately link their account.

Once the End Customer successfully creates an Account we'll send a `postMessage` event with type `CRYPTO_ACCOUNT_LINK_EXTERNAL_ACCOUNT_CREATED`. This event informs the Platform's frontend that the End Customer's `external_account` has been created, signaling the Platform to fetch that information from the [GET /payments/external\_accounts](https://docs.zerohash.com/reference/get_payments-external-accounts) endpoint.

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

Once the account is successfully linked a webhook will be sent, see more details on **Section 4**

### 

4\. Account Link SDK - Consume External Account Webhooks

> 📘
> 
> ### 
> 
> Platform must be configured with a valid webhook URL in order to receive these webhooks. Please get in touch with a zerohash representative so that they can set this up for you. Your Platform will need to be specifically configured to receive these webhooks.

After the End Customer successfully links an account on the SDK frontend, the Platform can consume webhooks related to that [external account](https://docs.zerohash.com/reference/external-account-status-updates).

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

Example webhook payload:

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

Platforms have the ability to close or remove an external accounts via the [POST /payments/external\_accounts/{external\_account\_id}/close](https://docs.zerohash.com/reference/post_payments-external-accounts-external-account-id-close) endpoint. This will also trigger a webhook event. Example payload:

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

zerohash's Compliance and Transaction Monitoring team are constantly reviewing external accounts and participants associated with those accounts to ensure that regulations are being followed, bad actors are unable to transact, etc. If we intervene to block activity related to a linked external account, the team will place the account into a `locked` status while they perform further analysis on that account. Example webhook payload:

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

Once zerohash's Compliance and Transaction Monitoring team have conducted its analysis, it's possible that the external account will be closed, and the status will then reflect this. Example webhook payload:

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

5\. Account Link SDK - Query External Accounts

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

### 

6\. Crypto Withdraw SDK - Request Access Token

Once an external account has been linked successfully, the Platform can use the Crypto Withdraw SDK. The Platform should [request an access token](https://docs.zerohash.com/reference/post_client-auth-token) specifying:

| Field | Description | Example Value | Required? |
| --- | --- | --- | --- |
| `participant_code` | The 6-digit alpha numeric code associated with the Customer that is looking to withdraw (the response of the original [POST /participants/customers/new](https://docs.zerohash.com/reference/post_participants-customers-new) call) | CUST01 | Y |
| `permissions` | The array of permissions that will be granted to the returned JWT token | `["crypto-withdrawals"]` | Y |
| `external_account_id` | The UUID associated with the [external account](https://docs.zerohash.com/reference/get_payments-external-accounts) | 0f68333e-2114-469d-b505-c850d776e063 | Y |
| `quoted_asset` | The fiat currency being used to fund the trade | USD | Y |
| `withdrawal_request_amount` | The amount, in `quoted_asset` terms, to be withdrawn | 200 | Y |
| `reference_id` | Platform reference id for a specific transaction | 0bd7f7f0-cf26-495f-b2df-e8afe8481ba3 | N |

Example `POST /client_auth_token` request:

JSON

```
 {
    "participant_code": "CUST01",
    "permissions": ["crypto-withdrawals"],
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

After a successful `POST /client_auth_token` call, the next step is to start the `Withdrawal SDK` flow, see the example below for doing it in a `React` application. Keep in mind that if you're using a _Native Mobile App_ (Swift, Flutter, etc) instead of using `zh-web-sdk` you should follow the `WebView` approach, described [here.](https://docs.zerohash.com/reference/sdk-integration-with-mobile-apps)

> 📘
> 
> ### 
> 
> You can see the full integration guide for Withdrawals [here.](https://docs.zerohash.com/reference/sdk-modules-crypto-withdrawals)

TypeScript

```
import React from 'react';
import ZeroHashSDK, { AppIdentifier } from 'zh-web-sdk';

const App = () => {
  const sdk = new ZeroHashSDK({
    // For production usage, please change this URL to https://web-sdk.zerohash.com
    zeroHashAppsURL: "https://web-sdk.cert.zerohash.com",
    cryptoWithdrawalsJWT: "<JWT_TOKEN_HERE>" 
  });

  sdk.openModal({
    appIdentifier: AppIdentifier.CRYPTO_WITHDRAWALS // "crypto-withdrawals"
  })
  return <></>;
}

export default App;
```

The End Customer will be shown the Withdrawal screen with a pre-populated withdrawal request, outlining the following data points:

| Data Point | Description | Example |
| --- | --- | --- |
| Withdrawal Request Amount | The amount of `quoted_asset` they want to withdraw | 200 |
| Destination Wallet | The wallet nickname and address of where the withdrawal is going to | John's USDC on Ethereum Wallet (\*\*cB89) |
| Withdrawal Fee | The transaction fee being assessed on the withdrawal | 1.50 |
| Network Fee | The blockchain-assessed network fee on the withdrawal, in `quoted_asset` terms | 1.25 |
| Withdrawal Receive Amount | The amount of the stablecoin or crypto asset that the user will be receiving | 197.25 |

### 

7\. Crypto Withdraw SDK - Initiate Withdrawal

At this point, the End Customer is interacting with the front end SDK. The Customer will ultimately initiate the withdrawal.

### 

8\. Crypto Withdraw SDK - Consume Payments Webhook

> 📘
> 
> ### 
> 
> Platform must be configured with a valid webhook URL in order to receive these webhooks. Please get in touch with a zerohash representative so that they can set this up for you. Your Platform will need to be specifically configured to receive these webhooks.

After the End Customer successfully initiates the Withdrawal via the SDK, the Platform can consume webhooks related to that [payment](https://docs.zerohash.com/reference/payments-status-changes).

**Note:** the `x-zh-hook-payload-type` is `payment_status_changed` (more details on webhooks [here](https://docs.zerohash.com/reference/webhook-security))

#### 

Status Summary

The Withdrawal will initially enter a status of `submitted`. If zerohash is unable to process the transaction, the Withdrawal will enter a terminal status of `failed`. When the transaction has been successfully broadcasted on-chain, it will enter a status of `posted`. A terminal status of `settled` is reached when the Withdrawal has been confirmed on-chain and received by the End Customer.

#### 

Initialized Status

After you successfully generate a JWT token via the `POST /client_auth_token` endpoint, zerohash will send an `initialized` webhook. Example payload:

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
      "withdrawal_request_id":"",
      "trade_id":"",
      "on_chain_transaction_id":"",
      "network_fee_notional":"",
      "network_fee_quantity":"",
      "withdrawal_fee_notional": "",
      "destination_address":"0xa6b0Cd1baaa15AE97D8135f0E87F61af27c6cB89"
   },
   "asset":"",
   "network":"ETH",
   "payment_type":"payout",
   "external_account_id":"c476a81f-a29f-4e22-88db-1f521d7cf004",
   "participant_code":"CUST01",
   "quantity":"",
   "status":"initialized",
   "created_at":"2024-09-26T13:05:22.657Z",
   "updated_at":"2024-09-26T13:05:22.657Z",
   "total":"200",
   "reference_id": "0bd7f7f0-cf26-495f-b2df-e8afe8481ba3"
}
```

#### 

Submitted Status

The Withdrawal will initially and briefly enter a status of `submitted`. Example payload:

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
   "payment_type":"payout",
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

The Withdrawal will transition into a status of `posted`, which means that the asset has been **broadcasted on-chain**. Note the presence of the `on_chain_transaction_id` field, which represents the on-chain hash. Typically, this is displayed to the End Customer on the Platform's "Transaction History" or equivalent page in order to allow the Customer to trace the transaction. Example payload:

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
      "destination_address":"0xa6b0Cd1baaa15AE97D8135f0E87F61af27c6cB89",
   "asset":"USDC",
   "network":"ETH",
   "payment_type":"payout",
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

When the withdrawal transitions to a `settled` status, the transaction has been fully settled on-chain and the balance should be reflected on the End Customer's destination exchange or wallet account. Example payload:

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
   "payment_type":"payout",
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

Due to either zerohash processing issues or issues with the blockchain itself, a Withdrawal can transition to a `failed` status. Example payload:

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
   "payment_type":"payout",
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

#### 

Abandoned Status

When the End Customer leaves the SDK UI **without** having initiated a Withdrawal, zerohash will send an `abandoned` webhook message. This is helpful when accounting for balance ledgering and reconciliation, learn more [here](https://docs.zerohash.com/docs/withdrawals-releasing-funds). Example payload:

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
      "withdrawal_request_id":"",
      "trade_id":"",
      "on_chain_transaction_id":"",
      "network_fee_notional":"",
      "network_fee_quantity":"",
      "withdrawal_fee_notional": "",
      "destination_address":"0xa6b0Cd1baaa15AE97D8135f0E87F61af27c6cB89"
   },
   "asset":"USDC",
   "network":"ETH",
   "payment_type":"payout",
   "external_account_id":"c476a81f-a29f-4e22-88db-1f521d7cf004",
   "participant_code":"CUST01",
   "quantity":"",
   "status":"abandoned",
   "created_at":"2024-09-26T13:05:22.657Z",
   "updated_at":"2024-09-26T13:05:22.657Z",
   "total":"200",
   "reference_id": "0bd7f7f0-cf26-495f-b2df-e8afe8481ba3"
}
```

### 

9\. Crypto Withdraw SDK - Query Payments

The Platform can also query the [GET /payments](https://docs.zerohash.com/reference/get_payments) to view information about the Withdrawal. Example response:

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

10\. Complete End of Day (EOD) Settlement

After each session, the Platform will be required to top up their float account to its original level. This is referred to as a **Net Delivery Obligation (NDO)**. First, here are the standard settlement session and its schedules:

| Session | NDO Wire Due |
| --- | --- |
| Monday | By Tuesday EOD |
| Tuesday | By Wednesday EOD |
| Wednesday | By Thursday EOD |
| Thursday | By Friday EOD |
| Friday | By Monday EOD |

For Bank Holidays in the US, the NDO will be due during the next valid business day.

Updated about 2 months ago

---

Did this page help you?

Yes

No

Copy Page