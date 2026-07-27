# Source: https://docs.zerohash.com/changelog/usd1eth-and-wlfieth-now-available-across-trade-and-transact

[Back to All](https://docs.zerohash.com/changelog)

Added

## 

Release Details

**Release Date:** Jun 29, 2026

## 

Release Type

Informational, no action required from platforms

## 

Summary

zerohash is pleased to announce the addition of two new assets, expanding your trading and platform capabilities.

| Asset Name | Symbol | Notes |
| --- | --- | --- |
| USD1 on Ethereum | `USD1.ETH` | Not available in NY |
| World Liberty Financial | `WLFI.ETH` | Not available in NY |

## 

Availability

| Asset | RFQ | CLOB | Custody | Fund | Payments |
| --- | --- | --- | --- | --- | --- |
| `USD1.ETH` | ✔️ | ❌ | ✔️ | ✔️ | ✔️ |
| `WLFI.ETH` | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

- Environments: Both assets are live in both CERT and PROD environments.
- Geographic Restrictions: Both assets are not enabled in New York at this time.
- Effective Date: Immediately available using the symbols listed above.

---

## 

RFQ Endpoints Impacted

The following executable endpoints now support the above assets:

### 

Buy/Sell

- Get quote: [POST /liquidity/rfq](https://docs.zerohash.com/reference/post_liquidity-rfq)
- Execute quote: [POST /liquidity/execute](https://docs.zerohash.com/reference/post_liquidity-execute)

### 

Convert Withdraw

- Get quote: [POST /convert\_withdraw/rfq](https://docs.zerohash.com/reference/post_convert-withdraw-rfq)
- Execute quote: [POST /convert\_withdraw/execute](https://docs.zerohash.com/reference/post_convert-withdraw-execute)

### 

Deposit

- Create deposit address: [POST /deposits/digital\_asset\_address](https://docs.zerohash.com/reference/post_deposits-digital-asset-addresses)

### 

Withdraw

- Create withdrawal request: [POST /withdrawals/requests](https://docs.zerohash.com/reference/post_withdrawals-requests)

### 

Fund

- \[SDK support\]
- Get quote: [POST /fund/rfq](https://docs.zerohash.com/reference/post_fund-rfq)
- Get fund transactions: [GET /fund/transactions](https://docs.zerohash.com/reference/get_fund-transactions)

---

## 

CLOB Endpoints Impacted

The following executable endpoints now support the above assets:

- Create account: [POST /clob/accounts](https://docs.zerohash.com/reference/post_clob-accounts)
- Get accounts: [GET /clob/accounts](https://docs.zerohash.com/reference/get_clob-accounts)
- Update CLOB account: [PATCH /clob/accounts](https://docs.zerohash.com/reference/patch_clob-accounts)
- Search orders: [POST /orders/v1/search\_orders](https://docs.zerohash.com/reference/post_orders-v1-search-orders)
- Get open orders: [POST /orders/v1/get\_open\_orders](https://docs.zerohash.com/reference/post_orders-v1-get-open-orders)
- Search executions: [POST /orders/v1/search\_executions](https://docs.zerohash.com/reference/post_orders-v1-search-executions)
- Create order subscriptions: [POST /orders/v1/create\_order\_subscription](https://docs.zerohash.com/reference/post_orders-v1-create-order-subscription)
- Submit order: [POST /orders/v1/insert\_order](https://docs.zerohash.com/reference/post_orders-v1-insert-order)
- Cancel order: [POST /orders/v1/cancel\_order](https://docs.zerohash.com/reference/post_orders-v1-cancel-order)
- Market data subscription: [POST /orders/v1/create\_market\_data\_subscription](https://docs.zerohash.com/reference/post_orders-v1-create-market-data-subscription)
- List instruments: [POST /orders/v1/list\_instruments](https://docs.zerohash.com/reference/post_orders-v1-list-instruments)
- Trade stats: [POST /orders/v1/get\_trade\_stats](https://docs.zerohash.com/reference/post_orders-v1-get-trade-stats)

---

## 

Relevant Documentation

For a full list of supported assets and instruments, please use the links below.

### 

Supported Assets

- [Production](https://docs.zerohash.com/page/what-assets-do-you-support-two)
- [Certification](https://docs.zerohash.com/page/cert-environment-assets)

### 

Supported Instruments

- [Production](https://docs.zerohash.com/page/production-environment)
- [Certification](https://docs.zerohash.com/page/certification-environment-instruments)