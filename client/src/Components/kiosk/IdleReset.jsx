import { useCallback, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { FaHandPointUp } from "react-icons/fa"
import { resetSession } from "../../Services/kioskSession"
import "../../styles/KioskFlow.css"

const IDLE_MS = 90 * 1000   // כמה זמן בלי מגע עד שנשאלים "עדיין כאן?"
const COUNTDOWN = 20        // כמה שניות יש לענות לפני שהעמדה מתאפסת

const ACTIVITY_EVENTS = ["pointerdown", "keydown", "wheel", "touchstart", "scroll"]

// בעמדה ציבורית: אחרי חוסר פעילות שואלים אם הלקוח עדיין כאן, ואם לא - מאפסים ללקוח הבא
export default function IdleReset() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const cartCount = useSelector(state => (state.cart.items || []).length)
    const isSignIn = useSelector(state => state.user?.isSignIn)

    const [secondsLeft, setSecondsLeft] = useState(null)
    const idleTimer = useRef(null)

    // במסך הבית בלי סל ובלי משתמש אין מה לאפס; בניהול לא מאפסים בכלל
    const active = !pathname.startsWith("/admin") && (pathname !== "/" || cartCount > 0 || isSignIn)
    const asking = secondsLeft !== null

    const restartIdle = useCallback(() => {
        clearTimeout(idleTimer.current)
        idleTimer.current = setTimeout(() => setSecondsLeft(COUNTDOWN), IDLE_MS)
    }, [])

    useEffect(() => {
        if (!active || asking) return
        restartIdle()
        ACTIVITY_EVENTS.forEach(e => window.addEventListener(e, restartIdle, { passive: true, capture: true }))
        return () => {
            clearTimeout(idleTimer.current)
            ACTIVITY_EVENTS.forEach(e => window.removeEventListener(e, restartIdle, { capture: true }))
        }
    }, [active, asking, restartIdle])

    const restart = useCallback(() => {
        setSecondsLeft(null)
        resetSession(dispatch, navigate)
    }, [dispatch, navigate])

    useEffect(() => {
        if (!asking) return
        const t = setTimeout(() => (secondsLeft <= 1 ? restart() : setSecondsLeft(s => s - 1)), 1000)
        return () => clearTimeout(t)
    }, [asking, secondsLeft, restart])

    if (!asking) return null

    return (
        <div className="kf-overlay" role="dialog" aria-modal="true" aria-labelledby="idle-title">
            <div className="kf-card kf-idle">
                <div className="kf-idle-ring" style={{ "--p": secondsLeft / COUNTDOWN }}>
                    <span>{secondsLeft}</span>
                </div>
                <h2 id="idle-title">אתם עדיין כאן?</h2>
                <p>אם לא תגעו במסך, ההזמנה תתבטל והעמדה תחזור להתחלה.</p>
                <div className="kf-actions">
                    <button className="kf-btn kf-btn-primary" onClick={() => setSecondsLeft(null)}>
                        <FaHandPointUp /> כן, אני כאן
                    </button>
                    <button className="kf-btn kf-btn-ghost" onClick={restart}>
                        להתחיל מחדש
                    </button>
                </div>
            </div>
        </div>
    )
}
