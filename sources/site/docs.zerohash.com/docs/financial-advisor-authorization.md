# Source: https://docs.zerohash.com/docs/financial-advisor-authorization

Grant trading privileges to one or more financial advisors on a customer's account. By submitting the advisor’s `participant_code`, the advisor can buy or sell on the customer's behalf. By default, financial advisors do not have permission to deposit or withdraw. Financial advisor access can be revoked at any time through a simple API call.

# 

Authorize Advisor

Authorize a financial advisor to have trading privileges to the customer's account.

`POST /accounts/customer:<uuid v4>/advisors`

### 

Sample Request

JSON

```
{  
  "participant_code": "ADVSR1",  
}  
```

### 

Sample Response

JSON

```
 {  
  "urn": "urn:zh:us:accounts:customer:c761fc96-5c44-40d4-8eb2-3fcd5d06754e",  
  "participant_code": "ADVSR1",  
}
```

# 

Remove an Advisor

Remove a financial advisor from the customer’s account.

`DEL /accounts/customer:<uuid v4>/advisors/:{participant_code}`

### 

Sample Response

Success (200)

# 

GET Account Details

Get account details to view the financial advisor associated with the account.

`GET /accounts/customer:<uuid v4>/details`

### 

Sample Response

JSON

```
{  
  "urn": "urn:zh:us:accounts:customer:c761fc96-5c44-40d4-8eb2-3fcd5d06754e",  
  "participant_code": "CUST01",  
  "prefunded": true,  
  "account_label": "U12345678",  
  "tier": "pro",  
  "account_group": "GROUP01",  
  "type": "jtic",  
  "tenants": ["CUST02"],  
  "financial_advisors": ["ADVSR1"]  
}
```

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page