# Source: https://docs.zerohash.com/changelog?page=2

May 11th, 2026

Deprecated

## 

Effective date

**July 11, 2026**

## 

Release type

Field Deprecation

## 

Summary

The citizenship free-text field is being deprecated across all participant API endpoints. Going forward, `citizenship_code` (ISO 3166-1 alpha-2 country code, e.g., "US", "GB", "DE") will be the only accepted field for specifying citizenship.

## 

Reason

The current citizenship field accepts any string, which adds complexity to compliance rule evaluation. Standardizing on ISO country codes ensures consistent data and enables citizenship-based policy enforcement.

## 

Affected Endpoints

- POST /participants/customers/new
- PATCH /participants/customers/{participant\_code}
- POST /participants/beneficiaries/new
- PATCH /participants/beneficiaries/{participant\_code}
- POST /participants/entity/new
- POST /participants/entity/{participant\_code}
- PATCH /participants/entity/{participant\_code}/users/{user\_code}

## 

Required Action

Platforms must replace any usage of the `citizenship` field with `citizenship_code` in API calls. Use ISO 3166-1 alpha-2 codes (e.g., "US" not "United States"). Complete migration before **July 11, 2026**.

During the 60-day transition period, both fields are accepted. If both are sent, `citizenship_code` takes precedence.

Once the 60-day transition period is completed, zerohash will remove `citizenship` from request schemas on all affected endpoints and from response payloads entirely.

April 29th, 2026

Added

## 

Release Details

**Release Date**: April 29, 2026

## 

Release Type

Informational, no action required from platforms

## 

Summary

zerohash has launched real-time webhooks and new REST endpoints for blockchain deposits. Platforms can now subscribe to deposit state change notifications and query deposit records directly, eliminating the need to poll for status updates.

## 

Use Case

Platforms tracking blockchain deposits now have a consistent view of deposit state across push (webhook) and pull (REST) access patterns, with both surfaces returning the same canonical data model.

## 

What's New

**Deposit Status Webhooks**

Deposit status webhooks emit a signed notification on every state transition with a consistent payload, including:

- `deposit_id` - unique deposit identifier
- `state` - current deposit state
- `participant_code`, `account_id` - account identifiers
- `asset`, `amount` - deposit asset and amount
- `transaction_hash`, `received_address`, `source_address` - on-chain transaction details
- `timestamp` - time of the state change

