import { useEffect, useRef, useState } from "react"

export const LEAVE_MS = 420

// שומר פריטים שהוסרו עוד רגע ב-DOM (עם leaving=true) כדי שתהיה אנימציית יציאה.
// בלי זה React היה מוחק אותם מיד והם פשוט היו "נעלמים".
export function usePresence(items) {
    const [leaving, setLeaving] = useState([])
    const prevRef = useRef(items)
    const timers = useRef([])

    useEffect(() => {
        const prev = prevRef.current
        prevRef.current = items
        const keys = new Set(items.map(i => i.key))
        const gone = prev.filter(i => !keys.has(i.key))

        // פריט שחזר לפני שהאנימציה נגמרה - מוציאים אותו מרשימת היוצאים
        setLeaving(list => {
            const kept = list.filter(i => !keys.has(i.key))
            return gone.length || kept.length !== list.length ? [...kept, ...gone] : list
        })
        if (gone.length) {
            const goneKeys = new Set(gone.map(g => g.key))
            timers.current.push(setTimeout(() => {
                setLeaving(list => list.filter(i => !goneKeys.has(i.key)))
            }, LEAVE_MS))
        }
    }, [items])

    useEffect(() => () => timers.current.forEach(clearTimeout), [])

    const keys = new Set(items.map(i => i.key))
    return [
        ...items.map(i => ({ ...i, leaving: false })),
        ...leaving.filter(i => !keys.has(i.key)).map(i => ({ ...i, leaving: true })),
    ]
}
