import { Link, useLocation } from "wouter";
import { useAuth } from '@/contexts/AuthContext';
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    BookOpen,
    CalendarCheck,
    ClipboardList,
    CreditCard,
    Bus,
    Home,
    MessageSquare,
    Settings,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
    role: 'admin' | 'teacher' | 'student' | 'parent';
}

export default function Sidebar({ role }: SidebarProps) {
    const [location] = useLocation();
    const { logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
    };

    const toggleSidebar = () => setIsOpen(!isOpen);

    const adminMenu = [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
        { label: 'Classes', icon: BookOpen, href: '/admin/classes' },
        { label: 'Students', icon: Users, href: '/admin/students' },
        { label: 'Teachers', icon: GraduationCap, href: '/admin/teachers' },
        { label: 'Attendance', icon: CalendarCheck, href: '/admin/attendance' },
        { label: 'Exams & Marks', icon: ClipboardList, href: '/admin/exams' },
        { label: 'Fees & Accounts', icon: CreditCard, href: '/admin/fees' },
        { label: 'Transport', icon: Bus, href: '/admin/transport' },
        { label: 'Hostel', icon: Home, href: '/admin/hostel' },
        { label: 'Messages', icon: MessageSquare, href: '/admin/messages' },
        { label: 'Settings', icon: Settings, href: '/admin/settings' },
    ];

    const teacherMenu = [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/teacher' },
        { label: 'My Classes', icon: BookOpen, href: '/teacher/classes' },
        { label: 'Attendance', icon: CalendarCheck, href: '/teacher/attendance' },
        { label: 'Marks Entry', icon: ClipboardList, href: '/teacher/marks' },
        { label: 'Schedule', icon: CalendarCheck, href: '/teacher/schedule' },
        { label: 'Settings', icon: Settings, href: '/teacher/settings' },
    ];

    const studentMenu = [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/student' },
        { label: 'My Schedule', icon: CalendarCheck, href: '/student/schedule' },
        { label: 'Attendance', icon: CalendarCheck, href: '/student/attendance' },
        { label: 'Exam Results', icon: ClipboardList, href: '/student/marks' },
        { label: 'Assignments', icon: BookOpen, href: '/student/assignments' },
        { label: 'Settings', icon: Settings, href: '/student/settings' },
    ];

    const parentMenu = [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/parent' },
        { label: 'Children', icon: Users, href: '/parent/children' },
        { label: 'Performance', icon: ClipboardList, href: '/parent/performance' },
        { label: 'Attendance', icon: CalendarCheck, href: '/parent/attendance' },
        { label: 'Fees', icon: CreditCard, href: '/parent/fees' },
        { label: 'Settings', icon: Settings, href: '/parent/settings' },
    ];

    const menus = {
        admin: adminMenu,
        teacher: teacherMenu,
        student: studentMenu,
        parent: parentMenu
    };

    const currentMenu = menus[role] || [];

    // Mobile Toggle Button
    const MobileToggle = () => (
        <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50 bg-white shadow-md"
            onClick={toggleSidebar}
        >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
    );

    return (
        <>
            <MobileToggle />

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={cn(
                "fixed left-0 top-0 h-full bg-slate-900 text-white w-64 z-50 transition-transform duration-300 ease-in-out flex flex-col shadow-xl",
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                <div className="p-6 border-b border-slate-800 flex items-center justify-center">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <GraduationCap className="h-8 w-8 text-blue-400" />
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">EduPrime</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="space-y-1 px-3">
                        {currentMenu.map((item) => {
                            const isActive = location === item.href;
                            return (
                                <Link key={item.href} href={item.href}>
                                    <div className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors text-sm font-medium",
                                        isActive
                                            ? "bg-blue-600/20 text-blue-400 border border-blue-600/20"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800"
                                    )}>
                                        <item.icon className={cn("h-5 w-5", isActive ? "text-blue-400" : "text-slate-500 group-hover:text-white")} />
                                        <span>{item.label}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors text-sm font-medium"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </button>
                    <div className="mt-4 text-xs text-center text-slate-600">
                        v1.0.0 School Management
                    </div>
                </div>
            </aside>

            {/* Spacer for main content to offset sidebar width on desktop */}
            <div className="hidden md:block w-64 flex-shrink-0" />
        </>
    );
}

