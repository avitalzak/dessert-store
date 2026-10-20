// ספריית האיורים של המנות - הכל SVG, בלי קבצי תמונה.
// כל רכיב מצויר סביב נקודת (0,0) כדי שיהיה קל למקם/לסובב אותו.
// u = מזהה ייחודי של ה-SVG, כדי שה-gradients לא יתנגשו בין שתי תצוגות באותו עמוד.

import { seeded, CUP, GLASS } from "./dishScene"

// ===== הגדרות משותפות (גרדיאנטים, פילטרים) =====

export function Defs({ u }) {
    return (
        <defs>
            <radialGradient id={`${u}-shade`} cx="35%" cy="28%" r="78%">
                <stop offset="0" stopColor="#fff" stopOpacity=".55" />
                <stop offset=".42" stopColor="#fff" stopOpacity="0" />
                <stop offset="1" stopColor="#3c1905" stopOpacity=".3" />
            </radialGradient>
            <radialGradient id={`${u}-plate`} cx="50%" cy="45%" r="60%">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset=".75" stopColor="#fbf7f2" />
                <stop offset="1" stopColor="#ece2d6" />
            </radialGradient>
            <radialGradient id={`${u}-wTop`} cx="45%" cy="38%" r="65%">
                <stop offset="0" stopColor="#f5c983" />
                <stop offset=".6" stopColor="#dfa052" />
                <stop offset="1" stopColor="#c27b33" />
            </radialGradient>
            <linearGradient id={`${u}-wSide`} x1="0" x2="1">
                <stop offset="0" stopColor="#8e501a" />
                <stop offset=".45" stopColor="#c98a42" />
                <stop offset="1" stopColor="#8e501a" />
            </linearGradient>
            <linearGradient id={`${u}-pocket`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#8a4c18" />
                <stop offset="1" stopColor="#cf9147" />
            </linearGradient>
            <radialGradient id={`${u}-pTop`} cx="48%" cy="45%" r="60%">
                <stop offset="0" stopColor="#c98340" />
                <stop offset=".7" stopColor="#d99a54" />
                <stop offset="1" stopColor="#f0c688" />
            </radialGradient>
            <linearGradient id={`${u}-pSide`} x1="0" x2="1">
                <stop offset="0" stopColor="#e3b97e" />
                <stop offset=".45" stopColor="#fae6c0" />
                <stop offset="1" stopColor="#e3b97e" />
            </linearGradient>
            <linearGradient id={`${u}-crepe`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f8dca6" />
                <stop offset="1" stopColor="#e9b46c" />
            </linearGradient>
            <linearGradient id={`${u}-glass`} x1="0" x2="1">
                <stop offset="0" stopColor="#fff" stopOpacity=".7" />
                <stop offset=".35" stopColor="#dcecf4" stopOpacity=".18" />
                <stop offset=".8" stopColor="#dcecf4" stopOpacity=".12" />
                <stop offset="1" stopColor="#fff" stopOpacity=".55" />
            </linearGradient>
            <linearGradient id={`${u}-liquidShade`} x1="0" x2="1">
                <stop offset="0" stopColor="#000" stopOpacity=".16" />
                <stop offset=".3" stopColor="#fff" stopOpacity=".18" />
                <stop offset=".7" stopColor="#fff" stopOpacity="0" />
                <stop offset="1" stopColor="#000" stopOpacity=".2" />
            </linearGradient>
            <radialGradient id={`${u}-berry`} cx="35%" cy="30%" r="70%">
                <stop offset="0" stopColor="#8d97dd" />
                <stop offset=".55" stopColor="#4a4f9a" />
                <stop offset="1" stopColor="#272a5e" />
            </radialGradient>
            <filter id={`${u}-blur`} x="-20%" y="-50%" width="140%" height="200%">
                <feGaussianBlur stdDeviation="6" />
            </filter>
            <filter id={`${u}-soft`} x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="2.4" />
            </filter>
        </defs>
    )
}

// ===== צלחת =====

export function Plate({ u }) {
    return (
        <g className="dv-base">
            <ellipse cx="200" cy="314" rx="186" ry="56" fill="#5a3416" opacity=".14" filter={`url(#${u}-blur)`} />
            <ellipse cx="200" cy="302" rx="182" ry="56" fill={`url(#${u}-plate)`} stroke="#e6dacb" strokeWidth="1.5" />
            <ellipse cx="200" cy="300" rx="142" ry="40" fill="none" stroke="#efe5d8" strokeWidth="2" />
            <path d="M48 288 Q90 258 160 252" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".9" />
        </g>
    )
}

// ===== וופל בלגי עגול =====

export function Waffle({ u }) {
    const cells = []
    for (let i = -6; i <= 6; i++) {
        for (let j = -6; j <= 6; j++) {
            cells.push(
                <rect key={`${i}${j}`} x={200 + i * 28 - 10.5} y={246 + j * 12 - 4.3}
                    width="21" height="8.6" rx="2.6" fill={`url(#${u}-pocket)`} />
            )
        }
    }
    return (
        <g className="dv-base">
            <clipPath id={`${u}-wClip`}>
                <ellipse cx="200" cy="246" rx="124" ry="50" />
            </clipPath>
            <ellipse cx="200" cy="268" rx="136" ry="56" fill={`url(#${u}-wSide)`} />
            <rect x="64" y="246" width="272" height="22" fill={`url(#${u}-wSide)`} />
            {/* חריצים בצד הוופל */}
            {[-110, -80, -48, -16, 16, 48, 80, 110].map(dx => (
                <path key={dx} d={`M ${200 + dx} ${246 + 56 * Math.sqrt(1 - (dx / 136) ** 2)} v 18`}
                    stroke="#7a4214" strokeWidth="3" strokeLinecap="round" opacity=".45" />
            ))}
            <ellipse cx="200" cy="246" rx="136" ry="56" fill={`url(#${u}-wTop)`} />
            <g clipPath={`url(#${u}-wClip)`}>{cells}</g>
            <ellipse cx="200" cy="246" rx="124" ry="50" fill="none" stroke="#b56f2a" strokeWidth="2" opacity=".6" />
            <ellipse cx="200" cy="246" rx="134" ry="55" fill="none" stroke="#f7d79c" strokeWidth="2.5" opacity=".7" />
            <ellipse cx="200" cy="246" rx="136" ry="56" fill={`url(#${u}-shade)`} opacity=".7" />
            {/* אבקת סוכר */}
            <g fill="#fff" opacity=".85">
                {[[150, 222], [176, 214], [214, 232], [252, 218], [190, 262], [236, 266], [140, 252], [268, 246]].map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r={i % 2 ? 1.6 : 1.1} />
                ))}
            </g>
        </g>
    )
}

