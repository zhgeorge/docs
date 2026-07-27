# Source: https://docs.zerohash.com/changelog/staking-eth-support-now-live-via-api

[Back to All](https://docs.zerohash.com/changelog)

Added

## 

Release Details

**Release Date:** May 21, 2026

## 

Summary

zerohash has launched staking, starting with Ethereum. Platforms can now enable users to stake ETH end-to-end through the API, covering discovery, execution, monitoring, rewards, and unstaking. SOL is targeted for Q3 2026, with additional assets to follow.

Staking unlocks a new revenue stream and engagement surface for platforms. Users earn rewards on ETH they already hold, and platforms participate without standing up validator infrastructure or managing on-chain staking operations.

Please refer to the full Staking guide here: [https://docs.zerohash.com/docs/staking](https://docs.zerohash.com/docs/staking)

## 

What's new

- **New** `/stakes` **API surface** for submitting ([POST /stakes](https://docs.zerohash.com/reference/post_stakes)), canceling pre-broadcast [(POST /stakes/{stake\_id}/cancel](https://docs.zerohash.com/reference/post_stakes-stake-id-cancel)), monitoring ([GET /stakes/{stake\_id}/status](https://docs.zerohash.com/reference/get_stakes-stake-id-status)), and unstaking ([POST /stakes/unstake](https://docs.zerohash.com/reference/post_stakes-unstake))
- **Discovery endpoints**: [GET /assets?staking\_enabled=true](https://docs.zerohash.com/reference/get_assets) for stakeable assets, [GET /assets/{asset}/staking\_info](https://docs.zerohash.com/reference/get_assets-asset-staking-info) for estimated APY, activation time, and unstaking period
- **Portfolio and rewards**: [GET /stakes/{participant\_code}](https://docs.zerohash.com/reference/get_stakes-participant-code) for portfolio overview, [GET /stakes/{participant\_code}/rewards](https://docs.zerohash.com/reference/get_stakes-participant-code-rewards) for reward history
- **Three account types** to track lifecycle state, queryable via [GET /accounts?account\_type={type}: available](https://docs.zerohash.com/reference/get_accounts-account-id) (tradeable/withdrawable), `collateral` (pending activation or unstaking), `staked` (actively earning)
- **Real-time webhooks** across the full lifecycle: `stake.submitted` through stake.staked, the unstake counterparts, and `staking_reward.received` for reward distributions
- **One-time terms acceptance** per participant enables staking across all supported assets

## 

Lifecycle and Balance Flow

Stakes move Submitted → Broadcasted → Confirmed → Staked, with Canceled and Failed as terminal stake states.

Unstakes follow Submitted → Broadcasted → Confirmed → Unstaked, with Canceled and Failed as terminal unstake states.

Cancellation is only possible before broadcast.

Funds transition `available` → `collateral` → `staked` when activating, and `staked` → `collateral` → `available` when unstaking. Only `available` balances can be traded, transferred, or withdrawn.

The activation queue is worth flagging upfront in any user-facing flow. ETH stakes can take 1-4 weeks to start earning, and the unstaking period adds waiting time on the way out. Clear expectations at confirmation prevent most of the support volume platforms typically see on staking products.

## 

Prerequisites

KYC verification complete, staking permitted in the participant's jurisdiction, and staking terms accepted. All `/stakes` calls are blocked until terms are accepted.

Please note that at this time, staking is prohibited in the following states: CA, MD, NJ, WI, and WA.

## 

Implementation Notes

- Pair webhooks with polling on [GET /stakes/{stake\_id}/status](https://docs.zerohash.com/reference/get_stakes-stake-id-status); webhooks are the primary signal, polling covers delivery gaps
- Acknowledge webhooks with 200 OK, process asynchronously, and implement idempotency using `distribution_id` for reward events and `stake_id/unstake_id` + `status` for stake and unstake events
- Rewards accrue until an unstake reaches the terminal unstaked state
- Suppress staking UI entirely for participants in restricted jurisdictions
- Common validation errors: `TERMS_NOT_ACCEPTED`, `INSUFFICIENT_BALANCE`, `JURISDICTION_RESTRICTED`; each returns a `user_message` suitable for display

## 

Quick Reference

**Essential Endpoints:**

- Discover stakeable assets: [GET /assets?staking\_enabled=true](https://docs.zerohash.com/reference/get_assets)
- Validate available balance: [GET /accounts?account\_type=available](https://docs.zerohash.com/reference/get_accounts-account-id)
- Check staking parameters: [GET /assets/{asset}/staking\_info](https://docs.zerohash.com/reference/get_assets-asset-staking-info)
- Verify terms acceptance: [GET /participant/{participant\_code}](https://docs.zerohash.com/reference/get_participant-participant-code-full-info)
- Update terms acceptance: [PATCH /participants/customers/{participant\_code}](https://docs.zerohash.com/changelog/staking-eth-support-now-live-via-api)
- Submit stake: [POST /stakes](https://docs.zerohash.com/reference/post_stakes)
- Cancel pending stake: [POST /stakes/{stake\_id}/cancel](https://docs.zerohash.com/reference/post_stakes-stake-id-cancel)
- Monitor stake status: [GET /stakes/{stake\_id}/status](https://docs.zerohash.com/reference/get_stakes-stake-id-status)
- View portfolio: [GET /stakes/{participant\_code}](https://docs.zerohash.com/reference/get_stakes-participant-code)
- Track rewards: [GET /stakes/{participant\_code}/rewards](https://docs.zerohash.com/reference/get_stakes-participant-code-rewards)
- Submit unstake: [POST /stakes/unstake](https://docs.zerohash.com/reference/post_stakes-unstake)
- Cancel pending unstake: [POST /stakes/unstake/{unstake\_id}/cancel](https://docs.zerohash.com/reference/post_stakes-unstake-unstake-id-cancel)
- Monitor unstake status: [GET /stakes/unstake/{unstake\_id}/status](https://docs.zerohash.com/reference/get_stakes-unstake-unstake-id-status)

## 

Support and Resources

Please contact your dedicated Relationship Manager for:

- Frontend standards and implementation requirements
- Sample UX designs and the UX research report
- Setting your platform fee
- User education materials and user-facing FAQs
- Any additional integration support