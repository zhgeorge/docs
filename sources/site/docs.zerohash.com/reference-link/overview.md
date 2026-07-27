# Source: https://docs.zerohash.com/reference-link/overview

Webhooks are a powerful tool for receiving real-time notifications about your payment updates from zerohash's systems. By configuring webhooks, you can streamline your workflow and stay informed about events related to your payments.

> 📘
> 
> ### 
> 
> One URL for all webhook events
> 
> As a platform, you will receive all webhook notifications **under one destination URL** that you provide for each environment (CERT and PROD).

## 

Configuring webhooks

- **Contact zerohash:** Reach out to zerohash directly to initiate the webhook configuration process. You can do this via the platform Slack channel or by contacting your zerohash relationship manager.
- **Provide URLs:** Provide the URLs for your production (Prod) and certification (Cert) webhooks to zerohash. These URLs will be where zerohash sends the webhook payloads.
- **Wait for Configuration:** zerohash will configure the webhooks within 2 business days of receiving the URLs. Once configured, you will start receiving webhook notifications according to your participant events.

## 

Webhook URLs

Ensure that you provide separate URLs for production and certification environments. This helps in distinguishing between live and test data, allowing you to safely test webhook integrations without affecting your production environment.

## 

Handling webhook payloads

Upon receiving webhook payloads, your system should be capable of processing and interpreting the data. Parse the payload according to the provided documentation and handle events appropriately based on your application logic.

## 

Retry policy

- Upon failure to send a webhook notification, Zero Hash will make up to **4** additional _fast_ retry attempts.
- Each _fast_ retry is delayed by **250 milliseconds** before contacting your webhook listener.
- If all _fast_ retries are exhausted, the notification is enqueued and re-attempted **3** more times using an _exponential backoff_ strategy.
- If all retries with _exponential backoff_ are exhausted, the notification is dropped. The client must then perform a manual state recovery upon resuming operation.

## 

Sequencing and order

The client should interpret event sequence not by the order of each webhook message, but instead by the `timestamp` field.

> 📘
> 
> ### 
> 
> Order of webhooks
> 
> When sorting webhooks to determine the sequence by which they happened, use the `timestamp` field. This field determines when the event associated with the webhook took place. Conversely, **you should not rely on the order by which you receive the webhook to determine the sequence.**

## 

Headers

We use headers to tell you important information about the notification we send. You can use that to tell different payloads, check for idempotency and important [Webhook Security](https://docs.zerohash.com/reference-link/webhook-security) information.

| Header Key | Type | Description |
| --- | --- | --- |
| `x-zh-hook-notification-id` | `string` | Notification ID, used for idempotency check |
| `x-zh-hook-payload-type` | `string` | Payload type. Use it to tell from different format |

## 

Payload type

Upon receiving webhook payloads, your system should be capable of processing and interpreting the data. Parse the payload according to the provided documentation and handle events appropriately based on your application logic.

We support the following values for `payload-type`:

- `participant_status_changed`: Check examples on [Participants](https://docs.zerohash.com/reference-link/participants-1)
- `participant_updated`: Check examples on [Participant onboarding status updates](https://docs.zerohash.com/reference/participant-onboarding-status-update)
- `payment_status_changed`: Check examples on [Payments](https://docs.zerohash.com/reference-link/payments-1)
- `deposit_fund_complete`: Check examples on [Account Funding](https://docs.zerohash.com/reference-link/fund-1)
- `external_account_status_changed`: Check examples on [External account status updates](https://docs.zerohash.com/reference-link/external-account-status-updates)
- `asset_mover_update`: Check examples on [Asset price change updates](https://docs.zerohash.com/reference-link/asset-price-change-updates)
- `account_balance.changed`: Check examples on [Account Balance](https://docs.zerohash.com/reference-link/account-balance)
- `trade.status_changed`: Check examples on [Trade Status](https://docs.zerohash.com/reference-link/trade-status)
- `deposit.status_changed`: Check examples on [Deposit Status](https://docs.zerohash.com/reference-link/deposit-status-updates)

Updated 21 days ago

---

### What’s Next

- [Webhook Security](https://docs.zerohash.com/reference/webhook-security)
- [Participants](https://docs.zerohash.com/reference/participants-1)
- [Payments](https://docs.zerohash.com/reference/payments-1)
- [Fund](https://docs.zerohash.com/reference/fund-1)

Did this page help you?

Yes

No

Updated 21 days ago

---

### What’s Next

- [Webhook Security](https://docs.zerohash.com/reference/webhook-security)
- [Participants](https://docs.zerohash.com/reference/participants-1)
- [Payments](https://docs.zerohash.com/reference/payments-1)
- [Fund](https://docs.zerohash.com/reference/fund-1)

Did this page help you?

Yes

No