import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { FaBox, FaShoppingCart, FaDollarSign, FaClock } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
    const { getStats, orders, loading } = useAdmin();
    const stats = getStats();

    const recentOrders = orders.slice(0, 5);

    const getStatusClass = (status) => {
        const statusClasses = {
            pending: 'status-pending',
            processing: 'status-processing',
            shipped: 'status-shipped',
            delivered: 'status-delivered'
        };
        return statusClasses[status] || '';
    };

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1>Dashboard</h1>
                <p>Welcome to your admin panel</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon products">
                        <FaBox />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.totalProducts}</h3>
                        <p>Total Products</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon orders">
                        <FaShoppingCart />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.totalOrders}</h3>
                        <p>Total Orders</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon revenue">
                        <FaDollarSign />
                    </div>
                    <div className="stat-info">
                        <h3>৳{stats.totalRevenue.toLocaleString()}</h3>
                        <p>Total Revenue</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon pending">
                        <FaClock />
                    </div>
                    <div className="stat-info">
                        <h3>{stats.pendingOrders}</h3>
                        <p>Pending Orders</p>
                    </div>
                </div>
            </div>

            <div className="recent-orders-section">
                <h2>Recent Orders</h2>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Order Number</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.length > 0 ? (
                                recentOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td><strong>{order.order_number}</strong></td>
                                        <td>{order.customer_name}</td>
                                        <td>{order.date}</td>
                                        <td>৳{parseFloat(order.total).toLocaleString()}</td>
                                        <td>
                                            <span className={`status-badge ${getStatusClass(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                                        No orders found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
