const axios = require('axios');
const OpayConfig = require('../../model/OpayConfig');

// POST /admin/opay/key/validate
// Body: { apiKey: string }
// Calls external validate endpoint and returns result
exports.validateOpayApiKey = async (req, res) => {
  try {
    const { apiKey } = req.body || {};
    if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) {
      return res.status(400).json({ success: false, message: 'apiKey is required' });
    }

    const url = 'https://api.oraclepay.org/api/external/key/validate';
    const response = await axios.get(url, {
      headers: { 'X-API-Key': apiKey.trim() },
      timeout: 7000,
    });

    // Pass-through relevant data
    return res.status(200).json({
      success: true,
      external: response.data,
    });
  } catch (err) {
    const status = err?.response?.status || 500;
    const data = err?.response?.data || { message: err.message || 'Server error' };
    return res.status(status).json({ success: false, error: data });
  }
};

// GET /admin/opay/config -> fetch saved config
exports.getOpayConfig = async (req, res) => {
  try {
    const cfg = await OpayConfig.findOne().lean();
    return res.json({ success: true, data: cfg || null });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

// POST /admin/opay/config -> save/update apiKey and optionally active; store lastValidation if provided
// Body: { apiKey: string, active?: boolean, lastValidation?: object }
exports.saveOpayConfig = async (req, res) => {
  try {
    const { apiKey, active = true, lastValidation = null } = req.body || {};
    if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) {
      return res.status(400).json({ success: false, message: 'apiKey is required' });
    }
    const update = { apiKey: apiKey.trim(), active: !!active };
    if (lastValidation) update.lastValidation = lastValidation;
    const cfg = await OpayConfig.findOneAndUpdate({}, update, { new: true, upsert: true, setDefaultsOnInsert: true });
    return res.json({ success: true, data: cfg });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

// PATCH /admin/opay/config/active -> toggle only active
// Body: { active: boolean }
exports.setOpayActive = async (req, res) => {
  try {
    const { active } = req.body || {};
    if (typeof active !== 'boolean') {
      return res.status(400).json({ success: false, message: 'active must be boolean' });
    }
    const cfg = await OpayConfig.findOneAndUpdate({}, { active }, { new: true, upsert: true, setDefaultsOnInsert: true });
    return res.json({ success: true, data: cfg });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};
