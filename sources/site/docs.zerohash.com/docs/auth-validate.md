# Source: https://docs.zerohash.com/docs/auth-validate

# 

Introduction

Auth Validate is Auth’s compliance layer, designed to give compliance teams confidence when enabling stablecoin and crypto transfers. It provides configurable controls and verification logic to help ensure transfers meet regulatory and internal risk requirements.

This page covers the following capabilities:

1. **Custodial vs. Non-custodial Accounts:** Configure your integration to allow transfers only to and from custodial accounts (ie, centralized exchanges), ensuring all counterparties are fully KYC’d.
2. **Travel Rule-Powered Account Matching:** As a member of the TRUST network, zerohash can receive sender PII from participating centralized exchanges for transactions above applicable thresholds.
3. **Non-auth Deposit Blocking:** Deposits initiated outside of the Auth user experience can be automatically rejected.

# 

1\. Custodial vs. Non-custodial Accounts

You have complete flexibility to choose which exchange and wallet accounts you want to present as options to your customers:

![](https://files.readme.io/d8e391eb1e71aaa9f7f492d44ba7965f5123f216c6ded8e916085b19448aab97-Custodial_vs._Non-custodial_Accounts.png)

Simply instruct zerohash on your desired preference, and we’ll handle the configuration on our end.

# 

2\. Travel Rule-Powered Account Matching

There are 2 types of solutions we can offer:

## 

2a. Post-crediting Name Match

### 

Report details and mechanics

As a TRUST network member, zerohash goes beyond standard Travel Rule compliance by not only exchanging sender PII for transactions above regulatory thresholds but also aggregating that data to generate an insightful **“same-name exception” report**. This report leverages our advanced account matching logic (mentioned above) to identify discrepancies between sending and receiving accounts.

Delivered to you daily, this report provides actionable insights to help your compliance team or automated systems quickly identify and respond to potential risks, such as locking or disabling flagged participants via API ([POST /participants/customers/{participant\\\_code}/lock](https://docs.zerohash.com/reference/post_participants-customers-participant-code-lock)), streamlining your compliance workflow and strengthening your risk controls.

**NOTE:** The Travel Rule (as implemented in the United States) requires certain financial institutions to include or transmit certain information (identifying the sender, receiver, and transaction) on certain transmittals of funds in if the transaction is $3,000 or more in value.

Reports can be delivered via sftp.

![](https://files.readme.io/5490787be90f86376349097d2919ae9e6f889628506307776bdc4c3180ab653a-Travel_Rule-Powered_Account_Matching.png)

## 

Account Match Logic

zerohash can perform account matching between the user in our system and the corresponding account within the external exchange system.

**Logic** 
By default, our out-of-the-box name matching logic performs a standard comparison of First Name and Last Name fields. We apply a string similarity algorithm called Jaro-Winkler, which generates a score between 0 and 1:

- A score of 1.0 indicates a perfect match
- Lower scores reflect less similarity between the names

We recommend a default threshold of 0.75 (ie, 75%), but this value is fully configurable based on your organization’s needs and risk tolerance.

## 

2b. Pre-crediting Name Match

With Pre-crediting Name Matching, zerohash will not credit end customer accounts until a name match has been performed between the zerohash account, and the source exchange account. Here's how it works:

1. User chooses the centralized exchange account from the SDK (either the [Auth SDK](https://docs.zerohash.com/docs/auth-standalone) or [Account Funding SDK](https://docs.zerohash.com/docs/fund-integration-guide-sdk))
2. User initiates withdrawal from the exchange for an amount over $3,000
3. The asset lands on-chain at the end user's zerohash wallet address
4. zerohash receives the asset on-chain, but the assets remain **"Processing"** - meaning they are locked and unavailable for use until the automated name-match is satisfied.
 1. zerohash sends a webhook to the Platform
 2. zerohash sends an email to the end customer (if the Platform is enabled for this)
5. zerohash instantly begins monitoring for travel rule PII to be received from the sending centralized exchange
6. Once the PII is received, zerohash performs a name match according to the [Account Match logic above](https://docs.zerohash.com/docs/auth-validate#account-match-logic)
 1. if the account can be matched, zerohash will convert the funds to fiat
 1. zerohash sends a webhook to the Platform
 2. zerohash sends an email to the end customer (if the Platform is enabled for this)
 2. If the account cannot be matched, do not convert the funds and move the funds to the `recovery_quarantine` account\_label
 1. zerohash sends a webhook to the Platform
 2. zerohash sends an email to the end customer (if the Platform is enabled for this)
 1. The end customer can self-serve a withdrawal to the wallet address of their choice

> 📘
> 
> ### 
> 
> See full e2e integration guide here will full technical specs and user experience (UX) flow

# 

3\. Non-auth Deposit Blocking

See the full integration guide [here](https://docs.zerohash.com/docs/non-auth).

In short, zerohash can configure your integration to block any transfer initiated outside of the Auth flow.

For example:

- User A completes an Auth-driven transfer, properly linking their exchange account.
- Since blockchain addresses are public, the user could discover their deposit address via a block explorer and attempt a second deposit from a non-custodial account.
- zerohash can detect this scenario and block the non-auth deposit from crediting the user.
- If this happens, the user can seamlessly recover their funds using the [Recovery SDK](https://docs.zerohash.com/docs/non-auth) (see the integration guide for details).

Updated 27 days ago

---

Did this page help you?

Yes

No

Copy Page