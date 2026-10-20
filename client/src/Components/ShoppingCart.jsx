import { useDispatch, useSelector } from "react-redux" 
import { decreaseQuantity, increaseQuantity, removeFromCart, removeFromCartServer, updateQuantityServer, setCart, fetchCartFromServer } from "../redux/Slice/cartSlice" 
import { groupComponentsByStep } from "../Services/GroupComponentByStep"
import Delete from "./delete"
import { useEffect, useState } from "react"
import "../styles/Cart.css"
import { useNavigate } from "react-router-dom"
import { GetProducts } from "../redux/Slice/productSlice"
import { FaShoppingBag } from "react-icons/fa"
import { MENU_PATH } from "../Services/menuStart"


export default function Cart() {

    const dispatch = useDispatch() 
    const items = useSelector(state => state.cart.items)  
    const isSignIn = useSelector(state => state.user.isSignIn)
    const products = useSelector(state => state.products.products)
    const navigate = useNavigate()

    // תמונות המוצרים לעגלה
    useEffect(() => {
        if (!products || products.length === 0) dispatch(GetProducts())
    }, [dispatch, products])
    const { loading, error} =useSelector(state => state.cart) 
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        item: null
    })

    // useEffect(() => {

    //         if (isSignIn) {
    //             dispatch(fetchCartFromServer())
    //         }
    //         else {
    //             dispatch(setCart([]))
    //         }
    //     }, [dispatch, isSignIn])

    useEffect(() => {
        if (isSignIn) {
            dispatch(fetchCartFromServer())
        }
    }, [dispatch, isSignIn])
    
console.log("Cart items:", items);
    if (loading) return <div>טוען נתונים...</div>
    if (error) return <div>שגיאה: {error}</div>
    if (!items || items.length === 0) return (
        <div className="kiosk-cart-status empty">
            <span className="empty-ico kiosk-only"><FaShoppingBag /></span>
            הסל שלך עדיין ריק
            <button className="empty-cta kiosk-only" onClick={() => navigate(MENU_PATH)}>לתפריט</button>
        </div>
    )

    const handleRemove = (item) => {
        if (!item) return
    
        setDeleteModal({
            isOpen: true,
            item: item
        })
    }

    const handleIncrease = (item) => {
        if (!item) return 
        if (isSignIn) {
                dispatch(updateQuantityServer({ id: item._id, type: "inc" })) 
            }
        else {
                dispatch(increaseQuantity(item._id)) 
            }
    } 

    const handleDecrease = (item) => {
        if (item.quantity === 1) {
            handleRemove(item)
            return
        }
        if (isSignIn) {
            dispatch(updateQuantityServer({ id: item._id, type: "dec" })) 
        }
        else {
            dispatch(decreaseQuantity(item._id)) 
        }
    }
    
    const confirmDelete = () => {
        const item = deleteModal.item
    
        if (isSignIn) {
            dispatch(removeFromCartServer(item._id))
        }
        else {
            dispatch(removeFromCart(item._id))
        }
    
        setDeleteModal({
            isOpen: false,
            item: null
        })
    }


    const cancelDelete = () => {
        setDeleteModal({
            isOpen: false,
            item: null
        })
    }

    return (
       <>
            <div className="kiosk-cart-items-scroll">
                {
                    items.map((item, index) => {
                        const groupedComponents = groupComponentsByStep(item.components)
    
                        return (
                            <div key={item._id || index} className="kiosk-cart-item-card">
                                <div className="cart-thumb kiosk-only">
                                    {products?.find(p => p._id === item.productId)?.image && (
                                        <img src={products.find(p => p._id === item.productId).image} alt="" />
                                    )}
                                </div>
    
                                <div className="kiosk-item-main-info">
                                    <span className="kiosk-item-price">
                                        {item.price} ₪
                                    </span>
    
                                    <p className="kiosk-item-name">
                                        {item.name}
                                    </p>
                                </div>
    
                                <div className="kiosk-item-components-box">
                                    {Object.entries(groupedComponents).map(([groupTitle, labels]) => (
                                        <p key={groupTitle} className="kiosk-item-component-line">
                                            <strong>{groupTitle}:</strong> {labels.join(", ")}
                                        </p>
                                    ))}
                                </div>
    
                                <div className="kiosk-item-actions-row">
                                    <button 
                                        className="kiosk-item-btn-delete"
                                        onClick={() => handleRemove(item)}
                                    >
                                        מחק
                                    </button>
    
                                    <div className="kiosk-cart-qty-selector">
                                        <button onClick={() => handleDecrease(item)}>
                                            -
                                        </button>
    
                                        <span className="kiosk-qty-val">
                                            {item.quantity}
                                        </span>
    
                                        <button onClick={() => handleIncrease(item)}>
                                            +
                                        </button>
                                    </div>
                                </div>
    
                            </div>
                        )
                    })
                }
            </div>
    
            <Delete
                isOpen={deleteModal.isOpen}
                itemName={deleteModal.item?.name}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </>
    )
}