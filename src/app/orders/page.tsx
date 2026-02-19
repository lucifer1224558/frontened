'use client';

import { useState } from 'react';
import { externalOrders } from '@/lib/data';
import './orders.css';

export default function OrdersPage() {
    const [activeTab, setActiveTab] = useState<'All' | 'Zomato' | 'Swiggy' | 'Website'>('All');

    const filteredOrders = activeTab === 'All'
        ? externalOrders
        : externalOrders.filter(order => order.source === activeTab);

    const getSourceClass = (source: string) => {
        switch (source) {
            case 'Zomato': return 'bg-[#CB202D]';
            case 'Swiggy': return 'bg-[#FC8019]';
            case 'Website': return 'bg-blue-600';
            default: return 'bg-gray-500';
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Pending': return { backgroundColor: '#FEF9C3', color: '#854D0E' };
            case 'Preparing': return { backgroundColor: '#DCFCE7', color: '#166534' };
            case 'Ready': return { backgroundColor: '#DBEAFE', color: '#1E40AF' };
            default: return { backgroundColor: '#F3F4F6', color: '#374151' };
        }
    };

    return (
        <div className="orders-container">
            <header className="orders-header">
                <h1>External Orders</h1>
            </header>

            <div className="tab-container">
                {(['All', 'Zomato', 'Swiggy', 'Website'] as const).map(tab => (
                    <button
                        key={tab}
                        className={`tab-btn ${activeTab === tab ? 'tab-btn-active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="orders-grid">
                {filteredOrders.length === 0 ? (
                    <div className="empty-orders">
                        <p>No {activeTab === 'All' ? '' : activeTab} orders at the moment.</p>
                    </div>
                ) : (
                    filteredOrders.map((order) => {
                        const style = getStatusStyles(order.status);
                        return (
                            <div key={order.id} className="order-card">
                                <div className="order-card-header">
                                    <div className="order-no-container">
                                        <span className="order-id-text">{order.id}</span>
                                        <div className={`source-badge ${getSourceClass(order.source)}`}>
                                            {order.source}
                                        </div>
                                    </div>
                                    <span className="status-badge" style={style}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="customer-info-box">
                                    <div className="customer-name-row">
                                        <span>👤</span>
                                        <span className="customer-name-text">{order.customerName}</span>
                                    </div>
                                    <div className="customer-details">
                                        <span className="phone-text">{order.customerPhone}</span>
                                        {order.address && (
                                            <span className="address-text" title={order.address}>{order.address}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="order-items-list">
                                    <h4 className="section-label" style={{ letterSpacing: '0.15em' }}>Order Details</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {order.items.map((item: any, idx: number) => (
                                            <div key={idx} className="order-item-row">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <span className="qty-pill">x{item.quantity}</span>
                                                    <span style={{ color: '#475569', fontWeight: 700 }}>{item.name}</span>
                                                </div>
                                                <span className="item-price-text">₹{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="order-footer-row">
                                    <div className="total-col">
                                        <span className="section-label">Total Amount</span>
                                        <span className="total-value-text">₹{order.total.toFixed(2)}</span>
                                    </div>
                                    <div className="action-btns">
                                        {order.status === 'Pending' && (
                                            <button className="btn-accept">Accept Order</button>
                                        )}
                                        {order.status === 'Preparing' && (
                                            <button className="btn-ready">Mark Ready</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
