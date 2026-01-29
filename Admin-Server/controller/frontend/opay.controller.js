const OpayConfig = require('../../model/OpayConfig');

// GET /api/opay/viewer-key
// Public endpoint to provide viewerApiKey to the frontend client
// Returns { success: true, data: { viewerApiKey, active } }
exports.getViewerApiKey = async (req, res) => {
  try {
    const cfg = await OpayConfig.findOne().lean();
    if (!cfg) {
      return res.status(200).json({ success: true, data: { viewerApiKey: null, active: false } });
    }
    // If viewerApiKey is not set, fall back to using apiKey as requested
    const key = cfg.viewerApiKey || cfg.apiKey || null;
    return res.status(200).json({ success: true, data: { viewerApiKey: key, active: !!cfg.active } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};
