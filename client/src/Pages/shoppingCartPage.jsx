import Cart from "../Components/ShoppingCart"
import Payment from "../Components/payment"
import Header from "../Components/header"
import "../styles/ShoppingCart.css"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { FaPlus } from "react-icons/fa"
import { MENU_PATH } from "../Services/menuStart"

export default function ShoppingCart() {

    const navigate = useNavigate()
    const items = useSelector(state => state.cart.items || [])
    const count = items.reduce((sum, item) => sum + (item.quantity || 1), 0)

    
    return (
        <div className="kiosk-cart-page-wrapper">

            <main className="kiosk-cart-main-layout">
                
                <section className="kiosk-cart-left-panel">
                    <Payment />
                </section>

                <section className="kiosk-cart-right-panel">
                    <div className="kiosk-panel-title-wrapper">
                        <span className="kiosk-panel-icon">🛒</span>
                        <h2 className="kiosk-panel-title">סל הקניות שלך</h2>
                        {count > 0 && <span className="cart-count kiosk-only">{count} פריטים</span>}
                        <button className="cart-add-more kiosk-only" onClick={() => navigate(MENU_PATH)}>
                            <FaPlus /> הוספת פריטים
                        </button>
                    </div>
                    <Cart />
                </section>
            </main>
        </div>
    )
}
