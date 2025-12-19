import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { FaSignOutAlt } from 'react-icons/fa';
import './AdminHeader.css';

const AdminHeader = () => {
    const { logout } = useAdmin();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <header className="admin-header">
            <div className="header-content">
                <div className="header-title">
                    <h1>E-Commerce Admin</h1>
                </div>
                <div className="header-actions">
                    <div className="admin-user">
                        <span className="user-name">Administrator</span>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
