'use client';

import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            fontFamily: 'system-ui, sans-serif',
            padding: '2rem',
        }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#1a1a2e' }}>404</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>Page not found</p>
            <button
                onClick={() => router.push('/dashboard')}
                style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#F97316',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 600,
                }}
            >
                Go to Dashboard
            </button>
        </div>
    );
}
