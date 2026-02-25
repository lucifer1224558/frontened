'use client';

import { useState } from 'react';
import { useMenu } from '@/context/MenuContext';
import { Item } from '@/lib/types';
import './menu.css';

export default function MenuPage() {
    const { items, categories, isLoading, error, addItem, updateItem, deleteItem, refreshItems } = useMenu();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: categories[0] || 'All',
        image: '🥘'
    });

    const openAddModal = () => {
        setEditingItem(null);
        setFormData({ name: '', price: '', category: 'North Indian', image: '🥘' });
        setIsModalOpen(true);
    };

    const openEditModal = (item: Item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            price: item.price.toString(),
            category: item.category || 'North Indian',
            image: item.image || '🥘'
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const itemData = {
            name: formData.name,
            price: parseFloat(formData.price),
            category: formData.category,
            image: formData.image
        };

        if (editingItem) {
            updateItem({ ...itemData, _id: editingItem._id });
        } else {
            addItem(itemData);
        }
        setIsModalOpen(false);
    };

    const filteredItems = items.filter(item => {
        const itemCategory = item.category || 'Uncategorized';
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            itemCategory.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || itemCategory === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="menu-page-container">
            {/* Action Bar */}
            <header className="menu-header">
                <div className="menu-header-info">
                    <h1>Menu Items</h1>
                    <p>Manage your restaurant menu items and prices</p>
                </div>
                <div className="menu-search-bar">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search dishes..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="menu-category-filter">
                    <select
                        className="category-select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div className="menu-header-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={() => refreshItems()}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="spinner" style={{ width: '12px', height: '12px', borderWidth: '2px' }}></div>
                        ) : (
                            <span>🔄</span>
                        )}
                        Refresh
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={openAddModal}
                    >
                        <span>+</span>
                        Add New Item
                    </button>
                </div>
            </header>

            {error && (
                <div className="error-banner">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span>⚠️</span>
                        <span style={{ fontWeight: '500', fontSize: '14px' }}>{error}</span>
                    </div>
                    <button onClick={() => refreshItems()} style={{ fontSize: '12px', fontWeight: 'bold', textDecoration: 'underline' }}>Try Again</button>
                </div>
            )}

            <div className="menu-table-card">
                <div className="table-responsive">
                    <table className="menu-table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && items.length === 0 ? (
                                <tr>
                                    <td colSpan={4}>
                                        <div className="loading-container">
                                            <div className="spinner"></div>
                                            <p style={{ color: '#64748B', fontWeight: '500' }}>Loading items...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan={4}>
                                        <div className="empty-state">
                                            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🍽️</div>
                                            <p style={{ color: '#0F172A', fontWeight: 'bold', fontSize: '18px' }}>No items found</p>
                                            <p style={{ color: '#64748B', marginTop: '4px' }}>Start by adding your first menu item.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>
                                            <span className="item-name">{item.name}</span>
                                        </td>
                                        <td>
                                            <span className="item-category">{item.category || 'Uncategorized'}</span>
                                        </td>
                                        <td>
                                            <span className="item-price">₹{item.price.toFixed(2)}</span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="btn-icon btn-icon-edit"
                                                    onClick={() => openEditModal(item)}
                                                >
                                                    <span>✏️</span>
                                                </button>
                                                <button
                                                    className="btn-icon btn-icon-delete"
                                                    onClick={() => {
                                                        if (confirm('Delete this item?')) deleteItem(item._id);
                                                    }}
                                                >
                                                    <span>🗑️</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="close-btn">✕</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Item Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter item name..."
                                    className="form-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Price (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="0.00"
                                        className="form-input"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <select
                                        className="form-select"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {categories.filter(c => c !== 'All').map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    {editingItem ? 'Update Item' : 'Save Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

