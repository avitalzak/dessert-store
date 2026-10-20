import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { GetCategories } from "../redux/Slice/categorySlice"
import "../styles/CategotyA.css"
import { useImagesReady } from "../Services/useImagesReady"

export default function CategoryList() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const categories = useSelector(state => state.categories.categories)
    const { loading, error } = useSelector(state => state.categories)

    // כל הכרטיסים מופיעים יחד, רק אחרי שכל התמונות נטענו
    const imagesReady = useImagesReady((categories || []).map(c => c.image))


    useEffect(() => {
        dispatch(GetCategories())
    }, [dispatch])

    function handleCategoryClick(category) {
        navigate(`/products?category=${category.slug}`)
    }

    if (loading) return <p>טוען קטגוריות...</p>
    if (error) return <div>שגיאה: {error}</div>
    if (!categories || categories.length === 0) return <p>אין קטגוריות להצגה</p>

    return (
        <div className={`categories-grid ${imagesReady ? "" : "is-pending"}`}>
            <header className="at-page-head atelier-only">
                <span className="at-eyebrow">Étape 01 — La carte</span>
                <h1 className="at-page-title">מה מתחשק לכם היום?</h1>
                <p className="at-page-lede">בחרו קטגוריה ונתחיל להרכיב יחד</p>
            </header>
            {categories.map(cat => (
                <div key={cat._id} className="category-card" onClick={() => handleCategoryClick(cat)}>
                    <div className="category-image-wrapper">
                        <img src={cat.image || "/placeholder.jpg"} alt={cat.name} />
                    </div>
                    <div className="category-info">
                        <h3>{cat.name}</h3>
                    </div>
                </div>
            ))}
        </div>
    )
}
