const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Utility async to get
async function readData() {
  const raw = await fs.readFile(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

// Utility async to post
async function writeData(data) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
}

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const data = await readData();
    let results = data;

    const { q, page = 1, pageSize = 10 } = req.query;

    if (q) {
      results = results.filter(item =>
        item.name.toLowerCase().includes(q.toLowerCase())
      );
    }

    const pageNum = parseInt(page, 10) || 1;
    const size = parseInt(pageSize, 10) || 10;
    const start = (pageNum - 1) * size;
    const paginated = results.slice(start, start + size);

    res.json({
      total: results.length,
      items: paginated,
      page: pageNum,
      pageSize: size
    });
  } catch (err) {
    next(err);
  }
});


// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const data = await readData();
    const item = data.find(i => i.id === parseInt(req.params.id));
    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    const { name, price, category } = req.body;
    if (
      typeof name !== 'string' ||
      !name.trim() ||
      typeof price !== 'number' ||
      isNaN(price) ||
      price < 0
    ) {
      const err = new Error('Invalid payload: name (string) and price (number >= 0) are required.');
      err.status = 400;
      throw err;
    }

    const data = await readData();
    const item = {
      id: Date.now(),
      name: name.trim(),
      price,
      category: category ? String(category).trim() : undefined
    };
    data.push(item);
    await writeData(data);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});


module.exports = router;
