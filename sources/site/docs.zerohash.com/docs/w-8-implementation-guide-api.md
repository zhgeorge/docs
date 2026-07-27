# Source: https://docs.zerohash.com/docs/w-8-implementation-guide-api

## 

What is a W-8BEN and W-8BEN-E?

- **W-8BEN** — the IRS form non-US individuals use to certify foreign status and, optionally, claim a reduced US withholding rate under an income tax treaty. A valid W-8BEN on file exempts the participant from 24% backup withholding on US-source income
- **W-8BEN-E** — the W-8BEN counterpart for non-US entities. In addition to certifying foreign status, the entity declares its IRS tax classification (e.g., corporation, partnership, complex trust) and, if applicable, claims treaty benefits subject to a Limitation on Benefits provision

zerohash supports the generation of certified W-8BEN and W-8BEN-E forms via API. In the majority of cases, these two forms will be sufficient to cover your customer demographic, along with the [W-9](https://docs.zerohash.com/docs/w-9-implementation-guide).

There are other variants of the W-8, such as the W-8IMY, W-8ECI, W-8EXP, and W-8CE. zerohash supports collection of these documents via document upload referenced in the section below.

- **W-8IMY** — Participant is a non-US intermediary or flow-through entity (foreign partnership, simple trust, grantor trust, qualified intermediary, withholding foreign partnership/trust) that is passing US-source income through to its underlying beneficial owners

- **W-8ECI** — Foreign participant claims their US-source income is effectively connected with the conduct of a US trade or business (and is therefore taxed on a net basis like a US person, not subject to 30% withholding)

- **W-8EXP** — Entity is a foreign government, foreign central bank of issue, international organization, foreign tax-exempt organization, or foreign private foundation claiming the exemption available to those entities

- **W-8CE** — Participant is a covered expatriate (a former US citizen or long-term green-card holder) electing how certain deferred compensation, tax-deferred accounts, or interests in non-grantor trusts are treated after expatriation

If you have any questions on what requirements apply to your specific customer demographic / how to classify users based on the above descriptions, reach out via your zerohash contact and we will assist you.

## 

When should I collect it?

Any time you onboard a non-US person through zerohash's **US** flow. Participants onboarded through zerohash's EU or other non-US entities are governed by local tax documentation and do not need a W-form.

- **Individuals** — collect a W-8BEN when the participant is not a US citizen, green-card holder, or US tax resident
- **Entities** — collect a W-8BEN-E when the entity is not formed or organized under US law (foreign corporations, foreign partnerships, foreign trusts, etc.)

## 

Do you already collect certified W-8 forms?

All you need to do is upload them via [POST /participants/documents](https://docs.zerohash.com/reference/post_participants-documents) with the appropriate document type and you're done. Make sure to do this for pre-existing customers and on an ongoing basis for new customers.

zerohash supports all W-8 variants via document upload:

- `form_w8_ben`
- `form_w8_ben_e`
- `form_w8_imy`
- `form_w8_eci`
- `form_w8_exp`
- `form_w8_ce`

Please note the following:

- Ensure the user is marked `"is_w_form_certified": true` AND specify the time at which they certified via `w_form_certification` when onboarded, as this will determine the expiry of the document

And you're done. Make sure to do this for pre-existing customers and on an ongoing basis for new customers.

If the above doesn't apply to you, see the below instructions. If you're already onboarding customers via zerohash APIs, you're 90% there.

## 

Collect the W-8 fields in your UX

Collect these new data points for the W-8BEN in your customer journey. If you want a frame of reference for W-8BEN, look at how zerohash will collect this data in its own KYC SDK experience [here.](https://docs.zerohash.com/docs/tax-data-collection-kycaas)

- Foreign TIN — the participant's tax identification number issued by their country of tax residence
- FTIN not legally required indicator — set if the participant's country of residence does not issue or require a foreign TIN
- Mailing address — only if different from the residential address already captured via your normal participant onboarding
- Treaty benefits claim — only if the participant is claiming reduced withholding under an income tax treaty:
 - Treaty country
 - Treaty article and paragraph
 - Withholding rate claimed
 - Type of income
 - Residence certification — attestation that the participant is a tax resident of the named treaty country
 - Additional conditions flag — indicator that any additional conditions in the treaty article have been met (if applicable)

In your UX, also surface a W-8BEN attestation checkbox confirming that the participant certifies foreign status, is not a US person, that any treaty claim is accurate, and will notify the platform within 30 days of any change in circumstances. For comprehensive attestation language, please reference the Certification section of the IRS W-8BEN template [here](https://www.irs.gov/pub/irs-pdf/fw8ben.pdf)​.

For W-8BEN-E entities, in addition to all of the W-8BEN data points above, collect:

- Tax classification

- Treaty requirements certification — attestation that the entity meets the substantive requirements of the treaty provision being claimed
- Limitation on Benefits (LOB) provision — the LOB article under which the entity qualifies for treaty benefits, selected from the standard set (see **Claim of Tax Treaty Benefits** section [here](https://www.irs.gov/pub/irs-pdf/fw8bene.pdf)​)
 - LOB "Other" article and paragraph — free-text article and paragraph of the LOB provision, required only when LOB = Other

Extend your attestation block on the W-8BEN-E to also cover the treaty-requirements certification. For comprehensive attestation language, reference the Certification section of the IRS W-8BEN-E template [here](https://www.irs.gov/pub/irs-pdf/fw8bene.pdf)​.

## 

Send the data to zerohash

Platforms can use the same endpoints they're already integrated with to provide the required tax data:

**If you are onboarding net new individual participants**

Example [POST /participants/customers/new](https://docs.zerohash.com/reference/post_participants-customers-new) request:

JSON

```
{
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "jane.doe@example.com",
  "address_one": "10 Downing St",
  "address_two": null,
  "city": "London",
  "zip": "SW1A 2AA",
  "jurisdiction_code": "GB",
  "phone_number": "442012345678",
  "date_of_birth": "1985-06-12",
  "id_number_type": "passport",
  "id_number": "987654321",
  "citizenship_code": "GB",
  "country": "GBR",
  "tax_id": null,
  "risk_rating": null,
  "signed_timestamp": 1747130096000,
  "kyc": "pass",
  "kyc_timestamp": 1747130096000,
  "onboarded_location": "GB",
  "sanction_screening": "pass",
  "sanction_screening_timestamp": 1747130096000,
  "idv": "pass",
  "employment_status": "full_time",
  "industry": "financial_services",
  "source_of_funds": "salary",
  "signed_agreements": [
    {
      "type": "user_agreement",
      "region": "uk",
      "signed_timestamp": 1747130096000
    }
  ],
  "mailing_address": { // required if different from permanent address for proper W-8 generation
    "address_one": "PO Box 99",
    "address_two": null,
    "city": "London",
    "state": null,
    "postal_code": "EC1A 1BB",
    "country": "GB"
  },
  "w_form_certification": 1747130096000, // required for proper W-8 generation
  "signature": "signature_data", // required for proper W-8 generation
  "signature_timestamp": 1747130096000, // required for proper W-8 generation
  "is_w_form_certified": true, // must be true, required for proper W-8 generation
  "w8_ben": {  // required for proper W-8 generation
    "ftin": "QQ123456C",
    "ftin_required": true, // must be specified
    "reference_numbers": "ACME-USER-42", // optional
    "treaty_claim": {  // required for proper W-8 generation
      "is_eligible": true, //  required for proper W-8 generation
      "country": "GB", // required for proper W-8 generation
      "residence_certification": true, // must be true, required for proper W-8 generation
      "income_type": "ROYALTIES_OTHER", // optional
      "withholding_rate": "0", // optional
      "article_paragraph": "Article 12, paragraph 1", // optional
      "additional_conditions": false // optional
    }
  }
}
```

**If you are updating already-created individual participants**

Example [PATCH /participants/customers/{participant\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_code}](https://docs.zerohash.com/reference/patch_participants-customers-participant-code) request:

JSON

```
 {
    "is_w_form_certified": true, // must be true, required for proper W-8 generation
    "w_form_certification": 1667504636159, // required for proper W-8 generation
    "signature": "signature_data", // required for proper W-8 generation
    "signature_timestamp": 1667504636159, // required for proper W-8 generation
    "mailing_address": { // required if different from permanent address for proper W-8 generation
      "address_one": "PO Box 99",
      "address_two": null,
      "city": "London",
      "state": null,
      "postal_code": "EC1A 1BB",
      "country": "GB"
    },
    "w8_ben": { // required for proper W-8 generation
      "ftin": "QQ123456C",
      "ftin_required": true, // must be specified
      "reference_numbers": "ACME-USER-42", // optional
      "treaty_claim": { // required for proper W-8 generation
        "is_eligible": true, // required for proper W-8 generation
        "country": "GB", // required for proper W-8 generation
        "residence_certification": true, // must be true, required for proper W-8 generation
        "income_type": "ROYALTIES_OTHER", // optional
        "withholding_rate": "0", // optional
        "article_paragraph": "Article 12, paragraph 1", // optional
        "additional_conditions": false // optional
      }
    }
  }
```

**Entity Participants**

**If you are onboarding net new entity participants**

Example [POST /participants/entity/new](https://docs.zerohash.com/reference/post_participants-entity-new) request:

JSON

```
{
  "platform_code": "PLAT01",
  "entity_name": "Acme Family Trust",
  "legal_name": "Acme Family Trust",
  "contact_number": "442012345678",
  "website": "acme.co.uk",
  "date_established": "2005-04-15",
  "entity_type": "trust_estate",
  "address_one": "10 Downing St",
  "address_two": null,
  "city": "London",
  "postal_code": "SW1A 2AA",
  "tax_id": null,
  "id_issuing_authority": null,
  "risk_rating": null,
  "sanction_screening": "pass",
  "sanction_screening_timestamp": 1747130096000,
  "self_certification_timestamp": 1747130096000,
  "signed_timestamp": 1747130096000,
  "signed_agreements": [
    {
      "type": "user_agreement",
      "region": "uk",
      "signed_timestamp": 1747130096000
    }
  ],
  "submitter_email": "trustee@acme.co.uk",
  "submitter_first_name": "Jane",
  "submitter_last_name": "Doe",
  "submitter_title": "Trustee",
  "control_persons": [
    {
      "name": "Jane Doe",
      "email": "jane.doe@acme.co.uk",
      "address_one": "10 Downing St",
      "address_two": null,
      "city": "London",
      "postal_code": "SW1A 2AA",
      "jurisdiction_code": "GB",
      "date_of_birth": "1980-03-22",
      "phone_number": "442012345678",
      "citizenship_code": "GB",
      "tax_id": null,
      "id_number_type": "passport",
      "id_number": "987654321",
      "id_issuing_authority": null,
      "sanction_screening": "pass",
      "sanction_screening_timestamp": 1747130096000,
      "kyc": "pass",
      "kyc_timestamp": 1747130096000,
      "control_person": 1
    }
  ],
  "beneficial_owners": [
    {
      "name": "Jane Doe",
      "email": "jane.doe@acme.co.uk",
      "address_one": "10 Downing St",
      "address_two": null,
      "city": "London",
      "postal_code": "SW1A 2AA",
      "jurisdiction_code": "GB",
      "date_of_birth": "1980-03-22",
      "phone_number": "442012345678",
      "citizenship_code": "GB",
      "tax_id": null,
      "id_number_type": "passport",
      "id_number": "987654321",
      "id_issuing_authority": null,
      "sanction_screening": "pass",
      "sanction_screening_timestamp": 1747130096000,
      "kyc": "pass",
      "kyc_timestamp": 1747130096000,
      "beneficial_owner": 1,
      "role": "Trustee"
    }
  ],
  "incorporation_address": {
    "address_one": "10 Downing St",
    "address_two": null,
    "city": "London",
    "jurisdiction_code": "GB",
    "postal_code": "SW1A 2AA"
  },
  "mailing_address": {
    "address_one": "PO Box 99",
    "address_two": null,
    "city": "London",
    "state": null,
    "postal_code": "EC1A 1BB",
    "country": "GB"
  },
  "is_w_form_certified": true, // must be true, required for proper W-8 generation
  "w_form_certification": 1747130096000, // required for proper W-8 generation
  "signature": "signature_data", // required for proper W-8 generation
  "signature_timestamp": 1747130096000, // required for proper W-8 generation
  "jurisdiction_code": "GB",
  "w8_ben_e": { // required for proper W-8 generation
    "tax_classification": "COMPLEX_TRUST", // required for proper W-8 generation
    "ftin": "GB987654321",
    "ftin_required": true, // must be specified
    "reference_numbers": "ACME-TRUST-1", // optional
    "treaty_claim": { // required for proper W-8 generation
      "is_eligible": true, // must be true, required for proper W-8 generation
      "country": "GB", // required for proper W-8 generation
      "residence_certification": true, // must be true, required for proper W-8 generation
      "requirements_certification": true, // must be true, required for proper W-8 generation
      "limitation_on_benefits": "PUBLICLY_TRADED_CORPORATION", // optional
      "limitation_on_benefits_other": null, // optional
      "income_type": null, // optional
      "withholding_rate": null, // optional
      "article_paragraph": null, // optional
      "additional_conditions": false // optional
    }
  }
}
```

**If you are updating already-created entity participants**

Example [PATCH /participants/entity/{participant\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_code}](https://docs.zerohash.com/reference/patch_participants-entity-participant-code) request:

JSON

```
{
  "is_w_form_certified": true, // must be true, required for proper W-8 generation
  "w_form_certification": 1667504636159, // required for proper W-8 generation
  "signature": "signature_data", // required for proper W-8 generation
  "signature_timestamp": 1667504636159, // required for proper W-8 generation
  "mailing_address": {
    "address_one": "PO Box 99",
    "address_two": null,
    "city": "London",
    "state": null,
    "postal_code": "EC1A 1BB",
    "country": "GB"
  },
  "w8_ben_e": { // required for proper W-8 generation
    "tax_classification": "COMPLEX_TRUST", // required for proper W-8 generation
    "ftin": "GB123456789",
    "ftin_required": true, // must be specified
    "reference_numbers": "ACME-ENTITY-7", // optional
    "treaty_claim": { // required for proper W-8 generation
      "is_eligible": true, // required for proper W-8 generation
      "country": "GB", // required for proper W-8 generation
      "residence_certification": true, // required for proper W-8 generation
      "requirements_certification": true, // required for proper W-8 generation
      "limitation_on_benefits": "PUBLICLY_TRADED_CORPORATION", // optional
      "limitation_on_benefits_other": null, // optional
      "income_type": "BUSINESS_PROFITS", // optional
      "withholding_rate": "0", // optional
      "article_paragraph": "Article 7, paragraph 1", // optional
      "additional_conditions": false // optional
    }
  }
}
```

## 

Send account updates as you do today

If a user updates their tax info later, just update their participant record with either the [PATCH /participants/customers/{participant\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_code}](https://docs.zerohash.com/reference/patch_participants-customers-participant-code) for natural persons or [PATCH /participants/entity/{participant\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_code}](https://docs.zerohash.com/reference/patch_participants-entity-participant-code) for non-natural persons. zerohash handles re-certification on our side.

## 

What you need to know about W-8 Certification

**Always pair certification with a timestamp**

- Whenever you send `is_w_form_certified`, send `w_form_certification` (the time the user attested) alongside it. Same for `signature` and `signature_timestamp`

**Treaty claims are optional**

- Most foreign users don't claim treaty benefits. Leave `treaty_claim.is_eligible` as `false` (and the rest of the treaty block blank) unless the user qualifies under a specific income tax treaty article. For entities claiming benefits, `limitation_on_benefits` and `requirements_certification` are also required

**Tax classification is required for entities**

- Every W-8BEN-E must declare a `tax_classification` for zerohash to properly generate a certified W-8BEN-E

**W-8s expire after three calendar years**

- Unlike W-9, a W-8 is valid only through December 31 of the third year after signing. Re-collect and PATCH a fresh form before expiry — zerohash treats expired W-8s as absent and applies 24% backup withholding

**When anything changes, just send an update**

- In the event of a name change, address change, country-of-residence change, treaty status change, or re-certification, PATCH the participant endpoint with the new values. zerohash handles re-validation

Updated 11 days ago

---

Did this page help you?

Yes

No

Copy Page