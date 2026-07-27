# Source: https://docs.zerohash.com/docs/market-data-clob

zerohash provides real-time order book visibility through two connectivity options:

1. **FIX5.0SP2 (Preferred) :** Industry standard protocol with full depth of book, order-level granularity, and efficient incremental updates.
2. **REST API Stream :** Simplified data delivery, suitable for basic integrations but without full FIX functionality.

FIX is the recommended option for trading systems and institutions that require full transparency and reliable synchronization of market state.

## 

Market Data Schema (MBO)

zerohash uses a Market By Order (MBO) schema for its Central Limit Order Book (CLOB).

- MBO shows every individual order in the book, including its price, size, and queue position.
- This differs from Market By Price (MBP), which aggregates orders into price levels and caps depth to 10 levels.

Why MBO?

- Provides full transparency and queue position tracking.
- Supports stateful order book management.
- Allows strategies requiring precise order-level insight (e.g., order book modeling, execution algorithms).

### 

Queue Position Logic

- Orders are matched based on price/time priority.
- MDEntryTime `<273>`) tracks when an order entered the book.
- Increasing an order’s size resets its queue position.
- Reducing an order’s size preserves its position.

## 

Connecting to Market Data (FIX)

### 

Step 1) Market Data Request (MsgType = V)

Clients initiate subscriptions by sending a Market Data Request.

- The request specifies the instrument(s) (e.g., BTC/USD).
- Subscription type should be Snapshot + Updates (263=1).

### 

Step 2) Initial Snapshot (MsgType = W)

- zerohash responds with a full snapshot of the current order book.
- Each order in the book is included, with fields such as:
 - `<269>` **MDEntryType** (`0 = BID`, `1 = OFFER`)
 - `<270>` **MDEntryPx** (price)
 - `<271>` **MDEntrySize** (quantity)
 - `<273>` **MDEntryTime** (queue time)
 - `<37>` **OrderID** (unique order reference)
 - `<278>` **MDEntryID** (market data entry ID)
- This snapshot represents the state of the book at subscription time.

### 

Step 3) Incremental Updates (MsgType = X)

- After the snapshot of the order book, Platforms receive incremental updates reflecting changes in real time.
- Updates are sent at the order level.
- Actions are described by `<279>` **MDUpdateAction**:
 - `0 = NEW` (order added)
 - `1 = CHANGE` (order modified)
 - `2 = DELETE` (order canceled/filled)

Clients must apply these changes to keep their local order book in sync.

## 

Sample Subscription Messages

- `<35 = W>` _**(Initial Snapshot)**_

```
8=FIXT.1.1|9=1596|35=W|34=2|49=ZERO|52=20230830-21:55:08.165519757|56=C-LPBD-3|22=8|48=BTC/USD|55=BTC/USD|167=FXSPOT|262=2f86194cd13911eca862cedcff009123|1151=BTC|268=12|269=0|270=29748.20|271=0.09284077|272=20230830|273=21:54:00.842849199|59=1|37=1EW5CHK1SFCFX|278=1EW5CHK1SFCFX|40=2|269=0|270=29748.20|271=0.01000000|272=20230830|273=21:54:00.842849199|59=6|126=20230830-22:10:36.714000000|37=1F1KJ21XSBR05|278=1F1KJ21XSBR05|40=2|269=0|270=29748.20|271=0.01000000|272=20230830|273=21:54:00.842849199|59=6|126=20230830-22:10:39.481000000|37=1F1KJ1H9C2808|278=1F1KJ1H9C2808|40=2|269=0|270=29730.33|271=0.20988663|272=20230830|273=21:54:00.842849199|59=1|37=1EW5CGN025M09|278=1EW5CGN025M09|40=2|269=0|270=29715.44|271=0.31482995|272=20230830|273=21:54:00.842849199|59=1|37=1EW5CG5JRV009|278=1EW5CG5JRV009|40=2|269=0|270=29707.75|271=0.00020000|272=20230830|273=21:54:00.842849199|59=1|37=1F0MCCGSHZG01|278=1F0MCCGSHZG01|40=2|269=0|270=29707.75|271=0.00020000|272=20230830|273=21:54:00.842849199|59=1|37=1F0MCCGSHZG02|278=1F0MCCGSHZG02|40=2|269=0|270=29697.57|271=0.41977326|272=20230830|273=21:54:00.842849199|59=1|37=1EW5CGN025M0B|278=1EW5CGN025M0B|40=2|269=1|270=29807.75|271=0.07274331|272=20230830|273=21:54:00.842849199|59=1|37=1EW5CGN025M08|278=1EW5CGN025M08|40=2|269=1|270=29825.62|271=0.20988663|272=20230830|273=21:54:00.842849199|59=1|37=1EW5CH4RSWC08|278=1EW5CH4RSWC08|40=2|269=1|270=29840.51|271=0.31482995|272=20230830|273=21:54:00.842849199|59=1|37=1EW5CGN025M0A|278=1EW5CGN025M0A|40=2|269=1|270=29858.38|271=0.41977326|272=20230830|273=21:54:00.842849199|59=1|37=1EW5CH4RSWC09|278=1EW5CH4RSWC09|40=2|10=015|
```

- `<35 = X>` _**(Order Added)**_

```
8=FIXT.1.1|9=304|35=X|34=3|49=ZERO|52=20230830-21:55:36.159922156|56=C-LPBD-3|262=2f86194cd13911eca862cedcff009123|268=1|279=0|269=0|278=1F1KJ2FK1HC07|55=BTC/USD|48=BTC/USD|22=8|167=FXSPOT|1151=BTC|270=29748.20|271=0.01000000|272=20230830|273=21:55:36.133065599|59=6|126=20230830-22:12:15.436000000|37=1F1KJ2FK1HC07|40=2|10=042|
```

- `<35 = X>` **_(Order Added at same price and quantity)_**

FIX

```
8=FIXT.1.1|9=304|35=X|34=4|49=ZERO|52=20230830-21:55:37.613240773|56=C-LPBD-3|262=2f86194cd13911eca862cedcff009123|268=1|279=0|269=0|278=1F1KJ1H9C2809|55=BTC/USD|48=BTC/USD|22=8|167=FXSPOT|1151=BTC|270=29748.20|271=0.01000000|272=20230830|273=21:55:37.603684164|59=6|126=20230830-22:12:17.022000000|37=1F1KJ1H9C2809|40=2|10=224|
```

- `<35 = X>` **_(Order Canceled)_**

FIX

```
8=FIXT.1.1|9=305|35=X|34=11|49=ZERO|52=20230830-22:02:05.737179657|56=C-LPBD-3|262=2f86194cd13911eca862cedcff009123|268=1|279=2|269=0|278=1F1KJ21XSBR05|55=BTC/USD|48=BTC/USD|22=8|167=FXSPOT|1151=BTC|270=29748.20|271=0.00000000|272=20230830|273=22:02:05.697407011|59=6|126=20230830-22:10:36.714000000|37=1F1KJ21XSBR05|40=2|10=141|
```

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page