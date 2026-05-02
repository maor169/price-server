const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const cors = require('cors');

const app = express();
app.use(cors());

const CHAINS = [
  { name: 'שופרסל', file: 'shufersal' },
  { name: 'רמי לוי', file: 'rami-levy' },
  { name: 'ויקטורי', file: 'victory' },
  { name: 'יוחננוף', file: 'yohananof' },
];

function findProduct(products, searchName) {
  const normalized = searchName.toLowerCase().trim();
  return products.find(p => {
    const name = (p.ItemName?.[0] || p.name || '').toLowerCase();
    return name.includes(normalized) || normalized.split(' ').some(w => w.length > 2 && name.includes(w));
  });
}

async function fetchChainPrices(chainFile, items) {
  try {
    const url = `https://raw.githubusercontent.com/OpenIsraeliSupermarkets/daily-publish-supermarket-data/main/latest/${chainFile}.json`;
    const resp = await axios.get(url, { timeout: 8000 });
    const products = Array.isArray(resp.data) ? resp.data : Object.values(resp.data?.products || resp.data || {});

    const itemPrices = {};
    let matched = 0;
    for (const item of items) {
      const found = findProduct(products, item);
      if (found) {
        const price = parseFloat(found.price || found.ItemPrice?.[0] || 0);
        if (price > 0) { itemPrices[item] = price; matched++; }
      }
    }
    return { matched, itemPrices };
  } catch {
    return { matched: 0, itemPrices: {} };
  }
}

app.get('/compare', async (req, res) => {
  const items = (req.query.items || '')
    .split(',')
    .map(s => decodeURIComponent(s.trim()))
    .filter(Boolean);

  if (items.length === 0) return res.status(400).json({ error: 'חסרים פריטים' });

  const results = await Promise.all(
    CHAINS.map(async (chain) => {
      const { matched, itemPrices } = await fetchChainPrices(chain.file, items);
      const total = Object.values(itemPrices).reduce((s, p) => s + p, 0);
      return {
        chainName: chain.name,
        branchName: `${chain.name} - סניף מרכזי`,
        total: parseFloat(total.toFixed(2)),
        matched,
        items: itemPrices,
      };
    })
  );

  const sorted = results.sort((a, b) => {
    if (a.matched === 0 && b.matched === 0) return 0;
    if (a.matched === 0) return 1;
    if (b.matched === 0) return -1;
    return a.total - b.total;
  });

  res.json(sorted);
});

app.get('/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
