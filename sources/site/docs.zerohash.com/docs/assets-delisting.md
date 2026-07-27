# Source: https://docs.zerohash.com/docs/assets-delisting

## 

Why?

There are two reasons why a token may be delisted from our platform:

1. The token is being delisted by the issuer.
2. The token is discontinued by zerohash.

Contact our team -via Slack channel or [support@zerohash.com-](mailto:support@zerohash.com-) if you have any questions regarding the reasons why a Token is being delisted.

## 

Process

In the event of an asset being delisted from our platform, a communication will be issued to you -via Slack channel or email. This communication includes the following information:

- Asset to be delisted.
- Dates affecting this process:
 - **Liquidation:** Date as of when the asset can no longer be bought within our platform.
 - **Sell and withdraw:** Period when the asset can still be sold or withdraw.
 - **Only withdraw:** Period when the asset can only be transferred out of zerohash, but not sold.
 - **Discontinuation:** Date as of when the asset is discontinued.

During `liquidation` phase, the participants can still liquidate this asset through the standard means provided (API or SDK). The participants can sell the asset or transfer it out.

At `discontinuation` date, zerohash performs a forced liquidation of the asset into USD balance in favor of the participants. If your platform is set up to handle participant balances through your float, the USD balances will be credited to your float.

> ❗️
> 
> ### 
> 
> zerohash will make every attempt to provide our platform clients with sufficient notice, at minimum forty-five (45) days, of our intention to delist the respective digital token so that they, in turn have sufficient time to notify their respective customers.

In the event of an emergency delisting, that notice period may be shortened. In that situation, zerohash will make every attempt to provide notice without delay to minimize customer impact.

### 

Communications to the participants

This is your responsibility as a platform.

Only in the event that a participant does inquiry directly to zerohash, we would respond back with a template response including the information described above.

## 

Traceability of the liquidations

If you need to trace these forced liquidations, they will be listed as trades in your platform. Use the `[GET /trades](https://docs.zerohash.com/reference/get_trades)` endpoint to list all these trades in favor of your participants.

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page