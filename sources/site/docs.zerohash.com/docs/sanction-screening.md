# Source: https://docs.zerohash.com/docs/sanction-screening

# 

General

All end users (either Customers, Beneficiaries or Senders) must go through sanction screening before they can transact on the zerohash platform. In addition, zerohash will use automating tooling to continuously monitor an end user's standing, as it relates to sanction screening.

There are 2 implementation types:

## 

1\. Platform Performs

If the zerohash Compliance team permits the Platform to use their own sanctions programs and tools, Platforms will need to, with each end user submission, attest to the fact 1) the end user has passed a sanctions check and 2) the timestamp that they passed this check. Here is an example [POST /participants/customers/new](https://docs.zerohash.com/reference/post_participants-customers-new) request (see the `sanction_screening` and `sanction_screening_timestamp` fields):

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
    "date_of_birth": "1985-09-02",
    "id_number_type": "us_passport",
    "id_number": "123456789",
    "non_us_other_type": null,
    "id_issuing_authority": null,
    "signed_timestamp": 1603378501286,
    "risk_rating": null,
    "metadata": {},
    "tax_id": "000-00-0000",
    "kyc": "pass",
    "kyc_timestamp": 1603378501286,
    "onboarded_location": "US-FL",
    "sanction_screening": "pass", // HERE
    "sanction_screening_timestamp": 1603378501286, // HERE
    "idv": "pass",
    "liveness_check": "pass",
    "phone_number": "15557778888",
    "signed_agreements": [
      {
        "type": "user_agreement",
        "region": "us",
        "signed_timestamp": 1603378501286
      }
    ],
    "salary": "100000.00",
    "savings_and_investments": "100000.00",
    "investor_category": "100000.00",
    "distribution_channel": "XYZ",
    "ip_address": "10.132.5.50",
    "jurisdiction_code": "US-IL",
    "citizenship_code": "US"
}
```

## 

2\. zerohash Performs

### 

Overview

If the Platform is not permitted to use their own sanctions program and tools, then zerohash offers this capability in-house. Right now, this feature is mostly applicable for Products that contain the concept of a "Beneficiary". These Products are the [Payouts](https://docs.zerohash.com/docs/payouts-integration-guide) and [Remittance](https://docs.zerohash.com/docs/remittance-integration-guide) product.

### 

Submit Beneficiary - Real-time sanctions screen

Each time a Beneficiary is **submitted for the first time**, via the [POST /participants/beneficiaries/new](https://docs.zerohash.com/reference/post_participants-beneficiaries-new) endpoint, zerohash will automatically and immediately **run** a sanctions check. Here is the participant `status` flow:

| Action | Status (reflected in the [webhook events](https://docs.zerohash.com/reference/participant-status-updates)) |
| --- | --- |
| Platform submits Beneficiary | `submitted` |
| Beneficiary passes the sanctions check | `approved` |
| Beneficiary has been flagged for a potential sanctions list match and is pending manual review | `pending_approval` |
| Beneficiary has been flagged for a potential sanctions list match and after manual review were determined to be outside of the risk tolerance established for a relationship with zerohash | `rejected` |

> 📘
> 
> ### 
> 
> If a Beneficiary enters a status of `pending_approval`, our Compliance department is automatically alerted. It will then take up to 24 hours for the team to review, and then the Beneficiary will either move to `approved` or `rejected`. Once they have conducted their review, they will reach out (typically via email) to the Platform with the results of the review.

### 

Update Beneficiary - Real-time sanctions screen

Each time a Beneficiary is **updated** , via the [PATCH /participants/beneficiaries/{participant\_code}](https://docs.zerohash.com/reference/patch_participants-beneficiaries-participant-code) endpoint, zerohash will automatically and immediately **re-run** a sanctions check. Here is the participant `status` flow:

| Action | Status (reflected in the [webhook events](https://docs.zerohash.com/reference/participant-status-updates)) |
| --- | --- |
| Platform updates a Beneficiary | The beneficiary will either be in `approved` or `pending_approval` |
| The update did not allow the Beneficiary to become released from being flagged as a potential sanctions list match and is pending manual review | The beneficiary will remain in`pending_approval` |
| Beneficiary passes the sanctions re-run | `approved` |
| Beneficiary has been flagged for a potential sanctions list match and after manual review were determined to be outside of the risk tolerance established for a relationship with zerohash | `rejected` |

> 📘
> 
> ### 
> 
> A Beneficiary will only be re-run through the sanction check if they are in a status of `pending_approval` or `approved`. If they have another status, ie `rejected`, they should be considered terminal and the status is not subject to change. After an update, our Compliance department will be automatically alerted once again. It will then take up to 24 hours for them to manually review. Once they have conducted their review, they will reach out (typically via email) to the Platform with the results.

### 

Continuous Monitoring

In addition to the real-time sanctions checks, zerohash will use automating tooling to continuously monitor an end user's standing, as it relates to sanction screening. Here is the participant `status` flow:

| Action | Status (reflected in the [webhook events](https://docs.zerohash.com/reference/participant-status-updates)) |
| --- | --- |
| Beneficiary has been flagged for a potential sanctions list match and after manual review were determined to be outside of the risk tolerance established for a relationship with zerohash | `approved` → `locked` → `pending_disabled` → `disabled` → `closed` |

## 

Updating Beneficiaries - Remittance Scenarios

This section will lay out how Remittance-specific Beneficiary updates impact the participant record.

zerohash requires that Platforms submit the following data points for Remittance Beneficiaries:

| Field | Optional |
| --- | --- |
| `first_name` | No |
| `last_name` | No |
| `address_one` | Yes |
| `address_two` | Yes |
| `jurisdiction_code` | No |
| `date_of_birth` | Yes |

It's possible that Beneficiaries can become initially flagged as a potential sanctions list match and be placed into a `pending_approval` status. For the Platform to take matters into their own hands, they can update the Beneficiary via the [PATCH /participants/beneficiaries/{participant\_code}](https://docs.zerohash.com/reference/patch_participants-beneficiaries-participant-code) endpoint.

The most effective thing a Platform can do is update the `date_of_birth` field. Updating the `address_one` and `address_two` fields will help, but just not as effectively.

Additionally, there are certain areas of the world that have many last names (ie, in Mexico). So adding an additional last name (a legally accurate one) is also a helpful tactic.

Here is an example flow that shows an initial Beneficiary submission followed by different Update Beneficiary options:

### 

Submit Beneficiary (initial submission)

[POST /participants/beneficiaries/new](https://docs.zerohash.com/reference/post_participants-beneficiaries-new) request:

JSON

```
{
    "first_name": "Hector",
    "last_name": "Martinez",
    "jurisdiction_code": "MX-CMX",
}
```

Let's say the Beneficiaries `participant_code` is BENEF1

### 

Update Beneficiary (date of birth)

[PATCH /participants/beneficiaries/{participant\_code}](https://docs.zerohash.com/reference/patch_participants-beneficiaries-participant-code) request:

JSON

```
{
  "participant_code":"BENEF1", 
  "date_of_birth": "1985-09-02"
}
```

### 

Update Beneficiary (address)

[PATCH /participants/beneficiaries/{participant\_code}](https://docs.zerohash.com/reference/patch_participants-beneficiaries-participant-code) request:

JSON

```
{
  "participant_code":"BENEF1", 
  "address_1": "1 seville st",
  "address_2": "2403"
}
```

### 

Update Beneficiary (last name)

[PATCH /participants/beneficiaries/{participant\_code}](https://docs.zerohash.com/reference/patch_participants-beneficiaries-participant-code) request:

JSON

```
{
  "participant_code":"BENEF1", 
  "last_name": "Lopez Martinez"
}
```

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page