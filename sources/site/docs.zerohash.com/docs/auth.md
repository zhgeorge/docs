# Source: https://docs.zerohash.com/docs/auth

![](https://files.readme.io/3bb4f1c5d5e5b56d0c6f36f225b07d641bb64e9468e8bd8c6ae7244281cbdb17-Auth_Validate_-_Pre-crediting_Name_Match.png)

## 

Introduction

**Auth enables direct account-to-account transfers between custodial accounts (i.e., exchanges and fintechs) and non-custodial accounts.**

Backed by a deep network of supported venues, Auth eliminates manual and error-prone transfer steps that lead to fragmented user experiences. Our platform handles secure authentication, initiates transfers, and ensures visibility and adherence to key compliance and AML standards. Offered through easy-to-integrate SDKs, Auth is built for scale, security, and seamless user journeys.

![https://docs.zerohash.com/docs/auth-network](https://files.readme.io/030962bd84416d05ff55553fbea2053d12402595bf1217670fac2cea7fc8311d-Integrations.png)

[See full list of Auth integrations →](https://docs.zerohash.com/docs/auth-network)

## 

Auth Lite vs. Auth Validate

You can choose between two versions of Auth:

> 🔐
> 
> ### 
> 
> Auth Lite
> 
> 1. Provides tech connectivity without account-matching validation between the end-user account and the external account being connected.
> 2. Enables faster and more flexible integrations with minimal friction for end users.
> 3. Works best for low-risk or closed-loop environments where account ownership verification is not required.

> ✔️
> 
> ### 
> 
> Auth Validate
> 
> 1. Performs account matching between the KYC’d customer record and the external account being connected.
> 2. Adds a layer of identity verification to reduce the risk of misdirected transfers or fraud.
> 3. Supports compliance with internal policies or regulatory requirements that require account ownership validation.

> 📘
> 
> ### 
> 
> For select platform partners, zerohash may provide a combination of Auth Lite and Auth Validate to meet the greater complexity of their integration and desired level of risk mitigation.

## 

Configuration rules

Tailor your Auth setup using the available configuration options:

![](https://files.readme.io/fe1f39de64702e85f1d2b388b1777e5e9c1e0260969db23f1ddae2f205f23ce5-Connect_3.png)

### 

Customizations and support

If you have further questions about the algorithm or need guidance on configuring the appropriate match threshold, reach out to your zerohash representative. They can connect you with our Product, Engineering, or Compliance teams for more in-depth support.

## 

Different applications of Auth

Auth can be offered as a **standalone** product or **bundled within one of our Move products** (Payouts, Payins, or Account Funding).

### 

Auth - Standalone

Auth - Standalone enables your users to transfer crypto and stablecoin assets to and from their accounts on your platform, whether they're coming from custodial wallets or non-custodial sources. It provides a more user-friendly, integrated alternative to traditional deposit and withdrawal flows.

### 

Auth - Bundled with Move

Zerohash offers three Move products:

- Payouts
- Payins
- Account Funding

You can choose to enable Auth for any of these products. Example use cases:

- **Payouts:** Allow users to authenticate with their MetaMask wallet via our SDK and initiate payouts directly from their marketplace balance.
- **Payins:** Let users authenticate with their Coinbase exchange account via our SDK and pay for goods or services directly from their balance.
- **Account Funding:** Enable users to connect their Gemini account through our SDK and initiate transfers to fund their prediction market balance.

Updated 21 days ago

---

Did this page help you?

Yes

No

Copy Page