// ===== ערימת פנקייקים =====

export function PancakeStack({ u }) {
    const layers = [{ cy: 262, dx: -4 }, { cy: 244, dx: 4 }, { cy: 226, dx: 0 }]
    return (
        <g className="dv-base">
            {layers.map(({ cy, dx }, i) => (
                <g key={i} transform={`translate(${dx} 0)`}>
                    <ellipse cx="200" cy={cy + 16} rx="124" ry="48" fill={`url(#${u}-pSide)`} />
                    <rect x="76" y={cy} width="248" height="16" fill={`url(#${u}-pSide)`} />
                    <ellipse cx="200" cy={cy + 16} rx="124" ry="48" fill="none" stroke="#c99251" strokeWidth="1.2" opacity=".5" />
                    <ellipse cx="200" cy={cy} rx="124" ry="48" fill={`url(#${u}-pTop)`} />
                    <ellipse cx="200" cy={cy} rx="121" ry="46.5" fill="none" stroke="#f7d9a6" strokeWidth="2" opacity=".6" />
                </g>
            ))}
            {/* בועות קטנות על הפנקייק העליון */}
            <g fill="#b36f30" opacity=".35">
                {[[160, 214], [188, 236], [230, 210], [252, 232], [208, 248], [146, 238]].map(([x, y], i) => (
                    <ellipse key={i} cx={x} cy={y} rx="2.4" ry="1.3" />
                ))}
            </g>
            <ellipse cx="200" cy="226" rx="124" ry="48" fill={`url(#${u}-shade)`} opacity=".55" />
        </g>
    )
}

// ===== קרפ מקופל לשני משולשים =====

const CREPE_A = "M -20 110 L -200 -20 A 230 230 0 0 1 40 -170 Z"
const CREPE_B = "M 20 110 L -40 -170 A 230 230 0 0 1 200 -20 Z"

