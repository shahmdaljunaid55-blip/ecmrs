import React, { useContext } from 'react';
import { FaHeart } from 'react-icons/fa';
import { ShopContext } from '../context/ShopContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart, addToWishlist, wishlistItems } = useContext(ShopContext);
    const isInWishlist = wishlistItems.some(item => item.id === product.id);

    return (
        <div className="product-card glow-box">
            <div className="product-image">
                <img src={product.image} alt={product.name} />
                <button
                    className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
                    onClick={() => addToWishlist(product)}
                >
                    <FaHeart />
                </button>
            </div>
            <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">৳{product.price.toLocaleString()}</p>
                <div className="card-actions">
                    <button className="btn add-to-cart" onClick={() => addToCart(product)}>Add to Cart</button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
