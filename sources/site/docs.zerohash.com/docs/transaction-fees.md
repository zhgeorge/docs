# Source: https://docs.zerohash.com/docs/transaction-fees

Transaction Fees allows a Platform to specify the fees that were assessed on the order.

## 

Use Cases

- **Reporting:** Platforms can pass fees via the `POST /convert_withdraw/rfq` endpoint including the fees to the request, execute the quote via `POST /convert_withdraw/execute`, and have those fees perpetually “tied” to a trade (trade\_id). Retroactively, Platforms can query `GET /trades` and `GET /trades/:trade_id` in order to view the fee information. This is helpful for their internal reporting, reconciliation, and audit needs.
- **Automation:** Building upon the reporting use case, Platforms can use the fee information that they retrieve via `GET /trades` or `GET /trades/:trade_id` to automate internal processes of theirs. For example, let’s assume Platform A has embedded their onramp within multiple non-custodial wallets. The non-custodial wallets charge the onramps a fee per transaction. The onramp will settle these fee payments on some periodic basis, say monthly. When it comes time to make these payments once a month, the onramp can query the zerohash API to get a sum of all fees within a particular time frame, come up with an amount, and automatically disperse the fees through the payment method of their choice. No manual intervention needed, completely automated.

## 

Technical Notes

The feature is available on the following endpoints. Note the below 2 endpoints were created specifically to accommodate the Transaction Fee feature. Other than fees, they function the exact same as their GET predecessors and. The 4 GET and POST endpoints will continue to be supported indefinitely until stated otherwise:

- `POST /convert_withdraw/rfq`
- `POST /liquidity/rfq`

In order to define a Transaction Fee(s), the Platform must specify a value(s) in the fee array.

A Platform can define a maximum of 5 fees per order.

For each fee, the Platform must specify the `name` and the `amount`.

We will validate that submitted `spread` values do not breach a **zerohash-dictated maximum threshold amount that are based on regulatory requirements**. We will reject quotes made via the `POST /convert_withdraw/rfq` and `GET /convert_withdraw/rfq` endpoint if the combination of the spread and all fees (excluding the network fee), as a percentage of the `total_notional` exceeds a certain threshold. This threshold depends on the current jurisdiction that end customer resides in. In the United States (the only country that this feature is enabled for), the initial max thresholds are as follows:

- New York (NY): 7.5% or 750 bps
- All other states: No limit

## 

Flow

### 

Get Quote

