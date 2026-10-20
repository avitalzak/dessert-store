import { useEffect, useState } from "react"
import { FaCashRegister, FaCheck, FaChair, FaShoppingBag } from "react-icons/fa"
import { orderNumber } from "./orderLabels"
import "../../styles/KioskFlow.css"

const AUTO_CLOSE = 15 // שניות עד שהמסך נסגר לבד ללקוח הבא

// מסך סיום אחרי הזמנה: מספר הזמנה גדול ומה קורה עכשיו
export default function OrderConfirmation({ order, method, onDone }) {
    const [secondsLeft, setSecondsLeft] = useState(AUTO_CLOSE)
    const dineIn = order.type === "dine in"

    useEffect(() => {
        const t = setTimeout(() => (secondsLeft <= 1 ? onDone() : setSecondsLeft(s => s - 1)), 1000)
        return () => clearTimeout(t)
    }, [secondsLeft, onDone])

    return (
        <div className="kf-overlay kf-overlay-solid" role="dialog" aria-modal="true" aria-labelledby="done-title">
            <div className="kf-card kf-done">
                <span className="kf-done-check"><FaCheck /></span>
                <h2 id="done-title">תודה! ההזמנה התקבלה</h2>

                <span className="kf-done-label">מספר ההזמנה שלך</span>
                <div className="kf-done-number" dir="ltr">{orderNumber(order)}</div>

                <ul className="kf-done-steps">
                    {dineIn ? (
                        <li>
                            <FaChair />
                            <span>
                                שבו בנוח
                                {order.tableNumber ? <> - נגיש את ההזמנה לשולחן <strong>{order.tableNumber}</strong></> : null}
                            </span>
                        </li>
                    ) : (
                        <li><FaShoppingBag /><span>נקרא למספר הזה כשההזמנה מוכנה לאיסוף</span></li>
                    )}
                    {method === "cash" && (
                        <li><FaCashRegister /><span>לתשלום בקופה, אמרו את מספר ההזמנה</span></li>
                    )}
                </ul>

                <button className="kf-btn kf-btn-primary kf-full" onClick={onDone}>
                    סיום ({secondsLeft})
                </button>
            </div>
        </div>
    )
}
