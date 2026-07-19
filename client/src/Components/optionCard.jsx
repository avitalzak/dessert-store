
export default function OptionCard({ option, isSelected, disabled, onClick }) {

    return (
        <div 
            className={`kiosk-option-card ${isSelected ? "is-selected" : ""} ${disabled ? "is-disabled" : ""}`}
            onClick={!disabled ? onClick : undefined}
        >
            
            <div className="kiosk-card-image-wrapper">
                {option.image ? (
                    <img src={option.image} alt={option.label} onError={(e) => e.target.style.display = 'none'} />
                ) : (
                    <div className="kiosk-image-placeholder"></div>
                )}
            </div>


            <div className="kiosk-card-footer">
                <span className="kiosk-card-label">{option.label}</span>
                <div className="kiosk-card-mini-icon">✨</div>
            </div>
        </div>
    )
}