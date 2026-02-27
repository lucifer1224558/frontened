'use client';

import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function OrdersPage() {
    const { bills, editBill, deleteBill } = useCart();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'All' | 'Dine In' | 'Takeaway' | 'Delivery'>('All');

    const internalOrders = bills.filter(bill => {
        const isPending = !bill.billed;
        const matchesType = activeTab === 'All' || bill.dineType === activeTab;
        const matchesSearch = (bill.orderNo || bill._id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (bill.tableNo || '').toLowerCase().includes(searchTerm.toLowerCase());
        return isPending && matchesType && matchesSearch;
    });

    const handleEdit = (bill: any) => {
        editBill(bill);
        router.push('/Dashboard');
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            deleteBill(id);
        }
    };

    return (
        <div className="billing-container">
            <header className="billing-header">
                <div>
                    <h1>Orders Taken</h1>
                    <p>Manage active internal orders and guest bills</p>
                </div>
                <div className="billing-search-group">
                    <div className="tab-container" style={{ marginRight: '20px', border: 'none', background: 'transparent', padding: 0 }}>
                        {(['All', 'Dine In', 'Takeaway', 'Delivery'] as const).map(tab => (
                            <button
                                key={tab}
                                className={`tab-btn ${activeTab === tab ? 'tab-btn-active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                                style={{ padding: '8px 16px', fontSize: '13px' }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="search-input-wrapper">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Order No or Table..."
                            className="billing-search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="bills-grid">
                {internalOrders.length === 0 ? (
                    <div className="empty-bills">
                        <div style={{ fontSize: '60px', marginBottom: '16px' }}>📝</div>
                        <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E293B' }}>
                            {searchTerm ? `No orders found for "${searchTerm}"` : 'No active orders'}
                        </p>
                        <p style={{ marginTop: '4px' }}>
                            New orders placed from the dashboard will appear here.
                        </p>
                    </div>
                ) : (
                    internalOrders.map((bill) => (
                        <div key={bill._id || bill.id} className="bill-card">
                            <div className="bill-accent"></div>

                            <div className="bill-header-row">
                                <div className="order-info">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <span className="order-no-text">#{bill.orderNo || (bill._id ? bill._id.slice(-6).toUpperCase() : 'N/A')}</span>
                                        <span style={{
                                            fontSize: '10px',
                                            fontWeight: '800',
                                            color: '#f97316',
                                            backgroundColor: '#fff7ed',
                                            padding: '2px 8px',
                                            borderRadius: '6px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>
                                            {bill.dineType}
                                        </span>
                                    </div>
                                    <div className="timestamp-row">
                                        <span>📅</span>
                                        <span>{bill.createdAt ? new Date(bill.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}</span>
                                        <span style={{ opacity: 0.3 }}>•</span>
                                        <span>{bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : ''}</span>
                                    </div>
                                </div>
                                <div className="table-badge">
                                    <span className="table-badge-label">Table</span>
                                    <span className="table-no-text">{bill.tableNo || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="bill-items-section">
                                <h4 className="section-label">Order Details</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {bill.items.map((item: any, idx: number) => (
                                        <div key={idx} className="bill-item-row">
                                            <div className="item-main">
                                                <span className="item-qty-badge">x{item.quantity}</span>
                                                <span className="item-name-text">{item.name}</span>
                                            </div>
                                            <span className="item-price-text">₹{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bill-totals-section">
                                <div className="totals-card">
                                    <div className="total-row">
                                        <span>Payment Method</span>
                                        <span style={{ fontWeight: 'bold', color: '#1E293B' }}>{bill.paymentMethod || 'Cash'}</span>
                                    </div>
                                    <div className="grand-total-row">
                                        <span>Total Amount</span>
                                        <span className="grand-total-value">₹{(bill.totalAmount || bill.total || 0).toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="bill-actions" style={{ gridTemplateColumns: '1fr 1fr' }}>
                                    <button
                                        className="btn-billing-edit"
                                        onClick={() => handleEdit(bill)}
                                    >
                                        <span>✏️</span>
                                        Edit Order
                                    </button>
                                    <button
                                        className="btn-billing-delete"
                                        onClick={() => handleDelete((bill._id || bill.id || '').toString())}
                                    >
                                        <span>🗑️</span>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
