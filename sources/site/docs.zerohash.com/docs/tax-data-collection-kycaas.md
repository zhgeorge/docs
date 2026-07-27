# Source: https://docs.zerohash.com/docs/tax-data-collection-kycaas

# 

SDK Data Collection - New Users

For platforms utilizing zerohash KYC services via SDK, there is **no action** required on your end to support tax data collection for new enrollments. The participants onboarding via the SDK can expect to find some new data points they'll need to fill out as part of their journey.

**Residence and citizenship**

zerohash will introduce "Tax Classification" selection on the existing _Residence and citizenship_ screen. This will allow users to select a tax status that best fits them:

![](https://files.readme.io/b137b7c76159edad5486bc2900189f9125c36deec4638919e71de3449ff69360-Captura_de_Tela_2026-06-10_as_18.32.56.png)

( ) I am a U.S. Person - U.S. citizen, resident alien, or other U.S. person. (Form W-9)

( ) I am a Foreign Individual - Non-U.S. person. (Form W-8BEN)

---

**Option 1 - U.S. Tax Certification (W-9)**

If the user has identified as a U.S. Person, they will be allowed to continue to a dedicated tax screen capturing the following:

![](https://files.readme.io/1924439f1345cb5199cac4d3b49f8b2dc94c14d4619ceec3f8d1d2c5e2009958-W9_Screen_2.png)

- Taxpayer Identification
 - Full Legal Name: \[ Pre-populated \]
 - U.S. Taxpayer ID (SSN/ITIN): \[ \***\-**\-6789 \]
- Exemptions (Optional)
 - Exempt Payee Code - \[ Dropdown to select code (1-13) ⌵ \]
 - Exemption from FATCA Reporting Code - \[ Dropdown to select code (A-M) ⌵ \]
- Backup Withholding Indicator
 - \[ \] I am subject to backup withholding. Check this only if you have been notified by the IRS that you are currently subject to backup withholding because you failed to report all interest and dividends on your tax return.

---

After the user supplies the above information, they will move on to the final review. The "Under penalties of perjury" language is a strict requirement for a valid W-9:

**Certification**

![](https://files.readme.io/9057a0c385d26ae223fb4ecea135362e07229c968beab0bc83a35d89324cfe55-W9_Screen_1.png)

"Under penalties of perjury, I certify that:

- The number shown on this form is my correct taxpayer identification number.

- I am not subject to backup withholding (unless the box on the previous screen was checked).

- I am a U.S. citizen or other U.S. person (including a U.S. resident alien).

- The FATCA code(s) entered on this form (if any) indicating that I am exempt from FATCA reporting is correct.

 The Internal Revenue Service does not require your consent to any provision of this document other than the certifications required to avoid backup withholding."

Electronic Signature

Type Full Name to Sign:

\[ \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ \]

\[x\] I agree to sign this document electronically.

Datetime: MM-DD-YYY + hours + minutes +seconds

---

**Option 2 - Foreign Tax Certification (W-8BEN)**

If the user has identified as a Foreign Individual, they will be allowed to continue to a dedicated tax screen capturing the following:

![](https://files.readme.io/088f77e03402eae0f9f5c0ff2386792e13f83075f3bc63a32404ba313007f65f-Captura_de_Tela_2026-06-10_as_13.33.11_1.png)

- Identification of Beneficial Owner
 - Full Legal Name \[ Pre-populated \]
 - Date of Birth (MM-DD-YYYY) \[Pre-populated\]
 - U.S. Taxpayer ID (SSN or ITIN) \[Pre-populated\]
- Foreign Tax Identifying Number (FTIN) - \[xxxxx\]
 - OR checkbox - \[ \] I confirm that an FTIN is not legally required. Check this if your jurisdiction of residence does not issue tax IDs to its residents

---

After the user supplies the above information, they will move on to specify treaty benefits and conduct a final review:

**Claim of Tax Treaty Benefits**

![](https://files.readme.io/4eb71fa201aa168e2aff3c83e88e1bf4bd1d682d4eb945665cd6c3d5dc839143-Captura_de_Tela_2026-06-10_as_13.33.33_1.png)

- \[ \] I certify that the beneficial owner is a resident of \[Pre-populated country\] within the meaning of the income tax treaty between the United States and that country.
 - Special Rates (If applicable) - Claiming Article/Paragraph **\[** \_**\_ \] for a \[** \]% rate of withholding on \[Income Type (dropdown)\]

**Certification**

![](https://files.readme.io/38ba41358ba691f51fd75f00fa93522682367412368e297bf6193babec19acce-Captura_de_Tela_2026-06-10_as_13.33.55_1.png)

"Under penalties of perjury, I declare that:

- I am the individual that is the beneficial owner of all income or proceeds
- The person named is not a U.S. person.
- This income is not effectively connected with a U.S. trade or business and is not subject to withholding taxes under section 1446(f)
- I am an exempt foreign person for broker and barter transactions
- I will submit a new form within 30 days if any certification becomes incorrect

The Internal Revenue Service does not require your consent to any provisions of this document other than the certifications required to establish your status as a non-U.S. Person and if applicable, establish your FATCA status and obtain a reduced rate of withholding.”

Electronic Signature

\[ \] I certify that I have the capacity to sign for the person identified.

Type Full Name to Sign: \[ \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ \]

\[x\] I agree to sign this document electronically.

Datetime: MM-DD-YYY + hours + minutes +seconds

# 

SDK Data Collection - Existing Users

For users that have already been onboarded, zerohash will provide you with a URL that you can distribute to end customers. This URL will open to the relevant page in the SDK where the customer can provide relevant data.

Updated about 2 months ago

---

Did this page help you?

Yes

No

Copy Page