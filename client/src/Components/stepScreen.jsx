import OptionCard from "./optionCard"
import "../styles/OptionCard.css"

export default function StepScreen({ step, chosen, onToggle }) {

    //כמות הפריטים שניתן לבחור עוד (אם  אפשר לבחור כמה פריטים)
    const remaining = step.multiSelect ? step.maxSelect - chosen.length : null

    return (
        <div className="kiosk-step-container">
            <h2 className="kiosk-step-title">{step.title}</h2>
            
            <p className="kiosk-step-subtitle">
                {step.multiSelect && remaining > 0
                    ? `אפשר לבחור עוד ${remaining} מתוך ${step.maxSelect}`
                    : ""}
            </p>

            <div className="kiosk-options-grid">
                {step.options.map(option => {
                    const isSelected = chosen.some(c => c.label === option.label)
                    const isDisabled = step.multiSelect && !isSelected && remaining <= 0

                    return (
                        <OptionCard
                            key={option.label}
                            option={option}
                            isSelected={isSelected}
                            disabled={isDisabled}
                            onClick={() => onToggle(option)}
                        />
                    )
                })}
            </div>
        </div>
    )
}