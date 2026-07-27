# Source: https://docs.zerohash.com/docs/enterprise-settlements-no-code-integration-guide

## 

No-Code Solution

Companies that serve business customers (e.g., PSPs supporting merchants) can use the Modular Payouts No-Code Solution to convert fiat to stablecoins and settle funds on-chain to merchant-owned wallets without writing or maintaining any code. The end-to-end flow is still the same as the API or SDK solutions, with no engineering work required.

## 

High Level Flow of Funds

- The Platform will deposit fiat into a Float Account at zerohash held in their name
- Once instructed to do so, zerohash will convert USD to stablecoin (without the Platform or the Merchant being a counterparty to the conversion) and then immediately and automatically disperse the stablecoin to the Merchant's external stablecoin wallet
- The Merchant receives stablecoins in their wallet

## 

End to End Flow

1. Submit Merchant (KYB)
2. Fund float account
3. Whitelist Merchant destination addresses
4. Submit transaction file
5. zerohash converts USD to stablecoins and sends stablecoins on-chain
6. Complete end of day settlement (T+1)
7. View transaction activity

## 

1\. Submit Merchant (KYB)

Companies that use this product will be called "Platforms". Platforms will be responsible for onboarding their Merchant customers to zerohash through the [Client Portal](http://portal.zerohash.com/).

### 

Client Portal

- As a Platform, before this step, you will have already gotten access to the Client Portal. Sign in and complete the 2FA
- Once logged in, navigate to the top right and click `New Participant` - this is the first step to adding a new Merchant
- From there, enter the Merchant's onboarding information (including the business information, control persons/beneficial owners and relevant documents).
- Once the Merchant is submitted, they will be given a `participant_code` which is perpetually tied to the Merchant.

> 📘
> 
> ### 
> 
> Depending on the Platforms integration, Merchants will either be auto-approved (akin to a 'reliance model') or will be subject to a manual review

## 

2\. Fund float account

The Float Account is used to fund instant conversions of USD to stablecoins, as zerohash does not extend credit.

The Platform will fund the Float Account by sending fiat to the proper bank account, including the Platform's `participant_code` in the wire memos . This allows us to auto-credit the correct account when we receive the wire/ACH.

## 

3\. Whitelist Merchant destination addresses via Client Portal

**_This is a working section, consider these requirements fluid_**

Platforms can whitelist Merchant destination addresses via the zerohash Client Portal. Once logged in, make sure you select the correct Merchant from the top left drop-down - you'll want to make sure whichever address you whitelist is associated with the correct Merchant.

Instructions:

- Select correct Merchant from top left drop-down
- Go to Participant → Withdrawals
- Select the asset you which to whitelist an address for (ie, USDC)
- Click `Create new account`
- Enter address details
- One or two (depending on your security preferences) other account admin will need to approve the whitelisted address before it becomes `approved`

## 

4\. Initiate Transactions via SFTP

Stablecoin conversions and disbursements can be initiated with a successful file drop onto a dedicated SFTP server.

Secure File Transfer Protocol (SFTP) is a network protocol used for securely transferring files between systems. Each Platform has its own dedicated SFTP folder. Server details will be communicated to each Platform securely.

**Working Directories**

- \[platform\]/sftp/in → Files uploaded from the Platform goes into the ‘in’ path.
- \[platform\]/sftp/out → After processing ‘in’ files, zerohash will output a result file into ‘out’ path.

**Initiating Settlements**

- Upload CSV file with the payouts details to the dedicated working directory: `[platform]/sftp/in/settlement/{year}/{month}/{day}/{file_name}.csv`
 - `file_name` is determined by the Platform. zerohash will use the same name when producing associated output files.
 - ⚠️ The maximum number of payouts (rows) allowed per batch file is 1000.
 - The following datapoints must be included in this order in the file. We will "fail" the file drop similar to a REST API call if these conditions are not met

| Input Attribute Name | Example | Requirements |
| --- | --- | --- |
| reference\_id | 16cbbdf1-cace-4591-8fe2-13c0b84fc21e | Internal ID for the Platform's own reference. This must be unique and will be used for idempotency. (i.e., ensuring the same request is processed only once even if submitted multiple times) |
| client\_external\_id | PO4007899055 | Valid ID of already onboarded Merchant. This ID should be linked at onboarding to the Merchant and their corresponding whitelisted wallet. |
| quoted\_amount | 1000.00 | The fiat amount to be converted and withdrawn to the whitelisted wallet. Must be a valid number - All rows for that day must be cumulatively below the current Float Account balance |
| quoted\_currency | USD | The fiat asset being quoted. For now, only USD is supported. |
| conversion\_currency | USDC.BASE | The cryptocurrency to be used for the payout. Must be a [valid asset](https://docs.zerohash.com/docs/supported-assets-instruments) that zerohash supports. |
| external\_account\_id | 3cc93b20-ee43-4877-8cdc-863e61829088 | The zerohash id for the whitelisted wallet, where funds will be withdrawn to. Must be an `approved` whitelisted address associated with the Merchant's zerohash participant code. |

## 

5\. zerohash converts USD to stablecoins and sends stablecoins on-chain

Once a successful file upload takes place, zerohash will

- Process the file, automatically and immediately converting USD to stablecoin.
- Automatically and immediately payout the Conversion Asset on-chain to the destination address.
- Produce an output file to the Platform's dedicated working directory: `[platform]/sftp/out/settlement/{year}/{month}/{day}/{batch_id}.csv`

The output file will includes same columns provided in the input file, in addition to:

| Additional Output Attributes | Description |
| --- | --- |
| transaction\_hash | Blockchain transaction hash for the payout. |
| status | [Status](https://docs.zerohash.com/reference/payments-status-changes#payments-statuses) associated with the payout. |
| status\_reason | Associated status reason, if relevant. |

## 

6\. Complete end of day settlement (T+1)

It is a regulatory requirement of zerohash's for the Platform to perform settlement on a T+1 basis. For example, if a Platform executed $1,000,000 worth of Payouts on Monday, on Tuesday we expect a wire of $1,000,000 in order to consider Monday's settlement "closed".

## 

7\. View transaction activity

**_This is a working section, consider these requirements fluid_**

Platforms have the option to view Transaction activity via the Client Portal.

Instructions:

- Go to Participant → Withdrawals
- View the Withdrawal activity in the bottom `[asset] Withdrawal Requests` section

Updated 20 days ago

---

Did this page help you?

Yes

No

Copy Page