const OpayVerifiedTransaction = require('../../model/OpayVerifiedTransaction');
const axios = require('axios'); // ← এটা যোগ করো

// POST /api/v1/frontend/opay/callback
// Receives OraclePay / Opay verification webhook and processes it
exports.opayVerificationCallback = async (req, res) => {
  try {
    const payload = req.body || {};

    // Prepare document for MongoDB
    const doc = {
      success: !!payload.success,
      userIdentifyAddress: payload.userIdentifyAddress || null,
      time: payload.time ? new Date(payload.time) : undefined,
      method: payload.method || null,
      token: payload.token || null,
      amount: typeof payload.amount === 'number' ? payload.amount : Number(payload.amount) || null,
      from: payload.from || null,
      trxid: payload.trxid || null,
      deviceName: payload.deviceName || null,
      deviceId: payload.deviceId || null,
      bdTimeZone: payload.bdTimeZone || null,
      raw: payload,
      receivedAt: new Date(),
    };

    // Upsert by trxid (preferred) or fallback to token + userIdentifyAddress
    const filter = doc.trxid
      ? { trxid: doc.trxid }
      : { token: doc.token, userIdentifyAddress: doc.userIdentifyAddress };

    const saved = await OpayVerifiedTransaction.findOneAndUpdate(
      filter,
      { $set: doc },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // ------------------- Server 2-তে deposit notify করা (axios দিয়ে) -------------------
    if (saved.success && saved.userIdentifyAddress && saved.amount > 0) {
      try {
        const server2Url = process.env.SERVER2_DEPOSIT_URL;

        const response = await axios.post(server2Url, {
          username: saved.userIdentifyAddress,   // Server 2-এর Admin.username
          amount: saved.amount,
          trxid: saved.trxid,
          token: saved.token,
          method: saved.method,
          time: saved.time ? saved.time.toISOString() : new Date().toISOString(),
          from: saved.from || null,
          // আরও ফিল্ড চাইলে এখানে যোগ করো
        }, {
          headers: {
            'Content-Type': 'application/json',
            // secret header দরকার হলে পরে যোগ করতে পারো, যেমন:
            // 'x-internal-secret': process.env.INTERNAL_API_SECRET
          },
          timeout: 10000, // optional: 10 সেকেন্ড timeout (axios-এর সুবিধা)
        });

        // axios-এ response.data সরাসরি পাওয়া যায়
        if (response.data?.success) {
          console.log(`[OPAY] Deposit notified to Server 2 successfully → ${saved.userIdentifyAddress} + ${saved.amount} TK`);
        } else {
          console.error(`[OPAY] Server 2 deposit failed:`, response.data?.message || 'Unknown error');
          // পরে retry logic / alert / queue যোগ করা যাবে
        }

      } catch (notifyErr) {
        // axios error handling – response থাকলে response.data দেখা যায়
        if (notifyErr.response) {
          console.error(`[OPAY] Server 2 notify failed with status ${notifyErr.response.status}:`, notifyErr.response.data);
        } else {
          console.error(`[OPAY] Failed to notify Server 2:`, notifyErr.message);
        }
        // production-এ retry / monitoring যোগ করো
      }
    }

    // Webhook-এর জন্য সবসময় 200 দিতে হয় (Opay/পেমেন্ট গেটওয়ে retry এড়াতে)
    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('[OPAY CALLBACK ERROR]', err);
    // webhook-এর ক্ষেত্রে 200 দিলে ভালো – retry loop চালু হয় না
    return res.status(200).json({ success: false, message: 'Internal error but acknowledged' });
    // চাইলে 500 দিতে পারো, কিন্তু payment gateway-গুলো সাধারণত 200 expect করে
  }
};