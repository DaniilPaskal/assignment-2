import { useState } from "react";
import { Button } from "reactstrap";

export default function ProductCounter (props) {
    const product = props.product;
    const setter = props.setter;
    const [quantity, setQuantity] = useState(product.quantity);

    // Increase local quantity and set quantity of product
    const handleIncrease = () => {
        setQuantity(quantity + 1);
        product.setQuantity(quantity + 1);

        // If received setter function, pass cost increase to setter
        if (setter) {
            setter(product.price);
        }
    }

    // Decrease local quantity and set quantity of product
    const handleDecrease = () => {
        setQuantity(quantity - 1);
        product.setQuantity(quantity - 1);

        // If received setter function, pass cost decrease to setter
        if (setter) {
            setter(-product.price);
        }
    }

    return (
        <div className="product-counter">
            <Button onClick={handleDecrease} disabled={quantity == 0}>-</Button>
            <p>{quantity}</p>
            <Button onClick={handleIncrease}>+</Button>
        </div>
    );
}