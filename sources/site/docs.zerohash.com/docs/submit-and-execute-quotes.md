# Source: https://docs.zerohash.com/docs/submit-and-execute-quotes

zerohash provides two straightforward endpoints to request and execute quotes. Quotes can be configured with an expiration time of 5 or 30 seconds, though this can be adjusted to fit your use case.

## 

Request a Quote

> Endpoint: [`POST /liquidity/rfq`](https://docs.zerohash.com/reference/post_liquidity-rfq)

- Platforms can request a quote specifying trading instrument, side, notional/quantity and any optional parameters (e.g., custom spread).
- The response includes:
 - A unique `quote_id`.
 - Quoted price with fees included.
 - Quote expiration timestamp.

### 

Sample Request

JSON

```
{
  "side": "buy",
  "participant_code": "CUST01",
  "account_label": "general",
  "underlying": "USDC.ETH",
  "quoted_currency": "USD",
  "quantity": 500,
  "spread": "25",
}
```

### 

Sample Response

JSON

```
{
  "message": {
    "request_id": "42684912-6107-4547-9999-977b2f847bfd",
    "participant_code": "ZBGFHV",
    "quoted_currency": "USD",
    "side": "buy",
    "quantity": "500",
    "price": "1.0025",
    "quote_id": "2888c933-4766-4a35-aba7-a3d3c3c8e3cc",
    "expire_ts": 1755539666435,
    "account_group": "00SCXM",
    "account_label": "general",
    "obo_participant": {
      "participant_code": "X58PGA",
      "account_group": "ZBGFHV",
      "account_label": "general"
    },
    "total_notional": "501.25",
    "settlement_type": null,
    "issuer_fee_rate": null,
    "issuer_fee_amount": null,
    "issuer_fee_payor_type": null,
    "underlying": "USDC.ETH",
    "asset_cost_notional": "501.25",
    "spread_notional": "1.25",
    "spread_bps": "25"
  }
}
```

> ⚠️
> 
> ### 
> 
> Credit checks on participants balances are not performed on the RFQ request.

## 

Execute a Quote

> Endpoint[`POST /liquidity/execute`](ef:post_liquidity-execute)

- To execute the quote, the platform must pass the `quote_id` from the active quote.
- The following validations occur:
 - The quote expiration must still be valid.
 - The customer account is checked to ensure sufficient balance to cover the trade.
- Trade details will be returned to the platform on successful execution of a quote.

### 

Sample Request

JSON

```
{
  "quote_id": "1f998343-d9f1-4b1d-bed7-df3aa8265bdb"
}
```

### 

Sample Response

JSON

```
{
  "message": {
    "request_id": "ca2d7948-4468-4691-9b63-c306179ffae7",
    "quote": {
      "request_id": "9ec9921d-f8d6-49d7-89db-cdd67f1d6e11",
      "participant_code": "ZBGFHV",
      "quoted_currency": "USD",
      "side": "buy",
      "quantity": "500",
      "price": "1.0025",
      "quote_id": "1f998343-d9f1-4b1d-bed7-df3aa8265bdb",
      "expire_ts": 1755542139137,
      "account_group": "00SCXM",
      "account_label": "general",
      "obo_participant": {
        "participant_code": "X58PGA",
        "account_group": "ZBGFHV",
        "account_label": "general"
      },
      "total_notional": "501.25",
      "settlement_type": null,
      "issuer_fee_rate": null,
      "issuer_fee_amount": null,
      "issuer_fee_payor_type": null,
      "underlying": "USDC.ETH",
      "asset_cost_notional": "501.25",
      "spread_notional": "1.25",
      "spread_bps": "25",
      "transaction_timestamp": 1755542134538
    },
    "trade_id": "a2b4bed4-9723-4f22-9692-8efc53e4ef7f",
    "status": "Completed",
    "trade_ids_list": [
      "a2b4bed4-9723-4f22-9692-8efc53e4ef7f"
    ]
  }
}
```

> 🖊️
> 
> ### 
> 
> Credit checks are perform on quote execution to ensure the platform can cover the trade.

## 

Retrieve Trade Information

> Endpoint: [`GET /trades`](https://docs.zerohash.com/reference/get_trades)

- After quote execution, the trade details can be retrieved using the `trade_id` returned in step 2.
- The `/trades` endpoint also supports filter parameters (e.g., by instrument, date range, or trade\_id) for retrieving historical activity.

## 

Quoting Controls

- Platforms can define minimum and maximum quote notional values when responding to an RFQ. All limits defined by the platform should remain inside the ZeroHash limits defined in the supported instruments (RFQ) page
- Platforms defined limits must fall within the constraints listed in the [RFQ Supported Assets page](https://docs.zerohash.com/docs/supported-instruments-1).
- Platforms can set a default quote validity periods (e.g., 5s, 30s) to suit their workflow, while having the ability request other expiration windows on request.

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page