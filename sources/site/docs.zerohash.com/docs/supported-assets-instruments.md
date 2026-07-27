# Source: https://docs.zerohash.com/docs/supported-assets-instruments

## 

Understanding Supported Assets vs. Instruments

zerohash supports two distinct environments: Certification (CERT) and Production (PROD)

- Certification Environment is for sandbox testing with testnet funds and demo accounts.
- Production Environment is the live environment where real trades, deposits and withdrawals occur.

You can find full breakdowns of which assets and instruments are supported in each environment below.

### 

Assets

Assets that zerohash can custody, deposit or withdraw regardless of whether they are actively traded.

- [Supported Assets - PROD](https://docs.zerohash.com/page/what-assets-do-you-support)
- [Supported Assets - CERT](https://docs.zerohash.com/page/cert-environment-assets)

### 

Instruments (Tradable Pairs)

Tradable asset pairs supported for execution via CLOB or RFQ. Instruments are a subset of supported assets, and not every supported asset is a supported instrument.

- [Supported Instruments - PROD](https://docs.zerohash.com/page/production-environment)
- [Supported instruments - CERT](https://docs.zerohash.com/page/certification-environment-instruments)
- [Supported instruments - RFQ](https://docs.zerohash.com/docs/supported-instruments-1)
- [Supported Instruments - CLOB](https://docs.zerohash.com/docs/supported-instruments)

## 

Supported Blockchains

- [Production Environment Blockchains](https://docs.zerohash.com/docs/production-environment-blockchains)

## 

Deposits and Withdrawals

- All fiat assets are supported for institutional deposits and withdrawals. Fiat deposits and withdrawals from retail end users is also supported.
- All crypto assets support withdrawals for retail end users.
 - Platforms should test withdrawal functionality using the minimums returned via the [https://docs.zerohash.com/reference/get\_assets](https://docs.zerohash.com/reference/get_assets) endpoint
- Smart Contracts are used to generate deposit addresses for some blockchains. More information about how this is done can be found [here](https://docs.zerohash.com/changelog/create2-smart-contract-powered-address-deployments).

## 

Rounding

If you are utilizing the zerohash API to calculate trade notional and settlement values, banker's rounding must be used on a per-trade basis. zerohash settlement system will round each trade obligation and then sum at the end vs. summing all trade obligations then rounding the final value. Bankers rounding is other known as Round to Even. 

- If the difference between the number and the nearest integer is less than 0.5, round to the nearest integer.
- If the difference between the number and the nearest integer is exactly 0.5, look at the integer part of the number.

## 

Support for Participants in New York

The New York Department of Financial Services (“NYDFS”) maintains a list of NYDFS pre-approved tokens for New York customers, the Greenlist. Although NYDFS categorizes assets support into Approved for Custody and Approved for Listing, zerohash currently only support assets that meet both the criteria for custody and listing.

Although NYDFS categorizes assets support into Approved for Custody and Approved for Listing, zerohash will only support assets that meet both the criteria for custody and listing. As a result, there may be assets that are available for one or the other according to NYDFS, which we will not support for Participants in NY. 

All supported assets for NY are marked with a 'Yes' in the 'Supported in NY' column in the above table. Please refer to the below link for more information - [dfs.ny.gov/virtual\_currency\_business](https://www.dfs.ny.gov/virtual_currency_businesses)

Updated about 2 months ago

---

Did this page help you?

Yes

No

Copy Page