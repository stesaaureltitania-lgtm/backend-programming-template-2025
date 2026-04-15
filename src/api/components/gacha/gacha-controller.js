const gachaService = require('./gacha-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function doGacha(req, res, next) {
  try {
    const { userId } = req.body;
    if (!userId) {
      throw errorResponder(errorTypes.VALIDATION_ERROR, 'userId is required');
    }

    const prize = await gachaService.doGacha(userId);
    if (prize) {
      return res.status(200).json({
        message: 'Yeyy! Kamu menang. Hebat!!:',
        prize: prize.name,
      });
    }
    return res.status(200).json({
      message:
        'Yahh! Kamu kurang beruntung nihh, coba lagi yuk. Jangan menyerahh!!',
    });
  } catch (error) {
    if (
      error.message ===
      'Gak terasa, sudah sampai batas harian. Sampai jumpa besok lagi yahh!!'
    ) {
      return res.status(429).json({ error: error.message });
    }
    return next(error);
  }
}

async function getHistory(req, res, next) {
  try {
    const { userId } = req.query;
    if (!userId) {
      throw errorResponder(errorTypes.VALIDATION_ERROR, 'userId is required');
    }
    const history = await gachaService.getUserHistory(userId);
    return res.status(200).json({ history });
  } catch (error) {
    return next(error);
  }
}

async function getPrizes(req, res, next) {
  try {
    const prizes = await gachaService.getRemainingPrizes();
    return res.status(200).json({ prizes });
  } catch (error) {
    return next(error);
  }
}

async function getWinners(req, res, next) {
  try {
    const winners = await gachaService.getWinners();
    return res.status(200).json({ winners });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  doGacha,
  getHistory,
  getPrizes,
  getWinners,
};
