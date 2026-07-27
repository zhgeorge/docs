# Source: https://docs.zerohash.com/docs/non-fungible-token-nft-integration

This guide covers the integration of non-fungible tokens (NFTs) for representing unique real-world assets using zerohash's tokenization engine.

## 

Token Characteristics

**Non-Fungible Tokens (NFTs)**

- Unique Identifiers: Each token has a unique token ID (must be > 0)
- One-Time Minting: Each token ID can only be minted once
- Fixed Amount: Typically minted with amount value of 1
- Asset Linkage: Token IDs can be linked to off-chain asset identifiers
- Metadata Support: Rich metadata capabilities for asset details

Token symbols include network specification (e.g., "LOANFI.ETH" for Ethereum L1). All examples use Ethereum Sepolia testnet for demonstration purposes.

### 

1\. NFT Minting

Create a unique NFT with a specified token ID to represent a singular asset.

**Endpoint:** `POST /token/mint`

**Request Parameters:**

JSON

```
{
    "amount": "1",
    "token_symbol": "LOANFI.ETH",
    "token_id": "1",
    "client_request_id": "21532ea2-c59d-4ba9-90e7-f51302f43937",
    "participant_code": "SB5LRL",
    "receiver": "0x45D9A0Ee3a917Eccd6182C030dC9f18897eCf79E"
}
```

**Response:**

JSON

```
{
    "token_request_id": "21532ea2-c59d-4ba9-90e7-f51302f43937"
}
```

**Field Descriptions:**

- `amount`: Must be "1" for NFTs
- `token_symbol`: Token identifier with network suffix
- `token_id`: Unique identifier (string, must be > 0)
- `client_request_id`: Unique identifier for idempotency (UUID format recommended)
- `participant_code`: Platform-specific participant identifier
- `receiver`: Destination wallet address for the NFT

[Example transaction](https://sepolia.etherscan.io/tx/0xb5ede8740c4d8104508208401a9ca4c27633ea018069cca1730f950235800b89)

### 

2\. NFT Burning/Redemption

Burn an NFT to represent asset redemption or lifecycle completion.

**Endpoint:** `POST /token/burn`

**Request Parameters:**

JSON

```
{
    "amount": "1",
    "token_symbol": "LOANFI.ETH",
    "token_id": "2",
    "client_request_id": "85d45c34-7fb9-448f-91b0-a2b248e22518",
    "participant_code": "SB5LRL",
    "owner": "0x45D9A0Ee3a917Eccd6182C030dC9f18897eCf79E"
}
```

**Response:**

JSON

```
{
    "token_request_id": "85d45c34-7fb9-448f-91b0-a2b248e22518"
}
```

**Field Descriptions:**

- `owner`: Address that owns the NFT to be burned
- `token_id`: Specific token ID to burn
- Other fields same as mint operation

[Example transaction](https://sepolia.etherscan.io/tx/0x09c33fac347da8163a3de575d8f82ee0ab5cacd6a7885f707f9924451446ac96)

### 

3\. NFT Transfer

Transfer NFTs between addresses (typically handled through standard ERC-1155 transfer methods).

**Endpoint:** `POST /v1/token/transfer`

**Request Parameters:**

JSON

```
{
    "token_symbol": "LOANFI.ETH",
    "token_id": "5",
    "client_request_id": "44b6cbea-1c77-415f-b866-2987b0b869dd",
    "participant_code": "SB5LRL",
    "sender": "0x45D9A0Ee3a917Eccd6182C030dC9f18897eCf79E",
    "receiver": "0x742d35Cc6634C0532925a3b8D",
    "amount": "1"
}
```

### 

4\. Operation Status Monitoring

Get real-time status updates for NFT operations.

**Endpoint:** `GET /token/{token_request_id}`

**Example:** `GET /token/85d45c34-7fb9-448f-91b0-a2b248e22518`

**Request Parameters:**

JSON

```
{
    "message": {
        "token_request_id": "85d45c34-7fb9-448f-91b0-a2b248e22518",
        "token_symbol": "LOANFI.ETH",
        "token_id": "2",
        "action": "BURN",
        "owner": "0x45D9A0Ee3a917Eccd6182C030dC9f18897eCf79E",
        "amount": "1",
        "platform_code": "NAXJ2C",
        "participant_code": "SB5LRL",
        "status": "COMPLETED",
        "tx_hash": "0x09c33fac347da8163a3de575d8f82ee0ab5cacd6a7885f707f9924451446ac96",
        "network_fee": "0.000035"
    }
}
```

**Status Values:**

- `PENDING`: Operation initiated, awaiting processing
- `PROCESSING`: Transaction submitted to blockchain
- `COMPLETED`: Transaction confirmed on-chain
- `FAILED`: Operation failed (see error details)

## 

Token ID Management

### 

Unique Identifier Strategy

**Sequential IDs:** Simple incremental numbering

JSON

```
{
    "token_id": "1001",
    "metadata": {
        "loan_id": "LOAN-2025-001",
        "asset_type": "residential_mortgage"
    }
}
```

**Composite IDs:** Encoded asset information

JSON

```
{
    "token_id": "20250115001",
    "metadata": {
        "date": "2025-01-15",
        "sequence": "001",
        "asset_class": "commercial_loan"
    }
}
```

**Hash-based IDs:** Derived from asset attributes

JSON

```
{
    "token_id": "1234567890",
    "metadata": {
        "hash_source": "loan_id + origination_date + borrower_hash"
    }
}
```

## 

Metadata Management

### 

URI Configuration

NFT metadata is typically stored off-chain with on-chain URI references.

**Metadata URI Pattern:**

```
https://api.yourplatform.com/metadata/{token_symbol}/{token_id}
```

**Example Metadata Response:**

JSON

```
{
    "name": "Residential Loan #1001",
    "description": "Tokenized residential mortgage loan",
    "image": "https://api.yourplatform.com/images/loan-1001.png",
    "attributes": [
        {
            "trait_type": "Loan Type",
            "value": "Residential Mortgage"
        },
        {
            "trait_type": "Principal Amount",
            "value": "$450,000"
        },
        {
            "trait_type": "Interest Rate",
            "value": "6.25%"
        },
        {
            "trait_type": "Term",
            "value": "30 years"
        },
        {
            "trait_type": "Origination Date",
            "value": "2025-01-15"
        }
    ],
    "external_url": "https://yourplatform.com/loans/1001"
}
```

### 

Administrative URI Updates

Base URIs can be updated by contract administrators to change metadata sources.

**URI Update Process:**

1. Deploy new metadata endpoint
2. Update contract base URI through admin functions
3. Verify metadata accessibility
4. Deprecate old endpoints if necessary

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page