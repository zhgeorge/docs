# Source: https://docs.zerohash.com/docs/how-do-i-allocate-funds

## 

Allocating & Account Groups

Account groups are the combination of accounts designated for a specific purpose, for example trading with a specific platform. Within zerohash, participants can autonomously and easily allocate funds to specific account groups in real-time. Funds allocated to a specific platform would then become available for settling trades executed with that platform. Participants can also move funds to a special UNALLOCATED account group, to control what is made available to specific counterparties.

A participant can allocate funds across various account groups by navigating to **Allocations** page, available on the portal's sidebar. From there, you can move funds instantly.

## 

Allocation Example

A trade has been entered:

- **Party 1:** Zodiac Finance (N6ZGLA)
 - Buys 0.1 ETH for USD
 - Therefore, owes $10,000 to settle the trade
- **Party 2:** Solstice Capital (DZ2WOF)
 - Sells 0.1 ETH for USD
 - Therefore, owes 0.1 ETH to settle the trade
- zerohash attempts to settle, but Solstice Capital does not have 0.1 ETH allocated to Zodiac Finance Platform, and as a result, has a Net Delivery Obligation (NDO) of 0.01 ETH. To meet it, it needs to be allocated accordingly.
- As a result of the NDO, the state of the trade is obligations\_outstanding.
- Solstice Capital allocates 0.01 ETH to Zodiac Finance Platform so that the trade can settle.

![](https://files.readme.io/1e5d287-image.png)

- Now that the NDO is met, Solstice Capital has a sufficient available balance associated with the OTC Trading Platform for the trade to settle:
- zerohash processes the trade again and we find it fully settles, **assuming that Solstice Capital has also properly met its obligations.** The trade state has been updated.

![](https://files.readme.io/0136bc9-image.png)

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page