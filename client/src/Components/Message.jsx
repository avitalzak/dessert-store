import "../styles/Message.css"

export default function MessagePopup({ isOpen, message, onClose }) {

    if (!isOpen) return null

    return (
        <div className="message-overlay">
            <div className="message-popup">
                <h3>{message}</h3>

                <button onClick={onClose}>
                    אישור
                </button>
            </div>
        </div>
    )
}