# Source: https://docs.zerohash.com/changelog/auth-connect-webhook-fees-configurable-asset-precision-and-staged-exchange-testing

[Back to All](https://docs.zerohash.com/changelog)

Added

## 

Release Details

Release Date: July 20th, 2026

## 

Release Type

Informational – optional action from platforms

## 

Summary

Five AUTH updates are now available:

1. Fees in Connect webhooks. Deposit and withdrawal webhooks now include a `fees` object with fee amount, asset, and payment model. Deposit fees are populated for deposits without conversion; withdrawal fees follow the `NETTED` or `ADDITIVE` payment model.

2. Configurable asset precision for AUTH transfers. Platforms can set a maximum decimal precision per asset and network. Deposits and withdrawals submitted with more decimal places than the configured value are rejected, preventing sub-precision dust on the platform's ledger. To enable this feature, please reach out to your zerohash rep and they will configure your platform accordingly.

3. Staged exchange rollouts for AUTH integrations. Platforms can restrict a new AUTH integration to a defined list of participants for production QA before making it available to all users. To enable this feature, please reach out to your zerohash rep and they will configure your platform accordingly.

4. Preset deposit amount for the AUTH Fund flow. Platforms can pass `deposit_amount` inside `deposit_details` on the `/client_auth_token` request to preset the fund amount for the end user. The user lands on a prefilled amount and only sees accounts with sufficient balances to cover it. Enforcement is against the platform's existing FWC min and max deposit limits.

5. Gemini whitelisting instruction enhancements. The Gemini AUTH flow now includes clearer whitelisting instructions based on feedback from Gemini on their process, reducing transfer failures and support cases.

## 

Endpoints Impacted

Connect webhook events (fees added to payload):

- `connect_deposit.status_changed`
- `connect_withdrawal.status_changed`

`POST /client_auth_token` — new optional `deposit_details.deposit_amount` field accepted for the FWC permission.

No public API endpoints are impacted by the asset precision or staged exchange rollout features — both are enabled by zerohash on the platform's behalf and take effect inside the AUTH SDK experience.

## 

Relevant Documentation

- [Connect webhooks](https://docs.zerohash.com/reference/connect-webhooks)
- [AUTH Standalone](https://docs.zerohash.com/docs/auth-standalone)
- [Account Funding Onboarding API + Fund SDK](https://docs.zerohash.com/docs/fund-integration-guide-onboarding-api-fund-sdk-sdk#initialize-account-funding-flow)
- [Fund SDK](https://docs.zerohash.com/docs/fund-integration-guide-sdk#initialize-account-funding-flow)