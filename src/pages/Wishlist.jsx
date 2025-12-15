import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import './Wishlist.css';

const Wishlist = () => {
    const { wishlistItems } = useContext(ShopContext);

    return (
        <div className="wishlist-page container">
            <h1 className="page-title glow-text">Your Wishlist</h1>
            {wishlistItems.length > 0 ? (
                <div className="product-grid">
                    {wishlistItems.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="empty-wishlist">
                    <p>Your wishlist is empty.</p>
                </div>
            )}
        </div>
    );
};

export default Wishlist;
