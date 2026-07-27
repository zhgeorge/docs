# Source: https://docs.zerohash.com/docs/settlement-reconciliation

When using trading products at zerohash that utilize a float, an end-of-day (EOD) settlement amount is calculated to reflect your trading activity during the most recent trading session. If the trading activity for the latest trading session is net buy, the platform will need to deliver USD to settle this net amount. For net sell, zerohash will deliver USD to the platform.

## 

Pre-requisites

### 

1\. Fund float account

To carry out the initial funding or topping up of your float account, platforms are required to wire the funds to zerohash with their platform code, along with "FLOAT" to indicate the destination of the funds.

- E.g: `{platform_code}-FLOAT`

### 

2\. Get trading session cut off time

The timezone and cut off time should be discussed with your solutions engineer. If it has not yet been, please reach out and ask them. The default trading session is **12:00:00 AM EST** and **11:59:59 PM EST** Monday to Friday.

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

> `GET /trades?platform_code=00SCXM&transaction_timestamp[gte]=<start_time>&transaction_timestamp[lt]=<end_time>`

JSON

```
{
	'platform_code':'00SCXM',
	'transaction_timestamp[gte]': '<start_time>',
	'transaction_timestamp[lt]' : '<end_time>',
}
```

#### 

Response

JSON

```
{
  "content": {
    "message": [
      {
        "batch_trade_id": null,
        "trade_id": "372b48f2-e89b-4670-8c77-0b56e899544b",
        "client_trade_id": "5ABCDEF12345",
        "trade_state": "terminated",
        "market_identifier_code": "SCXM",
        "trade_reporter_code": "00SCXM",
        "symbol": "ETH/USD",
        "trade_quantity": "1",
        "trade_price": "4267.64",
        "trade_type": "regular",
        "physical_delivery": true,
        "comment": "",
        "last_update": 1755504424620,
        "transaction_timestamp": 1755504419000,
        "accepted_timestamp": 1755504423740,
        "defaulted_timestamp": null,
        "settled_timestamp": 1755504424599,
        "expiry_timestamp": null,
        "settlement_timestamp": null,
        "settlement_price_index_id": null,
        "contract_size": 1,
        "underlying": "ETH",
        "quoted_currency": "USD",
        "trade_reporter": "00SCXM",
        "platform_code": "00SCXM",
        "product_type": "spot",
        "parties_anonymous": false,
        "bank_fee": null,
        "reporting_party": "00SCXM",
        "settlement_schedule": null,
        "parties": [
          {
            "settling": true,
            "participant_code": "CUST01",
            "side": "buy",
            "asset": "ETH",
            "amount": "1",
            "liquidity_indicator": null,
            "execution_id": "5ABCDEF12345",
            "order_id": "123455ABCDEF",
            "obligations_outstanding_timestamp": null,
            "current_obligations_met_timestamp": null,
            "settlement_state": "settled",
            "client_order_id": "57797.11080386",
            "collateral_percentage": null,
            "account_label": "8a07ce7a-b449-41de-ae10-37f4dec78933",
            "account_profile": "nonprefunded",
            "trader": null,
            "urn": null,
            "commission": "3.84",
            "commission_asset": "USD"
          },
          {
            "settling": true,
            "participant_code": "00SCXM",
            "side": "sell",
            "asset": "USD",
            "amount": "4267.64",
            "liquidity_indicator": null,
            "execution_id": "",
            "order_id": "",
            "obligations_outstanding_timestamp": null,
            "current_obligations_met_timestamp": null,
            "settlement_state": "settled",
            "client_order_id": "",
            "collateral_percentage": null,
            "account_label": "inventory",
            "account_profile": null,
            "trader": null,
            "urn": null
          }
        ],
        "session_id": "20250818080703",
        "fees": [],
        "issuer_fee_rate": null,
        "issuer_fee_amount": null,
        "issuer_fee_payor_type": null,
        "payment_processor": null,
        "network_fee_notional": null,
        "network_fee_quantity": null,
        "total_notional": "4267.64",
        "asset_cost_notional": "4267.64",
        "spread_notional": null,
        "spread_bps": null,
        "origin": null
      },
      {
        "batch_trade_id": null,
        "trade_id": "74adb498-466c-4ff5-9434-04274034a18e",
        "client_trade_id": "7FHGJKTU09876",
        "trade_state": "terminated",
        "market_identifier_code": "SCXM",
        "trade_reporter_code": "00SCXM",
        "symbol": "ETH/USD",
        "trade_quantity": "0.5",
        "trade_price": "4267.64",
        "trade_type": "regular",
        "physical_delivery": true,
        "comment": "",
        "last_update": 1755504424620,
        "transaction_timestamp": 1755504419000,
        "accepted_timestamp": 1755504423740,
        "defaulted_timestamp": null,
        "settled_timestamp": 1755504424599,
        "expiry_timestamp": null,
        "settlement_timestamp": null,
        "settlement_price_index_id": null,
        "contract_size": 1,
        "underlying": "ETH",
        "quoted_currency": "USD",
        "trade_reporter": "00SCXM",
        "platform_code": "00SCXM",
        "product_type": "spot",
        "parties_anonymous": false,
        "bank_fee": null,
        "reporting_party": "00SCXM",
        "settlement_schedule": null,
        "parties": [
          {
            "settling": true,
            "participant_code": "CUST02",
            "side": "buy",
            "asset": "ETH",
            "amount": "0.5",
            "liquidity_indicator": null,
            "execution_id": "7FHGJKTU09876",
            "order_id": "8HJUDJBPOIUHJ",
            "obligations_outstanding_timestamp": null,
            "current_obligations_met_timestamp": null,
            "settlement_state": "settled",
            "client_order_id": "57797.11080386",
            "collateral_percentage": null,
            "account_label": "961abade-6499-4346-bd38-afd5e9b20d8a",
            "account_profile": "nonprefunded",
            "trader": null,
            "urn": null,
            "commission": "3.84",
            "commission_asset": "USD"
          },
          {
            "settling": true,
            "participant_code": "00SCXM",
            "side": "sell",
            "asset": "USD",
            "amount": "2133.82",
            "liquidity_indicator": null,
            "execution_id": "",
            "order_id": "",
            "obligations_outstanding_timestamp": null,
            "current_obligations_met_timestamp": null,
            "settlement_state": "settled",
            "client_order_id": "",
            "collateral_percentage": null,
            "account_label": "inventory",
            "account_profile": null,
            "trader": null,
            "urn": null
          }
        ],
        "session_id": "20250818080703",
        "fees": [],
        "issuer_fee_rate": null,
        "issuer_fee_amount": null,
        "issuer_fee_payor_type": null,
        "payment_processor": null,
        "network_fee_notional": null,
        "network_fee_quantity": null,
        "total_notional": "2133.82",
        "asset_cost_notional": "2133.82",
        "spread_notional": null,
        "spread_bps": null,
        "origin": null
      },
    ],
    "page": 1,
    "total_pages": 1,
    "page_size": 50
  }
}
```

