import React from 'react';
import './CategoriesManagement.css';

const CategoriesManagement = () => {
    const categories = [
        { id: 1, name: 'Rings', productCount: 3 },
        { id: 2, name: 'Pendants', productCount: 1 },
        { id: 3, name: 'Bracelets', productCount: 2 },
        { id: 4, name: 'Jewelry', productCount: 2 }
    ];

    return (
        <div className="categories-management-page">
            <div className="page-header">
                <div>
                    <h1>Categories Management</h1>
                    <p>Manage product categories</p>
                </div>
            </div>

            <div className="categories-grid">
                {categories.map((category) => (
                    <div key={category.id} className="category-card">
                        <h3>{category.name}</h3>
                        <p>{category.productCount} Products</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoriesManagement;
