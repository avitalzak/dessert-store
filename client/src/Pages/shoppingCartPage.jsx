import Cart from "../Components/ShoppingCart"
import Payment from "../Components/payment"
import Header from "../Components/header"
import "../styles/ShoppingCart.css"

export default function ShoppingCart() {

    
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
                    </div>
                    <Cart />
                </section>
            </main>
        </div>
    )
}
