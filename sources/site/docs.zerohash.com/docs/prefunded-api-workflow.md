# Source: https://docs.zerohash.com/docs/prefunded-api-workflow

After you [Link a bank account](https://docs.zerohash.com/docs/link-a-bank-account), you can request fiat deposits and withdrawals. Fiat deposits debit the end customer bank account and credit their zerohash USD account. Fiat withdrawals debit the end customer zerohash USD account and credit their bank account.

Platforms must be on the Direct or Default liquidity model to use fiat deposits and withdrawals.

## 

Request a fiat deposit

[POST /payments](https://docs.zerohash.com/reference/post_payments)

### 

Sample request

JSON

```
{
	'message': {
        'participant_code': 'ABC123',
        'external_account_id': '0f68333e-2114-469d-b505-c850d776e063',
        'currency': 'USD',
        'amount': '150.00',
        'description': 'COMPANY0',
        'transfer_type': 'debit'
	}
}
```

### 

Sample response

JSON

```
{
  'message': {
    'request_id': '0f65678e-2114-469d-b505-c850d776e078',	
    'participant_code': 'ABC123',
    'external_account_id': '0f68333e-2114-469d-b505-c850d776e063',
    'currency': 'USD',
    'amount': '150.00',
    'description': 'COMPANY0',
    'transfer_type': 'debit',
    'transaction_id': '0f34533e-2114-469d-b505-c850d776e061',
    'status': 'submitted',
    'created_at': 1561996924964
  }
}
```

## 

Buy crypto with a funded USD account

Prefunded accounts leverage zerohash’s liquidity endpoints ( [GET /liquidity/rfq](https://docs.zerohash.com/reference/post_payments-rfq) and [POST /liquidity/execute](https://docs.zerohash.com/reference/post_payments-execute)). You may ignore sending an `account_label` as zerohash knows to default to the `general` account, as assigned when you reached [POST /payments](https://docs.zerohash.com/reference/post_payments).

## 

Sell crypto for USD

Selling acquired assets for USD follows the [GET /liquidity/rfq](https://docs.zerohash.com/reference/post_payments-rfq) and [POST /liquidity/execute](https://docs.zerohash.com/reference/post_payments-execute)) flows. Please ignore the `funding_details` and `ach_details` mentions. These are only applicable for a deprecated zerohash product.

## 

Withdraw USD to bank account

Withdrawing USD to a customer bank account follows the [POST /payments](https://docs.zerohash.com/reference/post_payments) flow, where `transfer_type = credit`.

## 

Check payment status

[GET /payments/status](https://docs.zerohash.com/reference/get_payments-status)

Shares the current status of a debit or credit payment. Platforms should use this endpoint to understand funds availability and make their own decisions on how/when to make funds available to end customers.

Understanding payment statuses follows the existing [GET /payments/status](https://docs.zerohash.com/reference/get_payments-status) flow.

### 

Request parameters

| Status | Description |
| --- | --- |
| submitted | Request received and validated |
| pending\_trade | Trade associated with the trade id is not terminated |
| pending | Balance and authorization confirmed with Plaid and transaction initialized |
| posted | Withdrawn from end customer account |
| settled | Hold period is over and funds have moved to the bank |
| cancelled | Transaction was proactively cancelled |
| failed | Transaction failed during the process |
| returned | Transaction was returned prior to settlement (reason listed in the reason\_code and reason\_description of the webhook - most often “insufficient funds”) |
| returned\_settled | Transaction was returned after settlement (reason listed in the reason\_code and reason\_description of the webhook) |
| rejected | Transaction request blocked for risk mitigation or contractual reasons |

### 

Sample response

JSON

```
{
  "message": [
    {
      "transaction_id": "0f68333e-2114-469d-b505-c850d776e061",
      "participant_code": "ALI123",
      "amount": "12.01",
      "status": "posted",
      "transfer_type": "credit",
      "bank_transfer_id": "0f68333e-2114-469d-b505-c850d776e061",
      "trade_id": "0f68333e-2114-469d-b505-c850d776e061",
      "trade_status": "terminated",
      "velocity_status": "pending",
      "velocity_failed_rule": "participant_transactions(in_flight_transfers_by_participant)",
      "created_at": "1975-08-19T23:15:30.000Z",
      "updated_at": "1975-08-19T23:15:30.000Z"
    }
  ],
  "page": 1,
  "total_pages": 1,
  "page_size": 200,
  "count": 10
}
```

#### 

ACH Pre-funded

| Status | Description | Final? |
| --- | --- | --- |
| `submitted` | Transaction request has been received | \- |
| `pending` | Transaction request has been approved and payment has been initiated | \- |
| `posted` | Transaction has settled and cleared any applicable hold days. Transaction will be reconciled with internal ledger. | \- |
| `settled` | Transaction is complete and funds have been made available to participant | ✔️ |
| `canceled` | Transaction request has been canceled, no payment was initiated | ✔️ |
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
> States marked are all possible end-states for a transaction, though a transaction can move from `settled` → `returned_settled`

### 

Webhook notifications

Webhooks let you know the status of a payment and if funds are available to the end customer or platform. The payload is a JSON object containing the following fields:

| Parameter | Description | Type |
| --- | --- | --- |
| participant\_code | The zerohash identifier for the customer requesting an Fiat transaction. | string |
| type | Indicates if the payment is a credit or a debit for the end customer | string |
| transaction\_id | The unique identifier generated by zerohash for the transaction. | string |
| payment\_status | The current status of the payment. See payment statuses for more. | string |
| reason\_code | The NACHA failure reason code (for ACH), if the payment\_status is returned. | string |
| reason\_description | The description matching the reason\_code, if the payment\_status is returned. | string |
| expected\_settlement\_date | For payment type of credit, when the funds are expected to settle to the end customer bank account. This is an approximation as receiving banks are ultimately responsible for posting the update. | string; YYYY-MM-DD format |

For more information on the payments webhooks, check out our documentation [here](https://docs.zerohash.com/reference/payments-1).

## 

ACH returns

ACH returns are available in [GET /payments/status](https://docs.zerohash.com/reference/get_payments-status) under the status `returned`. While webhooks share the reason for returns, currently the GET call does not include this information.

### 

Unauthorized returns

An unauthorized return means that the bank account owner has flagged an issue with the transaction. When these returns are received, zerohash immediately locks the end customer account in an effort to mitigate further risk. The zerohash compliance team must evaluate risk before moving the participant back to `approved`, or along to `disabled` (more on [participant statuses](https://docs.zerohash.com/docs/participant-statuses)).

[Participant status webhooks](https://docs.zerohash.com/reference/participant-status-updates) alert platforms to movements from approved to locked. In the case of unauthorized returns, those results share a `reason` of `ach`.

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page