# Source: https://docs.zerohash.com/reference/participants

The Participants domain covers everything related to the individuals and entities your platform onboards onto zerohash. A participant is any end user or business you've registered with zerohash so they can hold balances and transact — and these endpoints are how you create, read, and manage those records programmatically.

For engineers, this domain is the backbone of most integrations. Before a participant can trade, settle, or move funds, they need to exist in zerohash, pass KYC, and be eligible for the jurisdiction they're in. These endpoints let you drive that lifecycle from your own systems — onboarding new participants, checking their status, reading their profile and limits, and (where enabled) retrieving their identity data and documents.

There are two ways to onboard participants:

- API integration — Onboard participants directly through these endpoints for a fully integrated solution, using your own frontends. You collect and submit the customer's data, giving you complete control over the onboarding experience.
- zerohash KYC SDK — Alternatively, use the [zerohash KYC SDK](ref:sdk-modules-user-onboarding](https://docs.zerohash.com/reference/sdk-modules-user-onboarding). With this flow, zerohash performs KYC on the customer's data and provides status updates through the [webhook notification](https://docs.zerohash.com/reference/participant-status-updates) system or via polling the [GET /participants](https://docs.zerohash.com/reference/get_participants) REST API.

---

## 

Groups

### 

[Basic participant management](https://docs.zerohash.com/reference/query-participants)

Read-only lookups for the core participant records zerohash holds — resolve a participant by `participant_code` or `email`, list the participants under your platform, and read their profile details. This is typically the first thing you'll integrate, and the foundation for keeping your systems in sync with zerohash.

### 

[Onboarding & eligibility](https://docs.zerohash.com/reference/participant-jurisdictions)

Reference and eligibility endpoints used before and during onboarding — list the supported countries and jurisdictions, and evaluate whether a prospective participant can be onboarded for a given location and product. Use these to drive form validation, gate onboarding flows, and fail fast on ineligible submissions.

### 

[KYC, PII & documents](https://docs.zerohash.com/reference/participant-details)

Endpoints for reading the sensitive identity data zerohash holds for a participant — KYC status, sanctions screening, full PII records, and uploaded verification documents. Because these return PII, they require enablement by the zerohash support team and are subject to a security review prior to enablement; access is granted on a least-privilege basis.

---

## 

Getting started

1. **Onboard or locate a participant** — create a participant (or look one up with the basic management endpoints).
2. **Confirm eligibility** — use the onboarding & eligibility endpoints to validate the participant's country/jurisdiction.
3. **Check KYC status** — confirm the participant has passed KYC before enabling product flows.
4. **Read profile, and (if enabled) KYC/PII data** as your application requires.

> **A note on access:** Basic management and eligibility endpoints are part of the standard integration surface. 
> The KYC/PII and document endpoints are gated behind a security review and must be enabled by the zerohash support team.

Updated 26 days ago

---

Did this page help you?

Yes

No

Updated 26 days ago

---

Did this page help you?

Yes

No