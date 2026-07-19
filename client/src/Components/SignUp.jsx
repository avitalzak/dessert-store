import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { registerUser } from "../redux/Slice/userSlice"
import "../styles/Auth.css"

export default function SignUp({setActiveSection}) {

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [birthDate, setBirthDate] = useState("")

    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const navigate = useNavigate()
    const dispatch = useDispatch()

    // פונקציה לקבלת התאריך של היום בפורמט YYYY-MM-DD
    const getTodayDate = () => {
        return new Date().toISOString().split('T')[0]
    }

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (!firstName || !lastName || !email || !password || !birthDate) {
            setError("יש למלא את כל השדות")
            return
        }

        if (!validateEmail(email)) {
            setError("כתובת האימייל אינה תקינה")
            return
        }

        // ולדיציה: בדיקה שתאריך הלידה אינו עתידי
        if (birthDate > getTodayDate()) {
            setError("תאריך הלידה אינו יכול להיות בעתיד")
            return
        }

        const newUser = {
            firstName,
            lastName,
            email,
            password,
            birthDate
        }

        try {
            await dispatch(registerUser(newUser)).unwrap()
            setSuccess("נרשמת בהצלחה! מעביר להתחברות...")

            setFirstName("")
            setLastName("")
            setEmail("")
            setPassword("")
            setBirthDate("")

            setTimeout(() => {
                setActiveSection("signin")
            }, 1500)

        }
        catch(err) {
            setError(
                err?.message ||
                err ||
                "משתמש עם אימייל זה כבר קיים"
            )
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h3>הרשמה</h3>

                {error &&
                    <div className="auth-error">
                        {error}
                    </div>
                }

                {success &&
                    <div className="auth-success">
                        {success}
                    </div>
                }

                <form 
                    onSubmit={handleSubmit}
                    className="auth-form"
                >
                    <input
                        className="auth-input"
                        type="text"
                        placeholder="שם פרטי"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                    />

                    <input
                        className="auth-input"
                        type="text"
                        placeholder="שם משפחה"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                    />

                    <input
                        className="auth-input"
                        type="text"
                        placeholder="אימייל"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />

                    <input
                        className="auth-input"
                        type="password"
                        placeholder="סיסמה"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />

                    <input
                        className="auth-input"
                        type="date"
                        value={birthDate}
                        max={getTodayDate()} // חוסם בחירת תאריכים עתידיים בלוח השנה
                        onChange={e => setBirthDate(e.target.value)}
                    />

                    <button 
                        className="btn-submit"
                        type="submit"
                    >
                        הרשם
                    </button>
                </form>

                <button
                    className="btn-switch"
                    onClick={() => setActiveSection("signin")}
                >
                    עבור להתחברות
                </button>
            </div>
        </div>
    )
}