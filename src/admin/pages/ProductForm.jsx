import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import './ProductForm.css';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, addProduct, updateProduct } = useAdmin();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        image: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEdit) {
            const product = products.find(p => p.id === parseInt(id));
            if (product) {
                setFormData({
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    image: product.image
                });
            }
        }
    }, [id, products, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Product name is required';
        if (!formData.category.trim()) newErrors.category = 'Category is required';
        if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
        if (!formData.image.trim()) newErrors.image = 'Image URL is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            if (isEdit) {
                await updateProduct(parseInt(id), {
                    ...formData,
                    price: parseFloat(formData.price)
                });
                alert('Product updated successfully!');
            } else {
                await addProduct({
                    ...formData,
                    price: parseFloat(formData.price)
                });
                alert('Product added successfully!');
            }

            navigate('/admin/products');
        } catch (error) {
            alert('Failed to save product. Please try again.');
            console.error('Error saving product:', error);
        }
    };

    return (
        <div className="product-form-page">
            <div className="page-header">
                <h1>{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
                <p>{isEdit ? 'Update product information' : 'Add a new product to your inventory'}</p>
            </div>

            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Product Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter product name"
                        />
                        {errors.name && <span className="error">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category *</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="">Select category</option>
                            <option value="Rings">Rings</option>
                            <option value="Pendants">Pendants</option>
                            <option value="Bracelets">Bracelets</option>
                            <option value="Jewelry">Jewelry</option>
                        </select>
                        {errors.category && <span className="error">{errors.category}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">Price (৳) *</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Enter price"
                            min="0"
                            step="0.01"
                        />
                        {errors.price && <span className="error">{errors.price}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">Image URL *</label>
                        <input
                            type="url"
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="Enter image URL"
                        />
                        {errors.image && <span className="error">{errors.image}</span>}
                        {formData.image && (
                            <div className="image-preview">
                                <img src={formData.image} alt="Preview" />
                            </div>
                        )}
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-submit">
                            {isEdit ? 'Update Product' : 'Add Product'}
                        </button>
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => navigate('/admin/products')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
