import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { CartItem } from "../types/CartItem";
import { useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';



function PurchasePage() {
    
    const location = useLocation();
    const { price } = location.state || { price: 0 };
    const navigate = useNavigate();
    const { title, bookId } = useParams();
    const { addtoCart } = useCart();

    const handleAddToCart = () => {
        const newItem: CartItem = {
            bookId: Number(bookId),
            title: title ?? "No project found",
            price: price,
            quantity: 0,
            subtotal: price.bookId
        };
        addtoCart(newItem);
        navigate('/cart');
    }; 

    return (
        <>
            <h2>Purchase {title}</h2>

            <div>
                <p>
                    Price: <strong>${price.toFixed(2)}</strong>
                </p>

                <button onClick={handleAddToCart}>Add to cart</button>
            </div>

            <button onClick={() => navigate(-1)}>Go back</button>
        </>
    );
}

export default PurchasePage;
