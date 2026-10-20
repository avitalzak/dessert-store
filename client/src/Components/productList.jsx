import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { FaBorderAll } from "react-icons/fa"
import { isTheme } from "../theme/theme"
import { flyToOrder } from "../Services/flyToOrder"
import { GetCategories } from "../redux/Slice/categorySlice"
import ProductCard from "./productCard"
import { addToCart, addToCartServer } from "../redux/Slice/cartSlice"
import "../styles/ProductList.css"
import { useImagesReady } from "../Services/useImagesReady"

export default function ProductList() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const products = useSelector(state => state.products.products)
    const categories = useSelector(state => state.categories.categories)
    const {loading, error} = useSelector(state => state.products)
    const isSignIn = useSelector(state => state.user.isSignIn)
    
    // בעיצוב העמדה: הודעת "נוסף להזמנה" במקום מעבר מיידי לעגלה
    const [added, setAdded] = useState(null)
    const toastCount = useRef(0)
    const toastTimer = useRef(null)
    useEffect(() => () => clearTimeout(toastTimer.current), [])

    const [searchParams] = useSearchParams()
    const categorySlug = searchParams.get("category")

    const filtered = categorySlug
        ? (products || []).filter(p => p.categorySlug === categorySlug)
        : (products || [])

    useEffect(() => {
        if (!categories || categories.length === 0) dispatch(GetCategories())
    }, [dispatch, categories])

    // כל הכרטיסים מופיעים יחד, רק אחרי שכל התמונות נטענו
    const imagesReady = useImagesReady(filtered.map(p => p.image))

    if (loading) return <p>טוען מוצרים...</p>
    if (error) return <div>שגיאה: {error}</div>

    if (filtered.length === 0) return <p>אין מוצרים בקטגוריה זו</p>

    const categoryName = categories?.find(c => c.slug === categorySlug)?.name

    function handleProductClick(product, e) {
        if (product.type === "buildable") {
            navigate(`/products/build/${product._id}`)
        } 
        else {
            const item = {
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: 1,
                components: []
            }

            if (isSignIn) {
                dispatch(addToCartServer(item))
            } 
            else {
                dispatch(addToCart(item))
            }

            if (isTheme("kiosk")) {
                flyToOrder(e?.currentTarget?.querySelector("img"))
                toastCount.current += 1
                setAdded({ name: product.name, id: toastCount.current })
                clearTimeout(toastTimer.current)
                toastTimer.current = setTimeout(() => setAdded(null), 1800)
                return
            }

            navigate('/shoppingcart')
        }
    }

    return (
        <div className="kiosk-menu">
            {categories?.length > 0 && (
                <aside className="kiosk-side kiosk-only">
                    <button
                        className={`kiosk-side-item ${!categorySlug ? "active" : ""}`}
                        onClick={() => navigate("/products")}
                    >
                        <span className="kiosk-side-icon"><FaBorderAll /></span>
                        <span>כל התפריט</span>
                    </button>
                    {categories.map(c => (
                        <button
                            key={c._id}
                            className={`kiosk-side-item ${c.slug === categorySlug ? "active" : ""}`}
                            onClick={() => navigate(`/products?category=${c.slug}`)}
                        >
                            <span className="kiosk-side-img">
                                {c.image && <img src={c.image} alt="" />}
                            </span>
                            <span>{c.name}</span>
                        </button>
                    ))}
                </aside>
            )}

        <div className={`kiosk-grid ${imagesReady ? "" : "is-pending"}`}>
            <header className="at-page-head atelier-only">
                <span className="at-eyebrow">Étape 02 — Les créations</span>
                <h1 className="at-page-title">{categoryName || "בחרו קינוח"}</h1>
                <p className="at-page-lede">כל מנה מוכנה במקום, בדיוק לפי הבחירה שלכם</p>
            </header>
            {filtered.map(product => (
                <ProductCard
                    key={product._id}
                    product={product}
                    onClick={(e) => handleProductClick(product, e)}
                />
            ))}
        </div>

            {added && (
                <div className="kiosk-toast" key={added.id}>
                    <span className="kiosk-toast-check">✓</span>
                    {added.name} נוסף להזמנה
                </div>
            )}
        </div>
    )
}