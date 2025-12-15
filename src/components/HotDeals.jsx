import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductCard from './ProductCard';
import './HotDeals.css';

const HotDeals = () => {
    const { products } = useContext(ShopContext);

    // Select first 4 products as "Hot Deals" for now
    // In a real app, you might filter by a 'discount' property
    const hotDeals = products.slice(0, 5);

    if (hotDeals.length === 0) return null;

    return (
        <section className="hot-deals-section">
            <div className="container">
                <div className="hot-deals-header">
                    <h2 className="section-title glow-text">🔥 Hot Deals</h2>
                    <p className="section-subtitle">Grab these exclusive offers before they're gone!</p>
                </div>
                <div className="hot-deals-grid">
                    {hotDeals.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HotDeals;
