import { useState } from "react"
import { useSelector } from "react-redux"
import UserOrders from "../Pages/userOrdersPage"
import UserFavorites from "../Pages/userFavoritesPage"
import SignInPage from "./signInPage"
import SignUpPage from "../Pages/signUpPage"
import Profile from "../Components/Profile"
import "../styles/User.css"

export default function User() {

    const isSignIn = useSelector(state => state.user.isSignIn)
    const [activeSection, setActiveSection] = useState(
    isSignIn ? "profile" : "signin"
)

    const menuItems = isSignIn 
        ? [
            { id: "profile", label: "פרופיל" },
            { id: "orders", label: "ההזמנות שלי" },
            { id: "favorites", label: "המועדפים שלי" },
          ]
        : [
            { id: "signin", label: "התחברות" },
            { id: "signup", label: "הרשמה" }
          ]


    return (
        
        <div className="user-page-container">
           
            
            
            <div className="side-menu">
                {menuItems.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`menu-button ${isActive ? "active" : ""}`}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>

            <div className="content-display-area">
                {activeSection === "orders" && <UserOrders/>}
                {activeSection === "profile" && <Profile/>}
                {activeSection === "favorites" && <UserFavorites/>}
                {activeSection === "signin" && <SignInPage setActiveSection={setActiveSection}/>}
                {activeSection === "signup" && <SignUpPage setActiveSection={setActiveSection}/>}
            </div>

            
            
        </div>
    )
}