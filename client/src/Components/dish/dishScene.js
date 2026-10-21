// "המוח" של התצוגה הוויזואלית: מקבל מוצר + בחירות ומחזיר סצנה -
// מה לצייר, באיזה צבע ובאיזה מיקום. אין כאן JSX, רק חישובים.
// כל המיקומים הם ביחידות של viewBox בגודל 400x400.

// ===== עזרים =====

function hash(str) {
    let h = 2166136261
    for (const ch of str) {
        h ^= ch.charCodeAt(0)
        h = Math.imul(h, 16777619)
    }
    return h >>> 0
}

// מספרים "אקראיים" קבועים - אותה תוספת תמיד תיפול באותם מקומות
export function seeded(seed) {
    let a = typeof seed === "number" ? seed : hash(String(seed))
    return () => {
        a = (a + 0x6d2b79f5) | 0
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

const r1 = n => Math.round(n * 10) / 10

const findRule = (rules, label) => rules.find(([key]) => label.includes(key))?.[1]

// הופך רשימת נקודות לקו חלק (Catmull-Rom)
function smooth(pts, closed = false) {
    if (pts.length < 2) return ""
    const at = i => closed ? pts[(i + pts.length) % pts.length] : pts[Math.max(0, Math.min(pts.length - 1, i))]
    const segments = closed ? pts.length : pts.length - 1
    let d = `M ${r1(pts[0][0])} ${r1(pts[0][1])}`
    for (let i = 0; i < segments; i++) {
        const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2)
        const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
        const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
        d += ` C ${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(p2[0])} ${r1(p2[1])}`
    }
    return closed ? d + " Z" : d
}

function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16)
    return [n >> 16, (n >> 8) & 255, n & 255]
}

export function mix(a, b, t) {
    const [ar, ag, ab] = hexToRgb(a)
    const [br, bg, bb] = hexToRgb(b)
    const c = [ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t]
    return "#" + c.map(v => Math.round(v).toString(16).padStart(2, "0")).join("")
}

// ===== סוג המנה =====

export function detectDish(product) {
    const name = `${product?.name || ""} ${product?.slug || ""}`
    if (name.includes("וופל")) return "waffle"
    if (name.includes("קרפ")) return "crepe"
    if (name.includes("פנקייק")) return "pancake"
    if (name.includes("שייק")) return "shake"
    if (name.includes("גלידה")) return "icecream"
    return "plate"
}

// ===== מילונים: שם רכיב -> איך הוא נראה =====
// הסדר חשוב: "תות בננה" לפני "תות", "שוקולד לבן" לפני "שוקולד"

export const SCOOP_FLAVORS = [
    ["תות בננה", { base: "#f7b8c4", shade: "#e48ea2", specks: "#f4d35e", speckCount: 10 }],
    ["אוראו", { base: "#efe9df", shade: "#cfc5b6", specks: "#2a2320", speckCount: 16, chunky: true }],
    ["לוטוס", { base: "#ebc794", shade: "#c99659", specks: "#9a5b26", speckCount: 12, chunky: true }],
    ["ריבת חלב", { base: "#e3b077", shade: "#bd7f3f", swirl: "#8f4f1a" }],
    ["פסיפלורה", { base: "#ffd45f", shade: "#efa62c", specks: "#2b2018", speckCount: 10 }],
    ["פירות יער", { base: "#b4588d", shade: "#7d2f62", specks: "#4b1a3a", speckCount: 10 }],
    ["שוקולד", { base: "#7a442b", shade: "#4a2516", specks: "#3a1b0e", speckCount: 0 }],
    ["וניל", { base: "#f9eecd", shade: "#e5cf96", specks: "#3a2a1a", speckCount: 9, tiny: true }],
    ["תות", { base: "#f7a3b6", shade: "#e0718c", specks: "#c62f52", speckCount: 9 }],
]
const DEFAULT_FLAVOR = { base: "#f3d9c4", shade: "#d9b393", specks: "#9a6a4a", speckCount: 6 }

export const flavorOf = label => findRule(SCOOP_FLAVORS, label) || DEFAULT_FLAVOR

export const SYRUPS = [
    ["שוקולד לבן", { color: "#f7efe0", gloss: "#ffffff", edge: "#d6c19b" }],
    ["שוקולד", { color: "#40200f", gloss: "#8f5638", edge: "#251006" }],
    ["מייפל", { color: "#b9671d", gloss: "#f2b56a", edge: "#80420e" }],
    ["פיסטוק", { color: "#9fb85e", gloss: "#dbe9a4", edge: "#6b8634" }],
    ["קרמל", { color: "#c47a2c", gloss: "#f5c27a", edge: "#8a4f14" }],
]
export const syrupOf = label => findRule(SYRUPS, label) || { color: "#c0392b", gloss: "#f08a7e", edge: "#7d1f15" }

