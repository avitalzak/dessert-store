import { useId, useMemo } from "react"
import { usePresence } from "./usePresence"
import { buildScene, mix, GLASS, glassHalfWidth } from "./dishScene"
import {
    Defs, Plate, Waffle, PancakeStack, Crepe, CupBack, CupFront, GlassBack, GlassFront, GLASS_INNER,
    Straw, Scoop, Whip, Piece, Spread, Sparkle,
} from "./dishArt"
import "../../styles/DishVisualizer.css"


// כמה מה"קנבס" להראות לכל מנה, כדי שהמנה תמלא את המסגרת
const VIEWBOX = {
    waffle: "14 120 372 250",
    pancake: "14 120 372 250",
    crepe: "14 140 372 236",
    plate: "14 140 372 236",
    icecream: "64 86 272 282",
    shake: "56 14 288 350",
}

// עטיפה לכל רכיב שנכנס/יוצא: מיקום (עם מעבר חלק) + אנימציית כניסה/יציאה
function Placed({ x, y, rot = 0, s = 1, delay = 0, leaving, anim = "dv-drop", children }) {
    return (
        <g className="dv-pos" style={{ transform: `translate(${x}px, ${y}px)` }}>
            <g className={leaving ? "dv-leave" : anim} style={{ "--d": `${delay}ms` }}>
                <g transform={`rotate(${Math.round(rot)}) scale(${Math.round(s * 100) / 100})`}>{children}</g>
            </g>
        </g>
    )
}

