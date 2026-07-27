# Source: https://docs.zerohash.com/docs/address-formats-for-testing-in-cert

zerohash sends withdrawal transactions on a blockchain's main network for Production transactions and a blockchain's test network for Certification transactions. Note that not all networks have a supported test network.

When testing supported assets in the CERT environment, be sure to use the correct address format. Even on some chains like Ethereum, the mainnet format will be the same as the testnet but assets will not transfer between the two.

Additionally, be sure to adhere to network minimum withdrawal requirements and zerohash recommended minimums article.

## 

Selected blockchain address format notes

### 

Bitcoin

- CERT: Testnet Addresses begin with chars m or n (6F in hexadecimal).
- PROD: Mainnet addresses begin with 1 (legacy), bc1 (SegWit), or 3 (SegWit) depending on which type they are. zerohash supports all address formats.

### 

Bitcoin Cash

zerohash supports the CashAddr address format

### 

Ethereum

- CERT: As of September 2022, the CERT environment only supports Goerli test network addresses. Addresses associated with Ropsten or other ETH test networks are not supported and cannot be used.

### 

Litecoin

- CERT: Testnet Addresses begin with chars m or n (6F in hexadecimal).
- PROD: Legacy: addresses start with a L, SegWit (P2SH) addresses start with a 3 or M

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page