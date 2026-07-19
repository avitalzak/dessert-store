import { useState } from "react"
import ProductsManager from "./productsManager"
import CategoriesManager from "./categoriesManager"
import OrdersManager from "./ordersManager"
import UsersManager from "./usersManager"
import "../styles/Admin.css"



export default function Admin() {

    const [activeTab, setActiveTab] = useState("")

    return (
        <div className="admin-container">
        <div className="admin-tabs">
            <button onClick={() => setActiveTab('products')}>ניהול מוצרים</button>
            <button onClick={() => setActiveTab('categories')}>ניהול קטגוריות</button>
            <button onClick={() => setActiveTab('orders')}>צפייה בהזמנות</button>
            <button onClick={() => setActiveTab('users')}>צפייה במשתמשים</button>
        </div>

        <div className="admin-content">
            {activeTab === 'products' && <ProductsManager/>}
            {activeTab === 'categories' && <CategoriesManager/>}
            {activeTab === 'orders' && <OrdersManager/>}
            {activeTab === 'users' && <UsersManager/>}
        </div>
        </div>
    )

}