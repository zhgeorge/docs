# Source: https://docs.zerohash.com/docs/test-verification-sessions

This guide can assist with testing different scenarios in both cert and prod environments. Be sure you have [Webhooks enabled](https://docs.zerohash.com/reference/participants-1) before testing.

Testing guidelines are split into US and non-US residents, as they follow different requirements for onboarding with zerohash. Paths to gain participant status of `approved`and of `rejected`are outlined.

# 

Certification testing

## 

Non-document capture

If testing for someone whose `country` = `United States` and `citizenship` = `United States`, then you will only interact with the zerohash SDK.

### 

Result = approved

Fill out the forms in the zerohash SDK with the following information:

| Field | Input |
| --- | --- |
| Email | Any actual email (e.g. [first.last+1@domain.com](mailto:first.last+1@domain.com) )<br>_Note: Email uniqueness required so you can use +1, +2, etc. to simulate_ |
| Phone number | +1 234-567-8909 |
| First name | Leslie |
| Last name | Knope |
| Address one | 123 Main St. |
| City | Pawnee |
| Postal code | 46001 |
| Country | United States |
| State | Indiana |
| Date of birth | 01/18/1975 |
| Citizenship | United States |
| SSN | 123-45-6789 |

### 

Result = rejected

Fill out the forms in the zerohash SDK with `country` = `United States` and `citizenship` = `United States`, and use any variation of other fields (e.g. different name, different date of birth, etc.).

You will be requested to upload a copy ID to complete the onboarding flow. This can be a picture of anything like your keyboard for example. The verification session will attempt to match the inputted data with hardcoded PII from Leslie Knope (instead of extracting from the document), and thus fail if you use any other name, date of birth etc. Please do not use a picture of your actual passport in the test environment.

You get 3 attempts to pass document verification, after which the rejected result screen shows.

> 📘
> 
> ### 
> 
> Note for production
> 
> In production, PII checks may be inconclusive for a United States person and lead to the participant being asked to provide document verification and a liveness check. We call this a fallback scenario, which can improve approval odds.

## 

Document capture

### 

Result = approved

Fill out the forms in the zerohash SDK with the following information:

| Field | Input |
| --- | --- |
| Email | Any actual email (e.g. [first.last+1@domain.com](mailto:first.last+1@domain.com) )<br>_Note: Email uniqueness required so you can use +1, +2, etc. to simulate_ |
| Phone number | +1 234-567-8909 |
| First name | Leslie |
| Last name | Knope |
| Address one | 123 Main St. |
| City | Pawnee |
| Postal code | 46001 |
| Country | Switzerland |
| State | Aargau |
| Date of birth | 01/18/1975 |
| Citizenship | Switzerland |

For document capture you have to take a picture of something that looks like an actual photo ID. If it does not fit the format, e.g., a picture of the wall or desk, the document check will fail. You get 3 attempts to pass document verification in one session.

### 

Result = rejected

Fill out the forms in the zerohash SDK with `country` = `United States` and `citizenship` ≠ `United States` (we recommend Ireland or Switzerland) and use any variation of other fields (e.g. different name, different date of birth, etc.).

You will be requested to upload a copy ID to complete the onboarding flow. This can be a picture of anything like your keyboard for example. The verification session will attempt to match the inputted data with hardcoded PII from Leslie Knope (instead of extracting from the document), and thus fail if you use any other name, date of birth etc. Please do not use a picture of your actual passport in the test environment.

You get 3 attempts to pass document verification, after which the rejected result screen shows.

## 

Liveness checks

Selfie checks are not run in cert, only in prod.

# 

Production testing

There is no guarantee of getting an “approved” result in prod, even if using your actual information. Data is evaluated and verified across personally identifiable information (PII), device risk profiling, email profiling, phone number profiling, document and liveness authenticity checks, and more.

If aiming to test in production with actual user data, remember that email uniqueness is required.

If you run into issues, please report the expected and actual result to zerohash.

Updated about 2 months ago

---

Did this page help you?

Yes

No

Copy Page