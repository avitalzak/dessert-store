// מנה "מצולמת": הרכבה של תמונות אמיתיות (גזורות, PNG שקוף) אחת על השנייה.
// התמונות והגדלים שלהן נמצאים ב-public/dish (נוצרים ע"י dish-photos/process.py).
// כל המיקומים כאן הם שברים (0-1) מרוחב/גובה התמונה של הבסיס.

import { useEffect, useState } from "react"
import { seeded, detectDish, classify, fruitOf, liquidOf, mix } from "./dishScene"

export const DISH_DIR = "/dish/"

// ----- טעינת ה-manifest פעם אחת לכל האתר -----
let manifestPromise = null
export function loadManifest() {
    manifestPromise ??= fetch(DISH_DIR + "manifest.json", { cache: "no-cache" })
        .then(r => (r.ok ? r.json() : {}))
        .catch(() => ({}))
    return manifestPromise
}

export function useManifest() {
    const [manifest, setManifest] = useState(null)
    useEffect(() => {
        let alive = true
        loadManifest().then(m => alive && setManifest(m))
        return () => { alive = false }
    }, [])
    return manifest
}

// ----- גאומטריה של כל בסיס מצולם (נמדד מהתמונה עצמה) -----
// perCm = איזה חלק מרוחב התמונה תופס סנטימטר אחד במציאות
// surface = האליפסה שעליה מפזרים תוספות, squash = כמה הזווית "משטיחה" דברים שטוחים
// toppingScale = כמה יותר חתיכות תוספת מפזרים (מנה גדולה = מנה נדיבה)
export const PHOTO_DISHES = {
    waffle: {
        kind: "plate", base: "waffle_base", perCm: 0.785 / 18, squash: 0.62, toppingScale: 1.7, drip: 0.03,
        surface: { cx: 0.5, cy: 0.41, rx: 0.33, ry: 0.28 },
        // הגלידה בצד הצלחת, ליד הוופל; כדור נוסף יורד לאורך שפת הצלחת
        scoop: { x: 0.8, y: 0.4, step: [-0.19, 0.06] },
    },
    pancake: {
        kind: "plate", base: "pancake_base", perCm: 1 / 26, squash: 0.6, toppingScale: 1.5, drip: 0.12,
        surface: { cx: 0.505, cy: 0.25, rx: 0.21, ry: 0.13 },
        // כל הפנקייק העליון (הסירופ מכסה אותו ונוזל במורד הערימה)
        syrupSurface: { cx: 0.5, cy: 0.29, rx: 0.27, ry: 0.2 },
        scoop: { x: 0.53, y: 0.31 },
    },
    crepe: {
        kind: "plate", base: "crepe_base", perCm: 1 / 26, squash: 0.6, toppingScale: 1.7,
        surface: { cx: 0.46, cy: 0.44, rx: 0.22, ry: 0.16 },
        // הגלידה בצד הצלחת, ליד הקרפ
        scoop: { x: 0.8, y: 0.38, step: [-0.17, 0.06] },
    },
    // גביע זכוכית: הכדורים יושבים בתוכו, והחלק הקדמי של הזכוכית עובר מעליהם
    // rim = אליפסת שפת הגביע (מרכז y וחצי-גובה)
    icecream: { kind: "cup", base: "icecream_cup", perCm: 1 / 12, squash: 0.6, rim: { cy: 0.18, ry: 0.155 }, padTop: 0.3 },
    // שייק בכוס: בשלבי הפירות והנוזל - כוס ריקה, הפירות נערמים בתחתיתה והנוזל נמזג מעליהם;
    // בשלב התוספות ובסיכום - הכל "נטחן" והכוס מלאה שייק בצבע הפירות
    shake: {
        kind: "shake", base: "shake_glass_empty", perCm: 0.1, squash: 0.5, padTop: 0.12,
        // פנים הכוס הריקה (פוליגון: למעלה-שמאל, למעלה-ימין, למטה-ימין, למטה-שמאל)
        inside: [[0.07, 0.12], [0.93, 0.12], [0.8, 0.9], [0.2, 0.9]],
        // דפנות הכוס (x של הדופן השמאלית בשני גבהים) ותחתית הפנים - בשביל הנוזל
        walls: { y0: 0.18, x0: 0.05, y1: 0.86, x1: 0.235 },
        floor: { cy: 0.82, ry: 0.05 },
        // יחס גובה/רוחב (בפיקסלים) של אליפסת פני הנוזל בזווית הצילום
        tilt: 0.5,
        final: { base: "shake_glass_full", perCm: 0.1, cmScale: 0.6, squash: 0.5, padTop: 0.12,
            glass: [[0.02, 0.05], [0.98, 0.05], [0.9, 0.97], [0.1, 0.97]],
            surface: { cx: 0.5, cy: 0.16, rx: 0.36, ry: 0.1 },
            rimSpot: { x: 0.9, y: 0.13 } },
    },
}

