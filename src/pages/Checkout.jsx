import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
    const { cartItems, getTotalCartAmount, addresses, placeOrder } = useContext(ShopContext);
    const [selectedAddressId, setSelectedAddressId] = useState(addresses.length > 0 ? addresses[0].id : null);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const navigate = useNavigate();
    const totalAmount = getTotalCartAmount();

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            alert("Please select a shipping address.");
            return;
        }

        const address = addresses.find(addr => addr.id === selectedAddressId);

        if (paymentMethod === 'sslcommerz') {
            navigate('/payment/sslcommerz', { state: { totalAmount, address, paymentMethod: 'sslcommerz' } });
        } else {
            try {
                await placeOrder(paymentMethod, address);
                alert("Order placed successfully!");
                navigate('/profile');
            } catch (error) {
                // Error already handled in placeOrder
            }
        }
    };

    if (cartItems.length === 0) {
        return <div className="container checkout-page"><h1>Your cart is empty</h1></div>;
    }

    return (
        <div className="checkout-page container">
            <h1 className="page-title glow-text">Checkout</h1>
            <div className="checkout-content">
                <div className="checkout-section glow-box">
                    <h2>1. Select Shipping Address</h2>
                    {addresses.length > 0 ? (
                        <div className="address-selection">
                            {addresses.map((addr) => (
                                <div
                                    key={addr.id}
                                    className={`address-option ${selectedAddressId === addr.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedAddressId(addr.id)}
                                >
                                    <p><strong>{addr.street}</strong></p>
                                    <p>{addr.city}, {addr.state} {addr.zip}</p>
                                    <p>{addr.country}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No addresses found. Please add an address in your Profile.</p>
                    )}
                </div>

                <div className="checkout-section glow-box">
                    <h2>2. Select Payment Method</h2>
                    <div className="payment-selection">
                        <div
                            className={`payment-option ${paymentMethod === 'sslcommerz' ? 'selected' : ''}`}
                            onClick={() => setPaymentMethod('sslcommerz')}
                        >
                            <img src="https://securepay.sslcommerz.com/public/image/sslcommerz.png" alt="SSLCommerz" className="payment-logo" />
                            <span>Pay with SSLCommerz</span>
                        </div>
                        <div
                            className={`payment-option ${paymentMethod === 'nagad' ? 'selected' : ''}`}
                            onClick={() => setPaymentMethod('nagad')}
                        >
                            <span>Nagad</span>
                        </div>
                        <div
                            className={`payment-option ${paymentMethod === 'rocket' ? 'selected' : ''}`}
                            onClick={() => setPaymentMethod('rocket')}
                        >
                            <span>Rocket</span>
                        </div>
                        <div
                            className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                            onClick={() => setPaymentMethod('cod')}
                        >
                            <span>Cash on Delivery</span>
                        </div>
                    </div>
                </div>

                <div className="checkout-summary glow-box">
                    <h2>Order Summary</h2>
                    {cartItems.map((item) => (
                        <div key={item.id} className="summary-item-row">
                            <span>{item.product_name} x {item.quantity}</span>
                            <span>৳{(item.product_price * item.quantity).toLocaleString()}</span>
                        </div>
                    ))}
                    <div className="summary-total">
                        <span>Total</span>
                        <span>৳{totalAmount.toLocaleString()}</span>
                    </div>
                    <button className="btn place-order-btn" onClick={handlePlaceOrder}>Place Order</button>
                </div>
            </div >
        </div >
    );
};

export default Checkout;