Once you have all the trades:

1. To calculate the buy amount for the session:
 1. Get the trades in the response where party 0 participant\_code is the customer and party 0 side = buy OR party 1 participant\_code is the customer and party 1 side = buy.
 2. Sum the total\_notional + commission of the customer side of the trade for each trade.
2. To calculate the sell amount for the session:
 1. Get the trades in the response where party 0 participant\_code is the customer and party 0 side = sell OR party 1 participant\_code is the customer and party 1 side = sell.
 2. Sum the total\_notional - commission of the customer side of the trade for each trade.
3. Find the net amount by subtracting the total sell amount from the total buy amount.
4. If the amount is positive, the platform needs to deliver USD. If the amount is negative, ZH will deliver USD.

#### 

Option B) Using `GET /accounts/net_delivery_obligations`

The NDO is tracked on your settlement account. The settlement account is structured as follows:

- participant\_code = <your\_platform\_code>
- account\_group = <your\_platform\_code>
- account\_label = general
- currency= USD

Using [`GET /accounts/net_delivery_obligations`](https://docs.zerohash.com/reference/get_accounts-net-delivery-obligations), filter the response where:

- account\_group = <your\_platform\_code>
- account\_label = general
- asset = USD

This shows the amount you need to deliver to settle the outstanding obligations on your settlement account. If you do not have an NDO, you will not find the above account after filtering the response. You will not have an NDO on the days zerohash will deliver to you assuming you do not have any prior outstanding payables. Note if a payment is missed, this NDO amount will accrue over time as the total outstanding amount.

#### 

Option C) Using zerohash settlement email

zerohash will send an email to platform admins daily specifying the amount that needs to be delivered. Platforms can utilize this email if manually processing the settlement amount or can be used to identify recon breaks.

### 

2\. Deliver/Receive USD

Once the amount has been calculated for the latest trading session, USD will either be delivered by the platform or zerohash will deliver USD.

If a net buy for the platform:

- The platform wires zerohash the calculated amount before 12 PM EST. Please include in the memo field your assigned platform code with the word `SETTLEMENT`.
 - E.g.`{platform_code}-SETTLEMENT`.

If a net sell for the platform:

- zerohash wires the platform the calculated amount before 12 PM EST.

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page