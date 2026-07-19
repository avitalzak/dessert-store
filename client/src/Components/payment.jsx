// import { useState, useMemo } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { addOrderServer } from "../redux/Slice/ordersSlice" 
// import { clearCart } from "../redux/Slice/cartSlice"
// import { useNavigate } from "react-router-dom"
// import Persuasion from "./persuasion"
// import MessagePopup from "./Message"
// import { isBirthdayToday, calculateDiscountedPrice } from "../Services/BirthDayLogic"
// import "../styles/Payment.css"

// export default function Payment() {
//     const [method, setMethod] = useState("card")
//     const [orderType, setOrderType] = useState("takeaway")
//     const [showPersuasion, setShowPersuasion] = useState(false)
//     const [cardDetails, setCardDetails] = useState({ name: "", number: "", expiry: "", cvv: "" })
//     const [messagePopup, setMessagePopup] = useState({ isOpen: false, message: "" })
    
//     const navigate = useNavigate()
//     const dispatch = useDispatch()

//     const cart = useSelector(state => state.cart.items || [])
//     const loggedUser = useSelector(state => state.user?.user)
//     const isSignIn = useSelector(state => state.user?.isSignIn)

//     const totalPrice = useMemo(() => 
//         cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0), 
//     [cart]);

//     const isBirthday = useMemo(() => 
//         isSignIn && loggedUser?.birthDate ? isBirthdayToday(loggedUser.birthDate) : false,
//     [isSignIn, loggedUser]);

//     const finalPrice = useMemo(() => calculateDiscountedPrice(totalPrice, isBirthday), [totalPrice, isBirthday]);

//     const handleOrder = async () => {
//         if (cart.length === 0) {
//             setMessagePopup({
//                 isOpen: true,
//                 message: "הסל שלך ריק"
//             })
//             return
//         }

        
//         if (method === "card") {
//             const { number, expiry, cvv } = cardDetails;
//             if (!number.trim() || !expiry.trim() || !cvv.trim()) {
//                 setMessagePopup({
//                     isOpen: true,
//                     message: "נא למלא את כל פרטי כרטיס האשראי"
//                 })
//                 return
//             }
//             if (number.length < 16 || cvv.length < 3) {
//                 setMessagePopup({
//                     isOpen: true,
//                     message: "פרטי האשראי שהוזנו אינם תקינים"
//                 })
//                 return
//             }
//         }
        
//         try {
//             const formattedItems = cart.map(item => ({
//                 productId: item.productId,
//                 name: item.name,
//                 price: item.price,
//                 quantity: item.quantity,
//                 components: item.components?.map(c => c._id || c) || []
//             }))

//             await dispatch(addOrderServer({
//                 items: formattedItems,
//                 totalPrice: finalPrice,
//                 date: new Date(),
//                 type: orderType,
//                 method
//             })).unwrap()

//             setMessagePopup({
//                 isOpen: true,
//                 message: "הההזמנה נשלחה בהצלחה!"
//             })
            
//             setTimeout(() => {
//                 dispatch(clearCart())
//                 navigate('/')
//             }, 2000)
//         }
//         catch(err) {
//             setMessagePopup({
//                 isOpen: true,
//                 message: "חלה שגיאה בביצוע ההזמנה"
//             })
//         }
//     }

//     return (
//         <div className="kiosk-payment-form">
//             <MessagePopup
//                 isOpen={messagePopup.isOpen}
//                 message={messagePopup.message}
//                 onClose={() => setMessagePopup({
//                     isOpen:false,
//                     message:""
//                 })}
//             />

//             {showPersuasion && (
//                 <Persuasion
//                     onClose={() => setShowPersuasion(false)}
//                     onContinue={async () => {
//                         setShowPersuasion(false);
//                         await handleOrder();
//                     }}
//                 />
//             )}
            
