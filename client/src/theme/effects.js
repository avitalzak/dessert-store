// אפקטים חיים לערכות העיצוב "noir" ו-"rose":
// אבק מרחף, גל עדין בכל נגיעה, הטיה תלת-ממדית של כרטיסים
// וחגיגת ניצוצות כשמגיעים לסיכום המנה.

const TILT_SELECTOR = ".category-card, .product-card, .kiosk-option-card, .item-card, .waffle-item-card"

const PRESETS = {
    noir: {
        dustCount: 42,
        dustColors: [[250, 228, 178]],
        sparkColors: [[255, 226, 160]],
        blend: "lighter",
        tapSparks: true,
        ripple: true,
        tilt: true
    },
    rose: {
        dustCount: 30,
        dustColors: [[255, 128, 162], [216, 173, 78], [143, 191, 115]],
        sparkColors: [[255, 111, 150], [232, 67, 110], [216, 173, 78], [143, 191, 115], [255, 201, 168]],
        blend: "source-over",
        tapSparks: false,
        ripple: true,
        tilt: true
    },
    // עמדת הזמנה: בלי אפקטים קבועים - רק קונפטי ברגעים מיוחדים
    kiosk: {
        dustCount: 0,
        dustColors: [[233, 78, 119]],
        sparkColors: [[233, 78, 119], [255, 182, 193], [143, 191, 115], [255, 201, 120], [140, 120, 230]],
        blend: "source-over",
        tapSparks: false,
        ripple: false,
        tilt: false
    }
}

let started = false

export function startEffects(themeName = "noir") {
    if (started) return
    started = true
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const preset = PRESETS[themeName] || PRESETS.noir
    const pick = (list) => list[Math.floor(Math.random() * list.length)]

    const canvas = document.createElement("canvas")
    canvas.className = `${themeName}-fx-canvas`
    document.body.appendChild(canvas)
    const ctx = canvas.getContext("2d")

    let w = 0
    let h = 0

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        w = window.innerWidth
        h = window.innerHeight
        canvas.width = w * dpr
        canvas.height = h * dpr
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize)

    const newDust = (anywhere) => ({
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : h + 10,
        r: 0.6 + Math.random() * 1.8,
        vy: 0.12 + Math.random() * 0.35,
        vx: (Math.random() - 0.5) * 0.15,
        a: 0.2 + Math.random() * 0.5,
        tw: Math.random() * Math.PI * 2,
        c: pick(preset.dustColors)
    })

    const dust = Array.from({ length: preset.dustCount }, () => newDust(true))
    const sparks = []
    let glow = null

    function burst(x, y, count = 18, power = 1) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2
            const speed = (1.2 + Math.random() * 3.6) * power
            sparks.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.2 * power,
                life: 1,
                decay: 0.01 + Math.random() * 0.018,
                r: 1 + Math.random() * 2.6,
                c: pick(preset.sparkColors)
            })
        }
    }

    function frame() {
        ctx.clearRect(0, 0, w, h)
        ctx.globalCompositeOperation = preset.blend

        if (glow) {
            const g = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, 240)
            g.addColorStop(0, `rgba(216, 173, 98, ${0.22 * glow.life})`)
            g.addColorStop(1, "rgba(216, 173, 98, 0)")
            ctx.fillStyle = g
            ctx.fillRect(glow.x - 240, glow.y - 240, 480, 480)
            glow.life -= 0.02
            if (glow.life <= 0) glow = null
        }

        for (let i = 0; i < dust.length; i++) {
            const d = dust[i]
            d.tw += 0.02
            d.x += d.vx + Math.sin(d.tw) * 0.12
            d.y -= d.vy
            if (d.y < -10) dust[i] = newDust(false)
            const alpha = d.a * (0.55 + 0.45 * Math.sin(d.tw * 2))
            const [r, g, b] = d.c
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.18})`
            ctx.beginPath()
            ctx.arc(d.x, d.y, d.r * 3.2, 0, Math.PI * 2)
            ctx.fill()
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
            ctx.beginPath()
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
            ctx.fill()
        }

        for (let i = sparks.length - 1; i >= 0; i--) {
            const s = sparks[i]
            s.vx *= 0.975
            s.vy = s.vy * 0.975 + 0.07
            s.x += s.vx
            s.y += s.vy
            s.life -= s.decay
            if (s.life <= 0) {
                sparks.splice(i, 1)
                continue
            }
            const [r, g, b] = s.c
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${s.life})`
            ctx.beginPath()
            ctx.arc(s.x, s.y, s.r * s.life + 0.3, 0, Math.PI * 2)
            ctx.fill()
        }

        requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)

    function ripple(x, y) {
        const el = document.createElement("span")
        el.className = `${themeName}-ripple`
        el.style.left = `${x}px`
        el.style.top = `${y}px`
        el.addEventListener("animationend", () => el.remove())
        document.body.appendChild(el)
    }

    // הטיה תלת-ממדית של הכרטיס שמתחת לאצבע
    let tilted = null

    function resetTilt() {
        if (!tilted) return
        tilted.classList.remove("is-tilting")
        tilted.style.removeProperty("--rx")
        tilted.style.removeProperty("--ry")
        tilted = null
    }

    function tilt(e) {
        const card = e.target.closest?.(TILT_SELECTOR)
        if (card !== tilted) resetTilt()
        if (!card) return
        const r = card.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        card.style.setProperty("--rx", `${(0.5 - py) * 12}deg`)
        card.style.setProperty("--ry", `${(px - 0.5) * 12}deg`)
        card.style.setProperty("--mx", `${px * 100}%`)
        card.style.setProperty("--my", `${py * 100}%`)
        card.classList.add("is-tilting")
        tilted = card
    }

    document.addEventListener("pointerdown", (e) => {
        if (preset.tapSparks) {
            burst(e.clientX, e.clientY)
            glow = { x: e.clientX, y: e.clientY, life: 1 }
        }
        if (preset.ripple) ripple(e.clientX, e.clientY)
        if (preset.tilt) tilt(e)
    }, { passive: true })

    if (preset.tilt) {
        document.addEventListener("pointermove", tilt, { passive: true })
        document.addEventListener("pointerup", () => setTimeout(resetTilt, 140), { passive: true })
        document.addEventListener("pointercancel", resetTilt, { passive: true })
        document.addEventListener("pointerleave", resetTilt, { passive: true })
    }

    function celebrate(power = 1.7) {
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                burst(w * (0.2 + Math.random() * 0.6), h * (0.25 + Math.random() * 0.35), 36, power)
            }, i * 180)
        }
    }

    // חגיגה רק ברגע מיוחד - כשמסך סיכום המנה מופיע
    // וגם כשההזמנה נשלחה בהצלחה
    let summaryShown = false
    let successShown = false
    new MutationObserver(() => {
        const summary = document.querySelector(".kiosk-summary-container")
        if (summary && !summaryShown) {
            summaryShown = true
            celebrate()
        } else if (!summary) {
            summaryShown = false
        }

        const popup = document.querySelector(".message-popup")
        const success = popup && popup.textContent.includes("בהצלחה")
        if (success && !successShown) {
            successShown = true
            celebrate(2)
        } else if (!success) {
            successShown = false
        }
    }).observe(document.body, { childList: true, subtree: true })
}
