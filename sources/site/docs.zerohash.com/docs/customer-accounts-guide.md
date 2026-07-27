# Source: https://docs.zerohash.com/docs/customer-accounts-guide

# 

Introduction

zerohash offers individual and joint accounts. This guide provides a comprehensive overview of the account types and tenant type definitions, and example flows.

# 

Account Identifiers

In order to facilitate the changes necessary to disambiguate the existing account identifiers from the concept of a customer centric account, zerohash will introduce a formal ZRN (zerohash URN) schema for the identifiers. The decision to use ZRN was driven by the need to provide no impact to existing integrations while providing an explicit method for platforms to specify the type of account being referenced via API.

`zrn:zh:<geo>:<domain>:<subdomain>:id`

### 

Where

- **geo**: global entity to which the identifier belongs \[us|eu|uk|ww|bz|au\]
- **domain**: the resource to which the identifier belongs \[accounts\]
- **subdomain**: the type of the identifier \[customer | ledger\]
- **id**: account identifier

The system will interpret an unqualified identifier as a `zrn:zh:us:accounts:id` to provide backwards compatibility for existing integrations.

Additionally endpoints requiring the identifier as part of the URL can accept the `subdomain:id` portion of the fully qualified ZRN for convenience. The platform will assume by interacting with the accounts domain endpoints that the provided IDs will belong to the accounts domain in the geo the api is being served.

> ℹ️
> 
> ### 
> 
> The accounts returned by GET /accounts which contain balance information are always ledger accounts.

# 

Account Types

zerohash supports various account types, each with specific tenant configurations and authorization models:

| Account Types | Definition |
| --- | --- |
| Individual | Account owned and controlled by one individual, who has full access to the account and its funds. |
| Uniform Transfers to Minors Act (UTMA) | Custodial accounts for minors, managed by a custodian until the minor reaches the age of majority |
| Trust | Managed by a trustee for the benefit of beneficiaries |
| Joint Tenants in Common (JTIC) | Multiple individuals with potentially unequal ownership; upon death, the deceased's share passes to their estate |
| Joint Tenants with Right of Survivorship (JTWROS) | Equal ownership among individuals; upon death, the deceased's share automatically transfers to surviving tenants |

Each account type has predefined tenant roles and authorization levels, ensuring compliance and proper access control.

# 

Tenant Types

Joint accounts have multiple tenants with associated authorizations, as described below:

| Tenant Types | Definition |
| --- | --- |
| Individual | A natural person who is granted authorizations to access the account |
| UTMA Beneficiary | The minor child for whom the custodial account is held under the Uniform Transfers to Minors Act. The beneficiary is the legal owner of the funds, but has no control over the account until reaching the age of majority (18 or 21) |
| UTMA Custodian | The legally authorized adult who manages a UTMA account on behalf of the minor beneficiary |
| Trustee | The person or institution legally responsible for managing the trust’s assets |
| Trust Beneficiary | The individual or entity entitled to receive distributions or benefits from the Trust |

# 

Tenant Designations

Each multiple tenant account must have one Primary Participant, and at least one Secondary Participant.

| Tenant Designations | Definition |
| --- | --- |
| Primary | The primary participant associated with the account creation |
| Secondary | The secondary participant(s) associated with the account |

# 

Tenant Authorizations

Tenant authorizations define the level of access and control over an account. These authorizations are assigned based on the account type and tenant configuration.

| Authorization | Permissions |
| --- | --- |
| Full Trading | The ability to withdrawal funds, trade, and access statements & receipts |
| Limited Trading | The ability to trade and access statements & receipts. Cannot withdrawal funds |
| View Only | The ability to access statements & receipts. Cannot withdrawal funds or trade |

# 

Authorization Matrix

The below matrix represents the default authorizations for each Account Type and Tenant Type. Tenant authorizations can be updated after account creation.

