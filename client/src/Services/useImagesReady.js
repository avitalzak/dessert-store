import { useEffect, useState } from "react"

// מחזיר true רק כשכל התמונות ברשימה סיימו להיטען (או נכשלו),
// כדי שכל הכרטיסים יופיעו יחד ולא אחד-אחד.
// אחרי timeout מציגים בכל מקרה, כדי שתמונה איטית לא תתקע את המסך.
export function useImagesReady(urls, timeout = 4000) {
    const key = urls.filter(Boolean).join("|")
    const [readyKey, setReadyKey] = useState(null)

    useEffect(() => {
        if (!key) return
        let cancelled = false

        const loaders = key.split("|").map(src => new Promise(resolve => {
            const img = new Image()
            img.onload = resolve
            img.onerror = resolve
            img.src = src
        }))
        const timer = new Promise(resolve => setTimeout(resolve, timeout))

        Promise.race([Promise.all(loaders), timer]).then(() => {
            if (!cancelled) setReadyKey(key)
        })

        return () => {
            cancelled = true
        }
    }, [key, timeout])

    return !key || readyKey === key
}