export const FRUITS = [
    // strength = כמה הפרי "צובע" שייק טחון (פירות אדומים/סגולים שולטים)
    ["מנגו", { color: "#ffb21f", type: "mango", strength: 1.4 }],
    ["פסיפלורה", { color: "#f7c534", type: "passion", strength: 1 }],
    ["קיווי", { color: "#8cc63f", type: "kiwi", strength: 0.6 }],
    ["בננה", { color: "#f6e27e", type: "banana", strength: 0.35 }],
    ["תות", { color: "#e8435c", type: "strawberry", strength: 2.4 }],
    ["אפרסק", { color: "#ffaa76", type: "peach", strength: 1 }],
    ["אוכמניות", { color: "#7a3f8f", type: "blueberry", strength: 3 }],
]
export const fruitOf = label => findRule(FRUITS, label) || { color: "#f29b7d", type: "peach" }

export const LIQUIDS = [
    ["חלב", { type: "milk", color: "#fff6ea", mixWith: "#fff4e6", amount: 0.45 }],
    ["תפוז", { type: "oj", color: "#ffa634", mixWith: "#ffa133", amount: 0.28 }],
    ["מים", { type: "water", color: "#e4f2f8", mixWith: "#ffffff", amount: 0.18 }],
]
export const liquidOf = label => findRule(LIQUIDS, label) || LIQUIDS[2][1]

// type = איזה ציור, count = כמה חתיכות מפזרים, scale = גודל, rot = כמה מותר לסובב
export const TOPPINGS = [
    ["בייגלה", { type: "pretzel", count: 6, scale: 1.25, rot: 180 }],
    ["ציפס", { type: "chips", count: 16, scale: 1, rot: 25 }],
    ["מקופלת", { type: "flake", count: 9, scale: 1.2, rot: 180 }],
    ["פקאן", { type: "pecan", count: 7, scale: 1.2, rot: 180 }],
    ["אוראו", { type: "oreo", count: 10, scale: 1.15, rot: 180 }],
    ["עדשים", { type: "lentils", count: 14, scale: 1, rot: 180 }],
    ["סוכריות", { type: "sprinkles", count: 28, scale: 1, rot: 180 }],
    ["מרשמלו", { type: "marshmallow", count: 9, scale: 1.1, rot: 30 }],
    ["אוכמניות", { type: "blueberry", count: 10, scale: 1.15, rot: 180 }],
    ["חתיכות תות", { type: "strawberryBits", count: 10, scale: 1.1, rot: 180 }],
    ["תות", { type: "strawberry", count: 6, scale: 1.3, rot: 40 }],
    ["שקדים", { type: "almond", count: 10, scale: 1, rot: 180 }],
    ["קליק", { type: "click", count: 13, scale: 1, rot: 0 }],
    ["קוקוס", { type: "coconut", count: 18, scale: 1, rot: 180 }],
    ["צימוקים", { type: "raisin", count: 10, scale: 1, rot: 180 }],
    ["אפרסק", { type: "peach", count: 6, scale: 1.2, rot: 50 }],
    ["מנגו", { type: "mango", count: 9, scale: 1.1, rot: 20 }],
    ["שוקולד", { type: "chunk", count: 9, scale: 1.1, rot: 40 }],
]
export const toppingOf = label => findRule(TOPPINGS, label) || { type: "generic", count: 10, scale: 1, rot: 0 }

// ===== סיווג: לאיזו "שכבה" שייכת כל בחירה =====

export function classify(option, step, dish) {
    const label = (option?.label || "").trim()
    const title = step?.title || ""

    if (label.startsWith("סירופ") || title.includes("סירופ")) return "syrup"
    if (dish === "shake") {
        if (title.includes("פירות")) return "fruit"
        if (title.includes("נוזל") || title.includes("בסיס")) return "liquid"
    }
    const scoopStep = title.includes("גלידה") || title.includes("טעמ")
    if (label.includes("קצפת")) return scoopStep ? "whip" : "whipTop"
    if (scoopStep) return "scoop"
    return "topping"
}

// ===== גאומטריה של כל מנה =====

const SURFACES = {
    waffle: { cx: 200, cy: 246, rx: 104, ry: 40 },
    pancake: { cx: 200, cy: 226, rx: 96, ry: 35 },
    crepe: { cx: 200, cy: 284, rx: 104, ry: 24 },
    plate: { cx: 200, cy: 292, rx: 120, ry: 32 },
}

