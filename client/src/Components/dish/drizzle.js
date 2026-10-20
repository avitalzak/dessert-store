// זילוף סירופ מצויר: קו "יד חופשית" הלוך-חזור על פני המנה, עם טפטופים מעבר לשוליים.
// כל הקואורדינטות כאן ביחידות SVG: רוחב המסגרת = 1000, הגובה = 1000 / aspect.

import { seeded } from "./dishScene"

// מראה כל סירופ: גוף, שוליים כהים, ליבה בהירה (שקיפות/עומק) וברק
export const SYRUP_LOOKS = [
    ["שוקולד לבן", { color: "#f6efe0", edge: "#c8b48f", core: "#fffaf0", opacity: 1 }],
    ["שוקולד", { color: "#3d1c0c", edge: "#200c03", core: "#6b3a1f", opacity: 1 }],
    ["מייפל", { color: "#b25d0e", edge: "#7a3a05", core: "#efa448", opacity: 0.9 }],
    ["פיסטוק", { color: "#b5bf5c", edge: "#7f8833", core: "#d9e08e", opacity: 1 }],
    ["קרמל", { color: "#c07a2c", edge: "#86500f", core: "#eab06a", opacity: 0.95 }],
]
export const syrupLook = label => SYRUP_LOOKS.find(([k]) => label.includes(k))?.[1] || SYRUP_LOOKS[1][1]

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const f = n => n.toFixed(1)

// קו חלק שעובר דרך כל הנקודות (Catmull-Rom -> בזייה)
export function smoothPath(pts) {
    if (pts.length < 2) return ""
    let d = `M${f(pts[0][0])} ${f(pts[0][1])}`
    for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2
        const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
        const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
        d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`
    }
    return d
}

// syrup: { key, area: {cx, cy, rx, ry}, edge?: {...}, drip, angle } - שברים מהמסגרת
export function buildDrizzle(syrup, aspect) {
    const rand = seeded("drizzle-" + syrup.key)
    const H = 1000 / aspect
    const toUnits = a => a && { cx: a.cx * 1000, cy: a.cy * H, rx: a.rx * 1000, ry: a.ry * H }
    const A = toUnits(syrup.area)
    const E = toUnits(syrup.edge) || A

    const width = clamp(A.rx * 0.06, 10, 15)
    const passes = clamp(Math.round(A.rx / 34), 4, 9)
    const angle = syrup.angle + (rand() - 0.5) * 0.25
    const cos = Math.cos(angle), sin = Math.sin(angle)
    // מהמישור של פני המנה (עיגול יחידה) אל המסך, כולל הסיבוב וה"השטחה" של הזווית
    const toScreen = ([u, v]) => {
        const ru = u * cos - v * sin, rv = u * sin + v * cos
        return [A.cx + ru * A.rx, A.cy + rv * A.ry]
    }

    // הלוך-חזור: כל מעבר חוצה את פני המנה, והקצוות מתחברים בפניות עגולות
    const plane = []
    const turns = []
    for (let i = 0; i < passes; i++) {
        const v = -0.8 + (1.6 * i) / (passes - 1) + (rand() - 0.5) * 0.1
        const half = Math.sqrt(Math.max(0, 1 - v * v))
        const from = -half * (0.8 + rand() * 0.15), to = half * (0.8 + rand() * 0.15)
        const [a, b] = i % 2 ? [to, from] : [from, to]
        const steps = 4
        for (let k = 0; k <= steps; k++) {
            const t = k / steps
            // קצת גלי, וקצת "בטן" באמצע, כמו קו שנשפך מהיד
            const wob = k === 0 || k === steps ? 0 : (rand() - 0.5) * 0.06
            plane.push([a + (b - a) * t, v + wob + Math.sin(t * Math.PI) * 0.03])
        }
        turns.push(plane[plane.length - 1], plane[plane.length - 1 - steps])
    }
    const pts = plane.map(toScreen)

    // טפטופים: מהפניות שבחלק הקדמי, דרך שפת המנה ולמטה
    const drips = []
    if (syrup.drip > 0) {
        const front = turns
            .map(p => ({ p, s: toScreen(p) }))
            .filter(({ s }) => s[1] > A.cy + A.ry * 0.15)
            .sort(() => rand() - 0.5)
            .slice(0, 2 + Math.floor(rand() * 2))
        for (const { s } of front) {
            const a = Math.atan2((s[1] - A.cy) / A.ry, (s[0] - A.cx) / A.rx)
            const rim = [E.cx + Math.cos(a) * E.rx, E.cy + Math.sin(a) * E.ry]
            const len = syrup.drip * H * (0.5 + rand() * 0.7)
            const sway = (rand() - 0.5) * width
            const end = [rim[0] + sway, rim[1] + len]
            drips.push({
                d: smoothPath([s, [(s[0] + rim[0]) / 2, (s[1] + rim[1]) / 2 + width * 0.3], rim, [rim[0] + sway * 0.4, rim[1] + len * 0.55], end]),
                end, r: width * (0.55 + rand() * 0.2),
            })
        }
    }

    return {
        d: smoothPath(pts), width, drips,
        start: pts[0], end: pts[pts.length - 1],
        // ברק: מקווקו לא סדיר, כדי שייראה כמו השתקפויות על סירופ מבריק
        gloss: `${f(width * 4)} ${f(width * 2.5)} ${f(width * 1.2)} ${f(width * 3)}`,
        viewBox: `0 0 1000 ${f(H)}`,
    }
}
