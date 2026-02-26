'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import './landing.css';

export default function LandingPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        const result = await login(username, password);

        if (result.success) {
            router.push('/dashboard');
        } else {
            setError(result.message || 'Invalid username or password');
            setSubmitting(false);
        }
    };

    return (
        <div className="landing-container">
            {/* Dynamic Background Gradients */}
            <div className="bg-blob blob-1"></div>
            <div className="bg-blob blob-2"></div>

            <div className="relative z-10 w-full max-w-md px-6">
                {/* Logo Area */}
                <div className="logo-container">
                    <div className="logo-box">
                        <span>🍕</span>
                    </div>
                    <div className="text-center">
                        <h1 className="text-4xl font-black text-white tracking-tight">
                            POS<span className="text-orange-500">Pro</span>
                        </h1>
                        <p className="text-slate-400 font-medium mt-1">Premium Restaurant Management</p>
                    </div>
                </div>

                {/* Login Card */}
                <div className="login-card">
                    {/* Decorative line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-right from-transparent via-orange-500/50 to-transparent"></div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white">Welcome back</h2>
                        <p className="text-slate-400 text-sm mt-1">Please enter your details to sign in</p>

                        {error && (
                            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium animate-shake">
                                ⚠️ {error}
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Username Input */}
                        <div className="input-group">
                            <label className="input-label">Username</label>
                            <div className="input-wrapper">
                                <span className="input-icon">👤</span>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    className="login-input"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="input-group">
                            <div className="flex justify-between items-center px-1">
                                <label className="input-label">Password</label>
                                <button type="button" className="text-xs font-bold text-orange-500 hover:text-orange-400 transition-colors">Forgot?</button>
                            </div>
                            <div className="input-wrapper">
                                <span className="input-icon">🔒</span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="login-input"
                                    required
                                />
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="login-btn"
                        >
                            {!submitting ? (
                                <>
                                    <span>Sign In</span>
                                    <span className="transition-transform group-hover:translate-x-1">→</span>
                                </>
                            ) : (
                                <div className="spinner"></div>
                            )}
                        </button>
                    </form>

                    {/* Quick Login Links */}
                    <div className="footer-text">
                        <p className="text-slate-500 text-xs font-medium">Don't have an account?</p>
                        <button className="secondary-btn">
                            Contact Admin Support
                        </button>
                    </div>
                </div>

                {/* Footer Text */}
                <p className="mt-10 text-center text-slate-500 text-sm font-medium">
                    &copy; {new Date().getFullYear()} POS Pro. All rights reserved.
                </p>
            </div>
        </div>
    );
}
