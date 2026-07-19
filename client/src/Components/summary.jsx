import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { clearSelections } from "../redux/Slice/productSlice"
import Header from "./header"
import { addToCart, addToCartServer } from "../redux/Slice/cartSlice"
import { useState } from "react"
import "../styles/Summary.css"

export default function Summary() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const isSignIn = useSelector(state => state.user.isSignIn)
    const selectedProduct = useSelector(state => state.products.selectedProduct)
    const selections = useSelector(state => state.products.selections)

    const [quantity, setQuantity] = useState(1)

    
    if (!selectedProduct) {
        return (
            <div className="kiosk-builder-wrapper">
                <div className="kiosk-main-content">
                <p className="kiosk-step-subtitle">לא נמצאה מנה בבנייה. אנא התחל תהליך מחדש.</p>
                </div>
            </div>
        )
    }

    const groupedComponents = selectedProduct.steps
        .map((step, index) => ({
            title: step.title || step.name || `שלב ${index + 1}`,
            items: selections[index] || []
        }))
        .filter(group => group.items.length > 0)

    
    const baseGroup = groupedComponents[0]
    const extraGroups = groupedComponents.slice(1)

    const basePrice = selectedProduct.price || 0
    
    const totalPrice = (basePrice) * quantity

    
    const fullComponents = Object.entries(selections).flatMap(([stepIndex, items]) => {
        const step = selectedProduct.steps[stepIndex]
        const stepTitle = step?.title || `שלב ${Number(stepIndex) + 1}`
        return (items || [])
            .filter(Boolean)
            .map(item => ({
                label: item.label,
                priceDelta: item.priceDelta || 0,
                stepTitle
            }))
    })

    const buildItem = () => {
        return {
            productId: selectedProduct._id,
            name: selectedProduct.name || "מנה מורכבת",
            price: totalPrice,
            quantity,
            components: fullComponents
        };
    };

    const saveItem = () => {
        const item = buildItem()
        if (isSignIn) {
            dispatch(addToCartServer(item))
        } else {
            dispatch(addToCart(item))
        }
        dispatch(clearSelections())
    }

    const payment = () => {
        saveItem()
        navigate('/shoppingcart')
    }

    const goToHome = () => {
        saveItem()
        navigate('/')
    }

    const deleteItem = () => {
        dispatch(clearSelections())
        navigate('/')
    }

    return (
        <div className="kiosk-builder-wrapper">
            <main className="kiosk-main-content">
                <div className="kiosk-summary-container">
                    <h2 className="kiosk-step-title">סיכום המנה שלך</h2>

                    <div className="kiosk-summary-hero-image">
                        {selectedProduct.image ? (
                            <img src={selectedProduct.image} alt={selectedProduct.name} />
                        ) : (
                            <div className="kiosk-hero-placeholder"></div>
                        )}
                    </div>

                <h3 className="kiosk-product-summary-name">{selectedProduct.name}</h3>
                    <p className="kiosk-product-summary-description">
                        La combinaison parfaite de textures croustillantes et de crèmes riches, faite sur mesure.
                    </p>

                    <div className="kiosk-summary-bill-list">
                        {groupedComponents.map((group, gIdx) => (
                            <div key={gIdx} className="kiosk-summary-bill-row">
                                <span className="kiosk-bill-label">
                                    {group.items.map(i => i.label).join(", ")}
                                </span>
                                <span className="kiosk-bill-value">{group.title}</span>
                            </div>   
                        ))}
                    </div>

                    <div className="kiosk-summary-divider"></div>

                    <div className="kiosk-summary-quantity-control">
                        <button className="qty-minus" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                        <span className="qty-number">{quantity} יחידות</span>
                        <button className="qty-plus" onClick={() => setQuantity(q => q + 1)}>+</button>
                    </div>

                    <div className="kiosk-summary-action-group">
                        <button className="kiosk-summary-btn-primary" onClick={payment}>
                            שלם עכשיו 
                        </button>
                        
                        <button className="kiosk-summary-btn-secondary" onClick={goToHome}>
                            הוסף עוד מנה
                        </button>

                        <button className="kiosk-summary-btn-danger" onClick={deleteItem}>
                            ביטול ומחיקת מנה
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}