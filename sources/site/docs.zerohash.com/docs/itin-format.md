# Source: https://docs.zerohash.com/docs/itin-format

## 

SSN

Here are the SSA's criteria for SSNs that are not issued and should be considered invalid:

- SSNs with the number `666` in positions `1-3`
- SSNs with the numbers `00` in positions `4-5`
- SSNs with the numbers `0000` in positions `6-9`

Also, SSN starting with number `9` are considered ITN (see below).

## 

ITIN

If a participant enters an ITIN, the middle digits must follow the following logic. We should add this validation to the front end so the user doesn’t continue.

If the citizenship and/or residency is the United States, and the document id starts with `9` then, the 4th digit must be:

- `5` or`7` or `9` followed by any digit (e.g. 912-50-1234)
- `6` followed by `0-5` (e.g. 912-60-1234)
- `8` followed by `0-8` (e.g. 912-80-1234)

If the format is invalid, an error will be thrown `HTTP 400` with the following message: `Invalid number. Please enter a valid SSN or ITIN`.

Source: [**IRS**](https://www.irs.gov/pub/irs-pdf/p4757.pdf).

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page