# Payment Verification Callback Webhook

This document describes how the backend sends a callback (webhook) to your server after a payment is verified.

## When It Fires
- Trigger: After a successful verification via `POST /api/external/verify/:provider/:token`.
- Timing: The callback is sent immediately after the transaction is marked verified in the database.
- Asynchronous: The callback does not block or change the API response to the client; failures are logged.

## Destination URL
- The POST request is sent to the subscription's callback URL.
- Resolution order:
  1. `ApiAccessToken.meta.callbackUrl` (if present)
  2. Otherwise, the subscription's `apiCallbackUrl`
- Only `http` or `https` URLs are accepted. HTTPS is strongly recommended.

## Request Details
- Method: `POST`
- Headers:
  - `Content-Type: application/json`
- Timeout: 5 seconds (no retries currently).

## JSON Payload
```json
{
  "success": true,
  "userIdentifyAddress": "user-1234",
  "time": "2025-11-17T14:32:10.000Z",
  "method": "bkash",
  "token": "c1f2a3b4c5d6e7f8a9b0c1d2",
  "amount": 200,
  "from": "017XXXXXXXX",
  "trxid": "ABCD1234EFG",
  "deviceName": "Xiaomi Redmi Note 11",
  "deviceId": "a1b2c3d4e5f6",
  "bdTimeZone": "2025-11-17T20:32:10+06:00"
}
```

### Field Reference
- `success` (boolean): Always `true` for verified callbacks.
- `userIdentifyAddress` (string): Identifier you provided when generating the token (`/api/external/generate?userIdentifyAddress=...`).
- `time` (string): The device-reported message time if available; otherwise the ISO time of message creation.
- `method` (string): First payment method associated with the token (e.g., `bkash`, `nagad`, `rocket`, `upay`).
- `token` (string): The short token used in the verification route.
- `amount` (number): Parsed payment amount.
- `from` (string|null): Sender or masked account reference if available.
- `trxid` (string): Transaction ID extracted from the incoming message.
- `deviceName` (string|null): Name of the device that received the payment notification.
- `deviceId` (string|null): Unique device code (Android ID) that sent the message.
- `bdTimeZone` (string|null): Bangladesh timezone timestamp recorded with the message.

## Idempotency & Duplicates
- A transaction (`trxid`) can only be verified once. Subsequent attempts are rejected.
- The callback is sent once per successful verification. There is no retry queue at present.

## Expected Response From Your Server
- Any `2xx` response is considered an acknowledgement.
- The backend does not currently parse or rely on the response body.
- If your endpoint is slow or unreachable, the request will timeout after ~5s and will not retry automatically.

## Security Recommendations
- Use HTTPS for your callback URL.
- Restrict the endpoint by IP allowlist or API key.
- Optional HMAC signature (not implemented yet):
  - We can add an `X-Signature` header (`HMAC-SHA256` of the raw body with a shared secret). Let us know if you want this enabled.

## Testing Your Callback
- Use a tool like https://webhook.site/ to get a temporary URL.
- Set your subscription `apiCallbackUrl` to that URL.
- Perform a test verification flow. Observe the incoming request on webhook.site.

## Troubleshooting
- No callback received:
  - Ensure `apiCallbackUrl` is set and begins with `http` or `https`.
  - Check server logs for: "Callback POST failed" warnings.
  - Confirm your endpoint responds within 5 seconds.
- Mismatched data:
  - Confirm your `trxid`, `amount`, and `method` match the expected values used in the verification.

---
If you want retries, additional fields, or an HMAC signature, let us know and we’ll extend the implementation accordingly.
