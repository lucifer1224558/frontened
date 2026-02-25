'use client';

import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';

export default function BilledHistoryPage() {
    const { paidBills, refreshPaidBills, deleteBill } = useCart();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchDate, setSearchDate] = useState('');

    useEffect(() => {
        refreshPaidBills();
    }, []);

    const filteredHistory = paidBills.filter(bill => {
        const matchesBillNo = (bill.orderNo || bill._id || bill.id || '')
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const billDate = new Date(bill.createdAt || bill.timestamp || Date.now()).toISOString().split('T')[0];
        const matchesDate = searchDate ? billDate === searchDate : true;

        return matchesBillNo && matchesDate;
    });

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this bill from history?')) {
            deleteBill(id);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="billing-container">
            <header className="billing-header">
                <div>
                    <h1>Billed History</h1>
                    <p>Review and manage all finalized guest bills</p>
                </div>
                <div className="billing-search-group">
                    <div className="search-input-wrapper">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search Bill No..."
                            className="billing-search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="search-input-wrapper">
                        <span className="search-icon">📅</span>
                        <input
                            type="date"
                            className="billing-date-input"
                            value={searchDate}
                            onChange={(e) => setSearchDate(e.target.value)}
                        />
                    </div>
                    {(searchTerm || searchDate) && (
                        <button
                            className="btn-clear-filters"
                            onClick={() => { setSearchTerm(''); setSearchDate(''); }}
                        >
                            Clear
                        </button>
                    )}
                </div>
            </header>

            <div className="bills-grid">
                {filteredHistory.length === 0 ? (
                    <div className="empty-bills">
                        <div style={{ fontSize: '60px', marginBottom: '16px' }}>🧾</div>
                        <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E293B' }}>
                            {searchTerm || searchDate ? 'No results match your search' : 'No billed history found'}
                        </p>
                        <p style={{ marginTop: '4px' }}>
                            {searchTerm || searchDate ? 'Try adjusting your filters.' : 'Finalized bills will appear here for record keeping.'}
                        </p>
                    </div>
                ) : (
                    filteredHistory.map((bill) => (
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
                                        <span>{bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="table-badge">
                                    <span className="table-badge-label">Table</span>
                                    <span className="table-no-text">{bill.tableNo || 'N/A'}</span>
                                    <div className="billed-sticker">BILLED</div>
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
                                        className="btn-billing-print"
                                        onClick={() => handlePrint()}
                                    >
                                        <span>🖨️</span>
                                        Reprint
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
