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
                    {wishlistItems.map((item) => {
                        // Transform wishlist item to product format for ProductCard
                        const product = {
                            id: item.product_id,
                            name: item.product_name,
                            image: item.product_image,
                            price: item.product_price,
                            category: item.product_category
                        };
                        return <ProductCard key={item.id} product={product} />;
                    })}
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
