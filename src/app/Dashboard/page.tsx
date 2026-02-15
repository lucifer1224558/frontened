'use client';

import { useState } from 'react';
import { items, categories } from '@/lib/data';
import { Item, CartItem } from '@/lib/types';
import Display from '@/component/Dashboard/display';
import styles from './billing.module.css';

export default function BillingPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [cart, setCart] = useState<CartItem[]>([]);

    const handleAddToCart = (item: Item) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(i => i.id === item.id);
            if (existingItem) {
                return prevCart.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (id: number) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    const updateQuantity = (id: number, delta: number) => {
        setCart(prevCart => prevCart.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxes = subtotal * 0.05; // 5% GST
    const total = subtotal + taxes;

    return (
        <div className={styles.billingWrapper}>
            {/* Category Sidebar */}
            <div className={styles.categorySidebar}>
                <h2 className={styles.categoryHeading}>Menu</h2>
                <div className={styles.categoryList}>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`${styles.categoryItem} ${cat === selectedCategory ? styles.activeCategory : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            <span className={styles.categoryName}>{cat}</span>
                            <span className={styles.categoryCount}>
                                {cat === 'All' ? items.length : items.filter(i => i.category === cat).length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Menu Section */}
            <div className={styles.menuSection}>
                <div className={styles.sectionHeader}>
                    <h1 className={styles.sectionTitle}>Main Menu</h1>
                    <div className={styles.itemSearch}>
                        <input type="text" placeholder="Find item..." className={styles.itemSearchInput} />
                    </div>
                </div>

                <Display selectedCategory={selectedCategory} onAddToCart={handleAddToCart} />
            </div>

            {/* Order Summary Sidebar */}
            <div className={styles.cartSection}>
                <div className={styles.cartHeader}>
                    <div className={styles.orderLabel}>
                        <h2>Current Order</h2>
                        <span className={styles.orderType}>Dine-in / Table 04</span>
                    </div>
                    <span className={styles.orderNo}>#ORD-1234</span>
                </div>

                <div className={styles.cartItems}>
                    {cart.length === 0 ? (
                        <div className={styles.emptyCart}>
                            <span className={styles.emptyIcon}>🛒</span>
                            <p>Your cart is empty</p>
                            <span className={styles.emptySubtext}>Start adding items to build order</span>
                        </div>
                    ) : (
                        <div className={styles.cartList}>
                            {cart.map((item) => (
                                <div key={item.id} className={styles.cartItem}>
                                    <div className={styles.cartItemInfo}>
                                        <p className={styles.cartItemName}>{item.name}</p>
                                        <p className={styles.cartItemPrice}>₹{item.price}</p>
                                    </div>
                                    <div className={styles.cartItemActions}>
                                        <div className={styles.qtyControls}>
                                            <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                                        </div>
                                        <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>×</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.cartFooter}>
                    <div className={styles.billSummary}>
                        <div className={styles.summaryRow}>
                            <span>Items Total</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>GST (5%)</span>
                            <span>₹{taxes.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                        <span>Total Payable</span>
                        <span>₹{total.toFixed(2)}</span>
                    </div>
                    <div className={styles.actionGrid}>
                        <button className={styles.holdBtn}>Hold</button>
                        <button className={styles.checkoutBtn} disabled={cart.length === 0}>
                            Pay & Print
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
