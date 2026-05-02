// מוצרים בפיקוח מחירים ממשלתי — מחירים מירביים לצרכן כולל מע"מ
// מקור רשמי: משרד הכלכלה והתעשייה — gov.il/he/departments/dynamiccollectors/food-price-control-search
// המחירים מתעדכנים מעת לעת. לבדיקת המחיר הרשמי העדכני: gov.il

const CONTROLLED_PRODUCTS = [
  // לחם — פיקוח משרד הכלכלה
  { name: 'לחם אחיד כהה (750 גר\')', maxPrice: 7.30, category: 'לחם', keywords: ['לחם כהה', 'לחם אחיד'], updatedAt: '21.05.2023' },
  { name: 'לחם לבן (750 גר\')', maxPrice: 7.31, category: 'לחם', keywords: ['לחם לבן', 'לחם'], updatedAt: '21.05.2023' },
  { name: 'חלה / מאפה שמרים (500 גר\')', maxPrice: 6.56, category: 'לחם', keywords: ['חלה', 'מאפה שמרים'], updatedAt: '21.05.2023' },

  // חלב — פיקוח משרד החקלאות
  { name: 'חלב טרי 3% שומן (שקית 1 ליטר)', maxPrice: 6.21, category: 'חלב', keywords: ['חלב 3%', 'חלב טרי', 'חלב'], updatedAt: '01.05.2024' },
  { name: 'חלב טרי 1% שומן (שקית 1 ליטר)', maxPrice: 5.76, category: 'חלב', keywords: ['חלב 1%', 'חלב דל שומן'], updatedAt: '01.05.2024' },
  { name: 'שמנת מתוקה 38% (קרטון 250 מ"ל)', maxPrice: 7.39, category: 'חלב', keywords: ['שמנת מתוקה', 'שמנת'], updatedAt: '01.05.2024' },

  // גבינות — פיקוח משרד החקלאות
  { name: 'גבינה קשה חצי שמנה (1 ק"ג)', maxPrice: 51.14, category: 'גבינות', keywords: ['גבינה קשה', 'גבינה צהובה'], updatedAt: '01.05.2024' },

  // ביצים — פיקוח משרד החקלאות
  { name: 'ביצי מאכל XL (12 יח\')', maxPrice: 15.19, category: 'ביצים', keywords: ['ביצים xl', 'ביצים גדולות', 'ביצים'], updatedAt: '01.02.2023' },

  // מלח — פיקוח משרד הכלכלה
  { name: 'מלח מטבח (1 ק"ג)', maxPrice: 2.07, category: 'יבשים', keywords: ['מלח'], updatedAt: '01.10.2015' },
];

module.exports = CONTROLLED_PRODUCTS;
