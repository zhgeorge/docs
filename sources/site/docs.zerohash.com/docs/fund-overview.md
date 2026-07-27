# Source: https://docs.zerohash.com/docs/fund-overview

![](https://files.readme.io/8c54a279ff1e466df1943c7129a39ceb0ecaf51e5cff28ad43ff9a8ac6f98215-Account_Funding_-_Main.png)

## 

Introduction

Account Funding enables **Platforms to allow their end customers to fund their account using crypto or stablecoins**. You can configure Account Funding so that deposits are automatically converted to fiat, allowing Platforms to instantly recognize a credit to the customer's fiat balance. This is an alternative funding mechanism that can live side-by-side next to card, wire, ACH, etc.

> ### 
> 
> Account Funding is available for both US and EU Platforms.
> 
> EU flows are operated by zerohash europe B.V., licensed by the Dutch Autoriteit Financiële Markten (AFM). The product works the same way in both regions. See the **Regional Availability: US vs. EU** section below for the integration differences.

## 

Use Cases

- **Investment platforms:** Platforms that allow other businesses to fundraise or ones that allow their end customers to contribute to investment funds can leverage the Account Funding product to provide an additional funding option.
- **Trading account funding:** CFD or equity trading platforms can offer an alternative funding method that sits side-by-side next to traditional methods such as card, bank transfer, etc.
- **Neobanks and digital wallets:** Money apps can increase assets on the platform, thus increasing overall engagement by activating this product.
- **Any platform that requires end customers to fund their account:** This new funding method is applicable to any platform with end retail customers who need to fund their account in order to trade, invest, or subsequently purchase a good or service.

## 

Key Features

- **Available anytime:** 24/7/365 instant account funding
- **Lightning fast:** Transactions on-chain settle quickly, allowing for instant account balance updates
- **Eliminate chargebacks:** Irreversible transactions remove chargeback risk
- **Globally accessible:** Onboard customers and no more complexity with managing many local fiat payment rails
- **Cheaper:** Transfer fees are cheaper than ACH, Card, Wire, and Swift transactions

## 

Integration Details

### 

Setup

It's important to note that in order to use the Account Funding product, the End Customer must be **onboarded** as a zerohash customer. This can be done in 1 of 3 ways:

- **API (Reliance):** approved Platforms use a KYC solution of their own and pass zerohash the results of each verification via [POST /participants/customers/new](https://docs.zerohash.com/reference/post_participants-customers-new). Guidelines for onboarding EU participants can be found [here.](https://docs.zerohash.com/docs/eu-participant-creation)
- **API (KYC as a Service) \[_coming soon and individually based on compliance approval_\]:** Platforms can use the zerohash KYC product, while owning the front end themselves.
- **SDK (KYC as a Service):** Platforms can use the zerohash KYC product, while leveraging the zerohash [Onboarding SDK](https://docs.zerohash.com/reference/sdk-modules-user-onboarding).

You can then couple your preferred onboarding solution with either:

- **API:** leverage your own front end, using zerohash's [Account Funding API.](https://docs.zerohash.com/reference/post_fund-rfq)
- **SDK:** embed the zerohash [Account Funding SDK](https://docs.zerohash.com/reference/fund-sdk).

### 

Regional Availability: US vs. EU

The underlying Account Funding system is the same in both regions; deployment, configuration, and behavior don't change. The integration difference is which host your platform points to, and where your platform is configured:

| | **US** | EU |
| --- | --- | --- |
| Entity | zerohash LLC | zerohash europe B.V. (AFM-licensed) |
| User Agreement | [zerohash User Agreement](https://zerohash.zendesk.com/hc/en-us/articles/47668692221075-zerohash-US-User-Agreement) | Unique to each Platform |
| Regulatory Disclosures | [zerohash Regulatory Disclosures](https://docs.zerohash.com/page/us-licenses-and-disclosures) | [zerohash europe B.V. Regulatory Disclosures](https://zerohash.com/legal/disclosures) |
| API host | api.zerohash.com | api.zerohash.eu |
| SDK host | web-sdk.zerohash.com | web-sdk.zerohash.eu |

Pointing your integration at the EU host is what routes your traffic to zerohash europe B.V.'s clusters and services. There are no separate API endpoints or additional invocation steps beyond using the correct host.

SDK screens and emails automatically reflect "zerohash europe B.V." branding (name and logo) instead of "zerohash" when pointed at the EU host. This requires no changes on the Platform's part. User agreements and disclosures also render correctly for the EU flow automatically within the SDK.

### 

Configurations

After you've chosen your setup, you can make some decisions on how your integration is configured:

#### 

Ledgering Options

**Option 1:** After the crypto or stablecoin is converted to fiat, the USD is automatically transferred to the Platform on the zerohash ledger. So the flow of funds is:

| Movement Type | Participant | Asset | Type |
| --- | --- | --- | --- |
| Deposit | End Customer | USDC (for example) | Credit |
| Trade Settlement (automatic and immediately after the Deposit) | End Customer | USDC | Debit |
| Trade Settlement | End Customer | USD (for example) | Credit |
| Transfer | End Customer | USD | Debit |
| Transfer | Platform | USD | Credit |

**Option 2:** After the crypto or stablecoin is converted to fiat, the USD is **not** automatically transferred to the Platform on the zerohash ledger and instead sits in the End Customer's account (not recommended for Platform's using the Account Funding SDK). From there, the platform can initiate a fiat withdraw directly from the End Customer's account. So the flow of funds is:

| Movement Type | Participant | Asset | Type |
| --- | --- | --- | --- |
| Deposit | End Customer | USDC | Credit |
| Trade Settlement (automatic and immediately after the Deposit) | End Customer | USDC | Debit |
| Trade Settlement | End Customer | USD | Credit |

#### 

Fees

**Option 1:** Platform incurs zerohash fees. In this case, the End Customer will not be charged any fee upon conversion (issuer fees may still apply).

**Option 2:** End Customer incurs the fee. This option allows the Platform to pass along product usage costs. The fee will be taken upon the conversion

#### 

Maximum and Minimum Deposits

- Similar to traditional funding methods, Platforms have the ability to tell zerohash the minimum and maximum deposit amounts to enforce. On the SDK, these values will be presented on the front end for the End Customer's awareness.
- By default, each platform will inherit a **maximum** threshold of $250,000 per deposit and $1 **minimum** threshold.

## 

Email Receipts

Email receipts must be delivered to End Customer for every Account Funding transaction that is processed by zerohash. If a Platform is not able to meet this requirement, zerohash will provide this as a service.

## 

Supported Assets

The account funding supports 50+ non-stablecoins asset as well as all major stablecoins (such as USDC, PYUSD, RLUSD, USDT and more).

## 

Webhooks

We offer webhooks specific to this product. See details here: [Account Funding Webhook](https://docs.zerohash.com/reference/fund-transaction-update)

## 

Platform Settlement

### 

General

Platforms will receive a once a day batch fiat settlement. Settlement schedule:

| Session | Start | End | Expected Settlement Time\* |
| --- | --- | --- | --- |
| Monday | Monday 9:00a EST | Tuesday 8:59:59a EST | Tuesday EOD |
| Tuesday | Tuesday 9:00a EST | Wednesday 8:59:59a EST | Wednesday EOD |
| Wednesday | Wednesday 9:00a EST | Thursday 8:59:59a EST | Thursday EOD |
| Thursday | Thursday 9:00a EST | Friday 8:59:59a EST | Friday EOD |
| Friday | Friday 9:00a EST | Monday 8:59:59a EST | Monday EOD |

During US holidays, Platforms should expect their settlements to arrive by EOD on the next business day. For example, for the August 30th 2024 session, the settlement will arrive by Tuesday EOD (because Monday was Labor Day)

Updated 12 days ago

---

Did this page help you?

Yes

No

Copy Page