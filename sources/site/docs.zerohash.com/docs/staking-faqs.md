# Source: https://docs.zerohash.com/docs/staking-faqs

## 

General

### 

Is staking available via an SDK?

No. Staking is currently available via API only. See the [main Staking page](https://docs.zerohash.com/docs/staking) for the full integration guide.

### 

Does zerohash offer liquid staking?

No. Staked positions are illiquid for the duration of the network's unstake period and cannot be represented by a transferable receipt token (e.g., stETH-style derivatives).

### 

Which assets can users stake?

Ethereum (ETH) is live. Solana (SOL) is targeted for Q3 2026. Discover stakeable assets programmatically via [GET /assets?staking\_enabled=true](https://docs.zerohash.com/reference/get_assets).

### 

Is staking available in every U.S. state?

No. We restrict staking in the following five states: CA, MD, NJ, and WA today. zerohash is actively working with regulators to enable staking in these states.

## 

Mechanics

### 

Are there minimum stake or unstake amounts?

No platform-imposed minimums. Users can stake or unstake any amount they hold in available or staked respectively.

### 

Are staking rewards guaranteed?

No. Rewards are paid out by the underlying network and depend on validator performance and prevailing network conditions, both of which fluctuate over time. The `apy_net` returned by zerohash is an estimate based on recent network performance, not a forward commitment. Platforms should set this expectation directly with their end users through their user agreements, since reward rates are variable and outside of zerohash's control.

### 

How long does activation and unstaking take?

Both are network-specific and depend on validator queues. Track activation with the `stake.broadcasted` → `stake.confirmed` → `stake.staked` webhook sequence, or poll [GET /stakes/{stake\\\_id}/status](https://docs.zerohash.com/reference/get_stakes-stake-id-status). Rewards continue to accrue throughout the unstake period until the terminal unstaked state.

### 

Are rewards auto-compounded?

Yes. Consensus rewards are credited to `staked` rather than `available` automatically. Users can manually unstake their rewards by submitting a new [POST /stakes/unstake](https://docs.zerohash.com/reference/post_stakes-unstake) request.

### 

What's the difference between available, collateral, and staked balances?

- `available` — usable for trade, transfer, withdraw, or new stake submissions.
- `collateral` — pending activation or pending unstake period. Not earning rewards, not usable.
- `staked` — actively staked and earning rewards.

Query each balance via [GET /accounts?account\_type={type}](https://docs.zerohash.com/reference/get_accounts-account-id).

## 

Platform Fees and Tax

### 

Who sets the staking fee?

Platforms set their own end-user fee. zerohash recommends a platform fee of 25–35% of gross rewards (users receive 65–75%), but the platform controls pricing. See the [Configurable Platform Fees](https://docs.zerohash.com/docs/staking#configurable-platform-fees) section for more details.

### 

Why does the APY I see differ from another platform's APY for the same asset?

The `apy_net` returned by [GET /assets/{asset}/staking\_info](https://docs.zerohash.com/reference/get_assets-asset-staking-info) is platform-specific and reflects your configured platform fee. Different platforms querying the same asset will see different `apy_net` values.

### 

Will users receive a 1099?

In most jurisdictions, staking rewards are taxable as ordinary income at fair market value on the date received. U.S. participants above the reporting threshold receive 1099s. zerohash generates these as part of the standard tax reporting included with the platform.

Updated about 2 months ago

---

Did this page help you?

Yes

No

Copy Page