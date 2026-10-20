import { useEffect, useId, useMemo, useRef, useState } from "react"
import { usePresence } from "./usePresence"
import { buildPhotoScene, assetsForProduct, DISH_DIR } from "./photoScene"
import { buildDrizzle, syrupLook } from "./drizzle"

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

// זילוף סירופ: הקו "נמזג" מההתחלה עד הסוף, ואז הטפטופים נוזלים מעבר לשפה
function Drizzle({ syrup, aspect, z, className, onLanded, onClick, title }) {
    const id = "dz" + useId().replace(/[^a-zA-Z0-9_-]/g, "")
    const dz = useMemo(() => buildDrizzle(syrup, aspect), [syrup, aspect])
    const look = syrupLook(syrup.label)
    const w = dz.width
    const line = (stroke, width, extra) => (
        <>
            <path d={dz.d} stroke={stroke} strokeWidth={width} {...extra} />
            {dz.drips.map((dr, i) => <path key={i} className="pd-drip" d={dr.d} stroke={stroke} strokeWidth={width * 0.85} {...extra} />)}
        </>
    )
    const blobs = (fill, scale, dx = 0, dy = 0) => (
        <>
            {[dz.start, dz.end].map(([x, y], i) => <circle key={i} cx={x + dx} cy={y + dy} r={w * 0.62 * scale} fill={fill} />)}
            {dz.drips.map((dr, i) => <circle key={"d" + i} className="pd-drip" cx={dr.end[0] + dx} cy={dr.end[1] + dy} r={dr.r * scale} fill={fill} />)}
        </>
    )
    return (
        <div className="pd-drizzle-wrap" style={{ zIndex: z }}>
            <svg className={`pd-drizzle ${className}`} viewBox={dz.viewBox} preserveAspectRatio="none"
                fill="none" strokeLinecap="round" strokeLinejoin="round"
                onAnimationEnd={e => e.target === e.currentTarget && onLanded?.()}>
                <defs>
                    <filter id={`${id}-blur`} x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation={w * 0.25} /></filter>
                    {/* המסכה "מציירת" את הקו בהדרגה, כאילו הסירופ נמזג עכשיו */}
                    <mask id={`${id}-pour`} maskUnits="userSpaceOnUse">
                        <path className="pd-pour-line" d={dz.d} pathLength="1" stroke="#fff" strokeWidth={w * 3} />
                        {blobs("#fff", 1.6)}
                        {dz.drips.map((dr, i) => <path key={i} className="pd-pour-drip" d={dr.d} pathLength="1" stroke="#fff" strokeWidth={w * 3} />)}
                    </mask>
                </defs>
                <g mask={`url(#${id}-pour)`}>
                    <g filter={`url(#${id}-blur)`} transform={`translate(${w * 0.25} ${w * 0.45})`} opacity=".35">
                        {line("#2a1204", w * 1.1)}{blobs("#2a1204", 1.05)}
                    </g>
                    <g opacity={look.opacity}>
                        {line(look.edge, w * 1.18)}{blobs(look.edge, 1.12)}
                        {line(look.color, w)}{blobs(look.color, 1)}
                        {line(look.core, w * 0.42, { opacity: 0.7 })}
                    </g>
                    {/* ברק של סירופ מבריק */}
                    <g transform={`translate(${-w * 0.16} ${-w * 0.2})`} opacity=".55">
                        <path d={dz.d} stroke="#fff" strokeWidth={w * 0.22} strokeDasharray={dz.gloss} />
                        {blobs("#fff", 0.25, -w * 0.12, -w * 0.12)}
                    </g>
                </g>
                {/* אזור לחיצה רחב יותר מהקו עצמו */}
                <path className="pd-drizzle-hit" d={dz.d} stroke="transparent" strokeWidth={w * 2.5} onClick={onClick}>
                    {title && <title>{title}</title>}
                </path>
            </svg>
        </div>
    )
}

// הבסיס הנוזלי בכוס השייק: זרם נמזג מלמעלה, הנוזל עולה מהתחתית ומכסה את הפירות,
// עם עומק, השתקפויות של הזכוכית, קצף/בועות וגלים קטנים במקום שבו הזרם פוגע
function Liquid({ liquid: lq, onClick, title }) {
    const s = lq.surface
    const dot = (b, i, cls) => (
        <span key={i} className={cls} style={{ left: pct(b.x - b.r), top: pct(b.y - b.r * 0.6), width: pct(b.r * 2), height: pct(b.r * 1.2), "--i": i }} />
    )
    const ellipse = { left: pct(s.cx - s.rx), top: pct(s.cy - s.ry), width: pct(s.rx * 2), height: pct(s.ry * 2) }
    // גם הנוזל עצמו בצורת הכוס, כדי שבזמן העלייה פני הנוזל יישארו אליפסה ולא קו ישר
    const shape = polygon(lq.points)
    // הזרם נעלם בתוך הנוזל (מתחת לפני הנוזל הסופיים)
    const fade = `linear-gradient(180deg, #000 ${(s.cy / lq.floor * 100).toFixed(1)}%, transparent)`
    return (
        <>
            {/* key לפי הנוזל: כשמחליפים נוזל הוא נמזג מחדש */}
            <div key={"pour-" + lq.key} className="pd-liquid-stream"
                style={{ zIndex: 440, height: pct(lq.floor), maskImage: fade, WebkitMaskImage: fade, "--c": lq.color, "--c2": lq.shallow, "--o": Math.max(0.55, lq.opacity) }} />
            <div className="pd-liquid" style={{ zIndex: 450, clipPath: shape }} onClick={onClick} title={title}>
                <div key={lq.key} className="pd-liquid-rise" style={{ "--rise": pct(1 - s.cy) }}>
                    <div className="pd-liquid-body" style={{
                        top: 0, clipPath: shape, opacity: lq.opacity, backdropFilter: `blur(${lq.blur}px)`, WebkitBackdropFilter: `blur(${lq.blur}px)`,
                        background: `linear-gradient(180deg, ${lq.shallow}, ${lq.color} 35%, ${lq.deep})`,
                    }} />
                    {/* צל בצדדים והשתקפות אורכית, כמו נוזל בכוס עגולה */}
                    <div className="pd-liquid-shade" style={{ top: 0, clipPath: shape }} />
                    {lq.bubbles.map((b, i) => dot(b, i, "pd-bubble"))}
                    <div className="pd-liquid-top" style={{ ...ellipse, "--top": lq.top, opacity: 0.35 + lq.opacity * 0.5 }} />
                    {lq.foam.map((b, i) => dot(b, "f" + i, "pd-foam"))}
                    {[0, 1, 2].map(i => <div key={"r" + i} className="pd-ripple" style={{ ...ellipse, "--i": i }} />)}
                </div>
            </div>
        </>
    )
}

