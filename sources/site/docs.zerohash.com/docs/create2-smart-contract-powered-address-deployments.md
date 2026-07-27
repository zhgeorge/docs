# Source: https://docs.zerohash.com/docs/create2-smart-contract-powered-address-deployments

## 

General

[CREATE2](https://ethereum-blockchain-developer.com/110-upgrade-smart-contracts/12-metamorphosis-create2/) is an Ethereum opcode for creating smart contracts that was introduced as part of Ethereum Improvement Proposal (EIP) 1014 and implemented during the Constantinople upgrade (February 2019). It's been leveraged by zerohash to do one simple thing: minimize costs, increasing the profitability of both zerohash and its Platform partners.

Specifically, CREATE2 ensures that neither the End Customer, zerohash, nor the Platform (depending on your setup) will be charged a network fee until we're sure that a deposit is coming. This can significantly increase product margins, completely eliminating unnecessary costs.

> 📘
> 
> ### 
> 
> See release notes [here](https://docs.zerohash.com/changelog/create2-smart-contract-powered-address-deployments). Platforms do not need to take any action to implement CREATE2, as it is the default standard for all deposit addresses out-of-the-box

![](https://files.readme.io/f9533af0ebd7079ca8569ac4bb44eb83bfd6ffc2fa3cf30d312ec2b57cb4234b-a_12312321222.png)

## 

Impacted Networks

CREATE2 is currently supported across the following networks:

- Arbitrum
- Avalanche
- Base
- Ethereum
- Optimism
- Polygon

## 

Applicable zerohash Products

### 

Buy/Sell, Stablecoin Tokenization Payment Rails and Crypto/Stablecoins On and Off Ramps

With the above products, Platforms will use the [POST /deposits/digital\_asset\_addresses](https://docs.zerohash.com/reference/post_deposits-digital-asset-addresses) endpoint to generate deposit addresses. The returned `address` will represent the CREATE2 smart contract address.

### 

Client Portal

On the Client Portal, Platforms can generate deposit addresses for their own use. Each returned deposit address will similarly represent the CREATE2 smart contract address.

### 

Fund

CREATE2 has been added to both the [Fund API](https://docs.zerohash.com/docs/fund-integration-guide-api) and the [Fund SDK](https://docs.zerohash.com/docs/fund-integration-guide-sdk).

- Fund API: The [POST /fund/rfq](https://docs.zerohash.com/reference/post_fund-rfq) response, containing the `deposit_address` value, will represent the CREATE2 smart contract address.
- Fund: The displayed address on the Transaction Pending screen will represent the CREATE2 smart contract address.

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page