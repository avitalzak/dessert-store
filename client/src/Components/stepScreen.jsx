import OptionCard from "./optionCard"
import IngredientIcon from "./dish/IngredientIcon"
import "../styles/OptionCard.css"
import { useImagesReady } from "../Services/useImagesReady"

export default function StepScreen({ step, product, chosen, onToggle }) {

    //כמות הפריטים שניתן לבחור עוד (אם  אפשר לבחור כמה פריטים)
    const remaining = step.multiSelect ? step.maxSelect - chosen.length : null

    // כל האופציות של השלב מופיעות יחד, רק אחרי שהתמונות נטענו
    const imagesReady = useImagesReady(step.options.map(o => o.image))

    return (
        <div className="kiosk-step-container">
            <h2 className="kiosk-step-title">{step.title}</h2>
            
            <p className="kiosk-step-subtitle">
                {step.multiSelect && remaining > 0
                    ? `אפשר לבחור עוד ${remaining} מתוך ${step.maxSelect}`
                    : ""}
            </p>

            <div className={`kiosk-options-grid ${imagesReady ? "" : "is-pending"}`}>
                {step.options.map(option => {
                    const isSelected = chosen.some(c => c.label === option.label)
                    const isDisabled = step.multiSelect && !isSelected && remaining <= 0

                    return (
                        <OptionCard
                            key={option.label}
                            option={option}
                            isSelected={isSelected}
                            disabled={isDisabled}
                            fallback={<IngredientIcon option={option} step={step} product={product} />}
                            onClick={() => onToggle(option)}
                        />
                    )
                })}
            </div>
        </div>
    )
}