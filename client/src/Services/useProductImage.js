import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { GetProducts } from "../redux/Slice/productSlice"

// מחזיר פונקציה שמוצאת את תמונת המוצר של פריט (הזמנה / מועדפים / עגלה)
// לפי ה-productId שלו, וטוען את המוצרים אם עוד לא נטענו.
export function useProductImage() {
    const dispatch = useDispatch()
    const products = useSelector(state => state.products.products)

    useEffect(() => {
        if (!products || products.length === 0) dispatch(GetProducts())
    }, [dispatch, products])

    return (item) =>
        item?.image || products?.find(p => p._id === item?.productId)?.image || ""
}
