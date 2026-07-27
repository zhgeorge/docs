# Source: https://docs.zerohash.com/docs/settlements-as-a-service

Simplify and streamline your trade clearing processes with zerohash's comprehensive settlement solutions. Our platform offers seamless integration, robust infrastructure, and advanced tech to facilitate efficient settlement of digital asset trades.

## 

Use Cases

- **On-ramp:** First source liquidity outside of zerohash, then drop in trades for regulated settlement
- **OTC:** Settle large, negotiated off-exchange trades with institutional counterparties
- **Crypto-to-Crypto Swaps:** Settle crypto-to-crypto trades across a wide range of digital pairs with DVP finality

## 

Flow

1. Trades are executed on a supported platform
2. Trades are then delivered to zerohash over API, phone, instant message or any other means
3. Upon trade receipt, margin and settlement obligations are calculated by zerohash as Calculation Agent
4. zerohash, as a FinCEN-registered MSB and money transmitter, executes movements internally
5. zerohash then isolates digital asset movements, compresses them and delivers to the blockchain
6. All stakeholders involved can see their ownership of digital assets and on-chain

## 

Key Features

- **Regulatory umbrella:** zerohash is a registered Money Service Business and FX Dealer with FinCEN, and [money transmitter in all 50 states across the U.S.](https://docs.zerohash.com/docs/permitted-and-restricted-jurisdictions) This infrastructure can be leveraged by Platforms who want to avoid the regulatory investment and resulting overhead.
- **Reporting:** Platforms can query historical trade data via API or the Client Portal
- **Delivery versus Payment (DVP) Settlement**: Our settlement system will not settle trades until both side have fulfilled their trade obligations, eliminating counterparty risk
- **Full-service Onboarding:** Leverage zerohash's legal and compliance team to compliantly onboard trading counterparties

## 

Agency / Broker Exchange Model

The Agency / Broker Exchange Model is a trading framework where a platform operator (you) facilitates trades between counterparties without taking principal risk (i.e., you do not trade on your own balance sheet, but act as an intermediary or facilitator).

- **Calculation Agent:** Neutral third party to calculate obligations
- **Settlement Agent:** Entity effectuating the movement of fiat currency and digital assets
- **Platform:** An exchange, request-for-quote system, a brokerage network, a dealer platform or some combination thereof
- **Platform Operator:** You

![](https://files.readme.io/f55ee15e5cd24d4f5c9b609ea0587fda55c1e5c713af4bca14782df9a4901f75-image.png)

## 

Principal Dealer Model

In the Principal Dealer Model, the platform operator (you) acts as a counterparty to all trades, buying and selling digital assets as a principal.

- **Calculation Agent:** Neutral third party to calculate obligations
- **Settlement Agent:** Entity effectuating the movement of fiat currency and digital assets
- **Platform:** An exchange, request-for-quote system, a brokerage network, a dealer platform or some combination thereof
- **Platform Operator:** You

![](https://files.readme.io/a21b4d96387e836f21e3214a4a94acfa00314c31b320c5b7e5b1f48d3cae1ce1-image.png)

## 

API Reference

- [POST /trades](https://docs.zerohash.com/reference/post_trades)
- [GET /trades](https://docs.zerohash.com/reference/get_trades-trade-id)
- [GET /trades/:id](https://docs.zerohash.com/reference/get_trades-trade-id)
- [POST /deposits/digital\_asset\_addresses](https://docs.zerohash.com/reference/post_deposits-digital-asset-addresses)
- [GET /deposits/digital\_asset\_addresses](https://docs.zerohash.com/reference/get_deposits-digital-asset-addresses)
- [POST /withdrawals/requests](https://docs.zerohash.com/reference/post_withdrawals-requests)
- [GET /withdrawals/requests](https://docs.zerohash.com/reference/get_withdrawals-requests)
- [GET /withdrawals/requests/:id](https://docs.zerohash.com/reference/get_withdrawals-requests-id)

## 

Sample Code

Review our code recipe for more insight on trade submission to the [POST /trades](https://docs.zerohash.com/reference/post_trades) endpoint .

Post trade settlement

Open Recipe

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page