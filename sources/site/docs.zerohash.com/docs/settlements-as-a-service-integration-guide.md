# Source: https://docs.zerohash.com/docs/settlements-as-a-service-integration-guide

The following is the integration flow for platforms using zerohash Settlements as a Service.

## 

Participant Onboarding

Before a trade can be settled using the zerohash post-trade settlement service, Platforms must confirm the following steps are complete.

- A customer record must be created, associated to your platform and in an `approved` status.
 - Use [`POST /participants/customers/new`](https://docs.zerohash.com/reference/post_participants-customers-new) to create a new customer account.
 - Use [`GET /participant/{participant_code}/basic_info`](https://docs.zerohash.com/reference/get_participant-participant-code-basic-info) to retrieve customer details.
 - The customers `status` in the response should be `approved`.
- The customer has been assigned a `participant_code` .

You can read more here in out [participants API documentation](https://docs.zerohash.com/reference/participants).

## 

Create Deposit Address

To initiate **_post trade settlement_** between retail counterparties, you must first generate a deposit address for the participant receiving the digital asset. This address will be used to receive funds and is created via API using the [`POST /deposits/digital_asset_addresses`](https://docs.zerohash.com/reference/post_deposits-digital-asset-addresses). Each deposit address/memo is associated with a specific `participant_code` and platform, and unique per asset.

#### 

Request

JSON

```
{
  "participant_code": "CUST01",
  "platform_code": "PLAT01",
  "asset": "BTC",
  "account_label": "general"
}
```

#### 

Response

JSON

```
{
  "message": {
    "created_at": 1590663417000,
    "address": "2NCgV7BXXafJZ86utcYFs5m3tCpkcpLafeG",
    "participant_code": "CUST01",
    "platform_code": "PLAT01",
    "asset": "BTC"
  }
}
```

> 🚧
> 
> ### 
> 
> The deposited amount must equal the quantity specified in the trade being settled. Do not subtract network fees from the settlement amount — if the received amount is less than what’s required due to fees or other deductions, the trade cannot be settled.

## 

Trade Submission

Once the funds have been deposited, you must submit the trade that represents the payment terms of the settlement. This trade must include the customer's `participant_code` and should reflect the correct direction of the asset flow.

JSON

```
{  
   "symbol":"BTC/USD",  
   "trade_price":"7000.00000",  
   "product_type":"spot",  
   "trade_type":"regular",  
   "trade_reporter":"reporter@platform.com",  
   "platform_code":"PLAT01",  
   "client_trade_id":"test1",  
   "physical_delivery":true,  
   "parties_anonymous":false,  
   "transaction_timestamp":1569014063570,  
   "parties":[  
      {  
         "participant_code":"ABCDEF",
         "asset":"BTC",  
         "amount":"0.5",  
         "side":"buy",  
         "settling": true  
      },  
      {  
         "participant_code":"PLAT01",
         "asset":"USD",  
         "amount":"3500.0000",  
         "side":"sell",
         "settling": false  
      }  
   ]  
}
```

### 

Key Field Explanations

- `trade_id` : Unique ID used to reference the trade in the zerohash system.
- `trade_reporter_code`: your participant\_code, zerohash adds.
- `trade_reporter`: an identifiable string, the platform submits.
- `platform_code`: your participant\_code, the platform submits.

## 

Trade Settlement

Trades are processed as soon as they are submitted, but you should wait for the trade to be in status `settled` before initiating any withdrawals.

To confirm trade settlement, use the [`GET /trades/:trade_id`](https://docs.zerohash.com/reference/get_trades-trade-id) endpoint with the `trade_id` field returned on trade submission. You should see the following fields;

- `trade_state : terminated`
- `settlement_state : settled`

These values indicate that legal ownership of the digital asset has been transferred to the buyer. At this point, the trade is considered fully settled.

Although not required, you can perform an additional check using [GET /accounts](https://docs.zerohash.com/reference/get_accounts). Filter the request by the customer’s `participant_code` to verify that the crypto has been credited to their account.

## 

Withdraw

Once settled, you can send out a `POST /withdrawals/requests` request to withdraw the assets and have them sent to the customer. The request body looks like:

JSON

```
{  
   "address":"customer's address",  
   "participant_code":"ABCDEF",    //<-- customer's participant_code  
   "amount":"0.5",  
   "asset":"BTC",  
   "account_group":"PLAT01"        //<-- platform's participant_code  
}
```

You will then be able to query the [GET /withdrawals/requests](https://docs.zerohash.com/reference/get_withdrawals-requests) endpoint, and filter on the customer’s `participant_code` to identify the status of the withdrawal, as well as the on-chain transaction ID.

**Important note about withdrawals:** Zero Hash will settle what it can. If your customer has .05 BTC in their account for example, and you submit a withdrawal request for .07 BTC, we will settle the .05 and process the withdrawal.

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page