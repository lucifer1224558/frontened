'use client';

import { usePathname } from 'next/navigation';
import Sidebar from "@/component/sidebar";
import ProtectedRoute from "@/component/ProtectedRoute";

export default function DashboardWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Define pages that shouldn't have the dashboard layout (sidebar, etc.)
    const isAuthPage = pathname === '/';

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <ProtectedRoute>
            <div className="flex flex-col h-screen overflow-hidden bg-[#F4F7F9] p-3 gap-4">
                <Sidebar />
                <main className="flex-1 overflow-y-auto bg-white rounded-[2rem] shadow-sm border border-black/5 p-6 min-w-0">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}
