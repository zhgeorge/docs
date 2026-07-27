# Source: https://docs.zerohash.com/docs/uma-deposits-and-withdrawals

Universal Money Address (UMA) is an open source project designed to make improvements over standard BOLT11 Lightning Network transactions.

These configurations will typically result in addresses taking one of the following formats:

- $[satoshi@uma.zerohash.id](mailto:satoshi@uma.zerohash.id) **\[Default\]**
- $satoshi@\[platform\].zerohash.id
- $satoshi@uma.\[platform\].com
- $satoshi@\[platform\].com

**Note**: CERT uses Testnet (not REGTEST) for all UMA and non-UMA Lightning Network transactions as of November 2024.

**Note**: For information regarding bank account linking via Plaid see [this guide](https://docs.zerohash.com/docs/link-a-bank-account)

> 📘
> 
> ### 
> 
> Note: The Zero Hash UMA VASP linked to UMA.me will use the following default beginning 1/10/25:
> 
> - **Invoice Expiration**: 4m 30s
> - **RFQ expiration**: 5m
> 
> Platform user interfaces should offer values well below these numbers (such as 30s refreshes) to reduce the chance of an invoice expiration.

### 

Transaction Limits and Controls (UMA)

The below tables lists the transaction limits in place for UMA Lightning Network transactions.

| Transaction | Control Description | Control |
| --- | --- | --- |
| Withdrawals | Transaction Daily Maximum Amount | N/A |
| Withdrawals | Minimum Transaction Amount | 1 satoshi |
| Deposits | Invoice Maximum Amount | N/A |
| Deposits | Invoice Maximum Frequency | N/A |

# 

UMA Deposits

### 

Register UMA Address

An invoice must be generated in order to receive a deposit over the Lightning Network. The customer can choose the username and the domain it is registered can take one of the forms listed above.

![](https://files.readme.io/90826e101e5d8e840649d123d5f4f0c4dbb694d617a06c90e2998370954dbfc4-Screenshot_2024-08-29_at_3.57.44_PM.png)

Once your UMA server is setup, a user must first be registered by your server and then sent to Zero Hash via **POST /deposits/uma**

JSON

```
{  
    "username": {UMA_ADDRESS}, // $username, see <https://uma.me> documentation  
    "participant_code": "{{participant_code}}"  
}
```

### 

Confirm Creation of UMA Address

The UMA address creation can be confirmed by calling **GET /deposits/uma** 
This call will return a list of created addresses.

### 

Update or Change UMA Address

An UMA address can be changed after creation, such as in the case of a typo, by calling **PATCH /deposits/uma**

Request:

JSON

```
{  
    "new_username": "$scdgcr2",  
    "previous_username":"$scdgcr",  
    "participant_code": "3QX004"  
}
```

Response

```
Success: 200

Error:
HTTP CODE 409 - conflict  
 {"message":"previous username does not match"}
```

### 

Generate UMA Invoice

Once successfully registered, that platform can then generate an invoice by calling a LNURL request using a different Zero Hash URL depending on the environment (below example payloads use the CERT URL for illustration purposes):

- **CERT**: uma.cert.zerohash.com/.well-known/lnurlp
- **PROD**: uma.zerohash.com/.well-known/lnurlp

**Note**: The LNURL and PAYREQ must be sent from the onboarded Zero Hash platform. If the originating VASP is not the onboarded entity then these requests must be proxied to pass IP address / domain validation rules or else will be automatically rejected by default.

The LNURL request needs to follow the UMA documentation found here. A sample payload could look like the following:

Request

```
GET uma.zerohash.com/.well-known/lnurlp/$bob?umaVersion=1.0&nonce=1234&vaspDomain=vasp1.com&signature=abcd&isSubjectToTravelRule=true×tamp=12345678
```

**Note**: The error message "UMA recipient not found" is returned if attempting to generate an invoice without registering the participant first.

The step following a successful LNURL request is to send the PayReq request with the generated invoice ID “lnurlp\_callback”. The payreq call will look like the following:

**POST uma.zerohash.com/api/payreq/<participant\_code>**

JSON

```
{  
   "amount":"1000.USD",  
   "payerData":{  
      "identifier":"$[payer@sender-vasp.com](mailto:payer@sender-vasp.com)",  
      "email":"[payer@sender-vasp.com](mailto:payer@sender-vasp.com)",  
      "name":"payer",  
      "compliance":{  
         "kycStatus":"VERIFIED",  
         "utxos":\[
           
            ],
     "nodePubKey":"",
     "signature":"",
     "signatureNonce":"",
     "signatureTimestamp":,
     "utxoCallback":""
  }
 },  
   "payeeData":{  
      "compliance":{  
         "mandatory":true  
      },  
      "identifier":{  
         "mandatory":true  
      },  
      "email":{  
         "mandatory":false  
      },  
      "name":{  
         "mandatory":false  
      }  
   },  
   "convert":"USD"  
}
```

The invoice is then returned and ready to be paid.

### 

USD Funds

If your platform is configured to automatically offramp the received BTC to USD, the funds will sit in the participant’s account until they are debited by the Real-Time Payment process outlined in the next section.

![](https://files.readme.io/f4de0878e45ea7384e39fd4703386cd75a1fdddf09f01b80573fec20b34e6358-Screenshot_2024-08-29_at_4.05.46_PM.png) 

The following sections review calls that can be made to confirm each step of the process.

### 

Participant ACH/RTP Limits

A Platform can query the API to understand the Sender's remaining ACH/RTP limits via the `GET /participant/[participant_code]/limits` [endpoint](https://docs.zerohash.com/reference/get_participant-participant-code-limits).

`GET /participant/SENDR1/limits` response:

JSON

```
{  
    "participant_code": "SENDR1",  
    "limits": \[{  
            "type": [  
                "trades"  
            ],  
            "period": 24,  
            "balance":"0"  
            "limit": "999",  
            "asset": "USD"  
        },  
        {  
            "type": [  
                "trades"  
            ],  
            "period": 720,  
            "balance":"0"  
            "limit": "3000",  
            "asset": "USD"  
        },  
        {  
            "type": [  
                "trades"  
            ],  
            "period": 0,  
            "balance":"0"  
            "limit": "9000",  
            "asset": "USD"  
        },  
        {  
            "type": [  
                "trades"  
            ],  
            "period": 4320,  
            "balance":"0"  
            "limit": "0",  
            "asset": "USD"  
        }  
    ]  
}
```

_Notes on interpreting the above response:_

The limit represents the notional remittance volume that is permitted over the next period. When a remittance transaction becomes older than period, that transaction value is refunded back into the limit balance.

When the limit becomes 0 or a transaction would take the limit into a negative value, Zero Hash will reject subsequent API calls to initiate any remittances (POST /liquidity/rfq and POST /liquidity/execute).

A period of 0 means a lifetime limit.

The period unit is hours

### 

Confirming the Deposit

The following command will return the deposits to a participant code

**GET /deposits?participant\_code={{participant\_code}}**

JSON

```
{  
    "message": [  
        {  
            "settle_timestamp": 1718813440365,  
            "account_id": "31206b3e-4305-4b74-bf23-3d1eaec3ae00",  
            "participant_code": "7D1QCQ",  
            "account_group": "UKYI3K",  
            "asset": "BTC",  
            "amount": "0.00001558",  
            "reference_id": "Invoice:01903143-4368-52d6-0000-07acc1700390",  
            "source": "$test@testvasp.com",  
            "received_address": "$testaddress",  
            "account_label": "general",  
            "movement_id": "93f778b2-3620-493e-8c44-4468ab3483e3", ‘movement_id will be set to the payment_hash of the invoice which originated that deposit.  
            "run_id": "3848133"  
        }  
    ],  
    "page": 1,  
    "page_size": 200,  
    "total_pages": 1,  
    "count": 1  
}
```

### 

Confirming Trade Details (BTC to USD)

The following command will return the trades for a participant code

**GET /trades?participant\_code={{participant\_code}}**

### 

Confirm Participant Balance Increase

The following command will return the trades for a participant code

**GET /accounts?account\_owner={{participant\_code}}**

JSON

```
{  
    "message": [  
        {  
            "asset": "USD",  
            "account_owner": "7D1QCQ",  
            "account_type": "available",  
            "account_group": "UKYI3K",  
            "account_label": "general",  
            "balance": "1",  
            "account_id": "1058112a-b1e4-4142-9fe2-47cd2284bb99",  
            "last_update": 1718813461541  
        }  
    ],  
    "page": 1,  
    "total_pages": 1  
}
```

### 

Confirm Participant Transaction Movements

The following command will return the movement of both digital assets and fiat balances for a given participant code

**GET /accounts/{{account\_id}}/movements**

JSON

```
{  
    "message": [  
        {  
            "asset": "USD",  
            "account_owner": "7D1QCQ",  
            "account_type": "available",  
            "account_group": "UKYI3K",  
            "account_label": "general",  
            "balance": "1",  
            "account_id": "1058112a-b1e4-4142-9fe2-47cd2284bb99",  
            "last_update": 1718813461541  
        }  
    ],  
    "page": 1,  
    "total_pages": 1  
}
```

### 

Transaction Limits and Controls (UMA)

UMA deposits and withdrawals are only available with VASPs that have completed Zero Hash’s Compliance UMA Due Diligence and have been added to the allowlist as part of that process. UMA transactions to/from external VASPs will be blocked until they are part of the allowlist.

The minimum allowed transaction amount using UMA is 1 satoshi and millisatoshis are not recognized because these are below the minimum precision amount.

### 

ACH and Real-Time Payments (RTP)

Please see the separate guide for [ACH](https://docs.zerohash.com/docs/getting-started-with-ach) and Real-time Payments that will cover steps to withdraw fiat funds from the participant account to an external bank account.

### 

Error Codes & States

Please see the following table of error states and courses of action

| Error | Zero Hash Action | Platform Action |
| --- | --- | --- |
| API to initiate offramp fails | Fail every htlc composing the invoice, funds revert to sender.<br>No error is currently returned in this case. | Sending VASP would need to retry transaction due to canceled invoice |
| API to initiate offramp succeeded but later payment status webhook comes back as payment failed | ZH notifies the platform via webhook of the failure. There is no automated retry of this step. | Platform to retry POST /payments |
| When UMA address is incorrect → valid format $[name@domain.com](mailto:name@domain.com) | uma-server responds with bad request response and a proper error message.<br>Resubmit with proper format | When UMA address is not found (non-existent)<br>uma-server responds with bad request response and a proper error message. |
| When any of the following query params is not sent:<br>\- umaVersion <string> \* only version 1.0 will be supported for now<br>\- nonce <int><br>\- vaspDomain <string><br>\- signature <string><br>\- isSubjectToTravelRule <bool><br>\- Timestamp <long> | uma-server responds with a bad request response and a proper error message. | |
| When request goes OK | uma-server responds with StatusOK and the following data<br>preferred currency<br>estimated exchange rate<br>compliance data<br>vasp status: (should always be verified) | |
| When request sends a version other than 1.0 (not supported) | uma-server responds with a bad request response and a proper error message. | |
| Requesting the callback url multiple times | Should not be valid, resulting in bad request the second time the same callback url is used. | |
| Sending payReq with not mandatory payer info | Should result in invalid request | |
| receivingCurrencyCode is set to any value other than USD. | When sender-vasp sends a payreq with receivingCurrencyCode set to MSat, it should result in a rejection | |
| Conversion is OK according to payreq response. | The conversion rate of the payreq response should be OK. Example:<br>Request: {<br>SendingCurrency: USD<br>ReceivingCurrency: USD<br>Amount: 10000 // means a rfq by total of $100 USD Notional<br>Response:<br>invoice with amount in MSats.<br>Check if the value actually corresponds to 100 USD given the conversion rate exposed in the response | |
| Verify response | Only USD, BTC and SAT should be supported currencies | |

# 

UMA Withdrawals

## 

See supported currencies

To see what currencies the destination UMA address supports, use the `GET /withdrawals/umalookup/{address}`.

**Response**

JSON

```
{
  "currencies":[
    {
      "code":"USD",
      "symbol":"$",
      "name":"US Dollars",
      "multiplier":"1.6129",
      "decimals":2,
      "min":"1",
      "max":"1000"
    },
    {
      "code":"SAT",
      "symbol":"B",
      "name":"Satoshis",
      "multiplier":"1",
      "decimals":0,
      "min":"1",
      "max":"100000000"
    }
  ]
}
```

## 

Initiate an LNURL and PayReq

Use the `POST /withdrawals/uma` endpoint to initiate the LNURL and PayReq requests with the Receiving VASP. If successful, returns a BOLT11 invoice that can be used through existing [/withdrawals/requests](https://docs.zerohash.com/reference/post_withdrawals-requests) and [/convert\_withdraw](https://docs.zerohash.com/docs/convert-withdraw-integration-guide) endpoints to execute the payment.

**[POST /withdrawals/uma](https://docs.zerohash.com/reference/post_withdrawals-uma)**

JSON

```
{  
    "participant_code":"D3SCYB",
    "recipient_uma_address":"$satoshi@vasp.com",
    "amount_sats":"1102", 
    "receiving_currency":"USD",
    "amount_receiving_currency":"",
    "client_withdrawal_request_id":""
}
```

Note that either `amount_sats` needs to be provided, or both `receiving_currency` and `amount_receiving_currency`. All 3 parameters cannot be provided together.

**Response**

JSON

```
{  
    "participant_code":"D3SCYB",
    "platform_code": "JDNQGG",
    "sender_uma_address":"$sender@uma.zerohash.id",
    "recipient_uma_address":"$satoshi@vasp.com",
    "receiving_currency":"USD",
    "amount_sats":"1102",
    "sender_fee_sats":"179",
    "amount_receiving_currency":"551",
    "receiving_currency_multiplier":"2.000000000",
    "receiver_exchange_fee_sats":"100",
    "decimals":2,
    "invoice":"lnbcrt...nvrx9"
}
```

Note in the above response that `receiver_exchange_fee_sats` is the number of sats charged by the receiving VASP.

The provided Lightning Network invoice (shortened in the above example) can then be used to perform a withdrawal or convert withdrawal operation (see [BOLT11 withdrawals guide](https://docs.zerohash.com/docs/bolt11-deposits-and-withdrawals)).

## 

Fund an UMA Withdrawal using ACH/RTP

If your platform is approved for ACH/RTP flows, then the above UMA steps to create a BOLT11 invoice need to be performed. For more information on ACH/RTP capabilities more generally please refer to [this guide](https://docs.zerohash.com/docs/on-demand-api-workflow).

> 📘
> 
> ### 
> 
> Note: Beginning January 2025, Zero Hash requires an external VASP to implement a minimum invoice expiration time of at least 60 seconds in addition to the quote\_expiry time so that underlying processes can complete before invoice expiry.

**Initiate the ACH on demand**

At the conclusion of these steps, USD will be onramped to BTC and will appear in the participant account.

- `POST /payments/rfq`
 - Make sure to have a `quote_expiry` of at least `30s`.
 - This is necessary because we perform a balance check on the user's bank account, and that operation can take some time to complete
- `POST /payments/execute`

**Generate the UMA invoice** 
Use the UMA withdrawal endpoints to generate an invoice

- Call `GET /withdrawals/umalookup/{pcode}`
- Call `POST /withdrawals/uma`
 - Sender defined amounts can be initiated by specifying `amount_sats`
 - Receiving currency in this instance will be left NULL
 - Receiver defined amounts can be initiated by specifying `receiving_currency` and `amount_receiving_currency`
 - \[Future Addition - not currently supported\]
 - Receiver defined currency and lock either sender or receiver amount:
 - `receiving_currency` is provided
 - Either `amount_receiving_currency` or `amount_sats` is also provided

**Calculate the withdrawal fee**

- Call `GET /withdrawals/locked_network_fee` and pass the invoice as `withdrawal_address`
 - Use `max_amount` = true instead of passing an `amount`. This will send the max BTC after adjusting for the Lightning Network fee.
- A `withdrawal_quote_id` will be generated

**Execute the withdrawal**

- Call `POST /withdrawals/execute` with the `withdrawal_quote_id` from the prior step

**After the ACH settles**

- The platform float will be credited once the ACH funds settle

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page