'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Bill } from '@/lib/types';

interface CartContextType {
    cart: CartItem[];
    bills: Bill[];
    addToCart: (item: any) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, delta: number) => void;
    clearCart: () => void;
    saveBill: (orderNo: string, tableNo: string) => void;
    editBill: (bill: Bill) => void;
    editingBillId: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [bills, setBills] = useState<Bill[]>([]);
    const [editingBillId, setEditingBillId] = useState<string | null>(null);

    // Load bills from localStorage on mount
    useEffect(() => {
        const savedBills = localStorage.getItem('pos_bills');
        if (savedBills) {
            setBills(JSON.parse(savedBills));
        }
    }, []);

    // Save bills to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('pos_bills', JSON.stringify(bills));
    }, [bills]);

    const addToCart = (item: any) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(i => i.id === item.id);
            if (existingItem) {
                return prevCart.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (id: number) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    const updateQuantity = (id: number, delta: number) => {
        setCart(prevCart => prevCart.map(item => {
            if (item.id === id) {
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
        setCart(bill.items);
        setEditingBillId(bill.id);
    };

    const saveBill = (orderNo: string, tableNo: string) => {
        if (cart.length === 0) return;

        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const taxes = subtotal * 0.05;
        const total = subtotal + taxes;

        if (editingBillId) {
            setBills(prevBills => prevBills.map(b =>
                b.id === editingBillId
                    ? { ...b, items: [...cart], subtotal, taxes, total, timestamp: new Date().toISOString() }
                    : b
            ));
        } else {
            const newBill: Bill = {
                id: Date.now().toString(),
                items: [...cart],
                subtotal,
                taxes,
                total,
                timestamp: new Date().toISOString(),
                orderNo,
                tableNo
            };
            setBills(prevBills => [newBill, ...prevBills]);
        }

        clearCart();
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
            editBill,
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
