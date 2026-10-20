import { FaArrowRight, FaCheck, FaHeart, FaRegHeart, FaRedo, FaTimesCircle } from "react-icons/fa"
import { groupComponentsByStep } from "../../Services/GroupComponentByStep"
import {
    METHOD_LABELS, STATUS_FLOW, STATUS_LABELS, TYPE_LABELS,
    formatOrderDate, itemCount, orderNumber
} from "./orderLabels"

// פרטי הזמנה בתצוגת העמדה: מעקב סטטוס, פריטים עם תמונות, סיכום
export default function KioskOrderDetails({ order, onBack, getImage, isFavorite, onReorder, onToggleFavorite }) {
    const currentStep = STATUS_FLOW.indexOf(order.status)
    const cancelled = order.status === "cancelled"

    return (
        <div className="acc-section">
            <div className="acc-detail-head">
                <button className="acc-back" onClick={onBack}>
                    <FaArrowRight /> חזרה
                </button>
                <div className="acc-detail-title">
                    <h2>הזמנה <span dir="ltr">#{orderNumber(order)}</span></h2>
                    <span>{formatOrderDate(order.date)}</span>
                </div>
            </div>

            {cancelled ? (
                <div className="acc-cancelled">
                    <FaTimesCircle /> ההזמנה בוטלה
                </div>
            ) : (
                <div className="acc-tracker">
                    {STATUS_FLOW.map((status, i) => (
                        <div
                            key={status}
                            className={`acc-track-step ${i < currentStep ? "done" : ""} ${i === currentStep ? "current" : ""}`}
                        >
                            <span className="acc-track-dot">{i <= currentStep ? <FaCheck /> : i + 1}</span>
                            <span className="acc-track-label">{STATUS_LABELS[status]}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="acc-meta">
                {order.type && (
                    <div><span>סוג הזמנה</span><strong>{TYPE_LABELS[order.type] || order.type}</strong></div>
                )}
                {order.tableNumber && (
                    <div><span>שולחן</span><strong>{order.tableNumber}</strong></div>
                )}
                {order.method && (
                    <div><span>אמצעי תשלום</span><strong>{METHOD_LABELS[order.method] || order.method}</strong></div>
                )}
                <div><span>פריטים</span><strong>{itemCount(order)}</strong></div>
            </div>

            <div className="acc-items">
                {order.items?.map((item, idx) => {
                    const groups = groupComponentsByStep(item.components)
                    const favorite = isFavorite(item)
                    const image = getImage(item)

                    return (
                        <div key={idx} className="acc-item">
                            <span className="acc-item-img">{image && <img src={image} alt="" />}</span>

                            <div className="acc-item-body">
                                <div className="acc-item-top">
                                    <strong>{item.name} <small dir="ltr">×{item.quantity}</small></strong>
                                    <span className="acc-item-price">₪{item.price}</span>
                                </div>

                                {Object.keys(groups).length > 0 && (
                                    <div className="acc-item-tags">
                                        {Object.entries(groups).map(([title, labels]) => (
                                            <span key={title} className="acc-tag"><b>{title}:</b> {labels.join(", ")}</span>
                                        ))}
                                    </div>
                                )}

                                <div className="acc-item-actions">
                                    <button className="acc-btn-primary acc-btn-sm" onClick={() => onReorder(item)}>
                                        <FaRedo /> הזמנה חוזרת
                                    </button>
                                    <button
                                        className={`acc-heart ${favorite ? "on" : ""}`}
                                        onClick={(e) => onToggleFavorite(e, item)}
                                        aria-label={favorite ? "הסרה מהמועדפים" : "הוספה למועדפים"}
                                    >
                                        {favorite ? <FaHeart /> : <FaRegHeart />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="acc-total">
                <span>סה״כ שולם</span>
                <strong>₪{order.totalPrice}</strong>
            </div>
        </div>
    )
}
