# Source: https://docs.zerohash.com/changelog/account-ownership-attestation

[Back to All](https://docs.zerohash.com/changelog)

# 

Release Details

**Release Date:** May 26, 2026

# 

Summary

![](https://files.readme.io/617189879ddd4e3641d71e0b5e263f439e48f02b2eb63d3bb84dd36a66a397a7-exportsss.png)

# 

Account ownership attestation for transaction flows

zerohash now supports Attestation - a configurable compliance control that captures a user's explicit representation that they own and control the source or destination account in a transaction.

# 

What it does

When enabled, users are presented with an attestation screen (on the zerohash SDK) at the appropriate point in a transaction flow. They must acknowledge a disclosure statement confirming ownership before proceeding. The attestation is persisted and linked to the resulting transaction, creating an auditable record of the customer representation.

# 

Supported SDKs

Attestation can be enabled across the following products:

| SDK `permission` | Description |
| --- | --- |
| `crypto-withdrawals` | Crypto withdrawals |
| `crypto-pay` | Crypto/stablecoin payins |
| `crypto-payouts` | Crypto/stablecoin payouts |
| `fwc` | Account Funding |

# 

How to enable

Contact your zerohash relationship manager if you'd like this enabled, it is a quick and easy configuration on our end.