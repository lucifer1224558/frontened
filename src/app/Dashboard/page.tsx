'use client';

import { useState } from 'react';
import { useMenu } from '@/context/MenuContext';
import { useCart } from '@/context/CartContext';
import { Item, CartItem } from '@/lib/types';
import Display from '@/component/dashboard/display';
import './dashboard.css';

export default function DashboardPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [dineType, setDineType] = useState('Dine In');
    const [tableNo, setTableNo] = useState('1');
    const [searchTerm, setSearchTerm] = useState('');
    const [showTableGrid, setShowTableGrid] = useState(true);
    const { items, categories } = useMenu();
    const { cart, addToCart, removeFromCart, updateQuantity, saveBill, placeOrder, editingBillId, clearCart } = useCart();

    const subtotal = cart.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
    const taxes = subtotal * 0.05; // 5% GST
    const total = subtotal + taxes;

    const handleKOT = async () => {
        if (cart.length === 0) return;

        await placeOrder({
            dineType: dineType,
            tableNo: dineType === 'Dine In' ? `T${tableNo}` : 'N/A',
            paymentMethod: "Cash"
        });
    };

    return (
        <div className="dashboard-container">
            {/* Category Sidebar */}
            <div className="category-sidebar">
                <h2 className="category-title">Categories</h2>
                <div className="category-list">
                    {categories.map((cat: string) => (
                        <button
                            key={cat}
                            className={`category-item ${cat === selectedCategory ? 'category-item-active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat === selectedCategory && (
                                <span className="category-indicator"></span>
                            )}
                            <span className="category-name">{cat}</span>
                            <span className="category-count">
                                {cat === 'All' ? items.length : items.filter((i: Item) => i.category === cat).length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Menu Section */}
            <div className="main-menu">
                <div className="main-menu-header">
                    <div className="header-info">
                        <h1>Main Menu</h1>
                        <p>Select items to add to the current order</p>
                    </div>
                    <div className="menu-search">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search dishes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="menu-search-input"
                        />
                    </div>
                </div>

                <Display
                    selectedCategory={selectedCategory}
                    searchTerm={searchTerm}
                    onAddToCart={addToCart}
                />
            </div>

            {/* Order Summary Sidebar */}
            <div className="order-sidebar">
                <div className="order-header">
                    <div className="order-header-top">
                        <h2>Current Order</h2>
                        <span className="order-no">#ORD-2024</span>
                    </div>
                    <div className="order-type-selector-wrapper">
                        <div className="order-type-icon">
                            {dineType === 'Dine In' && '🍽️'}
                            {dineType === 'Takeaway' && '🛍️'}
                            {dineType === 'Delivery' && '🛵'}
                        </div>
                        <select
                            className="order-type-dropdown"
                            value={dineType}
                            onChange={(e) => setDineType(e.target.value)}
                        >
                            <option value="Dine In">Dine In</option>
                            <option value="Takeaway">Takeaway</option>
                            <option value="Delivery">Delivery</option>
                        </select>
                    </div>

                    {dineType === 'Dine In' && (
                        <div className="table-selector-container">
                            <div className="table-header-row">
                                <span className="selector-label">Select Table</span>
                                <button
                                    className="btn-toggle-grid"
                                    onClick={() => setShowTableGrid(!showTableGrid)}
                                >
                                    {showTableGrid ? 'Hide' : 'Show'}
                                </button>
                            </div>

                            {showTableGrid && (
                                <div className="table-grid-mini">
                                    {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                                        <button
                                            key={num}
                                            className={`table-mini-btn ${tableNo === num.toString() ? 'table-mini-btn-active' : ''}`}
                                            onClick={() => setTableNo(num.toString())}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="order-status">
                        <span className="status-dot-active"></span>
                        <span className="status-text-active">
                            {dineType} {dineType === 'Dine In' ? `/ Table ${tableNo.padStart(2, '0')}` : ''}
                        </span>
                    </div>

                    {editingBillId && (
                        <div className="editing-banner">
                            <span>⚡ Editing Bill #{editingBillId.slice(-4)}</span>
                            <button onClick={clearCart} style={{ color: 'white' }}>✕</button>
                        </div>
                    )}
                </div>

                <div className="cart-items">
                    {cart.length === 0 ? (
                        <div className="cart-empty">
                            <div className="cart-empty-icon">🛒</div>
                            <p className="font-bold text-[#2D3436] text-lg">Empty Cart</p>
                            <span className="text-sm text-[#B2BEC3] mt-2 leading-relaxed">Choose some delicious items<br />from the menu left</span>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {cart.map((item: CartItem) => (
                                <div key={item._id} className="cart-item">
                                    <div className="cart-item-info">
                                        <p className="cart-item-name">{item.name}</p>
                                        <div className="cart-item-prices">
                                            <p className="unit-price">₹{item.price}</p>
                                            <span className="total-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className="cart-item-actions">
                                        <div className="quantity-control">
                                            <button
                                                className="qty-btn"
                                                onClick={() => updateQuantity(item._id, -1)}
                                            >-</button>
                                            <span className="qty-value">{item.quantity}</span>
                                            <button
                                                className="qty-btn"
                                                onClick={() => updateQuantity(item._id, 1)}
                                            >+</button>
                                        </div>
                                        <button
                                            className="remove-btn"
                                            onClick={() => removeFromCart(item._id)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="order-footer">
                    <div style={{ marginBottom: '32px' }}>
                        <div className="summary-row">
                            <span>Items Total</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>GST (5%)</span>
                            <span>₹{taxes.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="grand-total-section">
                        <span className="total-label">Total Payable</span>
                        <span className="total-value">₹{total.toFixed(2)}</span>
                    </div>

                    <div className="action-grid">
                        <button className="btn-hold">Hold</button>
                        <button
                            className="btn-order"
                            disabled={cart.length === 0}
                            onClick={handleKOT}
                        >
                            {editingBillId ? 'UPDATE ORDER' : 'PLACE ORDER'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
