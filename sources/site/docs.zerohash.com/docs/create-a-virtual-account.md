# Source: https://docs.zerohash.com/docs/create-a-virtual-account

# 

Flow 1 - Deposit, store balance, and transact later

## 

Create Virtual Account

Begin by creating a virtual account for your customer. For this example, we'll assume an **Individual**.

Example `POST /payments/internal_accounts` request:

JSON

```
{
  "participant_code": "CUST01",
  "currency": "USD",
  "account_type": "virtual_account"
}
```

Response:

JSON

```
{
  "participant_code": "CUST01",
  "currency": "USD",
  "account_type": "virtual_account",
  "status": "approved",
  "internal_account_id": "6f2e3b40-4d9c-11ee-be56-0242ac120002",
  "account_number": "9876543210",
  "routing_number": "021000021"
}
```

Notes:

- You'll receive an `internal_account_status_changed` webhook if the request is successful.
- zerohash will reject any requests where the `participant_code` is not in an `approved` state.
- The `internal_account_id` has been created, uniquely identifying the account in the zerohash system. This ID will be used in subsequent API calls to move money.
- The `account_number` and `routing_number` fields represent the true bank account that has been created on the back-end

## 

Deposit

When funds arrive at the virtual account, you'll receive an `account_balance.changed` webhook message, letting you know that the account has been credited.

The Individual can now hold funds in this account for as long as they want.

## 

Connect External Account

To prepare to convert fiat to stablecoins and withdraw externally, you should connect an external account to the Individual via the [POST /payments/external\_accounts](https://docs.zerohash.com/reference/post_payments-external-accounts) endpoint. Example request:

JSON

```
{
	"participant_code": "CUST01",
	"type": "crypto", 
	"details": {
		"network": "SOL",
		"supported_assets": ["USDC"],
		"address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
	}
}
```

Response:

JSON

```
{
    "request_id": "a9e2c6fb-f738-4ecb-986c-befd70678707",
    "external_account_id": "107e8a2a-c835-4b76-b49d-a633d45727b9",
    "participant_code": "CUST01",
    "platform_code": "PLAT01",
    "account_nickname": "",
    "created_at": "2024-10-11T00:52:21.865Z",
    "status": "pending",
    "type": "crypto",
    "details": {
        "network": "SOL",
        "supported_assets": [
            "USDC"
        ],
        "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        "destination_tag": ""
    }
}
```

## 

Convert and Withdraw

When the user wants to convert fiat to stablecoins and withdraw externally, they will call the `POST /payments`endpoint. Example request:

> ❗️
> 
> ### 
> 
> Notice that the internal\_account\_id is specified, letting zerohash know that the source account used to make the conversion should be the virtual account

JSON

```
{
  "participant_code": "BENEF1",
  "obo_participant": {
    "participant_code": "PAYOR1",
    "account_group": "PLAT01",
    "account_label": "general"
  },
  "external_account_id": "2cc93b20-ee43-4877-8cdc-863e61829015",
  "asset": "USDC", 
  "quoted_asset": "USD",
  "total": "125.50",
  "payment_type": "payout",
  "description": "",
  "source_account": {
    "internal_account_id": "6f2e3b40-4d9c-11ee-be56-0242ac120002"
  }
}
```

Immediately after a successful request, zerohash will immediately convert the USD from the virtual account and disburse the funds to the `address` associated with the `external_account`

# 

Flow 2 - Deposit, and automatically convert → disburse

## 

Overview

This flow shows how to create a virtual account linked to a customer that is enabled for automatic fiat-to-stablecoin conversions and disbursements. This simplifies fund management by automating the conversion and payout processes.

## 

Create Virtual Account

Example `POST /payments/internal_accounts` request:

JSON

```
{  
  "participant_code": "CUST01",  
  "currency": "USD",  
  "account_type": "virtual_account",  
  "enable_auto_conversion_withdraw": true,
  "external_account_id": "2cc93b20-ee43-4877-8cdc-863e61829015",
}
```

Response:

JSON

```
{
  "participant_code": "CUST01",
  "currency": "USD",
  "account_type": "virtual_account",
  "status": "approved",
  "internal_account_id": "6f2e3b40-4d9c-11ee-be56-0242ac120002",
  "account_number": "9876543210",
  "routing_number": "021000021",
  "enable_auto_conversion_withdraw": true  
}
```

> ❗️
> 
> ### 
> 
> Setting `enable_auto_conversion_true` to true activates automatic processing, including conversion of incoming USD deposits to stablecoins and scheduled disbursements to linked external accounts.

## 

Deposit

When a deposit arrives, zerohash will automatically and immediately convert the USD to the stablecoin associated with the `external_account_id` and disburse the funds to the `address` associated with the `external_account`

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page