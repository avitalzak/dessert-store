import { useSelector, useDispatch } from "react-redux"
import { useState } from "react"
import { toggleOption } from "../redux/Slice/productSlice"

// קומפוננטת התצוגה הוויזואלית של המנה בזמן בנייה.
// הרעיון: כל הפריטים הנבחרים (מכל השלבים) מוצגים כ"ערמה" אחת,
// לפי סדר השלבים - הבחירה מהשלב הראשון היא הבסיס (למטה),
// והבחירות מהשלבים הבאים נערמות מעליה.
//
// למה אין כאן "פיזיקה" משום סוג: אנחנו לא ממקמים כל שכבה בקואורדינטה
// קבועה. אנחנו פשוט ממפים מערך (items) לתוך container עם
// flexDirection: column-reverse. ה-flexbox עצמו אחראי על הסידור -
// כשפריט יורד מהמערך, שאר הפריטים "נופלים" למקומם אוטומטית
// כי הם נמצאים ב-DOM אחד אחרי השני, לא ב-position: absolute.

export default function DishPreview() {
    const dispatch = useDispatch()
    const selectedProduct = useSelector(s => s.products.selectedProduct)
    const selections = useSelector(s => s.products.selections)

    // מזהה של פריט שנמצא כרגע באנימציית הסרה (fade+shrink) לפני שהוא
    // באמת נמחק מה-state. בלי זה ה-DOM היה מוחק את האלמנט מיידית
    // ולא היינו רואים אנימציה כלל.
    const [removingKey, setRemovingKey] = useState(null)

    if (!selectedProduct) return null

    // שיטוח כל הבחירות מכל השלבים, לפי סדר השלבים
    const stackedItems = selectedProduct.steps.flatMap((step, stepIndex) =>
        (selections[stepIndex] || []).map(option => ({
            ...option,
            stepIndex,
            key: `${stepIndex}-${option.label}`
        }))
    )

    const handleRemove = (item) => {
        setRemovingKey(item.key)
        // מחכים לאנימציית היציאה לפני שבאמת מסירים מה-Redux
        setTimeout(() => {
            dispatch(toggleOption({ stepIndex: item.stepIndex, option: item }))
            setRemovingKey(null)
        }, 180)
    }

    return (
        <div className="kiosk-preview-wrapper">
            <div className="kiosk-preview-plate">
                <div className="kiosk-preview-stack">
                    {stackedItems.length === 0 && (
                        <p className="kiosk-preview-empty">המנה שלך תופיע כאן</p>
                    )}

                    {stackedItems.map(item => (
                        <div
                            key={item.key}
                            className={`kiosk-preview-layer ${removingKey === item.key ? "is-removing" : ""}`}
                        >
                            <div className="kiosk-preview-layer-visual">
                                {item.image ? (
                                    <img src={item.image} alt={item.label} onError={(e) => e.target.style.display = 'none'} />
                                ) : (
                                    <span className="kiosk-preview-layer-emoji">🍨</span>
                                )}
                            </div>

                            <span className="kiosk-preview-layer-label">{item.label}</span>

                            <button
                                className="kiosk-preview-remove-btn"
                                onClick={() => handleRemove(item)}
                                aria-label={`הסר ${item.label}`}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                {/* בסיס הצלחת/הכוס - רק עיטור ויזואלי */}
                <div className="kiosk-preview-base" />
            </div>
        </div>
    )
}