import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { GetProducts } from "../redux/Slice/productSlice"
import { Outlet } from "react-router-dom"

export default function ProductsPage() {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(GetProducts())
    }, [dispatch])


    return (
        <>
        <Outlet/>
        </>
    )
}