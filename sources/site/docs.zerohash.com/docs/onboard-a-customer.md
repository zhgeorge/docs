# Source: https://docs.zerohash.com/docs/onboard-a-customer

## 

Customer types

| Customer Type | API Endpoint |
| --- | --- |
| Individual | [POST /participants/customers/new](https://docs.zerohash.com/reference/post_participants-customers-new) |
| Business | [POST /participants/entity/new](https://docs.zerohash.com/reference/post_participants-entity-new) |

## 

Individual Onboarding

Example [POST /participants/customers/new](https://docs.zerohash.com/reference/post_participants-customers-new) request:

JSON

```
{
    "first_name": "John",
    "last_name": "Smith",
    "email": "jsmith@gmail.com",
    "phone_number": "+12345834789",
    "date_of_birth": "1985-09-02",
    "ip_address": "999.168.252.199",
    "address_one": "1 Main St.",
    "address_two": "Suite 1000",
    "city": "Chicago",
    "zip": "12345",
    "jurisdiction_code": "US-IL",
    "partial": true,
    "sanction_screening": "pass",
    "sanction_screening_timestamp": 1603378501282,
    "signed_agreements": [{
        "type": "user_agreement",
        "region": "us",
        "signed_timestamp": 1603378501286
    }],
}
```

> 📘
> 
> ### 
> 
> The response will contain a 6-digit alpha-numeric `participant_code`, ie CUST01

## 

Business Onboarding

Example [POST /participants/entity/new](https://docs.zerohash.com/reference/post_participants-entity-new) request:

JSON

```
{
    "platform_code": "PLAT01", // example platform_code representing your master Platform Code
    "entity_name": "Company XYZ",
    "legal_name": "Company XYZ Inc.",
    "contact_number": "15553765432",
    "website": "www.company.com",
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

> 📘
> 
> ### 
> 
> The response will contain a 6-digit alpha-numeric `participant_code`, ie CUST01

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page