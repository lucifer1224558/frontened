import styles from './layout.module.css';
import Link from 'next/link';

export default function Sidebar() {
  const menuItems = [
    { name: 'Dashboard', icon: '📊', path: '/' },
    { name: 'Billing', icon: '🧾', path: '/billing' },
    { name: 'Orders', icon: '📦', path: '/orders' },
    { name: 'Menu', icon: '🍴', path: '/menu' },
    { name: 'Settings', icon: '⚙️', path: '/settings' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>🍕</span>
        <span className={styles.logoText}>POS Pro</span>
      </div>
      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <Link key={item.name} href={item.path} className={styles.navItem}>
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className={styles.profile}>
        <div className={styles.avatar}>JD</div>
        <div className={styles.profileInfo}>
          <p className={styles.name}>John Doe</p>
          <p className={styles.role}>Manager</p>
        </div>
      </div>
    </aside>
  );
}
