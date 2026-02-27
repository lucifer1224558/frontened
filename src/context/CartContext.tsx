'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Bill } from '@/lib/types';
import { API_ENDPOINTS } from '@/api/endpoint';
import { useAuth } from './AuthContext';

interface CartContextType {
    cart: CartItem[];
    bills: Bill[];
    addToCart: (item: any) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    clearCart: () => void;
    saveBill: (orderNo: string, tableNo: string) => void;
    placeOrder: (orderData: { dineType: string; tableNo: string; paymentMethod: string }) => Promise<void>;
    editBill: (bill: Bill) => void;
    deleteBill: (id: string) => Promise<void>;
    markAsBilled: (id: string) => Promise<void>;
    paidBills: Bill[];
    refreshPaidBills: () => Promise<void>;
    editingBillId: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<any>([]);
    const [bills, setBills] = useState<any>([]);
    const [paidBills, setPaidBills] = useState<any>([]);
    const [editingBillId, setEditingBillId] = useState<string | null>(null);
    const { user, token } = useAuth();

    // Fetch bills from API on mount
    const refreshBills = async () => {
        try {
            if (typeof window === "undefined") return;

            const response = await fetch(API_ENDPOINTS.BILLINGS, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) return;

            const data = await response.json();
            setBills(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching bills:", err);
            setBills([]);
        }
    };

    const refreshPaidBills = async () => {
        try {
            if (typeof window === "undefined") return;

            const response = await fetch(API_ENDPOINTS.PAID_BILLINGS, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) return;

            const data = await response.json();
            setPaidBills(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching paid bills:", err);
            setPaidBills([]);
        }
    };


    useEffect(() => {
        if (user) {
            refreshBills();
            refreshPaidBills();
        } else {
            setBills([]);
            setPaidBills([]);
        }
    }, [user]);

    const addToCart = (item: any) => {
        setCart((prevCart: CartItem[]) => {
            const existingItem = prevCart.find(i => i._id === item._id);
            if (existingItem) {
                return prevCart.map(i =>
                    i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setCart((prevCart: CartItem[]) => prevCart.filter(item => item._id !== id));
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart((prevCart: CartItem[]) => prevCart.map(item => {
            if (item._id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const clearCart = () => {
        setCart([]);
        setEditingBillId(null);
    };

    const editBill = (bill: Bill) => {
        const mappedItems: CartItem[] = bill.items.map(item => ({
            _id: item.itemId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            // category and image are now optional, so they can be omitted or undefined
        }));
        setCart(mappedItems);
        setEditingBillId(bill._id || bill.id || null);
    };

    const saveBill = (orderNo: string, tableNo: string) => {
        if (cart.length === 0) return;

        const subtotal = cart.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
        const taxes = subtotal * 0.05;
        const total = subtotal + taxes;

        if (editingBillId) {
            setBills((prevBills: Bill[]) => prevBills.map(b =>
                b.id === editingBillId
                    ? { ...b, items: [...cart], subtotal, taxes, total, timestamp: new Date().toISOString() }
                    : b
            ));
        } else {
            const newBill: Bill = {
                _id: Date.now().toString(),
                id: Date.now().toString(),
                items: [...cart],
                subtotal,
                taxes,
                total,
                timestamp: new Date().toISOString(),
                orderNo,
                tableNo,
                dineType: 'Dine In', // Providing defaults to match Bill type
                totalAmount: total,
                gst: 5,
                discount: 0,
                paymentMethod: 'Cash'
            };
            setBills((prevBills: Bill[]) => [newBill, ...prevBills]);
        }

        clearCart();
    };

    const placeOrder = async (orderData: { dineType: string; tableNo: string; paymentMethod: string }) => {
        if (cart.length === 0) return;

        const totalAmount = cart.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);

        const payload = {
            dineType: orderData.dineType,
            tableNo: orderData.tableNo,
            items: cart.map((item: CartItem) => ({
                itemId: item._id, // Using correct _id from backend
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                subtotal: item.price * item.quantity
            })),
            totalAmount,
            gst: 18, // Fixed GST as per user example
            discount: 0,
            paymentMethod: orderData.paymentMethod
        };

        try {
            const url = editingBillId
                ? `${API_ENDPOINTS.BILLINGS}/${editingBillId}`
                : API_ENDPOINTS.BILLINGS;
            const method = editingBillId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to place order: ${response.statusText}`);
            }

            // If successful, clear cart and notify
            clearCart();
            refreshBills(); // Refresh history
            alert('Order Placed Successfully!');
        } catch (err) {
            console.error('Error placing order:', err);
            alert(`Error: ${err instanceof Error ? err.message : 'Failed to place order'}`);
        }
    };

    const deleteBill = async (id: string) => {
        try {
            const response = await fetch(`${API_ENDPOINTS.BILLINGS}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Failed to delete bill: ${response.statusText}`);
            }

            // Update local state
            setBills((prevBills: Bill[]) => prevBills.filter((b: Bill) => (b._id || b.id) !== id));
            alert('Bill deleted successfully');
        } catch (err) {
            console.error('Error deleting bill:', err);
            alert(`Error: ${err instanceof Error ? err.message : 'Failed to delete bill'}`);
        }
    };

    const markAsBilled = async (id: string) => {
        try {
            const response = await fetch(`${API_ENDPOINTS.BILLINGS}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ billed: true }),
            });

            if (!response.ok) {
                throw new Error(`Failed to update bill status: ${response.statusText}`);
            }

            // Update local state and history
            setBills((prevBills: Bill[]) => prevBills.map((b: Bill) =>
                (b._id || b.id) === id ? { ...b, billed: true } : b
            ));
            refreshPaidBills();
        } catch (err) {
            console.error('Error marking bill as billed:', err);
        }
    };

    return (
        <CartContext.Provider value={{
            cart,
            bills,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            saveBill,
            placeOrder,
            editBill,
            deleteBill,
            markAsBilled,
            paidBills,
            refreshPaidBills,
            editingBillId
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
