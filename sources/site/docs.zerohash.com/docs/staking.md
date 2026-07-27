# Source: https://docs.zerohash.com/docs/staking

# 

Introduction

zerohash offers comprehensive staking API services that allow platforms to enable native crypto staking for their users. This guide provides best practices for integration, explains the staking lifecycle, and offers guidance on building a seamless user experience.

![](https://files.readme.io/6ddc7aabf84c0efd670aab7710a02da110fad5128315b28022b362d0244c5229-Staking_SDK.png)

The designs referenced in this documentation represent a conceptual UX framework. For access to the complete design specifications and additional technical resources, please contact your zerohash representative.

Staking is currently available via API only — there is no SDK integration path at this time. zerohash also does not offer liquid staking; staked positions are illiquid for the duration of the network's unstake period and cannot be represented by a transferable receipt token.

# 

Prerequisites

Before enabling staking functionality, ensure your integration supports these requirements:

1. **KYC verification**: End users must be fully KYC-approved zerohash participants. Staking is not available to participants in `pending` or `restricted` status.
2. **Jurisdiction eligibility**: The participant's resident jurisdiction must be on the staking-permitted list. At this time, staking is **prohibited** in the following five states: CA, MD, NJ, and WA.
3. **Terms acceptance**: Each participant must have an active `signed_agreement` of `type: "staking"` on file. A single acceptance enables staking across all supported assets for that participant.
4. **Webhook endpoint:** A configured, signature-verified webhook endpoint to receive staking lifecycle events (see _Webhooks_ section below).
5. **Account funded:** The participant must hold a sufficient `available` balance of the asset being staked.

# 

Core Concepts

## 

Definitions

| Term | Definition |
| --- | --- |
| Activation Queue | New validators must wait in a network-defined queue before becoming active. Queue length affects how long it takes for newly staked funds to start earning rewards. |
| Activation Time | The delay between submitting a stake transaction and the stake becoming active. Includes blockchain confirmation plus any network-specific activation queue. |
| Est. APY (Net) | Annualized percentage yield, expressed net of your Platform fee charged. _This is always an estimate_ - actual rewards vary with network conditions and validator performance. |
| Unstake Period | The mandatory waiting period between initiating an unstake and the funds returning to the `available` account. Unstake periods are network-specific. Users will **_continue to earn rewards_** during this period until the unstaking period is complete. |
| Validator | The node that produces blocks and attests to network state in exchange for rewards. zerohash manages this infrastructure on behalf of platforms. |
| Consensus Rewards | The base protocol-level rewards paid to validators for attestation and block proposal. |
| MEV Rewards | Additional rewards from Maximal Extractable Value capture (priority fees, block ordering). Reported separately from consensus rewards. |

## 

Supported Assets

Currently supported cryptocurrencies with staking:

- ETH (Ethereum)

- SOL (Solana) - _Q3 2026_

 Additional assets: _Coming soon!_

## 

Configurable Platform Fees

Staking yield is reported net of the platform fee you choose to set. The advertised APY in [GET /assets/{asset}/staking\_info](https://docs.zerohash.com/reference/get_assets-asset-staking-info) already reflects this deduction.

Staking on zerohash uses a fee model based on gross network rewards. Platforms set their own end-user pricing.

**How the model works**

1. **Gross rewards** are paid by the network to the staking position.
2. Your platform applies a **platform fee** — a percentage deducted from gross rewards before the remainder is credited to the user. zerohash recommends a platform fee of 25–35% (i.e. users receive 65–75% of gross rewards), but platforms control their own pricing and can configure higher or lower.
3. The user's net reward equals gross rewards minus the platform fee.
4. The platform earns revenue from the platform fee, net of zerohash's processing fee. Specific commercial terms are set in your zerohash agreement — contact your Relationship Manager for more details on this.

| Component | Ex. Amount | % of gross rewards |
| --- | --- | --- |
| Gross rewards | $100 | 100% |
| User reward (pass-through) | $70 | 70% |
| Platform fee | $30 | 30% |

ℹ️ **Note on** `apy_net`: The APY returned by [GET /assets/{asset}{asset}/staking\_info](https://docs.zerohash.com/reference/get_assets-asset-staking-info) is platform-specific and reflects your configured platform fee. Different platforms querying the same asset will see different `apy_net` values.

---

# 

Staking Lifecycle and State Machine

The staking process follows a clear journey from discovery to unstaking. We recommend using both API polling and webhook notifications to track a stake's status throughout this flow.

### 

Stake States

1. `submitted` — Request accepted; queued for blockchain broadcast.
2. `broadcasted` — Transaction signed and sent to the network.
3. `confirmed` — Stake entered the consensus activation queue. (Note: on-chain broadcast acknowledgement is signaled by `broadcasted`.)
4. `staked` — Terminal active state; position is earning rewards.
5. `canceled` — Terminal; user canceled before broadcast.
6. `failed` — Terminal; transaction rejected. Requires resubmission.

### 

Unstake States

1. `submitted` — Unstake request accepted; queued for blockchain broadcast.
2. `broadcasted` — Unstake transaction sent to network.
3. `confirmed` — Unstake entered the exit queue (cooling-down); unstaking waiting period underway.
4. `unstaked` — Terminal; funds returned to the available account.
5. `canceled` — Terminal; user canceled before broadcast.
6. `failed` — Terminal; unstake transaction rejected. Requires resubmission.

![](https://files.readme.io/26d3d2c1322c729c45e5e20ad246aff318d7121762de57e2d3045080d39fa074-Enterprise_Journeys_-_State_Machine_3.png)

---

# 

User Flow

## 

1\. Discovery and Initiation

Help users discover which assets they can stake and understand the terms.

- Use [GET /assets?staking\_enabled=true](https://docs.zerohash.com/reference/get_assets) to retrieve only stakeable assets
- Display staking information using [GET /assets/{asset}/staking\_info](https://docs.zerohash.com/reference/get_assets-asset-staking-info)
 - ⚠️ Please note all the staking information provided at `GET /assets` are estimates and subject to change with network conditions.
- Show available balances via [GET /accounts?account\_type=available](https://docs.zerohash.com/reference/get_accounts)

> 🎨
> 
> ### 
> 
> UX Best Practices
> 
> - Make the unstaking period impossible to miss - confusion on this can lead to high volumes of support issues
> - Highlight that APY estimates may fluctuate based on network conditions
> - Consider showing a simple ROI calculator for different stake amounts
> - For restricted jurisdictions, suppress all staking UI entirely

## 

2\. Eligibility and Compliance

Before allowing stake submission, confirm the user has accepted terms and has sufficient balance.

- Check terms acceptance status via [GET /participant/{participant\_code}/full\_info](https://docs.zerohash.com/reference/get_participant-participant-code-full-info)
 - Check for the `"signed_agreements"` array element with `"type" : "staking"`
- If terms not accepted, prompt user and update via [PATCH /participants/customers/{participant\_code}](https://docs.zerohash.com/reference/patch_participants-customers-participant-code)
- Validate balance using [GET /accounts?account\_type=available](https://docs.zerohash.com/reference/get_accounts-account-id) before showing stake confirmation screen
- Store terms acceptance status locally to minimize API calls

⚠️ **Important**: All staking operations are blocked until terms are accepted. Single acceptance enables staking for ALL supported assets.

> 🎨
> 
> ### 
> 
> UX Best Practices
> 
> - Present terms acceptance as a one-time action that enables staking for all assets
> - Explain this is required for regulatory compliance
> - For users in restricted jurisdictions, do not surface any staking UX

## 

3\. Staking Execution

Once the user confirms their stake details, submit the request and begin tracking.

- User confirms staking transaction details (amount, estimated reward APY, estimated unstaking period)
- Submit stakes using [POST /stakes](https://docs.zerohash.com/reference/post_stakes)
- System validates request and returns stake ID for tracking - store the returned `stake_id` - you'll need it for future operations
- Listen for `stake.submitted` webhook
- Stake requests can be canceled before they have been broadcasted via [POST /stakes/{stake\_id}/cancel](https://docs.zerohash.com/reference/post_stakes)

⚠️ **Important**: Once broadcasted to the blockchain, cancellation is not possible. Users must wait for activation to complete, then unstake.

> 🎨
> 
> ### 
> 
> UX Best Practices
> 
> - Show a clear confirmation screen with all terms before submission
> - Provide immediate visual feedback that submission succeeded
> - Make the cancel option obvious while it's still available and hide when unavailable

## 

4\. Activation and Monitoring

Track stake progress as it moves from submission to actively earning rewards.

- Stakes move through several states, and real-time statuses will be provided via webhooks:
 - `stake.submitted` → Request accepted, queued for processing
 - `stake.canceled`→ User canceled a stake request before it was broadcasted
 - `stake.broadcasted` → Transaction sent to blockchain
 - `stake.confirmed` → Transaction confirmed on-chain
 - `stake.staked` → Actively earning rewards
 - `stake.failed` → Stake request failed and must be requested again
- Monitor stake status via [GET /stakes/{stake\_id}/status](https://docs.zerohash.com/reference/get_stakes-stake-id-status)

> 🎨
> 
> ### 
> 
> UX Best Practices
> 
> - Show progress indicators during activation period
> - Explain that activation time varies by network conditions (1-4 weeks typical for ETH)
> - Notify users when their stake becomes active and starts earning
> - For failed stakes, clearly explain that the user needs to resubmit

## 

5\. Ongoing Management

Once active, rewards accrue daily and are automatically distributed to the user's balance.

- Subscribe to `staking_reward.received` webhooks for real-time reward notifications
- Use [GET /stakes/{participant\_code}](https://docs.zerohash.com/reference/get_stakes-participant-code) for portfolio overview
- Use [GET /stakes/{participant\_code}/rewards](https://docs.zerohash.com/reference/get_stakes-participant-code-rewards) for detailed reward history
- Refresh portfolio data periodically (e.g., every 5 minutes when user is viewing)

> 🎨
> 
> ### 
> 
> UX Best Practices
> 
> - Display total staked value, total rewards earned, and current estimated APY
> - Include rewards as distinct line items in transaction history sections
> - Allow users to view individual stakes or consolidated portfolio view

## 

6\. Unstaking

When users want to access their staked funds, guide them through the unstaking process and waiting period.

- Check staked balances via [GET /accounts?account\_type=staked](https://docs.zerohash.com/reference/get_accounts)
- Submit unstake requests using [POST /stakes/unstake](https://docs.zerohash.com/reference/post_stakes-unstake)
- Store unstake\_id for tracking and support purposes
- Unstakes move through several states, and real-time statuses will be provided via webhooks:
 - `unstake.submitted` → Request accepted, queued for processing
 - `unstake.canceled`→ User canceled an unstake request before it was broadcasted
 - `unstake.broadcasted` → Transaction sent to blockchain
 - `unstake.confirmed` → Transaction confirmed on-chain
 - `unstake.unstaked` → No longer staked, balance available to transact/trade
 - `unstake.failed` → Unstake request failed and must be requested again

> 🎨
> 
> ### 
> 
> UX Best Practices
> 
> - Show unstaking period prominently before user commits
> - Explain that rewards continue to accrue until unstake reaches terminal unstaked state
> - Notify users when funds become available to trade or transact

---

# 

Account Types and Ledger Balances

zerohash uses three distinct account types to track staking lifecycle states. Understanding how balances move between these accounts is essential for accurate balance reporting and transaction handling.

## 

Account Type Definitions

| `account_type` | Description | Use Cases |
| --- | --- | --- |
| `available` | Funds that can be used to transact, trade, or stake | Buying, selling, transferring, withdrawing, or initiating new stakes |
| `collateral` | Funds pending activation or pending unstaking period | Monitoring stakes during activation queue or unstaking waiting period |
| `staked` | Funds actively staked and earning rewards | Tracking active staking positions and accrued rewards |

## 

Balance Flow Rules

**During Staking:**

1. Funds move from `available` → `collateral` when a stake is submitted
2. Funds move from `collateral` → `staked` when the stake is confirmed and actively earning rewards

**During Unstaking:**

1. Funds move from `staked` → `collateral` when an unstake is submitted
2. Funds move from `collateral` → `available` when the unstaking period completes

## 

Important Constraints

**⚠️ Critical Balance Rules:**

- Balances in `collateral` `account_type` must reach the staked state before they can be unstaked
- Balances in `staked` `account_type` must be unstaked before participants can withdraw or sell those assets
- Only balances in the `available` `account_type` can be used for trading, transfers, or withdrawals

💡 **Implementation Tip:** Use [GET /accounts?account\_type={type}](https://docs.zerohash.com/reference/get_accounts-account-id) to query specific account types when displaying balances to users. Show all three account types in staking portfolio views to provide complete transparency.

## 

Stake and Unstake Minimums

No minimums. Users can stake or unstake any amount they hold in available or staked respectively.

---

# 

Webhooks

## 

Webhook Event Configuration

Set up webhook endpoints to receive real-time notifications for staking events. Configure your webhook URL and specify which events to receive.

JSON

```
{
  "webhook_url": "https://yourapi.com/webhooks/staking",
  "events": [
    "stake.submitted",
    "stake.canceled",
    "stake.broadcasted",
    "stake.confirmed",
    "stake.staked",
    "stake.failed",
    "staking_reward.received",
    "unstake.submitted",
    "unstake.canceled",
    "unstake.broadcasted",
    "unstake.confirmed",
    "unstake.unstaked",
    "unstake.failed"
  ]
}
```

## 

Webhook Event Reference

### 

`stake.submitted`

Sent immediately after stake request is accepted and queued for processing.

JSON

```
{
  "event_type": "stake.submitted",
  "timestamp": "2026-05-21T16:00:00.123Z",
  "occurred_at": "2026-05-21T16:00:00.123Z",
  "participant_code": "CUST01",
  "account_label": "general",
  "stake_id": "c761fc96-5c44-40d4-8eb2-3fcd5d06754e",
  "asset": "ETH",
  "amount": "10.5",
  "status": "submitted"
}
```

### 

`stake.canceled`

Sent immediately after stake request is canceled.

JSON

```
{
  "event_type": "stake.canceled",
  "timestamp": "2026-05-21T16:02:00.123Z",
  "occurred_at": "2026-05-21T16:02:00.123Z",
  "participant_code": "CUST01",
  "account_label": "general",
  "stake_id": "c761fc96-5c44-40d4-8eb2-3fcd5d06754e",
  "asset": "ETH",
  "amount": "10.5",
  "status": "canceled",
  "reason": "user_initiated"
}
```

### 

`stake.broadcasted`

Sent when the stake transaction is signed and broadcast to the network.

JSON

```
{
  "event_type": "stake.broadcasted",
  "timestamp": "2026-05-21T16:05:00.123Z",
  "occurred_at": "2026-05-21T16:05:00.123Z",
  "participant_code": "CUST01",
  "account_label": "general",
  "stake_id": "c761fc96-5c44-40d4-8eb2-3fcd5d06754e",
  "asset": "ETH",
  "amount": "10.5",
  "status": "broadcasted"
}
```

### 

`stake.confirmed`

Sent when the stake enters the consensus activation queue and pool allocation begins. On-chain broadcast confirmation is `stake.broadcasted`.

JSON

```
{
  "event_type": "stake.confirmed",
  "timestamp": "2026-05-21T16:15:00.123Z",
  "occurred_at": "2026-05-21T16:15:00.123Z",
  "participant_code": "CUST01",
  "account_label": "general",
  "stake_id": "c761fc96-5c44-40d4-8eb2-3fcd5d06754e",
  "asset": "ETH",
  "amount": "10.5",
  "status": "confirmed",
  "tx_hash": "0xabc..."
}
```

### 

`stake.staked`

Sent when the stake completes activation and begins earning rewards.

JSON

```
{
  "event_type": "stake.staked",
  "timestamp": "2026-05-28T12:00:00.123Z",
  "occurred_at": "2026-05-28T12:00:00.123Z",
  "participant_code": "CUST01",
  "account_label": "general",
  "stake_id": "c761fc96-5c44-40d4-8eb2-3fcd5d06754e",
  "asset": "ETH",
  "amount": "10.5",
  "status": "staked",
  "tx_hash": "0xabc..."
}
```

### 

`stake.failed`

Sent when the stake request fails. Includes a `reason` field for diagnostics.

JSON

```
{
  "event_type": "stake.failed",
  "timestamp": "2026-05-21T16:10:00.123Z",
  "occurred_at": "2026-05-21T16:10:00.123Z",
  "participant_code": "CUST01",
  "account_label": "general",
  "stake_id": "c761fc96-5c44-40d4-8eb2-3fcd5d06754e",
  "asset": "ETH",
  "amount": "10.5",
  "status": "failed",
  "reason": "pool_capacity_exceeded"
}
```

### 

`staking_reward.received`

Sent when staking rewards are distributed and credited to the participant's account.

JSON

```
{
  "event_type": "staking_reward.received",
  "timestamp": "2026-05-22T12:00:00.123Z",
  "credited_at": "2026-05-22T12:00:00.123Z",
  "participant_code": "CUST01",
  "account_label": "general",
  "distribution_id": "dist_abc123",
  "asset": "ETH",
  "status": "credited",
  "reward_amount": "0.025",
  "cumulative_rewards_amount": "0.125"
}
```

### 

`unstake.submitted`

JSON

```
{
  "event_type": "unstake.submitted",
  "timestamp": "2026-05-30T10:00:00.123Z",
  "occurred_at": "2026-05-30T10:00:00.123Z",
  "participant_code": "CUST01",
  "account_label": "general",
  "unstake_id": "c761fc96-5c44-40d4-8eb2-3fcd5d06757d",
  "asset": "ETH",
  "amount": "10.5",
  "status": "submitted"
}
```

### 

`unstake.canceled`

JSON

```
{
  "event_type": "unstake.canceled",
  "timestamp": "2026-05-30T10:01:00.123Z",
  "occurred_at": "2026-05-30T10:01:00.123Z",
  "participant_code": "CUST01",
  "account_label": "general",
  "unstake_id": "c761fc96-5c44-40d4-8eb2-3fcd5d06757d",
  "asset": "ETH",
  "amount": "10.5",
  "status": "canceled",
  "reason": "user_initiated"
}
```

### 

`unstake.broadcasted`

JSON

```
{
  "event_type": "unstake.broadcasted",
  "timestamp": "2026-05-30T10:05:00.123Z",
  "occurred_at": "2026-05-30T10:05:00.123Z",
  "participant_code": "CUST01",
  "account_label": "general",
  "unstake_id": "c761fc96-5c44-40d4-8eb2-3fcd5d06757d",
  "asset": "ETH",
  "amount": "10.5",
  "status": "broadcasted"
}
```

### 

`unstake.confirmed`

Sent when the unstake enters the exit queue (cooling-down).

JSON

```
{
  "event_type": "unstake.confirmed",
  "timestamp": "2026-05-30T10:15:00.123Z",
  "occurred_at": "2026-05-30T10:15:00.123Z",
  "participant_code": "CUST01",
  "account_label": "general",
  "unstake_id": "c761fc96-5c44-40d4-8eb2-3fcd5d06757d",
  "asset": "ETH",
  "amount": "10.5",
  "status": "confirmed",
  "tx_hash": "0xdef..."
}
```

### 

`unstake.unstaked`

Sent when unstake period completes and funds are returned to the available account.

JSON

```
{
  "event_type": "unstake.unstaked",
  "timestamp": "2026-06-03T08:00:00.123Z",
  "occurred_at": "2026-06-03T08:00:00.123Z",
  "participant_code": "CUST01",
  "account_label": "general",
  "unstake_id": "c761fc96-5c44-40d4-8eb2-3fcd5d06757d",
  "asset": "ETH",
  "amount": "10.5",
  "status": "unstaked"
}
```

### 

`unstake.failed`

Sent when unstake period completes and funds are returned to the available account.

JSON

```
{
  "event_type": "unstake.failed",
  "timestamp": "2026-05-30T10:10:00.123Z",
  "occurred_at": "2026-05-30T10:10:00.123Z",
  "participant_code": "CUST01",
  "account_label": "general",
  "unstake_id": "c761fc96-5c44-40d4-8eb2-3fcd5d06757d",
  "asset": "ETH",
  "amount": "10.5",
  "status": "failed",
  "reason": "exit_queue_full"
}
```

**Implementation Best Practices**

- **Acknowledge immediately**: Always return `200 OK` to acknowledge webhook receipt
- **Process asynchronously**: Handle webhook processing outside the request/response cycle to avoid timeouts
- **Store payloads**: Maintain webhook event logs for debugging and audit trails
- **Handle duplicates**: Implement idempotency. For reward events, use `distribution_id`. For stake and unstake events, use `stake_id/unstake_id` combined with `status`.
- **Fallback strategy**: Implement polling as a backup if webhook delivery fails
- **Verify authenticity**: Validate webhook signatures to ensure requests come from zerohash
- **Monitor failures**: Track webhook delivery failures and alert on persistent issues

---

# 

Error Handling

Common validation errors and recommended handling:

- Terms not accepted: Redirect user to T&C acceptance flow.
- Insufficient balance: Display current balance.
- Jurisdiction restrictions: Display appropriate messaging about availability.
- Asset not supported: Filter out non-stakeable assets in UI.
- Pool capacity exceeded: Inform user and prompt retry.
- Terms revoked mid-flight: Block submission and prompt re-acceptance.

## 

Error Response Format

All error responses follow this structure:

JSON

```
{
  "error_code": "ERROR_IDENTIFIER",
  "message": "Technical error description",
  "details": {
    "participant_code": "CUST01",
    "stake_id": "c761fc96-5c44-40d4-8eb2-3fcd5d06754e",
    "asset": "ETH",
    "validation_checks": {
      "jurisdiction_allowed": true,
      "terms_accepted": false,
      "platform_restrictions": "none",
      "sufficient_balance": true
    }
  },
  "user_message": "",
  "request_id": "req_123456789",
  "timestamp": "2026-05-21T16:00:00Z"
}
```

## 

Common Error Codes

### 

Validation Errors (400)

`TERMS_NOT_ACCEPTED`

JSON

```
{
  "error_code": "TERMS_NOT_ACCEPTED",
  "message": "User must accept staking terms before proceeding",
  "user_message": "Please review and accept our staking terms and conditions"
}
```

`INSUFFICIENT_BALANCE`

JSON

```
{
  "error_code": "INSUFFICIENT_BALANCE",
  "message": "Available balance insufficient for requested stake amount",
  "details": {
    "asset": "ETH",
    "requested_notional": "35000.00",
    "available": "8.2"
  },
  "user_message": "You do not have enough ETH to complete this stake"
}
```

`JURISDICTION_RESTRICTED`

JSON

```
{
  "error_code": "JURISDICTION_RESTRICTED",
  "message": "Staking not available in user's jurisdiction",
  "details": {
    "participant_code": "CUST01",
    "jurisdiction": "CA"
  },
  "user_message": "Staking is not currently available in your location"
}
```

### 

Authentication Errors (401)

`INVALID_TOKEN`

JSON

```
{
  "error_code": "INVALID_TOKEN",
  "message": "Authentication token is invalid or expired",
  "user_message": "Please log in again"
}
```

### 

Server Errors (500)

`INTERNAL_SERVER_ERROR`

JSON

```
{
  "error_code": "INTERNAL_SERVER_ERROR",
  "message": "An unexpected error occurred",
  "user_message": "Something went wrong. Please try again later"
}
```

---

# 

Quick Reference

**Essential Endpoints**

- Discover stakeable assets: [GET /assets?staking\_enabled=true](https://docs.zerohash.com/reference/get_assets)
- Validate available balance: [GET /accounts?account\_type=available](https://docs.zerohash.com/reference/get_accounts-account-id)
- Check staking parameters: [GET /assets/{asset}/staking\_info](https://docs.zerohash.com/reference/get_assets-asset-staking-info)
- Verify terms acceptance: [GET /participant/{participant\_code}](https://docs.zerohash.com/reference/get_participant-participant-code-full-info)
- Update terms acceptance: [PATCH /participants/customers/{participant\\\_code}](https://docs.zerohash.com/docs/staking)
- Submit stake: [POST /stakes](https://docs.zerohash.com/reference/post_stakes)
- Cancel pending stake: [POST /stakes/{stake\\\_id}/cancel](https://docs.zerohash.com/reference/post_stakes-stake-id-cancel)
- Monitor stake status: [GET /stakes/{stake\_id}/status](https://docs.zerohash.com/reference/get_stakes-stake-id-status)
- View portfolio: [GET /stakes/{participant\_code}](https://docs.zerohash.com/reference/get_stakes-participant-code)
- Track rewards: [GET /stakes/{participant\_code}/rewards](https://docs.zerohash.com/reference/get_stakes-participant-code-rewards)
- Submit unstake: [POST /stakes/unstake](https://docs.zerohash.com/reference/post_stakes-unstake)
- Cancel pending unstake: [POST /stakes/unstake/{unstake\\\_id}/cancel](https://docs.zerohash.com/reference/post_stakes-unstake-unstake-id-cancel)
- Monitor unstake status: [GET /stakes/unstake/{unstake\\\_id}/status](https://docs.zerohash.com/reference/get_stakes-unstake-unstake-id-status)

# 

Support and Resources

Please contact your dedicated Relationship Manager for:

- Frontend standards and implementation requirements
- Sample UX designs and the UX research report
- Setting your platform fee
- User education materials and user-facing FAQs
- Any additional integration support

Updated about 2 months ago

---

Did this page help you?

Yes

No

Copy Page