// ----- איזו תמונה מתאימה לאיזה רכיב (לפי שם, הסדר חשוב) -----
// cm = הגודל האמיתי של חתיכה טיפוסית, count = כמה חתיכות מפזרים
const TOPPING_PHOTOS = [
    ["בייגלה", { asset: "t_pretzel", cm: 4, count: 4 }],
    ["ציפס", { asset: "t_chocolate_chips", cm: 1.1, count: 14 }],
    ["מקופלת", { asset: "t_flake", cm: 3.2, count: 6 }],
    ["פקאן", { asset: "t_pecan", cm: 3, count: 6 }],
    ["אוראו", { asset: "t_oreo", cm: 3.6, count: 6 }],
    ["עדשים", { asset: "t_lentils", cm: 1.4, count: 10 }],
    ["סוכריות", { asset: "t_sprinkles", cm: 0.9, count: 22 }],
    ["מרשמלו", { asset: "t_marshmallow", cm: 1.7, count: 8 }],
    ["אוכמניות", { asset: "t_blueberries", cm: 1.5, count: 9 }],
    ["חתיכות תות", { asset: "t_strawberry_bits", cm: 1.6, count: 8 }],
    ["תות", { asset: "t_strawberry_halves", cm: 3.6, count: 5 }],
    ["שקדים", { asset: "t_almonds", cm: 2.3, count: 8 }],
    ["קליק", { asset: "t_click_balls", cm: 1.3, count: 10 }],
    ["קוקוס", { asset: "t_coconut", cm: 1.5, count: 14 }],
    ["צימוקים", { asset: "t_raisins", cm: 1.2, count: 10 }],
    ["אפרסק", { asset: "t_peach", cm: 4, count: 5 }],
    ["מנגו", { asset: "t_mango", cm: 1.9, count: 8 }],
    ["שוקולד", { asset: "t_chocolate_chunks", cm: 2.4, count: 6 }],
]
const SCOOP_PHOTOS = [
    ["תות בננה", "scoop_strawberry_banana"],
    ["אוראו", "scoop_oreo"],
    ["לוטוס", "scoop_lotus"],
    ["ריבת חלב", "scoop_dulce"],
    ["פסיפלורה", "scoop_passionfruit"],
    ["פירות יער", "scoop_berries"],
    ["שוקולד", "scoop_chocolate"],
    ["וניל", "scoop_vanilla"],
    ["תות", "scoop_strawberry"],
]
const FRUIT_PHOTOS = [
    ["מנגו", { asset: "t_mango", cm: 2.6, count: 4 }],
    ["פסיפלורה", { asset: "f_passionfruit", cm: 4.2, count: 2 }],
    ["קיווי", { asset: "f_kiwi", cm: 4, count: 3 }],
    ["בננה", { asset: "f_banana", cm: 3.2, count: 4 }],
    ["תות", { asset: "t_strawberry_halves", cm: 3.6, count: 3 }],
    ["אפרסק", { asset: "t_peach", cm: 4.2, count: 3 }],
    ["אוכמניות", { asset: "t_blueberries", cm: 1.6, count: 7 }],
]
const find = (rules, label) => rules.find(([k]) => label.includes(k))?.[1]

const median = arr => [...arr].sort((a, b) => a - b)[Math.floor(arr.length / 2)]

// האם יש למנה הזאת בסיס מצולם
export function photoDishFor(product, manifest) {
    const dish = detectDish(product)
    const conf = PHOTO_DISHES[dish]
    const hasBase = conf && (manifest?.[conf.base] || manifest?.[conf.final?.base])
    return hasBase ? { dish, conf } : null
}

