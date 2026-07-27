# Source: https://docs.zerohash.com/docs/supported-orders

zerohash offers a variety of order types to support different trading strategies on our Central Limit Order Book (CLOB). Each order type supports both quantity-based and notional-based order entry, with varying Time in Force (TIF) options.

## 

Overview

Here is a table summarizing the supported order types, whether quantity and notional order entry is supported, and the available Time in Force (TIF) options for the Central Limit Order Book (CLOB):

| Order Type | Quantity Supported | Notional Supported | Supported TIFs (Time in Force) |
| --- | --- | --- | --- |
| Limit | Yes | Yes | GTC, FOK, IOC, DAY, GTT |
| Market-to-Limit | Yes | Yes | IOC, FOK, DAY, GTT |
| Stop | Yes | Yes | GTC, DAY, GTT |
| Stop Limit | Yes | Yes | GTC, DAY, GTT |

## 

Order Type Definitions

### 

Market-to-Limit Order

Executes immediately at the best available price. Any unfilled quantity becomes a limit order at the last executed price. Multiple fills at different prices are possible. Notional orders are supported for this order type only.

### 

Limit Order

A submitted limit order will execute when the price is matched. A limit order guarantees a price but does not guarantee an execution. It is possible to receive a partial fill on a limit order.

### 

Stop Order

Stop orders are triggered when the designated “stop” price is traded through. Unless a limit price is included (see Stop Limit below) a stop order becomes a market order when triggered.

### 

Stop Limit Order

A stop-limit order combines the features of a stop order and a limit order. Once a stop price is reached, the order becomes a limit order. Partial fills are possible with a stop-limit order.

## 

CLOB Supported Order Expiry Types (Time in Force)

These Time in Force parameters allow traders to manage their orders based on strategy and market conditions. By offering multiple TIF options, zerohash provides greater control and flexibility in order execution. Here are the TIFs we support and how they work:

### 

Good Till Canceled (GTC)

Orders with this Time in Force setting remain open and active until either executed or explicitly canceled by the client. GTC orders will persist even when the market is closed for maintenance (i.e. a GTC limit order can rest on the order book forever). Partially filled orders are allowed.

### 

Immediate or Cancel (IOC)

Orders are executed immediately and any portion of the order that cannot be filled immediately will be cancelled. Partially filled orders are allowed.

### 

Good Till Date/Time (GTD/GTT)

GTT orders specify the date and time at which an order is to be expired. Must be set in UTC time and datetime format. Partially filled orders are allowed.

### 

Fill or Kill (FOK)

FOK orders must be executed in its entirety immediately or it will be cancelled. Partially filled orders are not allowed.

### 

Day (DAY)

These TIF parameters allow traders to manage their orders according to their specific trading strategy and the market conditions. By offering multiple TIF options, zerohash provides our clients with greater control over their trades and more opportunities to achieve their desired outcomes.

> 📘
> 
> ### 
> 
> _Note : Day orders are cancelled daily at 4 PM EST, weekends included. Partially filled orders are allowed._

## 

Account Liquidation

Use `ExecInst (18)` to control special order behaviors:

- `18=6` — **Post Only** (Participate Don’t Initiate): order will _not_ take liquidity. If it would cross, it’s rejected or price-adjusted (per venue behavior ).
- `18=c` — **Ignore Price/Validity Checks** _(Liquidations only)_: allows execution that may be **below instrument minimums** (e.g., forced liquidation).

> Minimum order notional values are listed in the [**Supported Instruments**](https://docs.zerohash.com/docs/supported-instruments) table.

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page