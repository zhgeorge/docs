# Source: https://docs.zerohash.com/docs/pre-crediting-name-match

![](https://files.readme.io/163b4edf3dbf14a2f1b6f2876255936e5a010d1d83cc1437c98318edfa8941cf-Auth_Validate_-_Pre-crediting_Name_Match.png) 

# 

What does this page include?

This page includes the following:

1. End to end flow of the Pre-crediting Name Match
2. Webhook examples
3. Email examples
4. SDK UI's that are shown to the end user

# 

High level flow

With Pre-crediting Name Matching, zerohash will not credit end customer accounts until a name match has been performed between the zerohash account, and the source exchange account. Here's how it works:

1. User chooses the centralized exchange account from the SDK (either the [Auth SDK](https://docs.zerohash.com/docs/auth-standalone) or [Account Funding SDK](https://docs.zerohash.com/docs/fund-integration-guide-sdk))
2. User initiates withdrawal from the exchange for an amount over $3,000
3. The asset lands on-chain at the end user's zerohash wallet address
4. zerohash receives the asset on-chain, but the assets remain **"Processing"** - meaning they are locked and unavailable for use until the automated name-match is satisfied.
 1. zerohash sends a webhook to the Platform
 2. zerohash sends an email to the end customer (if the Platform is enabled for this)
5. zerohash instantly begins monitoring for travel rule PII to be received from the sending centralized exchange
6. Once the PII is received, zerohash performs a name match according to the Account Match Logic
 1. if the account can be matched, zerohash will convert the funds to fiat
 1. zerohash sends a webhook to the Platform
 2. zerohash sends an email to the end customer (if the Platform is enabled for this)
 2. If the account cannot be matched, do not convert the funds and move the funds to the `fund_failure` account\_label
 1. zerohash sends a webhook to the Platform
 2. zerohash sends an email to the end customer (if the Platform is enabled for this)
 1. The end customer can self-serve a withdrawal to the wallet address of their choice

# 

End to end flow

The user selects crypto or stablecoins from the Platforms app and redirected to the zerohash SDK →

## 

1\. Landing page and product intro

![](https://files.readme.io/7ed33f28ce9bcb8d9f9dd7f52c122316664b6ed3289942af48f9936ddc3f4c5e-777.png)

User accepts the terms and conditions and is moved to the next screen:

## 

2\. Menu screen

![](https://files.readme.io/3832b8116f369bf9443097066acced3942a9542764fa5b729ba54d210ba04dbd-222.png)

## 

3\. First Warning

![](https://files.readme.io/36ffbe09abf40f0074f54a3adfbc640ab6b966a6a8140f2fd3c9b8ed1515612e-1234.png)

User is made aware that zerohash will be performing an account match on the source exchange account. They click "Got it" and are moved to the next screen:

## 

4\. Select Asset

![](https://files.readme.io/ca2edfcd274e241af0878e1d3fc635c659c99c355a8b2cc30e2909b7c7bb98cf-12345.png)

The user selects an asset. Please note, only assets that you've previously identified as permissible assets will be shown here. The above screen is just an example. They then are moved to the next screen:

## 

5\. Enter Amount

![](https://files.readme.io/839c4d2370505c768c1441ecc070b56db82ea3e781f5deb1b3e104251b41a0ee-12333.png)

There is a validation if they enter an amount below $3,000:

## 

6\. Amount validation

![](https://files.readme.io/3627cca34c0b1ac98abc1ae7044b7a68a38e8e02934d0a335a80b638eaafeaa7-45345453.png)

User enters an acceptable amount:

## 

7\. Acceptance amount is entered

![](https://files.readme.io/775f2239f11fa204af8d80ffc396992a86b52e91b5a7da77ee31fa5c4fef5ac1-ff.png)

Once the enter an acceptable amount over $3,000 and click `Continue`, they are brought to this page:

## 

8\. Exchange preview screen (second amount warning)

![](https://files.readme.io/8df5b1e87fa4c56b733e2c88d016185494c47bcf8496f09e09277639001152d0-asfds.png)

When the user clicks on `Go to Coinbase`, we will redirect to the user to the Exchange app, **pre-filling the amount the specified on our SDK**:

## 

9\. Amount is pre-filled on the exchange's screen

![](https://files.readme.io/b0281475481688d608609208e5aa00ac0fa3b67f06a334b87fcf5a058323aeb5-gggg.png)

The user selects Source of funds and then is asked to choose a fiat method to fund their purchase with:

## 

10\. Select source of funds

![](https://files.readme.io/38a727f21fcc08463a290506665046d81d16e06a6945add306cd702c3a67ba2a-222.png)

> 📘
> 
> ### 
> 
> Reminder: The user can also use _existing stablecoin or crypto balances_ to make a transfer. For the UX shown in this example, we are illustrating an example where the user needs to make purchase first

The user selects the proper source, and is brought to this screen:

## 

11\. The transaction is previewed, then confirmed

![](https://files.readme.io/58355273f2b935d0313d11d6afff4860b020eef750da9159c1b504be7692eae6-kkk.png)

Ultimately, the user is able to initiate the transaction and will be brought to this screen:

## 

12\. The transaction is completed on the exchange's screen

![](https://files.readme.io/5b63c461744e80faeef9d1d7eb8f05328ee46be46390490c966c3a894f563515-eeee.png)

At this point, the asset is pending on-chain and is en route to the zerohash address.

The user will then navigate back to the zerohash screen and see it in a Processing state:

## 

13\. The user is back on the zerohash screen

![](https://files.readme.io/7021acd0cefdbecc5f6b2af1c3de2b314d75db45ead9307a101a872106e15c24-Frame_1597880299.png)

## 

14\. Verifying deposit screen

**When we receive the asset,** we will do the following:

1. Update the screen to the following:

![](https://files.readme.io/b1d7f2b605b5d5a101cf656635f00af5cc3155d04c04d11ac994fac6c40fcaa7-mmm.png)

1. We will then send a [Fund webhook](https://docs.zerohash.com/reference/fund-transaction-update) to the Platform indicating that we have the funds, but have not performed the account match yet. Example payload:

JSON

```
{
  "participant_code": "CUST01",
  "fund_asset": "USDC.BASE",
  "quoted_currency": "USD",
  "source_address": "0x3A45a60c62EE6cD616B1C4510404Eba88116044I", 
  "deposit_address": "0x34f53Aea3ba8b60B0ed19106baF43A4f3F73f248",
  "quantity": "3400",
  "fund_id": "5155f7c9-95cb-4556-ab89-c178943a7111",
  "deposit_timestamp": 1750412525409770895,
  "transaction_id": "a07407e8f98c21b037b4aa0cbc852b8489c5e122fcc3d4b33b7827d0605ad8ff",
  "account_label": "general",
  "success": false,
  "reason" : "deposit received, however the Travel Rule-based account match has not completed yet",
  "source": {
    "integration": "coinbase",
    "type": "CUSTODIAL"
  },
  "raw_fee_bps": "0",
  "deposit_fee_bps": "0",
  "raw_fee_notional": "0.00",
  "deposit_fee_notional": "0.00"
}
```

## 

15\. zerohash receives the PII via the travel rule and performs the account match

When we receive the PII via the travel rule, we will perform the account match between the KYC'd customer information in our system with the KYC'd customer registered at the exchange. We will be using the following account match logic, defaulting to fuzzy name match on the `first name` and `last name`:

**Logic**

- By default, our out-of-the-box name matching logic performs a standard comparison of First Name and Last Name fields. We apply a string similarity algorithm called Jaro-Winkler, which generates a score between 0 and 1:
 - A score of 1.0 indicates a perfect match
 - Lower scores reflect less similarity between the names 
 We recommend a default threshold of 0.75 (ie, 75%), but this value is fully configurable based on your organization’s needs and risk tolerance.

There are **2 possible outcomes**

1. **Pass** - the first and last name from our system matched the user's registered exchange name, meeting or exceeding the required threshold.

We will then transition the UI to the following screen:

![](https://files.readme.io/050b750dd81a4d95dfbab75583c2984cdf00ce67b70b913f0ddaebaacf90689c-eeee.png)

And send the standard Fund Complete webhook. Example message:

JSON

```
{
  "participant_code": "CUST01",
  "fund_asset": "USDC.BASE",
  "rate": "1",
  "quoted_currency": "USD",
  "source_address": "0x3A45a60c62EE6cD616B1C4510404Eba88116044I", 
  "deposit_address": "0x34f53Aea3ba8b60B0ed19106baF43A4f3F73f248",
  "quantity": "3400",
  "notional": "3400",
  "fund_id": "5155f7c9-95cb-4556-ab89-c178943a7111",
  "fund_timestamp": 1750404905186631445,
  "deposit_timestamp": 1750404905037719568,
  "transaction_id": "a07407e8f98c21b037b4aa0cbc852b8489c5e122fcc3d4b33b7827d0605ad8ff",
  "account_label": "general",
  "success": true,
  "source": {
    "integration": "cbase",
    "type": "CUSTODIAL"
  },
  "reference_id": "d098e59b-8023-4477-8b63-68fda3c53a30",
  "raw_fee_bps": "0.00",
  "raw_fee_notional": "0.00",
  "deposit_fee_bps": "0.00",
  "deposit_fee_notional": "0.00"
}
```

2. **Fail** - the user's first and last name in our system did not sufficiently match the name on record at the exchange.

We will then transition the UI to the following screen:

![](https://files.readme.io/6a47200f2a405cbda775ee6c878828394e36bcba249edc170a29331462500198-ggggg.png)

And send a failure webhook with a pointed and unique `reason`

JSON

```
{
  "participant_code": "CUST01",
  "fund_asset": "USDC.BASE",
  "quoted_currency": "USD",
  "source_address": "0x3A45a60c62EE6cD616B1C4510404Eba88116044I", 
  "deposit_address": "0x34f53Aea3ba8b60B0ed19106baF43A4f3F73f248",
  "quantity": "3400",
  "fund_id": "5155f7c9-95cb-4556-ab89-c178943a7111",
  "deposit_timestamp": 1750412525409770895,
  "transaction_id": "a07407e8f98c21b037b4aa0cbc852b8489c5e122fcc3d4b33b7827d0605ad8ff",
  "account_label": "general",
  "success": false,
  "reason" : "Travel Rule-based account match failed",
  "source": {
    "integration": "cbase",
    "type": "CUSTODIAL"
  },
  "raw_fee_bps": "0",
  "deposit_fee_bps": "0",
  "raw_fee_notional": "0.00",
  "deposit_fee_notional": "0.00"
}
```

## 

16\. If configured to do so, zerohash will send an email to the end user containing a link to our Secondary Portal

Given the Fund attempt failed and zerohash cannot convert the funds, the user still has an opportunity to recover their crypto or stablecoin assets .

The email sent to the user will contain a link to the secondary portal and they can self-serve a withdrawal to their external address.

Updated 27 days ago

---

Did this page help you?

Yes

No

Copy Page