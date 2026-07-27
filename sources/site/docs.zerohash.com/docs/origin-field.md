# Source: https://docs.zerohash.com/docs/origin-field

## 

Background

The `origin` field in our REST API specifies how a movement or trade was initiated, identifying whether it originated from our REST API, SDK, or the Secondary Portal. Each transaction is categorized with the following origin values based on its initiation method:

- Rest API: `rest_api`
- SDK: `sdk`
- Secondary Portal: `secondary`

## 

Available Endpoints

You can find the `origin` field in the movements endpoint for account-related data: [`GET /accounts/:id/movements`](https://docs.zerohash.com/reference/get_accounts-account-id-movements)

Additionally, it is present in the following endpoints for trade-related information:

- [`GET /trades`](https://docs.zerohash.com/reference/get_trades)
- [`GET /trades/:trade_id`](https://docs.zerohash.com/reference/get_trades-trade-id)

## 

Example

Assume Platform (PLAT01) has built a buy/sell/hold product leveraging the `/liquidity` endpoints for their Application A.

### 

Rest API Trade

The Platform gets a quote via `POST /liquidity/rfq` for their Customer (CUST01)

JSON

```
{  
    "side": "buy",  
    "participant_code": "CUST01",  
    "underlying": "BTC",  
    "quoted_currency": "USD",  
    "total": "100"  
}
```

Response:

JSON

```
{
    "message": {
        "request_id": "08f763a9-1b04-4114-8d2f-19846acf9006",
        "participant_code": "PLAT01",
        "quoted_currency": "USD",
        "side": "buy",
        "quantity": "0.00166666",
        "price": "60000.00",
        "quote_id": "21193344-115f-4323-ad5f-181e8ff309ed",
        "expire_ts": 1719843753827,
        "account_group": "00SCXM",
        "account_label": "general",
        "obo_participant": {
            "participant_code": "CUST01",
            "account_group": "PLAT01",
            "account_label": "general"
        },
        "total_notional": "100",
        "underlying": "BTC",
        "asset_cost_notional": "100",
        "spread_notional": "",
        "spread_bps": ""
    }
}
```

The Platform executes the quote:

JSON

```
{  
   "quote_id": "21193344-115f-4323-ad5f-181e8ff309ed"  
}
```

Response:

JSON

```
{  
    "message": {  
        "request_id": "1a51d145-84ef-4593-a3c1-d9d6b6419917",  
        "quote": {  
            "request_id": "08f763a9-1b04-4114-8d2f-19846acf9006",  
            "participant_code": "PLAT01",  
            "quoted_currency": "USD",  
            "side": "buy",  
            "quantity": "0.00166666",  
            "price": "60000.00",  
            "quote_id": "21193344-115f-4323-ad5f-181e8ff309ed",  
            "expire_ts": 1719843753827,  
            "account_group": "00SCXM",  
            "account_label": "general",  
            "obo_participant": {  
                "participant_code": "CUST01",  
                "account_group": "PLAT01",  
                "account_label": "general"  
            },  
            "total_notional": "10",  
            "underlying": "BTC",  
            "asset_cost_notional": "10",  
            "spread_notional":"",  
            "spread_bps": "",  
            "transaction_timestamp": 1719843729596  
        },  
        "trade_id": "0d4ebcb1-06d3-4826-b5f8-39c0121e6b9a",  
        "status": "Completed",  
        "trade_ids_list": [  
            "0d4ebcb1-06d3-4826-b5f8-39c0121e6b9a"  
        ]  
    }  
}
```

The platform can then query `GET /trades/0d4ebcb1-06d3-4826-b5f8-39c0121e6b9a` and see the `origin` field in the response at very bottom:

JSON

```
{  
    "message": {  
        "batch_trade_id": null,  
        "trade_id": "0d4ebcb1-06d3-4826-b5f8-39c0121e6b9a",  
        "client_trade_id": "21193344-115f-4323-ad5f-181e8ff309ed",  
        "trade_state": "terminated",  
        "market_identifier_code": "SCXM",  
        "trade_reporter_code": "00SCXM",  
        "symbol": "BTC/USD",  
        "quantity": "0.00166666",  
        "trade_price": "60000.00",  
        "trade_type": "regular",  
        "physical_delivery": true,  
        "comment": "",  
        "last_update": 1719843735531,  
        "transaction_timestamp": 1719843729596,  
        "accepted_timestamp": 1719843729599,  
        "defaulted_timestamp": null,  
        "settled_timestamp": 1719843729605,  
        "expiry_timestamp": null,  
        "settlement_timestamp": null,  
        "settlement_price_index_id": null,  
        "contract_size": 1,  
        "underlying": "BTC",  
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
                "asset": "BTC",  
                "amount": "0.00166666", 
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
                "amount": "100",  
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
        "session_id": "20240701142200",  
        "fees":"",  
        "network_fee_notional": null,  
        "network_fee_quantity": null,  
        "total_notional": "100.00",  
        "asset_cost_notional": "100.00",  
        "spread_notional": "",  
        "spread_bps": "",  
        "origin": "rest_api"  
    }  
}
```

Additionally, this field is present on the `GET /accounts/:id/movements` endpoint where `:id` is the account associated with CUST01's BTC account. Response:

JSON

```
"message":[  
        {  
            "movement_timestamp": 1719843734000,  
            "account_id": "c689dcfb-24c8-455b-bdea-e4ea0e891254",  
            "movement_id": "fa07d4c0-a3a9-4a3a-881b-86811cc89156",  
            "movement_type": "final_settlement",  
            "transfer_type": null,  
            "deposit_reference_id": null,  
            "withdrawal_request_id": null,  
            "parent_link_id": null,  
            "trade_id": "0d4ebcb1-06d3-4826-b5f8-39c0121e6b9a",  
            "change":"0.00166666",  
            "origin": "rest_api"  
        }
```

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page