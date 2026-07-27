# Source: https://docs.zerohash.com/docs/tokenization-engine

# 

Summary

The zerohash Tokenization Engine facilitates the creation, movement, and redemption of digital assets representing real-world assets (RWAs). It offers flexible administrative tools and controls to manage these assets at scale with enterprise-grade security, scalability, and regulatory adherence.

This documentation outlines how platforms can interact with zerohash's tokenization engine once onboarded to the platform.

# 

Core Capabilities

## 

Multi-Chain Support

- Multi-Chain Support: Deploy, manage, and register token smart contracts across a variety of blockchain networks. The engine supports 7 EVM networks (Ethereum, Avalanche, Aptos, Arbitrum, Optimism, Polygon, and Celo), as well as Solana.
- Full Token Lifecycle Management: Construct and validate smart contract calls for comprehensive token lifecycle management, including minting, burning, transfers, role-based access control, pausing, freezing, and contract upgrades.
- Built-in Compliance: Automated sanction screening against OFAC and other global sanctions lists. Includes features for contract-wide pause/unpause, targeted address freezing and burning, and lawful order enforcement.
- Network Fee Abstraction: The platform fully abstracts network fees with customizable payor specifications. Fees can be paid in USD or crypto based on platform configuration.
- Enterprise-Grade Integration: Robust REST API endpoints with comprehensive audit trails for regulatory reporting. Configurable webhook systems for real-time operational updates.

## 

Network Fee Abstraction

