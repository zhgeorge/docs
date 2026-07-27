# Source: https://docs.zerohash.com/docs/custom-spreads

Custom Spreads allows a Platform to programmatically specify, on a per order basis, the spread-to-be-added. This will affect the purchase or sale price that is ultimately displayed to the end customer.

Platforms know their end customers best: using the Custom Spreads feature, they can optimize for increased trading volume, thus revenue, via a simple and singular new API field (see Technical Notes section below for details).

## 

Note

- This feature is only offered to Platforms who use Zero Hash Liquidity Services.
- With this [launch](https://docs.zerohash.com/changelog/custom-spreads#summary), we created a new endpoint called `POST /convert_withdraw/rfq`. It functions the exact same as the `GET /convert_withdraw/rfq` version. Both of them will continue to be supported indefinitely until stated otherwise.

## 

Use Cases

- **Affiliate:** Platforms that act as onramps embed their payment widget within all sorts of different wallets or exchanges (i.e., an Affiliate). They may elect to apply spreads differently across the various venues.
- **Asset:** Spreads can be altered depending on the asset.
- **Competition:** Typically onramps are competing for volume based on the price they display their end customers (among other aspects). Platforms can use Custom Spreads in order to entice end customers to choose their payment experience over their competitors.
- **Market environment:** Spreads can be altered depending on whether there is a bull or bear market.
- **Trade size:** Spreads can be toggled down on larger orders and up on smaller ones, or vice-versa.

## 

Technical Notes

- The feature is available on the following two endpoints:
 - `GET /convert_withdraw/rfq`
 - `POST /convert_withdraw/rfq`
- In order to define a Custom Spread, the Platform must specify a value for the spread field.
- We will validate that submitted `spread` values do not breach a **zerohash-dictated maximum threshold amount that is based on regulatory requirements.** We will reject quotes made via the `POST /convert_withdraw/rfq` and `GET /convert_withdraw/rfq` endpoint if the combination of the spread and all fees (excluding the network fee), as a percentage of the `total_notional`, exceeds a certain threshold. This threshold depends on the current jurisdiction that the end customer resides in. In the United States (the only country that this feature is enabled for), the initial max thresholds are as follows:
 - New York (NY): 7.5% or 750 bps
 - All other states: No limit

## 

Flow

### 

Get Quote

#### 

Example request

`POST /convert_withdraw/rfq`

JSON

```
{
    "side": "buy",
    "participant_code": "CUST01",
    "underlying": "ETH",
    "quoted_currency": "USD",
    "total": "100",
    "withdrawal_address": "0x6E0C18D71f470cc5076A74FE34c19Ab51129C6F7",
    "fee_inclusive": true,
    "spread": "200.55"
}
```

#### 

Example Response

JSON

```
{
    "message": {
        "request_id": "394f48f1-026f-460d-9367-6824d63cf0ae",
        "participant_code": "PLAT01",
        "quoted_currency": "USD",
        "side": "buy",
        "quantity": "0.05264138",
        "price": "1866.5924031626830452",
        "quote_id": "1c605f0c-305b-42d3-9972-1634d6fd2102",
        "expire_ts": 1745941827779,
        "account_group": "00SCXM",
        "account_label": "general",
        "obo_participant": {
            "participant_code": "CUST01",
            "account_group": "PLAT01",
            "account_label": "general"
        },
        "network_fee_notional": "1.74",
        "network_fee_quantity": "0.0009485071483083",
        "total_notional": "100",
        "underlying": "ETH",
        "asset_cost_notional": "98.26",
        "spread_notional": "1.97",
        "spread_bps": "200.55"
    }
}
```

### 

Execute Quote

#### 

Example request

`POST /convert_withdraw/execute`

JSON

```
{
  "quote_id": "1c605f0c-305b-42d3-9972-1634d6fd2102"
}
```

#### 

Example response

JSON

```
{
    "message": {
        "request_id": "d0f5b3ac-4415-488c-8dad-61ad86025419",
        "quote": {
            "request_id": "394f48f1-026f-460d-9367-6824d63cf0ae",
            "participant_code": "PLAT01",
            "quoted_currency": "USD",
            "side": "buy",
            "quantity": "0.05264138",
            "price": "1866.5924031626830452",
            "quote_id": "1c605f0c-305b-42d3-9972-1634d6fd2102",
            "expire_ts": 1745941827779,
            "account_group": "00SCXM",
            "account_label": "general",
            "obo_participant": {
                "participant_code": "CUST01",
                "account_group": "PLAT01",
                "account_label": "general"
            },
            "network_fee_notional": "1.74",
            "network_fee_quantity": "0.0009485071483083",
            "total_notional": "100",
            "underlying": "ETH",
            "asset_cost_notional": "98.26",
            "spread_notional": "1.97",
            "spread_bps": "200.55",
            "transaction_timestamp": 1745941798602
        },
        "trade_id": "bc21f3b2-824d-4878-9201-b87949f27875",
        "status": "Completed",
        "trade_ids_list": [
            "bc21f3b2-824d-4878-9201-b87949f27875"
        ],
        "withdrawal_request_id": "4d9d5795-6f14-4ea4-b991-31577a2bef8f"
    }
}
```

Updated 2 months ago

---

Did this page help you?

Yes

No

Copy Page