![](https://files.readme.io/4e238fbf98b4c2d8a813cc3f6b91198660677f45f377cc9cfcf6ce114a0a9013-image.png)

# 

Account Hierarchy

![](https://files.readme.io/7250c511da59fe3a30d2edf1f6db265eaf8f9b441eb15d95db8dccd5ed1fd915-image.png)

# 

Steps for Setting Up Multiple Tenant Accounts and Tenants

1. Create the primary and secondary participants using `POST /participants/customers/new`
2. Create an account using `POST /accounts`
 1. Assign the primary participant `participant_code`: the primary participant's participant code
 2. Set account type by`type`: the `AccountTypeEnum`
 3. Add the additional tenant(s) by `tenants`: the secondary participant(s)' participant codes

# 

Example: Create JTIC Account and Place a Buy Order via CLOB

## 

Create a JTIC Account

After both participants are created, use `POST /accounts` to create a JTIC account with both participants. The `participant_code` is the primary account holder. The `participant_code` associated with `tenant` is the second owner for this account, who will be able to place orders on behalf of the JTIC account.

**Sample Request:**

JSON

```
{
    "participant_code": "CUST01",
    "prefunded": false,
    "tier": "pro",
    "type": "jtic",
    "account_label": "my-label",
    "tenant": ["CUST02"]
}
```

**Sample Response:**

JSON

```
{
    "zrn": "zrn:zh:us:accounts:customer:c761fc96-5c44-40d4-8eb2-3fcd5d06754e",
    "participant_code": "CUST01",
    "prefunded": false,
    "tier": "pro",
    "type": "jtic",
    "account_label": "my-label",
    "tenant": ["CUST02"],
    "account_group": "PLAT01"
}
```

> ℹ️
> 
> ### 
> 
> The zrn should be stored for performing future operations on this particular customer account.

## 

Primary or Secondary User Places an Order via CLOB

For a JTIC account, both the primary and the secondary user associated with the JTIC account will have full trading authorization. Please refer to the [Central Limit Order Book](https://docs.zerohash.com/reference/central-limit-order-book) documentation for instructions on how to place an order via CLOB.

In the example payload below, the zrn for the JTIC account is included, and participant who placed the order is represented by the `trader` field. The trader field will be extracted from the FIX tag = 50 `SenderSubID`.

> ℹ️
> 
> ### 
> 
> Regardless of which participant placed the order (primary or secondary), the trade will be ledgered with the primary participant's ledger account. In the example below, CUST02 is the participant who is trading on behalf of the JTIC account and CUST01 will be referenced in the ledger, given CUST01 is the primary participant for this JTIC account.

**Sample Trade Payload**

JSON

```
{
  "message": {
    "batch_trade_id": null,
    "trade_id": "ab8603ef-5a66-4c4a-be05-c90e16b5d3ad",
    "client_trade_id": "d9561804-1bb5-4fc2-b195-992a2b8ff7a8",
    "trade_state": "terminated",
    "market_identifier_code": "SCXM",
    "trade_reporter_code": "PLAT00",
    "symbol": "BTC/USD",
    "trade_quantity": "0.00184456",
    "trade_price": "108426.9419265299041506",
    "trade_type": "regular",
    "physical_delivery": true,
    "comment": "",
    "last_update": 1751046915636,
    "transaction_timestamp": 1751046911000,
    "accepted_timestamp": 1751046911764,
    "defaulted_timestamp": null,
    "settled_timestamp": 1751046915603,
    "expiry_timestamp": null,
    "settlement_timestamp": null,
    "settlement_price_index_id": null,
    "contract_size": 1,
    "underlying": "BTC",
    "quoted_currency": "USD",
    "trade_reporter": "PLAT00",
    "platform_code": "PLAT00",
    "product_type": "spot",
    "parties_anonymous": false,
    "bank_fee": null,
    "reporting_party": "PLAT00",
    "settlement_schedule": null,
    "parties": [
      {
        "settling": true,
        "participant_code": "CUST01",
        "side": "buy",
        "asset": "BTC",
        "amount": "null",
        "liquidity_indicator": null,
        "execution_id": "",
        "order_id": "",
        "obligations_outstanding_timestamp": null,
        "current_obligations_met_timestamp": null,
        "settlement_state": "settled",
        "client_order_id": "",
        "collateral_percentage": null,
        "account_label": "general",
        "account_profile": null,
        "zrn": "zrn:zh:us:accounts:customer:c761fc96-5c44-40d4-8eb2-3fcd5d06754e",
        "trader": "CUST02"
      },
      {
        "settling": true,
        "participant_code": "PLAT01",
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
        "account_label": "general",
        "account_profile": null,
        "zrn": "zrn:zh:us:accounts:customer:d731ff96-5c44-41d4-8eb0-3dcd5d02764a",
        "trader": "PLAT01"
      }
    ],
    "session_id": "20250627175500",
    "fees": [],
    "issuer_fee_rate": "0",
    "issuer_fee_amount": "0",
    "issuer_fee_payor_type": null,
    "payment_processor": null,
    "network_fee_notional": null,
    "network_fee_quantity": null,
    "total_notional": "200.00",
    "asset_cost_notional": "200.00",
    "spread_notional": "2",
    "spread_bps": "100",
    "origin": "rest_api"
  }
}
```

# 

Get Account Balances Using the ZRN

To get all ledger accounts associated with the customer account, request `GET /accounts` endpoint, providing the ZRN query parameter.

**Example:**

`GET /accounts?zrn=zh:us:accounts:customer:c761fc96-5c44-40d4-8eb2-3fcd5d06754e`

JSON

```
{
  "message": [
    {
      "zrn": "zrn:zh:us:accounts:ledger:ce819fe8-b1d7-43bb-961c-e09ede0988d3",
      "asset": "USD",
      "account_owner": "ABCDEF",
      "account_type": "available",
      "account_group": "XYZ456",
      "account_label": "general",
      "balance": "1.00",
      "account_id": "ce819fe8-b1d7-43bb-961c-e09ede0988d3",
      "last_update": 1554395972174
    },
    {
      "zrn": "zrn:zh:us:accounts:ledger:ce819fe8-b1d7-43bb-961c-e09ede0988d4",
      "asset": "BTC",
      "account_owner": "ABCDEF",
      "account_type": "available",
      "account_group": "XYZ456",
      "account_label": "general",
      "balance": "0.00000001",
      "account_id": "ce819fe8-b1d7-43bb-961c-e09ede0988d4",
      "last_update": 1554395972174
    }
  ],
  "page": 1,
  "total_pages": 1
}
```

# 

Get Account Details Using the ZRN

To get customer account details, request `GET/accounts/{zrn}/details`

**Example:**

`GET /accounts/zh:us:accounts:customer:c761fc96-5c44-40d4-8eb2-3fcd5d06754e/details`

JSON

```
{
  "zrn": "zrn:zh:us:accounts:customer:c761fc96-5c44-40d4-8eb2-3fcd5d06754e",
  "participant_code": "CUST01",
  "prefunded": true,
  "account_label": "U12345678",
  "tier": "pro",
  "account_group": "GROUP1",
  "type": "jtic",
  "tenants": ["CUST02"]
}
```

# 

Adding a Financial Advisor to an Account

A Financial Advisor is not a tenant. Advisors are authorized third parties who can trade on behalf of the account holder but **cannot** deposit or withdraw. They receive **Limited** authorization automatically.

## 

Steps

1. Create the primary participant using `POST /participants/customers/new`
2. Create the advisor participant using `POST /participants/customers/new`
3. Create the account using `POST /accounts`
 - Assign the primary participant via `participant_code`: the primary participant's participant code
 - Set account type by `type`: the `AccountTypeEnum`
 - Add the advisor via `financial_advisors`: the advisor's participant code(s)

JSON

```
{
    "participant_code": "CUST01",
    "prefunded": false,
    "tier": "pro",
    "type": "individual",
    "account_label": "my-label",
    "financial_advisors": ["ADVSR01"]
}
```

> ℹ️
> 
> ### 
> 
> Adding or Removing Advisors After Account Creation
> 
> Advisors can also be added after account creation using `POST /accounts/{zrn}/advisors` and removed at any time using `DELETE /accounts/{zrn}/advisors/{participant_code}`.

**Add advisor request body:**

JSON

```
{
    "participant_code": "ADVSR01"
}
```

> ℹ️
> 
> ### 
> 
> Advisor Permissions
> 
> Financial Advisors are automatically assigned **Limited** authorization: they can execute trades and receive statements, but cannot initiate withdrawals. This cannot be changed to Full or View Only.

## 

Advisor Authorization Summary

| Authorization | Withdrawal | Trade | Statements & Receipts |
| --- | --- | --- | --- |
| **Limited** (Advisor default) | No | Yes | Yes |

### 

Key Constraints

- The advisor must be a fully onboarded participant with a valid `participant_code` before being linked to an account
- A participant cannot be both a tenant and a financial advisor on the same account (returns `409`)
- Financial advisors can be added to any account type: Individual, Business, JTIC, JTWROS, Trust, or UTMA
- Duplicate advisors on the same account are not allowed (returns `409`)
- Details on advisor authorization process here: [https://docs.zerohash.com/docs/financial-advisor-authorization](https://docs.zerohash.com/docs/financial-advisor-authorization)

Updated 3 months ago

---

Did this page help you?

Yes

No

Copy Page