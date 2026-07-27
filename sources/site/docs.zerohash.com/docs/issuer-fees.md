# Source: https://docs.zerohash.com/docs/issuer-fees

## 

Issuer Fee Schedule

Some stablecoin issuers assess a fee to zerohash on mint or burn activity. In these situations, zerohash's approach is to simply pass the fee we are charged, 1-1, onto either the Platform or the Customer. Issuer Fees, if applicable, are charged on a per-transaction basis.

Here is the current list of supported stablecoin [assets](https://docs.zerohash.com/page/what-assets-do-you-support-two) and associated Issuer Fees:

| Stablecoin | Mint Issuer Fee (or "Buy") | Burn Issuer Fee (or "Sell") |
| --- | --- | --- |
| DAI | 0 bps (basis points) | 0 bps |
| TUSD | 0 bps | 0 bps |
| USDC (this applies to all blockchain networks) | 0 bps | 5 bps |
| USDT | 0 bps | 0 bps |
| USDP | 0 bps | 0 bps |
| PYUSD | 0 bps | 0 bps |
| RLUSD | 0 bps | 0 bps |

## 

Exceptions

Depending on the Platform's flow, the above fee schedule may not apply. Consult with your zerohash technical account manager to understand your individual setup.

## 

Fee Applicability

Issuer Fees will be applied to all quotes when

1. The stablecoin being quoted has a non-zero Issuer Fee, for the quoted side (either Buy or Sell)
2. The Platform is not configured to be an exception

## 

Fee Payor

zerohash has the ability to assess the Issuer Fee to either the Platform, or the Platform's Customer. See examples below on how each of the Fee Payor types will work in practice:

## 

Liquidity API Flow (Fee Payor: Customer, with a spread added)

### 

General

- For the below examples, the Platform's `participant_code` is PLAT01 and their Customer's is CUST01.
- Assume the fee schedule mentioned in the [above table](https://docs.zerohash.com/docs/issuer-fees#issuer-fee-schedule)
- Assume the Platform is not configured for to be exempt from Issuer Fees
- Assume the Platform is assessing a 5 bps spread on each order

### 

Get Quote (Buy)

Example [POST /liquidity/rfq](https://docs.zerohash.com/reference/post_liquidity-rfq) request:

JSON

```
{
    "side": "buy",
    "participant_code": "CUST01",
    "underlying": "USDC.ETH",
    "quoted_currency": "USD",
    "total": "1000",
    "settlement_type":"STANDARD", // optional - the only supported settlement_type currently is "STANDARD" and implies instant settlement
    "spread": "5"  
}
```

Note: If the Platform omits the optional `settlement_type` field, then zerohash will default to `STANDARD` as the `settlement_type`

[POST /liquidity/rfq](https://docs.zerohash.com/reference/post_liquidity-rfq) response (note: no issuer fee is applied on the "buy" quote):

JSON

```
"message": {
        "request_id": "2c990e63-d0b6-40d7-a289-b13781b1fb9c",
        "participant_code": "CUST01",
        "quoted_currency": "USD",
        "side": "buy",
        "quantity": "999.5",
        "price": "1.0005002501250625",
        "quote_id": "675f2335-a466-4654-8357-1d6bcb14bb46",
        "expire_ts": 1742846697146,
        "account_group": "00SCXM",
        "account_label": "general",
        "obo_participant": {
            "participant_code": "CUST01",
            "account_group": "PLAT01",
            "account_label": "general"
        },
        "total_notional": "1000",
        "settlement_type": null,
        "issuer_fee_rate": null,
        "issuer_fee_amount": null,
        "issuer_fee_payor_type": null,
        "underlying": "USDC.ETH",
        "asset_cost_notional": "1000",
        "spread_notional": "0.5",
        "spread_bps": "5"       
  }
```

### 

Get Quote (Sell)

Example [POST /liquidity/rfq](https://docs.zerohash.com/reference/post_liquidity-rfq) request:

JSON

```
{
    "side": "sell",
    "participant_code": "CUST01",
    "underlying": "USDC.ETH",
    "quoted_currency": "USD",
    "total": "1000",
    "settlement_type": "STANDARD", // optional
    "spread": "5"   
}
```

Note: If the Platform omits the optional `settlement_type` parameter, then the issuer fee of 5 basis points in this scenario will still be applied to the quote. The `settlement_type` field may be expanded in the future to accommodate different settlement types (ie, a T+2 schedule), however `STANDARD` is the only supported value right now.

[POST /liquidity/rfq](https://docs.zerohash.com/reference/post_liquidity-rfq) response (note: there is now an issuer fee being applied on the "sell" quote):

JSON

```
 "message": {
        "request_id": "1595c5ae-a641-4d85-bdc0-f3a764c43321",
        "participant_code": "CUST01",
        "quoted_currency": "USD",
        "side": "sell",
        "quantity": "1000.5",
        "price": "0.9995002498750625",
        "quote_id": "f790c1e2-aa07-44cf-90ed-801540e02b6f",
        "expire_ts": 1742846539023,
        "account_group": "00SCXM",
        "account_label": "general",
        "obo_participant": {
            "participant_code": "CUST01",
            "account_group": "PLAT01",
            "account_label": "general"
        },
        "total_notional": "999.5",
        "settlement_type": "STANDARD",
        "issuer_fee_rate": "5",
        "issuer_fee_amount": "0.5",
        "issuer_fee_payor_type": "CUSTOMER",
        "underlying": "USDC.ETH",
        "asset_cost_notional": "1000",
        "spread_notional": "0.5",
        "spread_bps": "5"
        }
```

### 

Execute Quote

[POST /liquidity/execute](https://docs.zerohash.com/reference/post_liquidity-execute) request

JSON

```
{ 
   "quote_id": "b76a72c9-8083-4126-a25c-5e995f86ae24"
}
```

[POST /liquidity/execute](https://docs.zerohash.com/reference/post_liquidity-execute) response:

JSON

```
{
    "message": {
        "request_id": "12b73072-fbbd-4ee8-a2a1-6dabc57c8242",
        "quote": {
            "request_id": "fdecf77f-f329-4dd2-bc07-b6a596c13769",
            "participant_code": "UW6VWU",
            "quoted_currency": "USD",
            "side": "buy",
            "quantity": "999.5",
            "price": "1.0005002501250625",
            "quote_id": "b76a72c9-8083-4126-a25c-5e995f86ae24",
            "expire_ts": 1729286880350,
            "account_group": "00SCXM",
            "account_label": "general",
            "obo_participant": {
                "participant_code": "CUST01",
                "account_group": "PLAT01",
                "account_label": "general"
            },
            "underlying": "USDC.ETH",
            "total_notional": "1000",
            "asset_cost_notional": "1000",
            "spread_notional": ".5",
            "spread_bps": "5",
            "issuer_fee_amount": ".5", 
            "issuer_fee_rate": "5",
            "issuer_fee_payor_type": "CUSTOMER",
            
            "settlement_type": "STANDARD",
            "transaction_timestamp": 1729286878417
        },
        "trade_id": "20f34c33-9b7d-467f-8f57-156b67134544",
        "status": "Completed",
        "trade_ids_list": [
            "20f34c33-9b7d-467f-8f57-156b67134544"
        ]
    }
}
```

### 

Get Trade

A Platform can query previously executed trades via either the [GET /trades](https://docs.zerohash.com/reference/get_trades) or [GET /trades/:trade\_id](https://docs.zerohash.com/reference/get_trades-trade-id) endpoint. Here is an example `GET /trades/20f34c33-9b7d-467f-8f57-156b67134544` response:

JSON

```
{
    "message": [
        {
            "batch_trade_id": null,
            "trade_id": "20f34c33-9b7d-467f-8f57-156b67134544",
            "client_trade_id": "cd4f8a1b-f137-43cc-b93e-7998f5040bda",
            "trade_state": "terminated",
            "market_identifier_code": "SCXM",
            "trade_reporter_code": "00SCXM",
            "symbol": "USDC.ETH/USD",
            "trade_quantity": "1000",
            "trade_price": "1",
            "trade_type": "regular",
            "physical_delivery": true,
            "comment": "",
            "last_update": 1729286889816,
            "transaction_timestamp": 1729286878000,
            "accepted_timestamp": 1729286878435,
            "defaulted_timestamp": null,
            "settled_timestamp": 1729286889805,
            "expiry_timestamp": null,
            "settlement_timestamp": null,
            "settlement_price_index_id": null,
            "contract_size": 1,
            "underlying": "USDC.ETH",
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
                    "side": "sell",
                    "asset": "USDC.ETH",
                    "amount": "null",
                    "liquidity_indicator": null,
                    "execution_id": "",
                    "order_id": "",
                    "obligations_outstanding_timestamp": null,
                    "current_obligations_met_timestamp": null,
                    "settlement_state": "settled",
                    "client_order_id": "",
                    "collateral_percentage": null,
                    "account_label": "general",
                    "account_profile": null
                },
                {
                    "settling": true,
                    "participant_code": "00SCXM",
                    "side": "sell",
                    "asset": "USD",
                    "amount": "null",
                    "liquidity_indicator": null,
                    "execution_id": "",
                    "order_id": "",
                    "obligations_outstanding_timestamp": null,
                    "current_obligations_met_timestamp": null,
                    "settlement_state": "settled",
                    "client_order_id": "",
                    "collateral_percentage": null,
                    "account_label": "inventory",
                    "account_profile": null
                }
            ],
            "session_id": "20241018212700",
            "fees": [],
            "network_fee_notional": null,
            "network_fee_quantity": null,
            "total_notional": "1000.00",
            "asset_cost_notional": "990.00",
            "spread_notional": "5",
            "spread_bps": "5",
            "issuer_fee_amount": "5", 
            "issuer_fee_rate": "5",
            "issuer_fee_payor_type": "CUSTOMER",
            "origin": "rest_api"
        },
```

## 

Ledger Movements and Account Balance Changes

On the ledger, when the Customer is paying the fee, there a ledger movement from the Customer account to zerohash. In the below example, assume the following:

- Customer's USDC `account_id` = bccbce77-f80c-48b1-960f-9608b68bbe95
- Customer's USD `account_id` = accbce88-f80c-48b1-960f-9608b68bbe86

### 

Trade Settlement and Issuer Fee Movements

Example `GET /movements` response.

JSON

```
{
    "message": [
        {
            "movement_timestamp": 1729286889000,
            "account_id": "bccbce77-f80c-48b1-960f-9608b68bbe95",
            "movement_id": "66ef0a01-e1b1-4b60-a660-34199669151e",
            "movement_type": "final_settlement",
            "transfer_type": null,
            "deposit_reference_id": null,
            "withdrawal_request_id": null,
            "parent_link_id": null,
            "trade_id": "20f34c33-9b7d-467f-8f57-156b67134544",
            "change": "-990.00",
            "origin": "rest_api"
        },
        {
            "movement_timestamp": 1729286889000,
            "account_id": "accbce88-f80c-48b1-960f-9608b68bbe86",
            "movement_id": "43562582-517c-4e7d-91cf-a1601f02b733",
            "movement_type": "final_settlement",
            "transfer_type": null,
            "deposit_reference_id": null,
            "withdrawal_request_id": null,
            "parent_link_id": null,
            "trade_id": "20f34c33-9b7d-467f-8f57-156b67134544",
            "change": "990",
            "origin": "rest_api"
        },
        {
            "movement_timestamp": 1729286889000,
            "account_id": "bccbce77-f80c-48b1-960f-9608b68bbe95",
            "movement_id": "43562582-517c-4e7d-91cf-a1601f02b733",
            "movement_type": "issuer_fee",
            "transfer_type": null,
            "deposit_reference_id": null,
            "withdrawal_request_id": null,
            "parent_link_id": null,
            "trade_id": "20f34c33-9b7d-467f-8f57-156b67134544",
            "change": "-5",
            "origin": "rest_api"
        },
```

Note: there are 2 `final_settlement` representing the movements on the trade, and a 5 USD debit from the Customer's USD account to pay the Issuer Fee, leaving the Customer with 995 USD after the sell transaction has completed.

## 

Liquidity API Flow (Fee Payor: Customer, no spread added)

### 

General

- For the below examples, the Platform's `participant_code` is PLAT01 and their Customer's is CUST01.
- Assume the fee schedule mentioned in the [above table](https://docs.zerohash.com/docs/issuer-fees#issuer-fee-schedule)
- Assume the Platform is not configured for to be exempt from Issuer Fees
- Assume the Platform is not assessing any spread on orders

### 

Get Quote (Buy)

Example [POST /liquidity/rfq](https://docs.zerohash.com/reference/post_liquidity-rfq) request:

JSON

```
{
    "side": "buy",
    "participant_code": "CUST01",
    "underlying": "USDC.ETH",
    "quoted_currency": "USD",
    "total": "1000",
    "settlement_type":"STANDARD" // optional - the only supported settlement_type currently is "STANDARD" and implies instant settlement
}
```

Note: If the Platform omits the optional `settlement_type` field, then zerohash will default to `STANDARD` as the `settlement_type`

[POST /liquidity/rfq](https://docs.zerohash.com/reference/post_liquidity-rfq) response (note: no issuer fee is applied on the "buy" quote):

JSON

```
{
    "message": {
        "request_id": "b4d90a78-0fd0-4e4a-bd4a-9c14e19a12f3",
        "participant_code": "PLAT01",
        "quoted_currency": "USD",
        "side": "buy",
        "quantity": "1000",
        "price": "1",
        "quote_id": "b76a72c9-8083-4126-a25c-5e995f86ae24",
        "expire_ts": 1729286069180,
        "account_group": "00SCXM",
        "account_label": "general",
        "obo_participant": {
            "participant_code": "CUST01",
            "account_group": "PLAT01",
            "account_label": "general"
        },
        "underlying": "USDC.ETH",
        "asset_cost_notional": "1000",
        "spread_notional": "0",
        "spread_bps": "0",
        "issuer_fee_amount": "0", 
        "issuer_fee_rate": "0",
        "issuer_fee_payor_type": "",
        "settlement_type": "",
    }
}
```

### 

Get Quote (Sell)

Example [POST /liquidity/rfq](https://docs.zerohash.com/reference/post_liquidity-rfq) request:

JSON

```
{
    "side": "sell",
    "participant_code": "CUST01",
    "underlying": "USDC.ETH",
    "quoted_currency": "USD",
    "total": "1000",
    "settlement_type": "STANDARD"
}
```

Note: If the Platform omits the optional `settlement_type` parameter, then the issuer fee of 5 basis points in this scenario will still be applied to the quote. The `settlement_type` field may be expanded in the future to accommodate different settlement types (ie, a T+2 schedule), however `STANDARD` is the only supported value right now.

[POST /liquidity/rfq](https://docs.zerohash.com/reference/post_liquidity-rfq) response (note: there is now an issuer fee being applied on the "sell" quote):

JSON

```
{
    "message": {
        "request_id": "b4d90a78-0fd0-4e4a-bd4a-9c14e19a12f3",
        "participant_code": "PLAT01",
        "quoted_currency": "USD",
        "side": "sell",
        "quantity": "1000",
        "price": "1",
        "quote_id": "b76a72c9-8083-4126-a25c-5e995f86ae24",
        "expire_ts": 1729286069180,
        "account_group": "00SCXM",
        "account_label": "general",
        "obo_participant": {
            "participant_code": "CUST01",
            "account_group": "PLAT01",
            "account_label": "general"
        },
        "underlying": "USDC.ETH",
        "asset_cost_notional": "995",
        "spread_notional": "0",
        "spread_bps": "0",
        "issuer_fee_amount": "5", 
        "issuer_fee_rate": "5",
        "issuer_fee_payor_type": "CUSTOMER",
        "settlement_type": "STANDARD",
    }
}
```

### 

Execute Quote

[POST /liquidity/execute](https://docs.zerohash.com/reference/post_liquidity-execute) request

JSON

```
{ 
   "quote_id": "b76a72c9-8083-4126-a25c-5e995f86ae24"
}
```

[POST /liquidity/execute](https://docs.zerohash.com/reference/post_liquidity-execute) response:

JSON

```
{
    "message": {
        "request_id": "12b73072-fbbd-4ee8-a2a1-6dabc57c8242",
        "quote": {
            "request_id": "fdecf77f-f329-4dd2-bc07-b6a596c13769",
            "participant_code": "UW6VWU",
            "quoted_currency": "USD",
            "side": "buy",
            "quantity": "1000",
            "price": "1",
            "quote_id": "b76a72c9-8083-4126-a25c-5e995f86ae24",
            "expire_ts": 1729286880350,
            "account_group": "00SCXM",
            "account_label": "general",
            "obo_participant": {
                "participant_code": "T0A4YI",
                "account_group": "UW6VWU",
                "account_label": "general"
            },
            "underlying": "USDC.ETH",
            "asset_cost_notional": "995",
            "spread_notional": "0",
            "spread_bps": "0",
            "issuer_fee_amount": "5", 
            "issuer_fee_rate": "5",
            "issuer_fee_payor_type": "CUSTOMER",
            "settlement_type": "STANDARD",
            "transaction_timestamp": 1729286878417
        },
        "trade_id": "20f34c33-9b7d-467f-8f57-156b67134544",
        "status": "Completed",
        "trade_ids_list": [
            "20f34c33-9b7d-467f-8f57-156b67134544"
        ]
    }
}
```

### 

Get Trade

A Platform can query previously executed trades via either the [GET /trades](https://docs.zerohash.com/reference/get_trades) or [GET /trades/:trade\_id](https://docs.zerohash.com/reference/get_trades-trade-id) endpoint. Here is an example `GET /trades/20f34c33-9b7d-467f-8f57-156b67134544` response:

JSON

```
{
    "message": [
        {
            "batch_trade_id": null,
            "trade_id": "20f34c33-9b7d-467f-8f57-156b67134544",
            "client_trade_id": "cd4f8a1b-f137-43cc-b93e-7998f5040bda",
            "trade_state": "terminated",
            "market_identifier_code": "SCXM",
            "trade_reporter_code": "00SCXM",
            "symbol": "USDC.ETH/USD",
            "trade_quantity": "1000",
            "trade_price": "1",
            "trade_type": "regular",
            "physical_delivery": true,
            "comment": "",
            "last_update": 1729286889816,
            "transaction_timestamp": 1729286878000,
            "accepted_timestamp": 1729286878435,
            "defaulted_timestamp": null,
            "settled_timestamp": 1729286889805,
            "expiry_timestamp": null,
            "settlement_timestamp": null,
            "settlement_price_index_id": null,
            "contract_size": 1,
            "underlying": "USDC.ETH",
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
                    "side": "sell",
                    "asset": "USDC.ETH",
                    "amount": "null",
                    "liquidity_indicator": null,
                    "execution_id": "",
                    "order_id": "",
                    "obligations_outstanding_timestamp": null,
                    "current_obligations_met_timestamp": null,
                    "settlement_state": "settled",
                    "client_order_id": "",
                    "collateral_percentage": null,
                    "account_label": "general",
                    "account_profile": null
                },
                {
                    "settling": true,
                    "participant_code": "00SCXM",
                    "side": "sell",
                    "asset": "USD",
                    "amount": "null",
                    "liquidity_indicator": null,
                    "execution_id": "",
                    "order_id": "",
                    "obligations_outstanding_timestamp": null,
                    "current_obligations_met_timestamp": null,
                    "settlement_state": "settled",
                    "client_order_id": "",
                    "collateral_percentage": null,
                    "account_label": "inventory",
                    "account_profile": null
                }
            ],
            "session_id": "20241018212700",
            "fees": [],
            "network_fee_notional": null,
            "network_fee_quantity": null,
            "total_notional": "1000.00",
            "asset_cost_notional": "995.00",
            "spread_notional": "0",
            "spread_bps": "0",
            "issuer_fee_amount": "5", 
            "issuer_fee_rate": "5",
            "issuer_fee_payor_type": "CUSTOMER",
            "origin": "rest_api"
        },
```

## 

Ledger Movements and Account Balance Changes

On the ledger, when the Customer is paying the fee, there a ledger movement from the Customer account to zerohash. In the below example, assume the following:

- Customer's USDC `account_id` = bccbce77-f80c-48b1-960f-9608b68bbe95
- Customer's USD `account_id` = accbce88-f80c-48b1-960f-9608b68bbe86

### 

Trade Settlement and Issuer Fee Movements

Example `GET /movements` response.

JSON

```
{
    "message": [
        {
            "movement_timestamp": 1729286889000,
            "account_id": "bccbce77-f80c-48b1-960f-9608b68bbe95",
            "movement_id": "66ef0a01-e1b1-4b60-a660-34199669151e",
            "movement_type": "final_settlement",
            "transfer_type": null,
            "deposit_reference_id": null,
            "withdrawal_request_id": null,
            "parent_link_id": null,
            "trade_id": "20f34c33-9b7d-467f-8f57-156b67134544",
            "change": "-995.00",
            "origin": "rest_api"
        },
        {
            "movement_timestamp": 1729286889000,
            "account_id": "accbce88-f80c-48b1-960f-9608b68bbe86",
            "movement_id": "43562582-517c-4e7d-91cf-a1601f02b733",
            "movement_type": "final_settlement",
            "transfer_type": null,
            "deposit_reference_id": null,
            "withdrawal_request_id": null,
            "parent_link_id": null,
            "trade_id": "20f34c33-9b7d-467f-8f57-156b67134544",
            "change": "995",
            "origin": "rest_api"
        },
        {
            "movement_timestamp": 1729286889000,
            "account_id": "bccbce77-f80c-48b1-960f-9608b68bbe95",
            "movement_id": "43562582-517c-4e7d-91cf-a1601f02b733",
            "movement_type": "issuer_fee",
            "transfer_type": null,
            "deposit_reference_id": null,
            "withdrawal_request_id": null,
            "parent_link_id": null,
            "trade_id": "20f34c33-9b7d-467f-8f57-156b67134544",
            "change": "-5",
            "origin": "rest_api"
        },
```

Note: there are 2 `final_settlement` representing the movements on the trade, and a 5 USD debit from the Customer's USD account to pay the Issuer Fee, leaving the Customer with 995 USD after the sell transaction has completed.

## 

Liquidity API Flow (Fee Payor: Platform)

### 

General

- For the below examples, the Platform's `participant_code` is PLAT01 and their Customer's is `CUST01`.
- Assume the fee schedule mentioned in the [above table](https://docs.zerohash.com/docs/issuer-fees#issuer-fee-schedule)
- Assume the Platform is not configured for to be exempt from Issuer Fees
- Here, the Platform will be paying the Issuer Fee. Looking at the Sell example, the difference here is the Issuer Fee is recorded per trade similar to to the Fee Payor: Customer example, however the Customer will not be paying for the Issuer Fee in real-time, and instead will end up with 1,000 USD ultimately. **The Platform will then be invoiced at the end of the month** in order to pay zerohash the sum of all Issuer Fees during the month.

### 

Get Quote (Buy)

Example [POST /liquidity/rfq](https://docs.zerohash.com/reference/post_liquidity-rfq) request:

JSON

```
{
    "side": "buy",
    "participant_code": "CUST01",
    "underlying": "USDC.ETH",
    "quoted_currency": "USD",
    "total": "1000",
    "settlement_type":"STANDARD" // the only supported settlement_type currently is "STANDARD" and implies instant settlement
}
```

[POST /liquidity/rfq](https://docs.zerohash.com/reference/post_liquidity-rfq) response (note: no issuer fee is applied on the "buy" quote):

JSON

```
{
    "message": {
        "request_id": "b4d90a78-0fd0-4e4a-bd4a-9c14e19a12f3",
        "participant_code": "PLAT01",
        "quoted_currency": "USD",
        "side": "buy",
        "quantity": "1000",
        "price": "1",
        "quote_id": "b76a72c9-8083-4126-a25c-5e995f86ae24",
        "expire_ts": 1729286069180,
        "account_group": "00SCXM",
        "account_label": "general",
        "obo_participant": {
            "participant_code": "CUST01",
            "account_group": "PLAT01",
            "account_label": "general"
        },
        "underlying": "USDC.ETH",
        "asset_cost_notional": "1000",
        "spread_notional": "0",
        "spread_bps": "0",
        "issuer_fee_amount": "0", 
        "issuer_fee_rate": "0",
        "issuer_fee_payor_type": "",
        "settlement_type": "",
    }
}
```

### 

Get Quote (Sell)

Example [POST /liquidity/rfq](https://docs.zerohash.com/reference/post_liquidity-rfq) request:

JSON

```
{
    "side": "sell",
    "participant_code": "CUST01",
    "underlying": "USDC.ETH",
    "quoted_currency": "USD",
    "total": "1000",
    "settlement_type": "STANDARD"
}
```

Note: If the Platform omits the optional `settlement_type` parameter, then the issuer fee of 5 basis points in this scenario will still be applied to the quote. The `settlement_type` field may be expanded in the future to accommodate different settlement types (ie, a T+2 schedule), however `STANDARD` is the only supported value right now.

[POST /liquidity/rfq](https://docs.zerohash.com/reference/post_liquidity-rfq) response (note: there is now an issuer fee being applied on the "sell" quote):

JSON

```
{
    "message": {
        "request_id": "b4d90a78-0fd0-4e4a-bd4a-9c14e19a12f3",
        "participant_code": "PLAT01",
        "quoted_currency": "USD",
        "side": "sell",
        "quantity": "1000",
        "price": "1",
        "quote_id": "b76a72c9-8083-4126-a25c-5e995f86ae24",
        "expire_ts": 1729286069180,
        "account_group": "00SCXM",
        "account_label": "general",
        "obo_participant": {
            "participant_code": "CUST01",
            "account_group": "PLAT01",
            "account_label": "general"
        },
        "underlying": "USDC.ETH",
        "asset_cost_notional": "1000",
        "spread_notional": "0",
        "spread_bps": "0",
        "issuer_fee_amount": "5", 
        "issuer_fee_rate": "5",
        "issuer_fee_payor_type": "CUSTOMER",
        "settlement_type": "STANDARD",
    }
}
```

### 

Execute Quote

[POST /liquidity/execute](https://docs.zerohash.com/reference/post_liquidity-execute) request

JSON

```
{ 
   "quote_id": "b76a72c9-8083-4126-a25c-5e995f86ae24"
}
```

[POST /liquidity/execute](https://docs.zerohash.com/reference/post_liquidity-execute) response:

JSON

```
{
    "message": {
        "request_id": "12b73072-fbbd-4ee8-a2a1-6dabc57c8242",
        "quote": {
            "request_id": "fdecf77f-f329-4dd2-bc07-b6a596c13769",
            "participant_code": "UW6VWU",
            "quoted_currency": "USD",
            "side": "buy",
            "quantity": "1000",
            "price": "1",
            "quote_id": "b76a72c9-8083-4126-a25c-5e995f86ae24",
            "expire_ts": 1729286880350,
            "account_group": "00SCXM",
            "account_label": "general",
            "obo_participant": {
                "participant_code": "T0A4YI",
                "account_group": "UW6VWU",
                "account_label": "general"
            },
            "underlying": "USDC.ETH",
            "asset_cost_notional": "1000",
            "spread_notional": "0",
            "spread_bps": "0",
            "issuer_fee_amount": "5", 
            "issuer_fee_rate": "5",
            "issuer_fee_payor_type": "CUSTOMER",
            "settlement_type": "STANDARD",
            "transaction_timestamp": 1729286878417
        },
        "trade_id": "20f34c33-9b7d-467f-8f57-156b67134544",
        "status": "Completed",
        "trade_ids_list": [
            "20f34c33-9b7d-467f-8f57-156b67134544"
        ]
    }
}
```

### 

Get Trade

A Platform can query previously executed trades via either the [GET /trades](https://docs.zerohash.com/reference/get_trades) or [GET /trades/:trade\_id](https://docs.zerohash.com/reference/get_trades-trade-id) endpoint. Here is an example `GET /trades/20f34c33-9b7d-467f-8f57-156b67134544` response:

JSON

```
{
    "message": [
        {
            "batch_trade_id": null,
            "trade_id": "20f34c33-9b7d-467f-8f57-156b67134544",
            "client_trade_id": "cd4f8a1b-f137-43cc-b93e-7998f5040bda",
            "trade_state": "terminated",
            "market_identifier_code": "SCXM",
            "trade_reporter_code": "00SCXM",
            "symbol": "USDC.ETH/USD",
            "trade_quantity": "1000",
            "trade_price": "1",
            "trade_type": "regular",
            "physical_delivery": true,
            "comment": "",
            "last_update": 1729286889816,
            "transaction_timestamp": 1729286878000,
            "accepted_timestamp": 1729286878435,
            "defaulted_timestamp": null,
            "settled_timestamp": 1729286889805,
            "expiry_timestamp": null,
            "settlement_timestamp": null,
            "settlement_price_index_id": null,
            "contract_size": 1,
            "underlying": "USDC.ETH",
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
                    "side": "sell",
                    "asset": "USDC.ETH",
                    "amount": "null",
                    "liquidity_indicator": null,
                    "execution_id": "",
                    "order_id": "",
                    "obligations_outstanding_timestamp": null,
                    "current_obligations_met_timestamp": null,
                    "settlement_state": "settled",
                    "client_order_id": "",
                    "collateral_percentage": null,
                    "account_label": "general",
                    "account_profile": null
                },
                {
                    "settling": true,
                    "participant_code": "00SCXM",
                    "side": "sell",
                    "asset": "USD",
                    "amount": "null",
                    "liquidity_indicator": null,
                    "execution_id": "",
                    "order_id": "",
                    "obligations_outstanding_timestamp": null,
                    "current_obligations_met_timestamp": null,
                    "settlement_state": "settled",
                    "client_order_id": "",
                    "collateral_percentage": null,
                    "account_label": "inventory",
                    "account_profile": null
                }
            ],
            "session_id": "20241018212700",
            "fees": [],
            "network_fee_notional": null,
            "network_fee_quantity": null,
            "total_notional": "1000.00",
            "asset_cost_notional": "1000.00",
            "spread_notional": "0",
            "spread_bps": "0",
            "issuer_fee_amount": "5", 
            "issuer_fee_rate": "5",
            "issuer_fee_payor_type": "CUSTOMER",
            "settlement_type": "STANDARD",
            "origin": "rest_api"
        },
```

## 

Ledger Movements and Account Balance Changes

On the ledger, when the Customer is paying the fee, there a ledger movement from the Customer account to zerohash. In the below example, assume the following:

- Customer's USDC `account_id` = bccbce77-f80c-48b1-960f-9608b68bbe95
- Customer's USD `account_id` = accbce88-f80c-48b1-960f-9608b68bbe86

### 

Trade Settlement and Issuer Fee Movements

Example `GET /movements` response.

JSON

```
{
    "message": [
        {
            "movement_timestamp": 1729286889000,
            "account_id": "bccbce77-f80c-48b1-960f-9608b68bbe95",
            "movement_id": "66ef0a01-e1b1-4b60-a660-34199669151e",
            "movement_type": "final_settlement",
            "transfer_type": null,
            "deposit_reference_id": null,
            "withdrawal_request_id": null,
            "parent_link_id": null,
            "trade_id": "20f34c33-9b7d-467f-8f57-156b67134544",
            "change": "1000.00",
            "origin": "rest_api"
        },
        {
            "movement_timestamp": 1729286889000,
            "account_id": "accbce88-f80c-48b1-960f-9608b68bbe86",
            "movement_id": "43562582-517c-4e7d-91cf-a1601f02b733",
            "movement_type": "final_settlement",
            "transfer_type": null,
            "deposit_reference_id": null,
            "withdrawal_request_id": null,
            "parent_link_id": null,
            "trade_id": "20f34c33-9b7d-467f-8f57-156b67134544",
            "change": "1000",
            "origin": "rest_api"
        }
```

Note:

- there are only 2 `final_settlement` representing the movements on the trade and no `"movement_type": "issuer_fee"` movements in the response

## 

Fund API Flow (Fee Payor: Customer)

### 

General

- For the below examples, the Platform's `participant_code` is PLAT01 and their Customer's is CUST01.
- Assume the fee schedule mentioned in the [above table](https://docs.zerohash.com/docs/issuer-fees#issuer-fee-schedule)
- Assume the Platform is not configured for to be exempt from Issuer Fees

### 

Get Quote

Example [POST /fund/rfq](https://docs.zerohash.com/reference/post_fund-rfq) request:

JSON

```
{
  "participant_code": "CUST01",
  "fund_asset": "USDC.ETH",
}
```

Example [POST /fund/rfq](https://docs.zerohash.com/reference/post_fund-rfq) response:

JSON

```
{
    "message": {
        "request_id": "09bd1584-9a62-4f51-9a3c-ffa998dafd17",
        "participant_code": "CUST01",
        "fund_asset": "USDC.ETH",
        "rate": "1",
        "quoted_currency": "USD",
        "expiry_timestamp": null,
        "deposit_address": "JDWRUD4APGGXmetZJgcC8Dc9TzA8UQmvFTAnP9s2rU6b",
        "fee_bps": 0,
        "subsequent_deposit_fee_floor": "1",
        "first_deposit_fee_floor": "1",
        "minimum_deposit": "1",
        "maximum_deposit": "2",
        "issuer_fee_amount": "5", 
        "issuer_fee_rate": "5",
        "issuer_fee_payor_type": "CUSTOMER",
        "settlement_type": "STANDARD", 
    }
}
```

### 

Deposit and Conversion

The Customer will send an on-chain deposit to the `deposit_address` triggering an automatic conversion to USD.

### 

Webhook

The Platform will receive a webhook that will appear like the following:

JSON

```
{
  "participant_code": "CUST01",
  "fund_asset": "USDC.ETH",
  "rate": "1",
  "quoted_currency": "USD",
  "source_address": "0x3A45a60c62EE6cD616B1C4510404Eba88116044I", 
  "deposit_address": "0x3A45a60c635E6cD616B1C4510404Eba88116050C",
  "quantity": "500",
  "notional": "495",
  "issuer_fee_amount": "5", 
  "issuer_fee_rate": "5",
  "issuer_fee_payor_type": "CUSTOMER",
  "settlement_type": "STANDARD", 
  "fund_id": "5155f7c9-95cb-4556-ab89-c178943a7111",
  "fund_timestamp": 1550174574,
  "transaction_id": "a07407e8f98c21b037b4aa0cbc852b8489c5e122fcc3d4b33b7827d0605ad8ff",
  "account_label": "general",
  "success": true,
  "status_reason" : ""
}
```

### 

Email

If the Platform is configured for email receipts, the End Customer will receive an email, which will have a separate item that shows the Issuer Fee.

### 

Get Fund Transactions

A Platform can query previously executed Fund Events via the [GET /fund/transactions](https://docs.zerohash.com/reference/get_fund-transactions) endpoint. Here is an example `GET /fund/transactions?fund_id=5155f7c9-95cb-4556-ab89-c178943a7111` response:

JSON

```
{
    "message": [
        {
            "participant_code": "CUST01",
            "fund_asset": "USDC.ETH",
            "rate": "1",
            "quoted_currency": "USD",
            "source_address": "CpP6vA4ZjHRu3XJSd4pSbuNq6CJ6PXsVGZEhZfW4t8vh",
            "deposit_address": "FwRn5kiFCsFjHWN8gzgJBLjPcNrjpshkRmH5h1vLuUVF",
            "quantity": "500",
            "notional": "495",
            "success": true,
            "status_reason": "",
            "fund_timestamp": 1729090026619,
            "deposit_timestamp": 1729090201457,
            "transaction_id": "4oYP15i4Le1pxmMaL3vedfUugRE6rTPyfvf5p5JJRKBqoSDzKBcb7EQBMyE4foHbpeCishZeUm6AW4Z63wYqjfQG",
            "account_label": "general",
            "fund_id": "8aa6569f-788c-4959-ba48-c0be25c63da9",
            "is_first_deposit": true,
            "raw_fee_bps": "0",
            "actual_fee_bps": "0",
            "raw_fee_notional": "0",
            "actual_fee_notional": "0",
            "issuer_fee_amount": "5", 
            "issuer_fee_rate": "5",
            "issuer_fee_payor_type": "CUSTOMER",
            "settlement_type": "STANDARD",           
            "deposited_asset": "USDC.SOL"
        },            
```

## 

Fund API Flow (Fee Payor: Platform)

### 

General

- For the below examples, the Platform's `participant_code` is PLAT01 and their Customer's is CUST01.
- Assume the fee schedule mentioned in the [above table](https://docs.zerohash.com/docs/issuer-fees#issuer-fee-schedule)
- Assume the Platform is not configured for to be exempt from Issuer Fees

### 

Get Quote

Example [POST /fund/rfq](https://docs.zerohash.com/reference/post_fund-rfq) request:

JSON

```
{
  "participant_code": "CUST01",
  "fund_asset": "USDC.ETH",
}
```

Example [POST /fund/rfq](https://docs.zerohash.com/reference/post_fund-rfq) response:

JSON

```
{
    "message": {
        "request_id": "09bd1584-9a62-4f51-9a3c-ffa998dafd17",
        "participant_code": "CUST01",
        "fund_asset": "USDC.ETH",
        "rate": "1",
        "quoted_currency": "USD",
        "expiry_timestamp": null,
        "deposit_address": "JDWRUD4APGGXmetZJgcC8Dc9TzA8UQmvFTAnP9s2rU6b",
        "fee_bps": 0,
        "subsequent_deposit_fee_floor": "1",
        "first_deposit_fee_floor": "1",
        "minimum_deposit": "1",
        "maximum_deposit": "2",
        "issuer_fee_amount": "5", 
        "issuer_fee_rate": "5",
        "issuer_fee_payor_type": "CUSTOMER",
        "settlement_type": "STANDARD", 
    }
}
```

### 

Deposit and Conversion

The Customer will send an on-chain deposit to the `deposit_address` triggering an automatic conversion to USD.

### 

Webhook

The Platform will receive a webhook that will appear like the following:

JSON

```
{
  "participant_code": "CUST01",
  "fund_asset": "USDC.ETH",
  "rate": "1",
  "quoted_currency": "USD",
  "source_address": "0x3A45a60c62EE6cD616B1C4510404Eba88116044I", 
  "deposit_address": "0x3A45a60c635E6cD616B1C4510404Eba88116050C",
  "quantity": "500",
  "notional": "500",
  "issuer_fee_amount": "5", 
  "issuer_fee_rate": "5",
  "issuer_fee_payor_type": "CUSTOMER",
  "settlement_type": "STANDARD", 
  "fund_id": "5155f7c9-95cb-4556-ab89-c178943a7111",
  "fund_timestamp": 1550174574,
  "transaction_id": "a07407e8f98c21b037b4aa0cbc852b8489c5e122fcc3d4b33b7827d0605ad8ff",
  "account_label": "general",
  "success": true,
  "status_reason" : ""
}
```

### 

Email

If the Platform is configured for email receipts, the End Customer will receive an email, which will have a separate item that shows the Issuer Fee as $0.

### 

Get Fund Transactions

A Platform can query previously executed Fund Events via the [GET /fund/transactions](https://docs.zerohash.com/reference/get_fund-transactions) endpoint. Here is an example `GET /fund/transactions?fund_id=5155f7c9-95cb-4556-ab89-c178943a7111` response:

JSON

```
{
    "message": [
        {
            "participant_code": "CUST01",
            "fund_asset": "USDC.ETH",
            "rate": "1",
            "quoted_currency": "USD",
            "source_address": "CpP6vA4ZjHRu3XJSd4pSbuNq6CJ6PXsVGZEhZfW4t8vh",
            "deposit_address": "FwRn5kiFCsFjHWN8gzgJBLjPcNrjpshkRmH5h1vLuUVF",
            "quantity": "500",
            "notional": "500",
            "success": true,
            "status_reason": "",
            "fund_timestamp": 1729090026619,
            "deposit_timestamp": 1729090201457,
            "transaction_id": "4oYP15i4Le1pxmMaL3vedfUugRE6rTPyfvf5p5JJRKBqoSDzKBcb7EQBMyE4foHbpeCishZeUm6AW4Z63wYqjfQG",
            "account_label": "general",
            "fund_id": "8aa6569f-788c-4959-ba48-c0be25c63da9",
            "is_first_deposit": true,
            "raw_fee_bps": "0",
            "actual_fee_bps": "0",
            "raw_fee_notional": "0",
            "actual_fee_notional": "0",
            "issuer_fee_amount": "5", 
            "issuer_fee_rate": "5",
            "issuer_fee_payor_type": "CUSTOMER",
            "settlement_type": "STANDARD",           
            "deposited_asset": "USDC.SOL"
        },            
```

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page