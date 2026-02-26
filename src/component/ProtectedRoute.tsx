'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/lib/types';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                // Not logged in, redirect to landing
                router.push('/');
            } else if (allowedRoles && !allowedRoles.includes(user.role)) {
                // Logged in but doesn't have the required role
                router.push('/dashboard'); // Or an unauthorized page
            }
        }
    }, [user, isLoading, router, allowedRoles]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
                    <p className="font-bold text-orange-500 tracking-widest text-sm uppercase">Authenticating...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect in useEffect
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return null; // Will redirect in useEffect
    }

    return <>{children}</>;
}
