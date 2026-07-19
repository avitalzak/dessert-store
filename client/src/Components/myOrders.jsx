import { useEffect, useState } from "react" 
import { useDispatch, useSelector } from "react-redux" 
import { useNavigate } from "react-router-dom" 
import { fetchMyOrders } from "../redux/Slice/ordersSlice"  
import OrderCard from "./orderCard"  
import "../styles/MyOrders.css"

export default function MyOrders() {
    const dispatch = useDispatch() 
    const navigate = useNavigate() 
    const { ordersList: orders, loading, error } = useSelector(state => state.orders) 
    const [selectedOrder, setSelectedOrder] = useState(null) 

    const [currentPage, setCurrentPage] = useState(1) 
    const itemsPerPage = 2  // מספר ההזמנות שיוצגו בכל עמוד

    useEffect(() => {
        setSelectedOrder(null)
    }, [])

    useEffect(() => {
        if (orders.length === 0) {
            dispatch(fetchMyOrders()) 
        }
    }, [dispatch, orders.length]) 

    

    if (loading) return <p>טוען הזמנות...</p>
    if (error) return <div>שגיאה: {error}</div>
    if (orders.length === 0) return <p>אין הזמנות להצגה</p> 

    const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
) 

const indexOfLastItem = currentPage * itemsPerPage 
const indexOfFirstItem = indexOfLastItem - itemsPerPage 
const currentOrders = sortedOrders.slice(indexOfFirstItem, indexOfLastItem) 
const totalPages = Math.ceil(sortedOrders.length / itemsPerPage) 


    return (
        <div className="orders-container-single"> 
            <div className="orders-main-panel">
                <h2 className="sidebar-title">ההזמנות שלי</h2>
                
                    {selectedOrder ? (
                        <OrderCard
                            order={selectedOrder}
                            onBack={() => setSelectedOrder(null)}
                          />
                    ) : (
                    <div className="orders-list">
                        {currentOrders.map(order => {
                            return (
                                <div
                                    key={order._id}
                                    onClick={() => setSelectedOrder(order)}
                                    className="order-summary-card"
                                >
                                    <div className="order-summary-header">
                                        <span className="order-date">
                                            {new Date(order.date).toLocaleDateString('he-IL')}
                                        </span>
                                        <span className="order-id">#{order._id?.slice(-6) || "100234"}</span>
                                    </div>
                                    <div className="order-summary-body">
                                        {order.items?.map((item, index) => (
                                            <div key={index} className="order-summary-item">
                                                {item.quantity}x {item.name}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="order-summary-footer">
                                        <span className="order-status-badge">{order.status || "הושלם"}</span>
                                        <span className="order-price">₪{order.totalPrice || 65}</span>
                                    </div>
                                </div>
                            ) 
                        })}
                    </div>
                )}

                
                {!selectedOrder && totalPages > 1 && (
                    <div className="pagination-container">
                        <button 
                            className="pagination-btn"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                           ❮
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}

                        <button 
                            className="pagination-btn"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            ❯ 
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}