// היכן יושב כדור הגלידה על מנה שאינה גביע
const SCOOP_SPOT = {
    waffle: { x: 236, y: 226, r: 46 },
    pancake: { x: 230, y: 206, r: 44 },
    crepe: { x: 218, y: 268, r: 44 },
    plate: { x: 200, y: 268, r: 46 },
}

// כדורים בגביע לפי כמות
const CUP_SCOOPS = {
    1: [[200, 206]],
    2: [[166, 216], [234, 216]],
    3: [[152, 220], [248, 220], [200, 178]],
    4: [[140, 224], [260, 224], [200, 230], [200, 180]],
}
export const CUP = { cx: 200, rimY: 236, rx: 112, ry: 22 }

// כוס השייק
export const GLASS = { top: 78, bottom: 336, topHalf: 74, bottomHalf: 50, liquidTop: 120 }
export const glassHalfWidth = y =>
    GLASS.topHalf - (y - GLASS.top) * ((GLASS.topHalf - GLASS.bottomHalf) / (GLASS.bottom - GLASS.top))

// עובי צד הבסיס - לשם נוזלות טיפות הסירופ
const EDGES = {
    waffle: { cx: 200, cy: 246, rx: 136, ry: 56, drop: [6, 15] },
    pancake: { cx: 200, cy: 226, rx: 124, ry: 48, drop: [10, 26] },
    crepe: null,
    plate: null,
}

function pointInEllipse(rand, s) {
    const a = rand() * Math.PI * 2
    const k = Math.sqrt(rand())
    return [s.cx + Math.cos(a) * s.rx * k, s.cy + Math.sin(a) * s.ry * k]
}

// נקודה על החלק העליון של אחד הכדורים
function pointOnScoops(rand, scoops) {
    const sc = scoops[Math.floor(rand() * scoops.length)]
    const a = (-165 + rand() * 150) * Math.PI / 180
    const d = sc.r * (0.25 + rand() * 0.55)
    return [sc.x + Math.cos(a) * d, sc.y - sc.r * 0.15 + Math.sin(a) * d * 0.85]
}

// הגובה העליון של ערמת הכדורים בנקודה x (בשביל סירופ שזורם עליהם)
function scoopsTopAt(x, scoops) {
    let best = null
    for (const sc of scoops) {
        const dx = x - sc.x
        if (Math.abs(dx) < sc.r * 0.95) {
            const y = sc.y - sc.r * 0.8 * Math.sqrt(1 - (dx / sc.r) ** 2)
            if (best === null || y < best) best = y
        }
    }
    return best
}

// ===== בניית הסצנה =====

