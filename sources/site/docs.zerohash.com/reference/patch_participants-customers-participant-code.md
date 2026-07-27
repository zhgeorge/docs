# Source: https://docs.zerohash.com/reference/patch_participants-customers-participant-code

⚠️

This reference guide is currently experiencing difficulties and will be back online shortly.

`ERR-YR5GEB`

participant\_code

string

required

`^[A-Z0-9]{6}$`

Unique participant identifier. Always 6 uppercase alphanumeric characters.

Updated customer profile fields (all fields optional, only send fields to update)

Standard User Details PatchW-9 Form UpdateW-9 Exemption UpdateTax Withholding UpdateChange of AddressChange of NameUpdate Requiring Supporting Documentation

Patch for standard user details such as address, phone, name, etc.

first\_name

string

The first name of the customer being onboarded.

middle\_name

string

The middle name of the customer being onboarded.

last\_name

string

The last name of the customer being onboarded.

former\_name

string

The former name of the customer being onboarded.

gender

string

enum

Customer gender.

malemalefemaleother

Allowed:

`male``female``other`

address\_one

string

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

country

string

enum

The ISO-3166-1 alpha3 country, e.g.`USA`, `IRL`.

USAANDAREAFGATGAIAALBARMAGOATAARGASMAUTAUSABWALAAZEBIHBRBBGDBELBFABGRBHRBDIBENBLMBMUBRNBOLBESBRABHSBTNBVTBWABLRBLZCANCCKCODCAFCOGCHECIVCOKCHLCMRCHNCOLCRICUBCPVCUWCXRCYPCZEDEUDJIDNKDMADOMDZAECUESTEGYESHERIESPETHFINFJIFLKFSMFROFRAGABGBRGRDGEOGUFGGYGHAGIBGRLGMBGINGLPGNQGRCSGSGTMGUMGNBGUYHKGHMDHNDHRVHTIHUNIDNIRLISRIMNINDIOTIRQIRNISLITAJEYJAMJORJPNKENKGZKHMKIRCOMKNAPRKKORKWTCYMKAZLAOLBNLCALIELKALBRLSOLTULUXLVALBYMARMCOMDAMNEMAFMDGMHLMKDMLIMMRMNGMACMNPMTQMRTMSRMLTMUSMDVMWIMEXMYSMOZNAMNCLNERNFKNGANICNLDNORNPLNRUNIUNZLOMNPANPERPYFPNGPHLPAKPOLSPMPCNPRIPSEPRTPLWPRYQATREUROUSRBRUSRWASAUSLBSYCSDNSWESGPSHNSVNSJMSVKSLESMRSENSOMSURSSDSTPSLVSXMSYRSWZTCATCDATFTGOTHATJKTKLTLSTKMTUNTONTURTTOTUVTWNTZAUKRUGAUMIUSAURYUZBVATVCTVENVGBVIRVNMVUTWLFWSMYEMMYTZAFZMBZWE

Show 249 enum values

jurisdiction\_code

string

enum

