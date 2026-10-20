import { useEffect, useMemo, useState } from "react"
import { usePresence } from "./usePresence"
import { buildPhotoScene, assetsForProduct, DISH_DIR } from "./photoScene"

// מנה מצולמת: תמונת הבסיס + כל רכיב כתמונה גזורה שנוחתת עליה.
// מיקומים ב-% מהתמונה, כך שהכל מתכווץ יחד בכל גודל מסך.

const pct = n => `${(n * 100).toFixed(3)}%`

function Sprite({ box: { x, y, w, h }, anchorY = 0.5, z, className, style, children, onClick, title, onLanded }) {
    return (
        <div className="pd-sprite" onClick={onClick} title={title}
            style={{ left: pct(x - w / 2), top: pct(y - h * anchorY), width: pct(w), height: pct(h), zIndex: z, ...style }}>
            <div className={className} style={{ width: "100%", height: "100%" }}
                onAnimationEnd={e => e.target === e.currentTarget && onLanded?.()}>{children}</div>
        </div>
    )
}

// רכיבים שכבר נחתו על המנה (לכל מוצר), כדי שבמעבר למסך הסיכום הם לא ייפלו שוב.
// נשמר מחוץ לקומפוננטה כי במסך הסיכום המנה נבנית מחדש.
const landedByProduct = new Map()

const polygon = points => `polygon(${points.map(([x, y]) => `${pct(x)} ${pct(y)}`).join(", ")})`

