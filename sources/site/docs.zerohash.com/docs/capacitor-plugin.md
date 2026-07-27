# Source: https://docs.zerohash.com/docs/capacitor-plugin

# 

Capacitor plugin

Embed zerohash's Fund (deposit) flow into a Capacitor app. The plugin wraps the native zerohash iOS and Android SDKs and presents their Fund UI over your app, so teams building on [Capacitor](https://capacitorjs.com) can use the native SDKs without writing platform-specific bridge code.

The native Swift and Kotlin SDKs remain the source of truth; this plugin is a thin translation layer that exposes them to Capacitor. It currently supports the Fund (deposit) flow.

## 

Prerequisites

Before you start, make sure you have:

- A Capacitor app targeting iOS, Android, or both.
- iOS 15 or later, and Android `minSdkVersion` 24 or later.
- A backend that mints a short-lived Fund session JWT from the zerohash API. You pass this token to the plugin when you present the flow.

## 

Install

Bash

```
npm install @zerohash-sdk/capacitor
npx cap sync
```

## 

Platform setup

### 

Android

The plugin's Android side pulls in the native zerohash Android SDK (`com.github.zerohash-ext:zerohash-android`), which is hosted on JitPack. Add JitPack to your app's Gradle repositories so it can be resolved:

Kotlin

```
allprojects {
    repositories {
        google()
        mavenCentral()
        maven { url = uri("https://jitpack.io") }
    }
}
```

If your project uses `dependencyResolutionManagement`, add the same `maven { ... }` line to that block in `settings.gradle` instead.

### 

iOS

No extra steps are required. `npx cap sync` wires in the native SDK automatically through Swift Package Manager.

## 

Present the Fund flow

Register your event listeners before presenting the flow, then call `presentFund` with the JWT your backend minted.

TypeScript

```
import { Zerohash } from '@zerohash-sdk/capacitor';

// Register listeners before presenting.
await Zerohash.addListener('fundCompleted', (event) => {
  console.log('Deposit complete', event);
});
await Zerohash.addListener('close', () => console.log('Flow closed'));
await Zerohash.addListener('error', (e) => console.error(e.code, e.message));

// Present the Fund flow. The JWT is a short-lived Fund session token that
// your backend mints from the zerohash API.
await Zerohash.presentFund({
  jwt: '<fund-session-jwt>',
  environment: 'production', // or 'sandbox'
  theme: 'system',           // 'light' | 'dark' | 'system'
});
```

To manage the session, call `Zerohash.cancel()` to dismiss the flow programmatically, `Zerohash.isActive()` to check whether it's currently presented, and `Zerohash.removeAllListeners()` when tearing down.

The `error`, `event`, and `fundCompleted` listeners return the same data described in [Front-end callbacks](https://docs.zerohash.com/docs/front-end-callbacks).

## 

API reference

### 

Methods

| Method | Signature | Description |
| --- | --- | --- |
| `presentFund` | `presentFund(options: PresentFundOptions) => Promise<void>` | Presents the Fund (deposit) flow. Rejects if a session is already active. |
| `cancel` | `cancel() => Promise<void>` | Dismisses the active Fund session, if any. |
| `isActive` | `isActive() => Promise<{ isActive: boolean }>` | Reports whether a Fund session is currently presented. |
| `addListener` | `addListener(eventName, listenerFunc) => Promise<PluginListenerHandle>` | Registers a listener for one of the events below. |
| `removeAllListeners` | `removeAllListeners() => Promise<void>` | Removes all listeners registered by the plugin. |

### 

`PresentFundOptions`

| Property | Type | Description |
| --- | --- | --- |
| `jwt` | `string` | Short-lived Fund session JWT, minted by your backend from the zerohash API. |
| `environment` | `ZerohashEnvironment` | `'sandbox'` or `'production'`. Defaults to `production`. |
| `theme` | `ZerohashTheme` | `'light'`, `'dark'`, or `'system'`. Defaults to `system`. |
| `allowList` | `string[]` | Restricts the hosts the embedded WebView may load. Android only — passing it on iOS rejects the call. |

### 

Events

Register these with `addListener`.

| Event | Payload | Fires when |
| --- | --- | --- |
| `close` | none | The user closes the Fund flow. |
| `error` | `ZerohashErrorEvent` | The Fund flow reports an error. |
| `event` | `GenericEvent` | A low-level event is forwarded from the Fund flow. |
| `fundCompleted` | `FundCompletedEvent` | A deposit completes successfully. |

### 

Event payloads

`ZerohashErrorEvent`

| Property | Type |
| --- | --- |
| `code` | `string` |
| `message` | `string` |

`GenericEvent`

| Property | Type |
| --- | --- |
| `type` | `string` |
| `data` | `{ [key: string]: unknown }` |

`FundCompletedEvent` — any field the flow doesn't provide is `null`.

| Property | Type |
| --- | --- |
| `depositAddress` | `string | null` |
| `network` | `string | null` |
| `assetSymbol` | `string | null` |
| `amount` | `string | null` |
| `transactionId` | `string | null` |
| `fundId` | `string | null` |
| `notionalAmount` | `string | null` |

### 

Type aliases

| Type | Values | Description |
| --- | --- | --- |
| `ZerohashEnvironment` | `'sandbox' | 'production'` | Which zerohash environment the Fund session runs against. |
| `ZerohashTheme` | `'light' | 'dark' | 'system'` | Color scheme for the Fund UI. `system` follows the device setting. |

Updated 17 days ago

---

Did this page help you?

Yes

No

Copy Page