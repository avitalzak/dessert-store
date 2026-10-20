// לאן מגיעים כשנכנסים לתפריט ("התחילו עכשיו!", "לתפריט", "הוספת פריטים"):
// "products"   = ישר לתפריט עם פס הקטגוריות בצד, כמו בעמדות הזמנה בחנויות
// "categories" = קודם עמוד נפרד של קטגוריות (ההתנהגות הקודמת)
// כדי לחזור למצב הקודם - פשוט לשנות כאן ל-"categories".
export const MENU_START = "products"

export const MENU_PATH = MENU_START === "categories" ? "/categories" : "/products"