// כל קבצי התמונות שהמוצר עשוי להשתמש בהם (בשביל טעינה מראש)
export function assetsForProduct(product, manifest) {
    const names = new Set()
    const dish = detectDish(product)
    const conf = PHOTO_DISHES[dish]
    if (conf) names.add(conf.base)
    if (conf?.final) names.add(conf.final.base)
    for (const step of product?.steps || []) {
        for (const o of step.options) {
            const label = o.label.trim()
            const kind = classify(o, step, dish)
            const name = kind === "syrup" ? null // סירופ מצויר בקוד, בלי תמונה
                : kind === "fruit" ? find(FRUIT_PHOTOS, label)?.asset
                : kind === "scoop" ? find(SCOOP_PHOTOS, label)
                : kind === "whip" || kind === "whipTop" ? "whipped_cream"
                : kind === "spread" ? "chocolate_spread"
                : find(TOPPING_PHOTOS, label)?.asset
            if (name) names.add(name)
        }
    }
    return [...names].flatMap(n => {
        const m = manifest?.[n]
        if (!m) return []
        return m.type === "pieces" ? m.pieces.map(p => p.file) : [m.file]
    })
}


// ----- בניית הסצנה -----

const CUP_SPOTS = {
    1: [[0.5, 0.36]],
    2: [[0.32, 0.37], [0.68, 0.37]],
    3: [[0.3, 0.38], [0.7, 0.38], [0.5, 0.2]],
    4: [[0.27, 0.39], [0.73, 0.39], [0.5, 0.42], [0.5, 0.2]],
}


// צבע השייק לפי הפירות והבסיס הנוזלי
function smoothieColor(fruits, liquidItem) {
    if (!fruits.length) return null
    const look = liquidItem ? liquidOf(liquidItem.label) : null
    // ממוצע משוקלל: פרי שצובע חזק (אוכמניות, תות) שולט על פרי חיוור (בננה), כמו בשייק אמיתי
    const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16))
    let sum = [0, 0, 0], total = 0
    fruits.forEach(f => {
        const { color, strength = 1 } = fruitOf(f.label)
        sum = sum.map((v, i) => v + rgb(color)[i] * strength)
        total += strength
    })
    const avg = "#" + sum.map(v => Math.round(v / total).toString(16).padStart(2, "0")).join("")
    return look ? mix(avg, look.mixWith, look.amount * 0.6) : avg
}

// איך כל נוזל נראה בתוך הכוס (צבע + כמה הוא אטום)
const LIQUID_LOOK = {
    milk: { color: "#fffaf2", opacity: 0.8 },
    oj: { color: "#ffa634", opacity: 0.62 },
    water: { color: "#bfe3f5", opacity: 0.42 },
}

