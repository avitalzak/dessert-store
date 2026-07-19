import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchFavorites, removeFromFavorites } from "../redux/Slice/favoritesSlice"
import { addToCartServer } from "../redux/Slice/cartSlice"
import { useNavigate } from "react-router-dom"
import { groupComponentsByStep } from "../Services/GroupComponentByStep"
import { addToCartLogic } from "../Services/AddToCart"
import "../styles/Favorites.css"

export default function Favorites() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { favorites, loading } = useSelector(state => state.favorites)

    useEffect(() => {
        dispatch(fetchFavorites())
    }, [])

    const handleAddToCart = (item) => {
        dispatch(addToCartServer(addToCartLogic(item)))
        navigate('/shoppingcart')
    }

    if (loading) return <p>טוען...</p>
    if (!favorites || !favorites.items || favorites.items.length === 0) {
        return (
            <div className="empty-favorites">
                <span className="empty-icon">💖</span>
                <p className="empty-text">עוד לא נבחרו מועדפים</p>
            </div>
        )
    }
        


// שנה את ה-return שלך לזה:
    return (
        <div className="favorites-page-container">
            <h2 className="favorites-title">המועדפים שלי</h2>
            
            {favorites.items.map((item, index) => (
                <div key={item._id || index} className="item-card">
                    <h3 className="item-name">{item.name}</h3>
                    
                    <div className="actions-row">
                        <button className="btn-custom btn-add" onClick={() => handleAddToCart(item)}>🛒 הוסף לסל</button>
                        <button className="btn-custom btn-remove" onClick={() => dispatch(removeFromFavorites(item._id))}>✕ הסר</button>
                    </div>
        
                    <div className="components-box">
                        {Object.entries(groupComponentsByStep(item.components)).map(([title, labels]) => (
                            <p key={title} style={{ margin: "5px 0", fontSize: "14px", color: "#756a64" }}>
                                <strong>{title}:</strong> {labels.join(", ")}
                            </p>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}