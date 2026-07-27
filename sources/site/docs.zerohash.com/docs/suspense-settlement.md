# Source: https://docs.zerohash.com/docs/suspense-settlement

When using trading products at zerohash that operate on a suspense based settlement, an end-of-day (EOD) settlement amount is calculated to reflect your trading activity during the most recent trading session. If the trading activity for the latest trading session is net buy, the platform will need to deliver USD to settle this net amount. For net sell, zerohash will deliver USD to the platform.

> 📘
> 
> ### 
> 
> What is the difference between standard and suspense based settlement?
> 
> The key difference between the two settlement type is that for suspense based settlement, suspense trades are created to track the notional of both filled and open orders submitted by customers throughout the trading session whereas standard settlement just tracks the notional on filled orders.

## 

Pre-requisites

### 

1\. Fund float account

To carry out the initial funding or topping up of your float account, platforms are required to wire the funds to zerohash with their platform code, along with "FLOAT" to indicate the destination of the funds. For suspense based settlement, a float is needed to encumber funds throughout the trading session.

- E.g: `{platform_code}-FLOAT`

### 

2\. Get trading session cut off time

The timezone and cut off time should be discussed with your solutions engineer. If it has not yet been, please reach out and ask them.

## 

What is included in daily settlement?

### 

Open or Partially Filled Buy Orders

Open buy orders that are submitted in the trading session and are still fully or partially open by EOD are included in the settlement calculation. The settlement amount is total order notional plus total expected commission on order. If a market order partially fills with multiple executions, we determine the order price to be worst executed price and based the order notional on this amount.

Example 1: Limit buy order is submitted and rests on order book with price $100,000, quantity 0.001 BTC and commission set is 18 BPS we expect $100 + $0.18 = $100.18 for settlement EOD.

Example 2: 0.002 BTC buy order is submitted and partially fills on order book with price $100,000, quantity 0.001 BTC and commission set is 18 BPS with the remaining 0.001 BTC resting on the book with price $100,000. We expect the full order notional of $200 + $0.36 = $200.36 for settlement EOD.

### 

Filled Buy Orders

Buy orders that are submitted in the trading session and are fully filled by EOD are included in the settlement calculation. The settlement amount is the executed trade notional notional plus trade commission.

Example 1: Market buy order is submitted and fills with price $100,000, quantity 0.001 BTC and commission set is 18 BPS we expect $100 + $0.18 = $100.18 for settlement EOD.

Example 2: Market buy order is submitted for 0.1 BTC, 0.09 fills at $90,000, 0.01 fills at $91,000 and commission set is 18 BPS we expect $8,100 + $14.58 = $8,114.58 and $910 + $1.64 = $911.64 for a total of $8,114.58 + $911.64 = $9,026.22 for settlement EOD.

### 

Sell Orders

Sell orders that are submitted in the trading session and and result in trade executions by EOD are included in the settlement calculation. The settlement amount is the executed trade notional notional less trade commission.

Example: Market sell order is submitted and fills with price $100,000, quantity 0.001 BTC and commission set is 18 BPS we expect to send $100 - $0.18 = $99.82 for settlement EOD.

### 

Open Buy Order Reaching Terminal State

When a partially filled open order is resting on the book past EOD settlement and eventually fills or is cancelled, the delta between the amount that was initially collected for the open order and the actual executed amount is calculated. If the delta is greater than zero, the delta is included in the net sell amount to be sent back to the platform.

