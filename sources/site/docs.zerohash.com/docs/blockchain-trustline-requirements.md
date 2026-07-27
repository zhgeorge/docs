# Source: https://docs.zerohash.com/docs/blockchain-trustline-requirements

Unlike many other blockchains, the Stellar and Ripple (XRPL) networks require your wallet to explicitly "trust" a specific asset before it can receive it. This security feature is called a Trustline. If you attempt to withdraw USDC or RLUSD to a wallet that hasn't established this trustline, the network will automatically reject the transaction to prevent unauthorized tokens from entering your account.

To resolve this, ensure your destination wallet is activated and contains a small amount of the network’s native token (XLM for Stellar or XRP for Ripple) to cover the required reserve for the trustline. You must then manually "Add" or "Enable" the specific asset (USDC or RLUSD) within your wallet’s settings. Once the trustline is active on-chain, you can resubmit your withdrawal request.

### 

Please Note:

For specific issuer addresses or technical help, please consult your wallet provider’s documentation on "Adding Trustlines."

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page