export function Crepe({ u }) {
    const rand = seeded("crepe-spots")
    const spots = Array.from({ length: 40 }, () => [rand() * 400 - 200, rand() * 280 - 170, 4 + rand() * 12])
    const fold = (d, id) => (
        <g>
            <path d={d} fill="#d89a52" transform="translate(0 18)" />
            <path d={d} fill={`url(#${u}-crepe)`} />
            <clipPath id={id}><path d={d} /></clipPath>
            <g clipPath={`url(#${id})`} fill="#c4823b" opacity=".3">
                {spots.map(([x, y, r], i) => <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.7} />)}
            </g>
            <path d={d} fill="none" stroke="#cf8d45" strokeWidth="3" />
        </g>
    )
    return (
        <g className="dv-base">
            <g transform="translate(200 296) scale(0.78 0.33)">
                {fold(CREPE_B, `${u}-cB`)}
                {fold(CREPE_A, `${u}-cA`)}
                <path d="M -20 110 Q -60 -20 -90 -110" stroke="#fbe6bd" strokeWidth="5" fill="none" opacity=".8" />
            </g>
        </g>
    )
}

// ===== גביע גלידה מזכוכית =====

export function CupBack({ u }) {
    return (
        <g className="dv-base">
            <ellipse cx="200" cy="350" rx="80" ry="12" fill="#5a3416" opacity=".16" filter={`url(#${u}-blur)`} />
            <ellipse cx="200" cy="344" rx="60" ry="11" fill="#eef5f8" stroke="#b9cfd9" strokeWidth="1.5" />
            <path d="M193 300 L195 342 L205 342 L207 300 Z" fill="#e6f0f4" stroke="#b9cfd9" strokeWidth="1.2" />
            <ellipse cx={CUP.cx} cy={CUP.rimY} rx={CUP.rx} ry={CUP.ry} fill="#f4f9fb" stroke="#b9cfd9" strokeWidth="1.5" />
            <ellipse cx={CUP.cx} cy={CUP.rimY + 3} rx={CUP.rx - 8} ry={CUP.ry - 5} fill="#e3eef3" />
        </g>
    )
}

const CUP_FRONT = `M ${CUP.cx - CUP.rx} ${CUP.rimY} C 92 296 140 306 200 306 C 260 306 308 296 ${CUP.cx + CUP.rx} ${CUP.rimY} A ${CUP.rx} ${CUP.ry} 0 0 1 ${CUP.cx - CUP.rx} ${CUP.rimY} Z`

export function CupFront({ u, fill }) {
    return (
        <g className="dv-base" pointerEvents="none">
            {fill && <path d={CUP_FRONT} fill={fill} opacity=".55" style={{ transition: "fill .5s" }} />}
            <path d={CUP_FRONT} fill={`url(#${u}-glass)`} stroke="#a9c3cf" strokeWidth="1.8" />
            <path d="M104 250 C110 282 136 296 168 300" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".75" />
            <path d={`M ${CUP.cx + CUP.rx} ${CUP.rimY} A ${CUP.rx} ${CUP.ry} 0 0 1 ${CUP.cx - CUP.rx} ${CUP.rimY}`}
                fill="none" stroke="#fff" strokeWidth="2.5" opacity=".9" />
        </g>
    )
}

// ===== כוס שייק =====

const GLASS_OUTER = "M126 78 L150 330 Q151 338 160 338 L240 338 Q249 338 250 330 L274 78"
export const GLASS_INNER = "M129 80 L152.5 329 Q153 335 160 335 L240 335 Q247 335 247.5 329 L271 80 Z"

export function GlassBack({ u }) {
    return (
        <g className="dv-base">
            <ellipse cx="200" cy="344" rx="92" ry="12" fill="#5a3416" opacity=".16" filter={`url(#${u}-blur)`} />
            <path d={GLASS_OUTER + " Z"} fill="#f2f8fb" opacity=".55" />
            <ellipse cx="200" cy={GLASS.top} rx="74" ry="11" fill="#eef5f8" stroke="#b9cfd9" strokeWidth="1.2" />
        </g>
    )
}

