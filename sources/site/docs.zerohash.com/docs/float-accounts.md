# Source: https://docs.zerohash.com/docs/float-accounts

## 

What are Float Accounts?

Float Accounts are accounts that are used to fund purchases specifically through Zero Hash Liquidity Services (ZHLS). These accounts are held under the Zero Hash Liquidity Services entity and are also only relevant to platforms that are under the Novated model. Although the most common float currency is USD, floats can come in the form of other fiat currencies and also crypto (for crypto/crypto transactions). See the ZHLS link in the first sentence for supported pairs.

## 

How do I fund my Float Account?

#### 

Fiat

To carry out the initial funding or topping up of your float account, platforms are required to wire the funds to zerohash with their platform code, along with "FLOAT" to indicate the destination of the funds.

E.g: {platform\_code}-FLOAT

You can view our bank account details on the Deposits page in the portal by selecting USD.

#### 

Crypto

You will need to send your tokens to your dedicated address. You can view your address details on the Deposits page in the portal by selecting the crypto asset you are interested in sending.

This is the first step. The second step is the responsibility of zerohash's in order to properly allocate the deposited asset to the float account. You can coordinate this movement over a shared Slack channel.

## 

How do I query my float balance at zerohash?

You can query balances via the [GET /accounts](https://docs.zerohash.com/reference/get_accounts) endpoint. In order to pick out the float account, use the following query parameters

### 

US Region

- asset: \[float asset you're interested in\]
- account\_owner: 00SCXM
- account\_group: \[your participant\_code\]
- account\_label: general

#### 

Example payload, assuming your platform's participant\_code is ABC123

JSON

```
{  
  "asset": "USD",  
  "account_owner": "00SCXM",  
  "account_type": "available",  
  "account_group": "ABC123",  
  "account_label": "general",  
  "balance": "50000.00",  
  "account_id": "ce819fe8-b1d7-43bb-961c-e09ede0988d3",  
  "last_update": 1554395972174  
}
```

### 

EU Region

You can query balances via the [GET /accounts](https://docs.zerohash.com/reference/get_accounts) endpoint. In order to pick out the float account, use the following query parameters

- asset: \[float asset you're interested in\]
- account\_owner: ZHDSEU
- account\_group: \[your participant\_code\]
- account\_label: general

#### 

Example payload, assuming your platform's participant\_code is ABC123

JSON

```
{  
  "asset": "USD",  
  "account_owner": "ZHDSEU",  
  "account_type": "available",  
  "account_group": "ABC123",  
  "account_label": "general",  
  "balance": "50000.00",  
  "account_id": "ce819fe8-b1d7-43bb-961c-e09ede0988d3",  
  "last_update": 1554395972174  
}
```

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page