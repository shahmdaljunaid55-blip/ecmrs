import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';
import './Payment.css';

const PaymentFail = () => {
    const navigate = useNavigate();

    return (
        <div className="payment-result-page container">
            <div className="result-card glow-box fail">
                <FaTimesCircle className="result-icon" />
                <h1>Payment Failed</h1>
                <p>Your transaction was cancelled or failed.</p>
                <button className="btn" onClick={() => navigate('/checkout')}>Try Again</button>
            </div>
        </div>
    );
};

export default PaymentFail;
