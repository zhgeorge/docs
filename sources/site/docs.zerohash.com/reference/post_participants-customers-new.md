# Source: https://docs.zerohash.com/reference/post_participants-customers-new

⚠️

This reference guide is currently experiencing difficulties and will be back online shortly.

`ERR-YR5GEB`

Customer profile data including personal information, contact details, and KYC information

EU CustomerUS Customer - RelianceNon-US Citizen Customer - ReliancePartially Onboarded ParticipantCustomer - All accepted fields

All accepted fields for an EU customer

first\_name

string

required

The first name of the customer being onboarded.

middle\_name

string

The middle name of the customer being onboarded.

last\_name

string

required

The last name of the customer being onboarded.

email

string

required

Customer email address, required. 
Note: zerohash will validate that the email is a correctly formatted `email`, and that the value is unique per-platform

phone\_number

string

required

The phone number of the participant

citizenship\_code

string

enum

required

The ISO-3166-1 alpha2 citizenship of the participant, e.g. `US`.

ADAEAFAGAIALAMAOAQARASATAUAWAXAZBABBBDBEBFBGBHBIBJBLBMBNBOBQBRBSBTBVBWBYBZCACCCDCFCGCHCICKCLCMCNCOCRCUCVCWCXCYCZDEDJDKDMDODZECEEEGEHERESETFIFJFKFMFOFRGAGBGDGEGFGGGHGIGLGMGNGPGQGRGSGTGUGWGYHKHMHNHRHTHUIDIEILIMINIOIQIRISITJEJMJOJPKEKGKHKIKMKNKPKRKWKYKZLALBLCLILKLRLSLTLULVLYMAMCMDMEMFMGMHMKMLMMMNMOMPMQMRMSMTMUMVMWMXMYMZNANCNENFNGNINLNONPNRNUNZOMPAPEPFPGPHPKPLPMPNPRPSPTPWPYQARERORSRWSASBSCSDSESGSHSISJSKSLSMSNSOSRSSSTSVSXSYSZTCTDTFTGTHTJTKTLTMTNTOTRTTTVTWTZUAUGUMUSUYUZVAVCVEVGVIVNVUWFWSYEYTZAZMZW

Show 248 enum values

place\_of\_birth

object

The place of birth of the participant, as is defined on their ID (Passport, etc.).

Required if;

- `id_number_type=passport`
- `id_number_type=us-passport`
- `id_number_type=non-us-passport`

place\_of\_birth object

date\_of\_birth

string

required

Date of birth of the customer in the format `YYYY-MM-DD`

address\_one

string

required

First line for the customer's address.

Notes:

- The regular maximum length is 80 characters.
- If the platform is on the vendor reliance track, the maximum length increases to `200` characters.
- PO Box addresses are not accepted.

address\_two

string

Extra information, like an apartment or suite number.

Notes:

- The maximum length is `50` characters for platform using KYCaaS through zerohash.
- If the platform is on the shared vendor reliance track, the maximum length increases to `200` characters.
- PO Box addresses are not accepted.

city

string

required

The city customer resides in.

postal\_code

string

required

length ≥ 4

Same as `zip`. Postal code of the customer, in the format "min 4 characters, no leading or trailing spaces".

tax\_id

string

required

The national ID of the participant, e.g. a social security number.

- Required when `citizenship_code` is `US`.
- Optional when `citizenship_code` is not `US`, but if provided, must be accompanied by a valid `id_number` and `id_number_type`.
- If the tax ID provided is a US ITIN (a 9-digit US ID that begins with the number `9`), then `id_number_type` will be required.

id\_number\_type

string

enum

required

Passport, EU Drivers License, National ID are EU-specific types. EU platforms also accept us\_passport, non\_us\_passport, non\_us\_other, us\_drivers\_license, us\_id\_card, us\_passport\_card

passporteu\_drivers\_licensenational\_idus\_passportnon\_us\_passportnon\_us\_otherus\_drivers\_licenseus\_id\_cardus\_passport\_card

Show 9 enum values

id\_number

string

required

The ID number for the customer.

- Required when `citizenship_code` is not `US`
- Required when `citizenship_code : US` but `tax_id` is an ITIN (a 9-digit US ID that begins with the number `9`).

