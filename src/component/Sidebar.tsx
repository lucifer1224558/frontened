'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './sidebar.css';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: '📊', path: '/dashboard' },
    { name: 'Billing', icon: '🧾', path: '/billing' },
    { name: 'Orders', icon: '📦', path: '/orders' },
    { name: 'Menu', icon: '🍴', path: '/menu' },
    { name: 'SalesInsight', icon: '⚙️', path: '/sales' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand">
          <div className="brand-icon-container">
            <span className="brand-icon">🍕</span>
          </div>
          <span className="brand-name">POS Pro</span>
        </div>

        <div className="navbar-nav">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-search">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search items..." className="search-input" />
        </div>

        <div className="navbar-status">
          <span className="status-dot"></span>
          Online
        </div>

        <div className="navbar-user">
          <div className="user-avatar">JD</div>
          <div className="user-info">
            <p className="user-name">John Doe</p>
            <p className="user-role">Admin</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