export default function PhotoDish({ product, selections, manifest, onRemove, final = false, className = "" }) {
    const scene = useMemo(() => buildPhotoScene(product, selections, manifest, { final }), [product, selections, manifest, final])

    const spreads = usePresence(scene.spreads)
    const toppings = usePresence(scene.toppings)
    const syrups = usePresence(scene.syrups)
    const scoops = usePresence(scene.scoops)

    // טוענים מראש את כל התמונות של המוצר, כדי שרכיב שנבחר יופיע מיד
    useEffect(() => {
        assetsForProduct(product, manifest).forEach(f => { new Image().src = DISH_DIR + f })
    }, [product, manifest])

    // רכיב שכבר נחת לא מקבל שוב את אנימציית הנפילה: React מזיז חתיכות ב-DOM כשסדר
    // העומק משתנה (למשל במעבר שלב), והדפדפן היה מריץ להן את הנפילה מחדש
    const productId = product?._id ?? product?.name
    const sceneKeys = new Set([...scene.spreads, ...scene.toppings, ...scene.syrups, ...scene.scoops].map(i => i.key))
    const [landed, setLanded] = useState(() =>
        new Set([...(landedByProduct.get(productId) || [])].filter(k => sceneKeys.has(k.split("#")[0]))))
    // נגמרה אנימציה: כניסה = הרכיב נחת. יציאה = הוסר, ואם יבחרו אותו שוב הוא ייפול מחדש
    const animDone = (item, key = item.key) => () => setLanded(s => {
        if (item.leaving === s.has(key)) {
            const next = new Set(s)
            item.leaving ? next.delete(key) : next.add(key)
            return next
        }
        return s
    })
    useEffect(() => { landedByProduct.set(productId, landed) }, [productId, landed])

    const click = item => onRemove && (() => !item.leaving && onRemove(item))
    const title = item => (onRemove ? `${item.label} - לחצו להסרה` : item.label)
    // כשהשייק "נטחן", הפירות לא קופצים החוצה אלא מסתחררים ונבלעים פנימה
    const cls = (item, enter, key = item.key) => item.leaving ? (scene.blended ? "pd-blend-out" : "pd-leave")
        : landed.has(key) ? `${enter} pd-settled` : enter

    // כל החתיכות של כל התוספות, ממוינות לפי עומק: מה שקרוב למצלמה (y גדול) מכסה את מה שמאחור
    const pieces = toppings.flatMap(tp => tp.pieces.map((p, i) => ({ ...p, item: tp, k: `${tp.key}#${i}` })))
        .sort((a, b) => a.y - b.y)

    // בגביע: התוספות והסירופ יושבים על הכדורים, כלומר מעל הזכוכית הקדמית (z 700).
    // בכוס השייק הריקה: הפירות בתוך הכוס, מתחת לזכוכית.
    const onTop = scene.front?.points ? 800 : 0

    return (
        <div className={`pd-dish ${onRemove ? "is-interactive" : ""} ${className}`}
            // מנות גבוהות (בלנדר, כוס) מוגבלות בגובה כדי שתמיד ייכנסו במסך
            style={{ paddingTop: pct(scene.padTop / scene.aspect), maxWidth: `min(var(--pd-max, 420px), calc(var(--pd-max-h, 62vh) * ${(scene.aspect / (1 + scene.padTop)).toFixed(3)}))` }}
            role="img" aria-label={`${product?.name}: ${[...scene.toppings, ...scene.syrups, ...scene.scoops].map(i => i.label).join(", ")}`}>
          <div className="pd-frame" style={{ aspectRatio: scene.aspect }}>
            <div className="pd-shadow" />
            {/* key לפי הקובץ: כשהבסיס מתחלף (בלנדר -> כוס) הוא נכנס מחדש באנימציה */}
            <img key={scene.base} className="pd-base" src={DISH_DIR + scene.base} alt="" draggable="false" />

            {/* מערבולת קצרה כשהפירות "נטחנים" לשייק */}
            {scene.blended && <div key="swirl" className="pd-swirl" />}

            {/* צבע השייק המוכן: צובע את השייק הלבן שבכוס לפי הפירות */}
            {scene.tint && (
                <div className="pd-tint" style={{
                    clipPath: polygon(scene.tint.points), background: scene.tint.color,
                    // רק איפה שיש פיקסלים בתמונת הכוס (לא על הרקע)
                    WebkitMaskImage: `url(${DISH_DIR + scene.base})`, maskImage: `url(${DISH_DIR + scene.base})`,
                }} />
            )}

            {spreads.map(sp => (
                <Sprite key={sp.key} box={sp} z={1} className={cls(sp, "pd-spread")} onLanded={animDone(sp)} onClick={click(sp)} title={title(sp)}>
                    <img src={DISH_DIR + sp.file} alt="" draggable="false" />
                </Sprite>
            ))}

            {pieces.map((p, i) => (
                <Sprite key={p.k} box={p} z={onTop + 10 + i} className={cls(p.item, "pd-drop", p.k)} onLanded={animDone(p.item, p.k)}
                    style={{ "--d": `${p.item.leaving ? 0 : p.delay}ms`, "--r": `${p.rot}deg` }}
                    onClick={click(p.item)} title={title(p.item)}>
                    <img className="pd-piece" src={DISH_DIR + p.file} alt="" draggable="false" />
                </Sprite>
            ))}

            {syrups.map(sy => (
                <Sprite key={sy.key} box={sy} z={onTop + 500} className={cls(sy, "pd-pour")} onLanded={animDone(sy)} onClick={click(sy)} title={title(sy)}>
                    <img className="pd-syrup" src={DISH_DIR + sy.file} alt="" draggable="false"
                        style={sy.flip ? { transform: "scaleX(-1)" } : undefined} />
                </Sprite>
            ))}

            {scoops.map((sc, i) => (
                <Sprite key={sc.key} box={sc} anchorY={0.82} z={(sc.kind === "whipTop" ? onTop + 1000 : 600) + i} className={cls(sc, "pd-scoop")} onLanded={animDone(sc)} onClick={click(sc)} title={title(sc)}>
                    <div className="pd-contact" />
                    <img className="pd-piece" src={DISH_DIR + sc.file} alt="" draggable="false" />
                </Sprite>
            ))}
            {/* החלק הקדמי של הזכוכית (גביע/בלנדר) - מעל מה שבתוכו, כדי שייראה "בפנים" */}
            {scene.front && (
                <img className="pd-front" src={DISH_DIR + scene.front.file} alt="" draggable="false"
                    style={{
                        zIndex: 700, opacity: scene.front.opacity,
                        clipPath: scene.front.points ? polygon(scene.front.points)
                            : undefined,
                    }} />
            )}

          </div>
        </div>
    )
}
