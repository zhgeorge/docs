# Source: https://docs.zerohash.com/docs/buysell

zerohash's Buy/Sell service gives Platforms a single integration point to offer digital asset trading to their Customers. Depending on your product and flow, you can execute trades through two models: a Central Limit Order Book (CLOB) for real-time, price and time priority matching, or Request For Quote (RFQ) for firm, quote-based execution.

Both models are backed by deep, aggregated liquidity from the top market makers in the industry, so you gain competitive pricing and reliable execution without maintaining multiple liquidity provider relationships or building matching and pricing infrastructure yourself.

## 

Accessing Buy/Sell

To connect to zerohash's Buy/Sell service, Platforms integrate to our APIs and choose the execution model that fits their flow:

- **CLOB:** Available over REST and FIX APIs. [Explore CLOB](https://docs.zerohash.com/docs/central-limit-order-book-3)
- **RFQ:** Available over our REST API, using a two-request flow (request a quote, then execute it). [Explore RFQ](https://docs.zerohash.com/docs/request-for-quote)

## 

Execution Models

- **CLOB (Central Limit Order Book):** Place limit or market orders into zerohash's order book, with real-time matching based on price and time priority. Best suited for trading platforms, advanced users, and high-volume flows that need order-book depth and granular control.
 - Best for: Trading platforms, advanced users, high-volume flows.
- **RFQ (Request For Quote):** Request a real-time quote and, if accepted within the quote window, execute at the quoted price. Best suited for retail applications and simple buy/sell flows that want fixed, transparent pricing and a lightweight integration.
 - Best for: Retail apps, simple buy/sell flows, fixed pricing.

## 

Use Cases

- **Neobanks:** Offer a simple buy/sell/hold crypto product to your customers.
- **Brokerages:** Enhance order execution and expand product offerings for retail investors and traders.
- **Roundups:** Allow customers to invest spare change into crypto as a passive investing strategy.
- **General Liquidity Purposes:** Buy and sell crypto for your own needs, rather than using a separate exchange.
- **High-Volume Trading Desks:** Facilitate large-scale transactions efficiently for institutional investors and hedge funds.

## 

Key Features

- **Two Execution Models:** Choose CLOB, RFQ, or both to match each product flow, from retail buy/sell to high-volume trading.
- **Deep, Aggregated Liquidity:** zerohash manages liquidity provider relationships so you don't have to, integrating with some of the biggest LPs in the market to ensure quality pricing.
- **Transparent Pricing:** Firm, upfront pricing on RFQ and real-time order-book pricing on CLOB
- **Redundancy:** Multiple liquidity providers reduce the risk of downtime or disruptions in trade execution.
- **Compliance:** Trade within a secure, regulated environment built on zerohash's licensing and industry best practices. For more information, check out our policies & disclosures.

Updated 12 days ago

---

Did this page help you?

Yes

No

Copy Page