import styles from './layout.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.searchBar}>
                <span className={styles.searchIcon}>🔍</span>
                <input type="text" placeholder="Search menu items..." className={styles.searchInput} />
            </div>
            <div className={styles.headerActions}>
                <button className={styles.actionBtn}>
                    <span className={styles.icon}>🔔</span>
                </button>
                <button className={styles.actionBtn}>
                    <span className={styles.icon}>💬</span>
                </button>
                <div className={styles.statusBadge}>
                    <span className={styles.statusDot}></span>
                    Online
                </div>
            </div>
        </header>
    );
}
