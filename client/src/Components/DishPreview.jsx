import { useSelector, useDispatch } from "react-redux"
import { toggleOption } from "../redux/Slice/productSlice"
import DishView from "./dish/DishView"

// הבמה שליד שלבי הבנייה: המנה עצמה (מצוירת חי לפי הבחירות)
// ומתחתיה "צ'יפים" של כל מה שנבחר, עם x להסרה.
// אפשר גם ללחוץ ישירות על רכיב בציור כדי להסיר אותו.

export default function DishPreview() {
    const dispatch = useDispatch()
    const selectedProduct = useSelector(s => s.products.selectedProduct)
    const selections = useSelector(s => s.products.selections)
    const currentStepIndex = useSelector(s => s.products.currentStepIndex)

    if (!selectedProduct) return null

    const chosen = selectedProduct.steps.flatMap((step, stepIndex) =>
        (selections[stepIndex] || []).map(option => ({ ...option, stepIndex, key: `${stepIndex}-${option.label}` }))
    )

    const remove = item => dispatch(toggleOption({ stepIndex: item.stepIndex, option: { label: item.label } }))

    return (
        <div className="dish-stage">
            {/* שייק: מתערבל כשבוחרים נוזל, ולכל המאוחר בשלב האחרון (התוספות יושבות מעליו) */}
            <DishView product={selectedProduct} selections={selections} onRemove={remove}
                final={currentStepIndex >= selectedProduct.steps.length - 1} />

            <div className="dish-stage-info">
                <h3 className="dish-stage-title">המנה שלך</h3>
                <div className="dish-stage-chips">
                    {chosen.length === 0 && <p className="dish-stage-hint">בחרו תוספות ותראו אותן נוחתות ✨</p>}
                    {chosen.map(item => (
                        <span key={item.key} className="dish-chip">
                            {item.label}
                            <button onClick={() => remove(item)} aria-label={`הסר ${item.label}`}>×</button>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}