export function GlassFront({ u }) {
    return (
        <g className="dv-base" pointerEvents="none">
            <path d={GLASS_OUTER} fill="none" stroke="#a9c3cf" strokeWidth="2.4" strokeLinejoin="round" />
            <path d={GLASS_OUTER + " Z"} fill={`url(#${u}-glass)`} opacity=".9" />
            <path d="M142 100 L160 300" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity=".7" />
            <path d="M152 96 L156 140" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".6" />
            <path d={`M 274 ${GLASS.top} A 74 11 0 0 1 126 ${GLASS.top}`} fill="none" stroke="#fff" strokeWidth="2.5" opacity=".9" />
            <path d={`M 126 ${GLASS.top} A 74 11 0 0 1 274 ${GLASS.top}`} fill="none" stroke="#a9c3cf" strokeWidth="1.5" />
        </g>
    )
}

export function Straw({ show }) {
    const d = "M214 300 L244 58 Q246 42 260 36 L282 27"
    return (
        <g className={`dv-straw ${show ? "on" : ""}`}>
            <path d={d} stroke="#fff" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d={d} stroke="#ff7aa2" strokeWidth="10" fill="none" strokeDasharray="10 10" strokeLinejoin="round" />
            <path d={d} stroke="#000" strokeWidth="10" fill="none" opacity=".06" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M210 296 L240 56" stroke="#fff" strokeWidth="2" opacity=".6" />
        </g>
    )
}

// ===== כדור גלידה =====

function scoopPath(r) {
    const bumps = 7
    const w = (2 * r) / bumps
    let d = `M ${-r} ${0.2 * r} A ${r} ${r} 0 0 1 ${r} ${0.2 * r}`
    for (let k = 1; k <= bumps; k++) d += ` A ${w / 2} ${w * 0.45} 0 0 1 ${r - k * w} ${0.2 * r}`
    return d + " Z"
}

function frillLine(r) {
    const bumps = 7
    const w = (2 * r) / bumps
    let d = `M ${r} ${0.12 * r}`
    for (let k = 1; k <= bumps; k++) d += ` A ${w / 2} ${w * 0.35} 0 0 1 ${r - k * w} ${0.12 * r}`
    return d
}

export function Scoop({ r, flavor, u, seed = "scoop" }) {
    const d = scoopPath(r)
    const rand = seeded(seed)
    const specks = Array.from({ length: flavor.speckCount || 0 }, () => {
        const a = rand() * Math.PI * 2
        const k = Math.sqrt(rand()) * 0.68
        return {
            x: Math.cos(a) * r * k, y: -0.32 * r + Math.sin(a) * r * k * 0.8,
            s: flavor.tiny ? 0.9 : flavor.chunky ? 1.6 + rand() * 2.2 : 1.2 + rand() * 1.2,
            rot: rand() * 180,
        }
    })
    return (
        <g>
            <ellipse cx="0" cy={r * 0.36} rx={r * 0.98} ry={r * 0.16} fill="#3c1905" opacity=".16" />
            <path d={d} fill={flavor.base} />
            {flavor.swirl && (
                <path d={`M ${-0.62 * r} ${-0.1 * r} C ${-0.3 * r} ${-0.75 * r} ${0.1 * r} ${0.15 * r} ${0.58 * r} ${-0.42 * r}`}
                    stroke={flavor.swirl} strokeWidth={r * 0.13} strokeLinecap="round" fill="none" opacity=".75" />
            )}
            {specks.map((p, i) => (
                <rect key={i} x={p.x - p.s} y={p.y - p.s * 0.7} width={p.s * 2} height={p.s * 1.4} rx={p.s * 0.5}
                    fill={flavor.specks} transform={`rotate(${p.rot} ${p.x} ${p.y})`} opacity=".85" />
            ))}
            <path d={frillLine(r)} stroke={flavor.shade} strokeWidth="2.4" fill="none" opacity=".8" />
            <path d={d} fill={`url(#${u}-shade)`} />
            <ellipse cx={-0.34 * r} cy={-0.5 * r} rx={0.26 * r} ry={0.13 * r} fill="#fff" opacity=".45" transform={`rotate(-28 ${-0.34 * r} ${-0.5 * r})`} />
        </g>
    )
}

// ===== קצפת =====

function ruffle(cx, cy, rx, ry, bumps, depth) {
    let d = ""
    const n = bumps * 6
    for (let i = 0; i <= n; i++) {
        const a = (i / n) * Math.PI * 2
        const k = 1 + Math.cos(a * bumps) * depth
        const x = cx + Math.cos(a) * rx * k
        const y = cy + Math.sin(a) * ry * k
        d += `${i ? "L" : "M"} ${Math.round(x * 10) / 10} ${Math.round(y * 10) / 10} `
    }
    return d + "Z"
}

