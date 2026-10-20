import { startEffects } from "./effects"

// ערכת העיצוב הפעילה באתר:
// "kiosk"   = עמדת הזמנה אמיתית: לבן, נקי, תמונות גדולות, פס הזמנה קבוע (החדש ביותר)
// "rose"    = ורוד-פטל-פיסטוק עם אפקטים
// "noir"    = שוקולד וזהב קולנועי
// "atelier" = פטיסרי צרפתי בהיר ושקט
// "classic" = העיצוב המקורי
// כדי לחזור לעיצוב הישן - פשוט לשנות כאן ל-"classic".
export const DEFAULT_THEME = "kiosk"

const THEMES = ["kiosk", "rose", "noir", "atelier", "classic"]

// אפשר גם להשוות זמנית בלי לשנות קוד: להוסיף לכתובת ?theme=classic / atelier / noir / rose / kiosk
export function getActiveTheme() {
    const fromUrl = new URLSearchParams(window.location.search).get("theme")
    return THEMES.includes(fromUrl) ? fromUrl : DEFAULT_THEME
}

const activeTheme = getActiveTheme()

export function applyTheme() {
    // כל הערכות החדשות נבנות מעל atelier, ולכן מקבלות גם אותו
    const root = document.documentElement
    root.classList.toggle("atelier", activeTheme !== "classic")
    root.classList.toggle("noir", activeTheme === "noir")
    root.classList.toggle("rose", activeTheme === "rose")
    root.classList.toggle("kiosk", activeTheme === "kiosk")

    if (["noir", "rose", "kiosk"].includes(activeTheme)) startEffects(activeTheme)
}

export function isTheme(name) {
    return activeTheme === name
}
