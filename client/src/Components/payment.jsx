import { useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addOrderServer } from "../redux/Slice/ordersSlice" 
import { clearCart } from "../redux/Slice/cartSlice"
import { useNavigate } from "react-router-dom"
import Persuasion from "./persuasion"
import MessagePopup from "./Message"
import { isBirthdayToday, calculateDiscountedPrice } from "../Services/BirthDayLogic"
import "../styles/Payment.css"

export default function Payment() {
    const [method, setMethod] = useState("card")
    const [orderType, setOrderType] = useState("takeaway")
    const [showPersuasion, setShowPersuasion] = useState(false)
    const [cardDetails, setCardDetails] = useState({ name: "", number: "", expiry: "", cvv: "" })
    const [messagePopup, setMessagePopup] = useState({ isOpen: false, message: "" })
    
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const cart = useSelector(state => state.cart.items || [])
    const loggedUser = useSelector(state => state.user?.user)
    const isSignIn = useSelector(state => state.user?.isSignIn)

    const totalPrice = useMemo(() => 
        cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0), 
    [cart]);

    const isBirthday = useMemo(() => 
        isSignIn && loggedUser?.birthDate ? isBirthdayToday(loggedUser.birthDate) : false,
    [isSignIn, loggedUser]);

    const finalPrice = useMemo(() => calculateDiscountedPrice(totalPrice, isBirthday), [totalPrice, isBirthday]);

    const handleOrder = async () => {
        if (cart.length === 0) {
            setMessagePopup({
                isOpen: true,
                message: "הסל שלך ריק"
            })
            return
        }

        
        if (method === "card") {
            const { number, expiry, cvv } = cardDetails;
            if (!number.trim() || !expiry.trim() || !cvv.trim()) {
                setMessagePopup({
                    isOpen: true,
                    message: "נא למלא את כל פרטי כרטיס האשראי"
                })
                return
            }
            if (number.length < 16 || cvv.length < 3) {
                setMessagePopup({
                    isOpen: true,
                    message: "פרטי האשראי שהוזנו אינם תקינים"
                })
                return
            }
        }
        
        try {
            const formattedItems = cart.map(item => ({
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                components: item.components?.map(c => c._id || c) || []
            }))

            await dispatch(addOrderServer({
                items: formattedItems,
                totalPrice: finalPrice,
                date: new Date(),
                type: orderType,
                method
            })).unwrap()

            setMessagePopup({
                isOpen: true,
                message: "הההזמנה נשלחה בהצלחה!"
            })
            
            setTimeout(() => {
                dispatch(clearCart())
                navigate('/')
            }, 2000)
        }
        catch(err) {
            setMessagePopup({
                isOpen: true,
                message: "חלה שגיאה בביצוע ההזמנה"
            })
        }
    }

    return (
        <div className="kiosk-payment-form">
            <MessagePopup
                isOpen={messagePopup.isOpen}
                message={messagePopup.message}
                onClose={() => setMessagePopup({
                    isOpen:false,
                    message:""
                })}
            />

            {showPersuasion && (
                <Persuasion
                    onClose={() => setShowPersuasion(false)}
                    onContinue={async () => {
                        setShowPersuasion(false);
                        await handleOrder();
                    }}
                />
            )}
            
            <div className="kiosk-pay-section">
                <h3 className="kiosk-pay-section-title">איך תרצו לאכול?</h3>
                <div className="kiosk-custom-toggle-group">
                    <button 
                        type="button"
                        className={`kiosk-toggle-btn ${orderType === "dine in" ? "active" : ""}`}
                        onClick={() => setOrderType("dine in")}
                    >
                        לשבת במקום
                    </button>
                    <button 
                        type="button"
                        className={`kiosk-toggle-btn ${orderType === "takeaway" ? "active" : ""}`}
                        onClick={() => setOrderType("takeaway")}
                    >
                        לקחת / לארוז
                    </button>
                </div>
            </div>

            
            <div className="kiosk-pay-section">
                <h3 className="kiosk-pay-section-title">אמצעי תשלום</h3>
                <div className="kiosk-custom-toggle-group">
                    <button 
                        type="button"
                        className={`kiosk-toggle-btn ${method === "card" ? "active" : ""}`}
                        onClick={() => setMethod("card")}
                    >
                         כרטיס אשראי
                    </button>
                    <button 
                        type="button"
                        className={`kiosk-toggle-btn ${method === "cash" ? "active" : ""}`}
                        onClick={() => setMethod("cash")}
                    >
                        מזומן בקופה
                    </button>
                </div>
            </div>

            
            {method === "card" && (
                <div className="kiosk-credit-card-inputs animated-fade-in">
                    <input 
                        type="text" 
                        maxLength="16"
                        placeholder="מספר כרטיס אשראי" 
                        value={cardDetails.number} 
                        onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})} 
                    />
                    <div className="kiosk-card-row-split">
                        <input 
                            type="text" 
                            placeholder="תוקף (MM/YY)" 
                            value={cardDetails.expiry} 
                            onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})} 
                        />
                        <input 
                            type="text" 
                            maxLength="3"
                            placeholder="CVV" 
                            value={cardDetails.cvv} 
                            onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})} 
                        />
                    </div>
                </div>
            )}

          
            <div className="kiosk-pay-summary-block">
                <span className="kiosk-total-text-label">מחיר סופי לתשלום</span>
                <div className="kiosk-total-price-display">
                    {isBirthday && <span className="kiosk-old-price-strikethrough">{totalPrice.toFixed(1)} ₪</span>}
                    <span className="kiosk-actual-final-price">{finalPrice.toFixed(1)} ₪</span>
                </div>
            </div>

        
            <div className="kiosk-order-submit-wrapper">
                <button
                    className="kiosk-btn-submit-order"
                    onClick={() => {
                        if (!isSignIn) {
                            setShowPersuasion(true);
                        } else {
                            handleOrder();
                        }
                    }}
                >
                    בצע הזמנה ושלם
                </button>
            </div>
        </div>
    )
}
