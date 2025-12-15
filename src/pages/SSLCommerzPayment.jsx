import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Payment.css';

const SSLCommerzPayment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { totalAmount, address } = location.state || {};
    const [activeTab, setActiveTab] = useState('cards');

    if (!totalAmount) {
        return <div className="payment-container">Invalid Session</div>;
    }

    const handleSuccess = () => {
        // Simulate processing time
        setTimeout(() => {
            navigate('/payment/success', { state: { totalAmount, address, paymentMethod: 'sslcommerz' } });
        }, 1500);
    };

    const handleFail = () => {
        navigate('/payment/fail');
    };

    return (
        <div className="ssl-payment-wrapper">
            <div className="ssl-header">
                <img src="https://securepay.sslcommerz.com/public/image/sslcommerz.png" alt="SSLCommerz" className="ssl-logo" />
                <div className="store-info">
                    <p>Merchant: <strong>Luminous Lux</strong></p>
                    <p>Amount: <strong>৳{totalAmount.toLocaleString()}</strong></p>
                </div>
            </div>

            <div className="ssl-body">
                <div className="ssl-sidebar">
                    <div className={`ssl-tab ${activeTab === 'cards' ? 'active' : ''}`} onClick={() => setActiveTab('cards')}>Cards</div>
                    <div className={`ssl-tab ${activeTab === 'mobile' ? 'active' : ''}`} onClick={() => setActiveTab('mobile')}>Mobile Banking</div>
                    <div className={`ssl-tab ${activeTab === 'net' ? 'active' : ''}`} onClick={() => setActiveTab('net')}>Net Banking</div>
                </div>

                <div className="ssl-content">
                    {activeTab === 'cards' && (
                        <div className="card-form">
                            <h3>Pay with Card</h3>
                            <input type="text" placeholder="Card Number" className="ssl-input" />
                            <div className="ssl-row">
                                <input type="text" placeholder="MM/YY" className="ssl-input" />
                                <input type="text" placeholder="CVC" className="ssl-input" />
                            </div>
                            <input type="text" placeholder="Card Holder Name" className="ssl-input" />
                            <button className="ssl-pay-btn" onClick={handleSuccess}>Pay Now</button>
                        </div>
                    )}

                    {activeTab === 'mobile' && (
                        <div className="mobile-options">
                            <h3>Select Mobile Banking</h3>
                            <div className="mfs-grid">
                                <div className="mfs-option" onClick={handleSuccess}>Bkash</div>
                                <div className="mfs-option" onClick={handleSuccess}>Nagad</div>
                                <div className="mfs-option" onClick={handleSuccess}>Rocket</div>
                                <div className="mfs-option" onClick={handleSuccess}>Upay</div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'net' && (
                        <div className="net-options">
                            <h3>Select Bank</h3>
                            <select className="ssl-input">
                                <option>City Bank</option>
                                <option>BRAC Bank</option>
                                <option>Dutch Bangla Bank</option>
                            </select>
                            <button className="ssl-pay-btn" onClick={handleSuccess}>Proceed</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="ssl-footer">
                <button className="ssl-cancel-btn" onClick={handleFail}>Cancel Transaction</button>
                <p>Secured by SSLCommerz</p>
            </div>
        </div>
    );
};

export default SSLCommerzPayment;
