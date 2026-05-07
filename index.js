const express = require('express');
const cors = require('cors');
const axios = require('axios');
const PRODUCTS = require('./products');
const CONTROLLED = require('./controlled');

const app = express();
app.use(cors());

const CHAINS = ['שופרסל', 'רמי לוי', 'ויקטורי', 'יוחננוף', 'אושר עד', 'מחסני השוק', 'קרפור', 'טיב טעם'];

// תאריך עדכון מחירים — מתעדכן אוטומטית כשהשרת עולה מחדש (Render deploy)
const SERVER_START = new Date();
function getPricesUpdatedAt() {
  return SERVER_START.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' });
}

const SYNONYMS = {
  'טיטול': 'חיתולים', 'טיטולים': 'חיתולים', 'פמפרס': 'חיתולים', 'האגיס': 'חיתולים', 'huggies': 'חיתולים', 'pampers': 'חיתולים',
  'גמבה': 'פלפל', 'פפריקה': 'פלפל',
  'נוטלה': 'ממרח שוקולד',
  'קוקה': 'קולה', 'קוקה קולה': 'קולה', 'פפסי': 'קולה',
  'ספגטי': 'פסטה', 'מקרוני': 'פסטה',
  'עגבנייה': 'עגבניות', 'עגבנייות': 'עגבניות',
  'מלפפון': 'מלפפונים',
  'בננה': 'בננות',
  'תפוח': 'תפוחים',
  'בצלים': 'בצל',
  'לחם קל': 'לחם', 'לחם מלא': 'לחם',
  'חלב תנובה': 'חלב', 'חלב טרה': 'חלב',
  'ביצה': 'ביצים',
  'פטאטס': 'תפוחי אדמה', 'תפוח אדמה': 'תפוחי אדמה',
  'כרוב': 'סלט קולסלו',
};

function normalizeTerm(term) {
  const t = term.trim();
  return SYNONYMS[t] || SYNONYMS[t.toLowerCase()] || t;
}

function matchesSearch(product, term) {
  const normalized = normalizeTerm(term);
  const lower = normalized.toLowerCase();
  return product.keywords.some(k => {
    const lk = k.toLowerCase();
    return lower.includes(lk) || lk.includes(lower) ||
      lower.replace(/\s+/g, '').includes(lk.replace(/\s+/g, ''));
  });
}

function findProduct(searchName) {
  return PRODUCTS.find(p => matchesSearch(p, searchName));
}

function findProducts(searchName) {
  return PRODUCTS.filter(p => matchesSearch(p, searchName));
}

function findControlled(searchName) {
  const normalized = searchName.trim();
  return CONTROLLED.filter(p =>
    p.keywords.some(k => normalized.includes(k) || k.includes(normalized))
  );
}

app.get('/search', (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.status(400).json({ error: 'חסר פרמטר q' });

  const resolvedTerm = normalizeTerm(q);
  const matches = findProducts(q);

  if (matches.length === 0) {
    return res.json({
      query: q,
      resolvedAs: resolvedTerm !== q ? resolvedTerm : null,
      count: 0,
      results: [],
      suggestion: 'לא נמצאו מוצרים. נסה שם אחר או מילה כללית יותר.',
    });
  }

  const results = matches.map(p => {
    const sortedPrices = Object.entries(p.prices).sort((a, b) => a[1] - b[1]);
    return {
      name: p.name,
      cheapest: { chain: sortedPrices[0][0], price: sortedPrices[0][1] },
      mostExpensive: { chain: sortedPrices[sortedPrices.length - 1][0], price: sortedPrices[sortedPrices.length - 1][1] },
      prices: p.prices,
    };
  });

  res.json({
    query: q,
    resolvedAs: resolvedTerm !== q ? resolvedTerm : null,
    count: results.length,
    results,
  });
});

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
      updatedAt: getPricesUpdatedAt(),
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

let cachedControlled = null;
let lastFetched = null;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 שעות

async function loadControlledProducts() {
  try {
    const url = `https://data.gov.il/api/3/action/datastore_search?resource_id=0a760550-0426-4eb7-acf6-2ee919bf12e7&limit=380`;
    const resp = await axios.get(url, { timeout: 15000 });
    const records = resp.data.result.records;

    const latest = {};
    for (const r of records) {
      const name = r.product;
      const date = new Date(r['update date'].split('/').reverse().join('-'));
      if (!latest[name] || date > new Date(latest[name]['update date'].split('/').reverse().join('-'))) {
        latest[name] = r;
      }
    }

    cachedControlled = Object.values(latest)
      .filter(r => r['consumers price includes VAT'] > 0)
      .map(r => ({
        name: r.product,
        maxPrice: r['consumers price includes VAT'],
        eilatPrice: r['consumer price in Eilat'],
        updatedAt: r['update date'],
        category: 'מוצרים בפיקוח',
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'he'));

    console.log(`Loaded ${cachedControlled.length} controlled products from gov.il`);
  } catch (e) {
    console.error('Failed to load controlled products:', e.message);
    cachedControlled = CONTROLLED.map(p => ({ name: p.name, maxPrice: p.maxPrice, updatedAt: p.updatedAt, category: p.category }));
  }
}

app.get('/controlled', async (req, res) => {
  if (!cachedControlled || !lastFetched || Date.now() - lastFetched > CACHE_TTL) {
    await loadControlledProducts();
    lastFetched = Date.now();
  }
  const search = (req.query.q || '').trim();
  const data = cachedControlled || CONTROLLED.map(p => ({ name: p.name, maxPrice: p.maxPrice, updatedAt: p.updatedAt, category: p.category }));
  const results = search ? data.filter(p => p.name.includes(search)) : data;
  res.json(results);
});

app.get('/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await loadControlledProducts();
});
// Sat, May  2, 2026  5:13:26 PM
