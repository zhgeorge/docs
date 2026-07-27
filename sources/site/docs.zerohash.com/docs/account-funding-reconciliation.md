# Source: https://docs.zerohash.com/docs/account-funding-reconciliation

# 

Context

This guide outlines the reconciliation process for two distinct products - Account Funding and Buy/Sell - each of which generates independent trading activity and settlement amounts. While these products operate separately, they ultimately contribute to a single net settlement value that determines whether a wire transfer is required from your platform or needs to be initiated by us. This document is intended for technical and finance teams who need to accurately match transaction-level data, validate fund flows, and reconcile trade activity with settlement outcomes. A clear understanding of how each product contributes to the overall net wire amount is critical for maintaining accounting accuracy and operational efficiency.

# 

Data Objects

- A **trade** represents a conversion of 2 assets. You can query them via [GET /trades](https://docs.zerohash.com/reference/get_trades) or [GET /trades/{trade\_id}](https://docs.zerohash.com/reference/get_trades-trade-id).
- A **fund event** represents a successful account funding (deposit) transaction. You can query them via [GET /fund/transactions](https://docs.zerohash.com/reference/get_fund-transactions). Successful **fund events** lead to a trade (because there is a conversion of the deposited asset into fiat).
- A **payment** can represent a few things at zerohash, but in the context of the Account Funding product, will .represent an account funding (withdrawal) transaction (Ie, someone withdrawing an asset to an external wallet). You can query them via [GET /payments](https://docs.zerohash.com/reference/get_payments) or [GET /payments/{payment\_id}.](https://docs.zerohash.com/reference/get_payments-payment-id)

# 

End to End Flow

## 

Deposits

- When an End Customer makes a deposit, zerohash will automatically and immediately convert the asset to fiat, creating a trade. Follow these steps in order to trace the fund event back to a trade:
 - **Step 1:** Consume the [fund event webhook](https://docs.zerohash.com/reference/fund-transaction-update) or query the [GET /fund/transactions](https://docs.zerohash.com/reference/get_fund-transactions) and look for the `fund_id` .
 - **Step 2:** Use the `fund_id` and query [GET /movements?parent\_link\_id=\[fund\_id\]](https://docs.zerohash.com/reference/get_movements). You'll see a `trade_id` in the response.
 - **Step 3:** Take this `trade_id` and query [GET /trades/{trade\_id}.](https://docs.zerohash.com/reference/get_trades-trade-id)

## 

Withdrawals

- When an End Customer initiates a withdrawal, zerohash will automatically and immediately convert fiat to the withdrawal asset via the payment object, creating a trade. Follow these steps in order to trace the payment back to a trade:
 - **Step 1:** Consume the [payments webhook](https://docs.zerohash.com/reference/payments-status-changes) or the [GET /payments](https://docs.zerohash.com/reference/get_payments) or [GET /payments/{payment\_id}](https://docs.zerohash.com/reference/get_payments-payment-id) endpoints and look for the `payment_id`.
 - **Step 2:** Use the `payment_id` and query [GET /movements?parent\_link\_id=\[payment\_id\]](https://docs.zerohash.com/reference/get_movements). You'll see a `trade_id` in the response. 
 **Step 3:** Take this `trade_id` and query [GET /trades/{trade\_id}.](https://docs.zerohash.com/reference/get_trades-trade-id)

Updated about 2 months ago

---

Did this page help you?

Yes

No

Copy Page