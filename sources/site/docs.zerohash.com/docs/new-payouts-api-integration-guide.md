# Source: https://docs.zerohash.com/docs/new-payouts-api-integration-guide

# 

Context

The Single API Call Payouts API lets platforms initiate a compliant stablecoin (or crypto) payout in a single API call. Rather than making four sequential calls to onboard participants, link an external account, and submit a payment, [POST /payouts](https://docs.zerohash.com/reference/post_payouts) handles all of this in one request.

## 

Participant Roles

| Role | Description | Supported types | Example `participant_code` |
| --- | --- | --- | --- |
| Platform | The zerohash partner submitting the API request. Must have a signed MSA contract with zerohash. | n/a | `PLAT01` |
| Payor | The entity or individual submitting payouts on behalf of the Ultimate Payor. Pre-registered via [POST /participants/entity/new](https://docs.zerohash.com/reference/post_participants-entity-new) with zerohash and referenced by `participant_code` on every request. | `entity`, `individual` | `PAYOR1` |
| Ultimate Payor | The entity or individual whose funds are being sent. zerohash creates and manages this participant internally. | `entity`, `individual` | `UPAYR1` |
| Beneficiary | The entity or individual receiving the payout. zerohash creates and manages this participant internally. | `entity`, `individual` | `BENEF1` |

# 

Account Models

The `account_model` field controls how participants are treated from a regulatory and compliance perspective. Your zerohash account must be configured for a given account model before it can be used.

| Model | Description |
| --- | --- |
| `fully_disclosed` | The Ultimate Payor is a legal zerohash customer, signs zerohash T&Cs, and is subject to KYB/KYC. The Payor does not put this activity within their own licenses. |
| `omnibus` | The Payor is a licensed money service business that puts this activity within their own licenses and is the legal zerohash customer. The Ultimate Payor is not a direct zerohash customer. |

Pass the account model on every [POST /payouts](https://docs.zerohash.com/reference/post_payouts) request:

JSON

```
{
  "account_model": "fully_disclosed",
  ...
}
```

# 

Fund Float Account

You will fund their float account by sending fiat to the mutually decided-upon bank account. Here are the [account](https://docs.zerohash.com/docs/what-is-an-account) details:

- `participant_code`: 00SCXM

- `account_group:` PLAT01 (replace with your Platform's code)

- `account_label`: general

- `account_type`: available

- `asset`: USD

> ℹ️
> 
> ### 
> 
> In Cert, your platform will be pre-funded with Float account funds.

# 

Onboard Payor

> ⚠️
> 
> ### 
> 
> Approval Required
> 
> The Payor PII requirements reflected below require prior approval for your integration. Contact your zerohash representative to begin the review process.

Use the [POST /participants/entity/new](https://docs.zerohash.com/reference/post_participants-entity-new) endpoint to pre-register the Payor.

**Note:** you must supply a value of `originator_entity` for `onboarding_profile`

**Request Example:**

JSON

```
{
  "onboarding_profile": "originator_entity",
  "legal_name": "Bank Corp.",
  "contact_number": "+15553765431",
  "tax_id": "76-5432109",
  "id_issuing_authority": "US",
  "address_one": "2000 McKinney Avenue",
  "address_two": "Suite 1400",
  "city": "Dallas",
  "postal_code": "75201",
  "jurisdiction_code": "US-TX",
  "sanction_screening": "pass",
  "sanction_screening_timestamp": 1718000520000,
  "signed_agreements": [
    {
      "type": "user_agreement",
      "region": "us",
      "signed_timestamp": 1718000520000
    }
  ]
}
```

**Note:** The `postal_code` field is conditionally required; if the provided `jurisdiction_code` = `US-XX` , `postal_code` is required. Else, it is optional.

# 

Validate Payout Request

Before submitting a live payout via [POST /payouts](https://docs.zerohash.com/reference/post_payouts), you can validate your request payload without executing any actions on the backend. Set `"validate": true` in the request body. 
zerohash performs three checks:

- Schema validation - all required fields are present and correctly formatted
- Business logic validation - account model permissibility, required agreements, and other rules
- Address validation - the destination crypto address is not on zerohash's deny-list and is compatible with the specified blockchain network (e.g., a BTC address for a SOL payout is rejected)

The idempotency key may be omitted when validating.

**Request:**

JSON

```
{
  "account_model": "fully_disclosed",
  "validate": true,
  "payor": {
    "participant_code": "PAYOR1",
    "payor": {
      "info": {
        "entity": {
          "onboarding_profile": "payouts_payor_ultimate",
          "legal_name": "Acme Corp",
          "contact_number": "+15553765432",
          "address_one": "1 Main St.",
          "address_two": "Suite 1000",
          "city": "Chicago",
          "postal_code": "12345",
          "jurisdiction_code": "US-IL",
          "email": "payments@acmecorp.com",
          "tax_id": "883987654",
          "id_issuing_authority": "US",
          "merchant_category_code": "4511",
          "sanction_screening": "pass",
          "sanction_screening_timestamp": 1603378501286,
          "signed_agreements": [
            {
              "type": "user_agreement",
              "region": "us",
              "signed_timestamp": 1603378501286
            }
          ]
        }
      }
    }
  },
  "beneficiary": {
    "info": {
      "individual": {
        "onboarding_profile": "payouts_beneficiary",
        "first_name": "Jane",
        "last_name": "Smith",
        "date_of_birth": "1990-01-01",
        "address_one": "123 Main St",
        "address_two": "Apt 4B",
        "city": "New York",
        "zip": "10001",
        "jurisdiction_code": "US-NY",
        "tax_id": "123456789",
        "id_issuing_authority": "US"
      }
    },
    "external_account": {
      "info": {
        "network": "SOL",
        "crypto_address": "ab123...",
        "supported_symbols": ["USDC"]
      }
    }
  },
  "payment": {
    "asset": "USDC.SOL",
    "quoted_asset": "USD",
    "total": "100.00",
    "description": "Contractor payout"
  },
  "metadata": {
    "client_ref": "your-internal-ref-id",
    "campaign": "weekly-contractor-payout"
  }
}
```

**Note:** The `postal_code` field in the payor and beneficiary object is conditionally required; if the provided `jurisdiction_code` = `US-XX` , `postal_code` is required. Else, it is optional.

**Responses:**

| Status | Meaning |
| --- | --- |
| `200 {}` | All validations passed. Your live request will succeed. |
| `400` | One or more validations failed. See errors array for details. |

JSON

```
// 400 — schema validation failure
{
  "errors": ["zip format is not valid"]
}

// 400 — unexpected field
{
  "errors": ["unexpected field: network_fee_notional"]
}
```

# 

Initiate Payout - New Participants

Use this pattern when submitting a payout for participants that have not been previously onboarded with zerohash. Provide full PII inline for the Ultimate Payor and Beneficiary. zerohash creates the corresponding `participant_code` values automatically.

For now - only `entity` types are supported for the Ultimate Payor. For the Beneficiary, both `entity` and `individual` are currently supported

**Request - Individual Beneficiary:**

JSON

```
{
  "account_model": "fully_disclosed",
  "payor": {
    "participant_code": "PAYOR1",
    "payor": {
      "info": {
        "entity": {
         "onboarding_profile": "payouts_payor_ultimate",
          "legal_name": "Acme Corp",
          "contact_number": "+15553765432",
          "address_one": "1 Main St.",
          "address_two": "Suite 1000",
          "city": "Chicago",
          "postal_code": "12345",
          "jurisdiction_code": "US-IL",
          "email": "payments@acmecorp.com",
          "tax_id": "883987654",
          "id_issuing_authority": "US",
          "merchant_category_code": "4511",
          "sanction_screening": "pass",
          "sanction_screening_timestamp": 1603378501286,
          "signed_agreements": [
            {
              "type": "user_agreement",
              "region": "us",
              "signed_timestamp": 1603378501286
            }
          ]
        }
      }
    }
  },
  "beneficiary": {
    "info": {
      "individual": {
        "onboarding_profile": "payouts_beneficiary",
        "first_name": "Jane",
        "last_name": "Smith",
        "date_of_birth": "1990-01-01",
        "address_one": "123 Main St",
        "address_two": "Apt 4B",
        "city": "New York",
        "zip": "10001",
        "jurisdiction_code": "US-NY",
        "tax_id": "123456789",
        "id_issuing_authority": "US"
      }
    },
    "external_account": {
      "info": {
        "network": "SOL",
        "crypto_address": "ab123...",
        "supported_symbols": ["USDC"]
      }
    }
  },
  "payment": {
    "asset": "USDC.SOL",
    "quoted_asset": "USD",
    "total": "100.00",
    "description": "Contractor payout"
  },
  "metadata": {
    "client_ref": "your-internal-ref-id",
    "campaign": "weekly-contractor-payout"
  }
}
```

Notes:

- For the Beneficiary object, the API will respect the following as it relates to the `tax_id`, `id_number_type` and `id_number` fields:
 - If `id_issuing_authority` = US or PR, then either the `tax_id` is required OR the `id_number_type` and the `id_number` is required
 - the `tax_id` value may an SSN or ITIN (both are expected to be 9 digits)
 - If `id_issuing_authority` is **not** US or PR, then the `tax_id` is expected to be omitted. And then the API will expect a value for both `id_number_type` and `id_number`

**Request Entity Beneficiary:**

JSON

```
{
  "account_model": "fully_disclosed",
  "payor": {
    "participant_code": "PAYOR1",
    "payor": {
      "info": {
        "entity": {
         "onboarding_profile": "payouts_payor_ultimate",
          "legal_name": "Acme Corp",
          "contact_number": "+15553765432",
          "address_one": "1 Main St.",
          "address_two": "Suite 1000",
          "city": "Chicago",
          "postal_code": "12345",
          "jurisdiction_code": "US-IL",
          "email": "payments@acmecorp.com",
          "tax_id": "883987654",
          "id_issuing_authority": "US",
          "sanction_screening": "pass",
          "sanction_screening_timestamp": 1603378501286,
          "signed_agreements": [
            {
              "type": "user_agreement",
              "region": "us",
              "signed_timestamp": 1603378501286
            }
          ]
        }
      }
    }
  },
  "beneficiary": {
    "info": {
      "entity": {
        "onboarding_profile": "payouts_beneficiary",
        "legal_name": "Contractor LLC",
        "contact_number": "15553765432",
        "address_one": "456 Oak Ave",
        "address_two": "",
        "city": "Austin",
        "postal_code": "73301",
        "jurisdiction_code": "US-TX",
        "tax_id": "123456789",
        "id_issuing_authority": "US",
        "email": "billing@contractorllc.com"
      }
    },
    "external_account": {
      "info": {
        "network": "SOL",
        "crypto_address": "cd456...",
        "supported_symbols": ["USDC"]
      }
    }
  },
  "payment": {
    "asset": "USDC.SOL",
    "quoted_asset": "USD",
    "total": "500.00",
    "description": "Invoice payment"
  },
  "metadata": {
    "client_ref": "your-internal-ref-id"
  }
}
```

**Response:**

JSON

```
// 202
{
  "idempotency_key": "your-idempotency-key",
  "payout_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "status": "pending"
}
```

# 

Initiate Payout - Existing Participants

If the Ultimate Payor, Beneficiary, and/or external account have already been onboarded in a previous payout, you can reference them by ID instead of re-submitting full PII. Mix and match - any combination of inline PII and reference IDs is supported.

| Object | Reference Field |
| --- | --- |
| Ultimate Payor | `payor.payor.participant_code` |
| Beneficiary | `beneficiary.participant_code` |
| Beneficiary external account | `beneficiary.external_account.external_account_id` |

**Request:**

JSON

```
{
  "account_model": "fully_disclosed",
  "payor": {
    "participant_code": "PAYOR1",
    "payor": {
      "participant_code": "UPAYOR1"
    }
  },
  "beneficiary": {
    "participant_code": "BENEF1",
    "external_account": {
      "external_account_id": "ea_3b1d8e4a"
    }
  },
  "payment": {
    "asset": "USDC.SOL",
    "quoted_asset": "USD",
    "total": "100.00",
    "description": "Contractor payout"
  },
  "metadata": {
    "client_ref": "your-internal-ref-id",
    "campaign": "weekly-contractor-payout"
  }
}
```

**Response:**

JSON

```
// 202
{
  "idempotency_key": "your-idempotency-key",
  "payout_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "status": "pending"
}
```

**Idempotency**

[POST /payouts](https://docs.zerohash.com/reference/post_payouts) is idempotent. Supply an Idempotency-Key header with each request.

- Same key + same payload → zerohash returns the original response and does not initiate a duplicate payout.
- Same key + different payload → zerohash returns 400.

The idempotency key is included on all webhook events, GET responses, and reports. You can also query by it directly: `GET /payouts?idempotency-key=your-key`.

## 

**Error Reference**

| Status | Error | Cause |
| --- | --- | --- |
| `400` | `should have required property 'platform_code'` | Missing `platform_code` |
| `400` | `should have required property 'entity_name'` | Missing `entity_name` |
| `400` | `<field> format is not valid` | Field fails schema format validation |
| `400` | `unexpected field: <field_name>` | Request body contains an unrecognized field |
| `400` | `idempotency key reused with different payload` | Same key submitted with a different body |
| `422` | `asset is currently depegged and conversions are halted` | Payout asset is depegged |

# 

Query Payout

You can query a Payout record via the [GET /payouts](https://docs.zerohash.com/reference/get_payouts) endpoint.

**Response:**

JSON

```
{
  "payout_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "idempotency_key": "client-supplied-uuid",
  "status": "completed",
  "sub_status": "payment.settled",
  "previous_sub_status": "payment.posted",
  "created_at": "2026-05-06T12:00:00Z",
  "updated_at": "2026-05-06T12:01:45Z",
  "failure_reason": null,
  "resources": {
    "payor": {
      "participant_code": "PAYOR1",
      "payor": {
        "participant_code": "ORIG01",
        "status": "approved"
      }
    },
    "beneficiary": {
      "participant_code": "BENEF1",
      "status": "approved",
      "external_account": {
        "external_account_id": "ea_3b1d8e4a",
        "account_nickname": "Max's USDC wallet",
        "status": "approved",
        "details": {
          "network": "SOL",
          "supported_symbols": [
            "USDC"
          ],
          "crypto_address": "ab123...",
          "destination_tag": ""
        },
        "created_at": "2026-05-06T12:01:00Z",
        "updated_at": "2026-05-06T12:01:20Z"
      }
    },
    "payment": {
      "payment_id": "pmt_4c9d2e10",
      "network": "SOL",
      "asset": "USDC",
      "quoted_asset": "USD",
      "total": "100.00",
      "rate": "1.00",
      "destination_amount": "100.00",
      "status": "posted",
      "description": "Monthly payout",
      "payment_details": {
        "withdrawal_request_id": "wr_uuid_xyz",
        "trade_id": "tr_uuid_qrs",
        "on_chain_transaction_id": "0xabc123...",
        "network_fee_notional": "0.00",
        "network_fee_quantity": "0.00"
      },
      "created_at": "2026-05-06T12:01:30Z",
      "updated_at": "2026-05-06T12:01:45Z"
    }
  },
  "account_model": "fully_disclosed"
}
```

# 

Webhooks

All payout lifecycle events use `payload_type: payout.status_updated`. After a successful [POST /payouts](https://docs.zerohash.com/reference/post_payouts) events are emitted in the following sequence. The `payout_id` and `idempotency_key` are present on every event.

**Event Sequence**

| # | `sub_status` | Payout `status` |
| --- | --- | --- |
| 1 | null (initial) | `pending` |
| 2 | `payor.payor.submitted` | `pending` |
| 3 | `payor.payor.approved` | `pending` |
| 3a | `payor.payor.rejected` | `rejected` |
| 4 | `beneficiary.submitted` | `pending` |
| 5 | `beneficiary.approved` | `pending` |
| 5a | `beneficiary.pending_approval` | `pending` |
| 5b | `beneficiary.rejected` | `rejected` |
| 6 | `beneficiary.external_account.submitted` | `pending` |
| 7 | `beneficiary.external_account.approved` | `pending` |
| 7a | `beneficiary.external_account.rejected` | `rejected` |
| 8 | `payment.submitted` | `pending` |
| 9 | `payment.posted` | `pending` |
| 10 | `payment.settled` | `completed` |
| 10a | `payment.failed` | `failed` |

### 

Event payloads

**Payout pending (initial)**

JSON

```
{
  "payout_id": "payout_abc123",
  "idempotency_key": "your-idempotency-key",
  "created_at": "2026-05-06T12:00:00Z",
  "updated_at": "2026-05-06T12:01:45Z",
  "status": "pending",
  "sub_status": null,
  "previous_sub_status": null,
  "resources": {
    "payor": { "participant_code": "PAYOR1", "payor": { "status": null } },
    "beneficiary": { "participant_code": null, "status": null, "external_account": { "external_account_id": null, "status": null, "crypto_address": "ab123..."}},
    "payment": { "payment_id": null, "on_chain_transaction_id": null, "status": null, "rate": "1.00",
      "destination_amount": "100.00"}
  },
  "timestamp": "2026-05-06T12:01:30Z",
  "failure_reason": null
}
```

**Ultimate Payor submitted**

JSON

```
{
  "payout_id": "payout_abc123",
  "idempotency_key": "your-idempotency-key",
  "created_at": "2026-05-06T12:00:00Z",
  "updated_at": "2026-05-06T12:01:45Z",
  "status": "pending",
  "sub_status": "payor.payor.submitted",
  "previous_sub_status": null,
  "resources": {
    "payor": { "participant_code": "PAYOR1", "payor": { "status": "submitted", "participant_code": "UPAYOR1" } },
    "beneficiary": { "participant_code": null, "status": null, "external_account": { "external_account_id": null, "status": null, "crypto_address": "ab123..."}},
    "payment": { "payment_id": null, "on_chain_transaction_id": null, "status": null, "rate": "1.00",
      "destination_amount": "100.00"}
  },
  "timestamp": "2026-05-06T12:01:30Z",
  "failure_reason": null
}
```

**Ultimate Payor approved**

JSON

```
{
  "payout_id": "payout_abc123",
  "idempotency_key": "your-idempotency-key",
  "created_at": "2026-05-06T12:00:00Z",
  "updated_at": "2026-05-06T12:01:45Z",
  "status": "pending",
  "sub_status": "payor.payor.approved",
  "previous_sub_status": "payor.payor.submitted",
  "resources": {
    "payor": { "participant_code": "PAYOR1", "payor": { "status": "approved", "participant_code": "UPAYOR1" } },
    "beneficiary": { "participant_code": null, "status": null, "external_account": { "external_account_id": null, "status": null, "crypto_address": "ab123..."}} ,
    "payment": { "payment_id": null, "on_chain_transaction_id": null, "status": null, "rate": "1.00",
      "destination_amount": "100.00"}
  },
  "timestamp": "2026-05-06T12:01:30Z",
  "failure_reason": null
}
```

**Ultimate Payor rejected**

JSON

```
{
  "payout_id": "payout_abc123",
  "idempotency_key": "your-idempotency-key",
  "created_at": "2026-05-06T12:00:00Z",
  "updated_at": "2026-05-06T12:01:45Z",
  "status": "rejected",
  "sub_status": "payor.payor.rejected",
  "previous_sub_status": null,
  "resources": {
    "payor": { "participant_code": "PAYOR1", "payor": { "status": "rejected", "participant_code": "UPAYOR1" } },
    "beneficiary": { "participant_code": null, "status": null, "external_account": { "external_account_id": null, "status": null, "crypto_address": "ab123..."}},
    "payment": { "payment_id": null, "on_chain_transaction_id": null, "status": null, "rate": "1.00",
      "destination_amount": "100.00"}
  },
  "timestamp": "2026-05-06T12:01:30Z",
  "failure_reason": null
}
```

**Beneficiary submitted**

JSON

```
{
  "payout_id": "payout_abc123",
  "idempotency_key": "your-idempotency-key",
  "created_at": "2026-05-06T12:00:00Z",
  "updated_at": "2026-05-06T12:01:45Z",
  "status": "pending",
  "sub_status": "beneficiary.submitted",
  "previous_sub_status": "payor.payor.approved",
  "resources": {
    "payor": { "participant_code": "PAYOR1", "payor": { "status": "approved", "participant_code": "UPAYOR1" } },
    "beneficiary": { "participant_code": "BENEF1", "status": "submitted", "external_account": { "external_account_id": null, "status": null, "crypto_address": "ab123..."}},
    "payment": { "payment_id": null, "on_chain_transaction_id": null, "status": null, "rate": "1.00",
      "destination_amount": "100.00"}
  },
  "timestamp": "2026-05-06T12:01:30Z",
  "failure_reason": null
}
```

**Beneficiary approved**

JSON

```
{
  "payout_id": "payout_abc123",
  "idempotency_key": "your-idempotency-key",
  "created_at": "2026-05-06T12:00:00Z",
  "updated_at": "2026-05-06T12:01:45Z",
  "status": "pending",
  "sub_status": "beneficiary.approved",
  "previous_sub_status": "beneficiary.submitted",
  "resources": {
    "payor": { "participant_code": "PAYOR1", "payor": { "status": "approved", "participant_code": "UPAYOR1" } },
    "beneficiary": { "participant_code": "BENEF1", "status": "approved", "external_account": { "external_account_id": null, "status": null, "crypto_address": "ab123..."}},
    "payment": { "payment_id": null, "on_chain_transaction_id": null, "status": null, "rate": "1.00",
      "destination_amount": "100.00"}
  },
  "timestamp": "2026-05-06T12:01:30Z",
  "failure_reason": null
}
```

**Beneficiary pending approval**

JSON

```
{
  "payout_id": "payout_abc123",
  "idempotency_key": "your-idempotency-key",
  "created_at": "2026-05-06T12:00:00Z",
  "updated_at": "2026-05-06T12:01:45Z",
  "status": "pending",
  "sub_status": "beneficiary.pending_approval",
  "previous_sub_status": "beneficiary.submitted",
  "resources": {
    "payor": { "participant_code": "PAYOR1", "payor": { "status": "approved", "participant_code": "UPAYOR1" } },
    "beneficiary": { "participant_code": "BENEF1", "status": "pending_approval", "external_account": { "external_account_id": null, "status": null, "crypto_address": "ab123..."}},
    "payment": { "payment_id": null, "on_chain_transaction_id": null, "status": null, "rate": "1.00",
      "destination_amount": "100.00"}
  },
  "timestamp": "2026-05-06T12:01:30Z",
  "failure_reason": null
}
```

**Beneficiary rejected**

JSON

```
{
  "payout_id": "payout_abc123",
  "idempotency_key": "your-idempotency-key",
  "created_at": "2026-05-06T12:00:00Z",
  "updated_at": "2026-05-06T12:01:45Z",
  "status": "rejected",
  "sub_status": "beneficiary.rejected",
  "previous_sub_status": "beneficiary.pending_approval",
  "resources": {
    "payor": { "participant_code": "PAYOR1", "payor": { "status": "approved", "participant_code": "UPAYOR1" } },
    "beneficiary": { "participant_code": "BENEF1", "status": "rejected", "external_account": { "external_account_id": null, "status": null, "crypto_address": "ab123..."}},
    "payment": { "payment_id": null, "on_chain_transaction_id": null, "status": null, "rate": "1.00",
      "destination_amount": "100.00"}
  },
  "timestamp": "2026-05-06T12:01:30Z",
  "failure_reason": null
}
```

**Beneficiary external account submitted**

JSON

```
{
  "payout_id": "payout_abc123",
  "idempotency_key": "your-idempotency-key",
  "created_at": "2026-05-06T12:00:00Z",
  "updated_at": "2026-05-06T12:01:45Z",
  "status": "pending",
  "sub_status": "beneficiary.external_account.submitted",
  "previous_sub_status": "beneficiary.approved",
  "resources": {
    "payor": { "participant_code": "PAYOR1", "payor": { "status": "approved", "participant_code": "UPAYOR1" } },
    "beneficiary": { "participant_code": "BENEF1", "status": "approved", "external_account": { "external_account_id": "ea_xyz789", "status": "submitted", "crypto_address": "ab123..."}},
    "payment": { "payment_id": null, "on_chain_transaction_id": null, "status": null, "rate": "1.00",
      "destination_amount": "100.00"}
  },
  "timestamp": "2026-05-06T12:01:30Z",
  "failure_reason": null
}
```

**Beneficiary external account approved**

JSON

```
{
  "payout_id": "payout_abc123",
  "idempotency_key": "your-idempotency-key",
  "created_at": "2026-05-06T12:00:00Z",
  "updated_at": "2026-05-06T12:01:45Z",
  "status": "pending",
  "sub_status": "beneficiary.external_account.approved",
  "previous_sub_status": "beneficiary.external_account.submitted",
  "resources": {
    "payor": { "participant_code": "PAYOR1", "payor": { "status": "approved", "participant_code": "UPAYOR1" } },
    "beneficiary": { "participant_code": "BENEF1", "status": "approved", "external_account": { "external_account_id": "ea_xyz789", "status": "approved", "crypto_address": "ab123..."}},
    "payment": { "payment_id": null, "on_chain_transaction_id": null, "status": null, "rate": "1.00",
      "destination_amount": "100.00"}
  },
  "timestamp": "2026-05-06T12:01:30Z",
  "failure_reason": null
}
```

**Beneficiary external account rejected**

JSON

```
{
  "payout_id": "payout_abc123",
  "idempotency_key": "your-idempotency-key",
  "created_at": "2026-05-06T12:00:00Z",
  "updated_at": "2026-05-06T12:01:45Z",
  "status": "rejected",
  "sub_status": "beneficiary.external_account.rejected",
  "previous_sub_status": "beneficiary.external_account.submitted",
  "resources": {
    "payor": { "participant_code": "PAYOR1", "payor": { "status": "approved", "participant_code": "UPAYOR1" } },
    "beneficiary": { "participant_code": "BENEF1", "status": "approved", "external_account": { "external_account_id": "ea_xyz789", "status": "rejected" } },
    "payment": { "payment_id": null, "on_chain_transaction_id": null, "status": null, "rate": "1.00",
      "destination_amount": "100.00"}
  },
  "timestamp": "2026-05-06T12:01:30Z",
  "failure_reason": null
}
```

**Payment submitted**

JSON

```
{
  "payout_id": "payout_abc123",
  "idempotency_key": "your-idempotency-key",
  "created_at": "2026-05-06T12:00:00Z",
  "updated_at": "2026-05-06T12:01:45Z",
  "status": "pending",
  "sub_status": "payment.submitted",
  "previous_sub_status": "beneficiary.external_account.approved",
  "resources": {
    "payor": { "participant_code": "PAYOR1", "payor": { "participant_code": "UPAYOR1", "status": "approved" } },
    "beneficiary": { "participant_code": "BENEF1", "status": "approved", "external_account": { "external_account_id": "ea_xyz789", "status": "approved", "crypto_address": "ab123..."}},
    "payment": {
      "payment_id": "pmt_abc123",
      "description": "Contractor payout",
      "asset": "USDC",
      "quoted_asset": "USD",
      "total": "100.00",
      "rate": "1.00",
      "destination_amount": "100.00",
      "status": "submitted",
      "network": "SOL",
      "payment_details": {
        "withdrawal_request_id": null,
        "trade_id": "tr_abc123",
        "on_chain_transaction_id": null,
        "network_fee_notional": null,
        "network_fee_quantity": null
      }
    }
  },
  "timestamp": "2026-05-06T12:06:00Z",
  "failure_reason": null
}
```

**Payment posted**

JSON

```
{
  "payout_id": "payout_abc123",
  "idempotency_key": "your-idempotency-key",
  "created_at": "2026-05-06T12:00:00Z",
  "updated_at": "2026-05-06T12:01:45Z",
  "status": "pending",
  "sub_status": "payment.posted",
  "previous_sub_status": "payment.submitted",
  "resources": {
    "payor": { "participant_code": "PAYOR1", "payor": { "participant_code": "UPAYOR1", "status": "approved" } },
    "beneficiary": { "participant_code": "BENEF1", "status": "approved", "external_account": { "external_account_id": "ea_xyz789", "status": "approved", "crypto_address": "ab123..."}},
    "payment": {
      "payment_id": "pmt_abc123",
      "description": "Contractor payout",
      "asset": "USDC",
      "quoted_asset": "USD",
      "total": "100.00",
      "rate": "1.00",
      "destination_amount": "100.00",
      "status": "posted",
      "network": "SOL",
      "payment_details": {
        "withdrawal_request_id": "wr_xyz456",
        "trade_id": "tr_abc123",
        "on_chain_transaction_id": null,
        "network_fee_notional": null,
        "network_fee_quantity": null
      }
    }
  },
  "timestamp": "2026-05-06T12:07:15Z",
  "failure_reason": null
}
```

**Payment settled**

JSON

```
{
  "payout_id": "payout_abc123",
  "idempotency_key": "your-idempotency-key",
  "created_at": "2026-05-06T12:00:00Z",
  "updated_at": "2026-05-06T12:01:45Z",
  "status": "completed",
  "sub_status": "payment.settled",
  "previous_sub_status": "payment.posted",
  "resources": {
    "payor": { "participant_code": "PAYOR1", "payor": { "participant_code": "UPAYOR1", "status": "approved" }},
    "beneficiary": { "participant_code": "BENEF1", "status": "approved", "external_account": { "external_account_id": "ea_xyz789", "status": "approved", "crypto_address": "ab123..."}},
    "payment": {
      "payment_id": "pmt_abc123",
      "description": "Contractor payout",
      "asset": "USDC",
      "quoted_asset": "USD",
      "total": "100.00",
      "rate": "1.00",
      "destination_amount": "100.00",
      "status": "settled",
      "network": "SOL",
      "payment_details": {
        "withdrawal_request_id": "wr_xyz456",
        "trade_id": "tr_abc123",
        "on_chain_transaction_id": "0xabc123...",
        "network_fee_notional": "0.01",
        "network_fee_quantity": "0.0000000384712"
      }
    }
  },
  "timestamp": "2026-05-06T12:08:45Z",
  "failure_reason": null
}
```

**Payment failed**

JSON

```
{
  "payout_id": "payout_abc123",
  "idempotency_key": "your-idempotency-key",
  "created_at": "2026-05-06T12:00:00Z",
  "updated_at": "2026-05-06T12:01:45Z",
  "status": "failed",
  "sub_status": "payment.failed",
  "previous_sub_status": "payment.posted",
  "resources": {
    "payor": { "participant_code": "PAYOR1", "payor": { "participant_code": "UPAYOR1", "status": "approved" } },
    "beneficiary": { "participant_code": "BENEF1", "status": "approved", "external_account": { "external_account_id": "ea_xyz789", "status": "approved", "crypto_address": "ab123..."}},
    "payment": {
      "payment_id": "pmt_abc123",
      "on_chain_transaction_id": "0xabc123...",
      "status": "failed"
    }
  },
  "timestamp": "2026-05-06T12:01:30Z",
  "failure_reason": "on_chain_transaction_failed"
}
```

# 

API error scenarios

| Endpoint | HTTP Status | Scenario | Response |
| --- | --- | --- | --- |
| POST /payouts | 403 | Request carries no API key | {"error": true, "message": "Missing API Key"} |
| POST /payouts | 403 | API key lacks the withdraw permissions required to post payouts | {"error": true, "message": "This api key does not have the required withdraw permissions to post payouts."} |
| POST /payouts | 400 | Missing required body field | {"errors": \["payor should have required property 'participant\_code'"\]} |
| POST /payouts | 400 | Missing required nested field (examples) | {"errors": \["payment should have required property 'asset'"\]} |
| POST /payouts | 400 | Wrong field type | {"errors": \["payment.total should be string"\]} |
| POST /payouts | 400 | signed\_timestamp not an integer | {"errors": \["signed\_timestamp should be integer"\]} |
| POST /payouts | 400 | sanction\_screening not in enum | {"errors": \["sanction\_screening should be equal to one of the allowed values"\]} |
| POST /payouts | 400 | onboarding\_profile not in allowed enum (UP entity) | {"errors": \["onboarding\_profile should be equal to one of the allowed values"\]} |
| POST /payouts | 400 | merchant\_category\_code not a 4-digit string | {"errors": \["merchant\_category\_code should match pattern "^\[0-9\]{4}$""\]} |
| POST /payouts | 400 | Unknown / extra field anywhere in body | {"errors": \["should NOT have additional properties"\]} |
| POST /payouts | 400 | validate flag wrong type | {"errors": \["validate should be boolean"\]} |
| POST /payouts | 400 | payor not exactly one of participant\_code or info (both or neither) | {"errors": \["payor must specify exactly one of participant\_code or info"\]} |
| POST /payouts | 400 | beneficiary not exactly one of participant\_code or info | {"errors": \["beneficiary must specify exactly one of participant\_code or info"\]} |
| POST /payouts | 400 | beneficiary.info not exactly one of entity or individual | {"errors": \["beneficiary.info must specify exactly one of entity or individual"\]} |
| POST /payouts | 400 | external\_account not exactly one of external\_account\_id or info | {"errors": \["beneficiary.external\_account must specify exactly one of external\_account\_id or info"\]} |
| POST /payouts | 400 | External account not approved | External account not approved |
| POST /payouts | 400 | External account does not support the payment asset | {"errors": \["external account does not support asset USDC"\]} |
| POST /payouts | 400 | Platform not enrolled in payouts product | {"errors": \["platform is not enrolled in payouts and cannot onboard payouts profiles"\]} |
| POST /payouts | 400 | Entity legal\_name missing | {"errors": \["entity legal name must be supplied"\]} |
| POST /payouts | 400 | Entity tax\_id missing | {"errors": \["tax\_id is required for payouts entity applications"\]} |
| POST /payouts | 400 | Entity tax\_id not a valid US EIN (US jurisdiction) | {"errors": \["invalid us ein format"\]} |
| POST /payouts | 400 | Entity id\_issuing\_authority missing | {"errors": \["id\_issuing\_authority is required for payouts entity applications"\]} |
| POST /payouts | 400 | Entity address\_one missing | {"errors": \["address\_one is required for payouts entity applications"\]} |
| POST /payouts | 400 | Address/city/zip format invalid (examples; PO Box, length, special chars, US zip) | {"errors": \["address\_one should not be empty and should not contain PO Box"\]} |
| POST /payouts | 400 | Entity jurisdiction\_code missing | {"errors": \["jurisdiction\_code is required"\]} |
| POST /payouts | 400 | sanction\_screening status not explicitly defined / not PASSED / bad timestamp | {"errors": \["sanction\_screening status should be explicitly defined"\]} |
| POST /payouts | 400 | Ultimate Payor entity email missing | {"errors": \["email is required for payouts payor ultimate entity applications"\]} |
| POST /payouts | 400 | merchant\_category\_code not a valid 4-digit Mastercard MCC | {"errors": \["invalid merchant\_category\_code: must be a 4-digit Mastercard MCC"\]} |
| POST /payouts | 400 | Individual beneficiary first\_name missing | {"errors": \["should have required property 'first\_name'"\]} |
| POST /payouts | 400 | Individual beneficiary last\_name missing | {"errors": \["last\_name should NOT be shorter than 1 characters"\]} |
| POST /payouts | 400 | Individual beneficiary date\_of\_birth missing | {"errors": \["date\_of\_birth is required for payouts beneficiary applications"\]} |
| POST /payouts | 400 | Individual beneficiary id\_issuing\_authority not ISO 3166-1 alpha-2 | {"errors": \["id\_issuing\_authority must be a valid ISO 3166-1 alpha-2 country code for payouts beneficiary applications"\]} |
| POST /payouts | 400 | US beneficiary supplies neither tax\_id nor id\_number + id\_number\_type | {"errors": \[""exactly one of tax\_id or id\_number with id\_number\_type is required when id\_issuing\_authority is US for payouts beneficiary applications"\]} |
| POST /payouts | 400 | US beneficiary tax\_id not 9-digit SSN/ITIN | {"errors": \["tax\_id must be a 9-digit SSN or ITIN for payouts beneficiary applications"\]} |
| POST /payouts | 400 | Non-US beneficiary supplied tax\_id (not allowed) | {"errors": \["tax\_id is not allowed when id\_issuing\_authority is not US for payouts beneficiary applications"\]} |
| POST /payouts | 400 | Float/credit balance insufficient for payout | {"errors": \["insufficient balance"\]} |
| POST /payouts | 400 | Asset not supported (no asset / not payout-enabled / account symbol mismatch) | {"errors": \["asset is not supported"\]} |
| POST /payouts | 400 | quoted\_asset is not USD | {"errors": \["invalid quoted asset"\]} |
| POST /payouts | 400 | Resolved account not approved | {"errors": \["account is not approved"\]} |
| POST /payouts | 400 | Participant (payor) not approved (payments view) | {"errors": \["participant is not approved"\]} |
| POST /payouts | 400 | Account not found (payments view) | {"errors": \["account not found"\]} |
| POST /payouts | 400 | Inline crypto address invalid for network or on deny list | {"errors": \["invalid or denied destination address"\]} |
| POST /payouts | 400 | Inline crypto address is sanctioned | {"errors": \["sanctioned address"\]} |
| POST /payouts | 400 | Asset is currently depegged (orchestrator depeg gate) | {"errors": \["asset is currently depegged and conversions are halted"\]} |
| POST /payouts | 400 | Orchestrator/downstream internal error (unmapped) | {"errors": \["internal server error"\]} |
| GET /payouts | 403 | Request carries no API key | {"error": true, "message": "Missing API Key"} |
| GET /payouts | 400 | Neither payout\_id nor idempotency\_key supplied | {"errors": \["exactly one of payout\_id or idempotency\_key is required"\]} |
| GET /payouts | 400 | Both payout\_id and idempotency\_key supplied | {"errors": \["exactly one of payout\_id or idempotency\_key is required"\]} |
| GET /payouts | 400 | payout\_id not a valid UUID | {"errors": \["payout\_id should match format "uuid""\]} |
| GET /payouts | 400 | Unknown / extra query field | {"errors": \["should NOT have additional properties"\]} |
| GET /payouts | 400 | Neither identifier (orchestrator guard) | {"errors": \["either payout\_id or idempotency\_key is required"\]} |
| GET /payouts | 400 | Both identifiers (orchestrator guard) | {"errors": \["only one of payout\_id or idempotency\_key must be provided"\]} |
| GET /payouts | 400 | payout\_id invalid UUID (orchestrator guard) | {"errors": \["payout\_id must be a valid UUID"\]} |
| GET /payouts | 404 | payout\_id does not exist | {"errors": \["payout not found"\]} |
| GET /payouts | 404 | idempotency\_key does not exist | {"errors": \["payout not found"\]} |
| GET /payouts | 500 | Orchestrator/repository internal error | {"errors": \["internal server error"\]} |

Updated 3 days ago

---

Did this page help you?

Yes

No

Copy Page