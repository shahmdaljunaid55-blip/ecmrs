import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import ClerkProfileSection from '../components/ClerkProfileSection';
import './Profile.css';

const Profile = () => {
    const { userProfile, orders, addresses, addAddress, updateAddress, deleteAddress, updateMobile } = useContext(ShopContext);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [isEditingMobile, setIsEditingMobile] = useState(false);
    const [currentAddress, setCurrentAddress] = useState(null);
    const [mobileInput, setMobileInput] = useState('');
    const [formData, setFormData] = useState({
        full_name: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'Bangladesh',
        phone: '',
        is_default: false
    });

    const bangladeshStates = ["Dhaka", "Chittagong", "Rajshahi", "Khulna", "Barisal", "Sylhet", "Rangpur", "Mymensingh"];

    if (!userProfile) {
        return (
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        );
    }

    const handleEditClick = (address) => {
        setCurrentAddress(address);
        setFormData(address);
        setIsEditingAddress(true);
    };

    const handleAddClick = () => {
        setCurrentAddress(null);
        setFormData({
            full_name: userProfile.name || '',
            street: '',
            city: '',
            state: '',
            zip: '',
            country: 'Bangladesh',
            phone: '',
            is_default: false
        });
        setIsEditingAddress(true);
    };

    const handleDeleteClick = (id) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            deleteAddress(id);
        }
    };

    const handleFormChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (currentAddress) {
            updateAddress(currentAddress.id, formData);
        } else {
            addAddress(formData);
        }
        setIsEditingAddress(false);
    };

    const handleMobileUpdate = () => {
        updateMobile(mobileInput);
        setIsEditingMobile(false);
    };

    return (
        <div className="profile-page container">
            <h1 className="page-title glow-text">Swagotom, {userProfile.name}!</h1>
            <div className="profile-content">
                <div className="profile-card glow-box">
                    <div className="profile-header">
                        <div className="avatar">
                            {userProfile.image ? (
                                <img src={userProfile.image} alt={userProfile.name} />
                            ) : (
                                userProfile.name ? userProfile.name.charAt(0) : 'U'
                            )}
                        </div>
                        <h2>{userProfile.name}</h2>
                        <p>{userProfile.email}</p>

                        <div className="mobile-section">
                            {isEditingMobile ? (
                                <div className="mobile-edit">
                                    <input
                                        type="text"
                                        placeholder="Enter Mobile Number (+880...)"
                                        value={mobileInput}
                                        onChange={(e) => setMobileInput(e.target.value)}
                                    />
                                    <button className="btn save-btn" onClick={handleMobileUpdate}>Save</button>
                                    <button className="btn cancel-btn" onClick={() => setIsEditingMobile(false)}>Cancel</button>
                                </div>
                            ) : (
                                <p className="mobile-display" onClick={() => {
                                    setMobileInput(userProfile.mobile || '');
                                    setIsEditingMobile(true);
                                }}>
                                    {userProfile.mobile ? userProfile.mobile : 'Add Mobile Number'} ✎
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="profile-section glow-box">
                    <div className="section-header">
                        <h3>Shipping Addresses</h3>
                        <button className="btn add-btn" onClick={handleAddClick}>Add New Address</button>
                    </div>

                    {isEditingAddress && (
                        <form className="address-form" onSubmit={handleFormSubmit}>
                            <input
                                type="text"
                                name="full_name"
                                placeholder="Full Name"
                                value={formData.full_name}
                                onChange={handleFormChange}
                                required
                            />
                            <input
                                type="text"
                                name="street"
                                placeholder="Street Address/House No."
                                value={formData.street}
                                onChange={handleFormChange}
                                required
                            />
                            <input
                                type="text"
                                name="city"
                                placeholder="City/District"
                                value={formData.city}
                                onChange={handleFormChange}
                                required
                            />
                            <select
                                name="state"
                                value={formData.state}
                                onChange={handleFormChange}
                                required
                            >
                                <option value="">Select Division/State</option>
                                {bangladeshStates.map(state => <option key={state} value={state}>{state}</option>)}
                            </select>
                            <input
                                type="text"
                                name="zip"
                                placeholder="Postal/ZIP Code"
                                value={formData.zip}
                                onChange={handleFormChange}
                                required
                            />
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone Number (Optional)"
                                value={formData.phone}
                                onChange={handleFormChange}
                            />
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="is_default"
                                    checked={formData.is_default}
                                    onChange={handleFormChange}
                                />
                                Set as default address
                            </label>
                            <div className="form-actions">
                                <button type="submit" className="btn save-btn">Save</button>
                                <button type="button" className="btn cancel-btn" onClick={() => setIsEditingAddress(false)}>Cancel</button>
                            </div>
                        </form>
                    )}

                    <div className="address-list">
                        {addresses.length > 0 ? (
                            addresses.map((addr) => (
                                <div key={addr.id} className={`address-item ${addr.is_default ? 'default-address' : ''}`}>
                                    {addr.is_default && <span className="default-badge">Default</span>}
                                    <p><strong>{addr.full_name}</strong></p>
                                    <p>{addr.street}</p>
                                    <p>{addr.city}, {addr.state} {addr.zip}</p>
                                    <p>{addr.country}</p>
                                    {addr.phone && <p>Phone: {addr.phone}</p>}
                                    <div className="address-actions">
                                        <button className="btn edit-btn" onClick={() => handleEditClick(addr)}>Edit</button>
                                        <button className="btn delete-btn" onClick={() => handleDeleteClick(addr.id)}>Delete</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No addresses saved.</p>
                        )}
                    </div>
                </div>

                <div className="profile-section glow-box">
                    <h3>Order History</h3>
                    {orders.length > 0 ? (
                        <div className="orders-list">
                            {orders.map((order) => (
                                <div key={order.id} className="order-item">
                                    <div className="order-header">
                                        <div className="order-info-top">
                                            <span className="order-date">Date: {order.date}</span>
                                            <span className="order-total">Total: ৳{order.total.toLocaleString()}</span>
                                        </div>
                                        <div className="order-info-bottom">
                                            <span className="order-payment">Payment: {order.paymentMethod ? order.paymentMethod.toUpperCase() : 'N/A'}</span>
                                            <span className="order-address">
                                                Ship to: {order.address ? `${order.address.street}, ${order.address.city}` : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="order-items">
                                        {order.items && order.items.length > 0 ? (
                                            order.items.map((item, index) => (
                                                <div key={item.id || index} className="order-product">
                                                    <span>{item.name} x {item.quantity}</span>
                                                    <span>৳{(item.price * item.quantity).toLocaleString()}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No items</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No orders yet.</p>
                    )}
                </div>

                {/* Clerk Account Settings */}
                <ClerkProfileSection />
            </div>
        </div>
    );
};

export default Profile;
