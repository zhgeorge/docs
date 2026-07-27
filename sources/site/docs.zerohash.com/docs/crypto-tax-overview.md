# Source: https://docs.zerohash.com/docs/crypto-tax-overview

As a committed provider for crypto's current and future infrastructure, zerohash is proud to offer a Tax-as-a-Service (TaaS) product to Platforms.

## 

Crypto tax: what are my responsibilities?

- A taxable event is any action or transaction that may result in taxes owed to the government.
 - Information such as transaction dates, the assets Fair market value {FMV} at time of purchase and sale that are related to the taxable event are required to be reported to the IRS by individuals.
 - See "_What Constitutes a Taxable Event_" for more information.
- To aid end users in their personal tax compliance and to comply with federal law tax forms may be provided to users who have transactions exceeding certain thresholds.
 - See "_What Tax Form(s) Might I Receive?_" for details on US tax forms.

## 

zerohash tax for business

At zerohash, compliance is always our number one priority. As such, we provide a full tax-as-a-service suite of products for all of your reporting needs. Whether you’re enabling your customers to buy/sell, issuing crypto rewards or even paying your employees in crypto, we’ve got you covered.

## 

zerohash tax for consumers

If you engaged in qualifying transactions on a platform that uses our TaaS product, and met the required thresholds to receive a tax form, the relevant forms will be delivered to you.

**Disclaimer:** This article is intended to provide basic, helpful information surrounding crypto taxes, and does not serve as formal legal or tax advice. Zero Hash and its affiliates do not provide legal, financial, or tax advice. Please consult a professional financial advisor if you have additional questions surrounding how to properly record and report your crypto activity. Zero Hash’s Tax as a Service Product is only available to end users if the platform through which the end user is using the Zero Hash crypto services enables the tax services.

## 

zerohash US tax guidelines

If your platform is partnered with zerohash LLC, users transacting may be subject to tax depending on their activity. It is important for platform customers to provide their tax classification and certification at onboarding so that zerohash can collect the data and ensure tax profile completeness. For platforms looking to understand how to pass this data to zerohash quickly and efficiently, you may reference the below guides:

