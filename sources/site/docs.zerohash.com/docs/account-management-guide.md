# Source: https://docs.zerohash.com/docs/account-management-guide

# 

Context

This guide is helpful for businesses such as Liquidity Providers who are transitioning from a Client Portal-led account management process to an API-driven one.

The below sections will discuss best API practices for the following processes:

- Query current balance - get balances across different assets
- Generating deposit addresses - use the API to generate new deposit addresses
- Query deposit addresses - get all current deposit addresses
- Initiate withdrawals - initiate withdrawals out to external addresses
- Tracking withdrawals - get up-do-date status updates on already-submitted withdrawals

# 

Query current balance

LP's can query their current balances via the [GET /accounts](https://docs.zerohash.com/reference/get_accounts) endpoint. The key filter you can use are `asset` to. Here is an example response for a standard [GET /accounts](https://docs.zerohash.com/reference/get_accounts) call:

JSON

```
{
  "message": [
    {
      "asset": "BTC",
      "account_owner": "LPLP01",
      "account_type": "available",
      "account_group": "00SCXM",
      "account_label": "general",
      "balance": "1.5",
      "account_id": "ce819fe8-b1d7-43bb-961c-e09ede0988d3",
      "last_update": 1554395972174
    },
    {
      "asset": "ETH",
      "account_owner": "LPLP01",
      "account_type": "available",
      "account_group": "00SCXM",
      "account_label": "general",
      "balance": "14.2",
      "account_id": "ce819fe8-b1d7-43bb-961c-e09ede0988d3",
      "last_update": 1554395972174
    }
  ]
}
```

If you filter for BTC, like [GET /accounts?asset=BTC](https://docs.zerohash.com/reference/get_accounts), then the response will only show BTC accounts:

JSON

```
{
  "message": [
    {
      "asset": "BTC",
      "account_owner": "LPLP01",
      "account_type": "available",
      "account_group": "00SCXM",
      "account_label": "general",
      "balance": "1.5",
      "account_id": "ce819fe8-b1d7-43bb-961c-e09ede0988d3",
      "last_update": 1554395972174
    }
  ]
}
```

_LPLP01_ is an example LP `participant_code` - replace this value with your designated `participant_code`

> ❗️
> 
> ### 
> 
> If an account with `account_type` = `payable` shows a positive balance, it means there is an unsettled trade. No action is required from you; ZeroHash is working to settle it.

# 

Generating deposit addresses

Instead of generating a deposit address via the Client Portal, you can just as easily create one via API. The endpoint you will use is [POST /deposits/digital\_asset\_addresses](https://docs.zerohash.com/reference/post_deposits-digital-asset-addresses).

If you want to create a BTC address, here is an example **request**:

JSON

```
(
  "participant_code": "LPLP01",
  "asset": "BTC"
)
```

Example **response**:

JSON

```
{
  "message": {
    "created_at": 1590663417000,
    "address": "2NCgV7BXXafJZ86utcYFs5m3tCpkcpLafeG",
    "participant_code": "LPLP01",
    "platform_code": "00SCXM",
    "asset": "BTC"
  }
}
```

The LP is now free to deposit to this address and their available balance will be updated.

# 

Query deposit addresses

The LP can query existing deposit addresses via [GET /deposits/digital\_asset\_addresses](https://docs.zerohash.com/reference/get_deposits-digital-asset-addresses). Example response:

JSON

```
{
  "message": {
    "created_at": 1590663417000,
    "address": "2NCgV7BXXafJZ86utcYFs5m3tCpkcpLafeG",
    "participant_code": "LPLP01",
    "platform_code": "00SCXM",
    "asset": "BTC"
  }
}
```

# 

Initiate withdrawals

To rebalance your crypto wallets across the ecosystem (ie, transferring to another exchange), you can withdraw funds using a **single API endpoint**. Call the [POST /withdrawals/requests](https://docs.zerohash.com/reference/post_withdrawals-requests) endpoint. Example **request**:

JSON

```
(
  "participant_code": "LPLP01",
  "account_group": "00SCXM",
  "asset": "BTC",
  "address": "5LCgV7BXXafJZ86utcYFs5m3tCpkcpLadrT"
)
```

Example **response**:

JSON

```
{
  "message": {
    "id": "78",
    "withdrawal_account_id": 51,
    "participant_code": "LPLP01",
    "requestor_participant_code": "LPLP01",
    "requested_amount": ".2",
    "settled_amount": ".2",
    "status": "APPROVED",
    "asset": "BTC",
    "account_group": "00SCXM",
    "account_label": "general",
    "transaction_id": null,
    "requested_timestamp": 1554395972174,
    "gas_price": null,
    "client_withdrawal_request_id": null,
    "on_chain_status": "PENDING",
    "fee_amount": "0.00",
    "withdrawal_fee": "0.00",
    "quoted_fee_amount": "0.00",
    "quoted_fee_notional": "0.00"
  }
}
```

> ❗️
> 
> ### 
> 
> Note: For LP's, zerohash will pay the network fee

# 

Tracking withdrawals

You can track and query already-submitted withdrawals via [GET /withdrawals/requests](https://docs.zerohash.com/reference/get_withdrawals-requests). Example response:

JSON

```
{
  "message": {
    "id": "78",
    "withdrawal_account_id": 51,
    "participant_code": "LPLP01",
    "requestor_participant_code": "LPLP01",
    "requested_amount": ".2",
    "settled_amount": ".2",
    "status": "SETTLED",
    "asset": "BTC",
    "account_group": "00SCXM",
    "account_label": "general",
    "transaction_id": null,
    "requested_timestamp": 1554395972174,
    "gas_price": null,
    "client_withdrawal_request_id": null,
    "on_chain_status": "CONFIRMED",
    "fee_amount": "0.00",
    "withdrawal_fee": "0.00",
    "quoted_fee_amount": "0.00",
    "quoted_fee_notional": "0.00"
  }
}
```

# 

Webhooks

You can also subscribe to Account Balance updates webhook events. See page [here](https://docs.zerohash.com/reference/account-balance).

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page