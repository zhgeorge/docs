# Source: https://docs.zerohash.com/docs/preparing-for-the-ethereum-proof-of-stake-merge-event

This document provides information and guidelines for platforms using zerohash to prepare for the Ethereum Proof of Stake (PoS) merge event scheduled for September.

## 

Overview

The Ethereum mainnet merge to PoS is expected to occur around September 15, resulting in significant changes to the Ethereum blockchain. zerohash is implementing measures to ensure smooth transition and continued operation during and after the merge.

## 

Changes and Actions Required

### 

Production Environment (PROD)

- **Withdrawals**: zerohash will temporarily suspend Ethereum and ERC20 withdrawals before and after the merge, creating a maintenance notification. Trading operations will continue as usual.

### 

Certification Environment (CERT)

- **Testnet Transition**: zerohash's CERT environment will transition from Ethereum's Ropsten testnet to the Goerli testnet before the merge, targeting September 8th. Existing ETH or ERC20 deposit addresses on Ropsten will need to be recreated on Goerli after the cutover.
- **Smart Contract Addresses**: New smart contract addresses will be used in CERT on the Goerli testnet. Platforms should update mappings or allowlisting to the new addresses.

## 

Timeline of Changes

- **Sept 8, 2022**: Cutover CERT environment ETH testnet from Ropsten to Goerli. ETH Deposit addresses and allowlists in-use in CERT will need to be recreated on CERT again and updated to the new addresses.
- **Sept 14, 2022**: ETH mainnet targeting the merge event. A maintenance window will be created that will pause ETH/ERC20/ETH L2 blockchain activity for approximately 10 minutes.

## 

CERT Smart Contract Addresses

Below are the ERC20 tokens previously supported on Ropsten testnet in CERT, along with their new corresponding Goerli smart contract addresses:

| Asset | Symbol | Smart Contract Address |
| --- | --- | --- |
| 0x | ZRX.ETH | 0xe4E81Fa6B16327D4B78CFEB83AAdE04bA7075165 |
| Basic Attention Token | BAT.ETH | 0x70cBa46d2e933030E2f274AE58c951C800548AeF |
| Chainlink | LINK.ETH | 0x326c977e6efc84e512bb9c30f76e30c160ed06fb |
| Compound | COMP.ETH | 0xe16C7165C8FeA64069802aE4c4c9C320783f2b6e |
| Dai | DAI.ETH | 0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60 |
| GMO USD | ZUSD.ETH | 0x01F5dB4F5bA927Fe73711C745473e6717C039ae3 |
| GMO Yen | GYEN.ETH | 0x208d48E7Eb3F316214c28894b3a6aEa9E87C59A5 |
| The Graph | GRT.ETH | 0x1441f298d1f15084A0e5c714c966033E39597dE7 |
| Maker | MKR.ETH | 0xc5E4eaB513A7CD12b2335e8a0D57273e13D499f7 |
| Polygon | MATIC.ETH | 0x499d11E0b6eAC7c0593d8Fb292DCBbF815Fb29Ae |
| The Sandbox | SAND.ETH | 0xbED9a4c4D99f5Ffe90e70996017c78a3bcDd8825 |
| Uniswap | UNI.ETH | 0x1f9840a85d5af5bf1d1762f925bdaddc4201f984 |
| USD Coin | USDC.ETH | 0x07865c6e87b9f70255377e024ace6630c1eaa37f |
| Tether | USDT.ETH | 0x6ad196dbcd43996f17638b924d2fdedff6fdd677 |
| Wrapped BTC | WBTC.ETH | 0xC04B0d3107736C32e19F1c62b2aF67BE61d63a05 |
| Wrapped ETH | WETH.ETH | 0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6 |

## 

Additional Resources

- [Ethereum Foundation Merge Documentation](https://ethereum.org/en/upgrades/merge/)

Please contact your client team for any additional questions or assistance regarding the Ethereum Proof of Stake merge event.

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page