# Source: https://docs.zerohash.com/docs/ach-limits-and-velocity-controls

Platforms utilizing ACH processing are subject to various limits and velocity controls to help manage risk, reduce fraud, and ensure compliance with regulatory standards. These controls define the maximum and cumulative transaction thresholds applicable to users and the platform overall. Different limits may be assessed for Credit and Debit transactions if a platform is utilizing both.

Below is an overview of the potential ACH limits that may apply:

| Limit Type | Description |
| --- | --- |
| Maximum Transaction Size | The maximum dollar amount allowed per individual transaction. |
| Minimum transaction Size | The minimum dollar amount allowed per individual transaction. |
| $ Transactions Per Week (User) | The cumulative dollar amount of transactions permitted per user each week. |
| \# Transactions Per Week (User) | The number of transactions allowed per user each week. |
| Transactions In Flight | The maximum number of pending transactions a user can have at one time. |
| \# Linked Bank Accounts | The maximum number of active bank accounts a participant may link to their profile. |
| $ Transactions Per Week (Platform) | The cumulative dollar amount of transactions allowed for the entire platform weekly. |

If a transaction request is blocked by these limits or velocity controls, the transaction status will update to "rejected"

Here's the possible rejection reason

### 

$ Transaction Per Week

text

```
participant_credit_transactions(amount_current_week_by_participant_and_transfer_type)
participant_debit_transactions(amount_current_week_by_participant_and_transfer_type)
```

### 

\# Transactions Per Week (User)

```
participant_credit_transactions(transfers_current_week_by_participant_and_transfer_type)
participant_debit_transactions(transfers_current_week_by_participant_and_transfer_type)
```

### 

Transactions In Flight

```
participant_credit_transactions(in_flight_transfers_by_participant_and_transfer_type)
participant_debit_transactions(in_flight_transfers_by_participant_and_transfer_type)
```

### 

\# Linked Bank Accounts

```
max_account_number(accounts_count_by_participant)
```

### 

$ Transactions Per Week (Platform)

```
platform_limit_week_X(platform_credit_sum)
platform_limit_week_X(platform_debit_sum)
```

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page