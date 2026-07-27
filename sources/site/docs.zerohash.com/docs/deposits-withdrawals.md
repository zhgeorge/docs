# Source: https://docs.zerohash.com/docs/deposits-withdrawals

### 

Can our platform accept retail deposits?

Yes. Platforms can create digital asset addresses for retail end users. The list of supported assets for retail deposits can be found [here](https://docs.zerohash.com/page/what-assets-do-you-support-two).

### 

How can I start creating retail deposit addresses?

This feature is not enabled by default. If your organization is interested in using this feature, please get in touch with a zerohash representative.

### 

How do you support EVM-based token retail deposits?

zerohash has implemented forwarding smart contracts to accept retail deposits across all supported EVM networks (i.e. Ethereum, Polygon, Arbitrum, Optimism, Base, Avalanche C-Chain, and others). This means your retail customer has a single dedicated address per EVM network to deposit all native and ERC-20 compatible tokens. This wallet address has to first go through a smart contract wallet that is managed by zerohash.

### 

Are there any deposit address creation fees?

Most deposit addresses can be created for free. For UTXO and Tag based assets, there are no deposit address creation fees.

### 

Why is zerohash using forwarding smart contracts?

Forwarding smart contracts are used by zerohash to increase EVM scaling capabilities and to reduce a platform's expected operational cost.

### 

Why is my deposit address the same for all native tokens and ERC-20 compatible assets on a given EVM network?

Retail customers will be provided with one forwarding smart contract address per supported EVM network. All native and ERC-20 compatible assets on that network go to the same address.

### 

What happens if I send a different ERC-20 compatible asset to my deposit address?

If you send a zerohash-supported ERC-20 compatible asset to your forwarding smart contract, it will be credited as normal. Only zerohash-supported assets should be sent to forwarding contract addresses.

## 

API Flow

### 

Overview

For an end user looking to deposit assets with a platform, first the platform will need to create the address using `POST /deposits/digital_asset_addresses`. Doing this will return an address that the platform can relay to the end user.

### 

Example

1. **Platform Request**: Platform A requests a unique wallet address for Customer B.
 - Sample Request Body:

 JSON

        ```
        {
            "participant_code": "CUST01",
            "asset": "UNI"
        }
        ```

 - Sample Response:

 JSON

        ```
        {
          "message": {
            "created_at": 1647050013,
            "address": "0x7f41A26C0CB9D5a1e57BE9cF10F8354b77CD8ab3",
            "participant_code": "CUST01",
            "asset": "UNI"
          }
        }
        ```

2. **Customer Deposit**: Customer B deposits UNI to the generated address.
3. **Platform Check**: Platform A checks recent deposit activity using `GET /deposits` and `include_customer_deposits=true`.
4. **Transaction Confirmation**: Once the transaction is confirmed, zerohash represents the transaction in an account for Customer B.
5. **Account Balance**: Customer B can see their total account balance using `GET /accounts`.

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page