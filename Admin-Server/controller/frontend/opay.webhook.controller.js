const OpayVerifiedTransaction = require('../../model/OpayVerifiedTransaction');

// POST /api/v1/frontend/opay/callback ( receives webhook from OraclePay )
// Receives OraclePay verification callback and stores it
exports.opayVerificationCallback = async (req, res) => {
  try {
    const payload = req.body || {};
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

    // Upsert by trxid to keep idempotency
    const filter = doc.trxid ? { trxid: doc.trxid } : { token: doc.token, userIdentifyAddress: doc.userIdentifyAddress };
    const saved = await OpayVerifiedTransaction.findOneAndUpdate(
      filter,
      { $set: doc },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};
