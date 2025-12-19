import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaBox, FaShoppingCart, FaUsers, FaTags } from 'react-icons/fa';
import './AdminSidebar.css';

const AdminSidebar = () => {
    const navItems = [
        { path: '/admin/dashboard', icon: <FaHome />, label: 'Dashboard' },
        { path: '/admin/products', icon: <FaBox />, label: 'Products' },
        { path: '/admin/orders', icon: <FaShoppingCart />, label: 'Orders' },
        { path: '/admin/users', icon: <FaUsers />, label: 'Users' },
        { path: '/admin/categories', icon: <FaTags />, label: 'Categories' }
    ];

    return (
        <div className="admin-sidebar">
            <div className="admin-logo">
                <h2>Admin Panel</h2>
            </div>
            <nav className="admin-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default AdminSidebar;
