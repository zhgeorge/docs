# Source: https://docs.zerohash.com/docs/fungible-token-11-stablecoin-integration

This guide covers the integration of fungible tokens representing 1:1 fiat-backed stablecoins using zerohash's tokenization engine.

# 

Token Characteristics

### 

Fungible Stablecoin Tokens

- Standard Compliance: ERC-1155/ERC-20 compatible with 6 decimal precision
- 1:1 Fiat Backing: Full collateralization with fiat reserves
- Multiple Minting: Supports multiple mint operations with configurable amounts
- Token Identification: Uses token ID 0 for all fungible token operations
- Network Support: Available across 7 EVM networks (Ethereum, Avalanche, Solana, Aptos, Arbitrum, Optimism, Polygon, and Celo) and Solana
- Gasless Operations: Support for meta-transactions and sponsored gas fees

Token symbols include network specification (e.g., "USDFI.ETH" for Ethereum L1, "USDFI.SOL" for Solana). All examples use Ethereum Sepolia testnet and Solana devnet for demonstration purposes.

# 

Multi-Chain Architecture

### 

EVM Networks

- ERC-1155 Implementation: Direct ERC-20 compatibility with enhanced batch capabilities
- Gasless Transactions: EIP-2771 (Trusted Forwarder) and EIP-3009 (transferWithAuthorization) support
- Compliance Standards: ERC-1644 (controller-forced transfers) and ERC-1643 (court order references)
- Role-Based Access: Granular permissions for mint, burn, pause, and compliance operations

### 

Solana Integration

- SPL Token-2022: Latest token standard with advanced compliance features
- Associated Token Accounts (ATA): Deterministic accounts for simplified custody
- Transfer Hooks: Pre-transfer compliance checks and policy enforcement
- Fee-Payor Model: Sponsored transactions for gasless user experience

# 

Core Operations

## 

1\. Token Minting

Mint stablecoin tokens after fiat collateral is locked in reserve accounts.

**Endpoint:** `POST /v1/token/mint`

**Request Parameters:**

JSON

```
{ 
    "amount": "1.56",
    "token_symbol": "USDFI.ETH",
    "client_request_id": "22b6cbea-1c77-415f-b866-2987b0b869ab",
    "participant_code": "SB5LRL",
    "receiver": "0x45D9A0Ee3a917Eccd6182C030dC9f18897eCf79E"
}
```

**Response:**

JSON

```
{ 
    "token_request_id": "22b6cbea-1c77-415f-b866-2987b0b869ab"
}
```

**Field Descriptions:**

- `amount`: Token amount to mint (string, supports up to 6 decimal places)
- `token_symbol`: Token identifier with network suffix
- `client_request_id`: Unique identifier for idempotency (UUID format recommended)
- `participant_code`: Platform-specific participant identifier
- `receiver`: Destination wallet address (treasury or external wallet)

## 

2\. Token Burning

Burn stablecoin tokens to initiate fiat settlement to token holders.

**Endpoint:** `POST /v1/token/burn`

**Request Parameters:**

JSON

```
{ 
    "amount": "0.56",
    "token_symbol": "USDFI.ETH",
    "client_request_id": "33b6cbea-1c77-415f-b866-2987b0b869cc",
    "participant_code": "SB5LRL",
    "owner": "0x45D9A0Ee3a917Eccd6182C030dC9f18897eCf79E"
}
```

**Response:**

JSON

```
{ 
    "token_request_id": "33b6cbea-1c77-415f-b866-2987b0b869cc"
}
```

**Field Descriptions:**

- `owner`: Address that owns the tokens to be burned
- Other fields same as mint operation

