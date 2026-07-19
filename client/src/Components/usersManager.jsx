import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllUsers } from "../redux/Slice/userSlice"
import "../styles/ManagerOrdersUsers.css"

export default function UsersManager() {
    const dispatch = useDispatch()
    const { usersList, loading, error } = useSelector(state => state.user)
    

    useEffect(() => {
        console.log("UsersManager is rendering!");
        dispatch(fetchAllUsers())
    }, [dispatch])

    
    if (loading) return <div>טוען נתונים...</div>
    if (error) return <div>שגיאה: {error}</div>
  
        return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ color: '#4a3a32', fontFamily: 'Arial, sans-serif' }}>ניהול משתמשים</h2>
            <table className="users-table">
                <thead>
                    <tr>
                        <th>שם</th>
                        <th>אימייל</th>
                        <th>תפקיד</th>
                    </tr>
                </thead>
                <tbody>
                    {usersList && usersList.map(user => (
                        <tr key={user._id}>
                            <td>{user.firstName} {user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.role === "admin" ? "מנהל" : "משתמש רגיל"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}