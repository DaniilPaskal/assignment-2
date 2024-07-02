import { useParams } from "react-router-dom";
import ProductList from "../data/ProductList";
import CurrentUser from "../data/CurrentUser";
import ProductCounter from "../components/ProductCounter";
import './../App.css';

export default function Product() {
    // Product code and product object
    const id = useParams().id;
    const product = ProductList[id];
    
    return (
        <div className="page-content">
            <div className="product-details-container">
                <img src={product.image} alt={product.name} />
                <div className="product-info">
                    <h1>{product.name}</h1>
                    <p className="product-price">
                        ${Number(product.price).toFixed(2)}
                    </p>
                    <p>{product.description}</p>

                    {CurrentUser.getStatus() ?
                        // If logged in, display product counter
                        <ProductCounter product={product} />
                        :
                        <p>Please log in to add this item to your cart.</p>
                    }
                </div>
            </div>
        </div>
    );
}