[Example transaction](https://sepolia.etherscan.io/tx/0x251b78c05e30c54a8f1430da34b4c38a6398950c7cb2d5c9208fd2d401e05f2a)

## 

3\. Batch Token Transfer

Transfer tokens from treasury wallet to multiple customer addresses in a single operation.

**Endpoint:** `POST /v1/token/transfer`

**Request Parameters:**

JSON

```
{ 
    "token_symbol": "USDFI.ETH",
    "client_request_id": "44b6cbea-1c77-415f-b866-2987b0b869dd",
    "participant_code": "SB5LRL",
    "sender": "0x45D9A0Ee3a917Eccd6182C030dC9f18897eCf79E",
    "transfers": [
        {"receiver": "0x742d35Cc6634C0532925a3b8D", "amount": "500.00"},
        {"receiver": "0x8ba1f109551bD432803012645Hj", "amount": "1000.00"},
        {"receiver": "0x2546BcD3c84621e976D8185a4F", "amount": "7500.00"}
    ]
}
```

**Response:**

JSON

```
{ 
    "token_request_id": "44b6cbea-1c77-415f-b866-2987b0b869dd"
}
```

## 

4\. Operation Status Monitoring

Get real-time status updates for all tokenization operations.

**Endpoint:** `GET /token/{token_request_id}`

**Example:** `POST /token/22b6cbea-1c77-415f-b866-2987b0b869ab`

**Response:**

JSON

```
{ 
    "message": {
        "token_request_id": "22b6cbea-1c77-415f-b866-2987b0b869ab",
        "token_symbol": "USDFI.ETH",
        "token_id": "",
        "action": "MINT",
        "owner": "0x45D9A0Ee3a917Eccd6182C030dC9f18897eCf79E",
        "amount": "1.56",
        "platform_code": "NAXJ2C",
        "participant_code": "SB5LRL",
        "status": "COMPLETED",
        "tx_hash": "0x8ab7bedd266aee63b5493be7b06aefa1ae4df11ade278c95a13adc1854663558",
        "network_fee": "0.000099"
    }
}
```

**Status Values:**

- `PENDING`: Operation initiated, awaiting processing
- `PROCESSING`: Transaction submitted to blockchain
- `COMPLETED`: Transaction confirmed on-chain
- `FAILED`: Operation failed (see error details)

## 

5\. Treasury Wallet Balance

Query the current balance of the treasury wallet for a specific token.

**Endpoint:** `GET /v1/token/treasury-balance/{token_symbol}`

**Example:** `POST /v1/token/treasury-balance/USDFI.ETH`

**Response:**

JSON

```
{ 
    "token_symbol": "USDFI.ETH",
    "wallet_address": "0x45D9A0Ee3a917Eccd6182C030dC9f18897eCf79E",
    "token_account": "1D...ATA",
    "balance": "750000000",
    "decimals": 6,
    "as_of": "2025-01-01T12:30:00Z"
}
```

**Field Descriptions:**

- `token_account`: Solana-specific field (when applicable)
- `balance`: Raw balance amount (multiply by 10^decimals for actual value)
- `as_of`: Timestamp of balance snapshot

# 

Emergency and Compliance Operations

## 

Emergency Pause / Unpause

Temporarily halt all token operations for emergency situations.

**Pause Endpoint:** `POST /v1/contract/pause`

**Unpause Endpoint:** `POST /v1/contract/unpause`

**Request Parameters:**

JSON

```
{ 
    "token_symbol": "USDFI.ETH",
    "client_request_id": "55b6cbea-1c77-415f-b866-2987b0b869ee",
    "reason": "incident-IR-2025-0815",
    "memo": "halt while rotating signer keys"
}
```

**Response:**

JSON

```
{ 
    "token_request_id": "55b6cbea-1c77-415f-b866-2987b0b869ee"
}
```

**Field Descriptions:**

- `reason`: Optional incident reference code
- `memo`: Optional human-readable description\]

## 

Lawful Order Enforcement

Compliance tools for regulatory requirements and court orders.

**Freeze Account:** `POST /v1/token/lawful/freeze`

**Unfreeze Account:** `POST /v1/token/lawful/unfreeze`

**Force Burn (Wipe):** `POST /v1/token/lawful/wipe`

**Request Parameters:**

JSON

```
{ 
    "token_symbol": "USDFI.ETH",
    "client_request_id": "66b6cbea-1c77-415f-b866-2987b0b869ff",
    "subject": "0x742d35Cc6634C0532925a3b8D",
    "order_ref": {
        "authority": "Court of X",
        "doc_uri": "https://.../order.pdf",
        "case_id": "CASE-2025-0123"
    },
    "memo": "OFAC/LE request #0123"
}
```

**Response:**

JSON

```
{ 
    "token_request_id": "66b6cbea-1c77-415f-b866-2987b0b869ff"
}
```

**Field Descriptions:**

- `subject`: Target user account address
- `order_ref`: Legal authority and documentation references
- `memo`: Optional compliance reference

# 

Economics

## 

Commission Structure for Fungible Tokens

Fungible tokens implement a smart contract commission mechanism that automatically deducts a percentage of token transfers to a designated address. This is specifically designed for fungible token economics.

**Commission Features**

- Tax Rate: Defined in basis points (BPS), maximum 5000 BPS (50%)
- Fungible Only: Only transfers of fungible tokens (token\_id == 0) are subject to commission
- Automatic Deduction: Commission automatically sent to configured tax address
- Default Rate: Typically 5 BPS for stablecoin implementations

**Transfer Example with Commission:**

