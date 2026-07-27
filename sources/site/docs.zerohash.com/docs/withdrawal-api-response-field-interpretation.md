# Source: https://docs.zerohash.com/docs/withdrawal-api-response-field-interpretation

Platforms can use the `GET /withdrawals/requests` and `GET /withdrawals/requests/:id` endpoint to consume important information related to fiat or crypto withdrawals. See below use cases to see what fits your Zero Hash integration:

## 

Status Field

Use case: Has the balance been deducted from the zerohash ledger?

Tracks ledger state:

- `PENDING_TRADE`: Associated trade not yet terminated (convert\_withdraw only)
- `PENDING`: Request created, awaiting approval
- `APPROVED`: Approved but not yet settled
- `REJECTED`: Request rejected (terminal state)
- `SETTLED`: Funds deducted from participant

## 

`on_chain_status` Field

Use case: Has the withdrawal has been confirmed on-chain (crypto)?

Tracks blockchain state:

- PENDING: Broadcasted but not yet confirmed
- CONFIRMED: Sufficiently confirmed per blockchain thresholds

Note: Internal transactions show `CONFIRMED` despite not occurring on-chain.

## 

Key Response Fields

```
{  
  "request_id": "...",  
  "withdrawal_request_id": "27669",  
  "status": "SETTLED",  
  "on_chain_status": "CONFIRMED",  
  "transaction_id": "0x123...",  
  "amount": "100",  
  "network_fee": "0.000158",  
  "network_fee_asset": "USDC.SOL",  
  "fee_amount": "0.000158",  
  "amount_notional": "100.00",  
  "network_fee_notional": "0.05"  
}
```

- `transaction_id`: On-chain transaction hash
- `fee_amount`: Actual network fee paid
- `*_notional`: USD equivalent values

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page