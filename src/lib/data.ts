import { Item } from './types';

export const items: Item[] = [
    /* North Indian */
    { id: 1, name: 'Paneer Butter Masala', price: 280, category: 'North Indian', image: '🥘' },
    { id: 2, name: 'Dal Makhani', price: 220, category: 'North Indian', image: '🍛' },
    { id: 3, name: 'Butter Naan', price: 40, category: 'North Indian', image: '🫓' },

    /* South Indian */
    { id: 4, name: 'Masala Dosa', price: 120, category: 'South Indian', image: '🥞' },
    { id: 5, name: 'Idli Sambar', price: 80, category: 'South Indian', image: '⚪' },
    { id: 6, name: 'Medux Vada', price: 90, category: 'South Indian', image: '🍩' },

    /* Cheese */
    { id: 7, name: 'Cheese Burst Pizza', price: 450, category: 'Cheese', image: '🍕' },
    { id: 8, name: 'Cheese Garlic Bread', price: 160, category: 'Cheese', image: '🥖' },

    /* Snacks */
    { id: 9, name: 'Samosa (2pcs)', price: 40, category: 'Snacks', image: '🥣' },
    { id: 10, name: 'Vada Pav', price: 30, category: 'Snacks', image: '🍔' },
    { id: 11, name: 'Paneer Pakoda', price: 150, category: 'Snacks', image: '🍤' },

    /* Sweets */
    { id: 12, name: 'Gulab Jamun', price: 60, category: 'Sweets', image: '🍯' },
    { id: 13, name: 'Rasmalai', price: 80, category: 'Sweets', image: '🥛' },

    /* Good Morning */
    { id: 14, name: 'Poha', price: 50, category: 'Good Morning', image: '🍚' },
    { id: 15, name: 'Aloo Paratha', price: 70, category: 'Good Morning', image: '🫓' },
    { id: 16, name: 'Masala Tea', price: 25, category: 'Good Morning', image: '☕' },
];

export const categories = [
    'All',
    'North Indian',
    'South Indian',
    'Cheese',
    'Snacks',
    'Sweets',
    'Good Morning'
];

export const externalOrders: any[] = [
    {
        id: 'EXT-001',
        source: 'Zomato',
        items: [
            { id: 1, name: 'Paneer Butter Masala', price: 280, quantity: 1, category: 'North Indian', image: '🥘' },
            { id: 3, name: 'Butter Naan', price: 40, quantity: 2, category: 'North Indian', image: '🫓' }
        ],
        subtotal: 360,
        taxes: 18,
        total: 378,
        status: 'Pending',
        timestamp: new Date().toISOString(),
        customerName: 'Rahul Sharma',
        customerPhone: '9876543210',
        address: 'Sector 44, Gurgaon'
    },
    {
        id: 'EXT-002',
        source: 'Swiggy',
        items: [
            { id: 4, name: 'Masala Dosa', price: 120, quantity: 2, category: 'South Indian', image: '🥞' }
        ],
        subtotal: 240,
        taxes: 12,
        total: 252,
        status: 'Preparing',
        timestamp: new Date().toISOString(),
        customerName: 'Anita Gupta',
        customerPhone: '9123456789',
        address: 'Hauz Khas Village'
    },
    {
        id: 'EXT-003',
        source: 'Website',
        items: [
            { id: 7, name: 'Cheese Burst Pizza', price: 450, quantity: 1, category: 'Cheese', image: '🍕' },
            { id: 8, name: 'Cheese Garlic Bread', price: 160, quantity: 1, category: 'Cheese', image: '🥖' }
        ],
        subtotal: 610,
        taxes: 30.5,
        total: 640.5,
        status: 'Ready',
        timestamp: new Date().toISOString(),
        customerName: 'Sanjay Verma',
        customerPhone: '8888888888',
        address: 'DLF Phase 3, Gurgaon'
    }
];
