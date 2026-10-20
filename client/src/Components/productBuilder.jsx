import { useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { goToNextStep, goToPrevStep, toggleOption, startBuild } from "../redux/Slice/productSlice"
import DishPreview from "./DishPreview"
import StepScreen from "./stepScreen"
import "../styles/ProductBuilder.css"
import "../styles/DishVisualizer.css"

export default function ProductBuilder() {
    const { productId } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // const category = useSelector(c => c.c)
    const products = useSelector(s => s.products.products)
    const selectedProduct = useSelector(s => s.products.selectedProduct)
    const currentStepIndex = useSelector(s => s.products.currentStepIndex)
    const selections = useSelector(s => s.products.selections)
    const initializedForProductId = useRef(null)

    useEffect(() => {
        //האם אני באמצע תהליך כבר של פריט
        if (initializedForProductId.current === productId) {
            return
        }
        const product = products.find(p => p._id === productId)
        if (product) {
            dispatch(startBuild(product))
            initializedForProductId.current = productId
        }
    }, [productId, products, dispatch])

    if (!selectedProduct || selectedProduct._id !== productId) {
        return <p>טוען...</p>
    }
    //האם אנחנו בשלב האחרון
    const isLastStep = currentStepIndex === selectedProduct.steps.length - 1
    //שלב נוכחי
    const currentStep = selectedProduct.steps[currentStepIndex]
    //הבחירות של השלב הנוכחי
    const chosenInStep = selections[currentStepIndex] || []
    //האם הוא יכול להמשיך כי הוא בחר כבר
    const canProceed = chosenInStep.length >= currentStep.minSelect

    // פירוט המנה בתחתית המסך - כל הבחירות עד עכשיו, לפי שלבים
    const pickedGroups = selectedProduct.steps
        .map((step, stepIndex) => ({
            stepIndex,
            title: step.title,
            options: selections[stepIndex] || []
        }))
        .filter(group => group.options.length > 0)

    const handleNext = () => {
        if (isLastStep) {
            //בשלב האחרון - ניווט לסיכום 
            navigate(`/products/build/${productId}/summary`)
        } else {
            dispatch(goToNextStep())
        }
    }


    return (
        <div className="kiosk-builder-wrapper">

            <main className="kiosk-main-content">
              <div className="builder-layout">
                <div className="builder-steps">
                <div className="at-progress atelier-only">
                    <span className="at-progress-name">{selectedProduct.name}</span>
                    <div className="at-progress-track">
                        {selectedProduct.steps.map((_, i) => (
                            <span key={i} className={i <= currentStepIndex ? "on" : ""} />
                        ))}
                    </div>
                    <span className="at-progress-count">
                        {String(currentStepIndex + 1).padStart(2, "0")} / {String(selectedProduct.steps.length).padStart(2, "0")}
                    </span>
                </div>
                <StepScreen
                    step={currentStep}
                    product={selectedProduct}
                    chosen={chosenInStep}
                    onToggle={(option) => dispatch(toggleOption({ stepIndex: currentStepIndex, option }))}
                />
                </div>

                {/* המנה נבנית ויזואלית מול המשתמש */}
                <aside className="builder-stage">
                    <DishPreview />
                </aside>
              </div>
            </main>


            <footer className="kiosk-footer-bar">
                <div className="build-breakdown kiosk-only">
                    <div className="bb-head">
                        <span className="bb-name">{selectedProduct.name}</span>
                        <span className="bb-price">₪{selectedProduct.price}</span>
                    </div>
                    <div className="bb-chips">
                        {pickedGroups.length === 0 ? (
                            <span className="bb-empty">בחרו רכיבים והם יופיעו כאן</span>
                        ) : pickedGroups.map(group => (
                            <span key={group.stepIndex} className="bb-group">
                                <span className="bb-step">{group.title}</span>
                                {group.options.map(option => (
                                    <button
                                        key={option.label}
                                        className="bb-chip"
                                        onClick={() => dispatch(toggleOption({ stepIndex: group.stepIndex, option }))}
                                        aria-label={`הסרת ${option.label}`}
                                    >
                                        {option.label}
                                        <span className="bb-x">×</span>
                                    </button>
                                ))}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="kiosk-nav-buttons">
                        {currentStepIndex > 0 && (
                            <button className="kiosk-btn-back" onClick={() => dispatch(goToPrevStep())}>
                                חזרה
                            </button>
                    )}

                    <button 
                        className="kiosk-btn-next" 
                        disabled={!canProceed} 
                        onClick={handleNext}
                    >
                        {isLastStep ? "לסיכום המנה" : "המשך ←"}
                    </button>
                </div>
            </footer>
        </div>
    )
}