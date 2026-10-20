// אנימציה של תמונת המוצר "עפה" אל פס ההזמנה (או אל אייקון העגלה)
// ברגע שמוסיפים מוצר - כמו בעמדות הזמנה ובחנויות אונליין.
export function flyToOrder(img) {
    if (!img || !img.animate) return

    const target =
        document.querySelector(".order-bar-total") ||
        document.querySelector('.icon-btn[href="/shoppingcart"]')

    const from = img.getBoundingClientRect()
    const to = target
        ? (() => {
            const r = target.getBoundingClientRect()
            return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
        })()
        : { x: window.innerWidth / 2, y: window.innerHeight - 60 }

    const clone = img.cloneNode()
    Object.assign(clone.style, {
        position: "fixed",
        left: `${from.left}px`,
        top: `${from.top}px`,
        width: `${from.width}px`,
        height: `${from.height}px`,
        objectFit: "cover",
        borderRadius: "18px",
        zIndex: 3000,
        pointerEvents: "none",
        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.35)"
    })
    document.body.appendChild(clone)

    const dx = to.x - (from.left + from.width / 2)
    const dy = to.y - (from.top + from.height / 2)

    clone.animate(
        [
            { transform: "translate(0, 0) scale(1)", opacity: 1, borderRadius: "18px" },
            { transform: `translate(${dx * 0.45}px, ${dy * 0.45 - 140}px) scale(0.55)`, opacity: 1, borderRadius: "50%", offset: 0.5 },
            { transform: `translate(${dx}px, ${dy}px) scale(0.1)`, opacity: 0.3, borderRadius: "50%" }
        ],
        { duration: 800, easing: "cubic-bezier(0.45, 0, 0.55, 1)" }
    ).onfinish = () => clone.remove()
}
