import { useDispatch, useSelector } from "react-redux"
import { useLocation, useParams, useNavigate } from "react-router-dom"
import { addToCartServer } from "../redux/Slice/cartSlice"
import { addToFavorites, removeFromFavorites } from "../redux/Slice/favoritesSlice"
import { addToCartLogic } from "../Services/AddToCart"
import { groupComponentsByStep } from "../Services/GroupComponentByStep"
import "../styles/Order.css"

export default function OrderCard({ order: orderProp, onBack }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id } = useParams()
    const location = useLocation()
    const favorites = useSelector(state => state.favorites.favorites)
    const { ordersList } = useSelector(state => state.orders)

    // סדר עדיפויות למקור ה-order:
    // 1. הגיע כ-prop (שימוש ישיר בקומפוננטה)
    // 2. הגיע דרך state של הניווט (navigate עם state) - מהיר, בלי בקשת רשת
    // 3. רענון דף / כניסה ישירה לינק - נשלוף לפי ה-id מה-URL מתוך Redux
    const order = orderProp || location.state?.order || ordersList?.find(o => o._id === id)

    const handleReorder = (item) => {
        dispatch(addToCartServer(addToCartLogic(item, 1)))
        navigate('/shoppingcart')
    }

    //בודק אם קיים כזה מוצר בפייבוריט
    const isFavorite = (item) => {
        return favorites?.items?.some(fav =>
            fav.name === item.name &&
            JSON.stringify(fav.components.map(c => c._id || c).sort()) ===
            JSON.stringify(item.components?.map(c => c._id || c).sort())
        )
    }

    const handleToggleFavorite = (e, item) => {
        e.stopPropagation()
        if (isFavorite(item)) {
            const favItem = favorites.items.find(fav => fav.name === item.name)
            dispatch(removeFromFavorites(favItem._id))
        } else {
            dispatch(addToFavorites({
                productId: item.productId,
                name: item.name,
                price: item.price,
                image: item.image || "",
                components: item.components?.map(c => c._id || c) || []
            }))
        }
    }

    if (!order) return <p>לא נמצאה הזמנה</p>


    return (
        
        <div className="la-creation-details">
            <button onClick={onBack} className="btn-back">
                ⬅ חזרה להזמנות שלי
            </button>

            <div className="details-main-header">
                <h2>פרטי הזמנה</h2>
            </div>

            <div className="order-badge-row">
                <span className="order-number-tag">Order #{order._id?.slice(-6) || "100234"}</span>
            </div>

            <div className="detailed-items-container">
                {order.items?.map((item, idx) => {
                    const groupedComponents = groupComponentsByStep(item.components);
                    const favorite = isFavorite(item);

                    return (
                        <div key={idx} className="waffle-item-card">
                            <div className="waffle-item-flex">
                                <div className="waffle-img-box">
                                    <img
                                        src={item.image || "/images/waffle-image.png"}
                                        alt={item.name}
                                        className="waffle-thumb"
                                    />
                                </div>

                                <div className="waffle-details-box">
                                    <div className="waffle-title-row">
                                        <span className="waffle-item-name">{item.name}</span>
                                        <span className="waffle-item-qty">x{item.quantity}</span>
                                    </div>

                                    <div className="waffle-components-list">
                                        {Object.entries(groupedComponents).map(([groupTitle, labels]) => (
                                            <div key={groupTitle} className="waffle-component-group">
                                                <span className="waffle-component-step-title">{groupTitle}:</span>
                                                <span className="waffle-component-tag">{labels.join(", ")}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="waffle-actions-row">
                                        <button className="btn-reorder-action" onClick={() => handleReorder(item)}>
                                           הזמן שוב (₪{item.price})
                                        </button>

                                        <button
                                            className={`btn-fav-heart ${favorite ? "heart-filled" : "heart-empty"}`}
                                            onClick={(e) => handleToggleFavorite(e, item)}
                                        >
                                            {favorite ? "♥" : "♡"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="order-footer-summary-grid">
                <div className="footer-summary-col">
                    <span className="summary-col-label">SHIP TO</span>
                    <span className="summary-col-value">{"Israel"}</span>
                </div>
                <div className="footer-summary-col">
                    <span className="summary-col-label">PAYMENT METHOD</span>
                    <span className="summary-col-value">**** **** **** 4321</span>
                </div>
            </div>
        </div>
    )
}