You can always reference this page for the complete list of deposit statuses on our webhooks [https://docs.zerohash.com/reference/deposit-status-updates](https://docs.zerohash.com/reference/deposit-status-updates)

**New REST Endpoints for Deposit Records**

In addition, two new public REST endpoints are available for querying deposit records:

1. [GET /deposits/crypto/{deposit\_id}](https://docs.zerohash.com/reference/get_deposits-crypto-deposit-id) - retrieve a single deposit record by its ID
2. [GET /deposits/crypto](https://docs.zerohash.com/reference/get_deposits-crypto) - retrieve a paginated list of deposit records, with optional filters for deposit IDs, account IDs / account groups, transaction hashes, assets, deposit states, and time range (`from` / `to` timestamps)

Please reach out to your zerohash contact if you have any questions.

April 20th, 2026

Added

## 

Release Details

**Release Date:** April 23, 2026

## 

Release Type

Informational, no action required from platforms

## 

Summary

zerohash is pleased to announce the addition of the following new assets, expanding your trading and platform capabilities:

| Asset Name | Symbol | Notes |
| --- | --- | --- |
| Ethena | `ENA.ETH` | Not available in NY |
| Injective | `INJ.ETH` | Not available in NY |
| Jito | `JTO.SOL` | Available in NY |
| LayerZero | `ZRO.ETH` | Available in NY |
| Morpho | `MORPHO.ETH` | Available in NY |
| Ondo | `ONDO.ETH` | Available in NY |
| Pyth Network | `PYTH.SOL` | Available in NY |
| Wormhole | `W.SOL` | Available in NY |
| Decentraland | `MANA.ETH` | Previously RFQ only, now supported on CLOB; Available in NY |
| MultiversX | `EGLD` | Previously RFQ only, now supported on CLOB; Available in NY |
| Pax Gold | `PAXG.ETH` | Previously RFQ only, now supported on CLOB; Available in NY |
| Pudgy Penguins | `PENGU.SOL` | Previously RFQ only, now supported on CLOB; Not available in NY |
| SEI | `SEI` | Previously RFQ only, now supported on CLOB; Available in NY |
| Worldcoin | `WLD.WORLDCHAIN` | Previously RFQ only, now supported on CLOB; Available in NY |
| ZKsync | `ZK.ZKSYNC` | Previously RFQ only, now supported on CLOB; Available in NY |
| 0x | `ZRX.ETH` | Previously RFQ only, now supported on CLOB; Available in NY |

## 

Availability

| Asset | RFQ | CLOB | Custody | Fund | Payments |
| --- | --- | --- | --- | --- | --- |
| `ENA.ETH` | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| `INJ.ETH` | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| `JTO.SOL` | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| `ZRO.ETH` | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| `MORPHO.ETH` | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| `ONDO.ETH` | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| `PYTH.SOL` | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| `W.SOL` | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| `MANA.ETH` | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| `EGLD` | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| `PAXG.ETH` | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| `PENGU.SOL` | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| `SEI` | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| `WLD.WORLDCHAIN` | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| `ZK.ZKSYNC` | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| `ZRX.ETH` | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

- Environments: All assets are live in both CERT and PROD environments.
- Geographic Restrictions: Please see notes above for NY availability.
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

April 10th, 2026

Added

## 

Release Details

**Release Date:** April 10, 2026

## 

Release Type

Informational, no action required from platforms

## 

Summary

zerohash is pleased to announce the addition of a new asset, expanding your trading and platform capabilities.

| Asset Name | Symbol | Notes |
| --- | --- | --- |
| EURC on Ethereum | `EURC.ETH` | Not enabled in NY; only available with **EUR pairs** |

## 

Availability

| Asset | RFQ | CLOB | Custody | Fund | Payments |
| --- | --- | --- | --- | --- | --- |
| `EURC.ETH` | ✔️ | ❌ | ✔️ | ✔️ | ✔️ |

- Environments: Asset is live in both CERT and PROD environments.
- Geographic Restrictions: Asset is not available in NY at this time.
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

April 3rd, 2026

Added

## 

Release Details

**Release Date:** April 3, 2026

## 

Release Type

Informational, no action required from platforms

## 

Summary

zerohash is pleased to announce the addition of new assets in NY, expanding your trading and platform capabilities.

| Asset Name | Symbol | Notes |
| --- | --- | --- |
| Plasma | `XPL` | Previously unavailable in NY, now enabled |

## 

Availability

| Asset | RFQ | CLOB | Custody | Fund | Payments |
| --- | --- | --- | --- | --- | --- |
| `XPL` | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

- Environments: Asset is live in both CERT and PROD environments.
- Effective Date: Immediately available using the symbol listed above.

---

## 

RFQ Endpoints Impacted

The following executable endpoints now support the above asset:

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

March 26th, 2026

Added

## 

Release Details

**Release Date:** March 26, 2026

## 

Release Type

Informational, no action required from platforms

## 

Summary

zerohash is pleased to announce the addition of new assets in NY, expanding your trading and platform capabilities.

| Asset Name | Symbol | Notes |
| --- | --- | --- |
| USDC on Arbitrum | `USDC.ARBITRUM` | Previously unavailable in NY, now enabled |
| USDC on Sei | `USDC.SEI` | Previously unavailable in NY, now enabled |
| USDC on Stellar | `USDC.XLM` | Previously unavailable in NY, now enabled |

## 

Availability

| Asset | RFQ | CLOB | Custody | Fund | Payments |
| --- | --- | --- | --- | --- | --- |
| `USDC.ARBITRUM` | ✔️ | ❌ | ✔️ | ✔️ | ✔️ |
| `USDC.SEI` | ✔️ | ❌ | ✔️ | ✔️ | ✔️ |
| `USDC.XLM` | ✔️ | ❌ | ✔️ | ✔️ | ✔️ |

- Environments: Asset is live in both CERT and PROD environments.
- Geographic Restrictions: All assets are available in NY.
- Effective Date: Immediately available using the symbol listed above.

---

## 

RFQ Endpoints Impacted

The following executable endpoints now support the above asset:

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

February 27th, 2026

Added

## 

Release Details

**Release Date:** March 6, 2026

## 

Release Type

Informational, no action required from platforms

## 

Summary

zerohash is pleased to announce the addition of new assets, expanding your trading and platform capabilities.

| Asset Name | Symbol | Notes |
| --- | --- | --- |
| USDCx (Canton) | `USDCX.CANTON` | Not available in NY |
| CC | `CC` | Previously unavailable in NY, now enabled |

## 

Availability

| Asset | RFQ | CLOB | Custody | Fund | Payments |
| --- | --- | --- | --- | --- | --- |
| `USDCx.CANTON` | ✔️ | ❌ | ✔️ | ✔️ | ✔️ |
| `CC` | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

- Environments: Asset is live in both CERT and PROD environments.
- Geographic Restrictions: USDCx is not enabled in NY at this time. CC is now enabled in NY.
- Effective Date: Immediately available using the symbol listed above.

---

## 

RFQ Endpoints Impacted

The following executable endpoints now support the above asset:

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

February 18th, 2026

## 

Release Details

**Release Date:** February 18th, 2026

## 

Release Type

Informational, no action required from platforms

## 

Summary

zerohash has launched its new Recovery SDK - an embeddable component that empowers end users to self-serve recovery withdrawals. Platforms can integrate this SDK with minimal dev effort and by following the full, end-to-end [integration guide](https://docs.zerohash.com/docs/non-auth)

## 

Use Case

**For platforms using the [Auth Standalone product](https://docs.zerohash.com/docs/auth-standalone), if transfers to non-Auth destinations are restricted, users can be seamlessly routed into the Recovery flow.**

Powered by the Recovery SDK, this embedded experience allows users to complete a compliant self-serve recovery withdrawal, without requiring manual support intervention.

Please reach out to your zerohash contact if you have any questions.

## 

Relevant Documentation

- [Recovery SDK integration guide](https://docs.zerohash.com/docs/non-auth)
- [Auth Validate](https://docs.zerohash.com/docs/auth-validate)
- [Auth - Home Page](https://docs.zerohash.com/docs/auth)

February 17th, 2026

Added

## 

Release Details

**Release Date:** February 19, 2026

## 

Release Type

Informational, no action required from platforms.

## 

Summary

This release marks the official expansion of our Central Limit Order Book (CLOB) functionality into the European (EU) region. This infrastructure update allows institutional brokers and European participants to trade USD-denominated crypto pairs with optimized liquidity routing and a new flexible funding architecture.

To accommodate various institutional needs, we have introduced a dual-model system for the EU:

- Float Model: Mirrors the existing U.S. framework where trades settle directly against available balances.
- Order-Based Suspense Model (New): Designed specifically for Institutional Brokers (IBs). This enables suspense-based trade orchestration and post-trade reconciliation, allowing for more complex settlement workflows.

## 

Relevant Documentation

For details on CLOB integration and supported instruments, please use the links below.

### 

CLOB Documentation

- [CLOB API Docs](https://docs.zerohash.com/reference/central-limit-order-book)
- [CLOB Account Creation](https://api.cert.zerohash.com/clob/accounts)

### 

Supported Instruments

- [CLOB Instrument List](https://api.cert.zerohash.com/orders/v1/list_instruments)

January 23rd, 2026

## 

FIX Order Gateway

zerohash is happy to announce a new optional feature to allow CLOB participants to reliably identify `NewOrderSingle` and `OrderCancelReplaceRequest` rejections stemming from insufficient balance on the given account.

### 

NewOrderSingles

If enabled, `NewOrderSingles` rejected due to insufficient buying power now have an `OrdRejReason` (Tag `<103>`) of `"Insufficient credit limit"` with value `25`, instead of `“Exchange option”` with the value `0`.

### 

OrderCancelReplaceRequest

Similarly, if enabled, `OrderCancelReplaceRequests` rejected due to insufficient buying power now have a `CxlRejReason` (Tag `<102>`) of `“Insufficient credit limit”` with value `25`, instead of `“Exchange option”` with value of `2`.