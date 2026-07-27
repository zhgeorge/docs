# Source: https://docs.zerohash.com/docs/what-is-an-account-label

## 

Background

Account Labels can be thought of as “sub account groups”. Within each account group, you can have many Account Labels. They are used to separate funds at a more granular level. One individual can now have 2 separated BTC available accounts, for example.

The default account\_label value is `general`.

Prior to our launch of Account Labels, Accounts were a unique combination of the following attributes:

- `participant_code`
- `asset`
- `account_type`
- `account_group`

**We are now adding a 5th attribute:**

- `account_label`

![](https://files.readme.io/0673246-image.png)

Release notes can be found [here](https://docs.zerohash.com/changelog/account-labels).

## 

Creating a new Account with a new Account Label

**Accounts** are created when you use them. If you deposit BTC, we will create your BTC Accounts. Same idea with trades and transfers.

To create a new Account that has a new (non-'general') **Account Label**, you will specify the name on the `POST /trades` call. The field name is `account_label` and it is optional.

### 

Example

Let's say you operate the participant, "Trading Platform" and the participant\_code is ABC123. You start by creating a retail customer, "John Smith" and zerohash responds and gives John the participant\_code DEF456. At this point, John Smith has zero accounts in our system.

Trading Platform submits a trade where John Smith is purchasing BTC **without** an Account Label. John is using Trading Platforms standard brokerage product to make this purchase:

JSON

```
{ 
   "symbol":"BTC/USD",
   "trade_price":"60000.00000",
   "product_type":"spot",
   "trade_type":"regular",
   "trade_reporter":"reporter@platform.com",
   "platform_code":"ABC123",
   "client_trade_id":"test1",
   "physical_delivery":true,
   "parties_anonymous":false,
   "transaction_timestamp":1569014063570,
   "parties":[ 
      { 
         "participant_code":"DEF456",    //<-- customer's participant_code
         "asset":"BTC",
         "amount":"0.1",
         "side":"buy",
         "settling": true
      },
      { 
         "participant_code":"ABC123",    //<-- platform's participant_code
         "asset":"USD",
         "amount":"6000.0000",
         "side":"sell",
         "settling": false
      }
   ]
}
```

zerohash has now created a BTC account for John Smith. Example details:

- `participant_code`: `DEF456`
- `asset`: `BTC`
- `account_type`: `available`
- `account_group`: `ABC123`
- `account_label`: `general`

John's balance in this account is `0.1`.

A couple weeks later, John creates an IRA account with Trading Platform and would like to make a larger BTC purchase within this new account. Trading Platform will submit a new trade, specifying an `account_label`:

JSON

```
{ 
   "symbol":"BTC/USD",
   "trade_price":"61000.00000",
   "product_type":"spot",
   "trade_type":"regular",
   "trade_reporter":"reporter@platform.com",
   "platform_code":"ABC123",
   "client_trade_id":"test1",
   "physical_delivery":true,
   "parties_anonymous":false,
   "transaction_timestamp":1569014083570,
   "parties":[ 
      { 
         "participant_code":"DEF456",   
         "asset":"BTC",
         "amount":"0.5",
         "side":"buy",
         "settling": true,
         "individual_taxable": "individual_tax_advantaged" <-- see here
      },
      { 
         "participant_code":"ABC123",   
         "asset":"USD",
         "amount":"30500.0000",
         "side":"sell"
         "settling": false
      }
   ]
}
```

zerohash has now created a 2nd BTC account for John Smith. Details:

- `participant_code: DEF456`
- `asset: BTC`
- `account_type: available`
- `account_group: ABC123`
- `account_label: individual_tax_advantaged`

John's balance in this account is `0.5`.

---

### 

GET requests involving Account Labels

#### 

View balances:

- [GET /accounts](https://docs.zerohash.com/reference-link/get_accounts)
 - New field `account_label` in response.
 - You have the ability to filter your request by `account_label`

#### 

View outstanding positions:

- [GET /accounts/net\_delivery\_obligations](https://docs.zerohash.com/reference-link/get_accounts-net-delivery-obligations)
 - New field account\_label in response.

#### 

View balances of a specific account id:

- [GET /accounts/:account\_id](https://docs.zerohash.com/reference-link/get_accounts-account-id)
 - New field `account_label` in response.

#### 

View deposit history:

- [GET /deposits](https://docs.zerohash.com/reference-link/get_deposits)
 - New field `account_label` in response.

#### 

View positions:

- [GET /positions](https://docs.zerohash.com/reference-link/get_positions)
 - New field `account_label` in response.

## 

Transferring funds between Account Labels

- You will need to notify zerohash that you wish to use this feature, a configuration is required.
- Once configured, you can use the [POST /transfers](https://docs.zerohash.com/reference-link/post_transfers) endpoint. Here is an example request where you are transferring funds intra-participant from the `general` `account_label` to the joint `account_label`:

JSON

```
{
  "from_participant_code":"DEF456",
  "from_account_group":"ABC123",
  "from_account_label":"general",
  "to_participant_code":"DEF456",
  "to_account_group":"ABC123",
  "to_account_label":"joint",
  "asset":"BTC",
  "amount":".01"
}
```

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page