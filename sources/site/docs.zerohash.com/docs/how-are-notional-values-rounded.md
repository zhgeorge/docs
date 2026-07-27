# Source: https://docs.zerohash.com/docs/how-are-notional-values-rounded

## 

Bankers Rounding

zerohash uses **bankers rounding** for calculating notional amounts for settlement. Bankers rounding must be used on a per trade basis. The zerohash settlement system will round each trade obligation and then sum at the end versus summing all trade obligations then rounding the final value. _Bankers rounding is also referred to as Round Half to Even._

- If the last number after the decimal ends in 5, round to the nearest even integer. 
 For example, for USD amounts which has a precision of 2 decimals:
 - 1.025 rounds down to 1.02
 - 1.035 rounds up to 1.04
- Otherwise round to the nearest integer

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page