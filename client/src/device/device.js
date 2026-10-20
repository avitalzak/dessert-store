// מצב תצוגה: "desktop" = האתר הרגיל, "tablet" = האתר בתוך מסגרת בגודל טאבלט.
// הבחירה נשמרת בדפדפן, כך שאחרי רענון חוזרים למצב האחרון.
const MODE_KEY = "deviceMode"
const ORIENTATION_KEY = "tabletOrientation"

function read(key, fallback, allowed) {
    try {
        const value = localStorage.getItem(key)
        return allowed.includes(value) ? value : fallback
    } catch {
        return fallback
    }
}

function write(key, value) {
    try {
        localStorage.setItem(key, value)
    } catch {
        // בלי localStorage המצב פשוט לא יישמר
    }
}

// האם אנחנו האתר שרץ בתוך מסגרת הטאבלט
export const isInsideTabletFrame = window.self !== window.top

// תצוגת טאבלט: האתר בתוך מסגרת הטאבלט, או טאבלט אמיתי (מסך מגע בגודל טאבלט ומעלה)
export const isTabletView = isInsideTabletFrame || window.matchMedia("(pointer: coarse) and (min-width: 700px)").matches

export function getDeviceMode() {
    return read(MODE_KEY, "desktop", ["desktop", "tablet"])
}

export function getTabletOrientation() {
    return read(ORIENTATION_KEY, "portrait", ["portrait", "landscape"])
}

export function setTabletOrientation(orientation) {
    write(ORIENTATION_KEY, orientation)
}

// מעבר מצב = טעינה מחדש באותו עמוד, כדי שלא יישארו שאריות מהמצב הקודם
export function switchDeviceMode(mode, path = window.location.pathname + window.location.search + window.location.hash) {
    write(MODE_KEY, mode)
    window.location.assign(path)
}
