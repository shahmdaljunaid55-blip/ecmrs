import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { ShopContext } from './Context';
import { supabase } from '../supabase';

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

    const placeOrder = (paymentMethod, address) => {
        const newOrder = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            items: [...cartItems],
            total: getTotalCartAmount(),
            paymentMethod,
            address
        };
        setOrders(prev => [newOrder, ...prev]);
        setCartItems([]);
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
        updateMobile
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {children}
        </ShopContext.Provider>
    );
};
