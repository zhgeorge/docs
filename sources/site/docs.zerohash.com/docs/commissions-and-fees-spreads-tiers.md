# Source: https://docs.zerohash.com/docs/commissions-and-fees-spreads-tiers

zerohash supports a variety of flexible commission configurations on its Central Limit Order Book (CLOB). These are designed to accommodate different platform models and customer tiers (e.g., `gold`, `silver`,`bronze`).

All commission configurations are set up by the zerohash team during your integration process and must be communicated clearly before going live. Commission parameters can be passed on new orders using FIX tag `<13>` as the commission type and `<12>` is the value of the commission being applied.

## 

Available Commission Structures

Below is a list of supported commission types:

### 

Standard Basis Points (bps)

- A percentage fee that is applied to the notional value of the trade.
- Fees can be configured per to apply various rates for the maker's and taker's of the trade.

### 

Minimum Notional

- A notional value defining the minimum collected on a trade if the standard bps cannot be collected.

#### 

**Maximum Percentage**

- Ensures that commissions on small notional trades do not exceed a specified percentage.
 - This feature is used to help protect customers from disproportionate fees on small orders.

### 

Maximum Notional

- A notional value defining the maximum value that is collected on a trade, regardless of size.

### 

Flat Fee

- A fixed fee value that will be charged per quantity on per trade.
- For example a flat fee of 20 USD will be charged for every 1 Ethereum.

## 

Commission Tiering

### 

`gold` , `silver` and `bronze` Account Structures

zerohash supports commission tiering to allow platforms to apply different commission models to different types of customers, such as institutional vs. retail users, by categorizing accounts as `gold`, `silver` and `bronze`.

These tiers determine how fees are charged, how market data is delivered, and how execution prices are displayed.

### 

Commission Tiers

Commission tiers are metadata assigned to a CLOB account that control how commission is applied.

| Tier | Description |
| --- | --- |
| `gold` | Typically used for institutional or high-volume customers.<br>Charged a transparent fee (e.g., 10 bps) separate from price. |
| `silver` | Typically used for high-volume customers. |
| `bronze` (default) | Typically used for retail or casual traders. |

Customer account tiers are applied during **CLOB account creation** and can be updated on demand via the API.

- [`POST /clob/accounts`](https://docs.zerohash.com/reference/post_clob-accounts)
- [`PATCH /clob/accounts`](https://docs.zerohash.com/reference/patch_clob-accounts)

JSON

```
{
  "participant_code": "CUST01",
  "prefunded": true,
  "account_label": "custom-account-label-1",
  "account_tier": ["gold"]
} 
```

> `gold` 
> No tier (i.e. `[]`) = `bronze`.

## 

Commission Configuration

The actual commission logic (standard bps, flat fee, caps, etc.) that your platform can implement are configured by the zerohash team based on your needs. Tiering simply determines which commission model a customer is subject to.

Tiers are assigned per account and can be changed over time using the API. For more information on [Account Commission Tiering, check out our guide.](https://docs.zerohash.com/docs/market-data-request-35v#market-data-by-account-tier).

## 

Commission Corrections

zerohash supports post-trade commission corrections for platforms. If a commission is adjusted after execution, platforms can submit updates via SFTP file drop, and we’ll handle:

- Updating the trade record.
- Adjusting ledger movements.
- Reflecting net settlement changes if needed.

Corrections can increase or decrease commissions, and are fully validated to ensure accuracy.

Updated about 1 month ago

---

### What’s Next

- [Funding Models](https://docs.zerohash.com/docs/funding-models)

Did this page help you?

Yes

No

Copy Page