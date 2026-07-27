# Source: https://docs.zerohash.com/changelog/new-sdk-version

[Back to All](https://docs.zerohash.com/changelog)

# 

Release Details

**Release Date:** May 26, 2026

# 

Summary

## 

SDK Version 3.0.0

zerohash is upgrading its SDK to [**version 3.0.0**](https://www.npmjs.com/package/zh-web-sdk/v/3.0.0), featuring a new architecture and a **fully refreshed UI**. All SDKs now share a unified look and feel, bringing cohesion across the entire suite. Platforms can also configure **light and dark mode** to match their product experience. For full details on the new UI and configuration options, see [here](https://docs.zerohash.com/docs/update-appearance).

To give platforms time to transition, we will continue supporting all versions up to and including 2.17.0 **until August 31**, after which they will be **fully deprecated.**

# 

Timeline

- **Today**: [v3.0.0](https://www.npmjs.com/package/zh-web-sdk/v/3.0.0) is available on npm. v2.x is still fully supported.
- **Now through Aug 31, 2026**: Both v2.x and v3.x are supported in parallel. Upgrade at your own pace.
- **Aug 31, 2026**: v2.x is deprecated. Continued support is not guaranteed past this date.

# 

How to upgrade

The public API is unchanged, so the upgrade is just a version bump in most cases.

## 

**1\. Install v3:**

Bash

```
npm install zh-web-sdk@3
# or
yarn add zh-web-sdk@3
```

## 

**2\. (Optional) Set a theme:**

The new SDKs support `'light'`, `'dark'`, and `'auto'` themes. Default is `'light'`.

TypeScript

```
const sdk = new ZeroHashSDK({
  zeroHashAppsURL: "https://web-sdk.zerohash.com",
  env: "prod",
  theme: "dark"   // 'light' | 'dark' | 'auto'
});
```

You can also change theme at runtime:

TypeScript

```
sdk.setTheme({ theme: "auto" });
```

## 

**3\. Build and deploy.**

No code changes required to your `openModal`, `setJWT`, or `closeModal` calls. The new UIs render automatically.

# 

What stays the same

- All `AppIdentifier` values (`FUND`, `ONBOARDING`, `CRYPTO_BUY`, etc.)
- `openModal`, `closeModal`, `setJWT`, `setFilters`, `isModalOpen`
- JWT acquisition and authentication flow
- All `postMessage` events you listen for today (`FUND_APP_LOADED`, `FUND_COMPLETED`, `FUND_FAILED`, etc.). Same names, same payloads.

# 

SDK's in scope

_All_ SDK's are included in this upgrade. Listing out here for reference:

| SDK `permission` | Description |
| --- | --- |
| `crypto-withdrawals` | Crypto withdrawals |
| `crypto-buy` | Crypto buy |
| `crypto-sell` | Crypto sell |
| `fiat deposits` | Fiat deposits |
| `fiat-withdrawals` | Fiat withdrawals |
| `fiat-account-link` | Fiat - link account |
| `crypto-account-link` | Crypto- link account |
| `crypto-pay` | Crypto/stablecoin payins |
| `crypto-payouts` | Crypto/stablecoin payouts |
| `onboarding` | KYC for end users/natural persons |
| `fwc` | Account Funding |
| `participant-profile` | Display already-KYC'd user profile information |
| `update-participant` | Update participant |
| `recovery` | Recovery (ie, funds sent on the wrong chain and users can withdraw) |

## 

Support and Resources

Please contact your dedicated Relationship Manager for questions about how to upgrade SDK's