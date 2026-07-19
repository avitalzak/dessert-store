import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LogOutPage from "../Pages/logOutPage";

export default function Header() {
  const user = useSelector(state => state.user.user)
  
  return (
    <>
    <div>
      {user ? (
        <p
        >שלום {user.firstName}
        </p>
      ) 
      : (
        <p>
         שלום אורח 
        </p>
      )}
    </div>
    </>
  )
}