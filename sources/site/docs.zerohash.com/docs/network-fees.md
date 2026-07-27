# Source: https://docs.zerohash.com/docs/network-fees

# 

Overview

zerohash supports multiple withdrawal fee models that allow platforms to customize how network fees are charged to participants. This guide explains the available options and how to implement them.

Please reach out to your zerohash account team to configure the withdrawal fee model you would like to implement.

## 

Fee Payment Models

| Who Pays | How It's Charged | Fee Currency | When to Use |
| --- | --- | --- | --- |
| Platform | **Additive** - Platform covers fee, full amount sent to user | Any supported currency | Platform wants to absorb costs as a service benefit |
| Participant | **Netted** - Fee deducted from withdrawal amount | Same as withdrawal asset | Simplified UX where users know exact total cost upfront |

# 

Detailed Fee Models

## 

1\. Platform Pays - Additive Model

In this model, the platform covers all network fees on behalf of their users.

**Endpoint**: [POST /withdrawals/requests](https://docs.zerohash.com/reference/post_withdrawals-requests)

**How it works:**

- Full requested withdrawal amount is sent to the destination address
- Network fee is deducted from the platform's fee account
- Users see no fee charges in their account

**Example:**

- User requests: 1.0 ETH withdrawal
- Amount sent on-chain: 1.0 ETH
- Network fee (0.002 ETH): Charged to platform fee account
- User's account debited: 1.0 ETH

## 

2\. Customer Pays - Netted Model

The customer pays the network fee, but it's deducted from the withdrawal amount itself. This provides a simplified user experience for customer-paid fees.

**API Flow:**

1. **Get locked quote (valid 30 seconds)**: [GET /withdrawals/locked\_network\_fee](https://docs.zerohash.com/reference/get_withdrawals-locked-network-fee)
2. **Execute the quote**: [POST /withdrawals/execute](https://docs.zerohash.com/reference/post_withdrawals-execute)
3. **Check withdrawal status**: [GET /withdrawals/requests/:id](https://docs.zerohash.com/reference/get_withdrawals-requests-id)

**How it works:**

- Network fee is quoted in the withdrawal asset currency
- Fee is deducted from the requested withdrawal amount
- Net amount (after fee) is sent to destination
- User only needs balance in one asset

**Example - Same Asset as Network Fee (ETH withdrawal):**

- User requests: 1.0 ETH withdrawal
- Network fee (quoted): 0.0025 ETH
- Amount sent on-chain: 0.9975 ETH
- User's account debited: 1.0 ETH total

**Example - Different Asset from Network Fee (USDC on Solana):**

- User requests: 100 USDC withdrawal (on Solana)
- Network fee in SOL: 0.000158 SOL
- Network fee quoted in USDC: 0.000158 USDC equivalent
- Amount sent on-chain: 99.999842 USDC
- User's account debited: 100 USDC total

**`max_amount` Parameter**

Use `max_amount=true` to automatically withdraw the entire account balance:

- zerohash calculates available balance
- Deducts network fee
- Returns quote for maximum possible withdrawal

# 

Related Documentation

- [Network Fee Estimate Calculation](https://docs.zerohash.com/docs/how-are-network-fee-estimates-calculated)
- [Minimum Withdrawal Amounts](https://docs.zerohash.com/docs/are-there-minimum-withdrawal-amounts)
- [Withdrawal Spreads](https://docs.zerohash.com/docs/withdrawal-spreads)
- [Withdrawal Status Tracking](https://docs.zerohash.com/docs/withdrawal-api-response-field-interpretation)
- [Custom Spreads for Convert & Withdraw](https://docs.zerohash.com/docs/custom-spreads)

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page