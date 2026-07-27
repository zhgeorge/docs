# Source: https://docs.zerohash.com/docs/api-workflow-3

zerohash offers a way for clients to subscribe to a feed in order to be notified of balance updates that happen to your platform or your customers. This is known as the Balances Feed and is productized in the form of a Websocket. This page will talk about how to use it and its use cases.

Here is an overview of the technicalities of accounts.

## 

Runs vs. Movements

In the below example payloads, you'll see the concept of Runs and Movements mentioned. Runs and Movements are both instances of balance changes. Runs are collections of potentially multiple movements, and movements are always just 1 balance change instance, ie the most granular.

## 

Flows

### 

Subscription

The connection starts with a subscription. See code samples in "Private Socket Feed" section.

### 

Initial Balances

Once initially subscribed, you'll receive current balances for accounts that fit the following criteria:

- Non-zero account balances
- All of your platform's balances (where `participant_code` = your participant\_code)
- All of your customer's balances (where `account_group` = your participant\_code) 
 The `message_type =initial-balances`. Example payload:

json

```
{  
"messageType": "initial-balance",  
	"body": [  
{  
		"account_id": "db5ea9f1-e864-4ec2-93cc-f56a0d9ad665",  
		"participant_code": "ABC123",  
		"account_group": "ABC123",  
		"account_label": "general",  
		"account_type": "available",  
		"asset": "BTC",  
		"balance": "12.5"  
},  
{  
		"account_id": "a5d09f5d-6638-46be-b0fd-1c5243660f2c",  
		"participant_code": "DEF456",  
		"account_group": "ABC123",  
		"account_label": "general",  
		"account_type": "available",  
		"asset": "USD",  
		"balance": "1360000"  
},  
]
```

### 

Balance Updates

While subscribed, once your balance changes or your customer's, you will receive a message with message\_type = balance-updated. Example payload:

JSON

```
{  
"messageType": "balance-updated",  
	"body": {  
  	"account_id": "009bbe95-256b-423e-913f-139684017032",  
    "participant_code": "DEF456",  
    "account_group": "ABC123",  
    "account_label": "general",  
    "account_type": "available",  
    "asset": "BTC",  
    "balance": "0.00131",  
    "run_id": 85693,  
    "run_type": "withdrawal",  
    "movements": [  
            {  
                "movement_timestamp": "2021-11-22T21:37:14.546139Z",  
                "movement_id": "66f1bec3-7179-4517-9507-7dfc62965b70",  
                "movement_type": "withdrawal_confirmed",  
                "change": "0.1000"  
            },  
            {  
                "movement_timestamp": "2021-11-22T21:37:14.550721Z",  
                "movement_id": "80fc5b9f-e25f-4a3d-b36a-6148f04711e3",  
                "movement_type": "withdrawal",  
                "change": "-0.1000"  
            }  
        ],  
    "run_timestamp": "2021-11-22T21:37:14.441141Z"  
    }  
}
```

**Ping** 
Once the connection is established, you'll need to send a ping request every 20 seconds to maintain the subscription, or the connection will be closed. Here is the payload:

```
{  
"messageType": "ping"  
}
```

## 

Use Cases

The balances websocket can be used to power internal operations dashboards or your customer-facing front ends in order to notify stakeholders of important events in real-time.

For all examples, we'll use the following participant's:

- Platform participant\_code: ABC123
- Customer participant\_code: DEF456

### 

On-chain deposits

Use the balances websocket feed in order to be notified of an on-chain deposit made by yourself or one of your customer's.

Example

Platform (ABC123) allows their customers to deposit crypto from an external app into theirs. When a deposit is confirmed on-chain, they'd like to notify their customer's in real-time both on their front end and via an email. Steps:

1. The Platform subscribes to the websocket and receives the initial-balance message:

JSON

```
{  
"messageType": "initial-balance",  
	"body": [  
{   
		"account_id": "db5ea9f1-e864-4ec2-93cc-f56a0d9ad665",  
		"participant_code": "ABC123",  
		"account_group": "ABC123",  
		"account_label": "general",  
		"account_type": "available",  
		"asset": "USD",  
		"balance": "100000"  
},  
{   
		"account_id": "009bbe95-256b-423e-913f-139684017032",  
		"participant_code": "DEF456",  
		"account_group": "ABC123",  
		"account_label": "general",  
		"account_type": "available",  
		"asset": "BTC",  
		"balance": ".25"  
},  
]  
}
```

