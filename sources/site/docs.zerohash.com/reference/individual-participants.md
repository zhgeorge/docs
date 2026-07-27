# Source: https://docs.zerohash.com/reference/individual-participants

These endpoints let you onboard and manage individual customers (natural persons) on zerohash. Onboarding submits a customer's identifying information — and, where required, their identity documents — so zerohash can run KYC and register them to hold balances and transact.

A typical flow looks like this:

1. **Create the customer** with their personal details.
2. **Upload identity documents** if the customer is based outside the US.
3. **Update the customer** later if any details change.
4. **Lock the customer** if you need to restrict their account.

Once created, the customer enters KYC. You should confirm their KYC status before enabling any product flows for them.

---

### 

What you need to collect

The information required to onboard an individual depends on where they are based. Collecting the right details up front helps avoid failed submissions and KYC delays.

#### 

US Citizen

- **No document uploads are required.** A US customer can be onboarded from their submitted details alone.
- **A** `tax_id` **is required** (e.g. SSN or ITIN). Onboarding cannot be completed for a US-based customer without it.

#### 

Non-US Citizen

- **Document uploads are required.** Non-US customers must provide identity documentation (proof of ID) as part of onboarding.

#### 

zerohash EU platforms

- **Document uploads are required.** You must provide:
 - **Proof of ID** (e.g. passport or national ID)
 - **Proof of address**

> **In short:**
> 
> 1. US customers → provide a `tax_id`, no documents needed.
> 2. Non-US customers → identity documents are required.
> 3. EU customers → identity documents and proof of address are required.

Updated 25 days ago

---

Did this page help you?

Yes

No

Updated 25 days ago

---

Did this page help you?

Yes

No