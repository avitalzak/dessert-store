import { useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { goToNextStep, goToPrevStep, toggleOption, startBuild } from "../redux/Slice/productSlice"
// import DishPreview from "./DishPreview"
import StepScreen from "./StepScreen"
import "../styles/ProductBuilder.css"

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
                <StepScreen
                    step={currentStep}
                    chosen={chosenInStep}
                    onToggle={(option) => dispatch(toggleOption({ stepIndex: currentStepIndex, option }))}
                />
            </main>


            <footer className="kiosk-footer-bar">
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