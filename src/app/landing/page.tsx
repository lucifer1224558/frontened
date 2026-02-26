'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate login
        setTimeout(() => {
            setIsLoading(false);
            router.push('/dashboard');
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0f172a]">
            {/* Dynamic Background Gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/20 blur-[120px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="relative z-10 w-full max-w-md px-6">
                {/* Logo Area */}
                <div className="flex flex-col items-center mb-10 space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/20 transform rotate-12 transition-transform hover:rotate-0 duration-500">
                        <span className="text-4xl">🍕</span>
                    </div>
                    <div className="text-center">
                        <h1 className="text-4xl font-black text-white tracking-tight">
                            POS<span className="text-orange-500">Pro</span>
                        </h1>
                        <p className="text-slate-400 font-medium mt-1">Premium Restaurant Management</p>
                    </div>
                </div>

                {/* Login Card */}
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-hidden relative group">
                    {/* Decorative line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-right from-transparent via-orange-500/50 to-transparent"></div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white">Welcome back</h2>
                        <p className="text-slate-400 text-sm mt-1">Please enter your details to sign in</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Username Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Username</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-lg opacity-50 group-focus-within:opacity-100 transition-opacity">👤</span>
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all duration-300 placeholder:text-slate-600"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
                                <button type="button" className="text-xs font-bold text-orange-500 hover:text-orange-400 transition-colors">Forgot?</button>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-lg opacity-50 group-focus-within:opacity-100 transition-opacity">🔒</span>
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all duration-300 placeholder:text-slate-600"
                                    required
                                />
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full relative group overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-orange-500/20 active:scale-[0.98] transition-all duration-200 ${isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-orange-500/40 hover:-translate-y-0.5'}`}
                        >
                            <span className={`flex items-center justify-center transition-all duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                                Sign In
                                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </span>

                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                </div>
                            )}
                        </button>
                    </form>

                    {/* Quick Login Links (Experimental) */}
                    <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center space-y-4">
                        <p className="text-slate-500 text-xs font-medium">Don't have an account?</p>
                        <button className="px-6 py-2 rounded-xl bg-white/5 text-white text-xs font-bold border border-white/10 hover:bg-white/10 transition-colors">
                            Contact Admin Support
                        </button>
                    </div>
                </div>

                {/* Footer Text */}
                <p className="mt-10 text-center text-slate-500 text-sm font-medium">
                    &copy; {new Date().getFullYear()} POS Pro. All rights reserved.
                </p>
            </div>

            {/* Custom Styles for extra polish */}
            <style jsx>{`
                .border-3 { border-width: 3px; }
            `}</style>
        </div>
    );
}
