import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { GetCategories } from "../redux/Slice/categorySlice";
import { FaBuilding, FaCog, FaFingerprint, FaGrinStars, FaHandPointRight, FaHandPointUp, FaHeart, FaIceCream, FaTools } from "react-icons/fa"
import "../styles/home.css"
import HeroFilm from "./HeroFilm"
import { isTheme } from "../theme/theme"
import { MENU_PATH } from "../Services/menuStart"

const SLIDES = [
          "https://res.cloudinary.com/ectvziwy/image/upload/v1783535253/%D7%A6%D7%99%D7%9C%D7%95%D7%9D_%D7%9E%D7%A1%D7%9A_2026-07-07_132344_yttxpg.png",
          "https://res.cloudinary.com/ectvziwy/image/upload/v1783535768/%D7%A6%D7%99%D7%9C%D7%95%D7%9D_%D7%9E%D7%A1%D7%9A_2026-07-07_230359_axeqwm.png"
    ];

export default function Home() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    //const categories = useSelector(state => state.categories.categories)
    const loading = useSelector(state => state.categories.loading)
    const [currentSlide, setCurrentSlide] = useState(0);

    


    useEffect(() => {
        dispatch(GetCategories())
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [dispatch, SLIDES.length])

    function startOrder() {
    navigate(MENU_PATH);
}


return (
        <div className="clean-fullscreen-container">
            <div className="clean-fullscreen-hero">
                
                {isTheme("rose") || isTheme("kiosk") ? (
                    // התמונות ב-SLIDES הן צילומי מסך של האתר עצמו (עם הסרגל), ולכן לא נכנסות לסרטון
                    <HeroFilm />
                ) : SLIDES.map((url, index) => (
                    <div 
                        key={index}
                        className={`clean-hero-slide ${index === currentSlide ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${url})` }}
                    ></div>
                ))}
                
                <div className="clean-hero-color-overlay"></div>

                <svg className="noir-badge noir-only" viewBox="0 0 200 200" aria-hidden="true">
                    <defs>
                        <path id="noirBadgeCircle" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
                    </defs>
                    <text className="noir-badge-ring">
                        <textPath href="#noirBadgeCircle">FAIT MAISON ✦ PÂTISSERIE ✦ GLACIER ✦ AVEC AMOUR ✦</textPath>
                    </text>
                    <text className="noir-badge-mark" x="100" y="114" textAnchor="middle">LC</text>
                </svg>
            
                <div className="clean-hero-content">
                    <span className="at-eyebrow atelier-only">Pâtisserie artisanale · Fait maison</span>
                    <h1 className="clean-main-title">ברוכים הבאים ל- <span className="clean-title-brand">LA CRÉATION DÉLICIEUSE</span></h1>
                    <p className="clean-subtitle">תתחילו ליצור את הקינוח המושלם שלכם</p>
                </div>
              
                <div className="promo-circles-container">
                    <div className="promo-circle">
                        <div className="circle-icon"><FaHandPointUp/></div>
                        <span>בוחרים</span>
                    </div>
            
                    <div className="promo-circle">
                        <div className="circle-icon"><FaIceCream/></div>
                        <span>מרכיבים</span>
                    </div>
            
                    <div className="promo-circle">
                        <div className="circle-icon"><FaHeart/></div>
                        <span>נהנים</span>
                    </div>
                </div>
            </div>

            <footer className="clean-footer-action">
                <span className="tap-hint kiosk-only" aria-hidden="true"><FaHandPointUp /></span>
                <button 
                    className="clean-btn-luxury-oval" 
                    onClick={startOrder}
                    disabled={loading}
                >
                    {loading ? "טוען..." : "התחילו עכשיו!"}
                </button>
            </footer>

            <div className="noir-marquee noir-only" aria-hidden="true">
                <div className="noir-marquee-track">
                    {[0, 1].map(k => (
                        <span key={k}>
                            Pâtisserie ✦ Glacier ✦ Gaufres ✦ Crêpes ✦ Milkshakes ✦ Fait maison ✦&nbsp;
                            Pâtisserie ✦ Glacier ✦ Gaufres ✦ Crêpes ✦ Milkshakes ✦ Fait maison ✦&nbsp;
                        </span>
                    ))}
                </div>
            </div>

        </div>
    )
}