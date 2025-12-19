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
                <div className="cart-container-redesigned">
                    <div className="cart-items-list">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item-modern">
                                <div className="item-image-wrapper">
                                    <img src={item.product_image} alt={item.product_name} />
                                </div>
                                <div className="item-info-modern">
                                    <h3>{item.product_name}</h3>
                                    <p className="item-price">৳{item.product_price.toLocaleString()}</p>
                                </div>
                                <div className="item-actions-modern">
                                    <div className="quantity-pill">
                                        <button onClick={() => updateCartItemCount(item.product_id, item.quantity - 1)} disabled={item.quantity === 1}>−</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateCartItemCount(item.product_id, item.quantity + 1)}>+</button>
                                    </div>
                                    <button className="remove-link" onClick={() => removeFromCart(item.product_id)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary-modern glow-box">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>৳{totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="divider"></div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>৳{totalAmount.toLocaleString()}</span>
                        </div>

                        <div className="checkout-actions">
                            <Link to="/checkout" className="btn checkout-btn-modern">Proceed to Checkout</Link>
                            <Link to="/" className="continue-link">Continue Shopping</Link>
                        </div>
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
