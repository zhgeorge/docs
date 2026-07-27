# Source: https://docs.zerohash.com/docs/fund-integration-guide-onboarding-api-fund-sdk-sdk

See core product page [here](https://docs.zerohash.com/docs/fund-overview)

# 

Setup

In this guide, the Platform is [setup](https://docs.zerohash.com/docs/fund-overview#setup) to use the zerohash **Onboarding SDK (KYC as a Service)** with the zerohash **Account Funding SDK**. Both SDKs are hosted on web-sdk.zerohash.com

![](https://files.readme.io/6030ec482a4d30237d669fb784a5f9efd465d88a6a3aa1c7c491eca913af3b5a-image.png)

# 

Flow

In this example, the Platform is configured to have the converted USD be automatically transferred to the Platform's account. We'll also assume that the Platform is a CFD brokerage offering stablecoins as a funding mechanism. Summary of all involved participants:

- Platform (participant\_code: PLAT01)
- End Customer (participant\_code: CUST01)

## 

Webhook configuration

Talk to your zerohash representative to have your Platform configured for the following webhooks:

- Onboarding
- Fund

## 

Onboarding

### 

Retrieve Account Funding JWT token

In order to successfully invoke the Access Token, you'll need to supply a `participant_code` for the End Customer (see endpoint API Reference [here](https://docs.zerohash.com/reference/post_client-auth-token)). Please note that this customer must be in an `approved` status for this call to succeed. **Please note:** the correct permission to pass here is `participant-profile`.

The Customer will then be prompted to fill out their onboarding details.

### 

Receive Webhook event

Once the Customer has successfully completed the onboarding flow, the Platform will receive a series of webhooks, most typically like:

JSON

```
{  
  "participant_code": "CUST01",  
  "participant_status": "submitted",  
  "timestamp": 1670958435349  
}
```

Then a few seconds later, the Customer receives approval:

JSON

```
{  
  "participant_code": "ABC123",  
  "participant_status": "approved",  
  "timestamp": 1670958435375  
}
```

The `participant_code` should be used in the next SDK flow:

## 

Initialize Account Funding Flow

### 

Retrieve Account Funding JWT token

In order to successfully invoke the Access Token, you'll need to supply a `participant_code` for the End Customer (see full instructions [here](https://docs.zerohash.com/reference/post_client-auth-token)). This customer must be in an `approved` status for this call to succeed. **Please note:** the correct permission to pass here is `fwc`.

You may also include an optional `reference_id` value when generating the token. This ID will be tied to all future webhook calls and Account Funding events within the [GET /fund/transactions](https://docs.zerohash.com/reference/post_fund-rfq) response.

**Presetting Deposit Amounts** 
You can preset a deposit amount using the `deposit_amount` and `denominated_currency` parameters in the [client auth token](https://docs.zerohash.com/reference/post_client-auth-token) request. This removes the ability for the user to select a deposit amount during the Fund SDK flow and lands the user on the Review screen after selecting the asset they wish to send.

Note: this feature is only available for use with the Auth + Fund SDK flow when Classic Transfer is NOT enabled. Additionally, this value will not be evaluated against Platform-configured periodic transaction limits or Travel Rule limits. Exceeding these limits may cause a transaction failure.

### 

Invoke the Account Funding SDK

See [SDK guide](https://docs.zerohash.com/reference/fund-sdk) for technical instructions.

### 

Success case - receive webhook

Upon a successful deposit and immediate and automatic conversion to fiat, the Platform will receive a [webhook](https://docs.zerohash.com/reference/fund-transaction-update):

JSON

```
{
  "participant_code": "CUST01",
  "fund_asset": "USDC",
  "rate": "1",
  "quoted_currency": "USD",
  "source_address": "0xd3c5967d94d79F17bDc493401c33f7e8897c5f83",
  "deposit_address": "0x34f53Aea3ba8b60B0ed19106baF43A4f3F73f244",
  "quantity": "7.47",
  "notional": "6.47",
  "fund_id": "363b5b15-02bd-4797-892f-8baa4eec60d2",
  "fund_timestamp": 1750404905186631445,
  "deposit_timestamp": 1750404905037719568,
  "transaction_id": "0xcd9e98ae631cf7cfcf4d351374337a55096abd01d9637303aaef31d5c0766562",
  "account_label": "general",
  "success": true,
  "reference_id": "c098e59b-8023-4477-8b63-68fda3c53a39",
	"deposit_fee_type": "flat" 
}
```

### 

Failure cases - receive webhook

#### 

Platform not enabled

If the Platform discontinues their support for the Account Funding product, or otherwise no longer is configured to use the product, the Platform will receive a webhook that looks like this:

JSON

```
{
  "participant_code": "CUST01",
  "fund_asset": "USDC.ETH",
  "quoted_currency": "USD",
  "source_address": "0x3A45a60c62EE6cD616B1C4510404Eba88116044I", 
  "deposit_address": "0x3A45a60c635E6cD616B1C4510404Eba88116050C",
  "quantity": "500",
  "fund_id": "5155f7c9-95cb-4556-ab89-c178943a7111",
  "deposit_timestamp": 1750413892268466189,
  "transaction_id": "a07407e8f98c21b037b4aa0cbc852b8489c5e122fcc3d4b33b7827d0605ad8ff",
  "account_label": "general",
  "success": false,
  "reason" : "Your platform is no longer configured to use this product. The deposit has not been converted to fiat and the crypto has been credited to the customer's account"
}
```

#### 

End Customer not approved

If the End Customer has transitioned to a status other than `approved` (which could be as a result of a routine zerohash Compliance review) and they make a deposit, the Platform will receive this webhook:

JSON

```
{
  "participant_code": "CUST01",
  "fund_asset": "USDC.ETH",
  "quoted_currency": "USD",
  "source_address": "0x3A45a60c62EE6cD616B1C4510404Eba88116044I", 
  "deposit_address": "0x3A45a60c635E6cD616B1C4510404Eba88116050C",
  "quantity": "500",
  "fund_id": "5155f7c9-95cb-4556-ab89-c178943a7111",
  "deposit_timestamp": 1750413892268466189,
  "transaction_id": "a07407e8f98c21b037b4aa0cbc852b8489c5e122fcc3d4b33b7827d0605ad8ff",
  "account_label": "general",
  "success": false,
  "reason" : "This participant is not in an approved state. The deposit has not been converted to fiat and the crypto has been credited to the customer's account"
}
```

#### 

Deposit above maximum

If an End Customer deposits an amount above the maximum configured amount, the Platform will receive this webhook:

JSON

```
{
  "participant_code": "CUST01",
  "fund_asset": "USDC",
  "source_address": "0xd3c5967d94d79F17bDc493401c33f7e8897c5f88",
  "deposit_address": "0x34f53Aea3ba8b60B0ed19106baF43A4f3F73f248",
  "quantity": "26.900000",
  "fund_id": "99c2fc0a-3a28-4aa4-adbf-8743a0c362fo",
  "deposit_timestamp": 1750413892268466189,
  "transaction_id": "0xa06b16064984eb35b170f53896eb3263e1ac4d1bd79f592d9a0e993c58278629",
  "account_label": "general",
  "success": false,
  "reason": "deposit above maximum threshold. The deposit has not been converted to fiat and the crypto has been credited to the customer's account"
}
```

#### 

Deposit below minimum

If an End Customer deposits an amount below the minimum configured amount, the Platform will receive this webhook:

JSON

```
{
  "participant_code": "CUST01",
  "fund_asset": "USDC",
  "source_address": "0xd3c5967d94d79F17bDc493401c33f7e8897c5f81",
  "deposit_address": "0x34f53Aea3ba8b60B0ed19106baF43A4f3F73f242",
  "quantity": "0.990000",
  "fund_id": "43a29512-fa42-4d17-a2d1-1db8adbc969d",
  "deposit_timestamp": 1750412525409770895,
  "transaction_id": "0x67e1f4744b8d7970a94ef277cebcca29d30081fd49f80d5f1d7ef0a98a58b6a3",
  "account_label": "general",
  "success": false,
  "reason": "deposit below minimum threshold. The deposit has not been converted to fiat and the crypto has been credited to the customer's account"
}
```

#### 

Asset not supported

It's possible (albeit rare) that an asset is supported by the Account Funding product and is later removed. The Platform will receive this webhook:

JSON

```
{
  "participant_code": "CUST01",
  "fund_asset": "AAVE",
  "source_address": "0xd3c5967d94d79F17bDc493401c33f7e8897c5f89",
  "deposit_address": "0x34f53Aea3ba8b60B0ed19106baF43A4f3F73f249",
  "quantity": "0.038458410203610700",
  "fund_id": "983b1f3e-d765-45e7-9c0d-6880b46230do",
  "deposit_timestamp": 1750409584995943453,
  "transaction_id": "0x12708481e7fa507c97399d30dbd78195b3bd57cdfe65b9dbef4738a83c452a69",
  "account_label": "general",
  "success": false,
  "reason": "asset deposited is not supported by the fund workflow. The deposit has not been converted to fiat and the crypto has been credited to the customer's account"
}
```

#### 

Stablecoin depegged

Historically, and rarely, stablecoins have become depegged from their reserve currency. In this event, zerohash will not be converting deposits into fiat. In this scenario the Platform will receive this webhook:

JSON

```
{
  "participant_code": "CUST01",
  "fund_asset": "USDC.DOTHUB",
  "source_address": "5Frg83Nvor1hocqKeEgWY4GSH4DcjageJfGDUuXdYR9Xd2mt",
  "deposit_address": "5EwkTCkqkSKA2DuweCm3hKLR1EhcdYLcSdN8NMxUDmmtNaHt",
  "quantity": "1.490000",
  "fund_id": "3a05f013-6364-4423-8573-e66d9bfdc147",
  "deposit_timestamp": 1750419470756259744,
  "transaction_id": "0xdfb0dfcb37a89ad4b3499c5c54acc603a2b547cdda5c2d5218131359f0e580d4",
  "account_label": "general",
  "success": false,
  "reason": "USDC.DOTHUB conversions are currently halted. The deposit has not been converted to fiat and the crypto has been credited to the customer's account"
}
```

### 

Query Account Funding transactions

It may be helpful (or likely required) to display crypto or stablecoin deposits in the Transaction History (or like page) on your application. You can use the [GET /fund/transactions](https://docs.zerohash.com/reference/get_fund-transactions) endpoint to query all completed Account Funding events. View the [code recipe](https://docs.zerohash.com/recipes/fund-get-transactions) for additional assistance.

### 

Customer receives email

zerohash is required to ensure that each Customer receives an email receipt for all transactions. zerohash will handle this and send an email in the following scenarios (same scenarios as webhooks):

- Success
- Failure - Platform not enabled
- Failure - Customer not approved
- Failure - Deposit above maximum
- Failure - Deposit below minimum
- Failure - Asset not supported
- Failure - Stablecoin depegged

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

Reconciliation

If you're using this product in tandem with our Buy/Sell product, see [Account Funding + Buy/Sell Reconciliation](https://docs.zerohash.com/docs/account-funding-reconciliation).

## 

Platform settlement

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

The recommended way to track the impending settlement amount is to query the [GET /accounts/{account\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_id}](https://docs.zerohash.com/reference/get_accounts-account-id) endpoint. In order to retrieve the correct `account_id` to use in that call, use the following query parameters when hitting the [GET /accounts](https://docs.zerohash.com/reference/get_accounts) endpoint:

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

Note that the `balance` will refresh to 0 each time zerohash initiates the daily settlement wire.

### 

Retroactively querying settlements in the past

Platform settlements are technically a `withdrawal`. In order to query settlements from the past, use the [GET /withdrawals/requests](https://docs.zerohash.com/reference/get_withdrawals-requests) endpoint. The response will show all withdrawals made from the Platform's account.

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

See core product page [here](https://docs.zerohash.com/docs/fund-overview)

# 

Setup

In this guide, the Platform is [setup](https://docs.zerohash.com/docs/fund-overview#setup) to use the zerohash europe B.V. **Onboarding SDK (KYC as a Service)** with the zerohash europe B.V. **Account Funding SDK**. Both SDKs are hosted on web-sdk.zerohash.eu.

![](https://files.readme.io/6030ec482a4d30237d669fb784a5f9efd465d88a6a3aa1c7c491eca913af3b5a-image.png)

# 

Flow

In this example, the Platform is configured to have the converted USD be automatically transferred to the Platform's account. We'll also assume that the Platform is a CFD brokerage offering stablecoins as a funding mechanism. Summary of all involved participants:

- Platform (participant\_code: PLAT01)
- End Customer (participant\_code: CUST01)

## 

Webhook configuration

Talk to your zerohash representative to have your Platform configured for the following webhooks:

- Onboarding
- Fund

## 

Onboarding

### 

Retrieve Account Funding JWT token

In order to successfully invoke the Access Token, you'll need to supply a `participant_code` for the End Customer (see endpoint API Reference [here](https://docs.zerohash.com/reference/post_client-auth-token)). Please note that this customer must be in an `approved` status for this call to succeed. **Please note:** the correct permission to pass here is `participant-profile`.

The Customer will then be prompted to fill out their onboarding details.

### 

Receive Webhook event

Once the Customer has successfully completed the onboarding flow, the Platform will receive a series of webhooks, most typically like:

JSON

```
{  
  "participant_code": "CUST01",  
  "participant_status": "submitted",  
  "timestamp": 1670958435349  
}
```

Then a few seconds later, the Customer receives approval:

JSON

```
{  
  "participant_code": "ABC123",  
  "participant_status": "approved",  
  "timestamp": 1670958435375  
}
```

The `participant_code` should be used in the next SDK flow:

## 

Initialize Account Funding Flow

### 

Retrieve Account Funding JWT token

In order to successfully invoke the Access Token, you'll need to supply a `participant_code` for the End Customer (see full instructions [here](https://docs.zerohash.com/reference/post_client-auth-token)). This customer must be in an `approved` status for this call to succeed. **Please note:** the correct permission to pass here is `fwc`.

You may also include an optional `reference_id` value when generating the token. This ID will be tied to all future webhook calls and Account Funding events within the [GET /fund/transactions](https://docs.zerohash.com/reference/post_fund-rfq) response.

### 

Invoke the Account Funding SDK

See [SDK guide](https://docs.zerohash.com/reference/fund-sdk) for technical instructions.

### 

Success case - receive webhook

Upon a successful deposit and immediate and automatic conversion to fiat, the Platform will receive a [webhook](https://docs.zerohash.com/reference/fund-transaction-update):

JSON

```
{
  "participant_code": "CUST01",
  "fund_asset": "USDC",
  "rate": "1",
  "quoted_currency": "USD",
  "source_address": "0xd3c5967d94d79F17bDc493401c33f7e8897c5f83",
  "deposit_address": "0x34f53Aea3ba8b60B0ed19106baF43A4f3F73f244",
  "quantity": "7.47",
  "notional": "6.47",
  "fund_id": "363b5b15-02bd-4797-892f-8baa4eec60d2",
  "fund_timestamp": 1750404905186631445,
  "deposit_timestamp": 1750404905037719568,
  "transaction_id": "0xcd9e98ae631cf7cfcf4d351374337a55096abd01d9637303aaef31d5c0766562",
  "account_label": "general",
  "success": true,
  "reference_id": "c098e59b-8023-4477-8b63-68fda3c53a39",
	"deposit_fee_type": "flat" 
}
```

### 

Failure cases - receive webhook

#### 

Platform not enabled

If the Platform discontinues their support for the Account Funding product, or otherwise no longer is configured to use the product, the Platform will receive a webhook that looks like this:

JSON

```
{
  "participant_code": "CUST01",
  "fund_asset": "USDC.ETH",
  "quoted_currency": "USD",
  "source_address": "0x3A45a60c62EE6cD616B1C4510404Eba88116044I", 
  "deposit_address": "0x3A45a60c635E6cD616B1C4510404Eba88116050C",
  "quantity": "500",
  "fund_id": "5155f7c9-95cb-4556-ab89-c178943a7111",
  "deposit_timestamp": 1750413892268466189,
  "transaction_id": "a07407e8f98c21b037b4aa0cbc852b8489c5e122fcc3d4b33b7827d0605ad8ff",
  "account_label": "general",
  "success": false,
  "reason" : "Your platform is no longer configured to use this product. The deposit has not been converted to fiat and the crypto has been credited to the customer's account"
}
```

#### 

End Customer not approved

If the End Customer has transitioned to a status other than `approved` (which could be as a result of a routine zerohash Compliance review) and they make a deposit, the Platform will receive this webhook:

JSON

```
{
  "participant_code": "CUST01",
  "fund_asset": "USDC.ETH",
  "quoted_currency": "USD",
  "source_address": "0x3A45a60c62EE6cD616B1C4510404Eba88116044I", 
  "deposit_address": "0x3A45a60c635E6cD616B1C4510404Eba88116050C",
  "quantity": "500",
  "fund_id": "5155f7c9-95cb-4556-ab89-c178943a7111",
  "deposit_timestamp": 1750413892268466189,
  "transaction_id": "a07407e8f98c21b037b4aa0cbc852b8489c5e122fcc3d4b33b7827d0605ad8ff",
  "account_label": "general",
  "success": false,
  "reason" : "This participant is not in an approved state. The deposit has not been converted to fiat and the crypto has been credited to the customer's account"
}
```

#### 

Deposit above maximum

If an End Customer deposits an amount above the maximum configured amount, the Platform will receive this webhook:

JSON

```
{
  "participant_code": "CUST01",
  "fund_asset": "USDC",
  "source_address": "0xd3c5967d94d79F17bDc493401c33f7e8897c5f88",
  "deposit_address": "0x34f53Aea3ba8b60B0ed19106baF43A4f3F73f248",
  "quantity": "26.900000",
  "fund_id": "99c2fc0a-3a28-4aa4-adbf-8743a0c362fo",
  "deposit_timestamp": 1750413892268466189,
  "transaction_id": "0xa06b16064984eb35b170f53896eb3263e1ac4d1bd79f592d9a0e993c58278629",
  "account_label": "general",
  "success": false,
  "reason": "deposit above maximum threshold. The deposit has not been converted to fiat and the crypto has been credited to the customer's account"
}
```

#### 

Deposit below minimum

If an End Customer deposits an amount below the minimum configured amount, the Platform will receive this webhook:

JSON

```
{
  "participant_code": "CUST01",
  "fund_asset": "USDC",
  "source_address": "0xd3c5967d94d79F17bDc493401c33f7e8897c5f81",
  "deposit_address": "0x34f53Aea3ba8b60B0ed19106baF43A4f3F73f242",
  "quantity": "0.990000",
  "fund_id": "43a29512-fa42-4d17-a2d1-1db8adbc969d",
  "deposit_timestamp": 1750412525409770895,
  "transaction_id": "0x67e1f4744b8d7970a94ef277cebcca29d30081fd49f80d5f1d7ef0a98a58b6a3",
  "account_label": "general",
  "success": false,
  "reason": "deposit below minimum threshold. The deposit has not been converted to fiat and the crypto has been credited to the customer's account"
}
```

#### 

Asset not supported

It's possible (albeit rare) that an asset is supported by the Account Funding product and is later removed. The Platform will receive this webhook:

JSON

```
{
  "participant_code": "CUST01",
  "fund_asset": "AAVE",
  "source_address": "0xd3c5967d94d79F17bDc493401c33f7e8897c5f89",
  "deposit_address": "0x34f53Aea3ba8b60B0ed19106baF43A4f3F73f249",
  "quantity": "0.038458410203610700",
  "fund_id": "983b1f3e-d765-45e7-9c0d-6880b46230do",
  "deposit_timestamp": 1750409584995943453,
  "transaction_id": "0x12708481e7fa507c97399d30dbd78195b3bd57cdfe65b9dbef4738a83c452a69",
  "account_label": "general",
  "success": false,
  "reason": "asset deposited is not supported by the fund workflow. The deposit has not been converted to fiat and the crypto has been credited to the customer's account"
}
```

#### 

Stablecoin depegged

Historically, and rarely, stablecoins have become depegged from their reserve currency. In this event, zerohash will not be converting deposits into fiat. In this scenario the Platform will receive this webhook:

JSON

```
{
  "participant_code": "CUST01",
  "fund_asset": "USDC.DOTHUB",
  "source_address": "5Frg83Nvor1hocqKeEgWY4GSH4DcjageJfGDUuXdYR9Xd2mt",
  "deposit_address": "5EwkTCkqkSKA2DuweCm3hKLR1EhcdYLcSdN8NMxUDmmtNaHt",
  "quantity": "1.490000",
  "fund_id": "3a05f013-6364-4423-8573-e66d9bfdc147",
  "deposit_timestamp": 1750419470756259744,
  "transaction_id": "0xdfb0dfcb37a89ad4b3499c5c54acc603a2b547cdda5c2d5218131359f0e580d4",
  "account_label": "general",
  "success": false,
  "reason": "USDC.DOTHUB conversions are currently halted. The deposit has not been converted to fiat and the crypto has been credited to the customer's account"
}
```

### 

Query Account Funding transactions

It may be helpful (or likely required) to display crypto or stablecoin deposits in the Transaction History (or like page) on your application. You can use the [GET /fund/transactions](https://docs.zerohash.com/reference/get_fund-transactions) endpoint to query all completed Account Funding events. View the [code recipe](https://docs.zerohash.com/recipes/fund-get-transactions) for additional assistance.

### 

Customer receives email

zerohash is required to ensure that each Customer receives an email receipt for all transactions. zerohash will handle this and send an email in the following scenarios (same scenarios as webhooks):

- Success
- Failure - Platform not enabled
- Failure - Customer not approved
- Failure - Deposit above maximum
- Failure - Deposit below minimum
- Failure - Asset not supported
- Failure - Stablecoin depegged

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

Reconciliation

If you're using this product in tandem with our Buy/Sell product, see [Account Funding + Buy/Sell Reconciliation](https://docs.zerohash.com/docs/account-funding-reconciliation).

## 

Platform settlement

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

The recommended way to track the impending settlement amount is to query the [GET /accounts/{account\\\_id}](https://docs.zerohash.com/reference/get_accounts-account-id) endpoint. In order to retrieve the correct `account_id` to use in that call, use the following query parameters when hitting the [GET /accounts](https://docs.zerohash.com/reference/get_accounts) endpoint:

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

Note that the `balance` will refresh to 0 each time zerohash initiates the daily settlement wire.

### 

Retroactively querying settlements in the past

Platform settlements are technically a `withdrawal`. In order to query settlements from the past, use the [GET /withdrawals/requests](https://docs.zerohash.com/reference/get_withdrawals-requests) endpoint. The response will show all withdrawals made from the Platform's account.

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

Updated 6 days ago

---

Did this page help you?

Yes

No

Copy Page