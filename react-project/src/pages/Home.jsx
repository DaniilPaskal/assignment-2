import ProductList from "../data/ProductList.jsx";
import ProductCard from "../components/ProductCard.jsx";
import './../App.css';

export default function Home() {
    return (
        <>
            <div className="page-content">
                <h1>Welcome to DP Decor!</h1>
                <p>
                    Our store sells a variety of knick-knacks and bric-a-brac 
                    to infuse your home with beauty and coziness. Click on any of the
                    products below to add them to your cart! (Please register before
                    attempting to use the cart feature.)
                </p>
            </div>
            <div className="product-card-container">
                {ProductList.map((product) => {
                    // Display product cards
                    return (
                        <ProductCard product={product} key={product.id} />
                    );
                })}
            </div>
        </>
    );
}