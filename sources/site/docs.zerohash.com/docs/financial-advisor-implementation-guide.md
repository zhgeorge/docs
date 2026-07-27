# Source: https://docs.zerohash.com/docs/financial-advisor-implementation-guide

## 

What is a Financial Advisor on zerohash?

A **Financial Advisor** is an onboarded zerohash participant that has been explicitly authorized to act on another participant's customer account. Once linked, the advisor can place trades on the customer's behalf, while being blocked from moving money out of, or into, the customer's account.

Authorization is:

- **Explicit.** A platform registers an advisor against a specific customer account; the advisor cannot act on accounts they have not been linked to.
- **Scoped.** Advisors receive BUY and SELL permissions. Withdrawals and transfers can be added as additional authorizations.
- **Revocable.** A platform can revoke an advisor at any time. Revocation takes effect on the advisor's next action.
- **Auditable.** Every add and remove emits a notification event and is captured in the tax reporter snapshot.

## 

When should I register a Financial Advisor?

Register an advisor whenever a platform wants to let one participant act on the trading account of another. Common cases:

- A registered investment advisor (RIA) trading on behalf of their end clients.
- A model portfolio manager enrolling end customers into a Portfolio Strategy.
- An institutional desk executing on behalf of a customer's sub-account.
- A wealth platform offering an "advisor-managed" tier alongside self-directed accounts.

You do **not** need to register a Financial Advisor when the customer is self-directed, or when a participant only needs to view (not act on) another participant's data.

## 

Prerequisites

Before you can link a Financial Advisor to a customer account, confirm:

