const mongoose = require('mongoose');

const animationBannerSchema = new mongoose.Schema({
  titleEN: {
    type: String,
    default: 'Jackpot',
  },
  titleBD: {
    type: String,
    default: 'জ্যাকপট',
  },
  titleColor: {
    type: String,
    default: '#FFFF00', // Yellow color code
  },
  bannerBackgroundColor: {
    type: String,
    default: '#012632',
  },
  numberBackgroundColor: {
    type: String,
    default: '#FFFFFF', // White color code
  },
  numberColor: {
    type: String,
    default: '#000000', // Black color code
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Ensure only one document exists for new documents
animationBannerSchema.pre('save', async function (next) {
  // Only check for new documents, not updates
  if (this.isNew) {
    const docs = await this.constructor.countDocuments();
    if (docs >= 1) {
      return next(new Error('Only one AnimationBanner document is allowed.'));
    }
  }
  next();
});

const AnimationBanner = mongoose.model('AnimationBanner', animationBannerSchema);

// Initialize with default document if none exists
AnimationBanner.initDefault = async () => {
  const count = await AnimationBanner.countDocuments();
  if (count === 0) {
    const defaultBanner = new AnimationBanner({});
    await defaultBanner.save();
    console.log('Default AnimationBanner document created.');
  }
};

module.exports = AnimationBanner;