zerohash’s platform implements a [configurable payor system](https://docs.zerohash.com/changelog/additional-configurations-for-deposit-addresses-and-withdrawal-payor-fees) that abstracts network fee payments. Platforms can specify who pays for network fees, how fees are paid (USD or crypto), and customize fee structures for different customer segments.

## 

Built-in Compliance

The platform includes automated sanction screening with real-time compliance checks, built-in regulatory framework compliance, and administrative controls for lawful order enforcement to meet regulatory requirements.

**Compliance Features:**

- EVM Networks: ERC-1644/1643 standards for controller operations and court order references
- Solana: Token-2022 compliance extensions including transfer hooks and permanent delegate authority
- Role-Based Access Controls: Granular permissions for mint, burn, pause, and compliance operations
- Automated Screening: Real-time sanction and compliance checks

# 

Smart Contract Architecture

The tokenization engine supports both EVM and Solana-based contracts, built on industry-standard, audited, and battle-tested frameworks.

## 

EVM Implementation (Ethereum and Compatible Networks)

Our token contract delivers compliant digital assets across multiple blockchains with low on-chain costs, institutional-grade administrative controls, and best-practice wallet interoperability.

**Core Contract Features**

The contract supports mint/burn operations, lawful-order controls (freeze/burn/wipe), and gasless user flows. Our base contract is implemented using [ERC-1155](https://docs.openzeppelin.com/contracts/3.x/erc1155), a standard that maintains direct compatibility with ERC-20 while adding enhanced capabilities such as batch transfers and approvals for improved gas efficiency.

**Default Extensions Include:**

- Role-based access control over mint, burn, pause, and lawful-order controls (block, freeze, wipe)
- Contract-wide pause/unpause for emergency-stop vulnerability mitigation
- Threshold-based and time-locked mint/burn operations to
- Treasury Distribution Wallets (TDW) for secure supply management

**Regulatory Compliance Standards**

Lawful order requirements are addressed through secure implementations of:

- ERC-1644: Controller-forced transfer and burn capabilities
- ERC-1643: On-chain references to court orders for compliance operations

**Enhanced Usability and Gas Optimization**

Support for the following standards increases usability, improves wallet compatibility, and reduces gas requirements:

- [ERC-2612](https://eips.ethereum.org/EIPS/eip-2612) (Permit): Signed transfer approvals eliminating additional calls to Approve method
- [EIP-2771](https://eips.ethereum.org/EIPS/eip-2771) (Trusted Forwarder): Meta-transactions and application-sponsored gas fees
- [EIP-3009](https://eips.ethereum.org/EIPS/eip-3009) (transferWithAuthorization): Gasless/signed transfers
- [ERC-1271](https://eips.ethereum.org/EIPS/eip-1271): Extended signature verification for multi-sig schemes

Contract upgradeability is implemented through EIP-1967 and ERC-1822 support.

## 

Solana Implementation

Solana token contracts utilize the official SPL token stack with Token-2022 extensions, governed by multi-sig controls and optimized for low fees and fast settlement.

**Architecture**

- Each token represents a currency class using a dedicated SPL token mint via the Token-2022 program
- Holders maintain balances in Associated Token Accounts (ATA) - deterministic token accounts based on owner and mint details
- This approach dramatically simplifies custody and reconciliation
- Token operations (mint, burn, transfer) can be batched into single transactions to reduce fees and latency

**Compliance and Lawful-Order Controls**

Implemented using audited Token-2022 extensions:

- Freeze/Thaw: Issuer can stop movement of specific accounts
- Require Memo: Enforces inclusion of memo strings on transfers for audit trails
- Transfer Hooks: Route every transfer through a policy program for pre-transfer checks including allow/deny list enforcement and jurisdiction rules
- Permanent Delegate: Provides issuer explicit authority to move or burn funds from frozen accounts (Solana equivalent to Controller Force Transfer on EVM chains)

**Security and Governance**

All sensitive authorities (Mint Authority, Freeze Authority, Memo/Metadata Authority, and Program Upgrade Authority) operate behind on-chain governance. We typically configure SPL Governance (Realms) or production multi-sig controls with thresholds, proposals, and recorded votes.

Solana also supports gasless transactions using a fee-payor model to enable sponsored transactions.

# 

Supported Token Types

The tokenization engine is configured to create [ERC1155](https://docs.openzeppelin.com/contracts/3.x/erc1155) multi-tokens that [supports](https://docs.zerohash.com/page/what-assets-do-you-support-two) both Fungible Token (USDFI) and Non-Fungible tokens (LOANFI).

**Fungible Tokens**

- Digital assets representing fungible value (e.g., stablecoins, securities)
- Precision: Configurable decimal precision (typically 6 decimals for USD-backed tokens)
- Multiple Minting: Can be minted multiple times with configurable amounts
- Token ID: Uses token ID 0 to identify fungible tokens
- Gasless Operations: Support for meta-transactions and sponsored gas fees

**Non-Fungible Tokens (NFTs)**

- Unique Asset Representation: Each token has a unique identifier (token ID > 0)
- One-time Minting: Each token ID can only be minted once
- Asset Linkage: Token IDs can be linked to off-chain asset identifiers
- Fixed Amount: Typically minted with amount value of 1

# 

Token Operations Process

## 

Process Overview

Token operations are initiated through two primary channels:

1. Automatic Processing: Receipt of collateral deposits to designated reserve accounts triggers automatic minting
2. API-Initiated: Explicit mint/burn requests submitted through authenticated API endpoints

## 

Multi-Layered Security and Verification

**Policy Engine Integration** 
All operations pass through comprehensive preliminary checks including:

- Deposit validation against established reserves
- Security assessments and compliance screening
- Automated sanction checks against OFAC and global sanctions lists

**Token Ledger Manager**

- Updates ledger with associated deposits
- Generates precise parameters for token operations (recipient address, amount, token ID)
- Ensures accurate tracking of all backing assets
- Provides audit trail for regulatory reporting

**Cryptographic Security**

- All private signing keys protected by 3-of-3 Multi-Party Computation (MPC) threshold signing
- Eliminates single points of failure
- Enhanced cryptographic security for all treasury operations

**Multi-Layered Control System** 
For enhanced security on high-value operations, we implement additional controls:

- Threshold-based controls: Operations above certain thresholds (configured per platform) trigger additional security measures
- Human oversight: Authorized personnel must provide mandatory approval for qualifying transactions
- Time-lock mechanisms: High-value requests may include a 12-24 hour review period to allow for comprehensive verification before execution

**Pre-Signing Verification and Multi-Signature Options** 
Prior to signing, each MPC signer performs a final verification to confirm all policy engine checks completed successfully. For additional security, contracts can be configured to require multiple signatures beyond the MPC threshold. In this configuration, zerohash generates the transaction and sends a webhook to request an additional signature from the platform, enabling independent key management outside zerohash's infrastructure and providing additional treasury control over token operations.

**Transaction Execution and Audit Trail** 
Once all required approvals and signatures are obtained, transactions are recorded in an immutable transaction log before blockchain broadcast. Upon blockchain confirmation, the audit log is automatically updated with block numbers, transaction hashes, and comprehensive transaction details. All audit logs are cryptographically signed and tamper-resistant to provide forensic-level verification capabilities.

# 

API Architecture

## 

REST API Design

The tokenization engine provides standard REST endpoints with JSON payloads and comprehensive error handling. Authentication is handled via signed API keys with timestamp-based security. All operations are idempotent with unique request IDs, and webhook notifications provide real-time status updates.

## 

Authentication and Security

### 

API Request Security

- HMAC-SHA-256 signature: All API requests must be authenticated
- Valid API key: Accompanied by valid credentials
- IP Allowlisting: Requests must come from authorized IP addresses
- Timestamp validation: Prevents replay attacks through server time comparison
- Request signing: Timestamps, URL, and request body included in signature

### 

API Key Management

- Created via Platform Client Portal with Auth0 MFA security
- Requires admin role creation and separate admin approval
- Configurable approval workflows (default: initiator + approver)
- Granular permissions (read, write) per resource
- IP address restrictions and expiry time configurations
- Revocation capabilities via Client Portal

## 

Core Operations

All tokenization operations follow a consistent four-step pattern: initiate the operation with a unique client request ID, track progress using the returned token request ID, confirm the on-chain transaction, and receive optional webhook notifications for real-time updates.

# 

Administrative Controls

The tokenization engine includes comprehensive administrative functions for platform management and regulatory compliance.

## 

Commission Management

**Smart Contract Taxation** 
The platform implements automated commission collection through smart contract mechanisms. Commission rates are configurable up to a maximum of 5000 basis points (50%), with automatic deduction from fungible token transfers.

**Commission Distribution** 
Collected commissions are automatically sent to designated recipient addresses. The system supports flexible distribution models, allowing platforms to configure multiple commission recipients or redirect commission flows as needed.

## 

Emergency and Compliance Controls

**Emergency Operations**

The platform provides emergency stop mechanisms that can pause all tokenization operations instantly. These controls include:

- System-wide pause and unpause functions for critical incident response
- Optional reason codes and administrative memos for audit trails
- Role-based access controls ensuring only authorized administrators can execute emergency stops

**Account-Level Controls** 
Individual account management includes freeze and unfreeze capabilities for compliance requirements. These controls can restrict specific addresses from participating in token operations while maintaining overall system functionality.

**Lawful Order Enforcement**

Comprehensive regulatory compliance tools support lawful order enforcement including:

- Account freezing and unfreezing
- Forced token burning (wiping)
- Controller-forced transfers (ERC-1644 compliance)
- All enforcement actions support documentation references with authority information, case IDs, and supporting document URIs
- On-chain references to court orders (ERC-1643 compliance)

## 

Technical Administration

**Metadata Management** 
The system supports dynamic metadata management for tokens. Administrators can update base URIs for metadata resolution and configure custom attribute schemas to support evolving business requirements.

**Multi-Signature Configuration**

For enhanced security, the platform supports multi-signature authorization for critical operations. This includes:

- Webhook-based signature requests
- Callback mechanisms for customer-hosted co-signers
- Threshold-based operations with time-locks for Treasury Distribution Wallets
- On-chain governance support (SPL Governance for Solana implementations)
- Role-based access controls with configurable authorization levels

# 

Economics

## 

Commission

A smart contract commission mechanism referred to as “taxation” is implemented where a percentage of the fungible token transfers are sent to a specific address (taxAddress).

- Tax BPS (Basis Points): A tax rate is defined in basis points (BPS), and the maximum allowed BPS is 5000 (50%).
- Taxed Token (FT): Only transfers of the fungible token (id == 0) are subject to tax.

**Transfer example with taxes:**

- [https://sepolia.etherscan.io/tx/0x1731458fe5d8d3d576f40161e0fcbe34e06bddea8098e807ac4b66a12fbfef44](https://sepolia.etherscan.io/tx/0x1731458fe5d8d3d576f40161e0fcbe34e06bddea8098e807ac4b66a12fbfef44)
- In the above requested transaction, the original transfer was 200,000 USDFI where 199,500 were 
 transferred to destination and 500 (25bps) to the tax address.
- The contract is currently configured in CERT to have a commission/tax setting of 5bps.

## 

Yield

**Token Yield Distribution**

Token yield can be distributed through various mechanisms depending on the token type and use case. Yield distribution can be implemented through direct minting to holder addresses, simulating how yield could be distributed once earnings are deposited into reserve accounts.

**Off-chain**: Token operations represent claims on underlying assets where yield is tracked and settled via off-chain registries. Token standards allow implementation of additional metadata for tracking terms, performance, and payment history.

**On-Chain**: Incorporating native Ethereum standard [ERC-4626](https://eips.ethereum.org/EIPS/eip-4626) enables on-chain vault representations of yield-bearing assets. Participants can deposit base tokens and receive representative tokens that can be redeemed with potential yield differential at redemption time.

# 

Administrative Configurations

The zerohash token contract includes configurable parameters that can be managed by the contract owner or an assigned administrator. Please note that these administrative functions are not currently exposed through a public API.

## 

1\. Configure Commission (“taxesˮ)

- Tax Address: Designated recipient of the commission on fungible token (FT) transfers.
- Tax Basis Points (BPS): Configurable up to a maximum of 5000 BPS (equivalent to 50%).
- Default value is 5bps.

## 

2\. Freeze/Unfreeze

Ability to pause or unpause all token minting, burning and transfers, providing an emergency stop 
mechanism.

## 

3\. URI Management

Capability to update the base URI used to resolve metadata for NFT token types.

# 

Getting Started

## 

Prerequisites

Before integrating with the tokenization engine, ensure your platform is onboarded to zerohash with API credentials configured and a participant code assigned. Webhook endpoints are optional but recommended for real-time operation monitoring.

## 

Integration Paths

Choose your integration approach based on your use case:

- For fungible tokens: 1:1 fiat-backed stablecoins, high-volume transfers, and DeFi protocol integration → Refer to the [Fungible Token Integration Guide](https://docs.zerohash.com/docs/fungible-token-11-stablecoin-integration)
- For non-fungible tokens: Unique asset tokenization, loan and debt instruments, or collectibles and certificates → Refer to the [Non-Fungible Token Integration Guide](https://docs.zerohash.com/docs/non-fungible-token-nft-integration)

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page