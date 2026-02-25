'use client';

import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function BillingPage() {
    const { bills, editBill, deleteBill, markAsBilled } = useCart();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const pendingBills = bills.filter(bill => {
        const matchesType = !bill.billed;
        const matchesSearch = bill.tableNo?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
    });

    const handleEdit = (bill: any) => {
        editBill(bill);
        router.push('/dashboard');
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this bill?')) {
            deleteBill(id);
        }
    };

    const handlePrint = (id: string) => {
        markAsBilled(id);
        window.print();
    };

    return (
        <div className="billing-container">
            <header className="billing-header">
                <div>
                    <h1>Pending Bills</h1>
                    <p>Manage and review active guest bills</p>
                </div>
                <div className="billing-search-container">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search Table No..."
                        className="billing-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="bills-grid">
                {pendingBills.length === 0 ? (
                    <div className="empty-bills">
                        <div style={{ fontSize: '60px', marginBottom: '16px' }}>🧾</div>
                        <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E293B' }}>
                            {searchTerm ? `No bills found for table "${searchTerm}"` : 'No bills found'}
                        </p>
                        <p style={{ marginTop: '4px' }}>
                            {searchTerm ? 'Try searching for a different table number.' : 'Generated bills will appear here for management.'}
                        </p>
                    </div>
                ) : (
                    pendingBills.map((bill) => (
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
                                        <span>{bill.createdAt ? new Date(bill.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
                                        <span style={{ opacity: 0.3 }}>•</span>
                                        <span>{bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : 'Just now'}</span>
                                    </div>
                                </div>
                                <div className="table-badge">
                                    <span className="table-badge-label">Table</span>
                                    <span className="table-no-text">{bill.tableNo || 'N/A'}</span>
                                    {bill.billed && <div className="billed-sticker">BILLED</div>}
                                </div>
                            </div>

                            <div className="bill-items-section">
                                <h4 className="section-label">Items Ordered</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {bill.items.map((item, idx) => (
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
                                    <div className="total-row">
                                        <span>GST</span>
                                        <span>{bill.gst || 18}%</span>
                                    </div>
                                    <div className="grand-total-row">
                                        <span>Total Amount</span>
                                        <span className="grand-total-value">₹{(bill.totalAmount || bill.total || 0).toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="bill-actions">
                                    <button
                                        className="btn-billing-edit"
                                        onClick={() => handleEdit(bill)}
                                    >
                                        <span>✏️</span>
                                        Edit Bill
                                    </button>
                                    <button
                                        className="btn-billing-print"
                                        onClick={() => handlePrint((bill._id || bill.id || '').toString())}
                                    >
                                        <span>🖨️</span>
                                        Print
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
