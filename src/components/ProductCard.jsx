import React, { useContext } from 'react';
import { FaHeart } from 'react-icons/fa';
import { ShopContext } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart, addToWishlist, wishlistItems } = useContext(ShopContext);
    const { showWarning } = useToast();
    const isInWishlist = wishlistItems.some(item => item.product_id === product.id);

    const stock = product.stock_quantity || 0;
    const isOutOfStock = stock <= 0;
    const isLowStock = stock > 0 && stock <= 5;

    const handleAddToCart = () => {
        if (isOutOfStock) {
            showWarning('This product is out of stock');
            return;
        }
        addToCart(product);
    };

    return (
        <div className="product-card glow-box">
            <div className="product-image">
                <img src={product.image} alt={product.name} />
                {isOutOfStock && <span className="out-of-stock-badge">Out of Stock</span>}
                {isLowStock && <span className="low-stock-badge">Only {stock} left!</span>}
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
                    <button
                        className={`btn add-to-cart ${isOutOfStock ? 'disabled' : ''}`}
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                    >
                        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
