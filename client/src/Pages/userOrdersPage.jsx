import { Outlet } from "react-router-dom";
import MyOrders from "../Components/myOrders";

export default function UserOrders() {


    return (
        <>
        <MyOrders/>
        <Outlet/> 
        </>
    )
}