//             <div className="kiosk-pay-section">
//                 <h3 className="kiosk-pay-section-title">איך תרצו לאכול?</h3>
//                 <div className="kiosk-custom-toggle-group">
//                     <button 
//                         type="button"
//                         className={`kiosk-toggle-btn ${orderType === "dine in" ? "active" : ""}`}
//                         onClick={() => setOrderType("dine in")}
//                     >
//                         לשבת במקום
//                     </button>
//                     <button 
//                         type="button"
//                         className={`kiosk-toggle-btn ${orderType === "takeaway" ? "active" : ""}`}
//                         onClick={() => setOrderType("takeaway")}
//                     >
//                         לקחת / לארוז
//                     </button>
//                 </div>
//             </div>

            
//             <div className="kiosk-pay-section">
//                 <h3 className="kiosk-pay-section-title">אמצעי תשלום</h3>
//                 <div className="kiosk-custom-toggle-group">
//                     <button 
//                         type="button"
//                         className={`kiosk-toggle-btn ${method === "card" ? "active" : ""}`}
//                         onClick={() => setMethod("card")}
//                     >
//                          כרטיס אשראי
//                     </button>
//                     <button 
//                         type="button"
//                         className={`kiosk-toggle-btn ${method === "cash" ? "active" : ""}`}
//                         onClick={() => setMethod("cash")}
//                     >
//                         מזומן בקופה
//                     </button>
//                 </div>
//             </div>

            
//             {method === "card" && (
//                 <div className="kiosk-credit-card-inputs animated-fade-in">
//                     <input 
//                         type="text" 
//                         maxLength="16"
//                         placeholder="מספר כרטיס אשראי" 
//                         value={cardDetails.number} 
//                         onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})} 
//                     />
//                     <div className="kiosk-card-row-split">
//                         <input 
//                             type="text" 
//                             placeholder="תוקף (MM/YY)" 
//                             value={cardDetails.expiry} 
//                             onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})} 
//                         />
//                         <input 
//                             type="text" 
//                             maxLength="3"
//                             placeholder="CVV" 
//                             value={cardDetails.cvv} 
//                             onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})} 
//                         />
//                     </div>
//                 </div>
//             )}

          
//             <div className="kiosk-pay-summary-block">
//                 <span className="kiosk-total-text-label">מחיר סופי לתשלום</span>
//                 <div className="kiosk-total-price-display">
//                     {isBirthday && <span className="kiosk-old-price-strikethrough">{totalPrice.toFixed(1)} ₪</span>}
//                     <span className="kiosk-actual-final-price">{finalPrice.toFixed(1)} ₪</span>
//                 </div>
//             </div>

        
//             <div className="kiosk-order-submit-wrapper">
//                 <button
//                     className="kiosk-btn-submit-order"
//                     onClick={() => {
//                         if (!isSignIn) {
//                             setShowPersuasion(true);
//                         } else {
//                             handleOrder();
//                         }
//                     }}
//                 >
//                     בצע הזמנה ושלם
//                 </button>
//             </div>
//         </div>
//     )
// }

import { useEffect, useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addOrderServer } from "../redux/Slice/ordersSlice"
import { clearCart } from "../redux/Slice/cartSlice"
import { useNavigate } from "react-router-dom"
import Persuasion from "./persuasion"
import MessagePopup from "./Message"
import { isBirthdayToday, calculateDiscountedPrice } from "../Services/BirthDayLogic"
import "../styles/Payment.css"

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "YOUR_PAYPAL_CLIENT_ID"

