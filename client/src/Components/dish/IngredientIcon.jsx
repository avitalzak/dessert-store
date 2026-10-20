import { useId } from "react"
import { describeOption, seeded } from "./dishScene"
import { Defs, Piece, Scoop, Whip, Spread } from "./dishArt"

// אייקון מצויר לרכיב בודד - מוצג בכרטיס האופציה כשאין תמונה או שהיא לא נטענה

const LIQUID_GLASS = "M-14 -18 L-11 18 Q-10.5 21 -7 21 L7 21 Q10.5 21 11 18 L14 -18 Z"

export default function IngredientIcon({ option, step, product }) {
    const u = "ic" + useId().replace(/[^a-zA-Z0-9]/g, "")
    const info = describeOption(option, step, product)

    let art
    switch (info.kind) {
        case "scoop":
            art = <g transform="translate(0 10)"><Scoop r={26} flavor={info.flavor} u={u} seed={option.label} /></g>
            break
        case "whip":
            art = <g transform="translate(0 14)"><Whip r={26} u={u} /></g>
            break
        case "syrup":
            art = (
                <g>
                    <ellipse cx="0" cy="22" rx="20" ry="5" fill={info.color} stroke={info.edge} strokeWidth="1" />
                    <path d="M0 -24 C8 -10 13 -2 13 6 C13 14 7 19 0 19 C-7 19 -13 14 -13 6 C-13 -2 -8 -10 0 -24 Z"
                        fill={info.color} stroke={info.edge} strokeWidth="1.5" />
                    <path d="M-6 0 C-7 6 -4 11 0 12" stroke={info.gloss} strokeWidth="2.4" fill="none" strokeLinecap="round" />
                </g>
            )
            break
        case "spread":
            art = (
                <g>
                    <Spread d="M-22 2 C-22 -12 -6 -16 6 -14 C18 -12 24 -4 22 6 C20 16 4 18 -8 16 C-18 14 -22 10 -22 2 Z"
                        gloss="M-12 -6 C-10 -10 0 -10 2 -8 C0 -5 -8 -4 -12 -6 Z" />
                </g>
            )
            break
        case "fruit":
            art = <g transform="scale(3)"><Piece type={info.type} u={u} /></g>
            break
        case "liquid":
            art = (
                <g>
                    <path d={LIQUID_GLASS} fill="#f2f8fb" stroke="#a9c3cf" strokeWidth="1.5" />
                    <path d="M-12.6 -6 L-10.6 18 Q-10.3 20 -7 20 L7 20 Q10.3 20 10.6 18 L12.6 -6 Z" fill={info.color} />
                    <ellipse cx="0" cy="-6" rx="12.6" ry="2.4" fill={info.color} stroke="#fff" strokeWidth=".8" />
                    <path d="M-9 -14 L-6 16" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".7" />
                </g>
            )
            break
        default: {
            const rand = seeded(option.label)
            const count = info.type === "sprinkles" ? 14 : info.type === "coconut" ? 10 : 6
            art = (
                <g style={{ filter: "drop-shadow(0 1px 1px rgba(60,30,10,.3))" }}>
                    {Array.from({ length: count }, (_, i) => {
                        const a = rand() * Math.PI * 2
                        const k = Math.sqrt(rand()) * 18
                        return (
                            <g key={i} transform={`translate(${Math.cos(a) * k} ${Math.sin(a) * k}) rotate(${(rand() * 2 - 1) * info.rot}) scale(${info.scale * 1.5})`}>
                                <Piece type={info.type} v={Math.floor(rand() * 1000)} u={u} />
                            </g>
                        )
                    })}
                </g>
            )
        }
    }

    return (
        <svg className="ingredient-icon" viewBox="-40 -40 80 80" aria-hidden="true">
            <Defs u={u} />
            <circle r="36" fill="#fff6ee" />
            {art}
        </svg>
    )
}
