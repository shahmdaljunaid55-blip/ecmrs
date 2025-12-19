import React, { useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { getStatusIcon, formatNotificationTime } from '../utils/notificationUtils';
import { FaBell, FaCheck, FaTrash } from 'react-icons/fa';
import './Notifications.css';

const Notifications = () => {
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications
    } = useContext(ShopContext);

    // Mark all as read when page is viewed
    useEffect(() => {
        if (unreadCount > 0) {
            markAllAsRead();
        }
    }, []);

    const handleNotificationClick = (notification) => {
        if (!notification.is_read) {
            markAsRead(notification.id);
        }
    };

    const handleDelete = (e, notificationId) => {
        e.stopPropagation();
        deleteNotification(notificationId);
    };

    const handleClearAll = () => {
        if (window.confirm('Are you sure you want to clear all notifications?')) {
            clearAllNotifications();
        }
    };

    return (
        <div className="notifications-page container">
            <div className="notifications-header">
                <h1 className="page-title glow-text">
                    <FaBell /> Notifications
                </h1>
                {notifications.length > 0 && (
                    <button
                        className="btn clear-all-btn"
                        onClick={handleClearAll}
                    >
                        Clear All
                    </button>
                )}
            </div>

            <div className="notifications-content">
                {notifications.length === 0 ? (
                    <div className="empty-notifications glow-box">
                        <FaBell className="empty-icon" />
                        <h3>No notifications yet</h3>
                        <p>You'll receive notifications when your order status changes.</p>
                    </div>
                ) : (
                    <div className="notifications-list">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`notification-item glow-box ${notification.is_read ? 'read' : 'unread'} status-${notification.status}`}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className="notification-icon">
                                    {getStatusIcon(notification.status)}
                                </div>
                                <div className="notification-content">
                                    <div className="notification-header">
                                        <h3>Order {notification.order_number}</h3>
                                        {!notification.is_read && (
                                            <span className="unread-badge">New</span>
                                        )}
                                    </div>
                                    <p className="notification-message">{notification.message}</p>
                                    <span className="notification-time">
                                        {formatNotificationTime(new Date(notification.created_at).getTime())}
                                    </span>
                                </div>
                                <button
                                    className="delete-notification-btn"
                                    onClick={(e) => handleDelete(e, notification.id)}
                                    title="Delete notification"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