The ISO 3166-2 subdivision code that the customer resides in. A full list of valid jurisdiction codes can be retrieved from the [`GET /jurisdictions/subdivisions` endpoint](https://docs.zerohash.com/reference/get_jurisdiction-subdivisions) passing a `country` parameter.

US-ILUS-ALUS-AKUS-AZUS-ARUS-CAUS-COUS-CTUS-DEUS-FLUS-GAUS-HIUS-IDUS-ILUS-INUS-IAUS-KSUS-KYUS-LAUS-MEUS-MDUS-MAUS-MIUS-MNUS-MSUS-MOUS-MTUS-NEUS-NVUS-NHUS-NJUS-NMUS-NYUS-NCUS-NDUS-OHUS-OKUS-ORUS-PAUS-RIUS-SCUS-SDUS-TNUS-TXUS-UTUS-VTUS-VAUS-WAUS-WVUS-WIUS-WYUS-DCUS-ASUS-GUUS-MPUS-PRUS-UMUS-VI

Show 57 enum values

city

string

The city customer resides in.

zip

string

Zip code of the customer, required if `country` is `USA`, min 5 characters or `<5digits>-<4digits>`, no leading or trailing spaces", e.g. 77777 or 77777-7777.

postal\_code

string

length ≥ 4

Same as `zip`. Postal code of the customer, in the format "min 4 characters, no leading or trailing spaces".

email

string

Customer email address, required. 
Note: zerohash will validate that the email is a correctly formatted `email`, and that the value is unique per-platform

date\_of\_birth

string

Date of birth of the customer in the format `YYYY-MM-DD`

phone\_number

string

The phone number of the participant

platform\_updated\_at

number

required

Platform updated timestamp

X-SCX-SIGNED

string

required

HMAC-SHA256 signature of the request, base64-encoded. See the [Authentication guide](https://docs.zerohash.com/reference/api-authentication) for the exact signing formula.

X-SCX-TIMESTAMP

string

required

Current Unix timestamp in seconds. Must be within 60 seconds of server time or the request is rejected.

# 

200

Successfully updated customer participant. Returns the updated resource.

object

message

object

Updated customer summary. Only a fixed subset of identity fields is returned after an update, regardless of which fields were patched.

first\_name

string

The first name of the customer being onboarded.

last\_name

string

The last name of the customer being onboarded.

country

string

enum

The ISO-3166-1 alpha3 country, e.g.`USA`, `IRL`.

`AND` `ARE` `AFG` `ATG` `AIA` `ALB` `ARM` `AGO` `ATA` `ARG` `ASM` `AUT` `AUS` `ABW` `ALA` `AZE` `BIH` `BRB` `BGD` `BEL` `BFA` `BGR` `BHR` `BDI` `BEN` `BLM` `BMU` `BRN` `BOL` `BES` `BRA` `BHS` `BTN` `BVT` `BWA` `BLR` `BLZ` `CAN` `CCK` `COD` `CAF` `COG` `CHE` `CIV` `COK` `CHL` `CMR` `CHN` `COL` `CRI` `CUB` `CPV` `CUW` `CXR` `CYP` `CZE` `DEU` `DJI` `DNK` `DMA` `DOM` `DZA` `ECU` `EST` `EGY` `ESH` `ERI` `ESP` `ETH` `FIN` `FJI` `FLK` `FSM` `FRO` `FRA` `GAB` `GBR` `GRD` `GEO` `GUF` `GGY` `GHA` `GIB` `GRL` `GMB` `GIN` `GLP` `GNQ` `GRC` `SGS` `GTM` `GUM` `GNB` `GUY` `HKG` `HMD` `HND` `HRV` `HTI` `HUN` `IDN` `IRL` `ISR` `IMN` `IND` `IOT` `IRQ` `IRN` `ISL` `ITA` `JEY` `JAM` `JOR` `JPN` `KEN` `KGZ` `KHM` `KIR` `COM` `KNA` `PRK` `KOR` `KWT` `CYM` `KAZ` `LAO` `LBN` `LCA` `LIE` `LKA` `LBR` `LSO` `LTU` `LUX` `LVA` `LBY` `MAR` `MCO` `MDA` `MNE` `MAF` `MDG` `MHL` `MKD` `MLI` `MMR` `MNG` `MAC` `MNP` `MTQ` `MRT` `MSR` `MLT` `MUS` `MDV` `MWI` `MEX` `MYS` `MOZ` `NAM` `NCL` `NER` `NFK` `NGA` `NIC` `NLD` `NOR` `NPL` `NRU` `NIU` `NZL` `OMN` `PAN` `PER` `PYF` `PNG` `PHL` `PAK` `POL` `SPM` `PCN` `PRI` `PSE` `PRT` `PLW` `PRY` `QAT` `REU` `ROU` `SRB` `RUS` `RWA` `SAU` `SLB` `SYC` `SDN` `SWE` `SGP` `SHN` `SVN` `SJM` `SVK` `SLE` `SMR` `SEN` `SOM` `SUR` `SSD` `STP` `SLV` `SXM` `SYR` `SWZ` `TCA` `TCD` `ATF` `TGO` `THA` `TJK` `TKL` `TLS` `TKM` `TUN` `TON` `TUR` `TTO` `TUV` `TWN` `TZA` `UKR` `UGA` `UMI` `USA` `URY` `UZB` `VAT` `VCT` `VEN` `VGB` `VIR` `VNM` `VUT` `WLF` `WSM` `YEM` `MYT` `ZAF` `ZMB` `ZWE`

jurisdiction\_code

string

enum

The ISO 3166-2 subdivision code that the customer resides in. A full list of valid jurisdiction codes can be retrieved from the [`GET /jurisdictions/subdivisions` endpoint](https://docs.zerohash.com/reference/get_jurisdiction-subdivisions) passing a `country` parameter.

`US-AL` `US-AK` `US-AZ` `US-AR` `US-CA` `US-CO` `US-CT` `US-DE` `US-FL` `US-GA` `US-HI` `US-ID` `US-IL` `US-IN` `US-IA` `US-KS` `US-KY` `US-LA` `US-ME` `US-MD` `US-MA` `US-MI` `US-MN` `US-MS` `US-MO` `US-MT` `US-NE` `US-NV` `US-NH` `US-NJ` `US-NM` `US-NY` `US-NC` `US-ND` `US-OH` `US-OK` `US-OR` `US-PA` `US-RI` `US-SC` `US-SD` `US-TN` `US-TX` `US-UT` `US-VT` `US-VA` `US-WA` `US-WV` `US-WI` `US-WY` `US-DC` `US-AS` `US-GU` `US-MP` `US-PR` `US-UM` `US-VI`

email

string

Customer email address, required. 
Note: zerohash will validate that the email is a correctly formatted `email`, and that the value is unique per-platform

signed\_timestamp

number

The UNIX timestamp (in milliseconds) when the Services Agreement was accepted by the participant. This timestamp value must be from no longer than one (1) year in the past or one (1) day in the future.

signed\_agreements

array of objects

signed\_agreements

object

type

string

enum

required

`fund_auto_convert` `payment_services_terms` `account_link` `account_funding_payouts` `account_funding_general` `account_funding_pay` `crypto_payouts_service_terms` `staking` `trust_agreement` `zhllc_user_agreement_v1` `zhllc_privacy_policy_v1` `zhllc_regulatory_disclosures_v1` `auth_user_services_agreement_v1` `zhllc_payment_sender_terms_v1` `zhllc_third_party_disclosures_v1` `connect_privacy_policy_v1`

region

string

enum

required

`worldwide` `us` `brazil` `uk` `eu`

signed\_timestamp

number

required

The UNIX timestamp (in milliseconds) when the Fund Auto Convert Agreement was accepted by the participant. This timestamp value must be from no longer than one (1) year in the past or one (1) day in the future.

platform\_code

string

participant\_code

string

phone\_number

string

Customer phone number. Only included in the response for platforms where phone number echo is enabled.

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
curl --request PATCH \
2
     --url https://api.cert.zerohash.com/participants/customers/participant_code \
3
     --header 'accept: application/json' \
4
     --header 'content-type: application/json'
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
    "last_name": "Smith",
5
    "country": "USA",
6
    "jurisdiction_code": "US-IL",
7
    "email": "test@example.com",
8
    "signed_timestamp": 1603378501286,
9
    "signed_agreements": [
10
      {
11
        "type": "user_agreement",
12
        "region": "us",
13
        "signed_timestamp": 1603378501286
14
      }
15
    ],
16
    "platform_code": "XXXXXX",
17
    "participant_code": "XXXXXX",
18
    "phone_number": "15557778888"
19
  }
20
}
```

Updated about 2 months ago

---

Did this page help you?

Yes

No