# Source: https://docs.zerohash.com/docs/portfolio-strategies

Portfolio Strategies gives platforms a way to offer managed multi-asset baskets to their end users without building the orchestration, credit-check, or execution layer in-house. You define a Strategy, enroll your users into it, and trigger a rebalance whenever the target allocation changes. zerohash takes care of order calculations, per-user credit checks, trade sequencing, and settlement through a single API.

## 

Use Cases

- **Multi-asset portfolios:** End users hold a curated basket (for example, "Blue Chip Crypto" at 50% BTC, 30% ETH, 20% SOL) and zerohash keeps every subscriber's holdings aligned with the target weights.
- **Thematic baskets and index products:** Launch single-ticker style products that map to a multi-asset allocation under the hood.
- **Copy trading or strategy following:** End users mirror a portfolio managed by the platform or a third-party strategist.
- **Batch onboarding and exits:** Enroll, top up, partially sell, or liquidate dozens or thousands of users in one API call. Each user is processed independently.

## 

Flow

1. Platform defines a Strategy (target allocation across assets)
2. Users enroll with a fiat amount
3. zerohash creates a Trader per user and places the initial buys
4. When the platform triggers a rebalance, top-up, partial sell, or liquidation, zerohash calculates per-user trade amounts, runs a credit check, and executes every user's trades at a uniform price
5. Webhooks confirm settlement

## 

Key Features

- **Atomic execution:** Before any rebalance trade is placed, zerohash validates every Trader across every leg (sell-side balances, instrument eligibility, concurrent holds). Traders that fail any check are excluded entirely, so a partial-state rebalance can't happen.
- **Uniform user pricing:** For each asset in an Operation, every in-scope Trader receives the same price, locked in before execution. No user is advantaged or disadvantaged within a single rebalance.
- **Per-user isolation:** Each Trader's Execution is independent. One rejection doesn't affect any other user in the same batch.

# 

Overview

**Create Strategy and Enroll**

![](https://files.readme.io/31b2da1c63fe1467dd26a9c0f4d76f5b41dac9d8ad4dba68f16f4e07dc77f045-Screenshot_2026-05-31_at_5.11.13_PM.png)

**Rebalance Strategy**

![](https://files.readme.io/01d9a8fff51cbe069ac11927421e4950677e554f6fd2b11f9ede37d5529ed578-Screenshot_2026-05-31_at_5.27.14_PM.png)

## 

Available Endpoints

| Resource | Endpoint |
| --- | --- |
| Create strategy | `POST /strategies` |
| Enroll | `POST /strategies/{strategy_id}/enroll` |
| Top up | `POST /strategies/{strategy_id}/top-up` |
| Partial sell | `POST /strategies/{strategy_id}/partial-sell` |
| Rebalance | `POST /strategies/{strategy_id}/rebalance` |
| Liquidate | `POST /strategies/{strategy_id}/liquidate` |
| Update trader | `PATCH /strategies/traders/{trader_id}` |
| Get or list operations | `GET /strategies/operations`, `GET /strategies/operations/{id}` |
| Get or list executions | `GET /strategies/executions`, `GET /strategies/executions/{id}` |
| Get or list traders | `GET /strategies/traders`, `GET /strategies/traders/{id}` |

Updated about 2 months ago

---

Did this page help you?

Yes

No

Copy Page