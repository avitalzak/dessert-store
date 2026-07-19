import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { GetCategories } from "../redux/Slice/categorySlice";
import { FaBuilding, FaCog, FaFingerprint, FaGrinStars, FaHandPointRight, FaHandPointUp, FaHeart, FaIceCream, FaTools } from "react-icons/fa"
import "../styles/home.css"

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
    navigate("/categories");
}


return (
        <div className="clean-fullscreen-container">
            <div className="clean-fullscreen-hero">
                
                {SLIDES.map((url, index) => (
                    <div 
                        key={index}
                        className={`clean-hero-slide ${index === currentSlide ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${url})` }}
                    ></div>
                ))}
                
                <div className="clean-hero-color-overlay"></div>
            
                <div className="clean-hero-content">
                    <h1 className="clean-main-title">ברוכים הבאים ל- LA CRÉATION DÉLICIEUSE</h1>
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
                <button 
                    className="clean-btn-luxury-oval" 
                    onClick={startOrder}
                    disabled={loading}
                >
                    {loading ? "טוען..." : "התחילו עכשיו!"}
                </button>
            </footer>

        </div>
    )
}