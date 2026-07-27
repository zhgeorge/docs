# Source: https://docs.zerohash.com/docs/fiat

ACH is a system used for electronic funds transfer in the United States that enables the transfer of funds directly between bank accounts.

ACH payments are cost-effective, convenient, and a trusted method of money movement.

ACH transactions are governed by rules and regulations established by Nacha to ensure the secure and efficient transfer of funds between financial institutions. These regulations include requirements for authorization, processing times, and dispute resolution procedures.

RTP stands for Real time payments. Managed by The Clearing House.

FedNow is a real time payment service provided by the Federal Reserve.

RTP and FedNow are combined to provide full coverage (under network type `rtp` on the API). FedNow is invoked automatically when RTP is not available.

## 

Use Cases

- **On-ramp:** Platforms can offer a direct payment method to end customers that's typically more cost effective than card payments, and potentially offers higher transaction limits.
- **Off-ramp:** End customers can withdraw fiat directly to their bank account, rather than withdrawing crypto to a third party and executing trades there.
- **Alternative payment method:** Platforms can diversify customer funding options beyond card payments.

## 

Key Features

- **Cost effective :** ACH and RTP payments often have low transaction fees making it a cost effective alternative to other electronic payments.
- **Processing optionality :** ACH and RTP payments can be processed same-day or standard depending on customer demand and desired platform support.
- **Capital efficiency:** No need to fund a float account to fund trades, pull money from customer bank accounts directly instead. (_implementation dependent_)
- **Flexibility :** zerohash supports two methods of ACH funding depending on the preferred liquidity model for platforms. For information on getting started with ACH, check out our guides here;
 - [Prefunded API Workflow](https://docs.zerohash.com/docs/prefunded-api-workflow).
 - [On-demand API Workflow](https://docs.zerohash.com/docs/on-demand-api-workflow).

## 

API Reference

- [Payments API docs](https://docs.zerohash.com/reference-link/payments)
- [Payments webhooks](https://docs.zerohash.com/reference-link/payments-1)

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page