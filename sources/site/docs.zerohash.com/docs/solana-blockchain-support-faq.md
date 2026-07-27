# Source: https://docs.zerohash.com/docs/solana-blockchain-support-faq

## 

Overview

Solana is an open source project created by the Solana Foundation headquartered in Geneva, Switzerland. Development work began in 2017 and the mainnet, or production-ready version, was launched in March 2020. The native token on the Solana network is the SOL used to pay for transaction fees, and the Solana Program Library (SPL) allows tokens to be deployed on top of the L1 network such as USDC on Solana.

## 

How many Transactions Per Second (TPS) can Solana process?

Solana was designed to overcome some of the scaling challenges seen with earlier blockchains like Ethereum and Bitcoin that can process 10s of TPS. Solana can handle thousands of TPS and is furthering that into the tens of thousands. The chain also supports additional functionality like smart contracts which has led to a growing number of DApps and NFTs created specifically for Solana.

Solana uses an automated transaction ordering system and a proof of history consensus layer that results in higher transaction throughput compared to chains like Bitcoin (proof of work) and Ethereum (proof of stake).

## 

How does zerohash implement Solana transactions?

zerohash implements Solana withdrawals using [Durable Nonces](https://docs.solanalabs.com/cli/examples/durable-nonce) to prevent transactions from expiring if they are not confirmed within Solana’s short transaction window. In cases where there is a network delay, this functionality can still allows zerohash to receive a transaction confirmation.

## 

What Solana Network does zerohash’s CERT environment use?

Solana has both a development network (DevNet) and a test network (TestNet) each with their own test tokens. zerohash’s CERT environment points to Solana’s **DevNet**. If you are utilizing a 3rd party faucet such as SolFaucet (not affiliated with nor endorsed by zerohash) then be sure to select DevNet so that the right tokens are sent to your wallet.

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page