export function Whip({ r, u }) {
    const tiers = [
        { y: 0.05, rx: 0.95, ry: 0.36 },
        { y: -0.3, rx: 0.74, ry: 0.32 },
        { y: -0.6, rx: 0.5, ry: 0.26 },
    ]
    return (
        <g>
            <ellipse cx="0" cy={r * 0.3} rx={r} ry={r * 0.15} fill="#3c1905" opacity=".12" />
            {tiers.map((t, i) => {
                const d = ruffle(0, t.y * r, t.rx * r, t.ry * r, 9, 0.06)
                return (
                    <g key={i}>
                        <path d={d} fill="#fffdf8" stroke="#eadfcd" strokeWidth="1.2" />
                        {[-0.6, -0.2, 0.2, 0.6].map(k => (
                            <path key={k} d={`M ${k * t.rx * r} ${(t.y - t.ry * 0.7) * r} Q ${k * t.rx * r * 1.15} ${t.y * r} ${k * t.rx * r * 0.9} ${(t.y + t.ry * 0.8) * r}`}
                                stroke="#ece2d1" strokeWidth="1.4" fill="none" />
                        ))}
                        <path d={d} fill={`url(#${u}-shade)`} opacity=".5" />
                    </g>
                )
            })}
            <path d={`M ${-0.16 * r} ${-0.78 * r} Q ${0.02 * r} ${-1.18 * r} ${0.3 * r} ${-1.06 * r} Q ${0.06 * r} ${-0.98 * r} ${0.16 * r} ${-0.76 * r} Z`}
                fill="#fffdf8" stroke="#eadfcd" strokeWidth="1.2" />
        </g>
    )
}

// ===== תוספות - חתיכה בודדת =====

const LENTIL_COLORS = ["#e53935", "#fdd835", "#1e88e5", "#43a047", "#fb8c00", "#6d4c41"]
const SPRINKLE_COLORS = ["#ff6f91", "#ffc75f", "#67d5b5", "#845ec2", "#f9f871", "#4fc3f7", "#ff9671"]
const PRETZEL = "M-8.5 5 C-13 -1 -9 -9.5 -3.5 -8 C1.5 -6.5 1.5 1.5 -2.5 5.5 M8.5 5 C13 -1 9 -9.5 3.5 -8 C-1.5 -6.5 -1.5 1.5 2.5 5.5 M-8.5 5 C-5 8.5 5 8.5 8.5 5"

