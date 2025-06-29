const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../data/items.json');
const { mean } = require('../utils/mean'); // Ajusta o path conforme necessário

// Cache local
let statsCache = null;
let cacheMTime = 0;

// Função para calcular stats
function calcStats(items) {
  return {
    total: items.length,
    averagePrice: mean(items.map(i => i.price))
  };
}

// GET /api/stats
router.get('/', async (req, res, next) => {
  try {
    const stat = await fs.stat(DATA_PATH);
    if (statsCache && stat.mtimeMs === cacheMTime) {
      return res.json(statsCache);
    }

    const raw = await fs.readFile(DATA_PATH, 'utf8');
    const items = JSON.parse(raw);
    const stats = calcStats(items);

    // Atualiza cache
    statsCache = stats;
    cacheMTime = stat.mtimeMs;

    res.json(stats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
