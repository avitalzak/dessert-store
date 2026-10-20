import { useState } from "react"
import { useSelector } from "react-redux"
import UserOrders from "../Pages/userOrdersPage"
import UserFavorites from "../Pages/userFavoritesPage"
import SignInPage from "./signInPage"
import SignUpPage from "../Pages/signUpPage"
import Profile from "../Components/Profile"
import "../styles/User.css"
import { FaUser, FaReceipt, FaHeart, FaSignInAlt, FaUserPlus, FaBirthdayCake } from "react-icons/fa"

export default function User() {

    const isSignIn = useSelector(state => state.user.isSignIn)
    const user = useSelector(state => state.user.user)
    const initials = user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}` : ""
    const [activeSection, setActiveSection] = useState(
    isSignIn ? "profile" : "signin"
)

    const menuItems = isSignIn 
        ? [
            { id: "profile", label: "פרופיל", icon: <FaUser /> },
            { id: "orders", label: "ההזמנות שלי", icon: <FaReceipt /> },
            { id: "favorites", label: "המועדפים שלי", icon: <FaHeart /> },
          ]
        : [
            { id: "signin", label: "התחברות", icon: <FaSignInAlt /> },
            { id: "signup", label: "הרשמה", icon: <FaUserPlus /> }
          ]


    return (
        
        <div className="user-page-container">
           
            
            
            <div className="side-menu">
                <div className="account-head kiosk-only">
                    <span className="account-avatar">{initials || <FaUser />}</span>
                    <div className="account-head-text">
                        <strong>{user ? `שלום, ${user.firstName}` : "שלום אורח"}</strong>
                        <span>{user ? user.email : "התחברו כדי ליהנות מהטבות"}</span>
                    </div>
                </div>
                {menuItems.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`menu-button ${isActive ? "active" : ""}`}
                        >
                            <span className="menu-ico kiosk-only">{item.icon}</span>
                            {item.label}
                        </button>
                    );
                })}
            </div>

            <div className={`content-display-area ${!isSignIn ? "is-guest" : ""}`}>
                {activeSection === "orders" && <UserOrders/>}
                {activeSection === "profile" && <Profile/>}
                {activeSection === "favorites" && <UserFavorites/>}
                {activeSection === "signin" && <SignInPage setActiveSection={setActiveSection}/>}
                {activeSection === "signup" && <SignUpPage setActiveSection={setActiveSection}/>}

                {!isSignIn && (
                    <aside className="auth-perks kiosk-only">
                        <h4>מצטרפים למועדון ונהנים</h4>
                        <ul>
                            <li>
                                <span className="perk-ico"><FaBirthdayCake /></span>
                                <div><strong>10% הנחה ביום ההולדת</strong><small>מתנה מאיתנו בכל שנה</small></div>
                            </li>
                            <li>
                                <span className="perk-ico"><FaReceipt /></span>
                                <div><strong>היסטוריית הזמנות</strong><small>מזמינים שוב בלחיצה אחת</small></div>
                            </li>
                            <li>
                                <span className="perk-ico"><FaHeart /></span>
                                <div><strong>מועדפים</strong><small>שומרים את הקינוחים שאוהבים</small></div>
                            </li>
                        </ul>
                    </aside>
                )}
            </div>

            
            
        </div>
    )
}