import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

export default function AdminRoute({ children }) {
    const { user, loading } = useSelector(state => state.user)

    console.log("loading:", loading, "| user:", user)

    if (loading && !user) { 
        return <div>טוען אימות משתמש...</div>
    }

    if (!user) {
        return <Navigate to="/user/signIn" replace />
    }

    if (user.role !== "admin") {
        return <Navigate to="/" replace />
    }

    return children
}