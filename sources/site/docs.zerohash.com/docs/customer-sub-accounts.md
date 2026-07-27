# Source: https://docs.zerohash.com/docs/customer-sub-accounts

# 

Summary

It's common for platforms to offer their customers the ability to create multiple accounts. For instance, a brokerage may allow customers to open separate trading accounts for tax optimization, risk management, differentiated trading strategies, or to simply organize investments by distinct goals. But they all stem from the same customer (ie, a one-to-many relationship between the customer and the accounts).

zerohash provides the flexibility to segregate transactions based on the specific account in use.

# 

How it Works

The `account_label` parameter can be used in both the Account Funding SDK and the Withdraw SDK to instruct zerohash which account to ledger the movements to.

## 

Funding

### 

1\. Acquire access token

Acquire an access token specifying an `account_label` on the call like so:

JSON

```
{  
    "participant_code": "CUST01",  
    "permissions": ["fwc"],  
    "deposit_details": {  
        "account_label": "account_label_example_1"  <-- Platform-defined sub-account identifier
    }
}
```

### 

2\. End Customer Makes Deposit

End Customer deposits 100 USDC to the above address from their external wallet (ie, Metamask).

### 

3\. zerohash processes deposit

- Once the asset confirms on-chain, zerohash will recognize the deposit in the End Customer’s account with `account_label` = `account_label_example_1`
- zerohash will auto-convert to USD
- zerohash will auto-sweep to the Platform account. Example ledger (see our accounts page for a refresher on [account](https://docs.zerohash.com/docs/what-is-an-account) anatomy):

| participant\_code | account\_group | account\_label | movement\_type | asset | change |
| --- | --- | --- | --- | --- | --- |
| CUST01 | PLAT01 (assume this is the Platform's `participant_code`) | account\_label\_example\_1 | deposit | USDC | +100 |
| CUST01 | PLAT01 | account\_label\_example\_1 | final\_settlement | USDC | \-100 |
| CUST01 | PLAT01 | account\_label\_example\_1 | final\_settlement | USD | +100 |
| CUST01 | PLAT01 | account\_label\_example\_1 | transfer | USD | \-100 |
| PLAT01 | PLAT01 | general | transfer | USD | +100 |

- zerohash will send a **webhook** to the platform, specifically calling out `account_label` = `account_label_example_1`. Example message:

JSON

```
{
  "participant_code": "CUST01",
  "fund_asset": "USDC",
  "rate": "1",
  "quoted_currency": "USD",
  "source_address": "0x3A45a60c62EE6cD616B1C4510404Eba88116044I",
  "deposit_address": "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
  "quantity": "500",
  "notional": "500",
  "fund_id": "5155f7c9-95cb-4556-ab89-c178943a7111",
  "fund_timestamp": 1550174574,
  "transaction_id": "a07407e8f98c21b037b4aa0cbc852b8489c5e122fcc3d4b33b7827d0605ad8ff",
  "account_label": "account_label_example_1",
  "success": true,
  "reason" : "",
}
```

### 

4\. Platform retroactively queries Account Funding transactions

The Platform can also query the [GET /fund/transactions](https://docs.zerohash.com/reference/get_fund-transactions) and view the transactions tagged with the appropriate `account_label`

JSON

```
{
  "message": [
    {
      "participant_code": "CUST01",
      "fund_asset": "USDC.BASE",
      "deposited_asset": "USDC.BASE",
      "rate": "1",
      "quoted_currency": "USD",
      "source_address": "0xA32A6aA6a3B87b49BeaB01393e2020C3C191CD61",
      "deposit_address": "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
      "quantity": "100",
      "notional": "100",
      "fund_id": "29e6d7b8-d604-4212-86ee-998fef35505e",
      "fund_timestamp": 1708631671631,
      "deposit_timestamp": 1708631681631,
      "transaction_id": "ec963207-69f4-44d0-9251-2977dda86fcd",
      "account_label": "account_label_example_1",
      "success": true,
      "status_reason": "success"
    }
  ],
  "page": 1,
  "page_size": 50,
  "total_pages": 1
}
```

## 

Withdrawals

### 

1\. Acquire access token for Account Link SDK

Summon the [Account Link SDK](https://docs.zerohash.com/docs/wallet-link-sdk-integration-guide) using the `crypto-account-link` `permission`. The `account_label` concept has not been introduced yet.

> 📘
> 
> ### 
> 
> The Customer (ie, the `participant_code`) will have a single, "global" withdrawal account for each asset and network. From there, each withdraw can be tagged with the `account_label` of your choice

### 

2\. Acquire access token for Withdraw SDK

After the End Customer has linked an account, the Platform will then initiate the [Withdraw SDK](https://docs.zerohash.com/docs/wallet-link-sdk-integration-guide), specifying an `account_label` of `account_label_example_1`, for example. Example payload:

JSON

```
{
    "participant_code": "CUST01", 
    "permissions": ["crypto-withdrawals"],
    "withdrawal_details": {
      "quoted_asset": "USD",
      "withdrawal_request_amount": "100",
      "external_account_id": "cda673db-0334-4151-a80e-8a87015493a4",
      "account_label": "account_label_example_1"
    },
    "reference_id": "5fc7d17d-53d4-480a-a30d-426e29c2ac65"
```

### 

3\. End Customer makes a withdrawal

- The End Customer will initiate the withdraw on the SDK
- zerohash will auto-convert USD into the asset, ie USDC.BASE
- zerohash will auto-disburse the asset to the address associated with the `external_account_id`

Example ledger:

| participant\_code | account\_group | account\_label | movement\_type | asset | change |
| --- | --- | --- | --- | --- | --- |
| CUST01 | PLAT01 | account\_label\_example\_1 | final\_settlement | USDC | +100 |
| CUST01 | PLAT01 | account\_label\_example\_1 | withdrawal | USDC | \-100 |

- zerohash will send a [webhook](https://docs.zerohash.com/reference/payments-status-changes) populating the applicable `account_label`

Example payload:

JSON

```
{
	"payment_id": "679ee352-7705-4425-ab4a-16a3d18c1d90",
	"obo_participant": {
		"participant_code": "CUST01",
		"account_group": "PLAT01",
		"account_label": "general"
	},
	"payment_details": {
		"withdrawal_request_id": "f32a000e-fd71-42b5-ac03-5b23337aa833",
		"trade_id": "186b3b03-e625-4e3e-a5b1-80f0c43073ce",
		"on_chain_transaction_id": "",
		"network_fee_notional": "0.0",
		"network_fee_quantity": "0.0",
		"destination_address": "0x41D9A0Ee3a917Etmn6182C030dC9f15497eCl22V"
	},
	"asset": "USDC",
	"network": "BASE",
	"payment_type": "payout",
	"external_account_id": "cda673db-0334-4151-a80e-8a87015493a4",
	"participant_code": "CUST01",
	"quantity": "100",
	"status": "posted",
	"created_at": "2024-09-26T13:05:22.657Z",
	"updated_at": "2024-09-26T13:05:22.657Z",
	"total": "100",
	"account_label": "account_label_example_1" <-- NEW
```

### 

4\. Platform retroactively queries withdrawals

The Platform can retroactively query the [GET /payments](https://docs.zerohash.com/reference/get_payments) or [GET /payments/{payment\_id}](https://docs.zerohash.com/reference/get_payments-payment-id) endpoint and see the transaction metadata with the correct `account_label` populated. Example response:

JSON

```
{
    "request_id": "53fb4efd-bf98-4a48-8d89-11097983793e",
    "message": [
        {
            "external_account_id": "cda673db-0334-4151-a80e-8a87015493a4",
            "account_nickname": "",
            "participant_code": "CUST01",
            "platform_code": "PLAT01",
            "created_at": "2024-10-26T01:11:49.077Z",
            "updated_at": "2024-10-26T01:11:49.149Z",
            "status": "approved",
            "status_reason": "",
            "type": "crypto",
            "account_label": "account_label_example_1",
            "details": {
                "network": "BASE",
                "supported_assets": [
                    "USDC"
                ],
                "address": "0x41D9A0Ee3a917Etmn6182C030dC9f15497eCl22V",
                "destination_tag": ""
            }
}
```

Updated about 2 months ago

---

Did this page help you?

Yes

No

Copy Page