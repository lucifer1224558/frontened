'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import './sidebar.css';

export default function Sidebar() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: 'Dashboard', icon: '📊', path: '/dashboard' },
    {
      name: 'Billing',
      icon: '🧾',
      path: '/billing',
      subItems: [
        { name: 'Pending Billed', path: '/billing' },
        { name: 'Billed History', path: '/billing/history' }
      ]
    },
    { name: 'Orders', icon: '📦', path: '/orders' },
    { name: 'Menu', icon: '🍴', path: '/menu' },
    { name: 'SalesInsight', icon: '⚙️', path: '/sales' },
  ];

  const handleItemClick = (item: any) => {
    if (item.subItems) {
      setExpandedItem(expandedItem === item.name ? null : item.name);
    } else {
      router.push(item.path);
    }
  };

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
            const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
            const isExpanded = expandedItem === item.name;

            return (
              <div key={item.name} className="nav-group">
                <div
                  className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
                  onClick={() => handleItemClick(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.name}</span>
                  {item.subItems && (
                    <span className={`dropdown-arrow ${isExpanded ? 'arrow-up' : ''}`}>▼</span>
                  )}
                </div>

                {item.subItems && isExpanded && (
                  <div className="sub-nav">
                    {item.subItems.map((sub) => {
                      const isSubActive = pathname === sub.path;
                      return (
                        <Link
                          key={sub.name}
                          href={sub.path}
                          className={`sub-nav-item ${isSubActive ? 'sub-nav-active' : ''}`}
                          onClick={() => setExpandedItem(null)}
                        >
                          {sub.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
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
