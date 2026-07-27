# Source: https://docs.zerohash.com/docs/supported-zip-code-formats

When submitting a customer via the `POST /participants/customers/new` endpoint, the zerohash API has the following validation logic on the **zip** field:

- Can either be 5 numbers (standard format) or 5 numbers, a hyphen, followed by 4 more numbers (Zip+4).
 - Standard: `12345`
 - Zip+4: `12345-6789`
- Avoid trailing whitespace, i.e. you should submit `"12345"` and not `"12345 "`.

Updated 4 months ago

---

Did this page help you?

Yes

No

Copy Page