const express = require('express');
const cors = require('cors');
const PRODUCTS = require('./products');
const CONTROLLED = require('./controlled');

const app = express();
app.use(cors());

const CHAINS = ['שופרסל', 'רמי לוי', 'ויקטורי', 'יוחננוף'];

function findProduct(searchName) {
  const normalized = searchName.trim();
  return PRODUCTS.find(p =>
    p.keywords.some(k => normalized.includes(k) || k.includes(normalized) ||
      normalized.replace(/\s+/g, '').includes(k.replace(/\s+/g, '')))
  );
}

function findControlled(searchName) {
  const normalized = searchName.trim();
  return CONTROLLED.filter(p =>
    p.keywords.some(k => normalized.includes(k) || k.includes(normalized))
  );
}

app.get('/compare', (req, res) => {
  const items = (req.query.items || '')
    .split(',')
    .map(s => decodeURIComponent(s.trim()))
    .filter(Boolean);

  if (items.length === 0) return res.status(400).json({ error: 'חסרים פריטים' });

  const results = CHAINS.map(chain => {
    const itemPrices = {};
    let matched = 0;

    for (const item of items) {
      const found = findProduct(item);
      if (found && found.prices[chain]) {
        itemPrices[item] = found.prices[chain];
        matched++;
      }
    }

    const total = Object.values(itemPrices).reduce((s, p) => s + p, 0);
    return {
      chainName: chain,
      branchName: `${chain} - סניף מרכזי`,
      total: parseFloat(total.toFixed(2)),
      matched,
      items: itemPrices,
      disclaimer: 'מחירים משוערים בלבד — אינם מחירים רשמיים',
    };
  }).sort((a, b) => {
    if (a.matched === 0 && b.matched === 0) return 0;
    if (a.matched === 0) return 1;
    if (b.matched === 0) return -1;
    return a.total - b.total;
  });

  res.json(results);
});

app.get('/controlled', (req, res) => {
  const search = (req.query.q || '').toLowerCase().trim();
  const results = search
    ? CONTROLLED.filter(p =>
        p.name.includes(search) ||
        p.keywords.some(k => k.includes(search) || search.includes(k))
      )
    : CONTROLLED;
  res.json(results);
});

app.get('/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Sat, May  2, 2026  5:13:26 PM
