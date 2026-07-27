# Source: https://docs.zerohash.com/docs/participant-account-statuses-locking

## 

Participant Status Definitions

| Status | Definition |
| --- | --- |
| submitted | Successfully submitted to `<POST /participants/customers/new>` and given a participant code, but has not yet been approved to transact. |
| pending\_approval | Participant code and relationships created, but the participant requires further review by the zerohash compliance team before moving to approved or rejected. Most often due to customer verification (KYC) alerts. |
| approved | Participant code and relationships created and the participant passes necessary approvals to transact. |
| rejected | Participant rejected from becoming an active user; most often due to customer verification (KYC) failures. |
| locked | Investigative state for the zerohash compliance team. |
| pending\_unlock | Investigations conclude the participant may remain active on zerohash. Only available from [Get participants](https://docs.zerohash.com/reference-link/get_participants), not via webhook. |
| pending\_disable | Investigations conclude the participant should be indefinitely banned from zerohash. |
| disabled | Indefinitely banned from zerohash, but balances may exist in the participant account. zerohash settlement team will divest existing balances. |
| divested | Indefinitely banned from zerohash and participant balances were moved back to the platform float. |
| closed | Indefinitely banned from zerohash and no balances remained at the time of ban |

## 

Example of the Standard Participant Status Flow:

![](https://files.readme.io/1f88978-image.png)

## 

Participant Reason Codes and Request Availability

| Reason Code | Definition | Request Availability |
| --- | --- | --- |
| compliance\_issue | locked | None |
| compliance\_issue | pending\_disable | None |
| compliance\_issue | disabled | None |
| compliance\_issue | closed | None |
| compliance\_issue | divested | None |
| user\_request | locked | Closing only (sell/withdraw) |
| user\_request | pending\_disable | Closing only (sell/withdraw) |
| user\_request | disabled | None |
| user\_request | closed | None |
| user\_request | divested | None |
| risk\_cleared | pending\_unlock | None - the cleared risk still needs to be approved |
| risk\_cleared | approved | All |

## 

Account Status Definitions

| Status | Definition |
| --- | --- |
| Open | Open for business |
| Closed | No further activity should occur |
| Locked | All trading activity is suspended |
| Divesting | Pending closure, only sells and withdrawals are allowed |
| Withdraw Lock | Withdrawals are not allowed |

## 

Account Status Diagram

![](https://files.readme.io/97fa2ff46c107a0ed292833dfa3b6a86c35e435b78e3ad331a1ca7bc96823889-image.png)

## 

Account Locking Resources

- Lock a Customer Account by using [POST /accounts/{urn}/lock](https://docs.zerohash.com/reference/post_accounts-urn-lock)
- Unlock a Customer Account by using [POST /accounts/{urn}/unlock](https://docs.zerohash.com/reference/post_accounts-urn-unlock)
- Withdraw Lock a Customer Account by using [POST /accounts/{urn}/withdraw\_lock](https://docs.zerohash.com/reference/post_accounts-urn-withdraw-lock)
- Withdraw Unlock a Customer Account by using [POST /accounts/{urn}/withdraw\_unlock](https://docs.zerohash.com/reference/post_accounts-urn-withdraw-unlock)
- Divest a Customer Account by using [POST /accounts/{urn}/divest](https://docs.zerohash.com/reference/post_accounts-urn-divest)
- Close a Customer Account by using [POST accounts/{urn}/close](https://docs.zerohash.com/reference/post_accounts-urn-close)

Updated 21 days ago

---

Did this page help you?

Yes

No

Copy Page