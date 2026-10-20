import { useNavigate } from "react-router-dom"
import { FaChevronLeft, FaReceipt } from "react-icons/fa"
import { STATUS_LABELS, formatOrderDate, itemCount, orderNumber } from "./orderLabels"
import { MENU_PATH } from "../../Services/menuStart"

// רשימת "ההזמנות שלי" בתצוגת העמדה
export default function KioskOrderList({ orders, onSelect, getImage }) {
    const navigate = useNavigate()

    if (!orders || orders.length === 0) {
        return (
            <div className="acc-empty">
                <span className="acc-empty-ico"><FaReceipt /></span>
                <strong>עוד אין הזמנות</strong>
                <span>אחרי ההזמנה הראשונה היא תופיע כאן</span>
                <button className="acc-btn-primary" onClick={() => navigate(MENU_PATH)}>לתפריט</button>
            </div>
        )
    }

    return (
        <div className="acc-section">
            <div className="acc-section-head">
                <h2>ההזמנות שלי</h2>
                <span className="acc-chip">{orders.length} הזמנות</span>
            </div>

            <div className="acc-order-list">
                {orders.map(order => {
                    const thumbs = (order.items || []).map(getImage).filter(Boolean).slice(0, 3)
                    const summary = (order.items || []).map(i => `${i.name} ×${i.quantity || 1}`).join(", ")

                    return (
                        <button key={order._id} className="acc-order-row" onClick={() => onSelect(order)}>
                            <span className="acc-thumbs">
                                {thumbs.length > 0
                                    ? thumbs.map((src, i) => <img key={i} src={src} alt="" />)
                                    : <span className="acc-thumb-empty"><FaReceipt /></span>}
                            </span>

                            <span className="acc-order-main">
                                <span className="acc-order-title">
                                    <span>הזמנה <span dir="ltr">#{orderNumber(order)}</span></span>
                                    <span className="acc-status" data-status={order.status}>
                                        {STATUS_LABELS[order.status] || order.status}
                                    </span>
                                </span>
                                <span className="acc-order-date">{formatOrderDate(order.date)} · {itemCount(order)} פריטים</span>
                                <span className="acc-order-summary">{summary}</span>
                            </span>

                            <span className="acc-order-total">₪{order.totalPrice}</span>
                            <FaChevronLeft className="acc-chevron" />
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
