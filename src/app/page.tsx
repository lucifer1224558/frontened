import styles from './billing.module.css';

interface Item {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

const items: Item[] = [
  { id: 1, name: 'Margherita Pizza', price: 299, category: 'Pizza', image: '🍕' },
  { id: 2, name: 'Pepperoni Pizza', price: 399, category: 'Pizza', image: '🍕' },
  { id: 3, name: 'Cheese Burger', price: 149, category: 'Burger', image: '🍔' },
  { id: 4, name: 'Veggie Burger', price: 129, category: 'Burger', image: '🍔' },
  { id: 5, name: 'French Fries', price: 99, category: 'Sides', image: '🍟' },
  { id: 6, name: 'Coke', price: 49, category: 'Beverages', image: '🥤' },
  { id: 7, name: 'Pasta Carbonara', price: 349, category: 'Pasta', image: '🍝' },
  { id: 8, name: 'Garlic Bread', price: 89, category: 'Sides', image: '🥖' },
];

export default function BillingPage() {
  return (
    <div className={styles.billingWrapper}>
      <div className={styles.menuSection}>
        <div className={styles.categoryTabs}>
          {['All', 'Pizza', 'Burger', 'Pasta', 'Sides', 'Beverages'].map((cat) => (
            <button key={cat} className={`${styles.tab} ${cat === 'All' ? styles.activeTab : ''}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className={styles.itemGrid}>
          {items.map((item) => (
            <div key={item.id} className={styles.itemCard}>
              <div className={styles.itemImage}>{item.image}</div>
              <div className={styles.itemInfo}>
                <h3 className={styles.itemName}>{item.name}</h3>
                <p className={styles.itemPrice}>₹{item.price}</p>
              </div>
              <button className={styles.addBtn}>Add</button>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.cartSection}>
        <div className={styles.cartHeader}>
          <h2>Current Order</h2>
          <span className={styles.orderNo}>#ORD-1234</span>
        </div>

        <div className={styles.cartItems}>
          <div className={styles.emptyCart}>
            <span className={styles.emptyIcon}>🛒</span>
            <p>Your cart is empty</p>
          </div>
        </div>

        <div className={styles.cartFooter}>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>₹0.00</span>
          </div>
          <div className={styles.summaryRow}>
            <span>GST (5%)</span>
            <span>₹0.00</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.totalRow}`}>
            <span>Total</span>
            <span>₹0.00</span>
          </div>
          <button className={styles.checkoutBtn} disabled>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
