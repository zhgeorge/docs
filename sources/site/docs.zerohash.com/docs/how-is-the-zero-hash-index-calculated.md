# Source: https://docs.zerohash.com/docs/how-is-the-zero-hash-index-calculated

zerohash calculates index values for a wide range of asset pairs. The official zerohash Daily Index value is the index value calculated and published at 4 pm Central Time, however, zerohash also calculates a continuous Real-time Index.

zerohash uses transaction data from a sample of top exchanges in its calculation. Those exchanges are Bitfinex, Bitstamp, Coinbase Pro, Gemini, HitBTC, Huobi Pro, itBit, Kraken and OKCoin.

For each exchange that has trading volume, we calculate the volume-weighted average price (VWAP) over the preceding hour. We then take the arithmetic mean of this value across all exchanges. If there is no trading activity on any exchange during this period, we will utilize the last calculated index value.

For more information on the Index price rounding precision, please refer to the asset precision, rounding section, and asset rounding precisions section found here.

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page