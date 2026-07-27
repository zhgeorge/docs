# Source: https://docs.zerohash.com/docs/account-setup-1

zerohash supports two core liquidity models. Each model defines the method in which USD will be ledgered for your platform.

## 

Account Setup

### 

Float Account Model

- Platforms manage customers USD balance on their ledger.
- Customers `buy` trades are pre-funded from a float account that is ledgered to the platform.
- Customers `sell` trades are credited to a float account that is ledgered to the platform.
- Platforms are expected to perform daily settlement via our payments rails, which replenishes the platform credit account.
 - An error is returned on on buy trades when the platform float has an insufficient balance.

### 

Customer Pre-funded Model

- Customers USD balances are tracked on the zerohash ledger.
- Customers `buy` trades are funded from the account that is ledgered to the customer.
- Customers `sell` trades are credited to the account that is ledgered to the customer.

| Model | Counterparty | Credit Check |
| --- | --- | --- |
| Float Account Model | ZHLS | Platform's Float Account<br>\- `00SCXM/[PlatformCode]/general` |
| Customer Pre-funded Model | ZHLS | End Customer Account<br>\- `[ParticipantCode]/[PlatformCode]/general` |

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page