Example: 0.1 BTC market buy order is submitted and has multiple fills with price $100,000 and quantity 0.01 BTC, price $105,00 and quantity 0.06 BTC, the remaining 0.03 BTC resting on the book with price $105,000 and commission set is 18 BPS. We expect $10,500 + $18.9 = $10,518.9 for settlement EOD (worst fill price used for order price as outlined [here](https://docs.zerohash.com/null/null#open-or-partially-filled-buy-orders). )

The following day the resting order is cancelled. The executed amount is $6,300 + $11.34 = $6,311.34 and $1,000 +$1.8 = $1,001.8 for a total of $1,001.8 + $6,311.34 = $7,313.14. The amount ZH will send back in the trading session where the order was cancelled is $10,518.9-$7,313.14 = $3,205.76

## 

Settlement Process

### 

1\. Calculate the settlement amount

#### 

Option A) Using `GET /trades`

- Using the [Get /trades](https://docs.zerohash.com/reference/get_trades) endpoint, filter for all the trades that occurred in the latest trading session by using `transaction_timestamp[gte]` and the `transaction_timestamp[lt]` params.
- Input the most recent cut off time in the `transaction_timestamp[lt]`field.
- Input one of the following for the `transaction_timestamp[gte]` field:
 - Querying back **24 hours** of trading activity if performing settlement reconciliation **on Tuesday - Friday**.
 - Querying back **72 hours** on Monday's settlement to account **for weekend activity**.

#### 

Request

> `GET /trades?platform_code=<platform_code>&transaction_timestamp[gte]=<start_time>&transaction_timestamp[lt]=<end_time>`

JSON

```
{
	'platform_code':'<platform_code>',
	'transaction_timestamp[gte]': '<start_time>',
	'transaction_timestamp[lt]' : '<end_time>',
}
```

#### 

Response

JSON

```
{
  "message": [
    {
      "batch_trade_id": null,
      "trade_id": "bb3c0c60-1d1d-4c71-acba-ee89843652dc",
      "client_trade_id": "387c4983-48cf-3451-b0be-7c1796accd10",
      "trade_state": "accepted",
      "market_identifier_code": "",
      "trade_reporter_code": "00ZHEU",
      "symbol": "USDC.ETH/USD",
      "trade_quantity": "80.8",
      "trade_price": "1",
      "trade_type": "regular",
      "physical_delivery": true,
      "comment": "",
      "last_update": 1764190800936,
      "transaction_timestamp": 1764190800000,
      "accepted_timestamp": 1764190800473,
      "defaulted_timestamp": null,
      "settled_timestamp": null,
      "expiry_timestamp": null,
      "settlement_timestamp": null,
      "settlement_price_index_id": null,
      "contract_size": 1,
      "underlying": "USDC.ETH",
      "quoted_currency": "USD",
      "trade_reporter": "00ZHEU",
      "platform_code": "PLAT01",
      "product_type": "spot",
      "parties_anonymous": false,
      "bank_fee": null,
      "reporting_party": "00ZHEU",
      "settlement_schedule": null,
      "parties": [
        {
          "settling": false,
          "participant_code": "CUST01",
          "side": "buy",
          "asset": "USDC.ETH",
          "amount": "80.8",
          "liquidity_indicator": null,
          "execution_id": "",
          "order_id": "",
          "obligations_outstanding_timestamp": null,
          "current_obligations_met_timestamp": null,
          "settlement_state": null,
          "client_order_id": "",
          "collateral_percentage": null,
          "account_label": "CUST01-label",
          "account_profile": null,
          "trader": null,
          "urn": null
        },
        {
          "settling": true,
          "participant_code": "ZHDSEU",
          "side": "sell",
          "asset": "USD",
          "amount": "80.8",
          "liquidity_indicator": null,
          "execution_id": "",
          "order_id": "",
          "obligations_outstanding_timestamp": null,
          "current_obligations_met_timestamp": null,
          "settlement_state": null,
          "client_order_id": "",
          "collateral_percentage": null,
          "account_label": "suspense",
          "account_profile": null,
          "trader": null,
          "urn": null
        }
      ],
      "session_id": "20251128000000",
      "fees": [],
      "issuer_fee_rate": null,
      "issuer_fee_amount": null,
      "issuer_fee_payor_type": null,
      "payment_processor": null,
      "network_fee_notional": null,
      "network_fee_quantity": null,
      "total_notional": "80.80",
      "asset_cost_notional": "80.80",
      "spread_notional": null,
      "spread_bps": null,
      "origin": null
    },
    {
      "batch_trade_id": null,
      "trade_id": "197a5ccd-fdf8-4b79-81d7-e70ff5fa1b3e",
      "client_trade_id": "d2b2ee50-1069-3fb6-a47e-ca22cc9a36cf",
      "trade_state": "accepted",
      "market_identifier_code": "",
      "trade_reporter_code": "00ZHEU",
      "symbol": "BTC/USD",
      "trade_quantity": "0.001",
      "trade_price": "80000",
      "trade_type": "regular",
      "physical_delivery": true,
      "comment": "",
      "last_update": 1764175306022,
      "transaction_timestamp": 1764175305000,
      "accepted_timestamp": 1764175305877,
      "defaulted_timestamp": null,
      "settled_timestamp": null,
      "expiry_timestamp": null,
      "settlement_timestamp": null,
      "settlement_price_index_id": null,
      "contract_size": 1,
      "underlying": "BTC",
      "quoted_currency": "USD",
      "trade_reporter": "00ZHEU",
      "platform_code": "PLAT01",
      "product_type": "spot",
      "parties_anonymous": false,
      "bank_fee": null,
      "reporting_party": "00ZHEU",
      "settlement_schedule": null,
      "parties": [
        {
          "settling": false,
          "participant_code": "ZHDSEU",
          "side": "buy",
          "asset": "BTC",
          "amount": "0.001",
          "liquidity_indicator": null,
          "execution_id": "",
          "order_id": "",
          "obligations_outstanding_timestamp": null,
          "current_obligations_met_timestamp": null,
          "settlement_state": null,
          "client_order_id": "",
          "collateral_percentage": null,
          "account_label": "suspense",
          "account_profile": null,
          "trader": null,
          "urn": null
        },
        {
          "settling": true,
          "participant_code": "CUST01",
          "side": "sell",
          "asset": "USD",
          "amount": "80.8",
          "liquidity_indicator": null,
          "execution_id": "",
          "order_id": "",
          "obligations_outstanding_timestamp": null,
          "current_obligations_met_timestamp": null,
          "settlement_state": null,
          "client_order_id": "",
          "collateral_percentage": null,
          "account_label": "CUST01-label",
          "account_profile": null,
          "trader": null,
          "urn": null
        }
      ],
      "session_id": "20251128000000",
      "fees": [],
      "issuer_fee_rate": null,
      "issuer_fee_amount": null,
      "issuer_fee_payor_type": null,
      "payment_processor": null,
      "network_fee_notional": null,
      "network_fee_quantity": null,
      "total_notional": "80.00",
      "asset_cost_notional": "80.00",
      "spread_notional": null,
      "spread_bps": null,
      "origin": null
    }
  ],
  "page": 1,
  "total_pages": 1,
  "page_size": 50
}
```

Once you have all the trades:

1. To calculate the buy amount for the session:
 1. Get the trades in the response where party 0 account\_label = `suspense` and party 0 side = `buy`
 2. Sum the party 1 amount
2. To calculate the sell amount for the session:
 1. Get the trades in the response where party 1 account\_label = `suspense` and party 1 side = `sell`
 2. Sum the party 1 amount
3. Note for both buy and sell trades we are taking the party 1 amount.
4. Find the net amount by subtracting the total sell amount from the total buy amount.
5. If the amount is positive, the platform needs to deliver USD. If the amount is negative, ZH will deliver USD.

#### 

Option B) Using zerohash settlement email

zerohash will send an email to platform admins daily specifying the amount that needs to be delivered. Platforms can utilize this email if manually processing the settlement amount or can be used to identify recon breaks.

### 

3\. Deliver/Receive USD

Once the amount has been calculated for the latest trading session, USD will either be delivered by the platform or zerohash will deliver USD.

If a net buy for the platform:

- The platform wires zerohash the calculated amount before EOD Please include in the memo field your assigned platform code with the word `SETTLEMENT`.
 - E.g.`{platform_code}-SETTLEMENT`.

If a net sell for the platform:

- zerohash wires the platform the calculated amount before EOD.

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page