# Source: https://docs.zerohash.com/docs/ach-returns

When an ACH transaction is initiated but cannot be successfully processed, it results in an ACH return. Transactions can return for various reasons, ranging from insufficient funds when a customer account is debited to a customer calling their bank to dispute a payment they don’t recognize. There are 80+ Return Codes each with a different cause and path to resolve.

ACH returns can negatively impact a business through

- Financial Losses: this can be caused by fraud losses, lost transaction value from administrative returns, and bank/processor fees assessed for any returned payments
- Operational Disruption: Handling ACH returns requires administrative effort, communication with customers, and accounting adjustments
- Customer Experience: ACH returns can lead to customer dissatisfaction. When customers experience failed transactions, it can damage their perception of the business
- Compliance and Risk: Failure to manage return rates may result in non-compliance with partners and regulators. Excessive returns may trigger scrutiny from NACHA, payment processors, and financial institutions.

## 

Types of Returns

**Unauthorized ACH Returns**: Unauthorized ACH returns are initiated when a customer or account holder disputes an ACH transaction that they did not authorize or approve.

- These returns are typically used for cases of fraud, error, or when a transaction is not in compliance with the account holder's authorization.
- Generally, unauthorized ACH returns must be initiated within **60 days** from the settlement date of the original ACH entry.
 - All other return types are received within **2 business days** of the settlement date of the original ACH entry.
- Unauthorized Return Codes: R05, R07, R10, R29 and R51.
- **NACHA limit: 0.5%**

**Administrative ACH Returns**: Administrative ACH returns are initiated for various non-fraudulent reasons other than unauthorized transactions and are usually attributed to account data errors

- They are typically used for issues such as incorrect or invalid account numbers
- Return Codes: R02, R03 and R04
- **NACHA limit: 3%**

**Insufficient Funds (NSF) Returns**: As ACH payments are not immediately debited from a customer’s account when they are initiated, “NSF” returns are one of the most common reasons payments return. An NSF return occurs when a customer’s account balance is not enough to cover the requested payment at the time of the transaction.

- After an NSF return, the payment can be reattempted up to two times to attempt to try and debit a customer’s account
- To mitigate these returns, processors will often require customers to have a balance higher than the transaction amount in order to initiate a payment
- The payment risk is higher on days with longer settlement windows (e.g. weekends, holidays)
- NOTE: NSF Return Rates are not monitored independently, but these returns are often a key driver of higher Overall Return Rates.
 - The Overall Return Rate includes all return codes
 - **The NACHA limit is 15%**

**See [here](https://plaid.com/docs/errors/transfer/#ach-return-codes) for a list of all possible ACH return codes**

## 

How to Calculate Return Rates

### 

Unauthorized Return Rate (Limit: 0.5%)

Total # of ACH Debit Transactions where status updated to `returned` or `returned_settled` in last 60 Days and reason\_code is `R05`, `R07`, `R10`, `R29` or `R51`

_Divided By_

Total # of ACH Debit Transactions Created in the last 60 Days where status is not `canceled`, `failed`, `submitted` or `rejected`

### 

Administrative Return Rate (Limit: 3.0%)

Total # of ACH Debit Transactions where status updated to `returned` or `returned_settled` in last 60 Days and reason\_code is `R02`, `R03`, or `R04`

_Divided By_

Total # of ACH Debit Transactions Created in the last 60 Days where status is not `canceled`, `failed`, `submitted` or `rejected`

### 

Overall Return Rate (Limit: 15.0%)

Total # of ACH Debit Transactions where status updated to `returned` or `returned_settled` in last 60 Days

_Divided By_

Total # of ACH Debit Transactions Created in the last 60 Days where status is not `canceled`, `failed`, `submitted` or `rejected`

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page