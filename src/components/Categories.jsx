import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import './Categories.css';

const categoryImages = {
    'rings': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    'necklaces': 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    'earrings': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    'bracelets': 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    'watches': 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    'default': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
};

const Categories = () => {
    const { products } = useContext(ShopContext);

    // Get unique categories
    const categories = [...new Set(products.map(p => p.category))];

    if (categories.length === 0) return null;

    return (
        <section className="categories-section">
            <div className="container">
                <h2 className="section-title glow-text">Categories</h2>
                <div className="categories-grid">
                    {categories.map((category, index) => {
                        const imageUrl = categoryImages[category.toLowerCase()] || categoryImages['default'];
                        return (
                            <a
                                href={`#${category.toLowerCase()}`}
                                key={index}
                                className="category-card glow-box"
                                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${imageUrl}')` }}
                            >
                                <h3>{category}</h3>
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Categories;
