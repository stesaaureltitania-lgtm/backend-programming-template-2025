const gachaRepository = require('./gacha-repository');
const { GachaPrize } = require('../../../models');

const NO_PRIZE_CHANCE = 0.2;

// Fungsi masking nama (bonus)
function maskRandom(name) {
  if (!name || name.length < 2) return '*'.repeat(name.length || 1);
  const chars = name.split('');
  const numToMask = Math.floor(Math.random() * chars.length);
  const indices = new Set();
  while (indices.size < numToMask && indices.size < chars.length) {
    indices.add(Math.floor(Math.random() * chars.length));
  }
  indices.forEach((idx) => {
    if (chars[idx] !== ' ') chars[idx] = '*';
  });
  return chars.join('');
}

async function initializePrizes() {
  const prizes = [
    { id: 1, name: 'Emas 10 gram', quota: 1, remaining: 1 },
    { id: 2, name: 'Smartphone X', quota: 5, remaining: 5 },
    { id: 3, name: 'Smartwatch Y', quota: 10, remaining: 10 },
    { id: 4, name: 'Voucher Rp100.000', quota: 100, remaining: 100 },
    { id: 5, name: 'Pulsa Rp50.000', quota: 500, remaining: 500 },
  ];
  const promises = prizes.map(async (prize) => {
    const existing = await gachaRepository.getPrizeById(prize.id);
    if (!existing) {
      const newPrize = new GachaPrize(prize);
      await newPrize.save();
    }
  });
  await Promise.all(promises);
}

async function doGacha(userId) {
  // Limit harian (kembalikan ke 5 setelah testing)
  const attemptsToday = await gachaRepository.getUserAttemptsToday(userId);
  if (attemptsToday.length >= 5) {
    throw new Error(
      'Gak terasa, sudah sampai batas harian. Sampai jumpa besok lagi yahh!!'
    );
  }

  const prizes = await gachaRepository.getPrizes();
  const availablePrizes = prizes.filter((p) => p.remaining > 0);

  if (availablePrizes.length === 0) {
    await gachaRepository.createAttempt(userId);
    return null;
  }

  if (Math.random() < NO_PRIZE_CHANCE) {
    await gachaRepository.createAttempt(userId);
    return null;
  }

  const randomIndex = Math.floor(Math.random() * availablePrizes.length);
  const wonPrize = availablePrizes[randomIndex];

  // Ini untuk mengurangi kuota yah
  await gachaRepository.updatePrizeRemaining(
    wonPrize.id,
    wonPrize.remaining - 1
  );

  await gachaRepository.createAttempt(userId, wonPrize._id);

  return wonPrize;
}

async function getUserHistory(userId) {
  return gachaRepository.getUserHistory(userId);
}

async function getRemainingPrizes() {
  const prizes = await gachaRepository.getPrizes();
  return prizes.map((p) => ({
    id: p.id,
    name: p.name,
    remaining: p.remaining,
    quota: p.quota,
  }));
}

async function getWinners() {
  const attempts = await gachaRepository.getAllAttemptsWithPrizes();
  return attempts.map((attempt) => ({
    prize: attempt.prizeWon.name,
    winner: maskRandom(attempt.userId),
  }));
}

module.exports = {
  initializePrizes,
  doGacha,
  getUserHistory,
  getRemainingPrizes,
  getWinners,
};
