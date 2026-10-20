import { useEffect, useRef, useState } from "react"
import { MdScreenRotation } from "react-icons/md"
import DeviceSwitch from "./DeviceSwitch"
import { getTabletOrientation, setTabletOrientation } from "./device"

// גודל מסך של אייפד אייר (בפיקסלים של CSS)
const TABLET = { width: 820, height: 1180 }
const BEZEL = 24
const MARGIN = 32

// מציג את האתר בתוך iframe בגודל טאבלט אמיתי, כך שכל ה-media queries
// והאלמנטים הקבועים (פס ההזמנה, כפתור העזרה) מתנהגים כמו על טאבלט.
export default function TabletFrame() {
    const frameRef = useRef(null)
    const [orientation, setOrientation] = useState(getTabletOrientation)
    const [scale, setScale] = useState(1)

    const width = orientation === "portrait" ? TABLET.width : TABLET.height
    const height = orientation === "portrait" ? TABLET.height : TABLET.width

    // מקטינים את הטאבלט כדי שייכנס כולו בחלון
    useEffect(() => {
        const fit = () => {
            const outerW = width + BEZEL * 2
            const outerH = height + BEZEL * 2
            setScale(Math.min(1, (window.innerWidth - MARGIN * 2) / outerW, (window.innerHeight - MARGIN * 2) / outerH))
        }
        fit()
        window.addEventListener("resize", fit)
        return () => window.removeEventListener("resize", fit)
    }, [width, height])

    // הכתובת בחלון הראשי עוקבת אחרי העמוד שפתוח בטאבלט, כך שרענון נשאר באותו עמוד
    const syncUrl = () => {
        const path = currentPath()
        if (path) window.history.replaceState(null, "", path)
    }

    const currentPath = () => {
        try {
            const loc = frameRef.current.contentWindow.location
            return loc.pathname + loc.search + loc.hash
        } catch {
            return null
        }
    }

    const rotate = () => {
        const next = orientation === "portrait" ? "landscape" : "portrait"
        setTabletOrientation(next)
        setOrientation(next)
    }

    // הכתובת נקבעת פעם אחת בלבד: syncUrl משנה את הכתובת בחלון הראשי, ואם src היה מחושב
    // מחדש בכל רינדור (למשל בסיבוב) - ה-iframe היה נטען מחדש וכל האנימציות היו מתחילות שוב
    const [src] = useState(() => window.location.pathname + window.location.search + window.location.hash)

    return (
        <div className="tablet-stage">
            <div
                className="tablet-device"
                style={{ width: width + BEZEL * 2, height: height + BEZEL * 2, transform: `scale(${scale})` }}
            >
                <iframe
                    ref={frameRef}
                    className="tablet-screen"
                    src={src}
                    title="תצוגת טאבלט"
                    style={{ width, height }}
                    onLoad={() => {
                        syncUrl()
                        // ניווט בתוך האתר לא טוען מחדש את ה-iframe, לכן מאזינים גם לשינויי היסטוריה
                        const win = frameRef.current?.contentWindow
                        if (!win) return
                        win.addEventListener("popstate", syncUrl)
                        for (const method of ["pushState", "replaceState"]) {
                            const original = win.history[method].bind(win.history)
                            win.history[method] = (...args) => {
                                original(...args)
                                syncUrl()
                            }
                        }
                    }}
                />
            </div>

            <DeviceSwitch getPath={currentPath}>
                <button type="button" onClick={rotate} title="סיבוב הטאבלט">
                    <MdScreenRotation />
                    <span>{orientation === "portrait" ? "לרוחב" : "לאורך"}</span>
                </button>
            </DeviceSwitch>
        </div>
    )
}
