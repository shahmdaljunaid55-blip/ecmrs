import React, { useContext } from 'react';
import ProductCard from './ProductCard';
import { ShopContext } from '../context/ShopContext';
import './ProductGrid.css';

const ProductGrid = () => {
  const { products, searchQuery } = useContext(ShopContext);

  // Get unique categories from products
  const categories = [...new Set(products.map(p => p.category))];

  if (products.length === 0) {
    return <div className="container" style={{ padding: '50px', textAlign: 'center', color: 'white' }}>Loading products...</div>;
  }

  return (
    <div className="product-sections-container">
      {categories.map(category => {
        const categoryProducts = products.filter(p =>
          p.category === category &&
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (categoryProducts.length === 0) return null;

        return (
          <section key={category} id={category.toLowerCase()} className="category-section">
            <div className="container">
              <h2 className="section-title glow-text">{category}</h2>
              <div className="product-grid">
                {categoryProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default ProductGrid;
