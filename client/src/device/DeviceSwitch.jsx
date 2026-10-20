import { FaDesktop, FaTabletAlt } from "react-icons/fa"
import { getDeviceMode, switchDeviceMode } from "./device"

// כפתורי מחשב / טאבלט בצד המסך.
// getPath מאפשר למסגרת הטאבלט למסור את העמוד שפתוח בתוכה, כדי לחזור למחשב באותו עמוד.
export default function DeviceSwitch({ getPath, children }) {
    const mode = getDeviceMode()

    const choose = (next) => {
        if (next === mode) return
        switchDeviceMode(next, getPath?.())
    }

    return (
        <div className="device-switch" role="group" aria-label="מצב תצוגה">
            <button
                type="button"
                className={mode === "desktop" ? "active" : ""}
                onClick={() => choose("desktop")}
                title="תצוגת מחשב"
            >
                <FaDesktop />
                <span>מחשב</span>
            </button>
            <button
                type="button"
                className={mode === "tablet" ? "active" : ""}
                onClick={() => choose("tablet")}
                title="תצוגת טאבלט"
            >
                <FaTabletAlt />
                <span>טאבלט</span>
            </button>
            {children}
        </div>
    )
}
