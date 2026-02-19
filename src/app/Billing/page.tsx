'use client';

import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import './billing.css';

export default function BillingPage() {
    const { bills, editBill } = useCart();
    const router = useRouter();

    const handleEdit = (bill: any) => {
        editBill(bill);
        router.push('/dashboard');
    };

    return (
        <div className="billing-container">
            <header className="billing-header">
                <h1>Billing History</h1>
                <p>Manage and review all generated guest bills</p>
            </header>

            <div className="bills-grid">
                {bills.length === 0 ? (
                    <div className="empty-bills">
                        <div style={{ fontSize: '60px', marginBottom: '16px' }}>🧾</div>
                        <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E293B' }}>No bills found</p>
                        <p style={{ marginTop: '4px' }}>Generated bills will appear here for management.</p>
                    </div>
                ) : (
                    bills.map((bill) => (
                        <div key={bill.id} className="bill-card">
                            <div className="bill-accent"></div>

                            <div className="bill-header-row">
                                <div className="order-info">
                                    <span className="order-no-text">{bill.orderNo}</span>
                                    <div className="timestamp-row">
                                        <span>📅</span>
                                        <span>{new Date(bill.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        <span style={{ opacity: 0.3 }}>•</span>
                                        <span>{new Date(bill.timestamp).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="table-badge">
                                    <span className="table-badge-label">Table</span>
                                    <span className="table-no-text">{bill.tableNo || 'N/A'}</span>
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
                                        <span>Subtotal</span>
                                        <span>₹{bill.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="total-row">
                                        <span>GST (5%)</span>
                                        <span>₹{bill.taxes.toFixed(2)}</span>
                                    </div>
                                    <div className="grand-total-row">
                                        <span>Grand Total</span>
                                        <span className="grand-total-value">₹{bill.total.toFixed(2)}</span>
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
                                    <button className="btn-billing-print">
                                        <span>🖨️</span>
                                        Print
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
