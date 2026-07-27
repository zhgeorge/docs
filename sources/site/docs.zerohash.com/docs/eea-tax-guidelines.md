# Source: https://docs.zerohash.com/docs/eea-tax-guidelines

# 

What to collect for EEA Customers

If your platform is operating within an EEA country, zerohash will require additional data points on your customers to ensure compliance with DAC8/CARF reporting guidelines. These additional fields are:

- Tax identification number
 - Platforms should format tax identification numbers in the appropriate formatting as specified by [https://www.oecd.org/](https://www.oecd.org/)
 - The `tax_id` format is validated against both the `jurisdiction_code` of the residential address and the `jurisdiction_code` of the tax residence (if tax residence is provided at onboarding)
 - So long as the `tax_id` adheres to either format, it will be accepted
- Tax residence
 - Customers onboarded to an EEA platform that may have a taxable `jurisdiction_code` that is different from their residential `jurisdiction_code`
 - Platforms are required to provide this new tax residence jurisdiction if the end-user fits the above description
 - If more than one tax residence, platforms can use `additional_tax_residences` to provide the additional data
- TIN jurisdiction reason
 - New `tin_jurisdiction_reason` field that is an optional field in the event taxable `jurisdiction_code` that is different from their residential `jurisdiction_code`
 - Platforms can choose from the following enum values as reason codes for the difference:
 - `working_abroad`
 - `studying_abroad`
 - `dual_residency`
 - `business_abroad`
 - `real_estate_abroad`
 - `other`
 - If `other` is selected, the user will be onboarded into a "submitted" state for compliance to conduct a manual review.
 - Note that if `tin_jurisdiction_reason` is not provided at onboarding, and there is a mismatch in jurisdiction codes, this field is defaulted to `other` and the user will go through the manual review process
 - Use of any of the first 5 enum values will result in regular approval flow, so long as other mandatory fields are provided at time of onboarding
- Self certification
 - Required for customers onboarded to an EEA platform to attest their information is accurate for reporting. This is mandatory at onboarding for all end-users of the platform.

## 

Send the data to zerohash

Platforms can use the same endpoints they're already integrated with provide the required tax data:

**If you are onboarding net new individual participants**

Example [POST /participants/customers/new](https://docs.zerohash.com/reference/post_participants-customers-new) request:

JSON

```
{
  "first_name": "Jonas",
  "middle_name": "Marie",
  "last_name": "Müller",
  "email": "jonas.muller+eu-test@example.com",
  "phone_number": "4915221234567",
  "citizenship_code": "DE",
  "place_of_birth": {
    "country": "DE",
    "city": "Berlin",
    "state": "BE"
  },
  "date_of_birth": "1988-04-12",
  "address_one": "Friedrichstrasse 100",
  "address_two": "Apt 5B",
  "city": "Berlin",
  "postal_code": "10117",
  "tax_id": "65929970489",
  "id_number_type": "passport",
  "id_number": "C01X00T47",
  "id_issuing_date": "2021-06-15",
  "id_issuing_authority": "DE",
  "id_issuing_locality": "DE",
  "id_expiration_date": "2031-06-14",
  "signed_timestamp": 1749484800000,
  "sanction_screening_timestamp": 1749484800000,
  "jurisdiction_code": "DE-BE",
  "kyc": "pass",
  "kyc_timestamp": 1749484800000,
  "sanction_screening": "pass",
  "idv": "pass",
  "liveness_check": "pass",
  "risk_rating": "low",
  "employment_status": "full_time",
  "industry": "technology",
  "source_of_funds": "salary",
  "salary": "between_75001_and_125000",
  "savings_and_investments": "between_25001_and_50000",
  "tx_equivalent_annual_volume": "25k_to_100k",
  "tx_frequency_of_use": "12_to_53",
  "tx_type_of_service": ["buy_crypto", "sell_crypto"],
  "tx_relationship_term_with_service": "long_term",
  "signed_agreements": [
    {
      "agreement_name": "platform_terms_of_service",
      "version": "1.0",
      "signed_timestamp": 1749484800000
    },
    {
      "agreement_name": "zerohash_user_agreement",
      "version": "1.0",
      "signed_timestamp": 1749484800000
    }
  ],
  "self_certification_timestamp": 1749484800000,
  "tax_residence": {
    "address_one": "Friedrichstrasse 100",
    "address_two": "Apt 5B",
    "city": "Berlin",
    "postal_code": "10117",
    "country": "DE",
    "jurisdiction_code": "DE-BE"
  },
 "additional_tax_residences": [
    {
      "tax_id": "IT00000000000",
      "jurisdiction_code": "IT-25"
    }
  ],
  "tin_jurisdiction_reason": "working_abroad",
}
```

**If you are updating already-created individual participants**

Example [PATCH /participants/customers/{participant\\\\\\\\\\\\\\\_code}](https://docs.zerohash.com/reference/patch_participants-customers-participant-code) request:

JSON

```
{ 
"self_certification_timestamp": 1749484800000,
  "tax_residence": {
    "address_one": "Friedrichstrasse 100",
    "address_two": "Apt 5B",
    "city": "Berlin",
    "postal_code": "10117",
    "country": "DE",
    "jurisdiction_code": "DE-BE"
  },
"additional_tax_residences": [
    {
      "tax_id": "IT00000000000",
      "jurisdiction_code": "IT-25"
    }
  ],
  "tin_jurisdiction_reason": "working_abroad",
}
```

**Entity Participants**

**If you are onboarding net new entity participants**

Example [POST /participants/entity/new](https://docs.zerohash.com/reference/post_participants-entity-new) request:

JSON

```
{
  "platform_code": "PLAT01",
  "entity_name": "Entity Name GmbH",
  "legal_name": "Entity Name GmbH",
  "contact_number": "4915221234567",
  "website": "company.de",
  "date_established": "1985-09-02",
  "entity_type": "llc",
  "address_one": "Friedrichstrasse 100",
  "address_two": "Suite 1000",
  "city": "Berlin",
  "postal_code": "10117",
  "tax_id": "DE123456789",
  "id_issuing_authority": "DE",
  "risk_rating": null,
  "sanction_screening": "pass",
  "sanction_screening_timestamp": 1603378501286,
  "self_certification_timestamp": 1667504636159,
  "signed_timestamp": 1603378501286,
  "signed_agreements": [
    {
      "type": "user_agreement",
      "region": "eu",
      "signed_timestamp": 1603378501286
    }
  ],
  "submitter_email": "test@example.com",
  "submitter_first_name": "Jonas",
  "submitter_last_name": "Müller",
  "submitter_title": "Mr.",
  "control_persons": [
    {
      "name": "Jonas Müller",
      "email": "test@example.com",
      "address_one": "Friedrichstrasse 100",
      "address_two": "Suite 1000",
      "city": "Berlin",
      "postal_code": "10117",
      "jurisdiction_code": "DE-BE",
      "date_of_birth": "1985-09-02",
      "phone_number": "4915221234567",
      "citizenship_code": "DE",
      "tax_id": "65929970489",
      "id_number_type": "passport",
      "id_number": "C01X00T47",
      "id_issuing_authority": "DE",
      "sanction_screening": "pass",
      "sanction_screening_timestamp": 1603378501286,
      "kyc": "pass",
      "kyc_timestamp": 1603378501286,
      "control_person": 1
    }
  ],
  "beneficial_owners": [
    {
      "name": "Jonas Müller",
      "email": "test@example.com",
      "address_one": "Friedrichstrasse 100",
      "address_two": "Suite 1000",
      "city": "Berlin",
      "postal_code": "10117",
      "jurisdiction_code": "DE-BE",
      "date_of_birth": "1985-09-02",
      "phone_number": "4915221234567",
      "citizenship_code": "DE",
      "tax_id": "65929970489",
      "id_number_type": "passport",
      "id_number": "C01X00T47",
      "id_issuing_authority": "DE",
      "sanction_screening": "pass",
      "sanction_screening_timestamp": 1603378501286,
      "kyc": "pass",
      "kyc_timestamp": 1603378501286,
      "beneficial_owner": 1,
      "role": ""
    }
  ],
  "incorporation_address": {
    "address_one": "Friedrichstrasse 100",
    "address_two": "Suite 1000",
    "city": "Berlin",
    "jurisdiction_code": "DE-BE",
    "postal_code": "10117"
  },
  "tax_residence": {
    "address_one": "Friedrichstrasse 100",
    "address_two": "Suite 1000",
    "city": "Berlin",
    "jurisdiction_code": "DE-BE",
    "postal_code": "10117"
  },
  "tin_jurisdiction_reason": "working_abroad",
  "additional_tax_residences": [
    {
      "tax_id": "IT00000000000",
      "jurisdiction_code": "IT-25"
    }
  ],
  "tin_jurisdiction_other": "",
  "dba_name": "ABC Trading Co",
  "merchant_category_code": "5411",
  "jurisdiction_code": "DE-BE"
}
```

**If you are updating already-created entity participants**

Example [PATCH /participants/entity/{participant\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_code}](https://docs.zerohash.com/reference/patch_participants-entity-participant-code) request:

JSON

```
{ 
 "incorporation_address": {
    "address_one": "Friedrichstrasse 100",
    "address_two": "Suite 1000",
    "city": "Berlin",
    "jurisdiction_code": "DE-BE",
    "postal_code": "10117"
  },
  "tax_residence": {
    "address_one": "Friedrichstrasse 100",
    "address_two": "Suite 1000",
    "city": "Berlin",
    "jurisdiction_code": "DE-BE",
    "postal_code": "10117"
  },
  "tin_jurisdiction_reason": "working_abroad",
  "additional_tax_residences": [
    {
      "tax_id": "IT00000000000",
      "jurisdiction_code": "IT-25"
    }
  ],
  "tin_jurisdiction_other": ""
}
```

## 

What you need to know about EEA tax requirements

**Always collect self-certifications for your users**

- Whenever a user is onboarded to your platform, ensure the user is attesting that their information is accurate for tax reporting under DAC8

**Collect any/all taxable jurisdictions**

- Most retail users have a singular taxable jurisdiction. For cases like this, you can use the primary address and `tax_id` fields in the API shown above
- For users that have multiple taxable jurisdictions, after supplying the main taxable jurisdiction and its `tax_id`, you can specify the remainder on `additional_tax_residences` as shown above

**When anything changes, just send an update**

- In the event of a name change, address change, or re-certification, PATCH the customer endpoint with the new values. zerohash handles re-validation

Updated about 2 months ago

---

Did this page help you?

Yes

No

Copy Page