# Source: https://docs.zerohash.com/docs/platform-account-faqs

## 

What are some common accounts that platforms use?

Accounts at zerohash are structured in the following way:

### 

Participant Code/Account Group/Account Label

These parts together represent an account. Each account has an asset that it can hold and has a type such as available, payable or receivable. See here for more information regarding accounts.

Platform code is the term used to describe the platform's participant code and 00SCXM is ZHLS’s participant code.

Below is a list of accounts are used frequently by platforms:

### 

Float account: 00SCXM/Platform Code/general

This is the account used to fund customer trades executed via ZHLS and is called the float account. A credit check occurs on this account when a customer executes a buy trade.

Your daily settlement (for net buy) wire into zerohash will top up this account in order to continue on with customer trading on a daily basis. Insufficient balance on this account would cause the customer trade execution failing with "insufficient balance" error on API calls. It is important to monitor this account’s balance.

- `Participant Code = 00SCXM`
- `Account Group = Platform Code`
- `Account Label = general`

### 

Platform Liquidity Account: Platform Code/00SCXM/general

This account is used when the platform executes their own trades via ZHLS and not on behalf of a customer.

- `Participant Code = Platform Code`
- `Account Group = 00SCXM`
- `Account Label = general`

### 

Primary account: Platform Code/Platform Code/general

This is your default account in ZH. When you have trading activity on your float account, an NDO will be created on the primary account. Once the trading period is finished, the initial settlement will happen. If the primary account is underfunded, then an NDO will be created. The reason the NDO is on the primary account and not the float is because there is an internal trade between the float account and the primary account for every customer trade. Once a settlement wire for the NDO is sent, it will be credited to the platform account and will be used to fund the active trades resulting in a settlement back to the float.

Your crypto deposits will be credited to this account and your platform withdrawal will also come out of this account as well.

- `Participant Code = Platform Code`
- `Account Group = Platform Code`
- `Account Label = general`

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page