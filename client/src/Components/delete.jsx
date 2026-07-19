import "../styles/Delete.css"
export default function Delete({ isOpen, onConfirm, onCancel, itemName }) {

    if (!isOpen) return null

    return (
        <div className="delete-overlay">
            <div className="delete-popup">
                <h3>אישור מחיקה</h3>

                <p>
                    האם אתה בטוח שברצונך למחוק את 
                    <strong> {itemName}</strong>?
                </p>

                <div className="delete-buttons">
                    <button 
                        className="delete-confirm"
                        onClick={onConfirm}
                    >
                        מחק
                    </button>

                    <button 
                        className="delete-cancel"
                        onClick={onCancel}
                    >
                        ביטול
                    </button>
                </div>
            </div>
        </div>
    )
}