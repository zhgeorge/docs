# Source: https://docs.zerohash.com/docs/rewards-integration-guide

Assume the the following participants for the below example:

- Platform (participant\_code: PLAT01)
- End Customer (participant\_code: CUST01)

## 

Fund float account

1. Platforms will need to pre-fund the float account. Although the only responsibility of the platform is to send funds to zerohash, here are the technical details of the float account in case the platform wishes to query the balances via GET /accounts:

 | Field | Value |
 | --- | --- |
 | Participant | Zero Hash Liquidity Services (00SCXM) |
 | Asset | USD |
 | Account Type | available |
 | Account Group | \[Platform Code\] |
 | Account Label | rewards |

## 

Initiate reward transaction

You can use quantity or total. All other fields are required.

- Using `quantity`: "I want to give my customer, CUST01, .002 BTC"

JSON

```
{
    "participant_code": "CUST01",
    "underlying_currency": "BTC",
    "quoted_currency": "USD",
    "quantity": ".002"
}
```

- Using `total`: "I want to give my customer, CUST01, $60 worth of BTC"

JSON

```
{
    "participant_code": "CUST01",
    "underlying_currency": "BTC",
    "quoted_currency": "USD",
    "total": "60"
}
```

A status of 'Completed' for this endpoint means that you successfully post crypto rewards to the participant. For any HTTP errors, you can refer to our [API error handling page](https://docs.zerohash.com/docs/error-handling).

1. These transactions will settle instantly. The platform can then query [GET /accounts](https://docs.zerohash.com/reference/get_accounts) and view the balance for `CUST01`. In this example, the Platform (`PLAT01`), is making the call:

JSON

```
{
    "asset": "BTC",
    "account_owner": "CUST01",
    "account_type": "available",
    "account_group": "PLAT01",
    "account_label": "general",
    "balance": ".002",
    "account_id": "14a147e8-6d71-42a2-832c-4d45d4b50d55",
    "last_update": 1616428235111
}

 
```

### 

How to view the current rewards float balance

To view the current float balance for the rewards account, you can use [GET /accounts](https://docs.zerohash.com/reference/get_accounts) endpoint and search for the account matching the following descriptions:

- account\_owner: 00SCXM
- account\_type: available
- account\_group: your platform
- account\_label: rewards

### 

How to deal with the ‘Insufficient credit’ error message

When executing a rewards trade, you might be getting the below error message:

JSON

```
{
    "error": "Insufficient credit: insufficient credit"
}
```

‘Insufficient credit’ means you do not have enough funds in your rewards float account to cover the buy trade. To resolve this issue, you will need to top up your rewards account in the usual way and then try to execute the buy trade afterwards.

You can refer to the above section on how to view your current rewards float balance.

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page