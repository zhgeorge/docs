# Source: https://docs.zerohash.com/docs/awards-integration-guide

In this example, the Platform is awarding 5 select Customers for participating in a promotional campaign. Summary of all involved participants:

- Platform (participant\_code: PLAT01)
- End Customer (participant\_code: CUST01)

### 

Submit Customer

Example request - [POST /participants/customers/new](https://zerohash-group.readme.io/reference/post_participants-customers-new)

JSON

```
{
"first_name": "John",
"last_name": "Smith",
"email": "jsmith@example.com",
"phone_number": "9545551234",
"address_one": "1 Main St.",
"address_two": "Suite 1000",
"city": "Chicago",
"state": "IL",
"zip": "12345",
"country": "United States",
"date_of_birth": "1985-09-02",
"citizenship": "United States",
"tax_id": "123456789",
"risk_rating": "low",
"kyc": "pass",
"kyc_timestamp": 1630623005000,
"sanction_screening": "pass",
"sanction_screening_timestamp": 1630623005000,
"idv": "pass",
"liveness_check": "pass",
"signed_timestamp": 1630623005000,
"metadata": {}
 ]
}
```

### 

Fund USD Account

Platforms will need to a dedicated USD Award account. Account details:

| Field | Value |
| --- | --- |
| Participant | Zero Hash Liquidity Services (00SCXM) |
| Asset | USD |
| Account Type | available |
| Account Group | \[Platform Code\] |
| Account Label | awards |

### 

Fund Crypto Award Account

#### 

Example request - [POST /awards/fund](https://zerohash-group.readme.io/reference/post_awards-fund)

JSON

```
{
  "underlying": "BTC",
  "quoted_currency": "USD",
  "quantity": "1"
}
```

The Platform is instructing a market order of 5 BTC to be initially allocated to the Platform's account.

#### 

Example response -

JSON

```
{
  "request_id": "14f8ebb8-7530-4aa4-bef9-9d73d56313f3",
  "quote": {
    "request_id": "ce819fe8-b1d7-43bb-961c-e09ede0988d3",
    "participant_code": "CUST01",
    "underlying_currency": "BTC",
    "quoted_currency": "USD",
    "side": "BUY",
    "quantity": "1",
    "price": "65,500.10",
    "quote_id": "5cd07738b861c31e3bd61467BTC1Buy1568311644602",
    "expire_ts": 1568311649602,
    "transaction_timestamp": 1568311649600
  },
  "trade_id": "ba97133e-ab15-4c86-86c1-86671b8420bc",
  "status": "Completed"
}
```

### 

Distribute awards

Example request - [POST /awards/distribute](https://zerohash-group.readme.io/reference/post_awards-distribute)

JSON

```
{
  "underlying": "BTC",
  "quantity": "5",
  "participant_codes": {"CUST01", "CUST02", "CUST03", "CUST04", "CUST05"}
 ) 
```

Example response -

JSON

```
{
  "underlying": "BTC",
  "quantity": "1",
  "participant_codes":[ 
        {
        "participant_code": "CUST01",
        "trade_id": "ce819fe8-b1d7-43bb-961c-e09ede0988d3"
        },
        {
        "participant_code": "CUST02",
        "trade_id": "ba97133e-ab15-4c86-86c1-86671b8420bc"
        },
        {
        "participant_code": "CUST03",
        "trade_id": "ma97133e-ab15-4c86-86c1-86671b8420bc"
        },
        {
        "participant_code": "CUST04",
        "trade_id": "xa97133e-ab15-4c86-86c1-86671b8420bc"  
        },
        {
        "participant_code": "CUST05",
        "trade_id": "ta97133e-ab15-4c86-86c1-86671b8420bc"     
        }
                     ]
 ) 
```

All 5 Customers have received an equal allotment of .2 BTC

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page