id\_issuing\_date

string

ID Issuing Date of the customer in the format `YYYY-MM-DD`

id\_issuing\_authority

string

required

ISO-3166-1\_A2 country code that issued the ID. Required if `id_number` is provided.

id\_issuing\_locality

string

The locality where the customer's ID was issued, as is defined on their ID (Passport, etc.) ISO 3166-1 alpha-2 Country Code format.

id\_expiration\_date

string

required

ID Expiration Date of the customer in the format `YYYY-MM-DD`.

Required if;

- `id_number_type=passport`
- `id_number_type=us-passport`
- `id_number_type=non-us-passport`

signed\_timestamp

number

required

The UNIX timestamp (in milliseconds) when the Services Agreement was accepted by the participant. This timestamp value must be from no longer than one (1) year in the past or one (1) day in the future.

sanction\_screening\_timestamp

number

required

The UNIX timestamp (in milliseconds) when KYC was passed. This timestamp value must be from no longer than one (1) year in the past or one (1) day in the future.

jurisdiction\_code

string

enum

required

The ISO 3166-2 subdivision code that the customer resides in. A full list of valid jurisdiction codes can be retrieved from the [`GET /jurisdictions/subdivisions` endpoint](https://docs.zerohash.com/reference/get_jurisdiction-subdivisions) passing a `country` parameter.

US-ALUS-AKUS-AZUS-ARUS-CAUS-COUS-CTUS-DEUS-FLUS-GAUS-HIUS-IDUS-ILUS-INUS-IAUS-KSUS-KYUS-LAUS-MEUS-MDUS-MAUS-MIUS-MNUS-MSUS-MOUS-MTUS-NEUS-NVUS-NHUS-NJUS-NMUS-NYUS-NCUS-NDUS-OHUS-OKUS-ORUS-PAUS-RIUS-SCUS-SDUS-TNUS-TXUS-UTUS-VTUS-VAUS-WAUS-WVUS-WIUS-WYUS-DCUS-ASUS-GUUS-MPUS-PRUS-UMUS-VI

Show 57 enum values

kyc

string

enum

required

Whether the participant passed or failed KYC by vendor

passfail

Allowed:

`pass``fail`

kyc\_timestamp

number

required

The UNIX timestamp (in milliseconds) when KYC was passed. This timestamp value must be from no longer than one (1) year in the past or one (1) day in the future.

sanction\_screening

string

enum

required

Whether the participant passed sanctions checks (Platforms with X do not need to send `sanction_screening`)

passfail

Allowed:

`pass``fail`

idv

string

enum

required

Whether the participant passed or failed ID verification

passfail

Allowed:

`pass``fail`

liveness\_check

string

enum

required

Whether the participant passed or failed a liveness check

passfail

Allowed:

`pass``fail`

risk\_rating

string

enum

required

The risk-rating associated with the customer, conditionally required for certain platforms

lowmediumhigh

Allowed:

`low``medium``high`

employment\_status

string

enum

required

Employment status

full\_timepart\_timeself\_employedunemployedretiredstudent

Allowed:

`full_time``part_time``self_employed``unemployed``retired``student`

industry

string

enum

required

Employment industry

adult\_entertainmentadvertising\_media\_marketingagriculturearts\_entertainmentcharityconstruction\_manufacturingconsultingconsumer\_products\_servicescrypto\_miningecommerceeducationelectronicsfashionfinancial\_servicesfood\_beveragesgovernment\_agencyinsurancejewelry\_gemstoneslaw\_enforcementlegal\_servicesmining\_energy\_chemicalsonline\_gaming\_gamblingpharmaceuticalsproperty\_real\_estateretail\_wholesaletransportationtravel\_car\_hireweapons\_defense\_aerospaceother

Show 29 enum values

source\_of\_funds

string

enum

required

Source of funds

salarysavingspension\_retirementinheritanceinvestmentloangiftother

Show 8 enum values

salary

string

enum

Salary of the participant

under\_3500under\_3500between\_35001\_and\_75000between\_75001\_and\_125000between\_125001\_and\_200000over\_200000

Allowed:

`under_3500``between_35001_and_75000``between_75001_and_125000``between_125001_and_200000``over_200000`

savings\_and\_investments

string

enum

required

Savings and investments of the participant.

under\_10000between\_10001\_and\_25000between\_25001\_and\_50000between\_50001\_and\_100000between\_100001\_and\_250000over\_250000

Allowed:

`under_10000``between_10001_and_25000``between_25001_and_50000``between_50001_and_100000``between_100001_and_250000``over_250000`

tx\_equivalent\_annual\_volume

string

enum

The estimated total value of transactions the individual expects to process annually on the platform, in a specified currency (e.g., USD, EUR depends on region).

25k\_to\_100kup\_to\_5k5k\_to\_25k25k\_to\_100k100k\_and\_up

Allowed:

`up_to_5k``5k_to_25k``25k_to_100k``100k_and_up`

tx\_frequency\_of\_use

string

enum

How often the individual will use the platform's services.

up\_to\_12up\_to\_1212\_to\_5353\_to\_365365\_and\_up

Allowed:

`up_to_12``12_to_53``53_to_365``365_and_up`

tx\_type\_of\_service

array of strings

length ≥ 0

The main service type the individual will use, like `buy_crypto` or `sell_crypto`, or both, or less, or more etc.

tx\_type\_of\_service

Show 8 enum values

ADD string

tx\_relationship\_term\_with\_service

string

enum

The expected duration of the individual's platform use, e.g., `short_term` (<1 year) or `long_term` (>5 years).

long\_termlong\_termshort\_termother

Allowed:

`long_term``short_term``other`

tx\_relationship\_term\_with\_service\_other\_explanation

string

Optional text to explain a non-standard relationship term (e.g., "few months for a project"). Used when `other` is provided in `tx_relationship_term_with_service`.

signed\_agreements

array of objects

required

signed\_agreements\*

ADD object

self\_certification\_timestamp

number

required

The UNIX timestamp (in milliseconds) when the participant completed self-certification for DAC8 compliance. Mandatory for participants that are based in Europe.

tax\_residence

object

required

Tax residence address for the customer

tax\_residence object

tin\_jurisdiction\_reason

string

enum

Optional. Reason for the tax residence jurisdiction differing from the legal jurisdiction. Defaults to "unknown" if not provided.

working\_abroadworking\_abroadstudying\_abroaddual\_residencybusiness\_abroadreal\_estate\_abroadother

Allowed:

`working_abroad``studying_abroad``dual_residency``business_abroad``real_estate_abroad``other`

proof\_of\_address\_coordinates

object

GPS coordinates of the proof of address. Accepts both Decimal Degrees (DD) and Degrees Minutes Seconds (DMS) formats.

proof\_of\_address\_coordinates object

X-SCX-SIGNED

string

required

HMAC-SHA256 signature of the request, base64-encoded. See the [Authentication guide](https://docs.zerohash.com/reference/api-authentication) for the exact signing formula.

X-SCX-TIMESTAMP

string

required

Current Unix timestamp in seconds. Must be within 60 seconds of server time or the request is rejected.

# 

201

Successfully created customer participant. Returns the created resource with generated IDs and timestamps.

object

message

Customer - All accepted fieldsUS Customer - RelianceNon-US Citizen Customer - RelianceEU Customer

Customer - All accepted fields object

# 

400

Bad Request

# 

403

Forbidden

# 

404

Not Found

# 

500

Internal Server Error

# 

503

Service Unavailable

Updated about 2 months ago

---

Did this page help you?

Yes

No

ShellNodeRubyPHPPython

```
xxxxxxxxxx
1
curl --request POST \
2
     --url https://api.cert.zerohash.com/participants/customers/new \
3
     --header 'accept: application/json' \
4
     --header 'content-type: application/json' \
5
     --data '
6
{
7
  "citizenship_code": "AD",
8
  "id_number_type": "passport",
9
  "jurisdiction_code": "US-AL",
10
  "kyc": "pass",
11
  "sanction_screening": "pass",
12
  "idv": "pass",
13
  "liveness_check": "pass",
14
  "risk_rating": "low",
15
  "employment_status": "full_time",
16
  "industry": "adult_entertainment",
17
  "source_of_funds": "salary",
18
  "savings_and_investments": "under_10000"
19
}
20
'
```

```
xxxxxxxxxx
 
1
{
2
  "message": {
3
    "first_name": "John",
4
    "middle_name": "Middle",
5
    "last_name": "Smith",
6
    "former_name": "Whale",
7
    "email": "test@example.com",
8
    "phone_number": "15557778888",
9
    "address_one": "123 Main St.",
10
    "address_two": "Suite 1000",
11
    "country": "USA",
12
    "city": "Chicago",
13
    "zip": "12345",
14
    "postal_code": "12345",
15
    "jurisdiction_code": "US-IL",
16
    "citizenship_code": "US",
17
    "date_of_birth": "1985-09-02",
18
    "tax_id": "000-00-0000",
19
    "id_number_type": "us_passport",
20
    "id_number": "123456789",
21
    "non_us_other_type": null,
22
    "id_issuing_authority": null,
23
    "risk_rating": null,
24
    "signed_timestamp": 1603378501286,
25
    "prefunded": false,
26
    "metadata": {},
27
    "kyc": "pass",
28
    "kyc_timestamp": 1603378501286,
29
    "onboarding_profile": "kyc_track",
30
    "onboarded_location": "US-FL",
31
    "sanction_screening": "pass",
32
    "sanction_screening_timestamp": 1603378501286,
33
    "idv": "pass",
34
    "liveness_check": "pass",
35
    "employment_status": "full_time",
36
    "industry": "adult_entertainment",
37
    "source_of_funds": "salary",
38
    "signed_agreements": [
39
      {
40
        "type": "user_agreement",
41
        "region": "us",
42
        "signed_timestamp": 1603378501286
43
      }
44
    ],
45
    "salary": "under_3500",
46
    "savings_and_investments": "under_10000",
47
    "investor_category": "restricted",
48
    "distribution_channel": "XYZ",
49
    "ip_address": "10.132.5.50",
50
    "place_of_birth": {
51
      "country_code": "NL",
52
      "place_name": "Amsterdam"
53
    },
54
    "id_expiration_date": "2026-12-25",
55
    "id_issuing_date": "2020-12-16",
56
    "id_issuing_locality": "string",
57
    "tx_equivalent_annual_volume": "25k_to_100k",
58
    "tx_frequency_of_use": "up_to_12",
59
    "tx_type_of_service": [
60
      "buy_crypto",
61
      "sell_crypto"
62
    ],
63
    "tx_relationship_term_with_service": "long_term",
64
    "tx_relationship_term_with_service_other_explanation": "some free form explanation here in case of other type of tx_relationship_term_with_service",
65
    "gender": "male",
66
    "purpose_of_transactions": "payments_personal",
67
    "purpose_of_transactions_other_explanation": "some free form explanation here in case of other type of purpose_of_transactions",
68
    "expected_monthly_transaction_count": "between_11_and_100",
69
    "gross_annual_salary_amount": "10000",
70
    "self_certification_timestamp": 1667504636159,
71
    "tax_residence": {
72
      "address_one": "string",
73
      "address_two": "string",
74
      "city": "string",
75
      "jurisdiction_code": "PT-11",
76
      "postal_code": "string"
77
    },
78
    "tin_jurisdiction_reason": "working_abroad",
79
    "additional_tax_residences": [
80
      {
81
        "tax_id": "string",
82
        "jurisdiction_code": "US-IL"
83
      }
84
    ],
85
    "tin_jurisdiction_other": "string",
86
    "proof_of_address_coordinates": {
87
      "latitude": "51.511164",
88
      "longitude": "-0.083317"
89
    },
90
    "b_notice_receipt": true,
91
    "is_w_form_certified": true,
92
    "w_form_certification": 1667504636159,
93
    "physical_delivery": false,
94
    "signature": "signature_data",
95
    "signature_timestamp": 1667504636159,
96
    "payee_exemption": "NONE",
97
    "fatca_reporting_exemption": "NONE",
98
    "is_not_subject_backup_withholding": false,
99
    "platform_code": "XXXXXX",
100
    "participant_code": "XXXXXX",
101
    "status": "approved"
102
  }
103
}
```

Updated about 2 months ago

---

Did this page help you?

Yes

No