// final = בשייק: להציג את הכוס המוכנה (אחרי הבלנדר) במקום הכוס עם הפירות והנוזל
export function buildPhotoScene(product, selections, manifest, { final = false } = {}) {
    const { dish, conf: dishConf } = photoDishFor(product, manifest)
    // שייק "טחון" = בשלב התוספות ובסיכום, או כשאין עדיין תמונה של כוס ריקה
    const isFinalShake = dish === "shake" && (final || !manifest[dishConf.base])
    const conf = isFinalShake ? { ...dishConf, ...dishConf.final, kind: "shakeFinal" } : dishConf
    const baseInfo = manifest[conf.base]
    const aspect = baseInfo.w / baseInfo.h // רוחב חלקי גובה

    const items = (product.steps || []).flatMap((step, stepIndex) =>
        (selections?.[stepIndex] || []).filter(Boolean).map(option => ({
            key: `${stepIndex}-${option.label}`,
            label: option.label.trim(),
            stepIndex,
            kind: classify(option, step, dish),
        }))
    )
    const ofKind = (...kinds) => items.filter(i => kinds.includes(i.kind))

    const scene = {
        aspect, base: baseInfo.file, padTop: conf.padTop || 0,
        spreads: [], toppings: [], syrups: [], scoops: [],
        front: null, tint: null, blended: false, liquid: null,
    }

    // גודל תמונה בודדת כשבר מרוחב (w) ומגובה (h) הבסיס
    const sizeOf = (info, cm, refPx) => {
        const f = (cm * conf.perCm) / refPx
        return { w: info.w * f, h: info.h * f * aspect }
    }

    // פיזור חתיכות כך שלא יעלו אחת על השנייה. pick(rand) מחזיר נקודה מועמדת
    const placed = []
    // spacing = כמה רווח לדרוש בין חתיכות (קטן = מותר לעלות קצת אחת על השנייה, כמו בערימה)
    const scatter = (it, spec, pick, { countScale = 1, spacing = 0.85 } = {}) => {
        const info = manifest[spec.asset]
        if (!info || info.type !== "pieces" || !info.pieces.length) return null
        const ref = median(info.pieces.map(p => Math.max(p.w, p.h)))
        // המיקומים קבועים לאורך כל הבנייה ובסיכום, כדי שתוספת שכבר נחתה לא "תקפוץ" למקום אחר.
        // רק בשייק המוכן (כוס אחרת לגמרי) מפזרים מחדש
        const rand = seeded(it.key + dish + (conf.kind === "shakeFinal" ? "f" : ""))
        const squash = conf.squash || 0.6
        const pieces = []
        const count = Math.max(2, Math.round(spec.count * countScale))
        for (let i = 0; i < count; i++) {
            const piece = info.pieces[(i + Math.floor(rand() * info.pieces.length)) % info.pieces.length]
            const size = sizeOf(piece, spec.cm * (conf.cmScale || 1) * (0.9 + rand() * 0.2), ref)
            const r = Math.max(size.w, size.h / aspect) / 2
            let best = null
            for (let t = 0; t < 40; t++) {
                const [x, y] = pick(rand, i, count)
                const clear = Math.min(1, ...placed.map(p => Math.hypot(p.x - x, (p.y - y) / aspect / squash) / ((p.r + r) * spacing)))
                if (!best || clear > best.clear) best = { x, y, clear }
                if (clear >= 1) break
            }
            placed.push({ x: best.x, y: best.y, r })
            pieces.push({
                file: piece.file, x: best.x, y: best.y, ...size,
                rot: Math.round((rand() * 2 - 1) * 28),
                delay: Math.round(i * 70 + rand() * 80),
            })
        }
        return { ...it, pieces }
    }
    const inEllipse = s => rand => {
        const a = rand() * Math.PI * 2
        const k = Math.sqrt(rand())
        return [s.cx + Math.cos(a) * s.rx * k, s.cy + Math.sin(a) * s.ry * k]
    }

    const addScoop = (it, x, y, cm) => {
        const name = it.kind === "scoop" ? find(SCOOP_PHOTOS, it.label) : "whipped_cream"
        const info = manifest[name]
        if (!info) return null
        const size = sizeOf(info, cm, Math.max(info.w, info.h))
        const sc = { ...it, file: info.file, x, y, ...size }
        scene.scoops.push(sc)
        return sc
    }

    // זילוף סירופ: area = האליפסה שעליה מזלפים, edge = שפת המנה (משם הטפטופים יורדים),
    // drip = אורך הטפטופים (שבר מגובה המסגרת). כל סירופ נוסף מזולף בזווית אחרת, כמו רשת
    const addSyrup = (it, idx, area, { edge = null, drip = 0 } = {}) => {
        scene.syrups.push({ ...it, area, edge, drip, angle: idx * 1.15 - 0.15 })
    }

    const scatterToppings = (pick, countScale) => {
        ofKind("topping").forEach(it => {
            const spec = find(TOPPING_PHOTOS, it.label)
            const tp = spec && scatter(it, spec, pick, { countScale })
            if (tp) scene.toppings.push(tp)
        })
    }

    // ===== מנה על צלחת: וופל / פנקייק / קרפ =====
    if (conf.kind === "plate") {
        const s = conf.surface
        ofKind("scoop", "whip", "whipTop").forEach((it, idx) => {
            const [dx, dy] = conf.scoop.step || [-0.2, 0.02]
            const sc = addScoop(it, conf.scoop.x + idx * dx, conf.scoop.y + idx * dy, it.kind === "scoop" ? 7 : 6.5)
            if (sc) placed.push({ x: sc.x, y: sc.y, r: sc.w / 2 })
        })
        ofKind("spread").forEach(it => {
            const info = manifest.chocolate_spread
            if (!info) return
            const w = s.rx * 2 * 0.95
            scene.spreads.push({ ...it, file: info.file, x: s.cx, y: s.cy, w, h: (info.h / info.w) * w * conf.squash * aspect })
        })
        scatterToppings(inEllipse(s), conf.toppingScale || 1)
        const ss = conf.syrupSurface || s
        ofKind("syrup").forEach((it, idx) => addSyrup(it, idx,
            { cx: ss.cx + 0.01, cy: ss.cy + 0.01, rx: ss.rx * 0.8, ry: ss.ry * 0.8 }, { edge: ss, drip: conf.drip || 0 }))
    }

    // ===== גביע גלידה =====
    if (conf.kind === "cup") {
        const flavors = ofKind("scoop", "whip").slice(0, 4)
        const spots = CUP_SPOTS[flavors.length] || []
        const cm = flavors.length <= 2 ? 6.5 : 5.6
        const bodies = flavors.map((it, i) => addScoop(it, spots[i][0], spots[i][1], cm)).filter(Boolean)
        // החלק הקדמי של הזכוכית עובר מעל תחתית הכדורים
        // הזכוכית הקדמית = כל מה שמתחת לקשת הקדמית של השפה
        const { cy, ry } = conf.rim
        const arc = Array.from({ length: 21 }, (_, i) => {
            const x = i / 20
            return [x, cy + ry * Math.sqrt(Math.max(0, 1 - (2 * x - 1) ** 2))]
        })
        scene.front = { file: baseInfo.file, points: [...arc, [1, 1], [0, 1]], opacity: 0.6 }
        const top = bodies.reduce((a, b) => (!a || b.y < a.y ? b : a), null)
        ofKind("whipTop").forEach(it => {
            if (top) addScoop(it, top.x, top.y - top.h * 0.6, 4.8)
            else addScoop(it, 0.5, 0.3, 6)
        })
        // תוספות: על החלק העליון של הכדורים
        const pick = bodies.length
            ? rand => {
                const b = bodies[Math.floor(rand() * bodies.length)]
                const a = rand() * Math.PI * 2
                const k = Math.sqrt(rand())
                return [b.x + Math.cos(a) * b.w * 0.3 * k, b.y - b.h * 0.5 + Math.sin(a) * b.h * 0.2 * k]
            }
            : inEllipse({ cx: 0.5, cy: conf.rim.cy + 0.05, rx: 0.3, ry: 0.08 })
        scatterToppings(pick, 0.6)
        if (bodies.length) {
            const minX = Math.min(...bodies.map(b => b.x - b.w / 2))
            const maxX = Math.max(...bodies.map(b => b.x + b.w / 2))
            // על הכיפה של הכדורים (העוגן של כדור = 82% מגובהו), עם טפטופים שנוזלים במורד הכדור
            const h = Math.max(...bodies.map(b => b.h))
            const y = Math.min(...bodies.map(b => b.y - b.h * 0.6))
            const rx = (maxX - minX) * 0.36, ry = h * 0.17
            const area = { cx: (minX + maxX) / 2, cy: y, rx, ry }
            ofKind("syrup").forEach((it, idx) => addSyrup(it, idx, area,
                { edge: { ...area, rx: rx * 1.2, ry: ry * 1.4 }, drip: h * 0.3 }))
        }
    }

    // ===== שייק בבנייה: כוס ריקה, הפירות נערמים בתחתית =====
    if (conf.kind === "shake") {
        const [tl, tr, br, bl] = conf.inside
        const halfAt = y => {
            const t = (bl[1] - y) / (bl[1] - tl[1])
            const left = bl[0] + (tl[0] - bl[0]) * t
            const right = br[0] + (tr[0] - br[0]) * t
            return { mid: (left + right) / 2, half: (right - left) / 2 }
        }
        let pile = 0
        ofKind("fruit").forEach(it => {
            const spec = find(FRUIT_PHOTOS, it.label)
            if (!spec) return
            const start = pile
            const tp = scatter(it, { ...spec, cm: spec.cm * 0.75 }, (rand, i) => {
                const y = bl[1] - 0.05 - (start + i) * 0.014 - rand() * 0.03
                const { mid, half } = halfAt(y)
                const g = (rand() + rand() + rand()) / 1.5 - 1
                return [mid + g * half * 0.7, y]
            }, { spacing: 0.45 })
            if (tp) {
                pile += tp.pieces.length
                scene.toppings.push(tp)
            }
        })

        // הבסיס הנוזלי: נמזג לכוס ומכסה את הפירות, עם פני נוזל קצת מעל הערימה
        const liquidItem = ofKind("liquid")[0]
        if (liquidItem) {
            const look = LIQUID_LOOK[liquidOf(liquidItem.label).type] || LIQUID_LOOK.water
            const { walls: w, floor } = conf
            const wallAt = y => w.x0 + (w.x1 - w.x0) * (y - w.y0) / (w.y1 - w.y0) + 0.02
            const pileTop = Math.min(floor.cy, ...scene.toppings.flatMap(tp => tp.pieces.map(p => p.y - p.h / 2)))
            const cy = Math.max(0.3, Math.min(0.4, pileTop - 0.08))
            const rx = 0.5 - wallAt(cy)
            const ry = rx * conf.tilt * aspect
            const fx = 0.5 - wallAt(floor.cy)
            // קו המתאר: חצי האליפסה האחורי של פני הנוזל, הדפנות, וחצי האליפסה הקדמי של התחתית
            const arc = (cx, cy, rx, ry, from, to) => Array.from({ length: 17 }, (_, i) => {
                const a = from + (to - from) * i / 16
                return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]
            })
            scene.liquid = {
                key: liquidItem.key, label: liquidItem.label, stepIndex: liquidItem.stepIndex,
                ...look,
                top: mix(look.color, "#ffffff", 0.35),
                surface: { cx: 0.5, cy, rx, ry },
                points: [...arc(0.5, cy, rx, ry, Math.PI, 2 * Math.PI), ...arc(0.5, floor.cy, fx, floor.ry, 0, Math.PI)],
            }
            // תוספות צפות על פני הנוזל (אם יש כאלה לפני שהכל נטחן)
            const floats = { cx: 0.5, cy, rx: rx * 0.75, ry: ry * 0.6 }
            const before = scene.toppings.length
            scatterToppings(inEllipse(floats), 0.5)
            scene.toppings.slice(before).forEach(tp => { tp.float = true })
            ofKind("syrup").forEach((it, idx) => addSyrup(it, idx, { cx: 0.5, cy, rx: rx * 0.7, ry: ry * 0.7 }))
        }

        // הזכוכית הקדמית מעל הפירות, כדי שייראו בתוך הכוס
        scene.front = { file: baseInfo.file, points: null, opacity: 0.45 }
    }

    // ===== שייק מוכן בכוס =====
    if (conf.kind === "shakeFinal") {
        scene.blended = true
        const fruits = ofKind("fruit")
        const color = smoothieColor(fruits, ofKind("liquid")[0])
        if (color) scene.tint = { points: conf.glass, color }
        // פרוסת הפרי הראשון על שפת הכוס
        const first = fruits[0] && find(FRUIT_PHOTOS, fruits[0].label)
        const firstInfo = first && manifest[first.asset]
        if (firstInfo?.pieces?.length) {
            const piece = firstInfo.pieces[0]
            const size = sizeOf(piece, first.cm * 0.9, Math.max(piece.w, piece.h))
            scene.toppings.push({ ...fruits[0], key: "garnish-" + fruits[0].key, pieces: [{ file: piece.file, ...conf.rimSpot, ...size, rot: 24, delay: 150 }] })
        }
        scatterToppings(inEllipse(conf.surface), 0.55)
        ofKind("syrup").forEach((it, idx) => addSyrup(it, idx, { ...conf.surface, rx: conf.surface.rx * 0.8, ry: conf.surface.ry * 0.8 }))
        ofKind("whipTop").forEach(it => addScoop(it, 0.5, conf.surface.cy + 0.04, 6))
    }

    return scene
}