// רכיבים שכבר נחתו על המנה (לכל מוצר), כדי שבמעבר למסך הסיכום הם לא ייפלו שוב.
// נשמר מחוץ לקומפוננטה כי במסך הסיכום המנה נבנית מחדש.
const landedByProduct = new Map()

const polygon = points => `polygon(${points.map(([x, y]) => `${pct(x)} ${pct(y)}`).join(", ")})`

export default function PhotoDish({ product, selections, manifest, onRemove, final = false, className = "" }) {
    const scene = useMemo(() => buildPhotoScene(product, selections, manifest, { final }), [product, selections, manifest, final])

    // השייק התערבל עכשיו (מעבר לשלב התוספות) - הכוס רועדת רגע. במסך שנפתח כבר מוכן - לא
    const wasBlended = useRef(scene.blended)
    const justBlended = scene.blended && !wasBlended.current
    const [blending, setBlending] = useState(false)
    useEffect(() => {
        wasBlended.current = scene.blended
        if (justBlended) setBlending(true)
        else if (!scene.blended) setBlending(false)
    }, [scene.blended, justBlended])

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
        <div className={`pd-dish ${onRemove ? "is-interactive" : ""} ${blending && scene.blended ? "is-blending" : ""} ${className}`}
            // מנות גבוהות (בלנדר, כוס) מוגבלות בגובה כדי שתמיד ייכנסו במסך
            style={{ paddingTop: pct(scene.padTop / scene.aspect), maxWidth: `min(var(--pd-max, 420px), calc(var(--pd-max-h, 62vh) * ${(scene.aspect / (1 + scene.padTop)).toFixed(3)}))` }}
            role="img" aria-label={`${product?.name}: ${[...scene.toppings, ...scene.syrups, ...scene.scoops].map(i => i.label).join(", ")}`}>
          <div className="pd-frame" style={{ aspectRatio: scene.aspect }}>
            <div className="pd-shadow" />
            {/* key לפי הקובץ: כשהבסיס מתחלף (בלנדר -> כוס) הוא נכנס מחדש באנימציה */}
            <img key={scene.base} className="pd-base" src={DISH_DIR + scene.base} alt="" draggable="false" />

            {/* מערבולת קצרה כשהפירות "נטחנים" לשייק */}
            {blending && scene.blended && <div key="swirl" className="pd-swirl" />}

            {/* צבע השייק המוכן: צובע את השייק הלבן שבכוס לפי הפירות */}
            {scene.tint && (
                <div className="pd-tint" style={{
                    clipPath: polygon(scene.tint.points), background: scene.tint.color,
                    // רק איפה שיש פיקסלים בתמונת הכוס (לא על הרקע)
                    WebkitMaskImage: `url(${DISH_DIR + scene.base})`, maskImage: `url(${DISH_DIR + scene.base})`,
                }} />
            )}

            {/* הבסיס הנוזלי בכוס השייק: נמזג מלמעלה, עולה מהתחתית ומכסה את הפירות */}
            {scene.liquid && <Liquid liquid={scene.liquid} onClick={click(scene.liquid)} title={title(scene.liquid)} />}

            {spreads.map(sp => (
                <Sprite key={sp.key} box={sp} z={1} className={cls(sp, "pd-spread")} onLanded={animDone(sp)} onClick={click(sp)} title={title(sp)}>
                    <img src={DISH_DIR + sp.file} alt="" draggable="false" />
                </Sprite>
            ))}

            {pieces.map((p, i) => (
                <Sprite key={p.k} box={p} z={onTop + (p.item.float ? 500 : 10) + i} className={cls(p.item, "pd-drop", p.k)} onLanded={animDone(p.item, p.k)}
                    style={{ "--d": `${p.item.leaving ? 0 : p.delay}ms`, "--r": `${p.rot}deg` }}
                    onClick={click(p.item)} title={title(p.item)}>
                    <img className="pd-piece" src={DISH_DIR + p.file} alt="" draggable="false" />
                </Sprite>
            ))}

            {syrups.map(sy => (
                <Drizzle key={sy.key} syrup={sy} aspect={scene.aspect} z={onTop + 500}
                    className={sy.leaving ? "pd-drizzle-leave" : cls(sy, "pd-drizzle-in")}
                    onLanded={animDone(sy)} onClick={click(sy)} title={title(sy)} />
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
