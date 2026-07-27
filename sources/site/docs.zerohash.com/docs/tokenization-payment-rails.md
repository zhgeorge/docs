# Source: https://docs.zerohash.com/docs/tokenization-payment-rails

## 

Introduction

**Our Tokenization Payment Rails product is seamless and secure, enabling tokenization platforms (i.e. tokenized asset issuers) to accept stablecoins from investors as a funding mechanism for their investment**. Our product facilitates the end-to-end flow of stablecoin funding: from generating investor-specific deposit addresses to converting stablecoins into fiat and settling funds directly to the issuer’s account. Designed for enterprise-grade volumes, our platform supports trades in the hundreds of millions, while maintaining full compliance through on-chain transaction monitoring and robust liquidity management.

By combining the speed of blockchain with the reliability of the world’s leading bank transfer networks, our Tokenization Payment Rails seamlessly bridge digital assets and traditional finance - enabling fast, compliant, and scalable investment flows.

## 

Definitions

| Term | Definition |
| --- | --- |
| Tokenized Asset | The asset that is tokenized (ie, tokenized money market Funds such as BUIDL or BENJI) |
| On ramp | Conversion of fiat to stablecoins. Contextual to an Investor looking to move out of their tokenized asset position **into** stablecoins<br>Tokenized asset → fiat → stablecoins |
| Off ramp | The reverse of On ramp, where the Investor is going from stablecoins **into** fiat, then ultimately into a tokenized asset position<br>Stablecoins → fiat → tokenized asset |
| Platform | The company that's in contract with zerohash and directly interacts with zerohash's APIs or SDKs<br>This is typically the **Issuer** of the tokenized asset |
| Investor | The non-natural or natural person who is making the investment and the owner of the funds for the stablecoins, fiat and tokenized asset |

## 

High Level Flow

1. Onboard Investor
2. Query Investor(s)
3. Off ramp (bundled movements)
 1. Generate Deposit Address and Quote
 2. Deposit and Conversion
 3. Settlement Timing
 4. Fiat Withdraw
 5. Query Movements
4. Off ramp (bespoke)
 1. Generate Deposit Address
 2. Deposit
 3. Stablecoin to Fiat Conversion
 4. Settlement Timing
 5. Fiat Withdraw
 6. Query Movements
5. On ramp
 1. Fiat Deposit
 2. Get Quote
 3. Fiat to Stablecoin Conversion
 4. Settlement Timing
 5. Stablecoin Withdraw

## 

Initial Setup