export default function DishVisualizer({ product, selections, onRemove, className = "" }) {
    const u = "dv" + useId().replace(/[^a-zA-Z0-9]/g, "")
    const scene = useMemo(() => buildScene(product, selections), [product, selections])
    const { dish } = scene

    const scoops = usePresence(scene.scoops)
    const spreads = usePresence(scene.spreads)
    const toppings = usePresence(scene.toppings)
    const syrups = usePresence(scene.syrups)
    const layers = usePresence(scene.layers)
    const floaters = usePresence(scene.floaters)
    const garnishes = usePresence(scene.garnishes)

    const clickable = onRemove ? "dv-clickable" : ""
    const remove = item => () => !item.leaving && onRemove?.(item)
    const title = item => (onRemove ? `${item.label} - לחצו להסרה` : item.label)

    // ----- שכבות -----

    const spreadLayer = spreads.map(sp => (
        <g key={sp.key} className={`${sp.leaving ? "dv-leave-fade" : "dv-spread"} ${clickable}`} onClick={remove(sp)}>
            <title>{title(sp)}</title>
            <Spread d={sp.d} gloss={sp.gloss} />
        </g>
    ))

    const scoopLayer = scoops.map(sc => (
        <g key={sc.key} className={clickable} onClick={remove(sc)}>
            <title>{title(sc)}</title>
            <Placed x={sc.x} y={sc.y} leaving={sc.leaving} anim="dv-scoop">
                {sc.whip
                    ? <Whip r={sc.r} u={u} />
                    : <Scoop r={sc.r} flavor={sc.flavor} u={u} seed={sc.label} />}
            </Placed>
            {!sc.leaving && <>
                <Sparkle x={sc.x - sc.r * 0.9} y={sc.y - sc.r * 0.7} delay={380} />
                <Sparkle x={sc.x + sc.r * 0.85} y={sc.y - sc.r * 0.3} size={5} delay={480} />
            </>}
        </g>
    ))

    const toppingLayer = toppings.map(tp => (
        <g key={tp.key} className={`dv-topping ${clickable}`} onClick={remove(tp)}>
            <title>{title(tp)}</title>
            {tp.pieces.map((p, i) => (
                <Placed key={i} x={p.x} y={p.y} rot={p.rot} s={p.s} leaving={tp.leaving} delay={tp.leaving ? 0 : p.delay}>
                    <Piece type={tp.type} v={p.v} u={u} />
                </Placed>
            ))}
            {!tp.leaving && <>
                <Sparkle x={tp.center[0] - 30} y={tp.center[1] - 18} delay={500} />
                <Sparkle x={tp.center[0] + 34} y={tp.center[1] - 6} size={5} delay={620} />
            </>}
        </g>
    ))

    const syrupLayer = syrups.map(sy => (
        <g key={sy.key} className={`${sy.leaving ? "dv-leave-fade" : ""} ${clickable}`} onClick={remove(sy)}>
            <title>{title(sy)}</title>
            <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                {sy.streaks.length > 0 && (
                    <g clipPath={`url(#${u}-glassClip)`} opacity=".9">
                        {sy.streaks.map((d, i) => (
                            <path key={i} d={d} pathLength="1" className="dv-draw" style={{ "--d": `${i * 90}ms` }}
                                stroke={sy.color} strokeWidth="5" />
                        ))}
                    </g>
                )}
                <path d={sy.d} pathLength="1" className="dv-draw" stroke={sy.edge} strokeWidth="7.5" />
                <path d={sy.d} pathLength="1" className="dv-draw" stroke={sy.color} strokeWidth="5.5" />
                <path d={sy.d} pathLength="1" className="dv-draw" stroke={sy.gloss} strokeWidth="1.6"
                    transform="translate(-.8 -1.4)" opacity=".75" />
            </g>
            {sy.drips.map((dr, i) => {
                const { x, y, len } = dr
                const d = `M ${x - 3.4} ${y} C ${x - 3.2} ${y + len * 0.55} ${x - 4.6} ${y + len} ${x} ${y + len + 2.5} C ${x + 4.6} ${y + len} ${x + 3.2} ${y + len * 0.55} ${x + 3.4} ${y} Z`
                return (
                    <g key={i} className="dv-drip" style={{ "--d": `${dr.delay}ms` }}>
                        <path d={d} fill={sy.color} stroke={sy.edge} strokeWidth="1" />
                        <path d={`M ${x - 1.4} ${y + 2} q -0.6 ${len * 0.5} 0 ${len * 0.75}`} stroke={sy.gloss} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity=".7" />
                    </g>
                )
            })}
        </g>
    ))

    // ----- בסיס המנה -----

    let content
    if (dish === "shake") {
        const liquid = scene.liquid
        content = (
            <>
                <GlassBack u={u} />
                <clipPath id={`${u}-glassClip`}><path d={GLASS_INNER} /></clipPath>
                <Straw show={!!liquid} />
                <g clipPath={`url(#${u}-glassClip)`}>
                    <g filter={`url(#${u}-soft)`} opacity=".93">
                        {/* כל פרי = שכבה צבעונית. שכבה חדשה "נשפכת" מלמטה, והאחרות מתכווצות בהדרגה */}
                        {layers.map(l => (
                            <g key={l.key} className={l.leaving ? "dv-leave-fade" : "dv-pour"}>
                                <rect className="dv-layer" x="120" y="0" width="160" height="1"
                                    style={{ transform: `translate(0px, ${l.y}px) scaleY(${l.h + 1})`, fill: l.color }} />
                            </g>
                        ))}
                    </g>
                    {liquid && <rect x="120" y={GLASS.liquidTop} width="160" height={GLASS.bottom - GLASS.liquidTop} fill={`url(#${u}-liquidShade)`} />}
                    {floaters.map(f => (
                        <g key={f.key} opacity=".6">
                            <Placed x={f.x} y={f.y} rot={f.rot} s={f.s} delay={f.delay} leaving={f.leaving} anim="dv-sink"><Piece type={f.type} u={u} /></Placed>
                        </g>
                    ))}
                </g>
                {liquid && (
                    <g className="dv-fade-in">
                        <ellipse cx="200" cy={liquid.top} rx={glassHalfWidth(liquid.top) - 3} ry="9"
                            style={{ fill: liquid.topColor, transition: "fill .6s" }} />
                        {liquid.type === "milk" && (
                            <g fill="#fffaf2">
                                <ellipse cx="200" cy={liquid.top - 2} rx={glassHalfWidth(liquid.top) - 8} ry="7" />
                                {[-40, -22, -4, 16, 34, 48].map((dx, i) => <circle key={i} cx={200 + dx} cy={liquid.top - 3 + (i % 2) * 3} r={3 + (i % 3)} />)}
                            </g>
                        )}
                    </g>
                )}
                {spreadLayer}
                {syrupLayer}
                {toppingLayer}
                {scoopLayer}
                <GlassFront u={u} />
                {garnishes.map(g => (
                    <g key={g.key} className={clickable} onClick={remove(g)}>
                        <title>{title(g)}</title>
                        <Placed x={g.x} y={g.y} rot={g.rot} s={g.s} leaving={g.leaving}><Piece type={g.type} u={u} /></Placed>
                    </g>
                ))}
            </>
        )
    } else if (dish === "icecream") {
        const melt = scene.scoops.find(s => !s.whip)
        content = (
            <>
                <CupBack u={u} />
                {scoopLayer}
                <CupFront u={u} fill={melt ? mix(melt.flavor.base, melt.flavor.shade, 0.15) : null} />
                {toppingLayer}
                {syrupLayer}
            </>
        )
    } else {
        content = (
            <>
                <Plate u={u} />
                {dish === "waffle" && <Waffle u={u} />}
                {dish === "pancake" && <PancakeStack u={u} />}
                {dish === "crepe" && <Crepe u={u} />}
                {spreadLayer}
                {scoopLayer}
                {toppingLayer}
                {syrupLayer}
            </>
        )
    }

    return (
        <svg className={`dv-svg ${className}`} viewBox={VIEWBOX[dish]} role="img"
            aria-label={`${product?.name || "המנה"}: ${scene.items.map(i => i.label).join(", ")}`}>
            <Defs u={u} />
            {content}
        </svg>
    )
}
