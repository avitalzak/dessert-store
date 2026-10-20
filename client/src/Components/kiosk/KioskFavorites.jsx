import { useNavigate } from "react-router-dom"
import { FaHeart, FaShoppingBag } from "react-icons/fa"
import { groupComponentsByStep } from "../../Services/GroupComponentByStep"
import { MENU_PATH } from "../../Services/menuStart"

// "המועדפים שלי" בתצוגת העמדה - רשת כרטיסים עם תמונה
export default function KioskFavorites({ items, getImage, onAdd, onRemove }) {
    const navigate = useNavigate()

    if (!items || items.length === 0) {
        return (
            <div className="acc-empty">
                <span className="acc-empty-ico"><FaHeart /></span>
                <strong>עוד אין מועדפים</strong>
                <span>סמנו ♥ על מנה ב"ההזמנות שלי" והיא תחכה לכם כאן</span>
                <button className="acc-btn-primary" onClick={() => navigate(MENU_PATH)}>לתפריט</button>
            </div>
        )
    }

    return (
        <div className="acc-section">
            <div className="acc-section-head">
                <h2>המועדפים שלי</h2>
                <span className="acc-chip">{items.length} מנות</span>
            </div>

            <div className="acc-fav-grid">
                {items.map((item, index) => {
                    const image = getImage(item)
                    const details = Object.values(groupComponentsByStep(item.components)).flat().join(" · ")

                    return (
                        <div key={item._id || index} className="acc-fav-card">
                            <div className="acc-fav-img">
                                {image && <img src={image} alt="" />}
                                <button
                                    className="acc-heart on acc-fav-heart"
                                    onClick={() => onRemove(item)}
                                    aria-label="הסרה מהמועדפים"
                                >
                                    <FaHeart />
                                </button>
                            </div>

                            <div className="acc-fav-body">
                                <div className="acc-item-top">
                                    <strong>{item.name}</strong>
                                    {item.price != null && <span className="acc-item-price">₪{item.price}</span>}
                                </div>
                                <p className="acc-fav-details">{details || " "}</p>
                                <button className="acc-btn-primary acc-btn-block" onClick={() => onAdd(item)}>
                                    <FaShoppingBag /> הוספה לסל
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
