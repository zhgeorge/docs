# Source: https://docs.zerohash.com/docs/zerohash-powered-plaid-link

# 

Onboarding with Plaid

A zerohash relationship manager will coordinate with platforms to gather all necessary information and handle the Plaid KYB verification process from start to finish on their behalf. This process must be completed before platforms can start invoking the zerohash SDK to verify and link end customer’s accounts.

# 

Using the zerohash SDK

Once Plaid onboarding has been completed, platforms can invoke the zerohash SDK with `appIdentifier: FIAT_ACCOUNT_LINK` to link and manage end customers’ bank accounts. See the example below for how to implement this in a React application. Keep in mind that if you're using a Native Mobile App (Swift, Flutter, etc) instead of using zh-web-sdk you should follow the WebView approach, described here:

TypeScript

```
import React from 'react';
import ZeroHashSDK, { AppIdentifier } from 'zh-web-sdk';

const App = () => {
  const sdk = new ZeroHashSDK({
    zeroHashAppsURL: "https://web-sdk.cert.zerohash.com",
    PAYJWT: "<JWT_TOKEN_HERE>" 
  });

    sdk.openModal({
    appIdentifier: FIAT_ACCOUNT_LINK, 
  })
  return <></>;
}

export default App;
```

The Plaid Link UX is wrapped within the zerohash SDK, delivering a streamlined bank account verification and linking process for end customers.

![](https://files.readme.io/3b8a9c6343c90f3a3b8227b801006929a8daa9f08d95099af3fc1c855fe5626c-Plaid.png) 

## 

Accept T's and C's

First time users will need to accept the zerohash terms and conditions.

## 

Link a bank account

End customers verify and link their external bank accounts. On success, zerohash will create a corresponding external account and return an `external_account_id` to the platform which can be stored by platforms and referenced for future payment requests. Adding a bank account is a one-time process for an end customer that verifies account ownership, so it is not something a customer has to do every time they want to initiate a transaction.

> 📘
> 
> ### 
> 
> There is a limit on external accounts linked to a participant
> 
> There is a default limit of three accounts linked per participant. If you need to change this, please contact your account manager.

### 

Successful Bank Account Link

Once an end user has successfully verified and linked their external account, we’ll send you a webhook that looks like this:

TypeScript

```
{
  "request_id": "0f68333e-2114-469d-b505-c850d776e063",
  "participant_code": "CUST01",
  "platform_code": "TES123",
  "account_nickname": "",
  "status": "approved",
  "external_account_id": "0f68333e-2114-469d-b505-c850d776e063",
  "created_at": "1975-08-19T23:15:30.000Z"
}
```

## 

Managing accounts linked via zerohash SDK

Platforms leveraging zerohash’s Fiat products should subscribe to webhooks to stay notified of external account updates, and can fetch external account details at any time.

### 

Querying accounts

Platforms can fetch linked external accounts via API using the [GET /payments/external\_accounts](https://docs.zerohash.com/reference/get_payments-external-accounts) endpoint.

### 

Expired accounts

When an external account has expired, platforms will receive the following webhook:

TypeScript

```
{
  "request_id": "0f68333e-2114-469d-b505-c850d776e063",
  "participant_code": "CUST01",
  "platform_code": "TES123",
  "account_nickname": "",
  "status": "expired",
  "external_account_id": "0f68333e-2114-469d-b505-c850d776e063",
  "created_at": "1975-08-19T23:15:30.000Z"
}
```

Platforms can invoke the zerohash SDK for re-linking:

TypeScript

```
import React from 'react';
import ZeroHashSDK, { AppIdentifier } from 'zh-web-sdk';

const App = () => {
  const sdk = new ZeroHashSDK({
    zeroHashAppsURL: "https://web-sdk.cert.zerohash.com",
    PAYJWT: "<JWT_TOKEN_HERE>" 
  });

    sdk.openModal({
    appIdentifier: FIAT_ACCOUNT_UPDATE, 
  })
  return <></>;
}

export default App;
```

### 

Revoked accounts

When an external account has revoked, platforms will receive the following webhook:

TypeScript

```
{
  "request_id": "0f68333e-2114-469d-b505-c850d776e063",
  "participant_code": "CUST01",
  "platform_code": "TES123",
  "account_nickname": "",
  "status": "revoked",
  "external_account_id": "0f68333e-2114-469d-b505-c850d776e063",
  "created_at": "1975-08-19T23:15:30.000Z"
}
```

Platforms can invoke the zerohash SDK for end customers to link a new account:

TypeScript

```
import React from 'react';
import ZeroHashSDK, { AppIdentifier } from 'zh-web-sdk';

const App = () => {
  const sdk = new ZeroHashSDK({
    zeroHashAppsURL: "https://web-sdk.cert.zerohash.com",
    PAYJWT: "<JWT_TOKEN_HERE>" 
  });

    sdk.openModal({
    appIdentifier: FIAT_ACCOUNT_LINK, 
  })
  return <></>;
}

export default App;
```

### 

Close an account

Platforms can close linked external accounts via API with REST endpoint [POST payments/external\_accounts/{external\_account\_id}/close](https://docs.zerohash.com/reference/post_payments-external-accounts-external-account-id-close)

Updated 4 months ago

---

### What’s Next

- [Managing linked accounts API Workflow](https://docs.zerohash.com/docs/managing-linked-accounts-api-workflow)

Did this page help you?

Yes

No

Copy Page