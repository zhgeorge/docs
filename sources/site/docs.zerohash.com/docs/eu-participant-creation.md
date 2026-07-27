# Source: https://docs.zerohash.com/docs/eu-participant-creation

## 

Verification Documents

When creating participants in the EU system on the reliance KYC model, document uploads via the [POST /participant/documents](https://docs.zerohash.com/reference/post_participants-documents) endpoints are required to have the participant approved.

### 

ID Verification

The following documents are supported for automatic system approval if uploaded:

- eu\_passport
- eu\_id\_card (front and back required)
- eu\_drivers\_license (front and back required)
- us\_id\_card (front and back required)
- us\_drivers\_license (front and back required)
- us\_passport\_card (front and back required)
- non\_us\_passport
- us\_passport

### 

Address Verification

By default, platforms are required to provide proof of address document uploads before a participant can be approved. The following documents are supported for automatic system approval if uploaded:

- eu\_address\_verification

If a platform requests to not require proof of address document uploads, a request can be made to zerohash to instead support **proof of address coordinates**.

This means on a [POST /participants/customers/new](https://docs.zerohash.com/reference/post_participants-customers-new) request, a platform can populate the following fields

```
        "proof_of_address_coordinates": {
            "latitude": "88.178419", //Replace with the participant's latitude
            "longitude": "16.592011" //Replace with the participant's longitude
        }
```

If this configuration is requested, the proof\_of\_address\_coordinates are **optional** on participant creations, if passed the participant would not need a address verification document uploaded to be approved in the system. If coordinate values are not passed, address verification document upload would be needed for the participant to be approved.

## 

Phone Number Validation

EU participants require a valid `phone_number` on [POST /participants/customers/new](https://docs.zerohash.com/reference/post_participants-customers-new). The value must conform to E.164 format, including the leading `+`:

- Valid: `+35315550123`
- Invalid: `35315550123` (missing `+`)

> 📘
> 
> This is stricter than the US, where phone number validation is skipped if an `email` is also provided on the request. Platforms integrating across both US and EU environments should not assume phone formatting rules carry over between the two — always include the leading `+` for EU participants.

Updated 4 days ago

---

Did this page help you?

Yes

No

Copy Page