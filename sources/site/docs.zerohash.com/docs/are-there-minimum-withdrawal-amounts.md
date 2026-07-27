# Source: https://docs.zerohash.com/docs/are-there-minimum-withdrawal-amounts

Blockchain networks enforce minimum withdrawal amounts for transactions. Different blockchains have specific rules around withdrawal minimums, also known as dust amounts, that transactions needs to be higher than or else it will be rejected by the network and therefore the Zero Hash API.

Additionally, UTXO withdrawals for an amount that are less than the estimated network fee at the time of transferring will be rejected as outlined in the below table. UTXO transactions are sent in batches, so even if a transaction amount is larger than the enforced network minimums, it may be delayed until it is picked up in a batch which can depend on the amount being transferred and current network demand.

The following table is applicable to endpoints `POST /withdrawals/requests` and `GET /convert_withdraw/rfq`:

## 

Minimum Withdrawal Amounts and Network Requirements

| Assets | Network Minimum | Other Minimums |
| --- | --- | --- |
| UTXO assets (e.g., BTC, BCH, LTC, ADA)\* | 0.00000582 | Quantity must be greater than the quoted fee amount (which can vary). |
| Non-UTXO assets (e.g., ETH, USDC) | 0.000001 | N/A |
| Solana (SOL)\*\* | N/A | Transfers must be greater than the rent-exempt minimum of 0.00089088 SOL |
| Ripple (XRP)\*\*\* | N/A | Addresses must have a minimum of 10 XRP |
| Algorand (ALGO)\*\*\*\* | 0.000001 ALGO | Addresses must maintain a minimum balance of 0.1 ALGO plus 0.1 ALGO for each additional token |
| Aptos (APT) | N/A | Minimum supported withdrawal size is 0.02 APT |

In addition to the above network requirements, there are **recommended Minimum Withdraw Amounts** for sending transactions through Zero Hash that will avoid sending transactions close to the dust amount that could potentially be rejected. Per the table above, minimum network fees can vary so it is recommended to use a UTXO amount at least an order of magnitude greater than the typical dust amount (or higher depending on the blockchain) though this is not enforced by the API.

- Bitcoin (Bitcoin Network) - 0.00001 BTC
 - Bitcoin (Lightning Network) - 1 satoshi
- Bitcoin Cash - 0.00001 BCH
- Dogecoin - 0.01 DOGE
- Ethereum - 0.005 ETH
- Litecoin - 0.00001 LTC
- Ripple - 0.0001 XRP
- Cardano - 1 ADA
- Polkadot - 1 DOT
- Solana - 0.001 SOL
- Stellar - 1 XLM

\*The dust cutoff at the default node value for the default rate (3000 sat/kB) puts the dust amount at 546 satoshis for legacy, 540 for P2SH (3 prefix), and 294 satoshis for segwit (bc1 prefix). Zero Hash enforces the higher 546 satoshi dust amount for all UTXO chains due to the dust limit being dynamic. These cutoffs are valid in the theoretical case of a single input and single output. In practice, it is highly probable Zero Hash will have a change output which doubles the output size, further insulating withdrawals from the dust cutoff. Due to these measures, it is possible but unlikely that a given UTXO withdrawal following these guidelines would be rejected by the network.

## 

Blockchain Specific Rules

### 

Polkadot (DOT)

On the Polkadot network, an address is only active when it holds a minimum amount, currently set at 1 DOT. Transfers for less than 1 DOT will be rejected by the blockchain if the destination address balance is less than 1 DOT.

This is so accounts with very small balances, or completely empty, do not "bloat" the state of the blockchain in order to maintain high performance and to reduce fees.

### 

Solana (SOL)

SOL wallets require a "rent-exempt minimum" of 0.00089088 SOL. Transactions to wallets with a balance below this amount will be pending on the network until the wallet has an amount greater than this deposited, however there is not a withdrawal minimum. Zero Hash enforces this restriction as a withdrawal minimum by assuming destination wallets do not have balances to avoid this indefinite pending state. More info on the rent exemption here from [Solana Accounts | Solana Docs](https://solana.com/docs/core/accounts).

### 

Ripple (XRP)

The Ripple Ledger applies reserve requirements in XRP. A minimum 10 XRP is required for each address in the ledger. Any withdrawals under 10 XRP may fail if the wallet does not have the minimum base reserve of 10 XRP.

### 

Algorand (ALGO)

Wallets at Zero Hash using Algorand and tokens on the Algorand blockchain must hold a minimum of 0.1 ALGO if only holding ALGO, or 0.201 ALGO if holding an additional token such as USDC on Algorand. You will be unable to withdraw funds on this blockchain that would take the balance below this amount. See [https://developer.algorand.org/docs/features/asa/#assets-overview](https://developer.algorand.org/docs/features/asa/#assets-overview) for further information.

## 

Maximum Network Fee

Network fees are fees paid to the validators to incentivize the functioning of the network. These can be setup different ways and vary for each blockchain. For certain tokens like ERC20s built on Ethereum like USDC, the token itself can have one value (typically pegged to the dollar in this case) but the network fee will be paid in the underlying L1 chain, in this case ETH.

The typical flow is that a participant of Zero Hash obtains a network fee estimate and then will accept and execute a transaction. For RFQ quotes, the price is locked for 5 or 30 seconds, depending on which endpoints the platform is calling.

For Ethereum, ZH has a maximum gas fee\* of 350 gwei in Prod and CERT environments.

\*Maximum gas price is implemented as a safety mechanism to prevent unintended expensive network fee charges during Ethereum gas fee spikes. Please reach out to your Zero Hash account team with any questions.

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page