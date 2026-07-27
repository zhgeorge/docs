# Source: https://docs.zerohash.com/docs/iso-3166-subdivision-conversions

## 

General

zerohash has requirements on the format of certain geography-related fields in our API endpoints. We adhere to the **ISO 3166** standard. Platforms, however, may not have the data structured exactly to our standards. This page will help Platforms more easily transform data into zerohash's standards prior to hitting our endpoints.

## 

Canonical Codes and Legacy Aliases

zerohash validates `jurisdiction_code` against canonical **ISO 3166-2** codes and `citizenship_code` against canonical **ISO 3166-1** codes.

Some countries have deprecated or transitional subdivision codes that remain in common use. For example, France's `FR-68` (Haut-Rhin) and `FR-6AE` (a transitional Grand Est code) both resolve to the current canonical code, `FR-GES`. zerohash automatically resolves known legacy aliases to their canonical code before validation, so submitting `FR-68` or `FR-6AE` is treated identically to submitting `FR-GES` directly.

| Legacy alias | Canonical code |
| --- | --- |
| `FR-68` | `FR-GES` |
| `FR-6AE` | `FR-GES` |

This isn't an exhaustive list. If you're unsure whether a code your system holds is canonical or a legacy alias, use [POST /jurisdiction/evaluate-onboarding](https://docs.zerohash.com/reference/post_jurisdiction-evaluate-onboarding) before calling `/participants/customers/new`. It runs the same jurisdiction rules evaluation used at participant creation, so a passing result there reflects what creation will do with the same code.

## 

Applicable Endpoints

- [POST /participants/customers/new](https://docs.zerohash.com/reference/post_participants-customers-new)
 - ISO 3166-2 formatted fields: `jurisdiction_code`
 - ISO 3166-1 formatted fields`citizenship_code`
- [PATCH /participants/customers/{participant\_code}](https://docs.zerohash.com/reference/patch_participants-customers-participant-code)
 - ISO 3166-2 formatted fields: `jurisdiction_code`
 - ISO 3166-1 formatted fields`citizenship_code`
- [POST /participants/entity/new](https://docs.zerohash.com/reference/post_participants-entity-new)
 - ISO 3166-2 formatted fields: `jurisdiction_code`
 - ISO 3166-1 formatted fields`citizenship_code`
- [POST /participants/beneficiaries/new](https://docs.zerohash.com/reference/post_participants-beneficiaries-new)
 - ISO 3166-2 formatted fields: `jurisdiction_code`
 - ISO 3166-1 formatted fields`citizenship_code`
- [PATCH /participants/beneficiaries/{participant\_code}](https://docs.zerohash.com/reference/patch_participants-customers-participant-code)
 - ISO 3166-2 formatted fields: `jurisdiction_code`
 - ISO 3166-1 formatted fields`citizenship_code`

## 

Applicable Integration Guides

The following integration guides contain steps that require the submission of ISO 3166 structured data:

- [Payouts](https://docs.zerohash.com/docs/payouts-integration-guide)
- [Remittances](https://docs.zerohash.com/docs/remittance-integration-guide)
- [Fund (Onboarding API + Fund API)](https://docs.zerohash.com/docs/fund-integration-guide-api)
- [Fund (Onboarding API + Fund SDK)](https://docs.zerohash.com/docs/fund-integration-guide-sdk)

## 

External API Resources to Help Make the Conversion

We recommend to use the following external API's:

- [Google Geocoding API](https://developers.google.com/maps/documentation/geocoding/faq)
- [IOS Core Location API](https://developer.apple.com/documentation/corelocation)
- [Android Geocoder API](https://developer.android.com/reference/android/location/Geocoder)

## 

Google Geocoding API Example

### 

General

- In this example, you are trying to submit a Customer via the zerohash [POST /participants/customers/new endpoint](https://docs.zerohash.com/reference/post_participants-customers-new)
- You have the postal code and the country of a Customer that lives in Chicago, Illinois:
 - Postal Code: `60654`
 - Country: `United States`
- You now need to use the Google Geocoding API to generate a ISO 3166-2 `jurisdiction_code`

### 

Step 1: Making the Geocoding API Request

First, you need to make a request to the Google Maps Geocoding API using the provided postal code and country.

C

```
GET https://maps.googleapis.com/maps/api/geocode/json?address=60654,United States&key=YOUR_API_KEY
```

### 

Step 2: Example Code to Get Subdivision

Here’s an example in Python to make the API call and extract the ISO 3166-2 code for the subdivision:

python

```
import requests

def get_subdivision(postal_code, country, api_key):
    url = f"https://maps.googleapis.com/maps/api/geocode/json?address={postal_code},{country}&key={api_key}"
    response = requests.get(url)
    data = response.json()
    
    if data['status'] == 'OK':
        for component in data['results'][0]['address_components']:
            if 'administrative_area_level_1' in component['types']:
                return f"US-{component['short_name']}"  # ISO 3166-2 format
    return None

# Example usage
api_key = 'YOUR_API_KEY'
subdivision_code = get_subdivision("60654", "United States", api_key)
print(subdivision_code)  # Should output 'US-IL'
```

### 

Step 3: Incorporating the Result into the POST Request

Now that you have the subdivision code (e.g., US-IL), you can include it in your POST request. Here’s how the final JSON payload would look:

JSON

```
{
  "first_name": "John",
  "last_name": "Smith",
  "email": "jsmith@gmail.com",
  "phone_number": "9545551234",
  "address_one": "1 Main St.",
  "address_two": "Suite 1000",
  "city": "Chicago",
  "state": "IL",
  "zip": "60654",
  "country": "United States",
  "date_of_birth": "1985-09-02",
  "citizenship": "United States",
  "tax_id": "123456789",
  "risk_rating": "low",
  "kyc": "pass",
  "kyc_timestamp": 1630623005000,
  "sanction_screening": "pass",
  "sanction_screening_timestamp": 1630623005000,
  "idv": "pass",
  "liveness_check": "pass",
  "signed_timestamp": 1630623005000,
  "jurisdiction_code": "US-IL",  // Added jurisdiction_code field
  "metadata": {},
  "signed_agreements": [
    {
      "type": "user_agreement",
      "region": "us",
      "signed_timestamp": 1712008721000
    }
  ]
}
```

Updated 4 days ago

---

Did this page help you?

Yes

No

Copy Page