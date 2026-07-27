# Source: https://docs.zerohash.com/docs/withdrawal-spreads

Beyond network fees, platforms can [monetize withdrawals](https://docs.zerohash.com/changelog/customer-withdrawal-fee#action-required) and add their own markup as a fixed amount, percentage, or both.

- **Fixed Amount**: A fixed amount to be applied regardless of the amount being sent. For example, $0.25 can be added to withdrawals for all or certain assets.
- **Spread Percentage**: A percentage of the total withdrawal amount that is added. For example, 1% of the value being transferred could be added as a fee.

Note that there may be limits or caps in-place depending on the jurisdiction such as NY. See [Custom Spreads](https://docs.zerohash.com/docs/custom-spreads) for more information.

## 

Spread Types

### 

Netted Spread: Fee deducted from amount sent

Example:

- User withdraws: 100 USDC
- Platform spread: 1% = 1 USDC
- Network fee: 0.05 USDC
- Amount received: 98.95 USDC
- User debited: 100 USDC

### 

Additive Spread: Fee charged on top of withdrawal

Example:

- User withdraws: 100 USDC
- Platform spread: 1% = 1 USDC
- Network fee: 0.05 USDC
- Amount received: 100 USDC
- User debited: 101.05 USDC

## 

Configuration

To begin using this functionality, the following platform configurations must be set per ASSET with your zerohash account team:

- `withdrawal_spread_type`: `NETTED` or `ADDITIVE`
 - **Netted** deducts a fixed amount from the participant and any fees will be deducted from the quantity that is sent
 - **Additive** deducts the sending quantity in addition to any fees, so that the sending quantity is received by the destination wallet
- `withdrawal_spread_fixed_fee`: '**0.50**' (in base currency, not atomic units)
- `withdrawal_spread_percentage_fee`: '**1**' (absolute percentage, so 1 = 1%)

Note that both types of fees can be used together, for instance, a percentage plus a fixed amount of the quantity being sent.

These values can be updated at any time by working with your zerohash account team.

**Sample API Payload**

JSON

```
{  
  "message": {  
    "request_id": "6a8c267b-2f9e-4cb1-a8ee-901311891722",  
    "withdrawal_quote_id": "129f5825-1a1a-40b6-8770-fcf102125e2b",  
    "withdrawal_request_id": "e4b1135a-a88f-45c0-93c0-eef5f7e62729",  
    "participant_code": "1NY182",  
    "account_group": "JB41VN",  
    "account_label": "general",  
    "withdrawal_address": "0xD4eD0e192c2DBb5594eDA4601f9403a8af64e7cF",  
    "destination_tag": "",  
    "no_destination_tag": false,  
    "asset": "ETH",  
    "amount": "0.01",  
    "amount_notional": "20.52",  
    "network_fee": "0.000031500000252",  
    "network_fee_notional": "0.06",  
    "on_chain_status": "PENDING",  
    "withdrawal_fee": "0.0001"  
  }  
}
```

There are two fields related to the network fee:

- `network_fee_asset` is the asset that will be used to pay the network fee, for instance USDC.ETH sends USDC but the network fee is paid in Ethereum (see [Network Fee Estimate](https://docs.zerohash.com/reference/get_withdrawals-estimate-network-fee))
- `network_fee` is the amount of `network_fee_asset` charged i.e BTC charged on the BTC withdrawal (and subsequently deducted/netted from the customers withdrawal). For example, a `network_fee` value of .1 on a 1 BTC withdrawal ends with the customer getting 0.9 BTC when the network fee type is set netted. In an additive model, the destination wallet would receive 1 BTC and the participant would be deducted 1.1 BTC.

The two notional fields represent the USD value of that crypto deduction at the time of the withdrawal

- `amount_notional` The amount being sent (in the above example $20.52)
- `network_fee_notional` The network fee converted to USD (in the above example ~$0.06)

## 

Endpoints Impacted

This functionality impacts the following endpoints:

- [POST /withdrawals/requests](https://docs.zerohash.com/reference/post_withdrawals-requests)
- [POST /withdrawals/execute](https://docs.zerohash.com/reference/post_withdrawals-execute)
- [GET /withdrawals/requests](https://docs.zerohash.com/reference/get_withdrawals-requests)
- [GET /withdrawals/requests/:id](https://docs.zerohash.com/reference/get_withdrawals-requests-id)
- [GET /withdrawals/locked\_network\_fee](https://docs.zerohash.com/reference/get_withdrawals-locked-network-fee)

## 

Related Documentation

- See this guide on [Custom Spreads](https://docs.zerohash.com/docs/custom-spreads#technical-notes) for additional information on applying custom spreads to convert\_withdraw transactions.

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page