import { useState } from "react"
import { FaBackspace, FaChair } from "react-icons/fa"
import "../../styles/KioskFlow.css"

const MAX_TABLE = 99

// מקלדת מספרים גדולה לבחירת מספר שולחן - בלי המקלדת של הטאבלט שמכסה חצי מסך
export default function TablePicker({ initial, onConfirm, onCancel }) {
    const [value, setValue] = useState(initial ? String(initial) : "")

    const press = (digit) => {
        const next = (value + digit).replace(/^0+/, "")
        if (next && Number(next) <= MAX_TABLE) setValue(next)
    }

    return (
        <div className="kf-overlay" role="dialog" aria-modal="true" aria-labelledby="table-title" onClick={onCancel}>
            <div className="kf-card kf-table" onClick={e => e.stopPropagation()}>
                <span className="kf-badge-ico"><FaChair /></span>
                <h2 id="table-title">באיזה שולחן אתם יושבים?</h2>
                <p>המספר מופיע על השולחן. נביא את ההזמנה אליכם.</p>

                <div className={`kf-table-display ${value ? "" : "is-empty"}`} aria-live="polite">
                    {value || "—"}
                </div>

                <div className="kf-keypad">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => (
                        <button key={d} type="button" onClick={() => press(String(d))}>{d}</button>
                    ))}
                    <button type="button" className="kf-key-muted" onClick={() => setValue(v => v.slice(0, -1))} aria-label="מחיקה">
                        <FaBackspace />
                    </button>
                    <button type="button" onClick={() => press("0")}>0</button>
                    <button type="button" className="kf-key-ok" disabled={!value} onClick={() => onConfirm(Number(value))}>
                        אישור
                    </button>
                </div>

                <button type="button" className="kf-btn kf-btn-ghost kf-full" onClick={onCancel}>ביטול</button>
            </div>
        </div>
    )
}
