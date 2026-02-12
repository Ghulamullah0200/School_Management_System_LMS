import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: 'admin' | 'teacher' | 'student' | 'parent';
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar Component (Handles its own width and fixed positioning) */}
            <Sidebar role={role} />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Navbar Component */}
                <Navbar />

                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
