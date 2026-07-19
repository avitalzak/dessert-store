import "../styles/ProductCard.css"

export default function ProductCard({ product, onClick }) {


    
    return (

        
        <div className="product-card" onClick={onClick}>
            <div className="product-image">
                <img src={product.image} alt={product.name} />
            </div>

            <div className="product-info">
                <h3>{product.name}</h3>

                {product.description && (
                    <p>{product.description}</p>
                )}
                <span className="price">₪{product.price}</span>

                
            </div>
        </div>
    )
}