import { useSelector } from "react-redux"
import { useState } from "react"
import { isBirthdayToday } from "../Services/BirthDayLogic"

export default function BirthdayBanner() {
    const isSignIn = useSelector(state => state.user?.isSignIn)
    const loggedUser = useSelector(state => state.user?.user)
    const [isVisible, setIsVisible] = useState(true)

    // אם התנאים לא מתקיימים - לא מרנדרים כלום
    if (!isVisible || !isSignIn || !loggedUser?.birthDate || !isBirthdayToday(loggedUser.birthDate)) {
        return null
    }

    const userName = loggedUser?.firstName || loggedUser?.name || "אורח/ת"

    return (
        <>
            <style type="text/css">{`
                /* אנימציית כניסה - קפיצה מהחלק העליון */
                @keyframes birthdayBounceIn {
                    0% { opacity: 0; transform: translate(-50%, -100px); }
                    60% { opacity: 1; transform: translate(-50%, 20px); }
                    100% { transform: translate(-50%, 0); }
                }

                /* אנימציית קונפטי משופרת - נפילה ונדנוד קל */
                @keyframes confettiFallLeft {
                    0% { opacity: 0; transform: translateY(-20px) rotate(0deg) translateX(0); }
                    10% { opacity: 1; }
                    100% { opacity: 0; transform: translateY(150px) rotate(360deg) translateX(-20px); }
                }

                @keyframes confettiFallRight {
                    0% { opacity: 0; transform: translateY(-20px) rotate(0deg) translateX(0); }
                    10% { opacity: 1; }
                    100% { opacity: 0; transform: translateY(150px) rotate(-360deg) translateX(20px); }
                }

                .birthday-banner-container {
                    position: fixed;
                    top: 40px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 9999;
                    animation: birthdayBounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                    width: 90%;
                    max-width: 600px;
                    pointer-events: none; /* מונע מהאזור לעצור לחיצות על מה שמתחתיו */
                }

                .birthday-banner-content {
                    background: linear-gradient(135deg, #fff5f7 0%, #ffeef2 100%);
                    color: #881e45;
                    padding: 30px;
                    text-align: center;
                    border: 3px solid #ffccd5;
                    border-radius: 25px;
                    box-shadow: 0 15px 35px rgba(230, 85, 125, 0.2);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 15px;
                    position: relative;
                    overflow: visible;
                    pointer-events: auto; /* מחזיר את אפשרות הלחיצה לרכיב הפנימי */
                }

                /* הגדרות כלליות לקונפטי */
                .birthday-banner-container::before,
                .birthday-banner-container::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 10;
                }

                /* קונפטי צד שמאל */
                .birthday-banner-container::before {
                    left: -20px;
                    background-color: #ffcc00;
                    animation: confettiFallLeft 2.5s ease-in-out infinite;
                    box-shadow: 
                        -20px 20px #ff6f91, 
                        -40px 60px #00C853, 
                        20px 40px #304FFE, 
                        -10px 80px #ffcc00,
                        -30px 120px #ff6f91;
                }

                /* קונפטי צד ימין */
                .birthday-banner-container::after {
                    right: -20px;
                    background-color: #304FFE;
                    animation: confettiFallRight 2.5s ease-in-out infinite;
                    animation-delay: 0.5s;
                    width: 12px;
                    height: 8px;
                    border-radius: 2px;
                    box-shadow: 
                        20px 20px #ffcc00, 
                        40px 50px #ff6f91, 
                        -20px 30px #00C853, 
                        30px 90px #304FFE,
                        10px 130px #ffcc00;
                }

                .birthday-text {
                    font-size: 1.5rem;
                    font-weight: bold;
                    line-height: 1.6;
                    margin: 0;
                }

                .discount-badge {
                    background-color: #e6557d;
                    color: white;
                    padding: 8px 20px;
                    border-radius: 50px;
                    font-size: 1.2rem;
                    display: inline-block;
                    margin-top: 10px;
                    box-shadow: 0 4px 10px rgba(230, 85, 125, 0.3);
                }

                .birthday-close-btn {
                    position: absolute;
                    top: 15px;
                    right: 20px;
                    background: rgba(255, 255, 255, 0.7);
                    border: none;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    cursor: pointer;
                    font-size: 1.5rem;
                    color: #b03060;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s;
                    z-index: 20;
                }

                .birthday-close-btn:hover {
                    background: #ffccd5;
                    transform: rotate(90deg);
                }
            `}</style>

            <div className="birthday-banner-container">
                <div className="birthday-banner-content">
                    <button 
                        className="birthday-close-btn" 
                        onClick={() => setIsVisible(false)}
                        type="button"
                    >
                        &times;
                    </button>
                    <div style={{ fontSize: '3rem' }}>🎉</div>
                    <div className="birthday-text">
                        מזל טוב, {userName}! <br />
                        היום יום ההולדת שלך!
                    </div>
                    <div className="discount-badge">
                        מגיע לך 10% הנחה על כל ההזמנה! 🎂
                    </div>
                </div>
            </div>
        </>
    )
}