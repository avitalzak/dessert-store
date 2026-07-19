import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import ProductCard from "./ProductCard"
import { addToCart, addToCartServer } from "../redux/Slice/cartSlice"
import "../styles/ProductList.css"

export default function ProductList() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const products = useSelector(state => state.products.products)
    const {loading, error} = useSelector(state => state.products)
    const isSignIn = useSelector(state => state.user.isSignIn)
    
    const [searchParams] = useSearchParams()
    const categorySlug = searchParams.get("category")

    if (loading) return <p>טוען מוצרים...</p>
    if (error) return <div>שגיאה: {error}</div>

    const filtered = categorySlug
        ? products.filter(p => p.categorySlug === categorySlug)
        : products

    if (filtered.length === 0) return <p>אין מוצרים בקטגוריה זו</p>

    function handleProductClick(product) {
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

            navigate('/shoppingcart')
        }
    }

    return (
        <div className="kiosk-grid">
            {filtered.map(product => (
                <ProductCard
                    key={product._id}
                    product={product}
                    onClick={() => handleProductClick(product)}
                />
            ))}
        </div>
    )
}