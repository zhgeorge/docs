# Source: https://docs.zerohash.com/docs/collateral-management

Zerohash’s margin infrastructure enables platforms to offer robust, real-time margining capabilities. Whether you're supporting lending products or perpetuals, Zerohash simplifies collateral handling and risk management at scale.

# 

Loan and Collateral Management

## 

Use Case: Offer Crypto-Backed Loans

Easily lock user collateral when issuing loans, and ensure those funds can’t be traded or withdrawn. Zerohash handles account segregation and real-time valuation, so you can manage loan risk automatically and keep your lending product secure and scalable.

# 

Real-Time Settlement of Perpetuals

## 

Use Case: Power Lightning-Fast Perp Trading

Deliver real-time settlement for perpetual contracts. With Zerohash, profits and losses are updated instantly at the margin level, giving your users a faster, smoother, and more transparent trading experience.

# 

Collateral Movements

To support collateral management activities, zerohash enables platforms to generate custom collateral account types. For example, loan collateral can be tied up by transferring participant available funds to a `loan_collateral` account type.

# 

Collateral Locking

Collateralized assets are restricted from trading or withdrawal. Zerohash enforces these constraints via real-time credit checks on all account operations (e.g., buy, sell, withdraw).

# 

Collateral Marking

zerohash provides real-time (latest tick) and historical (OHLCV) market data API endpoints in order to price collateral funds to trigger margin calls.

# 

BTC Collateral Example

![](https://files.readme.io/1ed69d191d97ba880243764c5ef6620085dd8f43d67f7b6aa5b9bbae0e9aeaec-image.png)

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page