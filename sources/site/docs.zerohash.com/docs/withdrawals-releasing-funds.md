# Source: https://docs.zerohash.com/docs/withdrawals-releasing-funds

## 

Context

Within the larger [Account Funding](https://docs.zerohash.com/docs/fund-overview) product, zerohash offers the ability for Platforms to allow their end customers to make crypto and stablecoin withdrawals. The integration guide for the withdrawal flow is [here](https://docs.zerohash.com/docs/wallet-link-sdk-integration-guide). This page outlines zerohash's official requirements for Platforms who maintain balances on their side.

Most Platforms will manage the fiat ledger on their end. For example, consider a brokerage platform. On the deposit, zerohash will initially credit the user with USDC. We'll then convert to USD in the customer account and transfer those funds to the brokerage's account. At this point, zerohash relinquishes control of the End Customer's account balance (ie, the ledger) to the brokerage. So when withdrawals are made, zerohash does not have the ability to perform an informed credit check.

> ❗️
> 
> ### 
> 
> **The Platform is completely responsible for ensuring that the end customer does not withdraw more than their current balance. Do not release funds back to your End Customer unless you receive an explicit "failed" webhook.**

Let's now look at the end-to-end flow and its corresponding requirements.

## 

Requirements

1. When the Withdraw SDK is invoked, the Platform must encumber (in other words, "lock") the funds on their system, preventing the End Customer from using those funds until the withdrawal is in a terminal state of failed.
2. If there is ever a case where a webhook cannot be matched (or otherwise "processed successfully") by the Platform, the funds that are encumbered must continue to be encumbered.
3. The Platform should only re-credit the End Customer's balance if the withdrawal reaches a failed terminal state of `status` = failed or abandoned.
4. The Platform should only re-credit the End Customer's balance after querying the [GET /payments/{payment\\\\\\\\\\\\\\\_id}](https://docs.zerohash.com/reference/get_payments-payment-id) and observing `status` = failed or abandoned.
 1. The [GET /payments/{payment\\\\\\\\\\\\\\\_id}](https://docs.zerohash.com/reference/get_payments-payment-id) endpoint will return the current status of the withdrawal. zerohash maintains 24/7/365 support should there ever be any concerns about the status of a withdrawal. However, the utilization of `payment_id` allows this process to be self service and therefore affords a better end user experience.
5. The Platform must keep track of withdrawal states on their end. In order to progress the transaction through the Platform’s state machine, the webhooks must be matched per the instructions in the ["Field matching logic" section](https://docs.zerohash.com/docs/withdrawals-releasing-funds#field-matching-logic). When building your state machine, you must persist zerohash's unique ID, the `payment_id` as well as any of your own (ie, the `reference_id`).
6. zerohash offers the ability to attach a Platform-dictated `reference_id` on the `POST /client_auth_token` request. This ID will be sent on each associated webhook call. The `reference_id` is solely “metadata” attached to a withdrawal. You must only depend on the `payment_id` returned in the response of the `POST /client_auth_token` call to match webhooks.

> 🚧
> 
> ### 
> 
> We strongly encourage that the Platform set up an automated internal alerting system for Withdrawal processing. After receiving an alert, the next step is to reach out to zerohash support - our operations team will assist in reconciling the state.

> 🚧
> 
> ### 
> 
> We strongly encourage that the Platform **only allow 1 withdrawal at a time per** `participant_code`**.** If you choose to allow more than one, the Platform should use `created_at` to disambiguate multiple open withdrawal requests for the same `participant_code`. For example, the timestamp that the Platform invoked the SDK originally should be "close" the the `created_at` value.

## 

Withdrawal flow

You can view the official [integration guide](https://docs.zerohash.com/docs/wallet-link-sdk-integration-guide) for and end to end overview

1. Platform invokes Withdraw SDK
2. End Customer initiates withdraw
3. zerohash sends webhooks to Platform

## 

1\. Platform invokes Withdraw SDK

As a refresher, when [invoking the Withdraw SDK](https://docs.zerohash.com/docs/wallet-link-sdk-integration-guide), the Platform must specify the following fields:

- `external_account_id`
- `quoted_asset`
- `amount`

Example `POST /client_auth_token` request:

JSON

```
 {
    "participant_code": "CUST01",
    "permissions": ["crypto-withdrawals"],
    "withdrawal_details": {
        "external_account_id": "c476a81f-a29f-4e22-88db-1f521d7cf004",
        "quoted_asset": "USD",   
        "withdrawal_request_amount": "200"
    },
   "reference_id": "0bd7f7f0-cf26-495f-b2df-e8afe8481ba3" 
}
```

Example `POST /client_auth_token` response:

JSON

```
{
  "message": {
      "token": "<JWT_TOKEN_RESPONSE>",
      "payment_id": "0jld7f7f0-cf26-495f-b2df-e8afe8481re6"
    }
}
```

There are 3 possible terminal states:

- `settled` - the withdrawal completed and the Platform can assume that the End Customer has its funds. The Platform needs to settle the outstanding amount with zerohash on the settlement cadence originally agreed upon.
- `failed` - the Platform may re-credit the end customer's balance with the `amount`
- `abandoned` - the Platform may re-credit the end customer's balance with the `amount`

## 

2\. End Customer initiates withdraw

The End Customer will click the 'Initiate withdrawal' button on the Confirm Withdrawal details screen of the Withdraw SDK, which will trigger the `submitted` webhook message.

## 

3\. zerohash sends webhooks to the Platform

zerohash will send a series of webhooks that correspond to the status of the withdrawal:

- `initialized` - The Platform has successfully generated a JWT via the `POST /client_auth_token` endpoint
- `submitted` - zerohash has received the withdrawal request
- `pending` - zerohash is processing the request
- `posted` - The withdrawal has been sent on-chain
- `settled` - The withdrawal has completed on-chain (the End Customer has their funds)
- `abandoned` - The JWT token has expired before the withdrawal was initiated by the End Customer. Currently, each JWT token is valid for 5 minutes.
- `failed` - The withdrawal was not successfully sent on-chain (the End Customer does not have their funds)

## 

Field matching logic

To consider a withdrawal as "matched", the Platform's system must be able to perform a one-to-one match between the following field values included in the webhook message and the corresponding records on the Platform's side:

- `participant_code` , `withdrawal_request_amount` and `payment_id`

## 

Scenarios

> 🚧
> 
> ### 
> 
> zerohash will administer an official conformance test, ensuring the following scenarios pass, before the Platform can go live.

### 

Scenario Assumptions

- We'll assume the following `POST /client_auth_token` call

JSON

```
 {
    "participant_code": "CUST01",
    "permissions": ["crypto-withdrawals"],
    "withdrawal_details": {
        "external_account_id": "c476a81f-a29f-4e22-88db-1f521d7cf004",
        "quoted_asset": "USD",   
        "withdrawal_request_amount": "200"
    },
   "reference_id": "0bd7f7f0-cf26-495f-b2df-e8afe8481ba3"
}
```

- We'll assume the following `POST /client_auth_token` response contains a `payment_id` = `0po7f7f0-cf26-495f-b2df-e8afe8481yu2`

### 

1\. Successful withdrawal

- End customer clicks the `Initiate withdrawal` on the Confirm Withdrawal details screen
- zerohash sends the following webhooks:
 - `initiatlized`
 - → The Platform updates their state machine for this transaction to `initialized`
 - `submitted`
 - → The Platform updates their state machine for this transaction to `submitted`
 - `pending`
 - → The Platform updates their state machine for this transaction to `pending`
 - `posted`
 - → The Platform updates their state machine for this transaction to `posted`
 - `settled`
 - → The Platform updates their state machine for this transaction to `settled` **and importantly, ensures that the end customer balances remains deducted by the withdrawal amount.**

### 

2\. Failure Case: The Platform does not receive any webhooks

- End customer clicks the 'Initiate withdrawal' button on the Confirm Withdrawal details screen
- zerohash sends the following webhooks:
 - `initiatlized`
 - → The Platform updates their state machine for this transaction to `initialized`
 - `submitted`
 - The Platform does not receive a `submitted` webhook
 - → The Platform does not update their state machine for this transaction to `submitted`
 - → **At this point, the Platform realizes there is an issue - the** `submitted` **status was not recognized by the Platform. An alert that the Platform set up is triggered.**. The next step that we recommend is to take the `payment_id` (zerohash's unique id for this transaction) and use that in the [GET /payments/{payment\_id}](https://docs.zerohash.com/reference/get_payments-payment-id) API call to attempt to get back to reconciliation. Given the matching logic stands true, you can use this endpoint to see the most recent status of the withdrawal.
 - Once back in a correct state by calling [GET /payments/{payment\_id}](https://docs.zerohash.com/reference/get_payments-payment-id) and seeing status = `pending`
 - → The Platform updates their state machine for this transaction to `pending`
 - Once back in a correct state by calling [GET /payments/{payment\_id}](https://docs.zerohash.com/reference/get_payments-payment-id) and seeing status = `posted`
 - → The Platform updates their state machine for this transaction to `posted`
 - Once back in a correct state by calling [GET /payments/{payment\_id}](https://docs.zerohash.com/reference/get_payments-payment-id) and seeing status = `settled`
 - → The Platform updates their state machine for this transaction to `settled` **and importantly, ensures that the end customer balances remains deducted by the withdrawal amount.**

### 

3\. zerohash sends back a null `payment_id` in the webhook

- End customer clicks the 'Initiate withdrawal' button on the Confirm Withdrawal details screen
- zerohash sends the following webhooks:
 - `initiatlized`
 - → The Platform updates their state machine for this transaction to `initialized`
 - The Platform receives a webhook with status = `submitted` but `payment_id` = null
 - → **At this point, the Platform realizes there is an issue - the** `payment_id` **is null. An alert that the Platform set up is triggered.**
 - The End Customer’s balance must **remain** debited on the platform’s side (do not release the funds back to the End Customer)
 - Assuming that for the rest of the webhooks (`pending`, `posted`, and `settled`) the Platform receives messages **without** a non-null `payment_id`, the expectation is the the Platform never returns the funds back to the end customer. You should reach out to zerohash escalating the issue

### 

4\. zerohash sends duplicate webhooks for a withdrawal that ends up succeeding on-chain

- End customer clicks the 'Initiate withdrawal' button on the Confirm Withdrawal details screen
- zerohash sends the following webhooks:
 - `initiatlized`
 - → The Platform updates their state machine for this transaction to `initialized`
 - `submitted`
 - → The Platform updates their state machine for this transaction to `submitted`
 - `pending`
 - → The Platform updates their state machine for this transaction to `pending`
 - `posted`
 - → The Platform updates their state machine for this transaction to `posted`
 - `posted` (2x)
 - → The Platform keeps their state machine for this transaction at `posted`
 - `settled`
 - → The Platform updates their state machine for this transaction to `settled` **and importantly, ensures that the end customer balances remains deducted by the withdrawal amount.**

### 

5\. zerohash sends back a different payment\_id than the one that was sent back in the POST /client\_auth\_token response

- End customer clicks the 'Initiate withdrawal' button on the Confirm Withdrawal details screen
- zerohash sends the following webhooks:
 - `initiatlized`
 - → The Platform updates their state machine for this transaction to `initialized`
 - The Platform receives a webhook for `submitted` but the `payment_id` = 0647f7f0-cf26-495f-b2df-e8afe8481ty2 (different than what was consumed on the `POST /client_auth_token` response)
 - → The Platform does not update their state machine to `submitted` and keeps funds encumbered

### 

6\. The withdrawal truly fails (for example, the blockchain has a processing issue) and the Platform should return the funds back to the End Customer

- End customer clicks the 'Initiate withdrawal' button on the Confirm Withdrawal details screen
- zerohash sends the following webhooks:
 - `initiatlized`
 - → The Platform updates their state machine for this transaction to `initialized`
 - `submitted`
 - → The Platform updates their state machine for this transaction to `submitted`
 - `pending`
 - → The Platform updates their state machine for this transaction to `pending`
 - `posted`
 - → The Platform updates their state machine for this transaction to `posted`
 - `failed`
 - → The Platform updates their state machine for this transaction to `failed` - the Platform can release the funds back to the End Customer

### 

7\. The End Customer starts the withdrawal process, but doesn't end up initiating a withdrawal. The JWT token expires.

- zerohash sends the following webhooks:
 - `initialized`
 - → The Platform updates their state machine for this transaction to `initialized`
 - 5 minutes since the JWT token generation elapses. zerohash sends an `abandoned` webhook
 - → The Platform updates their state machine for this transaction to `abandoned` - the Platform can release the funds back to the End Customer

Updated 20 days ago

---

Did this page help you?

Yes

No

Copy Page