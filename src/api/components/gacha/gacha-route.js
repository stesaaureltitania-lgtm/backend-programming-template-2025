const express = require('express');
const gachaController = require('./gacha-controller');
const gachaService = require('./gacha-service');

const route = express.Router();

// Inisialisasi hadiah saat server start
(async () => {
  try {
    await gachaService.initializePrizes();
    // eslint-disable-next-line no-console
    console.log('Gacha prizes initialized');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize gacha prizes:', error);
  }
})();

module.exports = (app) => {
  app.use('/gacha', route);

  route.post('/', gachaController.doGacha); // Ini untuk melakukan undian
  route.get('/history', gachaController.getHistory); // Histori user
  route.get('/prizes', gachaController.getPrizes); // Sisa hadiahnya
  route.get('/winners', gachaController.getWinners); // Daftar pemenang (nama samar)
};