export function buildScene(product, selections) {
    const dish = detectDish(product)
    const steps = product?.steps || []

    const items = steps.flatMap((step, stepIndex) =>
        (selections?.[stepIndex] || []).filter(Boolean).map(option => ({
            key: `${stepIndex}-${option.label}`,
            label: option.label.trim(),
            stepIndex,
            kind: classify(option, step, dish),
        }))
    )
    const ofKind = (...kinds) => items.filter(i => kinds.includes(i.kind))

    const scene = {
        dish,
        scoops: [],
        spreads: [],
        toppings: [],
        syrups: [],
        layers: [],
        floaters: [],
        garnishes: [],
        liquid: null,
        items,
    }

    // ----- כדורי גלידה / קצפת -----
    const scoopItems = ofKind("scoop", "whip")
    if (dish === "icecream") {
        const list = scoopItems.slice(0, 4)
        const spots = CUP_SCOOPS[list.length] || []
        const r = [0, 56, 50, 44, 44][list.length]
        list.forEach((it, i) => scene.scoops.push({
            ...it, x: spots[i][0], y: spots[i][1], r,
            whip: it.kind === "whip",
            flavor: flavorOf(it.label),
        }))
    } else if (dish !== "shake") {
        const spot = SCOOP_SPOT[dish]
        scoopItems.forEach((it, i) => scene.scoops.push({
            ...it, x: spot.x - i * 64, y: spot.y + i * 6, r: spot.r,
            whip: it.kind === "whip",
            flavor: flavorOf(it.label),
        }))
    }

    // קצפת שנבחרה כתוספת - ערימה מעל הכל
    ofKind("whipTop").forEach(it => {
        let spot
        if (dish === "shake") spot = { x: 200, y: GLASS.liquidTop - 4, r: 40 }
        else if (scene.scoops.length) {
            const top = scene.scoops.reduce((a, b) => (b.y < a.y ? b : a))
            spot = { x: top.x, y: top.y - top.r * 0.72, r: top.r * 0.68 }
        } else if (dish === "icecream") spot = { x: 200, y: 226, r: 46 }
        else spot = { x: 168, y: SURFACES[dish].cy - 6, r: 40 }
        scene.scoops.push({ ...it, ...spot, whip: true, flavor: null })
    })

    // ----- ממרח -----
    if (SURFACES[dish]) {
        const s = SURFACES[dish]
        ofKind("spread").forEach(it => {
            const rand = seeded(it.key + dish)
            const pts = Array.from({ length: 16 }, (_, i) => {
                const a = (i / 16) * Math.PI * 2
                const k = 0.82 + rand() * 0.2
                return [s.cx + Math.cos(a) * s.rx * k, s.cy + Math.sin(a) * s.ry * k]
            })
            const gloss = Array.from({ length: 10 }, (_, i) => {
                const a = (i / 10) * Math.PI * 2
                const k = 0.32 + rand() * 0.08
                return [s.cx - s.rx * 0.25 + Math.cos(a) * s.rx * k, s.cy - s.ry * 0.3 + Math.sin(a) * s.ry * k * 0.6]
            })
            scene.spreads.push({ ...it, d: smooth(pts, true), gloss: smooth(gloss, true) })
        })
    }

    // ----- שייק: שכבות פירות + בסיס נוזלי -----
    if (dish === "shake") {
        const base = ofKind("liquid")[0]
        const liquid = base ? liquidOf(base.label) : null
        const fruits = ofKind("fruit")
        const tint = color => liquid ? mix(color, liquid.mixWith, liquid.amount) : mix(color, "#ffffff", 0.1)

        const layerItems = fruits.length
            ? fruits.map(f => ({ ...f, color: tint(fruitOf(f.label).color) }))
            : base ? [{ ...base, key: "liquid-only", color: liquid.color }] : []

        const total = GLASS.bottom - GLASS.liquidTop
        const h = layerItems.length ? total / layerItems.length : 0
        layerItems.forEach((l, i) => {
            scene.layers.push({ ...l, y: GLASS.bottom - (i + 1) * h, h })
        })
        scene.liquid = layerItems.length
            ? { top: GLASS.liquidTop, topColor: mix(layerItems[layerItems.length - 1].color, "#ffffff", 0.25), type: liquid?.type || null }
            : null

        // פירות על שפת הכוס + חתיכות שצפות בתוך השכבה שלהן
        const rimSpots = [[270, 84, 28], [130, 86, -28], [240, 72, 12], [162, 72, -14], [200, 68, 0], [286, 108, 40], [114, 110, -40]]
        fruits.forEach((f, i) => {
            const info = fruitOf(f.label)
            const [x, y, rot] = rimSpots[i % rimSpots.length]
            scene.garnishes.push({ ...f, type: info.type, x, y, rot, s: 2.1 })
            const layer = scene.layers[i]
            const rand = seeded(f.key + "float")
            for (let k = 0; k < 3; k++) {
                const fy = layer.y + layer.h * (0.25 + rand() * 0.5)
                const half = glassHalfWidth(fy) - 14
                scene.floaters.push({
                    key: `${f.key}-fl${k}`, type: info.type,
                    x: 200 - half + rand() * half * 2, y: fy, rot: rand() * 360, s: 1.2,
                    delay: 200 + k * 90,
                })
            }
        })
    }

    // ----- תוספות מפוזרות -----
    const scoopBodies = scene.scoops.filter(s => s.kind !== "whipTop")
    const scatterPoint = (rand) => {
        if (dish === "icecream") {
            const bodies = scene.scoops.filter(s => s.kind === "scoop" || s.kind === "whip")
            return bodies.length
                ? pointOnScoops(rand, bodies)
                : pointInEllipse(rand, { cx: CUP.cx, cy: CUP.rimY, rx: 86, ry: 14 })
        }
        if (dish === "shake") {
            return pointInEllipse(rand, { cx: 200, cy: GLASS.liquidTop - 3, rx: 54, ry: 7 })
        }
        return pointInEllipse(rand, SURFACES[dish])
    }
    ofKind("topping").forEach(it => {
        const spec = toppingOf(it.label)
        const rand = seeded(it.key + dish)
        const small = dish === "icecream" || dish === "shake"
        const count = Math.max(4, Math.round(spec.count * (small ? 0.65 : 1)))
        const pieces = Array.from({ length: count }, (_, i) => {
            const [x, y] = scatterPoint(rand)
            return {
                x, y,
                rot: (rand() * 2 - 1) * spec.rot,
                s: spec.scale * (0.85 + rand() * 0.3) * (dish === "shake" ? 0.85 : 1),
                delay: Math.round(i * 38 + rand() * 120),
                v: Math.floor(rand() * 1000),
            }
        }).sort((a, b) => a.y - b.y)
        const cx = pieces.reduce((s, p) => s + p.x, 0) / pieces.length
        const cy = pieces.reduce((s, p) => s + p.y, 0) / pieces.length
        scene.toppings.push({ ...it, type: spec.type, pieces, center: [cx, cy] })
    })

    // ----- סירופים -----
    ofKind("syrup").forEach((it, idx) => {
        const rand = seeded(it.key + dish)
        const colors = syrupOf(it.label)
        let pts = []
        const drips = []
        const streaks = []

        if (dish === "icecream" && scoopBodies.length) {
            const minX = Math.min(...scoopBodies.map(s => s.x - s.r)) + 10
            const maxX = Math.max(...scoopBodies.map(s => s.x + s.r)) - 10
            const n = 9
            for (let i = 0; i <= n; i++) {
                const x = minX + ((maxX - minX) * i) / n + (rand() - 0.5) * 8
                const top = scoopsTopAt(x, scoopBodies) ?? CUP.rimY
                const y = top + (i % 2 ? 16 + rand() * 8 : 5 + rand() * 5) + idx * 5
                pts.push([x, y])
            }
            for (let k = 0; k < 4; k++) {
                const sc = scoopBodies[Math.floor(rand() * scoopBodies.length)]
                const x = sc.x + (rand() - 0.5) * sc.r * 1.1
                const top = scoopsTopAt(x, [sc]) ?? sc.y
                drips.push({ x, y: top + 14, len: 14 + rand() * 18, delay: k * 120 })
            }
        } else if (dish === "shake") {
            const s = { cx: 200, cy: GLASS.liquidTop - 2, rx: 52, ry: 7 }
            for (let i = 0; i <= 6; i++) {
                const x = s.cx - s.rx + (s.rx * 2 * i) / 6
                pts.push([x, s.cy + (i % 2 ? 1 : -1) * s.ry * 0.7])
            }
            // פסים של סירופ שזולגים על דפנות הכוס מבפנים
            for (let k = 0; k < 6; k++) {
                const left = k % 2 === 0
                const y0 = GLASS.top + 6
                const len = 70 + rand() * 140
                const line = []
                for (let y = y0; y <= y0 + len; y += 18) {
                    const half = glassHalfWidth(y) - 6 - Math.floor(k / 2) * 9
                    line.push([200 + (left ? -half : half) + (rand() - 0.5) * 4, y])
                }
                streaks.push(smooth(line))
            }
        } else {
            const s = SURFACES[dish] || SURFACES.plate
            const n = 9
            const tilt = (rand() - 0.5) * 0.5
            for (let i = 0; i <= n; i++) {
                const x = s.cx - s.rx * 0.9 + (s.rx * 1.8 * i) / n + (rand() - 0.5) * 10
                const span = s.ry * Math.sqrt(Math.max(0, 1 - ((x - s.cx) / s.rx) ** 2))
                const y = s.cy + (i % 2 ? 1 : -1) * span * (0.6 + rand() * 0.3) + (x - s.cx) * tilt * 0.3
                pts.push([x, y])
            }
            const e = EDGES[dish]
            if (e) {
                for (let k = 0; k < 4; k++) {
                    const x = e.cx + (rand() - 0.5) * e.rx * 1.3
                    const y = e.cy + e.ry * Math.sqrt(Math.max(0, 1 - ((x - e.cx) / e.rx) ** 2)) - 3
                    drips.push({ x, y, len: e.drop[0] + rand() * (e.drop[1] - e.drop[0]), delay: k * 140 })
                }
            }
        }

        scene.syrups.push({ ...it, ...colors, d: smooth(pts), drips, streaks })
    })

    return scene
}

// ===== אייקון בודד לכרטיס אופציה =====

export function describeOption(option, step, product) {
    const dish = detectDish(product)
    const kind = classify(option, step, dish)
    const label = (option?.label || "").trim()
    switch (kind) {
        case "scoop": return { kind, flavor: flavorOf(label) }
        case "whip":
        case "whipTop": return { kind: "whip" }
        case "syrup": return { kind, ...syrupOf(label) }
        case "fruit": return { kind, ...fruitOf(label) }
        case "liquid": return { kind, ...liquidOf(label) }
        case "spread": return { kind }
        default: return { kind: "topping", ...toppingOf(label) }
    }
}
