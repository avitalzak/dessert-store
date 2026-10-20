// תוויות בעברית לנתוני ההזמנה, לתצוגת העמדה

export const STATUS_LABELS = {
    pending: "התקבלה",
    preparing: "בהכנה",
    ready: "מוכנה לאיסוף",
    completed: "הושלמה",
    cancelled: "בוטלה"
}

export const STATUS_FLOW = ["pending", "preparing", "ready", "completed"]

export const TYPE_LABELS = {
    "dine in": "לשבת במקום",
    takeaway: "לקחת"
}

export const METHOD_LABELS = {
    card: "כרטיס אשראי",
    cash: "מזומן בקופה",
    paypal: "PayPal"
}

export function orderNumber(order) {
    // הזמנות חדשות מקבלות מספר יומי קצר; בישנות מציגים את סוף המזהה
    if (order?.orderNumber) return String(order.orderNumber)
    return (order?._id || "").slice(-6).toUpperCase()
}

export function formatOrderDate(value) {
    const date = new Date(value)
    if (isNaN(date)) return ""
    const day = date.toLocaleDateString("he-IL")
    const time = date.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })
    return `${day} · ${time}`
}

export function itemCount(order) {
    return (order?.items || []).reduce((sum, item) => sum + (item.quantity || 1), 0)
}
