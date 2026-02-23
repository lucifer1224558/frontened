'use client';

import { Item } from '@/lib/types';
import { useMenu } from '@/context/MenuContext';
import '../../app/dashboard/dashboard.css';

interface DisplayProps {
    selectedCategory: string;
    searchTerm: string;
    onAddToCart: (item: Item) => void;
}

export default function Display({ selectedCategory, searchTerm, onAddToCart }: DisplayProps) {
    const { items, isLoading, error } = useMenu();

    if (isLoading && items.length === 0) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading menu...</p>
            </div>
        );
    }

    if (error && items.length === 0) {
        return (
            <div className="error-banner">
                <div style={{ fontSize: '40px' }}>⚠️</div>
                <p>Failed to load menu: {error}</p>
            </div>
        );
    }

    const filteredItems = items.filter(item => {
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="menu-grid">
            {filteredItems.map((item) => (
                <div
                    key={item._id}
                    className="menu-item-card"
                    onClick={() => onAddToCart(item)}
                >
                    <div className="item-icon">{item.image}</div>

                    <div className="item-card-name">{item.name}</div>
                    <div className="item-card-price">₹{item.price.toFixed(2)}</div>
                </div>
            ))}
        </div>
    );
}
