# Source: https://docs.zerohash.com/docs/w-9-implementation-guide

## 

What is a W-9?

**W-9** — the IRS form US persons (citizens, green-card holders, US tax residents, and US-formed entities) use to certify their US tax status and provide their Taxpayer Identification Number (SSN for individuals, EIN for entities). A valid W-9 on file exempts the participant from 24% backup withholding on US-source income.

zerohash supports the generation of certified W-9 forms via API. Unlike the [W-8](https://docs.zerohash.com/docs/w-8-implementation-guide-api) family, the W-9 has no variants. The same form is used for every US person regardless of whether they are an individual or an entity, and regardless of entity type (corporation, partnership, LLC, trust, estate, etc.).

If you have any questions on what requirements apply to your specific customer demographic / how to classify users based on the above descriptions, reach out via your zerohash contact and we will assist you.

## 

When should platforms collect W-9 information?

Any time you onboard a US person through zerohash's **US** flow. Participants onboarded through zerohash's EU or other non-US entities are governed by local tax documentation requirements and do not need a W-form.

- **Individuals** — collect a W-9 when the participant is a US citizen, green-card holder, or US tax resident
 - Note: A US Citizen with a US tax ID living abroad still requires a W-9
- **Entities** — collect a W-9 when the entity is formed or organized under US law (US corporations, US partnerships, US LLCs, US trusts, US estates, etc.)

## 

Do you already collect certified W-9 forms?

All you need to do is:

- Upload them via [POST /participants/documents](https://docs.zerohash.com/reference/post_participants-documents) with the appropriate document type
- Ensure the user is marked `"is_w_form_certified": true` AND specify the time at which they certified via `w_form_certification` when onboarded
- If the user is subject to backup withholding, be sure to indicate that at onboarding with `"is_not_subject_backup_withholding": false`

And you're done. Make sure to do this for pre-existing customers and on an ongoing basis for new customers.

If the above doesn't apply to you, see the below instructions. If you're already onboarding US customers via zerohash APIs, you're 90% there.

## 

Collect the W-9 fields in your UX

Collect these new data points in your customer journey. If you want a frame of reference, look at how zerohash will collect this data in its own KYC SDK experience [here.](https://docs.zerohash.com/docs/tax-data-collection-kycaas)

- Their TIN/SSN (9 digits, no dashes)
- Their typed name as the signature
- Mailing address — only if different from the residential address already captured via your normal participant onboarding
- Their optional exemption codes:
 - `payee_exemption` field that captures enum values for any applicable payee exemption codes `1` - `13` or `NONE` on the IRS form W-9
 - `fatca_reporting_exemption` field that captures enum values for any applicable fatca exemption codes `A` - `M` or `NONE` on the IRS form W-9
- An indicator that collects whether a user is subject to backup withholdings by the IRS
- A checkbox confirming the W-9 attestations (user is not subject to backup withholding, no B-Notice on file)
 - What is a B-Notice? A B-notice is an IRS letter telling a payer (like zerohash) that a customer's name and taxpayer ID don't match IRS records. This triggers a requirement to collect a corrected W-9
 - Platforms should show IRS attestation language to display alongside the checkbox to collect a proper attestation (see certification language in Section 2 of W-9 [here](https://www.irs.gov/pub/irs-pdf/fw9.pdf))

If you are also onboarding NNPs (entities), you should also collect:

- The entity DBA (doing-business-as) name, the public-facing trade name an entity operates under, when it's different from its legal registered name
- Note: Entity type must be specified as one of the following to properly generate a certified W-9 form:
 - C\_CORPORATION
 - S\_CORPORATION
 - PARTNERSHIP
 - TRUST\_ESTATE
 - LLC\_C (LLC that has elected to be taxed as a C corporation)
 - LLC\_P (LLC taxed as a partnership)
 - LLC\_S (LLC that has elected to be taxed as an S corporation)
 - SOLE\_PROPRIETOR
 - OTHER

## 

Send the data to zerohash

Platforms can use the same endpoints they're already integrated with provide the required tax data:

**If you are onboarding net new individual participants**

Example [POST /participants/customers/new](https://docs.zerohash.com/reference/post_participants-customers-new) request:

JSON

```
{
  "first_name": "John",
  "last_name": "Smith",
  "email": "test@example.com",
  "address_one": "123 Main St.",
  "address_two": "Suite 1000",
  "city": "Chicago",
  "zip": "12345",
  "jurisdiction_code": "US-IL",
  "phone_number": "15557778888",
  "date_of_birth": "1985-09-02",
  "id_number_type": "us_passport",
  "id_number": "123456789",
  "citizenship_code": "US",
  "country": "USA",
  "tax_id": "000-00-0000",
  "risk_rating": null,
  "signed_timestamp": 1603378501286,
  "kyc": "pass",
  "kyc_timestamp": 1603378501286,
  "onboarded_location": "US-FL",
  "sanction_screening": "pass",
  "sanction_screening_timestamp": 1603378501286,
  "idv": "pass",
  "employment_status": "full_time",
  "industry": "adult_entertainment",
  "source_of_funds": "salary",
  "signed_agreements": [
    {
      "type": "user_agreement",
      "region": "us",
      "signed_timestamp": 1603378501286
    }
  ],
  "b_notice_receipt": false,
  "w_form_certification": 1667504636159,
  "signature": "signature_data",
  "signature_timestamp": 1667504636159,
  "payee_exemption": "NONE",
  "fatca_reporting_exemption": "NONE",
  "is_not_subject_backup_withholding": true,
  "is_w_form_certified": true
}
```

**If you are updating already-created individual participants**

Example [PATCH /participants/customers/{participant\\\\\\\\\\\\\\\_code}](https://docs.zerohash.com/reference/patch_participants-customers-participant-code) request:

JSON

```
{ 
 "b_notice_receipt": false,
 "is_w_form_certified": true,
 "w_form_certification": 1667504636159,
 "signature": "signature_data",
 "signature_timestamp": 1667504636159,
 "payee_exemption": "NONE",
 "fatca_reporting_exemption": "NONE",
 "is_not_subject_backup_withholding": true,
,
}
```

**Entity Participants**

**If you are onboarding net new entity participants**

Example [POST /participants/entity/new](https://docs.zerohash.com/reference/post_participants-entity-new) request:

JSON

```
{
  "platform_code": "PLAT01",
  "entity_name": "Entity Name",
  "legal_name": "Legal Name",
  "contact_number": "15557778888",
  "website": "company.com",
  "date_established": "1985-09-02",
  "entity_type": "llc_s",
  "address_one": "123 Main St.",
  "address_two": "Suite 1000",
  "city": "Chicago",
  "postal_code": "12345",
  "tax_id": "000-00-0000",
  "id_issuing_authority": null,
  "risk_rating": null,
  "sanction_screening": "pass",
  "sanction_screening_timestamp": 1603378501286,
  "self_certification_timestamp": 1667504636159,
  "signed_timestamp": 1603378501286,
  "signed_agreements": [
    {
      "type": "user_agreement",
      "region": "us",
      "signed_timestamp": 1603378501286
    }
  ],
  "submitter_email": "test@example.com",
  "submitter_first_name": "Jon",
  "submitter_last_name": "Doe",
  "submitter_title": "Mr.",
  "control_persons": [
    {
      "name": "John Smith",
      "email": "test@example.com",
      "address_one": "123 Main St.",
      "address_two": "Suite 1000",
      "city": "Chicago",
      "postal_code": "12345",
      "jurisdiction_code": "US-IL",
      "date_of_birth": "1985-09-02",
      "phone_number": "15557778888",
      "citizenship_code": "US",
      "tax_id": "000-00-0000",
      "id_number_type": "us_passport",
      "id_number": "123456789",
      "id_issuing_authority": null,
      "sanction_screening": "pass",
      "sanction_screening_timestamp": 1603378501286,
      "kyc": "pass",
      "kyc_timestamp": 1603378501286,
      "control_person": 1
    }
  ],
  "beneficial_owners": [
    {
      "name": "John Smith",
      "email": "test@example.com",
      "address_one": "123 Main St.",
      "address_two": "Suite 1000",
      "city": "Chicago",
      "postal_code": "12345",
      "jurisdiction_code": "US-IL",
      "date_of_birth": "1985-09-02",
      "phone_number": "15557778888",
      "citizenship_code": "US",
      "tax_id": "000-00-0000",
      "id_number_type": "us_passport",
      "id_number": "123456789",
      "id_issuing_authority": null,
      "sanction_screening": "pass",
      "sanction_screening_timestamp": 1603378501286,
      "kyc": "pass",
      "kyc_timestamp": 1603378501286,
      "beneficial_owner": 1,
      "role": ""
    }
  ],
  "incorporation_address": {
    "address_one": "string",
    "address_two": "string",
    "city": "string",
    "jurisdiction_code": "IT-25",
    "postal_code": "string"
  },
  "b_notice_receipt": false,
  "is_w_form_certified": true,
  "w_form_certification": 1667504636159,
  "signature": "signature_data",
  "signature_timestamp": 1667504636159,
  "payee_exemption": "NONE",
  "fatca_reporting_exemption": "NONE",
  "is_not_subject_backup_withholding": true,
  "dba_name": "ABC Trading Co",
  "other_entity_type": "Trust",
  "jurisdiction_code": "US-IL"
}
```

**If you are updating already-created entity participants**

Example [PATCH /participants/entity/{participant\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_code}](https://docs.zerohash.com/reference/patch_participants-entity-participant-code) request:

JSON

```
{ 
 "b_notice_receipt": false,
 "is_w_form_certified": true,
 "w_form_certification": 1667504636159,
 "signature": "signature_data",
 "signature_timestamp": 1667504636159,
 "payee_exemption": "NONE",
 "fatca_reporting_exemption": "NONE",
 "is_not_subject_backup_withholding": true,
 "dba_name": "ABC Trading Co",
 "other_entity_type": "Trust",
}
```

## 

Send account updates as you do today

If a user updates their tax info later, just PATCH the same endpoint with the new values. zerohash handles re-certification on our side.

## 

What you need to know about W-9 Certification

**Always pair certification with a timestamp**

- Whenever you send `is_w_form_certified`, send `w_form_certification` (the time the user attested) alongside it. Same for `signature` and `signature_timestamp`

**Exemptions and B-Notice are rare**

- Most retail users don't have a `payee_exemption` or `fatca_reporting_exemption`. Mark these fields as **NONE** unless the user indicates otherwise with the relevant code. Please do not leave these fields empty
- You should ensure `b_notice_receipt` is `false` unless you've received a B-Notice directly from the IRS or have been notified via zerohash of an existing B-Notice against your customer account
- Even if you opted to upload your own certified W-9 document, make sure that the user tax profile is always up to date with any B-Notice or backup withholding indicators needed

**When anything changes, just send an update**

- In the event of a name change, address change, re-certification, or B-Notice resolution, PATCH the customer endpoint with the new values. zerohash handles re-validation

## 

Tax Glossary

Please reference the below descriptions on each of the new W-9 fields listed above and what they mean. For additional information on W-8 support, please see the implementation guide [here](https://docs.zerohash.com/docs/w-8-implementation-guide-api). 

### 

Tax Identification Number

- Existing `tax_id` field that is required for customers onboarded to a US platform

 - Platforms should format tax identification numbers in the appropriate formatting (9 digit format)

### 

W-Form Certification Status

- `is_w_form_certified` boolean field that is required for customers onboarded to a US platform

 - Must be provided with `w_form_certification` timestamp field to indicate the user's current certification status
 - When `true`, user can be onboarded without restriction, so long as other mandatory fields are provided at time of onboarding
 - When `false`, user is subject to backup withholding
 - In the event the user re-certifies, the platform must update this field to `true` and provide an updated `w_form_certification`

### 

W-Form Certification

- `w_form_certification` timestamp field that is required for customers onboarded to a US platform

 - Must be provided with `is_w_form_certified` boolean field to indicate the time at which the user certified their W-form
 - In the event the user transitions from an uncertified to a certified, the platform must provide a new `w_form_certification` and update `is_w_form_certified` from `false` to `true`

### 

B-Notice Receipt

- `b_notice_receipt` boolean field that indicated whether a user has been flagged in an IRS B-Notice as not having up-to-date tax information

 - Value should be set to `false` if no notice of receipt
 - If `true`, the user is subject to backup withholding until recertified

### 

Backup Withholding

- `is_not_subject_backup_withholding` boolean field that indicated whether a user is subject to backup withholdings by the IRS

 - Value should be set to `true` as a positive attestation that the user is not subject to the withholding
 - If `false`, the user is subject to backup withholding

### 

Signature & Timestamp

- `signature` field that captures customer first and last name as used on the W-form
- `signature_timestamp` field that captures the timestamp at which the user signed their W-form

### 

Tax Exemptions

- `payee_exemption` field that captures enum values for any applicable payee exemption codes `1` - `13` or `NONE`
- `fatca_reporting_exemption` field that captures enum values for any applicable fatca exemption codes `A` - `M` or `NONE`

Updated 11 days ago

---

Did this page help you?

Yes

No

Copy Page