The Platform will need to onboard its business to the zerohash platform. They then need to add additional users, create API keys, and whitelist IP addresses. See instructions [here](https://docs.zerohash.com/docs/getting-started).

## 

1\. Onboard Investor

### 

Non-Natural Person (i.e. a Business)

If the Investor is a business, you'll submit them via the [POST /participants/entity/new](https://docs.zerohash.com/reference/post_participants-entity-new) endpoint:

JSON

```
{
    "platform_code": "PLAT01",
    "entity_name": "Tokenized Fund Investor XYZ",
    "legal_name": "Tokenized Fund Investor XYZ Inc.",
    "contact_number": "15553765432",
    "website": "www.tokenizedfundinvestor.com",
    "date_established": "2018-01-15",
    "entity_type": "llc",
    "address_one": "1 Main St.",
    "address_two": "Suite 1000",
    "city": "Chicago",
    "postal_code": "12345",
    "jurisdiction_code": "US-IL",
    "tax_id": "883987654",
    "id_issuing_authority": "United States",
    "risk_rating": "low",
    "risk_vendor": "passbase",
    "sanction_screening": "pass",
    "sanction_screening_timestamp":1677252628000,
    "metadata":{},
    "signed_timestamp":1677252629000,
    "submitter_email": "josh_doe@gmail.com",
    "submitter_first_name": "Josh" 
    "submitter_last_name": "Doe"
    "submitter_title": "Senior Legal Council"
    "control_persons":[
      {
        "name": "Joe Doe",
        "email": "joe.doe@test.com",
        "address_one": "1 South St.",
        "address_two": "Suite 2000",
        "city": "Chicago",
        "postal_code": "12345",
        "jurisdiction_code": "US-IL",
        "date_of_birth": "1980-01-30",  
        "citizenship_code": "US", 
        "tax_id": "123456789",
        "id_number_type": "us_passport",
        "id_number": "332211200",
        "kyc": "pass",
        "kyc_timestamp": 1630623005000,
        "sanction_screening":"pass",
        "sanction_screening_timestamp":1677252628000,
        "control_person": 1
      }
    ],
    "beneficial_owners":[
      {
        "name": "Jane Doe Jr",
        "beneficial_owner":1,
        "email": "janedoejr@test.com",
        "address_one": "1 North St.",
        "address_two": "Suite 3000",
        "city": "Chicago",
        "postal_code": "12345",
        "jurisdiction_code": "US-IL",
        "date_of_birth": "1980-01-30",
        "citizenship_code": "US", 
        "tax_id": "012345578",
        "id_number_type": "us_drivers_license",
        "id_number": "P11122243333",
        "kyc": "pass",
        "kyc_timestamp": 1630623005000,
        "sanction_screening": "pass",
        "sanction_screening_timestamp":1677252628000
      }
    ]
}
```

You’ll receive a `participant_code` in the response - this is the Investor participant code that uniquely identifies the entity indefinitely. We’ll use INVST1 as the `participant_code` throughout the examples.

See response for expected shape.

You must submit at least 1 `beneficial_owners` and 1 `control_persons`. If these persons do not have an SSN, the Platform must submit a document via [POST /participants/entity/documents](https://docs.zerohash.com/reference/post_participants-entity-documents).

### 

Natural Person (i.e. a Human)

If the Investor is a human, you'll submit them via the [POST /participants/customers/new](https://docs.zerohash.com/reference/post_participants-customers-new) endpoint:

JSON

```
{
    "first_name": "John",
    "last_name": "Smith",
    "email": "jsmith@gmail.com",
    "phone_number": "+12345834789",
    "date_of_birth": "1985-09-02",
    "ip_address": "999.168.252.199",
    "address_one": "1 Main St.",
    "address_two": "Suite 1000",
    "city": "Chicago",
    "zip": "12345",
    "jurisdiction_code": "US-IL",
    "partial": true,
    "sanction_screening": "pass",
    "sanction_screening_timestamp": 1603378501282,
    "signed_agreements": [{
        "type": "user_agreement",
        "region": "us",
        "signed_timestamp": 1603378501286
    }],
}
```

Same thing applies here - you'll receive a `participant_code` in the response - this is the Investor participant code that uniquely identifies the individual indefinitely. We’ll use INVST2 as the `participant_code` throughout the examples.

## 

2\. Query Investor

You can query Investor information details such as the `participant_code` via the [GET /participants](https://docs.zerohash.com/reference/get_participants) endpoint

> 📘
> 
> ### 
> 
> For the Off ramp, you have 2 options.
> 
> **Option 1 - bundled movements:** Less API calls, quicker integration and more automation on your behalf. The default offering.
> 
> **Option 2 - bespoke:** Less out-of-the box, more customization and control over the conversion and transfer of fiat. You must be approved to use this option - contact your zerohash rep.

## 

3\. Off ramp (bundled movements)

### 

3i. General Deposit Address and Quote

Generate a deposit address and a Quote via the [POST /fund/rfq](https://docs.zerohash.com/reference/post_fund-rfq) endpoint:

JSON

```
{
    "participant_code": "INVST1",
    "asset": "USDC.SOL"
}
```

Alternative request: Attach an `account_label` to this deposit address, which will travel with any subsequent movements associated with this deposit address. Helpful for segregating movement for various fund issuers. Example:

JSON

```
{
    "participant_code": "INVST1",
    "asset": "USDC.SOL",
    "account_label": "tokenized_fund_a"
}
```

zerohash will respond (example without an `account_label` specified):

JSON

```
{
  "message": {
    "request_id": "14f8ebb8-7530-4aa4-bef9-9d73d56313f3",
    "participant_code": "INVST1",  
    "fund_asset": "USDC.SOL",  
    "rate": "1",
    "quoted_currency": "USD",
    "expiry_timestamp": 2554408627334,
    "deposit_address": "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
    "minimum_deposit": "",
    "maximum_deposit": ""
  }
}
```

### 

3ii. Deposit and Conversion

You should present the `deposit_address` and other relevant details such as the rate, asset and network to the Investor. Once they complete the deposit, zerohash will:

- Automatically converted the asset to USD in the Investor's account
- \[if configured. contact your zerohash rep if you'd like it configured this way\] Automatically transfer into your platform [account](https://docs.zerohash.com/docs/what-is-an-account):
 - `participant_code`: \[your participant\_code\]
 - `account_group`: \[your participant\_code\]
 - `account_label`: general
 - `asset`: USD
 - `account_type`: available

### 

3iii. Settlement Timing

For any conversions **equal to or below $500,000**, the trades will settle instantly. For conversion above that threshold, settlements will settle within 24 hours.

### 

3iv. Fiat Withdraw

When the trade is settled, you can initiate a withdraw of the USD to your preferred bank account.

**The first step is** is to whitelist your bank account via the Client Portal. [Cert URL](https://docs.zerohash.com/docs/portal.cert.zerohash.com) / [Prod URL](https://docs.zerohash.com/docs/portal.zerohash.com).

> 🚧
> 
> ### 
> 
> Note that wires cutoffs range from 4 - 6 pm ET, depending on the bank the zerohash uses to settle with you. If your company has an account that allows for inter-bank transfers, fiat settlements can be made 24/7/365.

### 

3v. Query Movements

You can query the the trade details via the [GET /trades/{trade\_id}](https://docs.zerohash.com/reference/get_trades-trade-id) endpoint. You can also query deposit details via the [GET /deposits](https://docs.zerohash.com/reference/get_deposits) endpoint.

> 📘
> 
> ### 
> 
> This marks the end of the journey for allowing an Investor to use stablecoins as the payment method to enter into a tokenized asset position

## 

4\. Off ramp (bespoke)

### 

4i. Generate Deposit Address

Generate a deposit address via the [POST /deposits/digital\_asset\_addresses](https://docs.zerohash.com/reference/post_deposits-digital-asset-addresses) endpoint:

JSON

```
{
    "participant_code": "INVST1",
    "asset": "USDC.SOL"
}
```

zerohash will respond with an address is the perpetually associated with the Investor and will not change:

JSON

```
{
  "message": {
    "created_at": 1590663417000,
    "address": "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
    "participant_code": "INVST1",
    "asset": "USDC.SOL"
  }
}
```

You should display this address on your front end so that the Investor knows where to send funds.

### 

4ii. Deposit

When presenting the deposit instructions to the Investor, you'll want to also show the conversion details. For example, if you deposit X USDC it will lead to Y USD.

Typically, Issuers will **charge a spread** for this conversion (ie, 10 basis points). If you charge a static spread for each tokenized asset, simple enough - zerohash will configure a static spread that will be applied to all quote requests automatically. If each tokenized assets are not priced identically, you can use our **Custom Spread** feature, allowing you to define the spread on a per order basis.

Start by getting a quote via the [POST /liquidity/rfq](https://docs.zerohash.com/reference/post_liquidity-rfq) endpoint (using a Custom Spread):

JSON

```
{
    "participant_code": "INVST1",
    "side": "sell",
    "underlying": "USDC.SOL",
    "quoted_currency": "USD",
    "quantity":"100000", // how much USDC the investor wishes to deposit
    "spread":"5", // 5 basis points spread       
}
```

zerohash will respond:

JSON

```
{
  "request_id": "ce819fe8-b1d7-43bb-961c-e09ede0988d3",
  "participant_code": "PLAT01", // platform participant code
  "quoted_currency": "USD",
  "side": "sell",
  "quantity": "100000",
  "price": ".999", // 10 bps applied in total between the spread and issuer fee
  "quote_id": "32ad471b-824e-4f04-94ff-45c4439b4fe9",
  "expire_ts": 1568311649602,
  "account_group": "PLAT01",
  "account_label": "general",
  "obo_participant": {
    "participant_code": "INVST1",
    "account_group": "PLAT01",
    "account_label": "general"
  },
  "total_notional": "1000000",
  "underlying": "USDC.SOL",
  "asset_cost_notional": "99900.00",
  "spread_notional": "50",
  "spread_bps": "5",
  "settlement_type": "STANDARD",
  "issuer_fee_payor_type": "CUSTOMER",
  "issuer_fee_rate": "5",
  "issuer_fee_amount": "50"
}
```

**NOTE**: Depending on the asset and asset side (buy/sell) for the transaction, zerohash will pass along the fee that the stablecoin issuer charges zerohash (see `issuer_fee` fields above and issuer fee schedule [here](https://docs.zerohash.com/docs/issuer-fees))

**At this point**, the Investor has all information required to make a deposit.

### 

4iii. Stablecoin to Fiat Conversion

Once the Investor has deposited, you have the option of creating a user experience that does 1 of two things:

1. Automatically sells the USDC for USD
2. Present the Investor once again with the quote details

Option 2 can only be employed for static 1-1 stablecoins since the rates will not change. For all other assets, you must present the quote to the Investor so that the details of the transactions are completely disclosed

Regardless, you'll initiate another quote by calling the [POST /liquidity/rfq](https://docs.zerohash.com/reference/post_liquidity-rfq) endpoint. From the response, grab the `quote_id` and then plug it into the [POST /liquidity/execute](https://docs.zerohash.com/reference/post_liquidity-execute) endpoint:

```
{ 
   "quote_id": "89ad471b-824e-4f04-94ff-45c4439b4Ru9"
}
```

Response:

```
{
    "request_id": "006c3b73-f06b-4002-8a4d-511cb0528443",
    "quote": {
        "request_id": "f2a841c1-4ef4-46e2-a0d6-4dac637df54b",
        "participant_code": "PLAT01",
        "quoted_currency": "USD",
        "side": "sell",
        "quantity": "100000",
        "price": ".999",
        "quote_id": "89ad471b-824e-4f04-94ff-45c4439b4Ru9",
        "expire_ts": 1733239888234,
        "account_group": "PLAT01",
        "account_label": "general",
        "obo_participant": {
            "participant_code": "INVST1",
            "account_group": "PLAT01",
            "account_label": "general"
        },
        "total_notional": "100000",
        "settlement_type": null,
        "issuer_fee_rate": null,
        "issuer_fee_amount": null,
        "issuer_fee_payor_type": null,
        "underlying": "USDC.SOL",
        "asset_cost_notional": "99900.00",
        "spread_notional": "50",
        "spread_bps": "5",
        "transaction_timestamp": 173323988
        "settlement_type": "STANDARD",
        "issuer_fee_payor_type": "CUSTOMER",
        "issuer_fee_rate": "5",
        "issuer_fee_amount": "50"
    },
    "trade_id": "2531e08e-b40b-40a7-b555-55261e518310",
    "status": "Completed",
    "trade_ids_list": [
        "2531e08e-b40b-40a7-b555-55261e518310"
    ]
}
```

### 

4iv. Settlement Timing

For any conversions **equal to or below $500,000**, the trades will settle instantly. For conversion above that threshold, settlements will settle within 24 hours.

### 

4v. Fiat Withdraw

When the trade is settled, you can initiate a withdraw of the USD to your preferred bank account.

**The first step is** is to whitelist your bank account via the Client Portal. [Cert URL](https://docs.zerohash.com/docs/portal.cert.zerohash.com) / [Prod URL](https://docs.zerohash.com/docs/portal.zerohash.com).

> 🚧
> 
> ### 
> 
> Note that wires cutoffs range from 4 - 6 pm ET, depending on the bank the zerohash uses to settle with you. If your company has an account that allows for inter-bank transfers, fiat settlements can be made 24/7/365.

### 

4vi. Query Movements

You can query the the trade details via the [GET /trades/{trade\_id}](https://docs.zerohash.com/reference/get_trades-trade-id) endpoint. You can also query deposit details via the [GET /deposits](https://docs.zerohash.com/reference/get_deposits) endpoint.

> 📘
> 
> ### 
> 
> This marks the end of the journey for allowing an Investor to use stablecoins as the payment method to enter into a tokenized asset position

## 

5\. On ramp

### 

5i. Fiat Deposit

To allow your Investors to exist their tokenized asset position and back into stablecoins, you first need to facilitate a USD withdraw from the Investor's account within your ecosystem, into their account at zerohash. You will send the USD to the bank account details provided to you, and **specify a wire memo equal to the Investor's zerohash `participant_code`**. This will automatically credit their USD balance at zerohash.

**For this account to be credited automatically upon receipt into our bank account,** you must tag the wire memo in this format: \[Platform participant code\] (ie, `INVST1`).

### 

5ii. Get Quote

Similar to step 5. Off ramp - Get Quote, you'll get a quote via the [POST /liquidity/rfq](https://docs.zerohash.com/reference/post_liquidity-rfq) endpoint. Example:

JSON

```
{
    "participant_code": "INVST1",
    "side": "buy",
    "underlying": "USDC.SOL",
    "quoted_currency": "USD",
    "total":"100000", // how much USD the investor wishes to deposit
    "spread":"5", // 5 basis points spread       
}
```

zerohash will respond:

JSON

```
{
  "request_id": "ce819fe8-b1d7-43bb-961c-e09ede0988d3",
  "participant_code": "PLAT01", // platform participant code
  "quoted_currency": "USD",
  "side": "buy",
  "quantity": "100000",
  "price": ".9995", // 5 bps applied
  "quote_id": "76ad471b-824e-4f04-94ff-45c4439b4re1",
  "expire_ts": 1568311649602,
  "account_group": "PLAT01",
  "account_label": "general",
  "obo_participant": {
    "participant_code": "INVST1",
    "account_group": "PLAT01",
    "account_label": "general"
  },
  "total_notional": "1000000",
  "underlying": "USDC.SOL",
  "asset_cost_notional": "99950.00",
  "spread_notional": "50",
  "spread_bps": "5",
  "settlement_type": "STANDARD",
  "issuer_fee_payor_type": "CUSTOMER",
  "issuer_fee_rate": "",
  "issuer_fee_amount": ""
}
```

## 

5iii. Fiat to Stablecoin Conversion

Once you'd like to make the conversion, initiate a quote execution using the same endpoint as step 6: [POST /liquidity/execute](https://docs.zerohash.com/reference/post_liquidity-execute). Example request:

JSON

```
{ 
   "quote_id": "76ad471b-824e-4f04-94ff-45c4439b4re1"
}
```

Example Response:

```
{
    "request_id": "006c3b73-f06b-4002-8a4d-511cb0528443",
    "quote": {
        "request_id": "f2a841c1-4ef4-46e2-a0d6-4dac637df54b",
        "participant_code": "PLAT01",
        "quoted_currency": "USD",
        "side": "sell",
        "quantity": "100000",
        "price": ".9995",
        "quote_id": "76ad471b-824e-4f04-94ff-45c4439b4re1",
        "expire_ts": 1733239888234,
        "account_group": "PLAT01",
        "account_label": "general",
        "obo_participant": {
            "participant_code": "INVST1",
            "account_group": "PLAT01",
            "account_label": "general"
        },
        "total_notional": "100000",
        "settlement_type": null,
        "issuer_fee_rate": null,
        "issuer_fee_amount": null,
        "issuer_fee_payor_type": null,
        "underlying": "USDC.SOL",
        "asset_cost_notional": "99950.00",
        "spread_notional": "50",
        "spread_bps": "5",
        "transaction_timestamp": 173323988
        "settlement_type": "STANDARD",
        "issuer_fee_payor_type": "CUSTOMER",
        "issuer_fee_rate": "",
        "issuer_fee_amount": ""
    },
    "trade_id": "3231e08e-b40b-40a7-b555-55261e518317",
    "status": "Completed",
    "trade_ids_list": [
        "2531e08e-b40b-40a7-b555-55261e518310"
    ]
}
```

## 

5iv. Settlement Timing

Off ramp settlement timing is identical to On ramp as it relates to trade settlement. Reposting:

For any conversions **equal to or below $500,000**, the trades will settle instantly. For conversion above that threshold, settlements will no more than **2 hours** to settle.

## 

5v. Stablecoin Withdraw

When you're ready to send the stablecoin out to the investor wallet, you'll use the [POST /withdrawals/requests](https://docs.zerohash.com/reference/post_withdrawals-requests) endpoint. Example request:

JSON

```
{ 
   "address":"3zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDR", // Investor's address 
   "participant_code":"INVST1",
   "amount":"99950",
   "asset":"USDC.SOL",
   "account_group":"PLAT01",
}
```

Network fee options - you can choose to pass the network fee associated with the withdraw onto the Investor or incur the fee yourselves. Talk to your zerohash rep so that they can make the proper configuration.

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page