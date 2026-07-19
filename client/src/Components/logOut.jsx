import { useDispatch } from "react-redux"
import { logoutUser, setSignOut } from "../redux/Slice/userSlice"
import { clearCart } from "../redux/Slice/cartSlice"
import { clearOrders } from "../redux/Slice/ordersSlice"


export default function LogOut() {

    const dispatch = useDispatch()


    const handleLogOut = () => {
        dispatch(logoutUser())
        dispatch(setSignOut())
        dispatch(clearCart()) 
        dispatch(clearOrders())
    }


    return (
        <>
        <button onClick={handleLogOut}>התנתקות</button>
        </>
    )
}