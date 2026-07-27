# Source: https://docs.zerohash.com/docs/account-setup

This guide walks through how to activate trading accounts on zerohash’s Central Limit Order Book (CLOB), and explains the difference between pre-funded and non-pre-funded account setups.

## 

Prerequisites

Before an account can be activated on the CLOB, Platforms must confirm the following steps are complete.

- A participant must be created, associated to your platform. You can create a participant on the zerohash system using the following endpoints;
 - [`POST /participants/customers/new`](https://docs.zerohash.com/reference-link/post_participants-customers-new) to create a new Individual participant.
 - [`POST /participants/entity/new`](https://docs.zerohash.com/reference-link/post_participants-entity-new) to create a new Entity(_NNP_) participant.
 - You can use the [`GET /participant/{participant_code}/basic_info`](https://docs.zerohash.com/reference-link/get_participant-participant-code-basic-info) to retrieve the participants status, along with subscribing to the zerohash participant status update events.
- The customers `status` in the response should be `approved`

## 

Account Activation

1. Use the target customers `participant_code` when calling the [`POST /accounts`](https://docs.zerohash.com/reference-link/post_accounts) endpoint.
2. Specify the funding model that you want the account to use,`prefunded : true` or `prefunded : false`.

### 

Funding Models

#### 

Pre-Funded Accounts

> `prefunded : true`

- USD balances are held at zerohash and ledgered directly to the customer.
- Credit checks are performed by zerohash against the customer’s USD account balance.
- Platforms can use the float account to transfer funds to the customers balance using the [POST /transfers](https://docs.zerohash.com/reference-link/post_transfers) endpoint.
 - json

        ```
        {
            "from_participant_code": "00SCXM",
            "from_account_group": "PLAT01",
            "to_participant_code": "PART02",
            "to_account_group": "GTRT44",
            "to_account_label":"general",
            "asset": "USD",
            "amount": "1"
        }
        ```

#### 

Non Pre-Funded Accounts

> `prefunded : false`

- Customers USD balances are maintained on your platforms ledgers.
- Credit checks on customers balance are **performed by the platform** before order placement.
 - Customers will have the ability to place orders to the value of the platforms float if credit checks are not handled on the platforms order entries for `prefunded : false` accounts.
- Customers buying power will be allocated from the platforms float account upon order placement.

#### 

Example Request

Request

```
{
    "participant_code": "6AABU5",
    "prefunded": false,
    "account_tier": "pro",
    "account_label": "6AABU5-LABEL",
    "signed_timestamp": "1755133956"
}
```

#### 

Example Response

Response

```
{
    "message": {
        "participant_code": "6AABU5",
        "account_group": "2XUB16",
        "account_label": "6AABU5-LABEL",
        "prefunded": false,
        "account_tier": "pro",
        "customer_account_urn": "",
        "traders_list": []
    }
}
```

## 

Account Management

After account activation on the CLOB, you can use the following endpoints to manage your accounts:

- Get account details
 - [`GET /clob/accounts/{account_id}`](https://docs.zerohash.com/reference-link/get_clob-accounts)
- Update account
 - [`PATCH /clob/accounts/{account_id}`](https://docs.zerohash.com/reference-link/patch_clob-accounts)

Updated 4 months ago

---

### What’s Next

- [Funding Models](https://docs.zerohash.com/docs/funding-models)

Did this page help you?

Yes

No

Copy Page