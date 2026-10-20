import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"

// פס "ההזמנה שלי" בתחתית המסך - כמו בעמדות הזמנה בחנויות.
// מוצג רק בעמודי הקטגוריות והמוצרים, וכשיש משהו בסל.
export default function OrderBar() {
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const items = useSelector(state => state.cart.items || [])

    const onBrowsePage = pathname === "/categories" || pathname === "/products"
    if (!onBrowsePage || items.length === 0) return null

    const count = items.reduce((sum, item) => sum + (item.quantity || 1), 0)
    const total = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)

    return (
        <div className="order-bar">
            <div className="order-bar-info">
                <span className="order-bar-label">ההזמנה שלי</span>
                <span className="order-bar-count" key={count}>{count} פריטים</span>
            </div>
            <span className="order-bar-total" key={total}>₪{total.toFixed(0)}</span>
            <button className="order-bar-btn" onClick={() => navigate("/shoppingcart")}>
                לצפייה בהזמנה ולתשלום
            </button>
        </div>
    )
}
