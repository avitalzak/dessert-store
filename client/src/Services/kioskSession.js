import { logoutUser } from "../redux/Slice/userSlice"
import { clearCart } from "../redux/Slice/cartSlice"
import { clearOrders } from "../redux/Slice/ordersSlice"

// מחזיר את העמדה למצב התחלתי ללקוח הבא: סל ריק, בלי משתמש מחובר, מסך הבית
export function resetSession(dispatch, navigate) {
    if (localStorage.getItem("jwtToken")) {
        dispatch(logoutUser())
        dispatch(clearOrders())
    } else {
        dispatch(clearCart())
    }
    navigate("/")
}
