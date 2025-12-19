/**
 * Utility functions for the notification system
 */

/**
 * Get user-friendly message for order status changes
 * @param {string} status - Order status (pending, processing, shipped, delivered)
 * @returns {string} User-friendly message
 */
export const getStatusMessage = (status) => {
    const messages = {
        pending: 'Your order has been placed and is pending confirmation.',
        processing: 'Great news! Your order is now being processed.',
        shipped: 'Your order has been shipped! 📦',
        delivered: 'Your order has been delivered! ✅'
    };
    return messages[status] || `Your order status has been updated to: ${status}`;
};

/**
 * Get icon/emoji for order status
 * @param {string} status - Order status
 * @returns {string} Emoji or icon
 */
export const getStatusIcon = (status) => {
    const icons = {
        pending: '⏱️',
        processing: '⏳',
        shipped: '📦',
        delivered: '✅'
    };
    return icons[status] || '📋';
};

/**
 * Get color class for notification based on status
 * @param {string} status - Order status
 * @returns {string} CSS class name
 */
export const getStatusColor = (status) => {
    const colors = {
        pending: 'status-pending',
        processing: 'status-processing',
        shipped: 'status-shipped',
        delivered: 'status-delivered'
    };
    return colors[status] || 'status-default';
};

/**
 * Format timestamp for notification display
 * @param {number} timestamp - Timestamp in milliseconds
 * @returns {string} Formatted time string
 */
export const formatNotificationTime = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

    return new Date(timestamp).toLocaleDateString();
};

/**
 * Create a new notification object
 * @param {object} order - Order object
 * @param {string} oldStatus - Previous status
 * @param {string} newStatus - New status
 * @returns {object} Notification object
 */
export const createNotification = (order, oldStatus, newStatus) => {
    return {
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        orderId: order.id,
        orderNumber: order.order_number || `ORD-${order.id}`,
        type: 'status_change',
        message: getStatusMessage(newStatus),
        status: newStatus,
        oldStatus,
        timestamp: Date.now(),
        isRead: false
    };
};
