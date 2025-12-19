import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import './ProductsManagement.css';

const ProductsManagement = () => {
    const { products, deleteProduct, loading } = useAdmin();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                alert('Product deleted successfully!');
            } catch (error) {
                alert('Failed to delete product. Please try again.');
            }
        }
    };

    if (loading) {
        return (
            <div className="products-management-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="products-management-page">
            <div className="page-header">
                <div>
                    <h1>Products Management</h1>
                    <p>Manage your product inventory</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => navigate('/admin/products/add')}
                >
                    <FaPlus /> Add New Product
                </button>
            </div>

            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search products by name or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="products-table-section">
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.id}</td>
                                        <td>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="product-thumbnail"
                                            />
                                        </td>
                                        <td><strong>{product.name}</strong></td>
                                        <td>{product.category}</td>
                                        <td>৳{parseFloat(product.price).toLocaleString()}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="btn-edit"
                                                    onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                                                >
                                                    <FaEdit /> Edit
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    <FaTrash /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                                        {searchQuery ? 'No products match your search' : 'No products found. Add your first product!'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductsManagement;
