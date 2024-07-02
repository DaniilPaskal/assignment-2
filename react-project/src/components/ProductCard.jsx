import { Link } from "react-router-dom";
import './../App.css';

export default function ProductCard(props) {
    const product = props.product;

    return (
        <Link to={`/product/${product.id}`}>
            <div className="product-card">
                <h2>{product.name}</h2>

                <p className="product-price">
                    ${Number(product.price).toFixed(2)}
                </p>

                <img src={product.image} alt={product.name} />
                
                <p className="product-description">
                    {product.description}
                </p>
            </div>
        </Link>
    );
}