1. The advisor is an onboarded zerohash participant with its own `participant_code`
2. The end customer has an onboarded [MTA account](https://docs.zerohash.com/reference/customer-accounts-mta).
3. The advisor and the account's primary holder are different participants. A participant cannot advise themselves.
4. The advisor is not already a tenant on the same account. Tenant and advisor roles are mutually exclusive.

## 

Authorization model

Four grantable permissions exist on a customer account relationship. They are the full universe of permissions a Financial Advisor can hold.

### 

Grantable permissions

| Permission | Grants the participant the ability to | Enforced on |
| --- | --- | --- |
| `VIEW` | Read the customer account (details, balances, activity) | All read endpoints on the account |
| `BUY` | Submit buy orders against the account | CLOB and RFQ |
| `SELL` | Submit sell orders against the account | CLOB and RFQ |
| `WITHDRAW` | Move funds out of the account | `/withdrawals/*`, `/transfers`, `/convert_withdraw/rfq`, `/payments` |

### 

Default grant set for a Financial Advisor

| Permission | Granted to an FA on link? |
| --- | --- |
| `VIEW` | Yes |
| `BUY` | Yes |
| `SELL` | Yes |
| `WITHDRAW` | No |

## 

Collect the data you need in your UX

To register an advisor, capture:

- The advisor's `participant_code`.
- The customer account [ZRN](https://docs.zerohash.com/reference/customer-accounts-mta) the advisor will be linked to.
- A signed Financial Advisor agreement attesting to the advisory relationship. zerohash provides a template that platforms can pass through to the advisor or customer for signature.

Surface in your UI:

- The full list of advisors currently linked to a customer account.
- The date each advisor was added.
- A clear "revoke" action.

## 

Register an advisor

### 

At account creation

`POST /accounts` with the advisor included in `financial_advisors`.

**Request body**

JSON

```
{
  "participant_code": "CUST01",
  "region": "eu",
  "financial_advisors": ["ADVSR1"]
}
```

### 

On an existing account

`POST /accounts/{customer_account_zrn}/advisors` with the advisor's participant code.

**Request body**

JSON

```
{
  "participant_code": "ADVSR1"
}
```

The call is asynchronous. The advisor is not active until the async write settles. Either poll `GET /accounts/{zrn}/details` or listen for the `financial_advisor.added` notification before letting the advisor place their first order.

### 

Error responses

Handle these explicitly in your UI:

| Error | Cause |
| --- | --- |
| `customer account not found` | The ZRN does not match an MTA customer account |
| `participant not found` | The advisor's `participant_code` is not an onboarded participant |
| `participant already exists as tenant` | A participant cannot be both tenant and advisor on the same account |
| `duplicated financial advisors are not allowed` | The advisor is already linked |

## 

Verify the link

`GET /accounts/{customer_account_zrn}/details`

**Response — 200 OK**

JSON

```
{
  "participant_code": "CUST01",
  "financial_advisors": ["ADVSR1", "ADVSR2"]
}
```

## 

Place a trade as an advisor

The advisor's app uses the advisor's API credentials. The customer account ZRN is passed in the request body. zerohash validates the advisor is linked and authorized before accepting the order.

### 

RFQ

`POST /liquidity/rfq` authenticated with the advisor's API key. The customer account ZRN is passed in `account_group`.

**Request body**

JSON

```
{
  "account_group": "zrn:zh:eu:account:customer:7f1e...",
  "side": "buy",
  "underlying": "BTC",
  "quoted_currency": "USD",
  "quantity": "0.50"
}
```

The order is accepted only if `ADVSR1` is in the customer's `financial_advisors` list and the `BUY` permission is granted.

### 

CLOB / FIX

CLOB and FIX submissions follow the same enforcement rules. The advisor authenticates with their own credentials and references the customer account on the order. Unauthorized advisors are rejected at the order entry layer.

fix

```
8=FIX.4.4|...|49=ADVSR1|56=ZEROHASH|...|1=zrn:zh:eu:account:customer:7f1e...|54=1|55=BTC/USD|38=0.50|...
```

Revoking an advisor takes effect on the next order, with no need to tear down sessions.

## 

Use cases the offering supports

Linking advisors unlocks a range of platform offerings:

- **Advised trading.** RIAs place individual buys and sells on behalf of their end customers.
- **Portfolio Strategies enrollment.** A platform exposes one or more model portfolios. Customers opt in, and the advisor places the orders that align each customer's holdings with the chosen strategy.
- **Managed sell-down or rebalance.** Advisors execute coordinated sells across a book of linked customers without needing withdraw or transfer rights.
- **Institutional execution desks.** A broker desk acts as an advisor on its clients' accounts for execution only, with funding flows still controlled by the customer or platform.
- **Cross-tier offering.** Run self-directed and advised tiers side by side on the same platform without separate account constructs.

In every case the money movement boundary holds: an advisor can move markets on the customer's behalf, but cannot move money out of, or into, the account.

## 

Revoke an advisor

`DELETE /accounts/{customer_account_zrn}/advisors/{advisor_participant_code}`

**Response — 202 Accepted**

JSON

```
{}
```

The advisor's next order against this customer account will be rejected once the async write settles.

## 

Listen for advisor events

Subscribe to the customer account notification stream for:

- `financial_advisor.added`
- `financial_advisor.removed`

Use these for audit logging, UI refresh, and compliance recordkeeping. Each event includes the customer account ZRN, the advisor `participant_code`, and a timestamp.

## 

What you need to know about Financial Advisor Authorization

- **Authorization is per customer account, not global.** Linking an advisor to one customer does not authorize them on any other account.
- **Async semantics.** Register and revoke are 202 calls. Do not assume immediate consistency. Listen for the notification or re-read `GET /details`.
- **Funding stays with the customer or platform.** Advisors cannot deposit, withdraw, or transfer. If a platform needs the advisor to fund customer accounts, route that through a separate platform-level flow.
- **Tenant and advisor are mutually exclusive.** A participant that is already a tenant on an account cannot also be registered as an advisor on it.
- **The Financial Advisor agreement should travel with the link.** zerohash provides a template. Capture the signed agreement on your side and reference it on the advisor record where supported.
- **Audit and reporting are on by default.** Advisor attribution appears in tax reporter snapshots and in the advisor-attributed trade report.

## 

Glossary

**Advisor (Financial Advisor):** A zerohash participant that has been explicitly linked to another participant's customer account, granted BUY and SELL permissions only.

`participant_code`**:** A 1 to 6 character identifier for an onboarded zerohash participant. Matches `^[a-zA-Z0-9_-]+$`.

**Customer account ZRN:** The fully qualified zerohash resource name of an MTA customer account, in the form `zrn:zh:{region}:account:customer:{uuid}`.

**Tenant:** A participant with control of an account, including funding and withdrawal rights. Distinct from an advisor.

`BUY` **/** `SELL` **permissions:** The two permissions granted to a linked advisor by default. Together they authorize order submission on RFQ, CLOB, and FIX.

`WITHDRAW` **/** `DEPOSIT` **permissions:** Money movement permissions, not granted to advisors. Their absence is enforced on withdraw, deposit, transfer, payout, and convert-and-withdraw endpoints.

**Portfolio Strategy:** A model portfolio that customers can opt into. The advisor places the orders that align each enrolled customer's account with the chosen strategy.

**Advisor-attributed trade report:** A platform-facing report that surfaces, for a given period, every trade executed by a linked advisor on a customer's behalf.

Updated about 1 month ago

---

Did this page help you?

Yes

No

Copy Page