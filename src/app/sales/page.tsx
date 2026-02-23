'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import './sales.css';

export default function SalesPage() {
    const { paidBills, refreshPaidBills } = useCart();
    const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);

    // Target States (initialized with defaults or from localStorage)
    const [dailyTarget, setDailyTarget] = useState(() => {
        if (typeof window !== 'undefined') {
            return Number(localStorage.getItem('dailySalesTarget')) || 20000;
        }
        return 20000;
    });

    const [monthlyTarget, setMonthlyTarget] = useState(() => {
        if (typeof window !== 'undefined') {
            return Number(localStorage.getItem('monthlySalesTarget')) || 500000;
        }
        return 500000;
    });

    const [tempTargets, setTempTargets] = useState({ daily: dailyTarget, monthly: monthlyTarget });

    useEffect(() => {
        refreshPaidBills();
    }, []);

    // Today's Sales Calculations
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

    const todayBills = paidBills.filter(bill => {
        const date = bill.createdAt || bill.timestamp;
        return date?.startsWith(today);
    });

    const monthlyBills = paidBills.filter(bill => {
        const date = bill.createdAt || bill.timestamp;
        return date?.startsWith(currentMonth);
    });

    const todayRevenue = todayBills.reduce((sum, bill) => sum + (bill.totalAmount || bill.total || 0), 0);
    const monthlyRevenue = monthlyBills.reduce((sum, bill) => sum + (bill.totalAmount || bill.total || 0), 0);
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
                <div className="header-info">
                    <h1>Sales Insights</h1>
                    <p>Track your business performance and targets</p>
                </div>
                <button className="btn-set-targets" onClick={() => {
                    setTempTargets({ daily: dailyTarget, monthly: monthlyTarget });
                    setIsTargetModalOpen(true);
                }}>
                    🎯 Set Targets
                </button>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-label">Daily Revenue</span>
                    <span className="stat-value">{formatCurrency(todayRevenue)}</span>
                    <div className="target-progress">
                        <div className="progress-info">
                            <span>Daily Target: {formatCurrency(dailyTarget)}</span>
                            <span>{Math.min(100, (todayRevenue / dailyTarget) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="progress-bar-container">
                            <div
                                className={`progress-bar ${todayRevenue >= dailyTarget ? 'progress-success' : ''}`}
                                style={{ width: `${Math.min(100, (todayRevenue / dailyTarget) * 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <span className="stat-label">Monthly Revenue</span>
                    <span className="stat-value">{formatCurrency(monthlyRevenue)}</span>
                    <div className="target-progress">
                        <div className="progress-info">
                            <span>Monthly Target: {formatCurrency(monthlyTarget)}</span>
                            <span>{Math.min(100, (monthlyRevenue / monthlyTarget) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="progress-bar-container">
                            <div
                                className={`progress-bar ${monthlyRevenue >= monthlyTarget ? 'progress-success' : ''}`}
                                style={{ width: `${Math.min(100, (monthlyRevenue / monthlyTarget) * 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <span className="stat-label">Key Metrics</span>
                    <div className="metrics-list">
                        <div className="metric-item">
                            <span>Growth vs Yesterday</span>
                            <span className={revenueGrowth >= 0 ? 'growth-positive' : 'growth-negative'}>
                                {revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(revenueGrowth).toFixed(1)}%
                            </span>
                        </div>
                        <div className="metric-item">
                            <span>Orders Today</span>
                            <span>{orderCount}</span>
                        </div>
                        <div className="metric-item">
                            <span>Avg Order Value</span>
                            <span>{formatCurrency(avgOrderValue)}</span>
                        </div>
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
                                <div key={bill._id} className="transaction-row">
                                    <div className="order-info">
                                        <h4>Order {bill.orderNo || 'N/A'}</h4>
                                        <span className="order-metadata">
                                            {bill.createdAt || bill.timestamp
                                                ? new Date(bill.createdAt || bill.timestamp!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                : 'Unknown Time'} • {bill.items?.length || 0} items
                                        </span>
                                    </div>
                                    <span className="order-total-text">{formatCurrency(bill.totalAmount || bill.total || 0)}</span>
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
            {isTargetModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Set Sales Targets</h2>
                            <button onClick={() => setIsTargetModalOpen(false)} className="close-btn">✕</button>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Daily Revenue Target (₹)</label>
                            <input
                                type="number"
                                className="form-input"
                                value={tempTargets.daily}
                                onChange={(e) => setTempTargets({ ...tempTargets, daily: Number(e.target.value) })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Monthly Revenue Target (₹)</label>
                            <input
                                type="number"
                                className="form-input"
                                value={tempTargets.monthly}
                                onChange={(e) => setTempTargets({ ...tempTargets, monthly: Number(e.target.value) })}
                            />
                        </div>
                        <div className="form-actions">
                            <button className="btn btn-secondary" onClick={() => setIsTargetModalOpen(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={() => {
                                setDailyTarget(tempTargets.daily);
                                setMonthlyTarget(tempTargets.monthly);
                                localStorage.setItem('dailySalesTarget', tempTargets.daily.toString());
                                localStorage.setItem('monthlySalesTarget', tempTargets.monthly.toString());
                                setIsTargetModalOpen(false);
                            }}>Save Targets</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