Example request: `POST /convert_withdraw/rfq`

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
  "spread": "200",  
  "fees": [  
    {  
      "amount": "2.50",  
      "name": "processing-1"  
    },  
    {  
      "amount": "1.95",  
      "name": "processing-2"  
    }  
  ]  
}
```

Example response:

JSON

```
{  
  "message": {  
    "request_id": "b19cbddf-e60a-4d7e-90a7-a016833c5bb3",  
    "participant_code": "PLAT01",  
    "quoted_currency": "USD",  
    "side": "buy",  
    "quantity": "0.0424217997337298",  
    "price": "2250.7295918443399046",  
    "quote_id": "021bdc37-ad2f-42aa-b15d-57a8a2785edd",  
    "expire_ts": 1701648755375,  
    "account_group": "00SCXM",  
    "account_label": "general",  
    "obo_participant": {  
      "participant_code": "CUST01",  
      "account_group": "PLAT01",  
      "account_label": "general"  
    },  
    "network_fee_notional": "0.07",
    "network_fee_quantity": "0.000031500000252",
    "fees": [
    {
      "amount": "2.50",
      "name": "processing-1"
    },
    {
      "amount": "1.95",
      "name": "processing-2"
    }
  					]
}
```

### 

Execute Quote

Example request: `POST /convert_withdraw/execute`

```
{  
  "quote_id": "021bdc37-ad2f-42aa-b15d-57a8a2785edd"  
}
```

Example response:

JSON

```
{  
  "message": {  
    "request_id": "22129379-8a78-4772-9518-56aa130416a8",  
    "quote": {  
      "request_id": "b19cbddf-e60a-4d7e-90a7-a016833c5bb3",  
      "participant_code": "PLAT01",  
      "quoted_currency": "USD",  
      "side": "buy",  
      "quantity": "0.0424217997337298",  
      "price": "2250.7295918443399046",  
      "quote_id": "021bdc37-ad2f-42aa-b15d-57a8a2785edd",  
      "expire_ts": 1701648755375,  
      "account_group": "00SCXM",  
      "account_label": "general",  
      "obo_participant": {  
        "participant_code": "CUST01",  
        "account_group": "PLAT01",  
        "account_label": "general"  
      },  
      "network_fee_notional": "0.07",  
      "network_fee_quantity": "0.000031500000252",  
      "total_notional": "100",  
      "underlying": "ETH",  
      "asset_cost_notional": "95.48",  
      "spread_notional": "1.9096",  
      "spread_bps": "200",  
      "fees": [  
        {  
          "name": "processing-1",  
          "amount": "2.50"  
        },  
        {  
          "name": "processing-2",  
          "amount": "1.95"  
        }  
      ],
      
      "transaction_timestamp": 1701648752300,
			"trade_id": "3743e8a7-e5b3-4bc2-98d2-8053360dd88a",
      "status": "Completed",
      "trade_ids_list": [
           "3743e8a7-e5b3-4bc2-98d2-8053360dd88a"
                        ],
      "withdrawal_request_id": "60d6913b-51d5-4668-b71c-dfc8724f6299"
    } 
 }   
```

## 

Reporting and Automation

- Platforms can retroactively poll the zerohash api in order to record the fees that were assessed on a given trade via 2 endpoints:
 - `GET /trades`
 - `GET /trades/:trade_id`

Example request: `GET /trades/3743e8a7-e5b3-4bc2-98d2-8053360dd88a`

JSON

```
Example response:  
{  
  "message": {  
      "batch_trade_id": null,  
      "trade_id": "3743e8a7-e5b3-4bc2-98d2-8053360dd88a",  
      "client_trade_id": "021bdc37-ad2f-42aa-b15d-57a8a2785edd",  
      "trade_state": "accepted",  
      "market_identifier_code": "SCXM",  
      "trade_reporter_code": "00SCXM",  
      "symbol": "ETH/USD",  
      "trade_quantity": "0.0424217997337298",  
      "trade_price": "2250.7295918443399046",  
      "trade_type": "regular",  
      "physical_delivery": true,  
      "comment": "",  
      "last_update": 1701648752843,  
      "transaction_timestamp": 1701648752000,  
      "accepted_timestamp": 1701648752334,  
      "defaulted_timestamp": null,  
      "settled_timestamp": null,  
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
              "amount": "null",  
              "liquidity_indicator": null,  
              "execution_id": "",  
              "order_id": "",  
              "obligations_outstanding_timestamp": null,  
              "current_obligations_met_timestamp": null,  
              "settlement_state": null,  
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
              "settlement_state": null,  
              "client_order_id": "",  
              "collateral_percentage": null,  
              "account_label": "inventory",  
              "account_profile": null  
          }  
      ],  
      "session_id": null,  
      "fees": [  
              {  
                "name": "processing-1",  
                "amount": "2.50"  
              },  
              {  
                "name": "processing-2",  
                "amount": "1.95"  
              }  
          ],  
      ],  
      "network_fee_notional": "0.07",  
      "network_fee_quantity": "0.000031500000252",  
      "total_notional": "100.00",  
      "asset_cost_notional": "95.48",  
      "spread_notional": "1.9096",  
      "spread_bps": "200"  
  }  
}
```

The platform now has access to a complete trade record and has all the data necessary to perform reconciliation, reporting, and carry out any automated tasks.

Updated 2 months ago

---

Did this page help you?

Yes

No

Copy Page