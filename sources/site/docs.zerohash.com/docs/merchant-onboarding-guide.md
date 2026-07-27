# Source: https://docs.zerohash.com/docs/merchant-onboarding-guide

> 📘
> 
> ### 
> 
> Who this applies to
> 
> This guide is relevant when the Platform has many merchants. If the Platform is itself the merchant, this step is not required.

# 

Submit a Merchant

Submit the merchant via [POST /participants/entity/new](https://docs.zerohash.com/reference/post_participants-entity-new). `merchant_category_code` is an optional attribute but should always be provided at creation of an entity to facilitate Payins transactions. This is the standardized 4-digit code that classifies the merchant by the type of goods or services they provide.

**Sample Request**

JSON

```
{
    "platform_code": "PLAT01",
    "merchant_category_code": "4511", //MCC Category: Air Carriers, Airlines
    "entity_name": "Merchant XYZ",
    "legal_name": "Merchant XYZ Inc.",
    "contact_number": "15553765432",
    "website": "www.merchant.com",
    "date_established": "2018-01-15",
    "entity_type": "llc",
    "address_one": "1 Main St.",
    "address_two": "Suite 1000",
    "city": "Chicago",
    "postal_code": "12345",
    "jurisdiction_code": "US-IL",
    "tax_id": "883987654",
    "id_issuing_authority": "United States",
    "risk_rating": "low",
    "risk_vendor": "passbase",
    "sanction_screening": "pass",
    "sanction_screening_timestamp":1677252628000,
    "metadata":{},
    "signed_timestamp":1677252629000,
    "submitter_email": "josh_doe@gmail.com",
    "submitter_first_name": "Josh",
    "submitter_last_name": "Doe",
    "submitter_title": "Senior Legal Council",
    "control_persons":[
      {
        "name": "Joe Doe",
        "email": "joe.doe@test.com",
        "address_one": "1 South St.",
        "address_two": "Suite 2000",
        "city": "Chicago",
        "postal_code": "12345",
        "jurisdiction_code": "US-IL",
        "date_of_birth": "1980-01-30",  
        "citizenship_code": "US", 
        "tax_id": "123456789",
        "id_number_type": "us_passport",
        "id_number": "332211200",
        "kyc": "pass",
        "kyc_timestamp": 1630623005000,
        "sanction_screening":"pass",
        "sanction_screening_timestamp":1677252628000,
        "control_person": 1
      }
    ],
    "beneficial_owners":[
      {
        "name": "Jane Doe Jr",
        "beneficial_owner":1,
        "email": "janedoejr@test.com",
        "address_one": "1 North St.",
        "address_two": "Suite 3000",
        "city": "Chicago",
        "postal_code": "12345",
        "jurisdiction_code": "US-IL",
        "date_of_birth": "1980-01-30",
        "citizenship_code": "US", 
        "tax_id": "012345578",
        "id_number_type": "us_drivers_license",
        "id_number": "P11122243333",
        "kyc": "pass",
        "kyc_timestamp": 1630623005000,
        "sanction_screening": "pass",
        "sanction_screening_timestamp":1677252628000
      }
    ]
}
```

A successful response returns a `participant_code` which is a unique, permanent identifier for the merchant. The examples throughout this guide use MERCH1 as the participant\_code.

_ 
Requirements:_

- At least one `beneficial_owners` entry and one `control_persons` entry must be included.If any of these individuals do not have an SSN, you must submit an identity document for them via [POST /participants/entity/documents](https://docs.zerohash.com/reference/post_participants-entity-documents) (see below).
- `merchant_category_code` is required. Refer to the ISO 18245 standard for a full list of valid 4-digit category codes.

## 

Submit Merchant Documents

After a successful [POST /participants/entity/new](https://docs.zerohash.com/reference/post_participants-entity-new) submission, the merchant's initial status is `submitted`. A merchant will not reach `approved` status until all required documents have been submitted. Document requirements vary based on the `entity_type` provided during creation. See details [here](https://docs.zerohash.com/reference/post_participants-entity-new).

Submit documents via [POST /participants/entity/documents](https://docs.zerohash.com/reference/post_participants-entity-documents):

JSON

```
{
  "document": "...",
  "mime": "image/png",
  "document_type": "articles_of_incorporation",
  "file_name": "articles.png",
  "participant_code": "MERCH1"
}
```

The document field must be a base64-encoded file. The maximum file size is 10 MB.

## 

Query Merchant

You can query already-submitted Merchants via the [GET /participants](https://docs.zerohash.com/reference/get_participants) endpoint. If you'd like to query a specific Merchant, use the`participant_code` parameter.

Updated about 2 months ago

---

Did this page help you?

Yes

No

Copy Page