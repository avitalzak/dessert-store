import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { LoginUser } from "../redux/Slice/userSlice"
import { useNavigate } from "react-router-dom"
import { fetchCartFromServer, mergeCartServer } from "../redux/Slice/cartSlice"
import "../styles/Auth.css"


export default function SignIn({setActiveSection}) {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const guestCartItems = useSelector(state => state.cart.items || [])


    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")


        if (!email || !password) {
            setError("יש למלא את כל השדות")
            return
        }

        if (!validateEmail(email)) {
            setError("כתובת האימייל אינה תקינה")
            return
        }


        try {

            const resultAction = await dispatch(
                LoginUser({ email, password })
            )


            if (LoginUser.fulfilled.match(resultAction)) {

                if (guestCartItems.length > 0) {
                    await dispatch(mergeCartServer(guestCartItems))
                } 
                else {
                    await dispatch(fetchCartFromServer())
                }

                navigate("/")
            }
            else {
                setError(
                    resultAction.payload || 
                    "האימייל או הסיסמה אינם נכונים"
                )
            }

        }
        catch(err) {
            setError("אירעה שגיאה בהתחברות")
        }
    }


    return (
        <div className="auth-container">
            <div className="auth-card">

                <h3>התחברות באתר</h3>

                {error && 
                    <div className="auth-error">
                        {error}
                    </div>
                }


                <form onSubmit={handleSubmit} className="auth-form">

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

                    <button className="btn-submit">
                        התחבר
                    </button>

                </form>


                <button 
                    className="btn-switch"
                    onClick={() => setActiveSection("signup")}
                >
                    עבור להרשמה
                </button>

            </div>
        </div>
    )
}