// מוצרים בפיקוח מחירים ממשלתי — מחירים מירביים לצרכן כולל מע"מ
// מקור: משרד הכלכלה והתעשייה — gov.il
// עדכון אחרון: 2026 (המחירים מתעדכנים 4-6 פעמים בשנה)

const CONTROLLED_PRODUCTS = [
  // פיקוח משרד הכלכלה
  { name: 'לחם אחיד קטן (400 גר\')', maxPrice: 5.90, category: 'לחם', keywords: ['לחם אחיד', 'לחם קטן'] },
  { name: 'לחם אחיד גדול (800 גר\')', maxPrice: 9.80, category: 'לחם', keywords: ['לחם אחיד גדול', 'לחם גדול'] },
  { name: 'חלב גולמי 3% (ליטר)', maxPrice: 6.23, category: 'חלב', keywords: ['חלב 3%', 'חלב טרי'] },
  { name: 'חלב דל שומן 1% (ליטר)', maxPrice: 6.23, category: 'חלב', keywords: ['חלב 1%', 'חלב דל'] },
  { name: 'גבינה לבנה 5% (250 גר\')', maxPrice: 6.80, category: 'גבינות', keywords: ['גבינה לבנה 5%'] },
  { name: 'גבינה לבנה 9% (250 גר\')', maxPrice: 7.20, category: 'גבינות', keywords: ['גבינה לבנה 9%'] },
  { name: 'שמנת חמוצה 15% (200 מ"ל)', maxPrice: 6.50, category: 'חלב', keywords: ['שמנת חמוצה 15%'] },
  { name: 'ביצים L (12 יח\')', maxPrice: 15.90, category: 'ביצים', keywords: ['ביצים l', 'ביצים גדולות'] },
  { name: 'ביצים M (12 יח\')', maxPrice: 13.90, category: 'ביצים', keywords: ['ביצים m', 'ביצים בינוניות'] },
  { name: 'סוכר לבן (1 ק"ג)', maxPrice: 6.50, category: 'יבשים', keywords: ['סוכר לבן'] },
  { name: 'שמן סויה (1 ליטר)', maxPrice: 14.90, category: 'שמנים', keywords: ['שמן סויה'] },
  { name: 'שמן חמניות (1 ליטר)', maxPrice: 15.90, category: 'שמנים', keywords: ['שמן חמניות'] },
  { name: 'קמח לבן (1 ק"ג)', maxPrice: 5.80, category: 'יבשים', keywords: ['קמח לבן'] },
  { name: 'אורז (1 ק"ג)', maxPrice: 8.90, category: 'יבשים', keywords: ['אורז'] },
  { name: 'סרדינים בשמן (125 גר\')', maxPrice: 7.50, category: 'שימורים', keywords: ['סרדינים'] },
  { name: 'טונה בשמן (160 גר\')', maxPrice: 8.90, category: 'שימורים', keywords: ['טונה'] },
  { name: 'מרגרינה (250 גר\')', maxPrice: 8.50, category: 'מוצרי חלב', keywords: ['מרגרינה'] },

  // פיקוח משרד החקלאות
  { name: 'עוף שלם טרי (1 ק"ג)', maxPrice: 24.90, category: 'עוף', keywords: ['עוף שלם'] },
  { name: 'חזה עוף ללא עצם (1 ק"ג)', maxPrice: 37.90, category: 'עוף', keywords: ['חזה עוף'] },
  { name: 'שוקיים עוף (1 ק"ג)', maxPrice: 19.90, category: 'עוף', keywords: ['שוקיים', 'שוק עוף'] },
  { name: 'כנפיים עוף (1 ק"ג)', maxPrice: 16.90, category: 'עוף', keywords: ['כנפיים'] },
  { name: 'עוף טחון (1 ק"ג)', maxPrice: 28.90, category: 'עוף', keywords: ['עוף טחון'] },
  { name: 'חלב 3% בקרטון (1 ליטר)', maxPrice: 6.50, category: 'חלב', keywords: ['חלב קרטון'] },
  { name: 'גבינה צהובה 28% (100 גר\')', maxPrice: 9.20, category: 'גבינות', keywords: ['גבינה צהובה'] },
];

module.exports = CONTROLLED_PRODUCTS;
