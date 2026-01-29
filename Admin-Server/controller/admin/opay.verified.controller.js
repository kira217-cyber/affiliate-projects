const OpayVerifiedTransaction = require('../../model/OpayVerifiedTransaction');

// GET /api/v1/admin/opay/verified
// Query: page, limit
exports.getVerifiedDeposits = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 200);
    const skip = (page - 1) * limit;

    const [items, total, stats] = await Promise.all([
      OpayVerifiedTransaction.find({ success: true }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      OpayVerifiedTransaction.countDocuments({ success: true }),
      OpayVerifiedTransaction.aggregate([
        { $match: { success: true } },
        { $group: { _id: null, sumAmount: { $sum: { $ifNull: ['$amount', 0] } } } },
      ]),
    ]);

    const sumAmount = (stats[0]?.sumAmount) || 0;
    return res.json({ success: true, data: { items, page, limit, total, sumAmount } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};
