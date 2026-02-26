'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse } from '@/lib/types';
import { API_ENDPOINTS } from '@/api/endpoint';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load token and user from localStorage on mount
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser && storedUser !== 'undefined') {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            } catch (err) {
                console.error("Failed to parse user from localStorage", err);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data: AuthResponse & { message?: string } = await response.json();

            if (response.ok) {
                const user = data.data.user;
                setToken(data.token);
                setUser(user);
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(user));
                return { success: true };
            } else {
                return { success: false, message: data.message || 'Login failed' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Server connection error' };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
