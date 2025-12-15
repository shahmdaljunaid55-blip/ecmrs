import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, updateCartItemCount, getTotalCartAmount, placeOrder } = useContext(ShopContext);
    const totalAmount = getTotalCartAmount();

    return (
        <div className="cart-page container">
            <h1 className="page-title glow-text">Your Shopping Cart</h1>
            {cartItems.length > 0 ? (
                <div className="cart-content">
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item glow-box">
                                <img src={item.image} alt={item.name} />
                                <div className="item-details">
                                    <h3>{item.name}</h3>
                                    <p>৳{item.price.toLocaleString()}</p>
                                    <div className="quantity-handler">
                                        <button onClick={() => updateCartItemCount(item.quantity - 1, item.id)} disabled={item.quantity === 1}>-</button>
                                        <input value={item.quantity} onChange={(e) => updateCartItemCount(Number(e.target.value), item.id)} />
                                        <button onClick={() => updateCartItemCount(item.quantity + 1, item.id)}>+</button>
                                    </div>
                                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="checkout-section glow-box">
                        <h2>Summary</h2>
                        <div className="summary-item">
                            <span>Subtotal</span>
                            <span>৳{totalAmount.toLocaleString()}</span>
                        </div>
                        <Link to="/checkout" className="btn checkout-btn">Proceed to Checkout</Link>
                        <Link to="/" className="continue-shopping">Continue Shopping</Link>
                    </div>
                </div>
            ) : (
                <div className="empty-cart">
                    <p>Your cart is empty.</p>
                    <Link to="/" className="btn">Start Shopping</Link>
                </div>
            )}
        </div>
    );
};

export default Cart;
