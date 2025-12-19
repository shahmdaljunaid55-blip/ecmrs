import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { ShopContext } from './Context';
import { supabase } from '../supabase';
import { createNotification, getStatusMessage } from '../utils/notificationUtils';

export { ShopContext };

export const ShopProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const { user, isSignedIn } = useUser();

    const [addresses, setAddresses] = useState(() => {
        const saved = localStorage.getItem('addresses');
        return saved ? JSON.parse(saved) : [];
    });

    const [mobile, setMobile] = useState(() => {
        return localStorage.getItem('mobile') || '';
    });

    // Notification state - fetched from Supabase
    const [notifications, setNotifications] = useState([]);

    // Fetch Products from Supabase
    useEffect(() => {
        const fetchProducts = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*');

            if (error) {
                console.error('Error fetching products:', error);
            } else {
                setProducts(data);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        localStorage.setItem('addresses', JSON.stringify(addresses));
    }, [addresses]);

    useEffect(() => {
        localStorage.setItem('mobile', mobile);
    }, [mobile]);

    // Fetch notifications from Supabase on mount
    useEffect(() => {
        if (!isSignedIn || !user) return;

        const fetchNotifications = async () => {
            try {
                const { data, error } = await supabase
                    .from('notifications')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setNotifications(data || []);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, [isSignedIn, user]);

    // Subscribe to real-time order status changes
    useEffect(() => {
        if (!isSignedIn || !user) return;

        // Subscribe to changes on the orders table
        const ordersSubscription = supabase
            .channel('order-changes')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                    filter: `customer_name=eq.${user.fullName}`
                },
                async (payload) => {
                    const updatedOrder = payload.new;
                    const oldOrder = payload.old;

                    // Check if status changed
                    if (updatedOrder.status !== oldOrder.status) {
                        // Create notification in Supabase
                        const notificationData = {
                            user_id: user.id,
                            order_id: updatedOrder.id,
                            order_number: updatedOrder.order_number,
                            type: 'status_change',
                            message: getStatusMessage(updatedOrder.status),
                            status: updatedOrder.status,
                            old_status: oldOrder.status,
                            is_read: false
                        };

                        const { error } = await supabase
                            .from('notifications')
                            .insert([notificationData]);

                        if (error) {
                            console.error('Error creating notification:', error);
                        }

                        // Update local order status
                        setOrders(prev => prev.map(o =>
                            o.id === updatedOrder.id ? { ...o, status: updatedOrder.status } : o
                        ));
                    }
                }
            )
            .subscribe();

        // Subscribe to notifications table for real-time updates
        const notificationsSubscription = supabase
            .channel('notification-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setNotifications(prev => [payload.new, ...prev]);
                    } else if (payload.eventType === 'UPDATE') {
                        setNotifications(prev =>
                            prev.map(n => n.id === payload.new.id ? payload.new : n)
                        );
                    } else if (payload.eventType === 'DELETE') {
                        setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
                    }
                }
            )
            .subscribe();

        // Cleanup subscriptions on unmount
        return () => {
            ordersSubscription.unsubscribe();
            notificationsSubscription.unsubscribe();
        };
    }, [isSignedIn, user, orders]);

    const userProfile = isSignedIn ? {
        name: user.fullName,
        email: user.primaryEmailAddress.emailAddress,
        imageUrl: user.imageUrl,
        mobile: mobile,
        address: addresses.length > 0 ? `${addresses[0].street}, ${addresses[0].city}` : "Address not set"
    } : null;

    const addToCart = (product) => {
        setCartItems((prev) => {
            const existingItem = prev.find((item) => item.id === product.id);
            if (existingItem) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prev) => prev.filter((item) => item.id !== productId));
    };

    const updateCartItemCount = (newAmount, productId) => {
        setCartItems((prev) =>
            prev.map((item) => item.id === productId ? { ...item, quantity: newAmount } : item)
        );
    };

    const addToWishlist = (product) => {
        setWishlistItems((prev) => {
            if (!prev.find(item => item.id === product.id)) {
                return [...prev, product];
            }
            return prev;
        });
    };

    const removeFromWishlist = (productId) => {
        setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item of cartItems) {
            totalAmount += item.price * item.quantity;
        }
        return totalAmount;
    };

    const getTotalCartItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }

    const placeOrder = async (paymentMethod, address) => {
        try {
            // Generate unique order number
            const orderNumber = `ORD-${new Date().getFullYear()}-${Date.now()}`;

            // Prepare order data for Supabase (matching actual schema)
            const orderData = {
                order_number: orderNumber,
                customer_name: user?.fullName || 'Guest User',
                total: getTotalCartAmount(),
                date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
                status: 'pending'
            };

            // Insert order into Supabase
            const { data: newOrder, error: orderError } = await supabase
                .from('orders')
                .insert([orderData])
                .select()
                .single();

            if (orderError) throw orderError;

            // Insert order items into Supabase (matching actual schema)
            const orderItems = cartItems.map(item => ({
                order_id: newOrder.id,
                product_name: item.name,
                quantity: item.quantity,
                price: item.price
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // Create complete order object with items for local state
            const completeOrder = {
                ...newOrder,
                items: cartItems.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            // Update local state
            setOrders(prev => [completeOrder, ...prev]);
            setCartItems([]);

            console.log('Order placed successfully:', newOrder.order_number);
            return newOrder;
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
            throw error;
        }
    };

    const addAddress = (address) => {
        setAddresses(prev => [...prev, { ...address, id: Date.now() }]);
    };

    const updateAddress = (id, updatedAddress) => {
        setAddresses(prev => prev.map(addr => addr.id === id ? { ...updatedAddress, id } : addr));
    };

    const deleteAddress = (id) => {
        setAddresses(prev => prev.filter(addr => addr.id !== id));
    };

    const updateMobile = (newMobile) => {
        setMobile(newMobile);
    };

    // Notification management functions - now using Supabase
    const addNotification = async (type, message, orderId, orderNumber, status) => {
        if (!user) return;

        const notificationData = {
            user_id: user.id,
            order_id: orderId,
            order_number: orderNumber,
            type,
            message,
            status,
            is_read: false
        };

        try {
            const { data, error } = await supabase
                .from('notifications')
                .insert([notificationData])
                .select()
                .single();

            if (error) throw error;
            // Real-time subscription will add it to local state automatically
        } catch (error) {
            console.error('Error adding notification:', error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', notificationId);

            if (error) throw error;
            // Real-time subscription will update local state automatically
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', user.id)
                .eq('is_read', false);

            if (error) throw error;
            // Real-time subscription will update local state automatically
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('id', notificationId);

            if (error) throw error;
            // Real-time subscription will update local state automatically
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const clearAllNotifications = async () => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('user_id', user.id);

            if (error) throw error;
            // Real-time subscription will update local state automatically
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
    };

    // Get unread notification count
    const unreadCount = notifications.filter(n => !n.is_read).length;

    const contextValue = {
        products, // Expose products
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemCount,
        getTotalCartAmount,
        getTotalCartItems,
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        userProfile,
        searchQuery,
        setSearchQuery,
        orders,
        placeOrder,
        addresses,
        addAddress,
        updateAddress,
        deleteAddress,
        updateMobile,
        // Notification system
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {children}
        </ShopContext.Provider>
    );
};
