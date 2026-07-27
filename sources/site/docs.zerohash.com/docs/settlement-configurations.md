# Source: https://docs.zerohash.com/docs/settlement-configurations

ZeroHash supports configurable settlement processes tailored for both client platforms and liquidity providers, enabling flexible and reliable trade lifecycle management. Below is the default settlement configuration for each participant type.

## 

Client Platforms

### 

Initial Settlement Window

- Trades executed between 12:00:00 AM EST and 11:59:59 PM EST are grouped for settlement the next day.

### 

Final Settlement Time

- Settlement occurs at 12:00 PM EST the following day.
- On a net buy day, the platform must deliver the net amount to zerohash by this time.
- On a net sell day, zerohash wires the net proceeds to the platform by 12:00 PM EST.

### 

Weekend Trading

- Trades booked on Friday, Saturday, or Sunday are settled together on Monday at 12:00 PM EST.

## 

Liquidity Providers

### 

Initial Settlement Window

- Trades executed between 4:00 PM EST and 3:59:59 PM EST the following day are grouped into the same settlement cycle.

### 

Final Settlement Time

- Settlement occurs at 5:00 PM EST daily.
- Liquidity providers must deliver or receive the net amount by this time based on their net trading position.

### 

Weekend Trading

- Trades booked on Friday at 4:00 PM EST or later, Saturday, or Sunday are settled on Monday at 5:00 PM EST.

The above settlement configurations are our defaults, but can be customized to suit any clients specific needs such as changing the timing, settling on weekends, or pre-funding customer accounts directly to avoid daily settlements

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page