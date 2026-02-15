'use client';

import { Item } from '@/lib/types';
import { items } from '@/lib/data';
import styles from '@/app/Dashboard/billing.module.css';

interface DisplayProps {
    selectedCategory: string;
    onAddToCart: (item: Item) => void;
}

export default function Display({ selectedCategory, onAddToCart }: DisplayProps) {
    const filteredItems = selectedCategory === 'All'
        ? items
        : items.filter(item => item.category === selectedCategory);

    return (
        <div className={styles.itemGrid}>
            {filteredItems.map((item) => (
                <div key={item.id} className={styles.itemCard} onClick={() => onAddToCart(item)}>
                    <div className={styles.itemImage}>{item.image}</div>
                    <div className={styles.itemCardBody}>
                        <div className={styles.itemInfo}>
                            <h3 className={styles.itemName}>{item.name}</h3>
                            <span className={styles.itemCategoryName}>{item.category}</span>
                        </div>
                        <div className={styles.itemCardFooter}>
                            <p className={styles.itemPrice}>₹{item.price}</p>
                            <button
                                className={styles.addBtn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAddToCart(item);
                                }}
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
