'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Item } from '@/lib/types';
import { items as initialItems, categories as initialCategories } from '@/lib/data';
import { API_ENDPOINTS } from '@/api/endpoint';

interface MenuContextType {
    items: Item[];
    categories: string[];
    isLoading: boolean;
    error: string | null;
    addItem: (item: Omit<Item, '_id' | 'id'>) => Promise<void>;
    updateItem: (item: Item) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
    refreshItems: () => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<Item[]>([]);
    const [categories, setCategories] = useState<string[]>(initialCategories);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchItems = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(API_ENDPOINTS.ITEMS);
            if (!response.ok) {
                throw new Error(`Failed to fetch items: ${response.statusText}`);
            }
            const data = await response.json();
            setItems(data);
            // Ensure 'All' is present and merge with backend categories
            if (data.length > 0) {
                const itemCategories = data.map((item: Item) => item.category);
                const uniqueCategories = Array.from(new Set(['All', ...initialCategories, ...itemCategories])) as string[];
                setCategories(uniqueCategories);
            } else {
                setCategories(['All', ...initialCategories]);
            }
        } catch (err) {
            console.error('Error fetching menu items:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            // Fallback to local storage or static data if API fails
            const savedItems = localStorage.getItem('pos_menu_items');
            if (savedItems) {
                setItems(JSON.parse(savedItems));
            } else {
                setItems([]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    // Save to localStorage whenever items change
    useEffect(() => {
        if (items.length > 0) {
            localStorage.setItem('pos_menu_items', JSON.stringify(items));
        }
    }, [items]);

    const addItem = async (newItem: Omit<Item, '_id' | 'id'>) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(API_ENDPOINTS.ITEMS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });

            if (!response.ok) {
                throw new Error(`Failed to add item: ${response.statusText}`);
            }

            const data = await response.json();
            setItems(prev => [...prev, data]);
        } catch (err) {
            console.error('Error adding item:', err);
            setError(err instanceof Error ? err.message : 'Failed to add item');
        } finally {
            setIsLoading(false);
        }
    };

    const updateItem = async (updatedItem: Item) => {
        try {
            const response = await fetch(`${API_ENDPOINTS.ITEMS}/${updatedItem._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedItem),
            });
            if (!response.ok) {
                throw new Error(`Failed to update item: ${response.statusText}`);
            }
            const data = await response.json();
            setItems(prev => prev.map(item => item._id === updatedItem._id ? data : item));
        } catch (err) {
            console.error('Error updating item:', err);
            setError(err instanceof Error ? err.message : 'Failed to update item');
        }
    };

    const deleteItem = async (id: string) => {
        try {
            const response = await fetch(`${API_ENDPOINTS.ITEMS}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`Failed to delete item: ${response.statusText}`);
            }
            setItems(prev => prev.filter(item => item._id !== id));
        } catch (err) {
            console.error('Error deleting item:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete item');
        }
    };

    return (
        <MenuContext.Provider value={{
            items,
            categories,
            isLoading,
            error,
            addItem,
            updateItem,
            deleteItem,
            refreshItems: fetchItems
        }}>
            {children}
        </MenuContext.Provider>
    );
}

export function useMenu() {
    const context = useContext(MenuContext);
    if (context === undefined) {
        throw new Error('useMenu must be used within a MenuProvider');
    }
    return context;
}
