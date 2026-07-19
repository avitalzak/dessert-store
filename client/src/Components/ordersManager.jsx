import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchOrders, updateOrderStatus } from "../redux/Slice/ordersSlice"
import "../styles/ManagerOrdersUsers.css"

const STATUS_OPTIONS = ["pending", "preparing", "ready", "completed", "cancelled"]


export default function OrdersManager() {

    const dispatch = useDispatch()
    const { ordersList, loading, error } = useSelector(state => state.orders)
    const [expandedOrderId, setExpandedOrderId] = useState(null)

    useEffect(() => {
        dispatch(fetchOrders())
    }, [dispatch])

    if (loading) return <div>טוען נתונים...</div>

    if (error) return <div>שגיאה: {error}</div>

    const toggleExpand = (orderId) => {
        setExpandedOrderId(prev => prev === orderId ? null : orderId)
    }

    const handleStatusChange = (e, orderId) => {
        e.stopPropagation()
        dispatch(updateOrderStatus({ id: orderId, status: e.target.value }))
    }


    return (
        <div className="orders-container" style={{ padding: '20px' }}>
            <h1 style={{ color: '#4a3a32', fontFamily: 'Arial, sans-serif', fontSize: '1.5em' }}>ניהול כל ההזמנות</h1>
            <table className="users-table">
                <thead>
                    <tr>
                        <th>מספר הזמנה</th>
                        <th>שם לקוח</th>
                        <th>מוצרים</th>
                        <th>סכום כולל</th>
                        <th>סטטוס</th>
                    </tr>
                </thead>
                <tbody>
                    {ordersList && ordersList.map(order => (
                        <>
                            <tr 
                                key={order._id} 
                                onClick={() => toggleExpand(order._id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <td>{order._id}</td>
                                <td>{order.customerName}</td>
                                <td>
                                    {order.items && order.items.map((item, index) => (
                                        <div key={index}>
                                            {item.name} x{item.quantity}
                                        </div>
                                    ))}
                                </td>
                                <td>{order.totalPrice} ₪</td>
                                <td>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(e, order._id)}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {STATUS_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>

                            {expandedOrderId === order._id && (
                                <tr key={`${order._id}-details`}>
                                    <td colSpan={5} style={{ background: '#f9f6f2', padding: '15px' }}>
                                        <h3 style={{ marginBottom: '10px' }}>פירוט ההזמנה</h3>
                                        {order.items && order.items.map((item, index) => (
                                            <div key={index} style={{ marginBottom: '10px', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>
                                                <div><strong>{item.name}</strong> - כמות: {item.quantity} - מחיר: {item.price} ₪</div>
                                                {item.components && item.components.length > 0 && (
                                                    <ul style={{ margin: '5px 0 0 20px' }}>
                                                        {item.components.map((comp, i) => (
                                                            <li key={i}>
                                                                {comp.stepTitle}: {comp.label} 
                                                                {comp.priceDelta > 0 && ` (+${comp.priceDelta} ₪)`}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}
                                    </td>
                                </tr>
                            )}
                        </>
                    ))}
                </tbody>
            </table>
        </div>  
    )    
}