- [W-9 Implementation Guide](https://docs.zerohash.com/docs/w-9-implementation-guide)
- [W-8 Implementation Guide](https://docs.zerohash.com/docs/w-8-implementation-guide-api)

Starting in FY 2027, IRS tax guidelines around digital assets will take effect. This means that users who have not completed their tax profile with zerohash will be subject to backup withholding. More specifically, for any sale of digital assets, 24% of the proceeds will be withheld and remitted to the IRS.

## 

zerohash EEA tax guidelines

If your platform is operating within an EEA country, zerohash will require additional data points on your customers to ensure compliance with DAC8/CARF reporting guidelines. These additional fields are:

### 

Tax Identification Number

- Existing `tax_id` field that is required for customers onboarded to an EEA platform

 - Platforms should format tax identification numbers in the appropriate formatting as specified by [https://www.oecd.org/](https://www.oecd.org/)
 - The `tax_id` format is validated against both the `jurisdiction_code` of the residential address and the `jurisdiction_code` of the tax residence (if tax residence is provided at onboarding)
 - So long as the \``tax_id` adheres to either format, it will be accepted

### 

Tax ID Validations

| Code | Country | Regex Pattern(s) | Structure Description |
| --- | --- | --- | --- |
| AT | Austria | ^\[0-9\]9$ | 9 numerals |
| BE | Belgium | ^\[0-9\]11$ | 11 numerals |
| BG | Bulgaria | ^\[0-9\]10$ | 10 numerals |
| HR | Croatia | ^\[0-9\]11$ | 11 numerals |
| CY | Cyprus | ^\[0-9\]8\[A-Z\]$ | 8 numerals followed by a letter |
| CZ | Czech Rep. | ^\[0-9\]9$ ^\[0-9\]10$ | 9 or 10 numerals |
| DK | Denmark | ^\[0-9\]10$ | 10 numerals |
| EE | Estonia | ^\[0-9\]11$ | 11 numerals |
| FI | Finland | ^\[0-9\]6\[+-A\]\[0-9\]3\[0-9A-Z\]$ | 6 numerals + 1 character (+, -, or A) + 3 numerals + 1 character |
| FR | France | ^\[0-3\]\[0-9\]12$ | 13 numerals (1st numeral always 0, 1, 2 or 3) |
| DE | Germany | ^\[0-9\]11$ | 11 numerals |
| EL | Greece | ^\[0-9\]9$ | 9 numerals |
| HU | Hungary | ^\[0-9\]10$ | 10 numerals |
| IS | Iceland | ^\[0-9\]10$ | 10 numerals |
| IE | Ireland | ^\[0-9\]7\[A-Z\]$ ^\[0-9\]7\[A-Z\]2$ | 7 numerals + either 1 or 2 letters |
| IT | Italy | ^\[A-Z\]6\[0-9\]2\[A-Z\]\[0-9\]2\[A-Z\]\[0-9\]3\[A-Z\]$ | 6 letters + 2 numerals + 1 letter + 2 numerals + 1 letter + 3 numerals + 1 letter |
| LV | Latvia | ^\[0-9\]11$ | 11 numerals |
| LI | Liechtenstein | ^\[0-9\]12$ | 4 to 12 numerals |
| LT | Lithuania | ^\[0-9\]11$ | 11 numerals |
| LU | Luxembourg | ^\[0-9\]13$ | 13 numerals |
| MT | Malta | ^\[0-9\]7\[MGAPLHBZ\]$ ^\[0-9\]9$ | 7 numerals + 1 letter (M, G, A, P, L, H, B or Z) or 9 numerals |
| NL | Netherlands | ^\[0-9\]9$ | 9 numerals |
| NO | Norway | ^\[0-9\]11$ | 11 numerals |
| PL | Poland | ^\[0-9\]10$ ^\[0-9\]11$ | 10 or 11 numerals |
| PT | Portugal | ^\[0-9\]9$ | 9 numerals |
| RO | Romania | ^\[0-9\]13$ | 13 numerals |
| SK | Slovakia | ^\[0-9\]9$ ^\[0-9\]10$ | 9 or 10 numerals |
| SI | Slovenia | ^\[0-9\]8$ | 8 numerals |
| ES | Spain | ^\[0-9\]8\[A-Z\]$ ^\[0-9LKMXYZ\]\[0-9\]7\[A-Z\]$ | 8 numerals + 1 letter, or 1 character (numeral, L, K, M, X, Y or Z) + 7 numerals + 1 control letter |
| SE | Sweden | ^\[0-9\]10$ | 10 numerals |
| UK/GB | United Kingdom | ^\[0-9\]10$ ^\[A-Z\]2\[0-9\]6\[ABCD \]$ | 10 numerals or 2 letters + 6 numerals + 1 character (A, B, C, D or space) |

### 

Tax Residence

- New `tax_residence` object for customers onboarded to an EEA platform that may have a taxable `jurisdiction_code` that is different from their residential \``jurisdiction_code`
 - Platforms are required to provide this new tax residence jurisdiction if the end-user fits the above description

### 

TIN Jurisdiction Reason

- New `tin_jurisdiction_reason` field that is an optional field in the event taxable `jurisdiction_code` that is different from their residential \``jurisdiction_code`
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

### 

Self-Certification

- New `self_certification_timestamp` field required for customers onboarded to an EEA platform to attest their information is accurate for reporting. This is mandatory at onboarding for all end-users of the platform.

### 

Address of Incorporation

- New `incorporation_address` object required for entity customers onboarded to an EEA platform. Platforms must specify the full incorporation address (street address, city, postal code, country) of the entity.

Updated 2 months ago

---

Did this page help you?

Yes

No

Copy Page