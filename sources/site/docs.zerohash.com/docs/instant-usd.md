# Source: https://docs.zerohash.com/docs/instant-usd

# 

Onboarding

Platforms must use zerohash Powered Plaid Link or Self Service Plaid Link to verify and link end customer bank accounts. Once an external account has been created and linked to a Participant account, Platforms can make ACH deposited funds instantly available to the end customer using zerohash Instant USD.

# 

Request an Instant Fiat Deposit

[POST /fund/deposit](https://docs.zerohash.com/reference/post_fund-deposit-1)

### 

Sample Request

JSON

```
{
	'message': {
        'participant_code': 'ABC123',
        'external_account_id': '0f68333e-2114-469d-b505-c850d776e063',
        'asset': 'USD',
        'amount': '150.00',
    		'description': 'COMPANY0',
				'network': 'ach',
				'instant': true
	}
}
```

### 

Sample Response

JSON

```
{
  'message': {
    'request_id': '0f65678e-2114-469d-b505-c850d776e078',	
    'participant_code': 'ABC123',
    'external_account_id': '0f68333e-2114-469d-b505-c850d776e063',
    'asset': 'USD',
    'amount': '150.00',
    'description': 'COMPANY0',
    'transaction_id': '0f34533e-2114-469d-b505-c850d776e061',
    'status': 'submitted',
    'created_at': 1561996924964
  }
}
```

# 

Available Balance

It can take 3-5 days for ACH transactions to settle. In the meantime, zerohash offers end customers an immediate available balance to make trades. In the Instant ACH flow, funds are immediately transferred from the platform float to the participants available balance. The platform can expect to receive a transfer webhook with the following information:

JSON

```
{
    "account_group": "F12JE6",
    "account_label": "general",
    "account_type": "available",
    "asset": "USD",
    "balance": "5",
    "movements": [
        {
            "account_id": "efeb40fe-aaf1-4132-8fbc-036e7612f7db",
            "change": "5",
            "movement_id": "b96daa8d-960a-4c50-acc1-af9c1c9c178b",
            "movement_timestamp": 1746112183373,
            "movement_type": "transfer",
            "transfer_request_id": "339910",
            "transfer_type": "trade_allocation"
        }
    ],
    "participant_code": "45JM2Q",
    "run_id": "4150531",
    "run_type": "transfer",
    "timestamp": 1746112183373
}
```

# 

Buy Crypto with USD Instantly

End customers are immediately able to purchase crypto using the available balance in their participant account with zerohash’s [CLOB liquidity endpoints](https://docs.zerohash.com/reference/central-limit-order-book).

Crypto buy orders will settle immediately even if the ACH deposit has not settled. Platforms will receive web hooks for both events that look like this:

### 

ACH Deposit Settlement

zerohash returns a webhook with `'status': 'settled'` when an ACH deposit clears.

JSON

```
{
  'message': {
    'request_id': '0f65678e-2114-469d-b505-c850d776e078',	
    'participant_code': 'ABC123',
    'external_account_id': '0f68333e-2114-469d-b505-c850d776e063',
    'asset': 'USD',
    'amount': '150.00',
    'description': 'COMPANY0',
    'transfer_type': 'debit',
    'transaction_id': '0f34533e-2114-469d-b505-c850d776e061',
    'status': 'settled',
    'created_at': 1561996924964
  }
}
```

### 

Crypto Buy Settlement

zerohash returns a webhook with `'trade_state': 'terminated'` when an buy order settles. Find more information on trade webhooks [here](https://docs.zerohash.com/reference/trade-status).

JSON

```
{
    "client_trade_id": "b3fbcf52-95f9-4624-9309-4f1306bdb176",
    "contract_size": "1",
    "market_identifier_code": "SCXM",
    "origin": "liquidity",
    "parties": [
        {
            "account_label": "general",
            "amount": "10",
            "asset": "USD",
            "participant_code": "PART1",
            "settling": true,
            "side": "sell"
        },
        {
            "account_label": "inventory",
            "amount": "0.0057236",
            "asset": "ETH",
            "participant_code": "00SCXM",
            "settling": true,
            "side": "buy"
        }
    ],
    "parties_anonymous": false,
    "physical_delivery": true,
    "platform_code": "00SCXM",
    "product_type": "spot",
    "quoted_currency": "USD",
    "symbol": "ETH/USD",
    "timestamp": 1745554838289,
    "total_notional": "10.00",
    "trade_id": "26d68f16-f9d2-4ab3-847e-bccf6f03a35e",
    "trade_price": "1747.1521420085261025",
    "trade_quantity": "0.0057236",
    "trade_reporter": "00SCXM",
    "trade_reporter_code": "00SCXM",
    "trade_state": "terminated",
    "trade_type": "regular",
    "transaction_timestamp": 1745554838000,
    "underlying": "ETH"
}
```

JSON

```
{
  'message': {
    'request_id': '0f65678e-2114-469d-b505-c850d776e078',	
    'participant_code': 'ABC123',
    'external_account_id': '0f68333e-2114-469d-b505-c850d776e063',
    'asset': 'USD',
    'amount': '150.00',
    'description': 'COMPANY0',
    'transaction_id': '0f34533e-2114-469d-b505-c850d776e061',
    'status': 'submitted',
    'created_at': 1561996924964
  }
}
```

### 

Payment Statuses

| Status | Description | Final? |
| --- | --- | --- |
| `submitted` | Transaction request has been received | \- |
| `pending_trade` | Transaction request has been approved, but the associated trade has not terminated. | \- |
| `pending` | The associated trade has terminated and the fiat payment has been initiated | \- |
| `posted` | Transaction has settled and cleared any applicable hold days. Transaction will be reconciled with internal ledger. | \- |
| `settled` | Transaction is complete and funds have been credited to platform float | ✔️ |
| `canceled` | ACH On-demand transactions can not be canceled | ✔️ |
| `failed` | Transaction request failed, no payment was initiated | ✔️ |
| `rejected` | Transaction request was rejected due to velocity checks, no payment was initiated | ✔️ |
| `returned` | Transaction request was initially approved but the ACH has returned unsuccessfully, before the transaction reached a 'Settled' state | ✔️ |
| `returned_settled` | Transaction request was initially approved but the ACH has returned unsuccessfully, after the transaction reached a 'Settled' state | ✔️ |

> 📘
> 
> ### 
> 
> Final states
> 
> States marked are all possible end-states for a transaction, though a transaction can move from `settled` → `returned`

# 

ACH Returns

Platforms must maintain a funded loss reserve and float account. When an ACH deposit fails, the participant account’s balance and buying power will be deducted accordingly. If buying power has already been used to initiate a crypto buy order, the pending order will be canceled. Losses will be recovered from the Platform.

- If an ACH fails before settlement and buying power has been used to purchase an asset, zerohash will seize it from the participant account, liquidate it, and recover any losses from the Platform’s float account.
- If an ACH is returned after settlement and funds cannot be recovered from the participant account, zerohash will recover losses from the Platform’s loss reserve account.

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page