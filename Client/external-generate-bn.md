# Generate (সংক্ষিপ্ত)

`GET /api/external/generate`

টোকেন ও পেমেন্ট পেজ URL তৈরি করে (২০ মিনিটের জন্য বৈধ)।

হেডার:
- `X-API-Key`: আপনার সাবস্ক্রিপশনের API key

কুয়েরি:
- `methods` (আবশ্যক): `bkash,nagad,rocket,upay` থেকে কমা-সেপ্টারেটেড
- `amount` (আবশ্যক): পজিটিভ সংখ্যা
- `userIdentifyAddress` (আবশ্যক): ইউজার/অর্ডার আইডেন্টিফায়ার

সফল রেসপন্স উদাহরণ:
```json
{
  "success": true,
  "payment_page_url": "https://api.oraclepay.org/bkash,nagad/2f3c9f4b1a2c7d4e8f0a12cd",
  "amount": 200,
  "userIdentifyAddress": "ORDER-2025-0001",
  "expiresAt": "2025-12-15T14:20:00.000Z",
  "expiresInSeconds": 1200,
  "methods": ["bkash", "nagad"],
  "callbackUrl": "https://merchant.example.com/webhook/payment-verified"
}
```

ত্রুটি (উদাহরণ):
- 400: `Missing X-API-Key header` / `methods query required` / `amount... must be > 0` / `userIdentifyAddress query required` / `No callback URL configured...`
- 401: `Invalid API key`
- 403: `API key inactive` / `Subscription expired; API key deactivated.`
- 400: ডিভাইস/মেথড নেই, বা রিকোয়েস্টেড মেথড প্ল্যানে নেই

ফ্লো:
1) `/generate` কল করুন → `payment_page_url` ও টোকেন নিন
2) আপনার পেজে রিডাইরেক্ট করুন → ভিতরে `/resolve/:provider/:token` কল করুন
3) ইউজার পেমেন্ট করার পর `trxid` নিয়ে `/verify/:provider/:token` কল করুন
4) আপনার `callbackUrl`-এ ওয়েবহুক রিসিভ করুন

উদাহরণ (curl):
```bash
curl -X GET "https://api.oraclepay.org/api/external/generate?methods=bkash,nagad&amount=350&userIdentifyAddress=ORDER-2025-0001" \
  -H "X-API-Key: YOUR_API_KEY"
```

উদাহরণ (JavaScript fetch):
```js
async function generateToken() {
  const url = "https://api.oraclepay.org/api/external/generate?methods=bkash,nagad&amount=350&userIdentifyAddress=ORDER-2025-0001";
  const res = await fetch(url, { headers: { "X-API-Key": "YOUR_API_KEY" } });
  const data = await res.json();
  // data.payment_page_url, data.methods, data.expiresAt
  console.log(data);
}
```
