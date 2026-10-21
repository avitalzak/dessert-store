import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { GetProducts } from "../redux/Slice/productSlice"

// "סרטון" פתיחה קולנועי לדף הבית:
// מצלמה שעוברת על הדלפק בחנות, ואז תקריבים של המוצרים עם השם והמחיר.
// אם קיים קובץ וידאו אמיתי ב-public/videos/store.mp4 - הוא מוצג במקום.
const VIDEO_SRC = "/videos/store.mp4"
const CLOSEUP_COUNT = 6

// מוצרים שלא יופיעו בסרטון, ומוצר שמוצג בו תמיד (במקום השלישי)
const HIDDEN_FROM_FILM = ["עוגת יום הולדת", "עוגת גבינה"]
const FEATURED_IN_FILM = "גלידה ברכבה אישית"

export default function HeroFilm({ storeImage, closingImage }) {
    const dispatch = useDispatch()
    const products = useSelector(state => state.products.products)

    const [index, setIndex] = useState(0)
    const [prev, setPrev] = useState(null)
    const [hasVideo, setHasVideo] = useState(false)

    useEffect(() => {
        if (!products || products.length === 0) dispatch(GetProducts())
    }, [dispatch, products])

    const shots = useMemo(() => {
        const featured = (products || []).find(p => p.name === FEATURED_IN_FILM && p.image)
        const picks = (products || [])
            .filter(p => p.image && p !== featured && !HIDDEN_FROM_FILM.includes(p.name))
            .slice(0, featured ? CLOSEUP_COUNT - 2 : CLOSEUP_COUNT - 1)
        if (featured) picks.splice(2, 0, featured)

        const closeups = picks
            .map((p, i) => ({
                src: p.image,
                kind: i % 2 === 0 ? "close-a" : "close-b",
                duration: 3800,
                caption: { n: i + 1, name: p.name, price: p.price }
            }))

        return [
            { src: storeImage, kind: "pan", duration: 7500 },
            ...closeups,
            { src: closingImage, kind: "push", duration: 5500 }
        ]
    }, [products, storeImage, closingImage])

    const current = index % shots.length

    useEffect(() => {
        if (hasVideo) return
        const timer = setTimeout(() => {
            setPrev(current)
            setIndex(current + 1)
        }, shots[current].duration)
        return () => clearTimeout(timer)
    }, [current, shots, hasVideo])

    const caption = shots[current].caption

    return (
        <div className={`hero-film ${hasVideo ? "has-video" : ""}`}>
            {shots.map((shot, i) => {
                const isCurrent = i === current
                const isLeaving = !isCurrent && i === prev
                return (
                    <div
                        key={i}
                        className={`film-shot film-${shot.kind} ${isCurrent ? "is-current" : ""} ${isLeaving ? "is-leaving" : ""}`}
                    >
                        <div
                            className="film-frame"
                            style={{ backgroundImage: `url(${shot.src})`, "--dur": `${shot.duration + 1400}ms` }}
                        />
                    </div>
                )
            })}

            {caption && !hasVideo && (
                <div className="film-caption" key={current}>
                    <span className="film-caption-n">Nº {String(caption.n).padStart(2, "0")}</span>
                    <span className="film-caption-name">{caption.name}</span>
                    <span className="film-caption-price">₪{caption.price}</span>
                </div>
            )}

            {!hasVideo && (
                <div className="film-progress">
                    {shots.map((shot, i) => (
                        <span key={i} className={i < current ? "done" : i === current ? "on" : ""}>
                            {i === current && <i key={index} style={{ animationDuration: `${shot.duration}ms` }} />}
                        </span>
                    ))}
                </div>
            )}

            <video
                className="film-video"
                src={VIDEO_SRC}
                autoPlay
                muted
                loop
                playsInline
                onCanPlay={() => setHasVideo(true)}
                onError={() => setHasVideo(false)}
            />
        </div>
    )
}