- Original transfer: 200,000 USDFI
- Commission (25 BPS): 500 USDFI to tax address
- Net transfer: 199,500 USDFI to recipient
- [Example transaction](https://sepolia.etherscan.io/tx/0x1731458fe5d8d3d576f40161e0fcbe34e06bddea8098e807ac4b66a12fbfef44)

# 

Multi-Signature Support

For enhanced security, treasury operations can require multi-signature authorization using customer-hosted co-signers with threshold-based and time-locked operations.

## 

Role-Based Access Controls

**Administrative Roles:**

- Mint Authority: Permission to create new tokens
- Burn Authority: Permission to destroy tokens
- Pause Authority: Emergency stop capabilities
- Compliance Authority: Lawful order enforcement
- Treasury Authority: Threshold-based and time-locked operations

## 

Signature Request Webhook

When multi-signature is enabled, you'll receive webhooks for signing requests.

**Webhook URL:** `https://<webhook-handler-url>/webhooks/token/signature-request`

**Webhook Headers:**

Text

```
x-zh-hook-notification-id: <unique-webhook-id>
x-zh-hook-payload-type: token_signature_request
x-zh-hook-timestamp: <unix-timestamp>
x-zh-hook-signature: <hmac-sha256-signature>
```

**Signature Verification:**

Text

```
to_hex(hmac(sha256(payload + timestamp), your-secret))
```

**Webhook Payload:**

JSON

```
{ 
    "operation": {
        "type": "mint",
        "token_request_id": "22b6cbea-1c77-415f-b866-2987b0b869ab",
        "token_symbol": "USDFI.ETH",
        "to": "0x45D9A0Ee3a917Eccd6182C030dC9f18897eCf79E",
        "amount": "1000.00",
        "memo": "Monthly treasury distribution"
    },
    "signing": {
        "signer_address": "0x45D9A0Ee3a917Eccd6182C030dC9f18897eCf79E",
        "deadline": "2025-01-01T12:30:00Z",
        "message": "0x1234567890abcdef...",
        "scheme": "EVM_EIP712"
    }
}
```

**Operation Types:**

- `mint | burn | pause | unpause | freeze | wipe | transfer`

**Signing Schemes:**

- `EVM_EIP712`: Ethereum EIP-712 structured data signing
- `SOL_ED25519`: Solana Ed25519 signature scheme

## 

Signature Callback

Submit signatures back to complete multi-sig operations.

**Endpoint:** `POST /v1/token/signatures/<webhook-id>`

**Request Parameters:**

JSON

```
{ 
    "scheme": "EVM_EIP712",
    "pubkey": "0x04a1b2c3d4...",
    "signature": "0x1234567890abcdef...",
    "signed_at": "2025-01-01T12:29:45Z"
}
```

**Response:**

JSON

```
{ 
    "webhook_id": "unique-webhook-id",
    "status": "verified"
}
```

**Response Status Values:**

- `verified`: Signature verified and accepted
- `rejected`: Signature verification failed

**Important Notes:**

- All webhooks must receive HTTP 2xx response to acknowledge receipt
- Unacknowledged webhooks will be re-sent
- Complete signature callback before the deadline specified in webhook
- Use compressed format for public keys

# 

Webhook Integration

## 

Status Update Webhooks

Real-time notifications for all on-chain token actions (mint, burn, pause, unpause, freeze, wipe, transfer).

**Webhook URL Example:** `https://<webhook-handler-url>/webhooks/token/status`

**Webhook Headers:**

```
x-zh-hook-notification-id: <unique-webhook-id>
x-zh-hook-payload-type: token_status_update
x-zh-hook-timestamp: <unix-timestamp>
x-zh-hook-signature: <hmac-sha256-signature>
```

**Signature Verification:**

```
to_hex(hmac(sha256(payload + timestamp), your-secret))
```

**Webhook Body:**

JSON

```
{
    "type": "mint | burn | pause | unpause | freeze | wipe | transfer",
    "token_request_id": "<uuid>",
    "token_symbol": "USDFI.ETH",
    "to": "<recipient_address>",
    "amount": "<amount_to_transfer>",
    "memo": "<memo_details_of_operation>",
    "tx_hash": "<tx_hash>",
    "status": "CONFIRMED"
}
```

# 

Testing and Certification

## 

Test Environments

**EVM Networks:**

- Ethereum Sepolia: Primary testnet for EVM testing
- Polygon Mumbai: Polygon testnet environment
- Other Testnets: Available for specific network testing

**Solana:**

- Devnet: Primary Solana testing environment
- Testnet: Additional Solana testing capabilities

## 

Integration Testing

- Basic Operations: Test mint, burn, and transfer operations
- Compliance Features: Verify freeze, unfreeze, and wipe functionality
- Multi-Signature: Test signature workflows and callbacks
- Gasless Transactions: Verify meta-transaction and sponsored fee functionality
- Cross-Chain: Test operations across multiple networks

## 

Certification Requirements

- Complete integration testing across chosen networks
- Compliance feature verification
- Multi-signature workflow validation
- Security audit of integration implementation
- Performance testing for high-volume operations

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page