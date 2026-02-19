'use client';

import { useCart } from '@/context/CartContext';
import './sales.css';

export default function SalesPage() {
    const { bills } = useCart();

    // Today's Sales Calculations
    const today = new Date().toISOString().split('T')[0];
    const todayBills = bills.filter(bill => bill.timestamp.startsWith(today));

    const todayRevenue = todayBills.reduce((sum, bill) => sum + bill.total, 0);
    const orderCount = todayBills.length;
    const avgOrderValue = orderCount > 0 ? todayRevenue / orderCount : 0;

    // Mock data for previous sales comparison
    const yesterdayRevenue = 12500;
    const revenueGrowth = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;

    // Helper to format currency
    const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

    return (
        <div className="sales-container">
            <header className="sales-header">
                <h1>Sales Insights</h1>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-label">Today's Revenue</span>
                    <span className="stat-value">{formatCurrency(todayRevenue)}</span>
                    <div className={`stat-growth ${revenueGrowth >= 0 ? 'growth-positive' : 'growth-negative'}`}>
                        {revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(revenueGrowth).toFixed(1)}% vs yesterday
                    </div>
                </div>

                <div className="stat-card">
                    <span className="stat-label">Orders Today</span>
                    <span className="stat-value">{orderCount}</span>
                    <div className="stat-info">
                        Active sessions: {todayBills.filter(b => b.tableNo).length}
                    </div>
                </div>

                <div className="stat-card">
                    <span className="stat-label">Average Order Value</span>
                    <span className="stat-value">{formatCurrency(avgOrderValue)}</span>
                    <div className="stat-info">
                        Items per order (avg): 3.4
                    </div>
                </div>

                <div className="stat-card">
                    <span className="stat-label">Monthly Target</span>
                    <span className="stat-value">65%</span>
                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: '65%' }}></div>
                    </div>
                </div>
            </div>

            <div className="insights-grid">
                <div className="table-card">
                    <h2 className="card-title">Recent Transactions</h2>
                    <div className="transaction-list">
                        {todayBills.length === 0 ? (
                            <p style={{ color: '#64748B', textAlign: 'center', padding: '32px 0' }}>No transactions today yet.</p>
                        ) : (
                            todayBills.slice(0, 10).map((bill) => (
                                <div key={bill.id} className="transaction-row">
                                    <div className="order-info">
                                        <h4>Order {bill.orderNo}</h4>
                                        <span className="order-metadata">{new Date(bill.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {bill.items.length} items</span>
                                    </div>
                                    <span className="order-total-text">{formatCurrency(bill.total)}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="table-card">
                    <h2 className="card-title">Category Sales</h2>
                    <div className="category-sales-list">
                        {[
                            { label: 'North Indian', value: '45%' },
                            { label: 'Chinese', value: '25%' },
                            { label: 'Beverages', value: '15%' },
                            { label: 'Sweets', value: '10%' },
                            { label: 'Other', value: '5%' }
                        ].map((cat) => (
                            <div key={cat.label} className="category-row">
                                <div className="category-label-row">
                                    <span className="category-name-text">{cat.label}</span>
                                    <span className="category-value-text">{cat.value}</span>
                                </div>
                                <div className="mini-progress-bg">
                                    <div className="mini-progress-fill" style={{ width: cat.value }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
