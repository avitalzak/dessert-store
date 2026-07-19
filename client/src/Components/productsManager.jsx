import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AddProduct, DeleteProduct, GetProducts } from "../redux/Slice/productSlice"
import CategoriesManager from "./CategoriesManager"
import { GetCategories } from "../redux/Slice/categorySlice"
import "../styles/ManagerProductsCategories.css"

const emptyOption = () => ({ label: "", priceDelta: 0, image: "", imageFile: null })
const emptyStep = () => ({ title: "", multiSelect: false, minSelect: 0, maxSelect: 1, options: [emptyOption()] })

export default function ProductsManager() {

    const dispatch = useDispatch()
    const products = useSelector(state => state.products.products)
    const categories = useSelector(state => state.categories.categories)
    const { loading, error} = useSelector(state => state.products)

    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [description, setDescription] = useState("")
    const [imageFile, setImageFile] = useState(null)
    const [categoryId, setCategoryId] = useState("")
    const [type, setType] = useState("simple")
    const [steps, setSteps] = useState([])

    useEffect(() => {
        dispatch(GetCategories())
        dispatch(GetProducts())
    }, [dispatch])

    if (loading) return <div>טוען נתונים...</div>
    if (error) return <div>שגיאה: {error}</div>

    
    const addStepRow = () => setSteps(prev => [...prev, emptyStep()])
    const removeStepRow = (stepIndex) => setSteps(prev => prev.filter((_, i) => i !== stepIndex))

    const updateStepField = (stepIndex, field, value) => {
        setSteps(prev => prev.map((step, i) => i === stepIndex ? { ...step, [field]: value } : step))
    }

    const addOptionRow = (stepIndex) => {
        setSteps(prev => prev.map((step, i) =>
            i === stepIndex ? { ...step, options: [...step.options, emptyOption()] } : step
        ))
    }

    const removeOptionRow = (stepIndex, optionIndex) => {
        setSteps(prev => prev.map((step, i) =>
            i === stepIndex ? { ...step, options: step.options.filter((_, oi) => oi !== optionIndex) } : step
        ))
    }

    const updateOptionField = (stepIndex, optionIndex, field, value) => {
        setSteps(prev => prev.map((step, i) => {
            if (i !== stepIndex) return step
            const options = step.options.map((opt, oi) => oi === optionIndex ? { ...opt, [field]: value } : opt)
            return { ...step, options }
        }))
    }

    const resetForm = () => {
        setName("")
        setPrice("")
        setDescription("")
        setImageFile(null)
        setCategoryId("")
        setType("simple")
        setSteps([])
    }

    const uploadImage = async () => {
        if (!imageFile) {
            throw new Error("לא נבחרה תמונה")
        }
        const data = new FormData()
        data.append("image", imageFile)
        const response = await fetch(
            "http://localhost:1234/upload",
            {
                method: "POST",
                body: data
            }
        )
        const result = await response.json()
        return result.imageUrl
    }


    const uploadSingleImage = async (file) => {
            const data = new FormData();
            data.append("image", file);
        
            const response = await fetch("http://localhost:1234/upload", {
                method: "POST",
                body: data,
            });

            const result = await response.json();
            return result.imageUrl;
        }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const imageUrl = await uploadImage()


        const preparedSteps = [];

        for (const step of steps) {
            const options = []
            for (const option of step.options) {
                let image = "";
                if (option.imageFile) {
                    image = await uploadSingleImage(option.imageFile)
                }
                options.push({
                    label: option.label,
                    priceDelta: option.priceDelta,
                    image
                });
            }
            preparedSteps.push({
                ...step,
                options
            })
        }

        

        const formData = {
            name,
            price: Number(price),
            description,
            image: imageUrl,
            categoryId,  
            type,
            steps: type === "buildable"
                ? preparedSteps
                : undefined
        }

        

        dispatch(AddProduct(formData))
        resetForm()
    }
    
    return (
        <div className="manager-container">
            <h2 className="section-title">ניהול מוצרים</h2>
    
            <div className="form-wrapper">
                <h3 className="section-title">מוצרים קיימים</h3>
                {products?.map(product => (
                    <div key={product._id} className="list-item">
                        <span><strong>{product.name}</strong> - {product.price} ₪ ({product.type})</span>
                        <button onClick={() => dispatch(DeleteProduct(product._id))} className="btn delete-btn">מחק</button>
                    </div>
                ))}
            </div>
    
            <div className="form-wrapper">
                <h3 className="section-title">הוספת מוצר חדש</h3>
                <form onSubmit={handleSubmit}>
                    <input placeholder="שם המוצר" value={name} onChange={(e) => setName(e.target.value)} required className="input-field" />
                    <input type="number" placeholder="מחיר בסיס" value={price} onChange={(e) => setPrice(e.target.value)} required className="input-field" />
                    <input placeholder="תיאור" value={description} onChange={(e) => setDescription(e.target.value)} required className="input-field" />
                    <input type="file" id="product-image" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required style={{ display: "none" }} />
                    <label htmlFor="product-image" className="file-upload-btn"> {imageFile ? `📁 קובץ נבחר: ${imageFile.name}` : "📁 לחץ כאן לבחירת תמונת מוצר"} </label>
    
                    <div className="flex-row">
                        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="input-field">
                            <option value="">בחר קטגוריה</option>
                            {categories?.map(category => (
                                <option key={category._id} value={category._id}>{category.name}</option>
                            ))}
                        </select>
    
                        <select value={type} onChange={(e) => setType(e.target.value)} className="input-field">
                            <option value="simple">מוצר פשוט</option>
                            <option value="buildable">מוצר עם שלבים</option>
                        </select>
                    </div>
    
                    {type === "buildable" && (
                        <div className="step-box">
                            <p><strong>ניהול שלבים ואופציות</strong></p>
                            {steps.map((step, stepIndex) => (
                                <div key={stepIndex} className="step-box">
                                    <div className="flex-row" style={{ alignItems: "center" }}>
                                        <input placeholder="שם השלב" value={step.title} onChange={(e) => updateStepField(stepIndex, "title", e.target.value)} className="input-field" />
                                        <label style={{ fontSize: '12px' }}>
                                            <input type="checkbox" checked={step.multiSelect} onChange={(e) => updateStepField(stepIndex, "multiSelect", e.target.checked)} /> בחירה מרובה
                                        </label>
                                        <input type="number" placeholder="מינימום" value={step.minSelect} onChange={(e) => updateStepField(stepIndex, "minSelect", Number(e.target.value))} className="input-field" style={{ width: "80px" }} />
                                        <input type="number" placeholder="מקסימום" value={step.maxSelect} onChange={(e) => updateStepField(stepIndex, "maxSelect", Number(e.target.value))} className="input-field" style={{ width: "80px" }} />
                                        <button type="button" onClick={() => removeStepRow(stepIndex)} className="btn delete-btn">🗑</button>
                                    </div>
    
                                    <div style={{ paddingRight: "20px" }}>
                                        {step.options.map((option, optionIndex) => (
                                            <div key={optionIndex} className="flex-row" style={{ marginBottom: "5px" }}>
                                                <input placeholder="שם אופציה" value={option.label} onChange={(e) => updateOptionField(stepIndex, optionIndex, "label", e.target.value)} className="input-field" />
                                                <input type="number" placeholder="מחיר" value={option.priceDelta} onChange={(e) => updateOptionField(stepIndex, optionIndex, "priceDelta", Number(e.target.value))} className="input-field" style={{ width: "80px" }} />
                                                <input type="file" className="file-upload-btn" accept="image/*" onChange={(e) => updateOptionField(stepIndex, optionIndex, "imageFile", e.target.files[0])}/>
                                                {option.imageFile && (<span>{option.imageFile.name}</span>)}
                                                <button type="button" onClick={() => removeOptionRow(stepIndex, optionIndex)} className="btn delete-btn">הסר</button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addOptionRow(stepIndex)} className="btn" style={{ backgroundColor: '#f8d7da' }}>➕ הוסף אופציה</button>
                                    </div>
                                </div>
                            ))}
                            <button type="button" onClick={addStepRow} className="btn" style={{ backgroundColor: '#8d6e63', color: 'white' }}>➕ הוסף שלב</button>
                        </div>
                    )}
    
                    <button type="submit" className="btn submit-btn">שמור מוצר חדש</button>
                </form>
            </div>
        </div>
    )
}