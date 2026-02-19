export interface Item {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
}

export interface CartItem extends Item {
    quantity: number;
}

export interface Bill {
    id: string;
    items: CartItem[];
    subtotal: number;
    taxes: number;
    total: number;
    timestamp: string;
    orderNo: string;
    tableNo?: string;
}

export type OrderSource = 'Zomato' | 'Swiggy' | 'Website' | 'Direct';
export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled';

export interface ExternalOrder {
    id: string;
    source: OrderSource;
    items: CartItem[];
    subtotal: number;
    taxes: number;
    total: number;
    status: OrderStatus;
    timestamp: string;
    customerName: string;
    customerPhone: string;
    address?: string;
}
