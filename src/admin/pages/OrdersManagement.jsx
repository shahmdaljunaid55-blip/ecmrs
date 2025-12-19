import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import './OrdersManagement.css';

const OrdersManagement = () => {
    const { orders, updateOrderStatus, loading, refreshData } = useAdmin();
    const [filter, setFilter] = useState('all');
    const [updating, setUpdating] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(order => order.status === filter);

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdating(orderId);
        try {
            await updateOrderStatus(orderId, newStatus);
            // Success feedback could be added here
        } catch (error) {
            alert('Failed to update order status. Please try again.');
        } finally {
            setUpdating(null);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await refreshData();
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setRefreshing(false);
        }
    };

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
            <div className="orders-management-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-management-page">
            <div className="page-header">
                <div>
                    <h1>Orders Management</h1>
                    <p>Manage and track customer orders</p>
                </div>
                <button
                    onClick={handleRefresh}
                    className="refresh-btn"
                    disabled={refreshing}
                >
                    {refreshing ? 'Refreshing...' : 'Refresh Orders'}
                </button>
            </div>

            <div className="filter-section">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All Orders ({orders.length})
                </button>
                <button
                    className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilter('pending')}
                >
                    Pending ({orders.filter(o => o.status === 'pending').length})
                </button>
                <button
                    className={`filter-btn ${filter === 'processing' ? 'active' : ''}`}
                    onClick={() => setFilter('processing')}
                >
                    Processing ({orders.filter(o => o.status === 'processing').length})
                </button>
                <button
                    className={`filter-btn ${filter === 'shipped' ? 'active' : ''}`}
                    onClick={() => setFilter('shipped')}
                >
                    Shipped ({orders.filter(o => o.status === 'shipped').length})
                </button>
                <button
                    className={`filter-btn ${filter === 'delivered' ? 'active' : ''}`}
                    onClick={() => setFilter('delivered')}
                >
                    Delivered ({orders.filter(o => o.status === 'delivered').length})
                </button>
            </div>

            <div className="orders-table-section">
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td><strong>{order.order_number}</strong></td>
                                        <td>{order.customer_name}</td>
                                        <td>{order.date}</td>
                                        <td>
                                            <div className="order-items">
                                                {order.items && order.items.length > 0 ? (
                                                    order.items.map((item, idx) => (
                                                        <div key={idx} className="item-detail">
                                                            {item.name} x{item.quantity}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="item-detail">No items</div>
                                                )}
                                            </div>
                                        </td>
                                        <td>৳{parseFloat(order.total).toLocaleString()}</td>
                                        <td>
                                            <span className={`status-badge ${getStatusClass(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className="status-select"
                                                disabled={updating === order.id}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                            </select>
                                            {updating === order.id && (
                                                <span className="updating-indicator"> Updating...</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                                        No orders found for this filter
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

export default OrdersManagement;
