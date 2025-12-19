import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../supabase';

const AdminContext = createContext();

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within AdminProvider');
    }
    return context;
};

export const AdminProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check authentication from localStorage
    useEffect(() => {
        const authStatus = localStorage.getItem('admin_auth');
        setIsAuthenticated(authStatus === 'true');
    }, []);

    // Fetch products from Supabase
    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('id', { ascending: true });

            if (error) throw error;
            setProducts(data || []);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products');
        }
    };

    // Fetch orders with items from Supabase
    const fetchOrders = async () => {
        try {
            const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select('*')
                .order('id', { ascending: false });

            if (ordersError) throw ordersError;

            // Fetch order items for each order and adapt schema
            const ordersWithItems = await Promise.all(
                ordersData.map(async (order) => {
                    const { data: items, error: itemsError } = await supabase
                        .from('order_items')
                        .select('*')
                        .eq('order_id', order.id);

                    if (itemsError) throw itemsError;

                    // Adapt the schema to what admin expects
                    return {
                        id: order.id,
                        order_number: order.order_number || `ORD-${order.id.toString().padStart(4, '0')}`,
                        customer_name: order.customer_name || 'Guest Customer',
                        date: order.date,
                        total: order.total,
                        status: order.status,
                        payment_method: 'N/A', // Not stored in current schema
                        shipping_address: 'N/A', // Not stored in current schema
                        items: items.map(item => ({
                            name: item.product_name || item.name || 'Unknown Product',
                            quantity: item.quantity,
                            price: item.price
                        }))
                    };
                })
            );

            setOrders(ordersWithItems || []);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load orders');
        }
    };

    // Load data on mount
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchProducts(), fetchOrders()]);
            setLoading(false);
        };

        if (isAuthenticated) {
            loadData();
        }
    }, [isAuthenticated]);

    // Authentication
    const login = (username, password) => {
        if (username === 'admin' && password === 'admin123') {
            setIsAuthenticated(true);
            localStorage.setItem('admin_auth', 'true');
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('admin_auth');
    };

    // Product CRUD operations
    const addProduct = async (product) => {
        try {
            const { data, error } = await supabase
                .from('products')
                .insert([{
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    image: product.image
                }])
                .select()
                .single();

            if (error) throw error;

            setProducts(prev => [...prev, data]);
            return data;
        } catch (err) {
            console.error('Error adding product:', err);
            setError('Failed to add product');
            throw err;
        }
    };

    const updateProduct = async (id, updatedData) => {
        try {
            const { data, error } = await supabase
                .from('products')
                .update({
                    name: updatedData.name,
                    category: updatedData.category,
                    price: updatedData.price,
                    image: updatedData.image,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            setProducts(prev => prev.map(p => p.id === id ? data : p));
        } catch (err) {
            console.error('Error updating product:', err);
            setError('Failed to update product');
            throw err;
        }
    };

    const deleteProduct = async (id) => {
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error('Error deleting product:', err);
            setError('Failed to delete product');
            throw err;
        }
    };

    // Order operations
    const updateOrderStatus = async (orderId, status) => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .update({
                    status,
                    updated_at: new Date().toISOString()
                })
                .eq('id', orderId)
                .select()
                .single();

            if (error) throw error;

            setOrders(prev => prev.map(o =>
                o.id === orderId ? { ...o, status } : o
            ));
        } catch (err) {
            console.error('Error updating order status:', err);
            setError('Failed to update order status');
            throw err;
        }
    };

    // Statistics
    const getStats = () => {
        const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
        const totalOrders = orders.length;
        const totalProducts = products.length;

        return {
            totalProducts,
            totalOrders,
            totalRevenue,
            pendingOrders: orders.filter(o => o.status === 'pending').length
        };
    };

    const value = {
        isAuthenticated,
        login,
        logout,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        orders,
        updateOrderStatus,
        getStats,
        loading,
        error,
        refreshData: async () => {
            await Promise.all([fetchProducts(), fetchOrders()]);
        }
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};
