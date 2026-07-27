# Source: https://docs.zerohash.com/docs/what-is-an-account

## 

General

Not to be confused with the concept of a Participant, an Account is a unique combination of the following fields:

- `participant_code`
- `asset`
- `account_type`
- `account_group`
- `account_label`

Each account will also have an associated balance, denoted by the `amount` field and an associated unique `account_id`.

## 

Technical

### 

Example Payload

JSON

```
{  
  "message":[  
    {  
      "asset": "USD",  
      "account_owner": "ABC123",  
      "account_type": "available",  
      "account_group": "DEF456",  
      "account_label": "general",  
      "balance": "50000.00",  
      "account_id": "ce819fe8-b1d7-43bb-961c-e09ede0988d3",  
      "last_update": 1554395972174  
    }
  ]
}
```

# 

Account Creation

When a participant is created for the first time, this participant does not have any accounts by default. Accounts are created when actual asset movements take place. In other words, they are created when you use them. For example, if you **deposit** BTC, a BTC available account will be created. If you are a counterparty to a **trade**, an account will be created for the asset that you receive.

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page