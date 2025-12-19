import React, { useEffect, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { FaCheckCircle } from 'react-icons/fa';
import './Payment.css'; // Changed from Payment.css to PaymentSuccess.css

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { placeOrder } = useContext(ShopContext);
    const hasPlacedOrder = useRef(false);

    // Extract totalAmount, address, paymentMethod directly from location.state for rendering
    const { totalAmount, address, paymentMethod } = location.state || {};

    useEffect(() => {
        const handleOrderPlacement = async () => {
            if (totalAmount && address && !hasPlacedOrder.current) {
                hasPlacedOrder.current = true;
                try {
                    // Actually place the order in the system
                    await placeOrder(paymentMethod, address);
                    console.log('Order placed successfully from payment');
                } catch (error) {
                    console.error('Error placing order:', error);
                }
            }
        };

        handleOrderPlacement();

        // Redirect to profile after 5 seconds
        const timer = setTimeout(() => {
            navigate('/profile');
        }, 5000);

        return () => clearTimeout(timer);
    }, [totalAmount, address, paymentMethod, placeOrder, navigate]);

    if (!totalAmount) {
        return <div className="payment-container">Invalid Session</div>;
    }

    return (
        <div className="payment-result-page container">
            <div className="result-card glow-box success-modern">
                <div className="icon-wrapper">
                    <FaCheckCircle className="result-icon-modern" />
                </div>
                <h1 className="success-title">Order Confirmed!</h1>
                <p className="success-message">Your order has been placed successfully. You will get a confirmation email shortly.</p>

                <div className="order-receipt">
                    <div className="receipt-row">
                        <span>Amount Paid</span>
                        <span className="price">৳{totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="receipt-row">
                        <span>Transaction ID</span>
                        <span className="txn">TXN_{Date.now().toString().slice(-8)}</span>
                    </div>
                </div>

                <p className="redirect-msg">We are redirecting you to your profile...</p>
                <button className="btn btn-modern-outline" onClick={() => navigate('/profile')}>Go to Profile Now</button>
            </div>
        </div>
    );
};

export default PaymentSuccess;
