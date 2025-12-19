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
    const [addresses, setAddresses] = useState([]);
    const [orders, setOrders] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [mobile, setMobile] = useState("");
    const [loading, setLoading] = useState(false);

    const { user, isSignedIn } = useUser();

    // ==========================================
    // FETCH DATA ON USER SIGN-IN
    // ==========================================

    // Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('is_active', true);

            if (error) {
                console.error('Error fetching products:', error);
            } else {
                setProducts(data || []);
            }
        };

        fetchProducts();
    }, []);

    // Fetch user data when signed in
    useEffect(() => {
        if (!isSignedIn || !user) {
            // Clear data when signed out
            setCartItems([]);
            setWishlistItems([]);
            setAddresses([]);
            setOrders([]);
            setNotifications([]);
            return;
        }

        const fetchUserData = async () => {
            try {
                // Fetch cart
                const { data: cartData } = await supabase
                    .from('cart_items')
                    .select('*')
                    .eq('user_id', user.id);

                setCartItems(cartData || []);

                // Fetch wishlist
                const { data: wishlistData } = await supabase
                    .from('wishlist_items')
                    .select('*')
                    .eq('user_id', user.id);

                setWishlistItems(wishlistData || []);

                // Fetch addresses
                const { data: addressData } = await supabase
                    .from('user_addresses')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('is_default', { ascending: false });

                setAddresses(addressData || []);

                // Fetch notifications
                const { data: notifData } = await supabase
                    .from('notifications')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                setNotifications(notifData || []);

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [isSignedIn, user]);

    // ==========================================
    // REAL-TIME SUBSCRIPTIONS
    // ==========================================

    useEffect(() => {
        if (!isSignedIn || !user) return;

        // Cart subscription
        const cartSubscription = supabase
            .channel('cart-changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'cart_items',
                filter: `user_id=eq.${user.id}`
            }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setCartItems(prev => [...prev, payload.new]);
                } else if (payload.eventType === 'UPDATE') {
                    setCartItems(prev => prev.map(item =>
                        item.id === payload.new.id ? payload.new : item
                    ));
                } else if (payload.eventType === 'DELETE') {
                    setCartItems(prev => prev.filter(item => item.id !== payload.old.id));
                }
            })
            .subscribe();

        // Wishlist subscription
        const wishlistSubscription = supabase
            .channel('wishlist-changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'wishlist_items',
                filter: `user_id=eq.${user.id}`
            }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setWishlistItems(prev => [...prev, payload.new]);
                } else if (payload.eventType === 'DELETE') {
                    setWishlistItems(prev => prev.filter(item => item.id !== payload.old.id));
                }
            })
            .subscribe();

        // Orders subscription for real-time notifications
        const ordersSubscription = supabase
            .channel('order-changes')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'orders',
                filter: `user_id=eq.${user.id}`
            }, async (payload) => {
                console.log('Order status changed:', payload);
                const updatedOrder = payload.new;
                const oldOrder = payload.old;

                if (updatedOrder.status !== oldOrder.status) {
                    console.log(`Status changed from ${oldOrder.status} to ${updatedOrder.status}`);

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

                    try {
                        const { data, error } = await supabase
                            .from('notifications')
                            .insert([notificationData])
                            .select();

                        if (error) {
                            console.error('Error creating notification:', error);
                        } else {
                            console.log('Notification created successfully:', data);
                        }
                    } catch (error) {
                        console.error('Error inserting notification:', error);
                    }

                    setOrders(prev => prev.map(o =>
                        o.id === updatedOrder.id ? { ...o, status: updatedOrder.status } : o
                    ));
                }
            })
            .subscribe();

        // Notifications subscription
        const notificationsSubscription = supabase
            .channel('notification-changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${user.id}`
            }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setNotifications(prev => [payload.new, ...prev]);
                } else if (payload.eventType === 'UPDATE') {
                    setNotifications(prev => prev.map(n =>
                        n.id === payload.new.id ? payload.new : n
                    ));
                } else if (payload.eventType === 'DELETE') {
                    setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
                }
            })
            .subscribe();

        return () => {
            cartSubscription.unsubscribe();
            wishlistSubscription.unsubscribe();
            ordersSubscription.unsubscribe();
            notificationsSubscription.unsubscribe();
        };
    }, [isSignedIn, user, orders]);

    // ==========================================
    // CART FUNCTIONS
    // ==========================================

    const addToCart = async (product) => {
        if (!isSignedIn || !user) {
            alert('Please sign in to add items to cart');
            return;
        }

        try {
            const existing = cartItems.find(item => item.product_id === product.id);

            if (existing) {
                // Update quantity
                const { error } = await supabase
                    .from('cart_items')
                    .update({ quantity: existing.quantity + 1 })
                    .eq('id', existing.id);

                if (error) throw error;
            } else {
                // Insert new item
                const { error } = await supabase
                    .from('cart_items')
                    .insert([{
                        user_id: user.id,
                        product_id: product.id,
                        product_name: product.name,
                        product_image: product.image,
                        product_price: product.price,
                        product_category: product.category,
                        quantity: 1
                    }]);

                if (error) throw error;
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add item to cart');
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const item = cartItems.find(item => item.product_id === productId);
            if (!item) return;

            const { error } = await supabase
                .from('cart_items')
                .delete()
                .eq('id', item.id);

            if (error) throw error;
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const updateCartItemCount = async (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }

        try {
            const item = cartItems.find(item => item.product_id === productId);
            if (!item) return;

            const { error } = await supabase
                .from('cart_items')
                .update({ quantity: newQuantity })
                .eq('id', item.id);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    const getTotalCartAmount = () => {
        return cartItems.reduce((total, item) => total + (item.product_price * item.quantity), 0);
    };

    const getTotalCartItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // ==========================================
    // WISHLIST FUNCTIONS
    // ==========================================

    const addToWishlist = async (product) => {
        if (!isSignedIn || !user) {
            alert('Please sign in to add items to wishlist');
            return;
        }

        try {
            const { error } = await supabase
                .from('wishlist_items')
                .insert([{
                    user_id: user.id,
                    product_id: product.id,
                    product_name: product.name,
                    product_image: product.image,
                    product_price: product.price,
                    product_category: product.category
                }]);

            if (error) {
                if (error.code === '23505') {
                    alert('Item already in wishlist');
                } else {
                    throw error;
                }
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            alert('Failed to add item to wishlist');
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const item = wishlistItems.find(item => item.product_id === productId);
            if (!item) return;

            const { error } = await supabase
                .from('wishlist_items')
                .delete()
                .eq('id', item.id);

            if (error) throw error;
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    // ==========================================
    // ADDRESS FUNCTIONS
    // ==========================================

    const addAddress = async (address) => {
        if (!isSignedIn || !user) return;

        try {
            const { error } = await supabase
                .from('user_addresses')
                .insert([{
                    user_id: user.id,
                    ...address,
                    is_default: addresses.length === 0
                }]);

            if (error) throw error;

            // Refetch addresses
            const { data } = await supabase
                .from('user_addresses')
                .select('*')
                .eq('user_id', user.id)
                .order('is_default', { ascending: false });

            setAddresses(data || []);
        } catch (error) {
            console.error('Error adding address:', error);
            alert('Failed to add address');
        }
    };

    const updateAddress = async (id, updatedAddress) => {
        try {
            const { error } = await supabase
                .from('user_addresses')
                .update(updatedAddress)
                .eq('id', id);

            if (error) throw error;

            const { data } = await supabase
                .from('user_addresses')
                .select('*')
                .eq('user_id', user.id)
                .order('is_default', { ascending: false });

            setAddresses(data || []);
        } catch (error) {
            console.error('Error updating address:', error);
        }
    };

    const deleteAddress = async (id) => {
        try {
            const { error } = await supabase
                .from('user_addresses')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setAddresses(prev => prev.filter(addr => addr.id !== id));
        } catch (error) {
            console.error('Error deleting address:', error);
        }
    };

    const updateMobile = (newMobile) => {
        setMobile(newMobile);
        localStorage.setItem('mobile', newMobile);
    };

    // ==========================================
    // ORDER FUNCTIONS
    // ==========================================

    const placeOrder = async (paymentMethod, address) => {
        if (!isSignedIn || !user) {
            alert('Please sign in to place an order');
            return;
        }

        try {
            setLoading(true);
            const orderNumber = `ORD-${new Date().getFullYear()}-${Date.now()}`;

            const orderData = {
                order_number: orderNumber,
                user_id: user.id,
                customer_name: user.fullName || 'Guest User',
                total: getTotalCartAmount(),
                date: new Date().toISOString().split('T')[0],
                status: 'pending',
                payment_method: paymentMethod,
                shipping_address: address
            };

            const { data: newOrder, error: orderError } = await supabase
                .from('orders')
                .insert([orderData])
                .select()
                .single();

            if (orderError) throw orderError;

            const orderItems = cartItems.map(item => ({
                order_id: newOrder.id,
                product_id: item.product_id,
                product_name: item.product_name,
                quantity: item.quantity,
                price: item.product_price
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // Clear cart
            const { error: clearError } = await supabase
                .from('cart_items')
                .delete()
                .eq('user_id', user.id);

            if (clearError) throw clearError;

            const completeOrder = {
                ...newOrder,
                items: cartItems.map(item => ({
                    name: item.product_name,
                    quantity: item.quantity,
                    price: item.product_price
                })),
                paymentMethod,
                address
            };

            setOrders(prev => [completeOrder, ...prev]);
            setCartItems([]);

            console.log('Order placed successfully:', newOrder.order_number);
            return newOrder;
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // NOTIFICATION FUNCTIONS
    // ==========================================

    const markAsRead = async (notificationId) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', notificationId);

            if (error) throw error;
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
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const userProfile = isSignedIn ? {
        name: user.fullName,
        email: user.primaryEmailAddress.emailAddress,
        image: user.imageUrl
    } : null;

    const contextValue = {
        products,
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
        mobile,
        updateMobile,
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        loading
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {children}
        </ShopContext.Provider>
    );
};