function loadPayPalScript(clientId) {
  return new Promise((resolve, reject) => {
    if (window.paypal) return resolve(window.paypal)

    const script = document.createElement("script")
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=ILS`
    script.async = true
    script.onload = () => {
      if (window.paypal) resolve(window.paypal)
      else reject(new Error("PayPal SDK failed to load."))
    }
    script.onerror = () => reject(new Error("PayPal SDK script failed to load."))
    document.body.appendChild(script)
  })
}

export default function Payment() {
  const [method, setMethod] = useState("card")
  const [orderType, setOrderType] = useState("takeaway")
  const [showPersuasion, setShowPersuasion] = useState(false)
  const [cardDetails, setCardDetails] = useState({ name: "", number: "", expiry: "", cvv: "" })
  const [messagePopup, setMessagePopup] = useState({ isOpen: false, message: "" })
  const [paypalError, setPaypalError] = useState("")

  const paypalRef = useRef(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart.items || [])
  const loggedUser = useSelector((state) => state.user?.user)
  const isSignIn = useSelector((state) => state.user?.isSignIn)

  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0),
    [cart]
  )

  const isBirthday = useMemo(
    () => (isSignIn && loggedUser?.birthDate ? isBirthdayToday(loggedUser.birthDate) : false),
    [isSignIn, loggedUser]
  )

  const finalPrice = useMemo(() => calculateDiscountedPrice(totalPrice, isBirthday), [totalPrice, isBirthday])

  const formattedItems = () =>
    cart.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      components: item.components?.map((c) => c._id || c) || []
    }))

  const submitOrder = async (paymentMethod, paypalInfo = null) => {
    try {
      await dispatch(
        addOrderServer({
          items: formattedItems(),
          totalPrice: finalPrice,
          date: new Date(),
          type: orderType,
          method: paymentMethod,
          paypalInfo
        })
      ).unwrap()

      setMessagePopup({
        isOpen: true,
        message: paymentMethod === "paypal" ? "ההזמנה ב-PayPal נשלחה בהצלחה!" : "ההזמנה נשלחה בהצלחה!"
      })

      setTimeout(() => {
        dispatch(clearCart())
        navigate("/")
      }, 2000)
    } catch (err) {
      setMessagePopup({
        isOpen: true,
        message: "חלה שגיאה בביצוע ההזמנה"
      })
    }
  }

  const handleOrder = async () => {
    if (cart.length === 0) {
      setMessagePopup({ isOpen: true, message: "הסל שלך ריק" })
      return
    }

    if (method === "card") {
      const { number, expiry, cvv } = cardDetails
      if (!number.trim() || !expiry.trim() || !cvv.trim()) {
        setMessagePopup({ isOpen: true, message: "נא למלא את כל פרטי כרטיס האשראי" })
        return
      }
      if (number.length < 16 || cvv.length < 3) {
        setMessagePopup({ isOpen: true, message: "פרטי האשראי שהוזנו אינם תקינים" })
        return
      }
    }

    await submitOrder(method)
  }

  useEffect(() => {
    if (method !== "paypal") return
    if (cart.length === 0) return
    if (!paypalRef.current) return

    let isCanceled = false
    setPaypalError("")
    paypalRef.current.innerHTML = ""

    loadPayPalScript(PAYPAL_CLIENT_ID)
      .then((paypal) => {
        if (isCanceled || !paypalRef.current) return

        paypal.Buttons({
          style: {
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "paypal"
          },
          createOrder: (_, actions) =>
            actions.order.create({
              purchase_units: [
                {
                  amount: {
                    currency_code: "ILS",
                    value: finalPrice.toFixed(2)
                  },
                  description: "תשלום הזמנה"
                }
              ]
            }),
          onApprove: (_, actions) =>
            actions.order.capture().then((details) => submitOrder("paypal", details)),
          onCancel: () => {
            setMessagePopup({ isOpen: true, message: "התשלום ב-PayPal בוטל" })
          },
          onError: (err) => {
            console.error("PayPal error", err)
            setPaypalError("אירעה שגיאה בטעינת PayPal")
          }
        }).render(paypalRef.current)
      })
      .catch((err) => {
        console.error(err)
        setPaypalError("לא ניתן לטעון את PayPal")
      })

    return () => {
      isCanceled = true
    }
  }, [method, finalPrice, cart.length])

  const handleSubmitClick = async () => {
    if (!isSignIn) {
      setShowPersuasion(true)
      return
    }
    if (method === "paypal") return
    await handleOrder()
  }

  return (
    <div className="kiosk-payment-form">
      <MessagePopup
        isOpen={messagePopup.isOpen}
        message={messagePopup.message}
        onClose={() => setMessagePopup({ isOpen: false, message: "" })}
      />

      {showPersuasion && (
        <Persuasion
          onClose={() => setShowPersuasion(false)}
          onContinue={async () => {
            setShowPersuasion(false)
            await handleOrder()
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
          <button type="button" className={`kiosk-toggle-btn ${method === "card" ? "active" : ""}`} onClick={() => setMethod("card")}>כרטיס אשראי</button>
          <button type="button" className={`kiosk-toggle-btn ${method === "cash" ? "active" : ""}`} onClick={() => setMethod("cash")}>מזומן בקופה</button>
          <button type="button" className={`kiosk-toggle-btn ${method === "paypal" ? "active" : ""}`} onClick={() => setMethod("paypal")}>PayPal</button>
        </div>
      </div>

      {method === "card" && (
        <div className="kiosk-credit-card-inputs animated-fade-in">
          <input
            type="text"
            maxLength="16"
            placeholder="מספר כרטיס אשראי"
            value={cardDetails.number}
            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
          />
          <div className="kiosk-card-row-split">
            <input
              type="text"
              placeholder="תוקף (MM/YY)"
              value={cardDetails.expiry}
              onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
            />
            <input
              type="text"
              maxLength="3"
              placeholder="CVV"
              value={cardDetails.cvv}
              onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
            />
          </div>
        </div>
      )}

      {method === "paypal" && (
        <div className="kiosk-paypal-wrapper">
          <div ref={paypalRef} />
          {paypalError && <div className="paypal-error">{paypalError}</div>}
          <div className="paypal-note">כאן יופיע כפתור PayPal. המשך כדי לשלם.</div>
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
        <button className="kiosk-btn-submit-order" onClick={handleSubmitClick} disabled={method === "paypal"}>
          בצע הזמנה ושלם
        </button>
      </div>
    </div>
  )
}
