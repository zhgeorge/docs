# Source: https://docs.zerohash.com/docs/transaction-limits

# 

Introduction

Transaction Limits provides a unified framework that allows Platforms to **define and** **enforce configurable limits on an individual customer’s transaction activity**. These limits can be applied across flexible time intervals (ie, daily, weekly, monthly) and tailored to the platform’s specific requirements, ensuring consistent, centralized, and compliant control over per-customer transactions.

> 📘
> 
> ### 
> 
> You must be configured to use this feature by the zerohash team - please reach out if you are interested in enabling.

# 

Roles

| Party | Role |
| --- | --- |
| Platform | Communicate default limits to zerohash pre-go live |
| zerohash | Set the default limit configuration |
| Platform | Override pre-configured limits |
| zerohash | Maintain and enforce the limits based on transaction activity |

# 

Use Cases

## 

Account Funding

Platforms that use the Account Funding [SDK](https://docs.zerohash.com/docs/fund-integration-guide-sdk) or [API](https://docs.zerohash.com/docs/fund-integration-guide-api) can use the Transaction Limits feature to programmatically and definitively prevent users funding more than the defined limit.

### 

End to end example - Happy Path

#### 

Default, per-customer limit is defined

Platforms should work with their zerohash relationship manager to establish default transaction limits that apply to all customers. zerohash can quickly make this configuration on our end.

#### 

Query limits

Once default transaction limits have been defined, Platforms can fetch the limits using the [GET /participant/{participant\_code}/limits](https://docs.zerohash.com/reference/get_participant-participant-code-limits) endpoint. Platforms should use this endpoint to ensure limits displayed on their UI are aligned with limits set with zerohash.

- where `"period" = 24`, the `limit` will reset to the corresponding `configured_limit` daily.
- where `"period" = 168`, the `limit` will reset to the corresponding `configured_limit` weekly.
- where `"period" = 720`, the `limit` will reset to the corresponding `configured_limit` monthly (every 30 days).
- where `"period" = 744`, the `limit` will reset to the corresponding `configured_limit` monthly (every 31 days).
- `"period"` can also be used to define custom time periods by the hour for transaction limits. (Ex. Platform can set a transaction limit with a time period of 2 days with `"period" = 48`)

**Sample Response**

JSON

```
{
"participant_code": "CUST01",
"limits": [
      {
        "type": [
          "trades" 
        ],
        "period": 24, // 24 hours: 1 day
        "configured_limit": "25000", // static value based on defined per-transaction limit
        "limit": "25000", // this is a dynamic value that adjusts as activity occurs
        "asset": "USD"
      },
     {
        "type": [
          "trades" 
        ],
        "period": 720, // 720 hours: 30 days
        "configured_limit": "100000", // static value based on defined per-customer limit
        "limit":"100000", // this is a dynamic value that adjusts as activity occurs
        "asset": "USD"
      }
    ]
}
```

#### 

Platform invokes the Account Funding SDK + the Customer makes a deposit

The Account Funding SDK is invoked with the [POST /client\_auth\_token](https://docs.zerohash.com/reference/post_client-auth-token) endpoint. The SDK will display transaction limits associated with the `participant_code` :

![](https://files.readme.io/285cf6b3decc1efcc2df9505874367028206e13d24231013ab395046c3632d39-Transaction_limit.png)

"Remaining limit" renders the closest applicable limit based on the backend limit rules. If the closest limit corresponds to a daily, weekly, or monthly threshold, the label will explicitly include the relevant time period (e.g., “Remaining daily limit”). If no specific time-based limit applies, the UI will display “Remaining limit” without referencing a period.

In all cases, the value shown represents the maximum amount the user can deposit without exceeding any applicable limit.

Once zerohash has received a deposit from the Customer, a [webhook](https://docs.zerohash.com/reference/fund-transaction-update) will be returned to the Platform.

**Sample Success Webhook**

JSON

```
{
  "participant_code": "CUST01",
  "fund_asset": "USDC.ETH",
  "rate": "1",
  "quoted_currency": "USD",
  "source_address": "0x3A45a60c62EE6cD616B1C4510404Eba88116044I", 
  "deposit_address": "0x34f53Aea3ba8b60B0ed19106baF43A4f3F73f248",
  "quantity": "5000",
  "notional": "5000",
  "fund_id": "5155f7c9-95cb-4556-ab89-c178943a7111",
  "fund_timestamp": 1750404905186631445,
  "deposit_timestamp": 1750404905037719568,
  "transaction_id": "a07407e8f98c21b037b4aa0cbc852b8489c5e122fcc3d4b33b7827d0605ad8ff",
  "account_label": "general",
  "success": true,
  "reference_id": "d098e59b-8023-4477-8b63-68fda3c53a30",
  "raw_fee_bps": "30",
  "raw_fee_notional": "15.00",
  "deposit_fee_bps": "30",
  "deposit_fee_notional": "15.00"
}
```

At this point, the Platform can choose to query the Customer's limits via the [GET /participant/{participant\_code}/limits](https://docs.zerohash.com/reference/get_participant-participant-code-limits) endpoint to view the current limits.

- `configured_limit` will remain unchanged, as it represents the pre-defined transaction limit
- `limit` will adjust based on the amount the Customer has deposited.

**Sample Response**

JSON

```
{
"participant_code": "CUST01",
"limits": [
      {
        "type": [
          "trades"
        ],
        "period": 24, // 24 hours: 1 day
				"configured_limit": "25000", // static
        "limit": "20000", // adjusted down
        "asset": "USD" // 
      },
     {
        "type": [
          "trades"
        ],
        "period": 720, // 720 hours: 30 days
        "configured_limit": "100000", //static
        "limit": "95000", // adjusted down 
        "asset": "USD"
      }
    ],
"as_of_timestamp": 123456789 
}
```

#### 

Platform overrides the default limit

The Platform can choose to override the default limit by making a request to the [PATCH /participant/{participant\_code}/limits](https://docs.zerohash.com/reference/patch_participant-participant-code-limits) endpoint. In this request, the Platform is looking to further adjust down the Customer's 24 hour and monthly limit by an additional $5,000. Example request:

JSON

```
{
"limits": [
      {
        "type": [
          "trades" 
        ],
        "period": 24, // 24 hours: 1 day
        "configured_limit": "15000", // 5,000 less than currently set limit
        "asset": "USD"
      },
     {
        "type": [
          "trades" // enum: trade
        ],
        "period": 720, // 720 hours: 30 days
        "configured_limit": "90000", // 5,000 less than currently set limit
        "asset": "USD"
      }
    ]
```

**Sample response**

JSON

```
{
"limits": [
      {
        "type": [
          "trades"
        ],
        "period": 24, // 24 hours: 1 day
				"configured_limit": "25000", // static
        "limit": "15000", // adjusted down
        "asset": "USD" // 
      },
     {
        "type": [
          "trades"
        ],
        "period": 720, // 720 hours: 30 days
        "configured_limit": "100000", //static
        "limit": "90000", // adjusted down 
        "asset": "USD"
      }
    ],
"as_of_timestamp": 123456789 
}
```

This new limit will now be reflected in the [GET /participant/{participant\_code}/limits](https://docs.zerohash.com/reference/get_participant-participant-code-limits) endpoint and will also be displayed on the SDK.

**Please note** that if you choose to omit an already-existing limit, zerohash will remove that limit all-together. For example if the [PATCH /participant/{participant\_code}/limits](https://docs.zerohash.com/reference/patch_participant-participant-code-limits) request looked like this (with the monthly limit omitted):

JSON

```
{
"participant_code": "CUST01", // end customer participant code
"limits": [
      {
        "type": [
          "trades" 
        ],
        "period": 24, // 24 hours: 1 day
        "configured_limit": "15000", // 5,000 less than currently set limit
        "asset": "USD"
      }
     {
    ]
```

Then the monthly limit is **removed and will not be enforced**.

> 🚧
> 
> ### 
> 
> Please note that if a customer deposits an amount that exceeds a limit, zerohash will **not partially convert** and instead **fail** the fund conversion all together

Updated 3 months ago

---

Did this page help you?

Yes

No

Copy Page