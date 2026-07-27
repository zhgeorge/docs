# Source: https://docs.zerohash.com/docs/how-are-network-fee-estimates-calculated

zerohash provides an [estimated network fee](https://docs.zerohash.com/reference/get_withdrawals-estimate-network-fee) endpoint that returns approximate withdrawal costs based on current blockchain conditions. Fee estimates are available in both PROD and CERT environments.

⚠️ **Test networks (CERT) can behave very differently from mainnet (PROD)**. Estimated fees and volatility often vary significantly because test tokens lack real monetary value, removing economic incentives for miners and validators to prioritize high fee transactions.

## 

How Estimates Work by Blockchain

### 

UTXO Chains (i.e. Bitcoin, Litecoin, Bitcoin Cash)

Network fee estimates for BTC are sourced from transactions on either the main or testnet mempool, depending on which environment is being used.

**Method**: Analyzes highest fee-per-byte transactions that would fill a 1MB block, returns the average

**Optimization**: Targets inclusion in the next 1-2 blocks

**Variables**: Transaction inputs/outputs, network demand

High network congestion increases returned fee estimates proportionally.

### 

Ethereum / ERC20 Tokens

Since the London hard fork (EIP-1559) and merge to Proof of Stake, Ethereum has standardized 12-second block times and more predictable fees through variable block sizes. However, fees still depend on:

- Network demand
- Computational complexity
- Storage requirements
- Destination address type (smart contracts require higher fees than standard addresses)

**Method**: Analyzes recent trailing blocks and applies a percentile calculation to optimize for price vs. inclusion speed.

### 

Solana

Solana's high throughput results in consistently low fees with minimal volatility.

**Method**: Queries Solana's native RPC endpoint for current fee rates.

### 

Other Supported Assets

Assets not specifically listed (Polygon, Avalanche, Arbitrum, etc.) follow the Ethereum model: recent block analysis with percentile optimization for price-speed balance.

### 

Assets without Estimates

A small number of supported assets (e.g., EGLD) do not yet return fee estimates. Integration for these assets is in progress.

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page