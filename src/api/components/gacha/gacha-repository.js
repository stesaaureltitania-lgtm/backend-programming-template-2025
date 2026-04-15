const { GachaPrize, GachaAttempt } = require('../../../models');

async function getPrizes() {
  return GachaPrize.find({});
}

async function getPrizeById(id) {
  return GachaPrize.findOne({ id });
}

async function updatePrizeRemaining(id, remaining) {
  return GachaPrize.findOneAndUpdate({ id }, { remaining }, { new: true });
}

async function createAttempt(userId, prizeId = null) {
  const attempt = new GachaAttempt({ userId, prizeWon: prizeId });
  return attempt.save();
}

async function getUserAttemptsToday(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return GachaAttempt.find({
    userId,
    date: { $gte: today, $lt: tomorrow },
  });
}

async function getUserHistory(userId) {
  return GachaAttempt.find({ userId }).populate('prizeWon').sort({ date: -1 });
}

async function getAllAttemptsWithPrizes() {
  return GachaAttempt.find({ prizeWon: { $ne: null } }).populate('prizeWon');
}

module.exports = {
  getPrizes,
  getPrizeById,
  updatePrizeRemaining,
  createAttempt,
  getUserAttemptsToday,
  getUserHistory,
  getAllAttemptsWithPrizes,
};