export function Piece({ type, v = 0, u }) {
    switch (type) {
        case "chunk":
            return (
                <g>
                    <rect x="-6" y="-5" width="12" height="10" rx="2" fill="#4a2516" />
                    <path d="M-4.5 -3.4 H4.5" stroke="#80503a" strokeWidth="1.3" strokeLinecap="round" />
                    <path d="M-4.5 -3.4 V3" stroke="#6a3b26" strokeWidth="1" strokeLinecap="round" />
                </g>
            )
        case "chips":
            return (
                <g>
                    <path d="M0 -5.5 C2.5 -2 5 1.5 4.2 3.4 C3 5.4 -3 5.4 -4.2 3.4 C-5 1.5 -2.5 -2 0 -5.5 Z" fill="#3b1c0e" />
                    <ellipse cx="-1.5" cy="0.5" rx="1" ry="1.5" fill="#86553a" />
                </g>
            )
        case "pretzel":
            return (
                <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d={PRETZEL} stroke="#2f1609" strokeWidth="4.4" />
                    <path d={PRETZEL} stroke="#77462c" strokeWidth="1.3" transform="translate(-.6 -.9)" />
                    {v % 2 === 0 && <path d="M-10 -1 L-6 1 M-3 -6 L1 -4 M6 -2 L10 0" stroke="#f7efe0" strokeWidth="1" />}
                </g>
            )
        case "flake":
            return (
                <g>
                    <path d="M-10 -3 L9 -4.5 L10 1.5 L-9 3.5 Z" fill="#7d4a2b" />
                    <path d="M-8.5 -1 L8.5 -2.3 M-8.5 1.4 L9 0.2" stroke="#ab7550" strokeWidth=".9" />
                    <path d="M-10 -3 L9 -4.5" stroke="#5a3019" strokeWidth=".9" />
                </g>
            )
        case "pecan":
            return (
                <g>
                    <ellipse rx="8.5" ry="4.8" fill="#7c3f17" />
                    <path d="M-7 0 H7" stroke="#4a220b" strokeWidth="1.1" />
                    <path d="M-6 -2.4 Q-3 -1 0 -2.6 Q3 -1 6 -2.4 M-6 2.4 Q-3 1 0 2.6 Q3 1 6 2.4" stroke="#4a220b" strokeWidth=".9" fill="none" />
                    <ellipse cx="-2.5" cy="-2.6" rx="3.6" ry="1.1" fill="#fff" opacity=".38" />
                </g>
            )
        case "oreo":
            return v % 3 === 0 ? (
                <path d="M-3 -2 L3 -3.2 L4 2 L-2 3 Z" fill="#2a2320" />
            ) : (
                <g>
                    <path d="M-8 4 L-2 -8 A9 9 0 0 1 8 3 Z" fill="#2a2320" />
                    <path d="M-7.2 3 L7.2 2.2" stroke="#f4efe5" strokeWidth="2.4" strokeLinecap="round" />
                    <circle cx="1" cy="-3" r="1" fill="#3e3531" />
                    <circle cx="4" cy="-1" r=".8" fill="#3e3531" />
                </g>
            )
        case "lentils":
            return (
                <g>
                    <ellipse rx="5.6" ry="4.6" fill={LENTIL_COLORS[v % LENTIL_COLORS.length]} />
                    <ellipse rx="5.6" ry="4.6" fill={`url(#${u}-shade)`} />
                    <ellipse cx="-1.8" cy="-1.8" rx="1.8" ry="1" fill="#fff" opacity=".6" />
                </g>
            )
        case "sprinkles":
            return <rect x="-4" y="-1.3" width="8" height="2.6" rx="1.3" fill={SPRINKLE_COLORS[v % SPRINKLE_COLORS.length]} />
        case "marshmallow":
            return (
                <g>
                    <rect x="-5.5" y="-3" width="11" height="8.5" rx="2.5" fill={v % 2 ? "#ffd3df" : "#fffaf3"} stroke="#ecd9cf" strokeWidth=".6" />
                    <ellipse cy="-3" rx="5.5" ry="2.2" fill="#fff" />
                </g>
            )
        case "strawberry":
            return (
                <g>
                    <path d="M0 9 C-7 5 -9 -2 -7 -6 C-4 -9 4 -9 7 -6 C9 -2 7 5 0 9 Z" fill="#df2f4a" />
                    <path d="M0 6 C-4.5 3 -5.5 -2 -4.3 -4.5 C-2 -6.5 2 -6.5 4.3 -4.5 C5.5 -2 4.5 3 0 6 Z" fill="#f6879b" />
                    <path d="M0 4 C-1 1 -1 -2 0 -5 C1 -2 1 1 0 4 Z" fill="#fde4e8" />
                    <path d="M-6 -7 Q-3 -10.5 0 -7.5 Q3 -10.5 6 -7 Q2 -5.6 0 -6.4 Q-2 -5.6 -6 -7 Z" fill="#43a047" />
                </g>
            )
        case "strawberryBits":
            return (
                <g>
                    <path d="M-5 -3 L4.5 -4 L4 4 L-4 4.5 Z" fill="#e0314b" />
                    <path d="M-3 -1.5 L2.5 -2 L2 2.5 L-2.5 2.5 Z" fill="#f7a1ae" />
                </g>
            )
        case "blueberry":
            return (
                <g>
                    <circle r="5.2" fill={`url(#${u}-berry)`} />
                    <path d="M-1.6 -2.8 L0 -1.6 L1.6 -2.8 M0 -1.6 V-3.6" stroke="#1c1f4d" strokeWidth=".8" />
                </g>
            )
        case "almond":
            return (
                <g>
                    <path d="M-8 0 C-6 -4.6 4 -5 9 0 C4 5 -6 4.6 -8 0 Z" fill="#f4e5c6" stroke="#d9c098" strokeWidth=".7" />
                    <path d="M-5 0 C-1 -1 3 -1 6 0" stroke="#e1cda6" strokeWidth=".8" fill="none" />
                </g>
            )
        case "click":
            return (
                <g>
                    <circle r="3.9" fill={v % 3 === 0 ? "#f3ead9" : "#5e321b"} />
                    <circle r="3.9" fill={`url(#${u}-shade)`} />
                    <circle cx="-1.2" cy="-1.3" r="1" fill="#fff" opacity=".55" />
                </g>
            )
        case "coconut":
            return (
                <g fill="none" strokeLinecap="round">
                    <path d="M-5 1 Q0 -3 5 1" stroke="#e5dccb" strokeWidth="2.8" transform="translate(.4 .9)" />
                    <path d="M-5 1 Q0 -3 5 1" stroke="#fffdf8" strokeWidth="2.2" />
                </g>
            )
        case "raisin":
            return (
                <g>
                    <path d="M-5 -1 C-5 -4.5 3 -5 5 -2 C6.5 1 3 4.5 -1 4 C-4 3.6 -5 1.5 -5 -1 Z" fill="#4b2232" />
                    <path d="M-3 0 Q0 -2 3 0" stroke="#2c111c" strokeWidth=".8" fill="none" />
                </g>
            )
        case "peach":
            return (
                <g>
                    <path d="M-9 3 Q0 -11 9 3 Q0 -2 -9 3 Z" fill="#ffb47f" />
                    <path d="M-9 3 Q0 -11 9 3" stroke="#ef6f5f" strokeWidth="1.8" fill="none" />
                </g>
            )
        case "mango":
            return (
                <g>
                    <path d="M0 -6 L6 -3 L0 0 L-6 -3 Z" fill="#ffd66b" />
                    <path d="M-6 -3 L0 0 L0 7 L-6 4 Z" fill="#f6a91f" />
                    <path d="M6 -3 L0 0 L0 7 L6 4 Z" fill="#e48c12" />
                </g>
            )
        case "kiwi":
            return (
                <g>
                    <circle r="8" fill="#7a5a36" />
                    <circle r="7" fill="#7cbf3a" />
                    <circle r="4.6" fill="#a6d76a" />
                    <circle r="2.6" fill="#eef6d2" />
                    {Array.from({ length: 9 }, (_, i) => {
                        const a = (i / 9) * Math.PI * 2
                        return <ellipse key={i} cx={Math.cos(a) * 3.8} cy={Math.sin(a) * 3.8} rx=".7" ry=".45" fill="#1d1d12" transform={`rotate(${(a * 180) / Math.PI} ${Math.cos(a) * 3.8} ${Math.sin(a) * 3.8})`} />
                    })}
                </g>
            )
        case "banana":
            return (
                <g>
                    <circle r="7" fill="#f8eab0" stroke="#e8cf6d" strokeWidth="1.4" />
                    <circle r="2.2" fill="none" stroke="#dcc57c" strokeWidth=".8" />
                    <circle cx="1" cy="-.4" r=".5" fill="#a08a4a" />
                    <circle cx="-.8" cy=".6" r=".5" fill="#a08a4a" />
                </g>
            )
        case "passion":
            return (
                <g>
                    <circle r="8" fill="#5d2a5f" />
                    <circle r="6.4" fill="#f6c02c" />
                    {[[-2, -2], [2, -2.4], [3, 1], [-1, 2.6], [-3, .6], [.6, 0]].map(([x, y], i) => (
                        <circle key={i} cx={x} cy={y} r=".9" fill="#2b2018" />
                    ))}
                </g>
            )
        default:
            return <circle r="4.6" fill={SPRINKLE_COLORS[v % SPRINKLE_COLORS.length]} />
    }
}

// ===== ממרח שוקולד =====

export function Spread({ d, gloss }) {
    return (
        <g>
            <path d={d} fill="#3f1e0f" />
            <path d={d} fill="none" stroke="#2a1207" strokeWidth="1.5" />
            <path d={gloss} fill="#a0674a" opacity=".45" />
        </g>
    )
}

// ===== נצנוץ קטן כשמשהו נוסף =====

export function Sparkle({ x, y, size = 7, delay = 0 }) {
    return (
        <g transform={`translate(${x} ${y})`}>
            <path className="dv-sparkle" style={{ "--d": `${delay}ms` }}
                d={`M0 ${-size} Q${size * 0.15} ${-size * 0.15} ${size} 0 Q${size * 0.15} ${size * 0.15} 0 ${size} Q${-size * 0.15} ${size * 0.15} ${-size} 0 Q${-size * 0.15} ${-size * 0.15} 0 ${-size} Z`}
                fill="#fff6c9" stroke="#f5c96a" strokeWidth=".8" />
        </g>
    )
}