2. Customer initiates a withdrawal from Coinbase for 0.2 BTC to their Platform app (address generated and exposed by zerohash)
3. The transaction receives 3 confirmations (see here for each asset's confirms thresholds)
4. The platform receives a balance-updated message:

JSON

```
{
"messageType": "balance-updated",  
	"body": {  
			"account_id": "009bbe95-256b-423e-913f-139684017032",  
			"participant_code": "DEF456",  
			"account_group": "ABC123",  
			"account_label": "general",  
			"account_type": "available",  
			"asset": "BTC",  
			"balance": "0.45",
			"run_id": 94077,  
			"run_type": "deposit",  
			"movements": [  
					{  
					"movement_timestamp": "2021-11-29T12:09:28.759838Z",  
					"movement_id": "e6b7d339-fcfe-480f-b910-2928995374d6",  
					"movement_type": "deposit",  
					"deposit_reference_id": "931eb628b2abf356c0a9d4ee9bc037ec27",
					"change": "0.20000000" 
					}  
									],  
			"run_timestamp": "2021-11-29T12:09:28.684765Z"  
					}					  
}
```

5. The Platform can update their front end with the latest balance and any other pieces of metadat related to the most recent deposit.
6. The Platform can send out an email to the Customer informing them of the deposit, triggered by the receipt of this balance-updated message.

### 

Withdrawals

The Platform allows customers to withdraw their crypto to external addresses. Or the Platform itself plans on removing assets from zerohash-kept addresses ad-hoc. The balances websocket feed can be used to automatically update customer front ends as well as internal dashboards.

Example

1. Customer (DEF456) wishes to move 0.1 BTC off of the Platform (ABC123) to their hardware wallet.

2. The Platform will call the [POST /withdrawals/requests](https://docs.zerohash.com/reference/post_withdrawals-requests) endpoint

3. There are 3 steps here:

The Customer's available balance will be reduced by 0.1

JSON

```
{  
"messageType": "balance-updated",  
	"body": {  
		"account_id": "009bbe95-256b-423e-913f-139684017032",  
		"participant_code": "DEF456",  
		"account_group": "ABC123",  
		"account_label": "general",  
		"account_type": "available",  
		"asset": "BTC",  
		"balance": "0.35", 
		"run_id": 94087,  
		"run_type": "withdrawal",  
		"movements": [  
{  
				"movement_timestamp": "2021-11-29T12:37:06.534066Z",  
				"movement_id": "61d137e7-2f3a-4759-ba7a-d7e20f5e5ad6",  
				"movement_type": "withdrawal_pending",  
				"change": "-0.10000000"  
}  
],  
    "run_timestamp": "2021-11-29T12:37:06.478122Z"  
}  
}
```

You can see here that the movement\_type = withdrawal\_pending. This should be interpreted as pending on-chain.

Simultaneously, the Customer's collateral balance will be increased by 0.1. This is a temporary hold until the transaction is confirmed on-chain.

JSON

```
{  
"messageType": "balance-updated",  
	"body": {  
		"account_id": "6c12b928-6bc0-4139-b9ea-ffa636c2a8b8",  
		"participant_code": "DEF456",  
		"account_group": "ABC123",  
		"account_label": "general",  
		"account_type": "collateral",  
		"asset": "BTC",  
		"balance": "0.1",  
		"run_id": 94087,  
		"run_type": "withdrawal",  
		"movements": [  
							{  
					"movement_timestamp": "2021-11-29T12:37:06.534177Z",  
					"movement_id": "61d137e7-2f3a-4759-ba7a-d7e20f5e5ad6",  
					"movement_type": "withdrawal_pending",  
					"change": "0.10000000"  
							}						  
									],  
			"run_timestamp": "2021-11-29T12:37:06.478122Z"  
						}						  
}
```

After 1 on-chain confirmation, the websocket will send a message which will indicate that the Customer's collateral balance has been reduced by 0.1.

JSON

```
{  
    "messageType": "balance-updated",  
    "body": {  
        "account_id": "6c12b928-6bc0-4139-b9ea-ffa636c2a8b88",  
        "participant_code": "DEF456",  
        "account_group": "ABC123",  
        "account_label": "general",  
        "account_type": "collateral",  
        "asset": "BTC",  
        "balance": "0",  
        "run_id": 85693,  
        "run_type": "withdrawal",  
        "movements": [  
            {  
                "movement_timestamp": "2021-11-22T21:37:14.546253Z",  
                "movement_id": "66f1bec3-7179-4517-9507-7dfc62965b70",  
                "movement_type": "withdrawal_confirmed",  
                "change": "-0.10000000"  
            }  
        ],  
        "run_timestamp": "2021-11-22T21:37:14.441141Z"  
    }  
}
```

The available account is now credited with 0.1, and then immediately debited by 0.1

JSON

```
{  
"messageType": "balance-updated",  
	"body": {  
			"account_id": "009bbe95-256b-423e-913f-139684017032",  
       "participant_code": "DEF456",  
       "account_group": "ABC123",  
       "account_label": "general",  
       "account_type": "available",  
       "asset": "BTC",  
       "balance": "0.35",  
       "run_id": 85693,  
       "run_type": "withdrawal",  
       "movements": [  
            	{  
                "movement_timestamp": "2021-11-22T21:37:14.546139Z",  
                "movement_id": "66f1bec3-7179-4517-9507-7dfc62965b70",  
                "movement_type": "withdrawal_confirmed",  
                "change": "0.10000000"  
            	},  
            	{  
                "movement_timestamp": "2021-11-22T21:37:14.550721Z",  
                "movement_id": "80fc5b9f-e25f-4a3d-b36a-6148f04711e3",  
                "movement_type": "withdrawal",  
                "change": "-0.10000000"  
            	}  
        						],  
        "run_timestamp": "2021-11-22T21:37:14.441141Z"  
    					}  
}
```

You can see above that the `movement_type` = `withdrawal_confirmed`. The withdrawal is now fully settled both on the zerohash ledger and on the blockchain.

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page