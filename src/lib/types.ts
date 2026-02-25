export interface Item {
    _id: string;
    id?: number;
    name: string;
    price: number;
    category?: string;
    image?: string;
}

export interface CartItem extends Item {
    quantity: number;
}

export interface Bill {
    _id: string; // MongoDB ID
    id?: string; // Legacy ID
    dineType: string;
    tableNo: string;
    items: {
        itemId: string;
        name: string;
        price: number;
        quantity: number;
        subtotal: number;
    }[];
    totalAmount: number;
    gst: number;
    discount: number;
    paymentMethod: string;
    billed?: boolean;
    createdAt?: string;
    updatedAt?: string;
    // Keep legacy fields for compatibility during transition if needed
    subtotal?: number;
    taxes?: number;
    total?: number;
    timestamp?: string;
    orderNo?: string;
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
