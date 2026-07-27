# Source: https://docs.zerohash.com/docs/spreads-and-fees

zerohash supports a variety of flexible commission configurations on our RFQ system to cater to your needs. Fees can be collected by adjusting the quoted price using a basis points (bps) value, ensuring customers see an all-in execution price with fees already included.

## 

Spread-Based Fees

- Commissions are applied by adjusting the quoted bid or ask by a spread.
- Spreads can be configured for each trading instrument supported.
- Custom spread can be requested on demand.

### 

Custom Spread

Platforms can also send a custom spread value to be applied to the quote on a per-request basis. This allows platforms to adjust their commissions depending on market activity or promotions in their systems. This is done by including the parameter `spread` in the request payload to the [`POST /liquidity/rfq`](https://docs.zerohash.com/reference-link/post_liquidity-rfq) endpoint.

#### 

Sample Request

JSON

```
{
    "side": "buy",
    "participant_code": "PLAT01",
    "account_label": "general",
    "underlying": "BTC",
    "quoted_currency": "USD",
    "quantity": 100,
    "spread": "50",
    "quote_expiry": "5s"
}
```

## 

Fees on Liquidity

zerohash offers the capability to include fees with RFQs to the [`POST /liquidity/rfq`](https://docs.zerohash.com/reference-link/post_liquidity-rfq) endpoint. Fees can be defined as a basis point or a notional value that will be applied to the notional of your quote.

### 

Fees as a Notional Amount

zerohash supports fees in notional values on liquidity requests. To apply a notional fee to the quote's notional value, include a fee object with `"type": "notional"` and set `"amount"` to the desired notional value (e.g., `"0.05"` for $0.05).

> ℹ️
> 
> ### 
> 
> If no type is provided, notional type will be applied as the default value.

#### 

Sample Request

JSON

```
{
    "side": "buy",
    "underlying": "BTC",
    "quoted_currency": "USD",
    "total": "100",
    "participant_code": "PLAT01",
    "fees": [
        {
            "name": "test",
            "amount": "0.05",
            "type": "notional"
        }
    ]
}
```

#### 

Sample Response

JSON

```
{
    "message": {
        "request_id": "d4334ac4-3ec2-4ba4-9c7e-1c46ee2a3173",
        "participant_code": "PLAT01",
        "quoted_currency": "USD",
        "side": "buy",
        "quantity": "0.00085099",
        "price": "117451.4389123256442496",
        "quote_id": "5e5b6f4e-eedc-45c6-a79f-0c2f8d33992f",
        "expire_ts": 1755897279421,
        "account_group": "00SCXM",
        "account_label": "general",
        "obo_participant": {
            "participant_code": "PLAT01",
            "account_group": "PLAT01",
            "account_label": "general"
        },
        "total_notional": "100",
        "settlement_type": null,
        "issuer_fee_rate": null,
        "issuer_fee_amount": null,
        "issuer_fee_payor_type": null,
        "underlying": "BTC",
        "asset_cost_notional": "99.95",
        "spread_notional": "0",
        "spread_bps": "0",
        "fees": [
            {
                "name": "test",
                "amount": "0.05"
            }
        ]
    }
}
```

### 

Fees as Basis Points

zerohash supports fees in basis points (bps) on liquidity requests. To apply a bps fee to the quote notional, include a fee object with `"type": "bps"` and set `"amount"` to the desired bps value (e.g., `"10"` for 10 bps).

#### 

Sample Request

JSON

```
{
    "side": "buy",
    "underlying": "BTC",
    "quoted_currency": "USD",
    "total": "100",
    "participant_code": "PLAT01",
    "fees": [
        {
            "name": "test",
            "type": "bps",
            "amount": "10"
        }
    ]
}
```

#### 

Sample Response

JSON

```
{
    "message": {
        "request_id": "d4334ac4-3ec2-4ba4-9c7e-1c46ee2a3173",
        "participant_code": "PLAT01",
        "quoted_currency": "USD",
        "side": "buy",
        "quantity": "0.00085099",
        "price": "117451.4389123256442496",
        "quote_id": "5e5b6f4e-eedc-45c6-a79f-0c2f8d33992f",
        "expire_ts": 1755897279421,
        "account_group": "00SCXM",
        "account_label": "general",
        "obo_participant": {
            "participant_code": "PLAT01",
            "account_group": "PLAT01",
            "account_label": "general"
        },
        "total_notional": "100",
        "settlement_type": null,
        "issuer_fee_rate": null,
        "issuer_fee_amount": null,
        "issuer_fee_payor_type": null,
        "underlying": "BTC",
        "asset_cost_notional": "99.90",
        "spread_notional": "0",
        "spread_bps": "0",
        "fees": [
            {
                "name": "test",
                "amount": "0.10"
            }
        ]
    }
}
```

## 

Tranche Based Fees

zerohash offers the ability to configure tranche based fees in notional and basis points. Calculations can be configured as Tier or Progressive. Examples for these calculation types are provided below.

### 

Sample Platform Tranche Fee Configuration

| Tranche Start | Tranche End | Fee | Fee Type |
| --- | --- | --- | --- |
| $0.01 | $10.00 | 0.01 | notional |
| $10.01 | $20.00 | 25 | bps |
| $20.01 | $50.00 | 0.05 | notional |
| $50.01 | $100.00 | 15 | bps |
| $100.01 | System Limit | 0.15 | notional |

#### 

Sample RFQ

JSON

```
{
    "side": "buy",
    "underlying": "BTC",
    "quoted_currency": "USD",
    "total": "50",
    "participant_code": "PLAT01",
}
```

### 

Tier Tranche Calculation Example

- Interval : $20.01 - $50
- Fee type : notional
- Fee amount : $0.05

#### 

Response

JSON

```
{
    "message": {
        "request_id": "d4334ac4-3ec2-4ba4-9c7e-1c46ee2a3173",
        "participant_code": "PLAT01",
        "quoted_currency": "USD",
        "side": "buy",
        "quantity": "0.00085099",
        "price": "117451.4389123256442496",
        "quote_id": "5e5b6f4e-eedc-45c6-a79f-0c2f8d33992f",
        "expire_ts": 1755897279421,
        "account_group": "00SCXM",
        "account_label": "general",
        "obo_participant": {
            "participant_code": "PLAT01",
            "account_group": "PLAT01",
            "account_label": "general"
        },
        "total_notional": "50",
        "settlement_type": null,
        "issuer_fee_rate": null,
        "issuer_fee_amount": null,
        "issuer_fee_payor_type": null,
        "underlying": "BTC",
        "asset_cost_notional": "49.95",
        "spread_notional": "0",
        "spread_bps": "0",
        "fees": [
            {
                "name": "tranche",
                "amount": "0.05"
            }
        ]
    }
}
```

### 

Progressive Tranche Calculation Example

#### 

Tranche One

- Interval : $0.01 - $10
- Fee type : notional
- Notional fee amount : $0.01

#### 

Tranche Two

- Interval : $10.01 - $20.00
- Fee type : bps
- Notional fee amount : $0.02

#### 

Tranche Three

- Interval : $20.01 - $50.00
- Fee type : notional
- Fee amount : $0.05

The progressive calculation for this example RFQ sums the fee from each tranche, resulting in a total fee of $0.08.

#### 

Response

JSON

```
{
    "message": {
        "request_id": "d4334ac4-3ec2-4ba4-9c7e-1c46ee2a3173",
        "participant_code": "PLAT01",
        "quoted_currency": "USD",
        "side": "buy",
        "quantity": "0.00085099",
        "price": "117451.4389123256442496",
        "quote_id": "5e5b6f4e-eedc-45c6-a79f-0c2f8d33992f",
        "expire_ts": 1755897279421,
        "account_group": "00SCXM",
        "account_label": "general",
        "obo_participant": {
            "participant_code": "PLAT01",
            "account_group": "PLAT01",
            "account_label": "general"
        },
        "total_notional": "50",
        "settlement_type": null,
        "issuer_fee_rate": null,
        "issuer_fee_amount": null,
        "issuer_fee_payor_type": null,
        "underlying": "BTC",
        "asset_cost_notional": "49.92",
        "spread_notional": "0",
        "spread_bps": "0",
        "fees": [
            {
                "name": "tranche",
                "amount": "0.08"
            }
        ]
    }
}
```

### 

Set Additional Fees on Top of Tranche Fees

If an additional fee is provided in the RFQ payload, and tranche based fees are enabled, the additional fee will be added to the tranche fee. For example, if a $0.02 fee is submitted in the fees array, and the tranche fee is calculated as $0.08, then the additional fee will be included in the quote response.

#### 

Sample Request

JSON

```
{
    "side": "buy",
    "underlying": "BTC",
    "quoted_currency": "USD",
    "total": "100",
    "participant_code": "PLAT01",
    "fees": [
        {
            "name": "custom",
						"amount": "0.02"
        }
    ]
}
```

#### 

Sample Response

JSON

```
{
    "message": {
        "request_id": "d4334ac4-3ec2-4ba4-9c7e-1c46ee2a3173",
        "participant_code": "PLAT01",
        "quoted_currency": "USD",
        "side": "buy",
        "quantity": "0.00085099",
        "price": "117451.4389123256442496",
        "quote_id": "5e5b6f4e-eedc-45c6-a79f-0c2f8d33992f",
        "expire_ts": 1755897279421,
        "account_group": "00SCXM",
        "account_label": "general",
        "obo_participant": {
            "participant_code": "PLAT01",
            "account_group": "PLAT01",
            "account_label": "general"
        },
        "total_notional": "50",
        "settlement_type": null,
        "issuer_fee_rate": null,
        "issuer_fee_amount": null,
        "issuer_fee_payor_type": null,
        "underlying": "BTC",
        "asset_cost_notional": "49.90",
        "spread_notional": "0",
        "spread_bps": "0",
        "fees": [
            {
                "name": "tranche",
                "amount": "0.08"
            },
            {
                "name": "custom",
                "amount": "0.02"
            }
        ]
    }
}
```

### 

Bypassing Tranche Fees

Tranche fees can be removed from a quote by passing `name : "tranche"` and `amount : "0"`.

If tranche fees are not configured, and `name : "tranche"` and `amount : "0"` is passed, the quote will be rejected.

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page