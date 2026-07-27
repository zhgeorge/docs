# Source: https://docs.zerohash.com/docs/supported-address-formats

## 

What address formats do you support?

Some digital assets use multiple address formats following changes to network protocols such as the ETH Merge or BTC SegWit upgrade. zerohash offers support sending to multiple address formats in both the Production (PROD) and Certification (CERT) environments. Please note the particular address formats supported in the zerohash PROD and CERT environments that are described below:

## 

Bitcoin (BTC)

zerohash supports sending to [all address formats](https://en.bitcoin.it/wiki/List_of_address_prefixes) for BTC including the following:

- **Testnet Addresses:** The zerohash CERT environment supports BTC addresses that begin with characters “m” or “n” (6F in hexadecimal).
- **Legacy Addresses:** The zerohash PROD environment supports legacy BTC addresses that begin with a "1".
- **Bech32/Native SegWit Addresses:** The zerohash PROD environment supports Bech32 (Native SegWit) address format for BTC including addresses that begin with “bc1” (including Taproot) as well as p2sh SegWit addresses that start with characters “3”.

Please note that zerohash does not support BTC addresses that are all uppercase (e.g. 3J98T1WPEZ73CNMQVIECRNYIWRNQRHWNLY). zerohash only supports legacy and SegWit BTC addresses that are checksummed (e.g. 3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy).

## 

Bitcoin Cash (BCH)

- **Cash Addresses:** The zerohash PROD environment supports the [CashAddr](https://docs.zerohash.com/docs/which-bitcoin-cash-bch-chain-do-you-support) BCH address format. This address format is designed to help distinguish between BCH and BTC more clearly.

## 

Ethereum (ETH) and ERC20

- **Testnet Addresses:** As of the [Ethereum Merge](https://docs.zerohash.com/changelog/update-on-the-ethereum-merge), the zerohash CERT environment only supports Goerli test network addresses. Addresses that are associated with Ropsten or other ETH test networks are not supported and cannot be used in CERT.

## 

Litecoin (LTC)

- **Testnet Addresses:** The zerohash CERT environment supports LTC addresses that begin with characters “m” or “n” (6F in hexadecimal).
- **Legacy Addresses:** The zerohash PROD environment supports legacy addresses that begin with an "L" for LTC.
- **Bech32/Native SegWit Addresses :** The zerohash PROD environment supports Bech32 (Native SegWit) address format for LTC including addresses that being with “ltc1” as well as SegWit (P2SH) addresses that start with characters “3” or “M”.

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page