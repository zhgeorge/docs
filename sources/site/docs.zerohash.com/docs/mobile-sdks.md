# Source: https://docs.zerohash.com/docs/mobile-sdks

zerohash supports native mobile SDKs, enabling developers to embed products directly into their iOS and Android applications with minimal effort. This addition brings faster integration, improved performance, and a more seamless user experience compared to traditional mobile-web or API-only implementations.

## 

iOS

### 

GitHub links

- [Main Repo](https://github.com/zerohash-ext/zerohash-ios)
- [Repo readme](https://github.com/zerohash-ext/zerohash-ios/blob/main/README.md)

#### 

Requirements

- iOS 13.0+
- Swift 5.0+
- Xcode 13.0+

### 

Installation via Xcode

1. In Xcode, select **File > Add Package Dependencies...**
2. Enter the repository URL: [`https://github.com/zerohash-ext/zerohash-ios`](https://github.com/zerohash-ext/zerohash-ios)
3. Select the version rule you want to use. We recommend **Up to Next Major Version**.
4. Click **Add Package**
5. On the next popup, select your app target and click on `Add Package`
6. Confirm that the zerohash SDK is now listed on your app's package dependencies:
7. Go to your application target and make sure that zerohash SDK is listed under `Frameworks, Libraries and Embedded Content`

#### 

Integration

Follow the following steps:

1. Create a View in your application that will trigger the Auth flow
2. Import the SDK
3. When clicking a button or other UI element, start the flow:
 1. Get a JWT from a backend API
 2. Configure the SDK appearance, environment and callbacks you want to use.
 1. Callbacks will return the same data described [here](https://docs.zerohash.com/docs/front-end-callbacks)
 3. Use the present method sending the View to render the SDK.

##### 

Example

Also represented in our code recipe [here](https://docs.zerohash.com/recipes/ios-sdk-auth).

Swift

```
import UIKit
import ZerohashSDK

class FundViewController: UIViewController {

    private var fundSession: ZerohashFundSession?

    @IBAction func startFundTapped(_ sender: UIButton) {
        let callbacks = FundCallbacks(
            onClose: { print("Fund closed") },
            onError: { error in
                print("Fund error \(error.code): \(error.message)")
            },
            onEvent: { event in
                print("Fund event: \(event.type)")
            },
            onFund: { fund in
                if fund.success {
                    print("✅ Deposit processed — status: \(fund.status ?? "unknown")")
                } else {
                    print("⏳ Deposit status: \(fund.status ?? "unknown")")
                }
            }
        )

        fundSession = ZerohashSDK.configureFund(
            jwt: "your-jwt-token",
            environment: .production,
            theme: .system,
            callbacks: callbacks
        )

        fundSession?.present(from: self)
    }
}
```

## 

Android

### 

GitHub links

- [Main Repo](https://github.com/zerohash-ext/zerohash-android)
- ​[Repo readme](https://github.com/zerohash-ext/zerohash-android/blob/main/README.md)

## 

Requirements

- Android 5.0+ (API 21)
- Kotlin 1.9+
- Android Studio Hedgehog (2023.1.1) or later

### 

Installation via Gradle

1. In your app's `build.gradle.kts`, add the SDK dependency:

 Kotlin

    ```
    dependencies {
        implementation("com.github.zerohash-android:zerohash-android:1.0.0")
    }
    ```

2. Sync your Gradle project.

3. Confirm that zerohash-sdk appears in your project's External Libraries.

## 

Integration

Follow these steps:

1. Create an Activity or Fragment in your application that will trigger the zerohash flow
2. Import the SDK
3. When clicking a button or other UI element, start the flow:
 - Get a JWT from a backend API.
 - Configure the SDK appearance, environment, and callbacks you want to use.
 - Callbacks will return the same data described in the front-end callbacks documentation.
 - Call the present method passing your current Activity.

### 

Example

Represented in our code recipe:

Kotlin

```
import com.zerohash.sdk.ZerohashSDK
import com.zerohash.sdk.ZerohashError
import com.zerohash.sdk.Environment
import com.zerohash.sdk.GenericEvent
import com.zerohash.sdk.Theme
import com.zerohash.sdk.fund.FundCallbacks
import com.zerohash.sdk.fund.FundCompletedEvent
import com.zerohash.sdk.fund.ZerohashFundSession

class MainActivity : AppCompatActivity() {

    private var fundSession: ZerohashFundSession? = null

    private fun openFund(jwt: String) {
        fundSession = ZerohashSDK.configureFund(
            jwt = jwt,                              // required
            environment = Environment.PRODUCTION,   // optional (default)
            theme = Theme.SYSTEM,                    // optional (default)
            callbacks = object : FundCallbacks {
                override fun onClose() { fundSession = null }
                override fun onError(error: ZerohashError) { /* show error */ }
                override fun onEvent(event: GenericEvent) { /* analytics */ }
                override fun onFundCompleted(event: FundCompletedEvent) {
                    // event.transactionId, event.assetSymbol, event.amount,
                    // event.depositAddress, event.network, event.fundId,
                    // event.notionalAmount
                }
            }
        )
        fundSession?.present(this)
    }

    override fun onDestroy() {
        super.onDestroy()
        fundSession?.cancel()
    }
}
```

---

> ## 
> 
> Capacitor
> 
> Building on Capacitor instead of native or React Native? The zerohash Capacitor plugin wraps the native iOS and Android SDKs so you can present the Fund flow from a Capacitor app. See the [Capacitor plugin guide](https://docs.zerohash.com/docs/capacitor-plugin).

Updated 17 days ago

---

Did this page help you?

Yes

No

Copy Page