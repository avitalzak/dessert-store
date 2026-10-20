import { useState } from "react"

export default function OptionCard({ option, isSelected, disabled, onClick, fallback }) {
    // אם התמונה לא נטענה - מציגים את האיור המצויר של הרכיב במקומה
    const [imageFailed, setImageFailed] = useState(false)

    return (
        <div
            className={`kiosk-option-card ${isSelected ? "is-selected" : ""} ${disabled ? "is-disabled" : ""}`}
            onClick={!disabled ? onClick : undefined}
        >

            <div className="kiosk-card-image-wrapper">
                {option.image && !imageFailed ? (
                    <img src={option.image} alt={option.label} onError={() => setImageFailed(true)} />
                ) : fallback ? (
                    fallback
                ) : (
                    <div className="kiosk-image-placeholder"></div>
                )}
            </div>


            <div className="kiosk-card-footer">
                <span className="kiosk-card-label">{option.label}</span>
                {option.priceDelta > 0 && <span className="kiosk-card-price kiosk-only">+₪{option.priceDelta}</span>}
                <div className="kiosk-card-mini-icon">✨</div>
            </div>
        </div>
    )
}
