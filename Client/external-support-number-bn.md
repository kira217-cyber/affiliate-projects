# Support Number (সংক্ষিপ্ত)

`GET /api/external/support-number`

সাবস্ক্রিপশন/কী ঠিক থাকলে আপনার অ্যাকাউন্টের `supportNumber` দেয়।

হেডার:
- `X-API-Key` (আবশ্যক)

সফল রেসপন্স:
```json
{ "success": true, "supportNumber": "+88017XXXXXXXX" }
```

ত্রুটি (উদাহরণ):
- 400: `Missing X-API-Key header`
- 401: `Invalid API key`
- 403: `API key inactive` / `Subscription expired or inactive`
- 404: `User not found`

উদাহরণ (curl):
```bash
curl -X GET "https://api.oraclepay.org/api/external/support-number" \
  -H "X-API-Key: YOUR_API_KEY"
```
