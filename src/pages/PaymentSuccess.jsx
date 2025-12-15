import React, { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { FaCheckCircle } from 'react-icons/fa';
import './Payment.css';

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { placeOrder } = useContext(ShopContext);
    const { totalAmount, address, paymentMethod } = location.state || {};

    useEffect(() => {
        if (totalAmount && address) {
            // Actually place the order in the system
            placeOrder(paymentMethod, address);

            // Redirect to profile after 5 seconds
            const timer = setTimeout(() => {
                navigate('/profile');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, []);

    if (!totalAmount) {
        return <div className="payment-container">Invalid Session</div>;
    }

    return (
        <div className="payment-result-page container">
            <div className="result-card glow-box success">
                <FaCheckCircle className="result-icon" />
                <h1>Payment Successful!</h1>
                <p>Your transaction has been completed.</p>
                <div className="result-details">
                    <p>Amount Paid: <strong>৳{totalAmount.toLocaleString()}</strong></p>
                    <p>Transaction ID: <strong>TXN_{Date.now()}</strong></p>
                </div>
                <p className="redirect-msg">Redirecting to your profile...</p>
                <button className="btn" onClick={() => navigate('/profile')}>Go to Profile Now</button>
            </div>
        </div>
    );
};

export default PaymentSuccess;
