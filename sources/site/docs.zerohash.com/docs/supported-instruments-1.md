# Source: https://docs.zerohash.com/docs/supported-instruments-1

To programmatically retrieve the latest instruments available for Request for Quote (RFQ) trading, you can query the [`GET /assets`](https://docs.zerohash.com/reference/get_assets) endpoint. In the response, look for assets where `"rfq_liquidity_enabled": true`, this field indicates whether the asset is currently supported for RFQ trading.

| Symbol | Underlying Asset | Quoted Currency | RFQ Price Precision | RFQ Quantity Precision | RFQ Min Trade Notional | RFQ Max Trade Notional |
| --- | --- | --- | --- | --- | --- | --- |
| AAVE.ETH/USD | AAVE.ETH | USD | 16 | 18 | 0.02 | 500,000.00 |
| ADA/USD | ADA | USD | 16 | 6 | 0.02 | 500,000.00 |
| ALGO/USD | ALGO | USD | 16 | 6 | 0.02 | 500,000.00 |
| APE.ETH/USD | APE.ETH | USD | 16 | 18 | 0.02 | 500,000.00 |
| APT/USD | APT | USD | 8 | 8 | 0.02 | 500,000.00 |
| ARB.ARBITRUM/USD | ARB.ARBITRUM | USD | 16 | 18 | 0.02 | 500,000.00 |
| ATOM/USD | ATOM | USD | 16 | 6 | 0.02 | 500,000.00 |
| AVAX/USD | AVAX | USD | 16 | 18 | 0.02 | 500,000.00 |
| BAT.ETH/USD | BAT.ETH | USD | 16 | 18 | 0.02 | 500,000.00 |
| BCH/USD | BCH | USD | 16 | 8 | 0.02 | 500,000.00 |
| BNB/USD | BNB | USD | 16 | 18 | 0.02 | 500,000.00 |
| BONK.SOL/USD | BONK.SOL | USD | 16 | 5 | 0.02 | 500,000.00 |
| BTC/USD | BTC | USD | 6 | 8 | 0.02 | 500,000.00 |
| CC/USD | CC | USD | 16 | 10 | 0.02 | 500,000.00 |
| CELO/USD | CELO | USD | 16 | 18 | 0.02 | 500,000.00 |
| COMP.ETH/USD | COMP.ETH | USD | 16 | 18 | 0.02 | 500,000.00 |
| CRV.ETH/USD | CRV.ETH | USD | 16 | 18 | 0.02 | 500,000.00 |
| DAI.ETH/USD | DAI.ETH | USD | 16 | 18 | 0.02 | 500,000.00 |
| DOGE/USD | DOGE | USD | 16 | 8 | 0.02 | 500,000.00 |
| DOT/USD | DOT | USD | 16 | 10 | 0.02 | 500,000.00 |
| DOT.DOTHUB/USD | DOT.DOTHUB | USD | 16 | 10 | 0.02 | 500,000.00 |
| EGLD/USD | EGLD | USD | 16 | 18 | 0.02 | 500,000.00 |
| ENA.ETH/USD | ENA.ETH | USD | 16 | 18 | 0.02 | 500,000.00 |
| ETH.ARBITRUM/USD | ETH.ARBITRUM | USD | 2 | 18 | 0.02 | 500,000.00 |
| ETH.BASE/USD | ETH.BASE | USD | 16 | 18 | 0.02 | 500,000.00 |
| ETH.OPTIMISM/USD | ETH.OPTIMISM | USD | 2 | 18 | 0.02 | 500,000.00 |
| ETH.ZKSYNC/USD | ETH.ZKSYNC | USD | 16 | 18 | 0.02 | 500,000.00 |
| ETH/USD | ETH | USD | 16 | 18 | 0.02 | 500,000.00 |
| EURC.ETH/EUR | EURC.ETH | EUR | 2 | 6 | 0.01 | 500,000.00 |
| EURC.XLM/EUR | EURC.XLM | EUR | 16 | 6 | 0.01 | 5,000.00 |
| FIL/USD | FIL | USD | 16 | 18 | 0.02 | 500,000.00 |
| GALA.ETH/USD | GALA.ETH | USD | 16 | 8 | 0.02 | 500,000.00 |
| GRT.ETH/USD | GRT.ETH | USD | 16 | 18 | 0.02 | 500,000.00 |
| HBAR/USD | HBAR | USD | 16 | 8 | 0.02 | 500,000.00 |
| HYPE/USD | HYPE | USD | 16 | 18 | 0.02 | 500,000.00 |
| INJ.ETH/USD | INJ.ETH | USD | 16 | 18 | 0.02 | 500,000.00 |
| JTO.SOL/USD | JTO.SOL | USD | 16 | 9 | 0.02 | 500,000.00 |
| KNC.ETH/USD | KNC.ETH | USD | 16 | 18 | 0.02 | 500,000.00 |
| LDO.ETH/USD | LDO.ETH | USD | 16 | 18 | 0.02 | 500,000.00 |
| LINK.ETH/USD | LINK.ETH | USD | 2 | 18 | 0.02 | 500,000.00 |
| LTC/USD | LTC | USD | 16 | 8 | 0.02 | 500,000.00 |
| MANA.ETH/USD | MANA.ETH | USD | 16 | 18 | 0.02 | 500,000.00 |
| MATIC.ETH/USD | MATIC.ETH | USD | 16 | 18 | 0.02 | 500,000.00 |
| MATIC.POLYGON/USD | MATIC.POLYGON | USD | 16 | 18 | 0.02 | 500,000.00 |
| MKR.ETH/USD | MKR.ETH | USD | 16 | 18 | 0.02 | 500,000.00 |
| MON/USD | MON | USD | 16 | 18 | 0.02 | 500,000.00 |
| MORPHO.ETH/USD | MORPHO.ETH | USD | 16 | 18 | 0.02 | 500,000.00 |
| NEAR/USD | NEAR | USD | 16 | 24 | 0.02 | 500,000.00 |
| ONDO.ETH | ONDO.ETH | USD | 16 | 18 | 0.02 | 500,000.00 |
| OP.OPTIMISM/USD | OP.OPTIMISM | USD | 16 | 18 | 0.02 | 500,000.00 |
| PAXG.ETH/USD | PAXG.ETH | USD | 16 | 18 | 0.02 | 500,000.00 |
| PEPE.ETH/USD | PEPE.ETH | USD | 16 | 18 | 0.02 | 500,000.00 |
| PENGU.SOL/USD | PENGU.SOL | USD | 16 | 6 | 0.02 | 500,000.00 |
| PNUT.SOL/USD | PNUT.SOL | USD | 16 | 6 | 0.02 | 500,000.00 |
| PUMP.SOL/USD | PUMP.SOL | USD | 16 | 6 | 0.02 | 500,000.00 |
| PYTH.SOL/USD | PYTH.SOL | USD | 16 | 6 | 0.02 | 500,000.00 |
| PYUSD.ETH/USD | PYUSD.ETH | USD | 2 | 6 | 0.01 | 500,000.00 |
| PYUSD.SOL/USD | PYUSD.SOL | USD | 2 | 6 | 0.01 | 500,000.00 |
| RLUSD.ETH/USD | RLUSD.ETH | USD | 2 | 18 | 0.01 | 500,000.00 |
| RLUSD.XRP/USD | RLUSD.XRP | USD | 2 | 6 | 0.01 | 500,000.00 |
| SAND.ETH/USD | SAND.ETH | USD | 16 | 18 | 0.02 | 500,000.00 |
| SEI/USD | SEI | USD | 16 | 18 | 0.02 | 500,000.00 |
| SHIB.ETH/USD | SHIB.ETH | USD | 16 | 18 | 0.02 | 500,000.00 |
| SOL/USD | SOL | USD | 16 | 9 | 0.02 | 500,000.00 |
| SUI/USD | SUI | USD | 16 | 9 | 0.02 | 500,000.00 |
| TIA/USD | TIA | USD | 16 | 6 | 0.02 | 500,000.00 |
| GRAM/USD | GRAM | USD | 16 | 9 | 0.02 | 500,000.00 |
| TRUMP.SOL/USD | TRUMP.SOL | USD | 16 | 6 | 0.02 | 500,000.00 |
| TRX/USD | TRX | USD | 16 | 6 | 0.02 | 500,000.00 |
| UNI.ETH/USD | UNI.ETH | USD | 16 | 18 | 0.02 | 500,000.00 |
| USDC.ALGO/USD | USDC.ALGO | USD | 2 | 6 | 0.01 | 500,000.00 |
| USDC.APT/USD | USDC.APT | USD | 2 | 6 | 0.01 | 500,000.00 |
| USDC.ARBITRUM/USD | USDC.ARBITRUM | USD | 2 | 6 | 0.01 | 500,000.00 |
| USDC.AVAX/USD | USDC.AVAX | USD | 2 | 6 | 0.01 | 500,000.00 |
| USDC.BASE/USD | USDC.BASE | USD | 2 | 6 | 0.01 | 500,000.00 |
| USDC.BSC/USD | USDC.BSC | USD | 2 | 18 | 0.01 | 500,000.00 |
| USDC.CELO/USD | USDC.CELO | USD | 2 | 6 | 0.01 | 500,000.00 |
| USDC.DOTHUB/USD | USDC.DOTHUB | USD | 2 | 6 | 0.01 | 500,000.00 |
| USDC.ETH/USD | USDC.ETH | USD | 2 | 6 | 0.01 | 500,000.00 |
| USDC.HBAR/USD | USDC.HBAR | USD | 2 | 6 | 0.01 | 500,000.00 |
| USDC.HYPE/USD | USDC.HYPE | USD | 2 | 6 | 0.01 | 500,000.00 |
| USDC.MONAD/USD | USDC.MONAD | USD | 2 | 6 | 0.01 | 500,000.00 |
| USDC.OPTIMISM/USD | USDC.OPTIMISM | USD | 2 | 6 | 0.01 | 500,000.00 |
| USDC.POLYGON/USD | USDC.POLYGON | USD | 2 | 6 | 0.01 | 500,000.00 |
| USDC.SOL/USD | USDC.SOL | USD | 2 | 6 | 0.01 | 500,000.00 |
| USDC.SUI/USD | USDC.SUI | USD | 2 | 6 | 0.01 | 500,000.00 |
| USDC.XLM/USD | USDC.XLM | USD | 2 | 7 | 0.01 | 500,000.00 |
| USDC.ZKSYNC/USD | USDC.ZKSYNC | USD | 2 | 6 | 0.01 | 500,000.00 |
| USDC.WORLDCHAIN/USD | USDC.WORLDCHAIN | USD | 2 | 6 | 0.01 | 500,000.00 |
| USDCX.CANTON/USD | USDCX.CANTON | USD | 2 | 6 | 0.01 | 500,000.00 |
| USDP.ETH/USD | USDP.ETH | USD | 2 | 18 | 0.01 | 500,000.00 |
| USDP.SOL/USD | USDP.SOL | USD | 2 | 6 | 0.01 | 500,000.00 |
| USDT.ARBITRUM/USD | USDT.ARBITRUM | USD | 16 | 6 | 0.02 | 500,000.00 |
| USDT.CELO/USD | USDT.CELO | USD | 16 | 6 | 0.02 | 500,000.00 |
| USDT.DOTHUB/USD | USDT.DOTHUB | USD | 16 | 6 | 0.02 | 500,000.00 |
| USDT.ETH/USD | USDT.ETH | USD | 16 | 6 | 0.02 | 500,000.00 |
| USDT.HYPE/USD | USDT.HYPE | USD | 16 | 6 | 0.02 | 500,000.00 |
| USDT.OPTIMISM/USD | USDT.OPTIMISM | USD | 16 | 6 | 0.02 | 500,000.00 |
| USDT.POLYGON/USD | USDT.POLYGON | USD | 16 | 6 | 0.02 | 500,000.00 |
| USDT.AVAX/USD | USDT.AVAX | USD | 16 | 6 | 0.02 | 500,000.00 |
| USDT.BSC/USD | USDT.BSC | USD | 16 | 18 | 0.02 | 500,000.00 |
| USDT.SOL/USD | USDT.SOL | USD | 16 | 6 | 0.02 | 500,000.00 |
| USDT.TRX/USD | USDT.TRX | USD | 16 | 6 | 0.02 | 500,000.00 |
| USDT.XPL/USD | USDT.XPL | USD | 16 | 6 | 0.02 | 500,000.00 |
| USD1.ETH/USD | USD1.ETH | USD | 2 | 18 | 0.02 | 500,000.00 |
| W.SOL/USD | W.SOL | USD | 16 | 6 | 0.02 | 500,000.00 |
| WBTC.ETH/USD | WBTC.ETH | USD | 16 | 8 | 0.02 | 500,000.00 |
| WIF.SOL/USD | WIF.SOL | USD | 16 | 6 | 0.02 | 500,000.00 |
| WLFI.ETH/USD | WLFI.ETH | USD | 16 | 18 | 0.02 | 500,000.00 |
| XLM/USD | XLM | USD | 16 | 7 | 0.02 | 500,000.00 |
| XPL/USD | XLP | USD | 16 | 18 | 0.02 | 500,000.00 |
| XRP/USD | XRP | USD | 16 | 6 | 0.02 | 500,000.00 |
| XTZ/USD | XTZ | USD | 16 | 6 | 0.02 | 500,000.00 |
| ZRX.ETH/USD | ZRX.ETH | USD | 16 | 18 | 0.02 | 500,000.00 |

# 

zerohash EEA Supported Instruments

| Symbol | Underlying Asset | Quoted Currency | RFQ Price Precision | RFQ Quantity Precision | Minimum<br>Order Size | Maximum<br>Order Size |
| --- | --- | --- | --- | --- | --- | --- |
| ADA/USD | ADA | USD | 16 | 6 | 0.02 | 500,000.00 |
| AVAX/USD | AVAX | USD | 16 | 18 | 0.02 | 500,000.00 |
| BCH/USD | BCH | USD | 16 | 8 | 0.02 | 500,000.00 |
| BTC/USD | BTC | USD | 6 | 8 | 0.02 | 500,000.00 |
| DOGE/USD | DOGE | USD | 16 | 8 | 0.02 | 500,000.00 |
| ETH/USD | ETH | USD | 16 | 18 | 0.02 | 500,000.00 |
| LTC/USD | LTC | USD | 16 | 8 | 0.02 | 500,000.00 |
| EURC.AVAX/EUR | EURC.AVAX | EUR | 2 | 6 | 0.01 | 5,000 |
| EURC.BASE/EUR | EURC.BASE | EUR | 2 | 6 | 0.01 | 5,000 |
| EURC.ETH/EUR | EURC.ETH | EUR | 2 | 6 | 0.01 | 5,000 |
| EURC.XLM/EUR | EURC.XLM | EUR | 2 | 6 | 0.01 | 5,000 |
| EURC.SOL/EUR | EURC.SOL | EUR | 2 | 6 | 0.01 | 5,000 |
| EURC.WORLDCHAIN/EUR | EURC.WORLDCHAIN | EUR | 2 | 6 | 0.01 | 5,000 |
| SOL/USD | SOL | USD | 16 | 9 | 0.02 | 500,000.00 |
| SUI/USD | SUI | USD | 16 | 9 | 0.02 | 500,000.00 |
| USDC.ETH/USD | USDC.ETH | USD | 2 | 6 | 0.01 | 500,000.00 |
| XRP/USD | XRP | USD | 16 | 6 | 0.02 | 500,000.00 |

## 

for Deposits and Withdrawals

- All fiat assets are supported for institutional deposits and withdrawals.
- zerohash does not support fiat deposits and withdrawals from retail end users.
- All crypto assets support withdrawals for retail end users.

## 

Smart Contracts

Smart Contracts are currently supported for:

- Avalanche C-Chain (**AVAX**)
- Ethereum Classic (**ETC**)
- Ethereum (**ETH**)
- Ethereum on Arbitrum (**ETH.ARBITRUM**)
- Ethereum on OP Mainnet (**ETH.OPTIMISM**)
- Polygon (**MATIC.POLYGON**) using ABI encoding.

## 

Rounding

If you are utilizing the zerohash API to calculate trade notional and settlement values, banker's rounding must be used on a per-trade basis.

- The zerohash settlement system will round each trade obligation and then sum at the end, vs. summing all trade obligations and then rounding the final value.
- Banker’s rounding is also known as _Round to Even_.

### 

Rules:

1. If the difference between the number and the nearest integer is **less than 0.5**, round to the nearest integer.
2. If the difference between the number and the nearest integer is **exactly 0.5**, look at the integer part of the number and round to the **nearest even integer**.

**Example:**

You submit a BTC/USD trade:

- Quantity: `10 BTC`
- Price: `$10,000.0008` per BTC

Initial calculation: 
10 × 10,000.0008 = 100,000.008 USD

USD payments are restricted to cents, so this is rounded to: 
$100,000.01

## 

Support for Participants in New York

- The **New York Department of Financial Services (NYDFS)** maintains a list of NYDFS pre-approved tokens for New York customers, the _Greenlist_.
- Although NYDFS categorizes asset support into:
 - Approved for Custody
 - Approved for Listing 
 zerohash **only supports assets that meet both criteria**.
- As a result, there may be assets available for one or the other according to NYDFS, which zerohash **will not** support for Participants in NY.
- All supported assets for NY are marked with **'Yes'** in the _Supported in NY_ column in the above table.
- More info: [dfs.ny.gov/virtual\_currency\_business](https://dfs.ny.gov/virtual_currency_business)

Updated 18 days ago

---

Did this page help you?

Yes

No

Copy Page