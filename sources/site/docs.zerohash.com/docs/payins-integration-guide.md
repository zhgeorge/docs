# Source: https://docs.zerohash.com/docs/payins-integration-guide

## 

Introduction

The Payins product allows payment service providers or merchants to offer stablecoins or crypto as a payment option at checkout.

![](https://files.readme.io/76feff663768d1ac1b8c9bfa3f32822b4b7c5f256467c353ad725e78d7034c50-PAY4.png)

## 

Definitions

| Term | Definition |
| --- | --- |
| Platform | The company that is under contract with zerohash and integrates directly with zerohash's APIs or SDKs. |
| Merchant | A business entity (non-natural person) that serves as the customer-facing front-end in the transaction flow. Typically, the Merchant is a customer of the Platform and is where the Shopper initiates their interaction. In some cases, the Merchant and Platform may be the same entity. |
| Shopper | The natural person that pays for the good or service |

## 

How the Integration Works

A high-level summary of each integration step, showing whether it uses the API or SDK.

| Step | API or SDK? | Notes |
| --- | --- | --- |
| Merchant onboarding | API | |
| Shopper onboarding | API | |
| Shopper accepts zerohash t's and c's | SDK | This is the first page on the SDK a first-time Shopper will see |
| Shopper makes payment | SDK | The SDK will facilitate the asset and network selection and will present the expected crypto/stablecoin quantity, address, and quote timing information |
| Initiate refund | API | |
| Initiate return | API | |

## 

1\. Submit Merchant

> ℹ️
> 
> ### 
> 
> Who this applies to
> 
> This section is relevant when the Platform has many merchants. If the Platform is itself the merchant, this step is not required.

Begin by submitting the Merchant via [POST /participants/entity/new.](https://docs.zerohash.com/reference/post_participants-entity-new) See more information [here](https://docs.zerohash.com/docs/merchant-onboarding-guide).

## 

2\. Fund Refund Account

To enable future refunds, you must pre-fund your Refund account by sending a wire transfer to the designated bank account provided by our settlement team. Ensure the wire **memo** is tagged with your Platform code + "\_refund" (ie, PLAT01\_refund):

Here are the [account](https://docs.zerohash.com/docs/what-is-an-account) details:

- Participant\_code: 00SCXM
- Account\_group: PLAT01 (replace with your `participant_code`)
- Account\_label: pay\_refund
- Account\_type: available
- Asset: USD

## 

3\. Submit Shopper

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

## 

4\. Query Shopper

To retrieve general information about the shopper, query the [GET /participants](https://docs.zerohash.com/reference/get_participants) endpoint. You can also use the `participant_code` filter to retrieve an individual Shopper.

## 

5\. Query Shopper Limits

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

6\. Accounts

The Platform will have the following [accounts](https://docs.zerohash.com/docs/what-is-an-account) at zerohash:

| Account | Description | Technical Details |
| --- | --- | --- |
| Settlement Account | The fiat account that contains the balance of **successful payments** | \- `participant_code` = \[your platform code or merchant's platform code\]<br>\- `account_group` = \[your platform code\] - `account_label` = pay<br>\- `account_type` = available<br>\- `asset` = USD (or other fiat currency being used) |
| Refund Float Account | The fiat account, funded by the Platform, that is used to refund Shoppers. The balances here will be converted to a crypto or stablecoin asset and sent on-chain to the Shopper. See section, "11. Refund a Payment" below for details | \- `participant_code` = 00SCXM<br>\- `account_group` = \[your platform code\] - `account_label` = pay\_refund<br>\- `account_type` = available<br>\- `asset` = USD (or other fiat currency being used) |
| Error Account | The fiat account that accumulates due to error scenarios (over payment, under payment, incorrect asset or network, late payment | \- `participant_code` = \[your platform code or merchant's platform code\]<br>\- `account_group` = \[your platform code\]<br>\- `account_label` = pay\_error<br>\- `account_type` = available<br>\- `asset` = USD (or other fiat currency being used) |

## 

7\. Initiate Payment

Now, let's move onto money movement. Begin by [requesting an access token](https://docs.zerohash.com/reference/retrieving-access-token) specifying:

| Field | Description | Example Value | Required? |
| --- | --- | --- | --- |
| `participant_code` | The 6-digit alpha numeric code associated with the Shopper that is looking to pay (the response of the original [POST /participants/customers/new](https://docs.zerohash.com/reference/post_participants-customers-new) call) | SHOPP1 | Y |
| `permissions` | The array of permissions that will be granted to the returned JWT token | `["crypto-pay"]` | Y |
| `purchase_amount`<br>(part of the `payment_details` object) | The amount of the good or service being paid for, denominated in the `denominated_currency` | 100 | Y |
| `denominated_currency`<br>(part of the `payment_details` object) | The fiat or crypto currency in which the purchase amount is priced | USD | Y |
| `reference_id` | Platform-dictated reference id that is tied to any successful payment | 0bd7f7f0-cf26-495f-b2df-e8afe8481ba3 | N |
| `merchant_participant_code` | The 6-digit alpha numeric code associated with the Merchant or Platform that is receiving payment | MERCH1 | N |

Example `POST /client_auth_token` request:

JSON

```
{
 "participant_code": "SHOPP1",
 "permissions": ["crypto-pay"],
 "payment_details" : {
      "purchase_amount": "100",
      "denominated_currency" : "USD"
   },
  "reference_id": "0bd7f7f0-cf26-495f-b2df-e8afe8481ba3"
  "merchant_participant_code": "MERCH01" //optional, only use when Platform!= Merchant
}
```

After successfully calling `POST /client_auth_token`, the next step is to initiate the Payins SDK flow. See the example below for how to implement this in a React application. Keep in mind that if you're using a _Native Mobile App_ (Swift, Flutter, etc) instead of using `zh-web-sdk` you should follow the `WebView` approach, described [here](https://docs.zerohash.com/reference/sdk-integration-with-mobile-apps).

TypeScript

```
import React from 'react';
import ZeroHashSDK, { AppIdentifier } from 'zh-web-sdk';

const App = () => {
  const sdk = new ZeroHashSDK({
    zeroHashAppsURL: "https://web-sdk.cert.zerohash.com",
    payJWT: "<JWT_TOKEN_HERE>" 
  });

    sdk.openModal({
    appIdentifier: AppIdentifier.PAY, 
  })
  return <></>;
}

export default App;
```

### 

Error Responses

**Manual Approval Required**

Manual approval by zerohash is required for transactions at or above $500,000, or when a Shopper's lifetime spend reaches $500,000 or more. When a Platform calls `POST /client_auth_token` for a transaction that breaches $500,000, the response will look like this:

JSON

```
{
   "error": "Manual approval required for this transaction",
  "transaction_id": "txn_01HZF7QWXJ8XK3VYNS6TKDM4G2"
}
```

This response means that the transaction has been submitted for zerohash approval. You will receive a [webhook](https://docs.zerohash.com/reference/payins-transaction-updates) once the status of the transaction has been updated, and can then use the `transaction_id` to call `POST /client_auth_token` successfully.

**KYC Requirements Not Met**

If the Shopper (`SHOPP1`) has **insufficient** PII data for the [Shopper Tier](https://docs.zerohash.com/docs/onboard-shoppers) required for the transaction, `POST /client_auth_token` will return an error message identifying missing requirements:

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

You can use these guidelines to update the Shopper accordingly via [PATCH /participants/customers,](https://docs.zerohash.com/reference/patch_participants-customers-participant-code) and then call `POST /client_auth_token` again.

### 

7a. Accept T's and C's

First-time Shoppers will need to accept the zerohash terms and conditions:

![](https://files.readme.io/ca38589e0043c07d8aeb3cbdd292dc2700598c9be00260ad552cff22f8a8b07a-pay_01.png)

### 

7b. Select asset and network

The Shopper will now select the asset they want to pay with. Remember, the assets that are displayed on this screen are your choice - contact your zerohash contact to make the proper configurations:

![](https://files.readme.io/c22ba1eb3eed6f61b7572a3cc9974c40bd53e44022509aee0de7bf26d01751a2-pay_02.png)

Depending on the selected asset, the next screen may prompt the Shopper to choose a network. If the asset only supports a single network - for example, Bitcoin (BTC) only supports the Bitcoin network for this product currently - the Select Network screen is skipped.

In the example below, USDC was selected as the asset, which supports multiple networks. As a result, the next screen displays all available network options for the Shopper to choose from.

![](https://files.readme.io/cb71fcc3e505179fdcb85d32c436cebabf420e53e25ff32cdb01c0453c43f428-pay_03.png)

### 

7c. Payment pending

![](https://files.readme.io/913a1854435ea37b4c04a0fa46b5bed14f7e9844a9b90f87c1504f37e766a44c-pay_04.png)

The Shopper is now presented with the information to successfully make the payment:

- Conversion rate
- Payment amount
- Payment expiration time
- QR code and address

The expectation is that the Shopper, with relative urgency, takes the following steps:

**If the Shopper is paying from their mobile phone**

1. Copies address
2. Navigates to their preferred exchange or wallet (ie, Coinbase Exchange or Metamask wallet)
3. Selects the same Asset they chose on the zerohash SDK
4. Selects the same Network they chose on the zerohash SDK
5. Enters the exact amount that was displayed on the Payment Pending screen
6. Initiate the transaction

**If the Shopper is paying from their computer (web)**

1. Navigates to their preferred exchange or wallet (ie, Coinbase Exchange or Metamask wallet)
2. Selects the same Asset they chose on the zerohash SDK
3. When asked to enter the address, selects the "scan QR code" option
4. Point your device’s camera at the QR code displayed on your computer screen, ensuring it’s centered and clearly visible
5. Selects the same Network they chose on the zerohash SDK
6. Enters the exact amount that was displayed on the Payment Pending screen
7. Initiate the transaction

### 

7d. Payment Successful

If the Shopper sends at least the displayed amount of the correct crypto or stablecoin, using the specified asset and network, the SDK will automatically transition to the next screen:

![](https://files.readme.io/396d8c5eb6b1a4c90cb31f3146a1725707896a383eff909d27eb041b93bd7343-pay_05.png)

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
  "reason": "",
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
  "reason": "over payment",
  "reference_id": "04918aef-41d1-4dfb-82b8-2fdc232a8d88",
  "raw_fee_bps": "",
  "deposit_fee_bps": "",
  "raw_fee_notional": "",
  "deposit_fee_notional": ""
}
```

### 

7d. Payment Unsuccessful

There are a few scenarios that will lead a failed payment which will be reflected on the SDK UI:

![](https://files.readme.io/a5f7807181d962a673a4a4a129684cf5d4d3ca4d4c8bc276f381f123fcf66d8e-Pay_10.png)

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
  "reason": "under payment",
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
  "reason": "depeg",
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
  "reason": "depeg",
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
  "reason": "For Zero Hash Compliance reasons, the deposit has not been converted to fiat and the crypto has been credited to a Zero Hash holding account",
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
  "reason": "payment session has expired",
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
  "reason": "deposit currency does not match the expected currency",
  "reference_id": "04918aef-41d1-4dfb-82b8-2fdc232a8d88",
  "raw_fee_bps": "",
  "deposit_fee_bps": "",
  "raw_fee_notional": "",
  "deposit_fee_notional": ""
}
```

## 

8\. Query payments

You can query our REST endpoint [GET /fund/transactions](https://docs.zerohash.com/reference/get_fund-transactions) to retroactively view payment details.

## 

9\. Settlement

Withdrawals from Merchant or Platform participant accounts to external bank accounts can be initiated through [POST /withdrawals/requests.](https://docs.zerohash.com/reference/post_withdrawals-requests)

## 

10\. Refund a Payment

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