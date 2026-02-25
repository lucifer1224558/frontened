'use client';

// This file must be a standalone client component with its own <html> and <body> tags.
// It renders OUTSIDE the root layout in Next.js App Router.
// It must NOT import any context providers or hooks like useContext.

export default function GlobalError({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column' as const,
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100vh',
                        backgroundColor: '#F4F7F9',
                        padding: '2rem',
                    }}
                >
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1a1a2e' }}>
                        Something went wrong!
                    </h2>
                    <button
                        onClick={() => reset()}
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
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}
