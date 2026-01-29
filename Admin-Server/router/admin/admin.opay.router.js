const express = require('express');
const router = express.Router();
const { validateOpayApiKey, getOpayConfig, saveOpayConfig, setOpayActive } = require('../../controller/admin/opay.controller');
const { getVerifiedDeposits } = require('../../controller/admin/opay.verified.controller');
const adminAuth = require('../../middleware/admin.auth.middleware');

// Protect with admin auth if available
router.post('/opay/key/validate', adminAuth, validateOpayApiKey);
router.get('/opay/config', adminAuth, getOpayConfig);
router.post('/opay/config', adminAuth, saveOpayConfig);
router.patch('/opay/config/active', adminAuth, setOpayActive);

// Verified deposits list
router.get('/opay/verified', adminAuth, getVerifiedDeposits);

module.exports = router;
