# Source: https://docs.zerohash.com/docs/liquidity-models

Below is a brief overview of the three liquidity models supported by zerohash:

**Standard Model**: In this model, the platform is the counterparty to trade. Credit checks are performed against the platform's account. This model is suited to platforms who are trading on their own behalf using their own funds.

**Novated Model**: The platform does not act as a counterparty to trades in this model. The counterparty to the liquidity trade is typically an end user/retail customer of the platform. However, credit checks are performed against the platform's float account. The platform and zerohash will settle daily the net amount of customer trading activity to replenish the float balance.

**Direct Model**: The platform does not act as a counterparty to trades. Credit checks are performed against the end customer's account, and the customer must have pre-funded their account balance before trading.

| Model | Platform Counterparty<br>to Trade | Credit Check |
| --- | --- | --- |
| Standard (Default) | Yes | Platform's Reserve Account<br>\- \[PlatformCode\]/00SCXM/general |
| Novated | No | Platforms Float Account<br>\- 00SCXM/\[PlatformCode\]/general |
| Direct | No | End Customer Account<br>\- \[ParticipantCode\]/\[PlatformCode\]/general |

Updated 20 days ago

---

Did this page help you?

Yes

No

Copy Page