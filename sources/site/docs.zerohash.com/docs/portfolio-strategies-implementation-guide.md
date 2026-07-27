# Source: https://docs.zerohash.com/docs/portfolio-strategies-implementation-guide

This guide walks you through an end-to-end Portfolio Strategies integration: creating a Strategy, enrolling users, running a rebalance, and consuming webhooks.

## 

Overview

**Prerequisites**

- Your platform must be enabled for the Portfolio Strategy suite. Reach out to your zerohash solutions engineer to get this turned on.
- A webhook destination URL configured on your zerohash account. See the [webhooks overview](https://docs.zerohash.com/reference/overview) for setup.
- If you're using the **novated funding model**, a funded platform float account.
- API authentication credentials. 

**Concepts**

| Term | Definition |
| --- | --- |
| Strategy | A container scoped to a `quoted_currency`. Allocations are supplied per Operation, not stored on the Strategy. |
| Trader | A `(Strategy, participant)` pair, created on first enrollment. |
| Operation | An asynchronous mutation against a Strategy. Tracked through `validating`, `pricing`, `settling`, and a terminal state of `settled`, `skipped`, or `failed`. |
| Execution | The per-Trader slice of an Operation. One Execution per participant per Operation. |
| Instruction | A single per-asset leg within an Execution. |
| Allocation | An entry of `{underlying_currency, weight}`. Weights are decimal strings that sum to `1.00`. |
| `auto_rebalance` | Boolean flag on a Trader. Controls whether the Trader is included in default-scope rebalances. |

**Idempotency**

Every mutation requires an `X-REQUEST-ID` header, which must be a UUID v4. Resubmitting with the same value safely returns the existing resource (`200 OK` instead of `201` or `202`). The same value is echoed back in the response header.

## 

Implementation Guide

### 

Step 1. Create a Strategy

[`POST /strategies`](https://docs.zerohash.com/reference/post_strategies)

**Request:**

JSON

```
{
  "quoted_currency": "USD",
  "metadata": { "platform_label": "Blue Chip Crypto" }
}
```

**Headers:**

```
X-REQUEST-ID: 4b5ef19e-4ad5-4750-8bf6-3e5238b976ec
```

**Response (**`201 Created`**):**

JSON

```
{
  "id": "b1c2d3e4-f5a6-4789-bcde-f01234567890",
  "request_id": "4b5ef19e-4ad5-4750-8bf6-3e5238b976ec",
  "quoted_currency": "USD",
  "metadata": { "platform_label": "Blue Chip Crypto" },
  "created_at": "2026-04-17T10:00:00Z",
  "updated_at": "2026-04-17T10:00:00Z"
}
```

Store the returned `id`. Every subsequent call references it. The Strategy is a lightweight container, so it carries no allocations and no lifecycle status of its own. 

---

### 

Step 2. Enroll Users

`POST /strategies/{strategy_id}/enroll`

Enrollment is asynchronous. Each participant in the `participants` array becomes an independent Execution, so one failure doesn't affect the others. First-time enrollees produce a Trader and a `trade_strategy.trader.created` webhook.

**Request:**

JSON

```
{
  "allocations": [
    { "underlying_currency": "BTC", "weight": "0.50" },
    { "underlying_currency": "ETH", "weight": "0.30" },
    { "underlying_currency": "SOL", "weight": "0.20" }
  ],
  "participants": [
    { "participant_code": "CUST01", "amount": "10000.00", "auto_rebalance": true },
    { "participant_code": "CUST02", "amount": "5000.00",  "auto_rebalance": true }
  ]
}
```

**Field reference:**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `allocations[]` | array | yes | Target weights. Must sum to `1.00`. Each `underlying_currency` appears once. |
| `participants[]` | array | yes | One or more participant entries. Single-user requests use a one-element array. |
| `participant_code` | string (≤ 6) | yes | Your end-user identifier. |
| `amount` | decimal string | yes | Fiat to spend. |
| `auto_rebalance` | boolean | yes | Initial rebalance-inclusion flag for the new Trader. |

**Response (**`202 Accepted`**):** the Operation in `status: validating`. 

---

### 

Step 3. Subsequent Distributions

#### 

Top Up

`POST /strategies/{strategy_id}/top-up` adds fiat to an existing Trader. The request shape is the same as enroll, minus `auto_rebalance` (use `PATCH` on the Trader if you need to change that).

JSON

```
{
  "allocations": [
    { "underlying_currency": "BTC", "weight": "0.50" },
    { "underlying_currency": "ETH", "weight": "0.30" },
    { "underlying_currency": "SOL", "weight": "0.20" }
  ],
  "participants": [
    { "participant_code": "CUST01", "amount": "5000.00" }
  ]
}
```

#### 

Partial Sell

`POST /strategies/{strategy_id}/partial-sell` returns a fiat amount to the participant. `amount` is the fiat to return, and sells are sized proportionally to the **caller-supplied** `allocations` rather than to current holdings. If a per-asset slice falls below the instrument minimum, that Instruction terminates `rejected` with `status_reason: below_instrument_minimum`.

If you want to scale a position down without realigning it, derive weights from the Trader's current holdings and pass those in.

JSON

```
{
  "allocations": [
    { "underlying_currency": "BTC", "weight": "0.583" },
    { "underlying_currency": "ETH", "weight": "0.217" },
    { "underlying_currency": "SOL", "weight": "0.200" }
  ],
  "participants": [
    { "participant_code": "CUST01", "amount": "100.00" }
  ]
}
```

---

### 

Step 4. Rebalance

`POST /strategies/{strategy_id}/rebalance`

A rebalance sets new target allocations and adjusts in-scope Traders. zerohash calculates per-Trader deltas, runs an atomic credit check, executes sells, and then funds buys from the sell proceeds. There's no separate buy-side credit check because the operation is zero-sum per Trader.

**Request:**

JSON

```
{
  "allocations": [
    { "underlying_currency": "BTC", "weight": "0.40" },
    { "underlying_currency": "ETH", "weight": "0.40" },
    { "underlying_currency": "SOL", "weight": "0.20" }
  ],
  "participants": [
    { "participant_code": "CUST01" },
    { "participant_code": "CUST02" }
  ]
}
```

**Scope rules:**

- Omit `participants` to target every Trader with `auto_rebalance = true` and non-zero balances.
- Provide `participants` to target exactly the listed Traders. This overrides `auto_rebalance = false`.

**Allocation rules:**

- Weights must sum to `1.00`.
- A weight of `"0"` means "fully exit this asset" (quantity-based sell).
- Assets a Trader holds that are missing from `allocations` are also fully exited.

**Atomic credit check (per Trader, before any trade):**

| Check | Failure reason |
| --- | --- |
| Participant active | `participant inactive or not found` |
| Instrument eligible | `instrument {X/USD} not enabled for participant` |
| Crypto balance per sell leg | `insufficient {ASSET} balance for sell leg` |
| No concurrent hold | `balance held by concurrent operation` |

Failing Traders' Executions terminate `rejected`. Other Traders continue.

**Response (**`202 Accepted`**):** the Operation in `status: validating`.

---

### 

Step 5. Liquidation

`POST /strategies/{strategy_id}/liquidate`

Liquidation sells everything the listed Traders currently hold. You always have to supply a `participants` list, so pass every Trader you want liquidated. Liquidation has no buy leg, ignores `auto_rebalance`, and bypasses the rebalance queue.

JSON

```
{
  "participants": [
    { "participant_code": "CUST01" },
    { "participant_code": "CUST02" }
  ]
}
```

A Trader with no current holdings produces an Execution `skipped` with `status_reason: no_holdings`. The Trader record is preserved for audit.

---

### 

Step 6. Update Trader Settings

`PATCH /strategies/traders/{trader_id}`

This call is synchronous. The only mutable field today is `auto_rebalance`. The change takes effect on the next rebalance and doesn't affect any in-flight Operation. No webhook is emitted, since the response carries the updated resource.

JSON

```
{ "auto_rebalance": false }
```

---

### 

Consuming Webhooks

Portfolio Strategies emits three event types. All of them share the standard zerohash webhook delivery contract for destinations, retries, and signing.

| `x-zh-hook-payload-type` | Fires when |
| --- | --- |
| `trade_strategy.operation.status_changed` | An Operation transitions between any two statuses. |
| `trade_strategy.execution.status_changed` | An Execution reaches its terminal status. Exactly once per Execution. |
| `trade_strategy.trader.created` | A Trader is created on first enrollment. |

**Payload shape.** Every payload is a flat JSON object equal to the resource returned by the corresponding `GET` endpoint. There's no envelope and no `data` wrapper. The `updated_at` field is the canonical sequencing timestamp.

#### 

Sample: `trade_strategy.operation.status_changed`

JSON

```
{
  "id": "d1e2f3a4-b5c6-4789-abcd-ef0123456789",
  "strategy_id": "b1c2d3e4-f5a6-4789-bcde-f01234567890",
  "request_id": "e2f3a4b5-c6d7-4789-abcd-ef0123456789",
  "type": "enrollment",
  "status": "settled",
  "status_reason": "",
  "allocations": [
    { "underlying_currency": "BTC", "weight": "0.50" },
    { "underlying_currency": "ETH", "weight": "0.30" },
    { "underlying_currency": "SOL", "weight": "0.20" }
  ],
  "created_at": "2026-04-17T10:30:00Z",
  "updated_at": "2026-04-17T10:30:07Z"
}
```

#### 

Sample: `trade_strategy.execution.status_changed`

JSON

```
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef0123456789",
  "strategy_id": "b1c2d3e4-f5a6-4789-bcde-f01234567890",
  "operation_id": "d1e2f3a4-b5c6-4789-abcd-ef0123456789",
  "trader_id": "f1a2b3c4-d5e6-4789-abcd-ef0123456789",
  "participant_code": "CUST01",
  "status": "settled",
  "status_reason": "",
  "instructions": [
    {
      "underlying_currency": "BTC",
      "quoted_currency": "USD",
      "side": "buy",
      "amount": "5000.00",
      "amount_type": "notional",
      "status": "executed",
      "price": "60000.00",
      "quantity": "0.0833",
      "total_notional": "5000.00",
      "trade_ids": ["7a3d2e1f-4b6c-4789-abcd-ef0123456789"],
      "executed_at": "2026-04-17T10:30:05Z"
    }
  ],
  "created_at": "2026-04-17T10:30:00Z",
  "updated_at": "2026-04-17T10:30:07Z"
}
```

#### 

Sample: `trade_strategy.trader.created`

JSON

```
{
  "id": "f1a2b3c4-d5e6-4789-abcd-ef0123456789",
  "strategy_id": "b1c2d3e4-f5a6-4789-bcde-f01234567890",
  "participant_code": "CUST01",
  "auto_rebalance": true,
  "created_at": "2026-04-17T10:30:00Z",
  "updated_at": "2026-04-17T10:30:00Z"
}
```

Updated about 2 months ago

---

Did this page help you?

Yes

No

Copy Page