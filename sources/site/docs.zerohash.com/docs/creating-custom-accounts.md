# Source: https://docs.zerohash.com/docs/creating-custom-accounts

The Custom Accounts feature was released to production on 2022-3-7. This feature allows a platform to attach a custom string to any trade, which will then segregate the settled funds into a separate account. You can then query the balances and positions related to this account programmatically via API.

## 

Use Cases

- Platforms that offer the ability for customers to segregate accounts based on **trading strategy**
- Multiple cash accounts

## 

How can I create custom accounts, pull account balances, and view the current positions?

Clients can create custom accounts via the `POST /trades` or `POST /trades/batch` endpoints through the use of account labels.

### 

Example

- John Smith, who has participant\_code ABC123, is a customer of Trading Platform A, who has platform\_code DEF456.
- For the past few months, John has been executing trades in his initially provided BTC account. For the sake of simplicity, let's say he's only made one trade for 1.4 BTC. Here is the `POST /trades` payload submitted to zerohash by Platform A:

JSON

```
{ 
   "symbol":"BTC/USD",
   "trade_price":"60000.00000",
   "product_type":"spot",
   "trade_type":"regular",
   "trade_reporter":"reporter@platform.com",
   "platform_code":"DEF456",
   "client_trade_id":"example1",
   "physical_delivery":true,
   "parties_anonymous":false,
   "transaction_timestamp":1569014063570,
   "parties":[ 
      { 
         "participant_code":"ABC123", 
         "asset":"BTC",
         "amount":"1.4",
         "side":"buy",
         "settling": true
      },
      { 
         "participant_code":"DEF456",  
         "asset":"USD",
         "amount":"84000.0000",
         "side":"sell",
         "settling": true
      }
   ]
}
```

- By default, zerohash will settle these funds into an account with `account_label = general`. 
 Example `GET /accounts` response:

JSON

```
{
	"message": [
    {
      "asset": "BTC",
      "account_owner": "ABC123",
      "account_type": "available",
      "account_group": "DEF456",
      "account_label": "general",
      "balance": "1.400000000",
      "account_id": "dd9163f6-9024-4848-aa97-1a51f151947a",
      "last_update": 1639691220649
    }
  ]
}
```

- On Platform A's front end, they allow customers to segregate out funds. John takes advantage of this and creates a second account and calls it **scalping**. He then buys 2.3 BTC.
- Platform A submits the following trade:

JSON

```
{ 
   "symbol":"BTC/USD",
   "trade_price":"60000.00000",
   "product_type":"spot",
   "trade_type":"regular",
   "trade_reporter":"reporter@platform.com",
   "platform_code":"DEF456",
   "client_trade_id":"example2",
   "physical_delivery":true,
   "parties_anonymous":false,
   "transaction_timestamp":1569014063570,
   "parties":[ 
      { 
         "participant_code":"ABC123", 
         "asset":"BTC",
         "amount":"2.3",
         "side":"buy",
         "settling": true,
         "account_label":"scalping"//<-- custom account label indicator
      },
      { 
         "participant_code":"DEF456",  
         "asset":"USD",
         "amount":"138000.0000",
         "side":"sell",
         "settling": true
      }
   ]
}
```

- For this example, let's say the trade hasn't settled yet and is in an accepted state. 
 Here is an example `GET /positions` response:

JSON

```
{
  "message": [
       {
           "platform_code": "DEF456",
           "participant_code": "ABC123",
           "account_label": "scalping",
           "asset": "BTC",
           "position_all_open_trades": "0",
           "position_accepted_trades_only": "1",
           "position_active_trades_only": "0"
       }
  ]
}
```

## 

My customers already have segregated accounts, can I transfer them from the general account to a custom one?

- Yes, you can use the `POST /transfers` endpoint. Example payload:

JSON

```
{
  "from_participant_code":"ABC123",
  "from_account_group":"DEF456",
  "from_account_label":"ABC123",
  "to_participant_code":"DEF456",
  "to_account_group":"ABC123",
  "to_account_label":"scalping",
  "asset":"BTC",
  "amount":"2.3"
}
```

- Any future trades made from this custom account should be made with the correct account label.

## 

Is there a maximum number of custom accounts that a customer can create?

There is not, no limitation here.

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page