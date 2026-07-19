import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AddCategory, DeleteCategory, GetCategories } from "../redux/Slice/categorySlice"

export default function CategoryManager() {

    const dispatch = useDispatch()

    const categories = useSelector(state => state.categories.categories) 
    const { loading, error } =useSelector(state => state.categories)

    const [name, setName] = useState("")
    const [imageFile, setImageFile] = useState(null)

    useEffect(() => {
        dispatch(GetCategories()) 
    }, [dispatch])

    if (loading) return <div>טוען נתונים...</div>

    const uploadImage = async () => {
        if (!imageFile) {
            throw new Error("לא נבחרה תמונה")
        }
        const data = new FormData()
        data.append("image", imageFile)
        const response = await fetch (
            "http://localhost:1234/upload",
            {
                method: "POST",
                body: data
            }
        )
        const result = await response.json()
        return result.imageUrl
    }
    

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const imageUrl = await uploadImage()
            const categoryData = {
                name,
                image: imageUrl
            }

            await dispatch(AddCategory(categoryData)).unwrap()
            setName("")
            setImageFile(null)
        }
        catch(err) {
            alert(err.message || err)
        }
    }

    const handleDelete = async (id) => {
        try {
            await dispatch(DeleteCategory(id)).unwrap()
        } 
        catch (err) {
            alert(err)
        }
    }

    return (
        <div className="manager-container">
            <h2 className="section-title">ניהול קטגוריות</h2>
    
            <div className="form-wrapper">
                {categories?.map(category => (
                    <div key={category._id} className="list-item">
                        <span>{category.name}</span>
                        <button className="btn delete-btn" onClick={() => handleDelete(category._id)}>מחק</button>
                    </div>
                ))}
            </div>
    
            <div className="form-wrapper">
                <form onSubmit={handleSubmit} className="flex-row">
                    <input className="input-field" placeholder="שם הקטגוריה" value={name} onChange={(e) => setName(e.target.value)} required />
                    <input type="file" id="category-image" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required style={{ display: "none" }} />
                    <label htmlFor="category-image" className="file-upload-btn" style={{ flex: 1 }}>{imageFile ? `📁 נבחר: ${imageFile.name}` : "📁 בחר תמונה קטגוריה"}</label>
                    <button type="submit" className="btn submit-btn">הוסף</button>
                </form>
            </div>
        </div>
    )
}