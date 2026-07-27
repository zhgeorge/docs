# Source: https://docs.zerohash.com/docs/multi-tenant-account-funding

# 

Context

Platforms can use the [Account Funding](https://docs.zerohash.com/docs/fund-overview) product to fund not only individual accounts (accounts with a single owner), but also multi-tenant accounts (those with multiple owners). This is supported by both our our Account Funding [API](https://docs.zerohash.com/reference/post_fund-rfq) and [SDK](https://docs.zerohash.com/docs/fund-experience-sample).

# 

Supported multi-tenant account types

See [here.](https://docs.zerohash.com/docs/customer-accounts-guide#account-types)

# 

End to end flow

## 

1\. Submit participants

As a pre-requisite for creating a multi-tenant account, the Platform should be submitting participants via the method selected during onboarding to zerohash. The two options are:

- **API:** [POST /participants/customers/new](https://docs.zerohash.com/reference/post_participants-customers-new)
- **SDK:** [Onboarding SDK](https://docs.zerohash.com/docs/onboarding-experience-sample)

Regardless of the submission method, zerohash will create a unique `participant_code` (ie, CUST01).

## 

2\. Create multi-tenant account

The platform should follow the participant same onboarding instructions mentioned on [this guide](https://docs.zerohash.com/docs/customer-accounts-guide#account-types).

## 

3\. Get fund quote

> ❗️
> 
> ### 
> 
> Please specify 1) the primary participant code in this step and 2) the account label used to create the account in step 2 above

Let's assume a JTIC account and 2 participants have already been created:

- Primary participant code: CUST01
- Secondary participant code: CUST02

Let's also assume a JTIC account has been created via [POST /accounts](https://docs.zerohash.com/reference/post_accounts) with `account_label` = `abc123`

The Platform will generate a fund quote via [POST /fund/rfq](https://docs.zerohash.com/reference/post_fund-rfq) like so:

JSON

```
{
  "participant_code": "CUST01", // please use the primary participant code
  "fund_asset": "USDC.ETH",
  "account_label": "abc123"
}
```

The response will create an address that's tied to the `participant_code` and the `account_label`:

JSON

```
{
  "message": {
    "request_id": "14f8ebb8-7530-4aa4-bef9-9d73d56313f3",
    "participant_code": "CUST01",  
    "account_label": "abc123",
    "fund_asset": "USDC.ETH",  
    "rate": "1",
    "quoted_currency": "USD",
    "expiry_timestamp": 2554408627334,
    "deposit_address": "0x5f59B625036ccB4f7aD27Ca4Cb896e4452AfFDAF",
    "minimum_deposit": "1",
    "maximum_deposit": "250000"
  }
}
```

## 

4\. Deposit crypto/stables

The primary participant will then send USDC on ETH to the address from above.

## 

5\. Receive webhooks

The Platform will be pre-configured to receive webhooks. You'll receive a webhook event once the asset has been received and successfully converted to fiat. Learn more about webhooks [here.](https://docs.zerohash.com/reference/fund-transaction-update)

## 

6\. Query transactions

The Platform can query previously executed Account Funding transactions via the [GET /fund/transactions](https://docs.zerohash.com/reference/get_fund-transactions) endpoint.

Updated about 2 months ago

---

Did this page help you?

Yes

No

Copy Page