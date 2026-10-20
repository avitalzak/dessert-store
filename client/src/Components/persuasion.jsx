import { useNavigate } from "react-router-dom"

export default function Persuasion({ onClose, onContinue }) {
    const navigate = useNavigate()

    return (
        <div className="persuasion-overlay" style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000
        }}>
            <div className="persuasion-card" style={{
                backgroundColor: "white", padding: "30px", borderRadius: "12px",
                maxWidth: "400px", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
            }}>
                <h2>🍦 רגע לפני שממשיכים</h2>
                <p className="persuasion-lede" style={{ fontSize: "16px", color: "#555" }}>
                    הצטרפו אלינו ותהנו מהטבות מיוחדות:
                </p>
                <ul className="persuasion-list" style={{ textAlign: "right", color: "#333", lineHeight: "2" }}>
                    <li>🎂 10% הנחה היום ההולדת שלכם</li>
                    <li>📦 מעקב אחר הזמנות שלכם</li>
                    <li>❤️ שמירת הקינוחים האהובים עליכם</li>
                </ul>
                <div style={{ display: "flex", gap: "10px", marginTop: "20px", justifyContent: "center" }}>
                    <button
                        className="persuasion-yes"
                        onClick={() => navigate("/user/signUp")}
                        style={{
                            backgroundColor: "#ff7597", color: "white",
                            padding: "10px 20px", border: "none",
                            borderRadius: "8px", cursor: "pointer", fontWeight: "bold"
                        }}>
                        כן, אני רוצה 🎉
                    </button>
                    <button
                        className="persuasion-no"
                        onClick={onContinue}
                        style={{
                            backgroundColor: "#eee", color: "#333",
                            padding: "10px 20px", border: "none",
                            borderRadius: "8px", cursor: "pointer"
                        }}>
                        לא עכשיו
                    </button>
                </div>
                <p className="persuasion-close" style={{ fontSize: "12px", color: "#aaa", marginTop: "10px", cursor: "pointer" }}
                   onClick={onClose}>
                    ✕ סגור
                </p>
            </div>
        </div>   
    )
}