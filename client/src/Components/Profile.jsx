import { useSelector } from "react-redux"
import LogOut from "./logOut"
import SignInPage from "../Pages/signInPage"
import "../styles/Profile.css"

export default function Profile() {

    const user = useSelector(state => state.user.user)
    const { loading, error } = useSelector(state => state.user)

    if (loading) return <p>טוען נתונים...</p>
    if (error) return <div>שגיאה: {error}</div>
    if (!user) return <SignInPage/>

    return (
        <div className="profile-page">
            <div className="profile-content">

                <h2>דף פרופיל</h2>

                <div className="profile-details">
                    <p><strong>שם פרטי:</strong> {user.firstName}</p>
                    <p><strong>שם משפחה:</strong> {user.lastName}</p>
                    <p><strong>מייל:</strong> {user.email}</p>
                    <p><strong>תאריך לידה:</strong> {user.birthDate}</p>
                </div>

                <LogOut />

            </div>
        </div>
    )
}