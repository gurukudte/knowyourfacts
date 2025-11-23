"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon, LayoutDashboard, Activity, BarChart3 } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [
        {
            name: "Dashboard",
            href: "/neuralace/conversation-task",
            icon: LayoutDashboard,
            exact: true,
        },
        {
            name: "Live Monitor",
            href: "/neuralace/conversation-task/live-monitor",
            icon: Activity,
            exact: false,
        },
        {
            name: "Analytics",
            href: "/neuralace/conversation-task/analytics",
            icon: BarChart3,
            exact: false,
        },
    ];

    const isActive = (href: string, exact: boolean) => {
        if (exact) {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar for larger screens */}
            <aside className="hidden md:flex flex-col w-64 bg-gray-900 text-white p-4 shadow-lg border-r border-gray-800">
                <h2 className="text-2xl font-bold mb-8 text-white tracking-wider px-2">
                    Neuralace
                </h2>
                <nav className="flex-1">
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Button
                                    asChild
                                    variant={isActive(item.href, item.exact) ? "secondary" : "ghost"}
                                    className={`w-full justify-start gap-3 ${isActive(item.href, item.exact)
                                        ? "bg-gray-800 text-white"
                                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                                        }`}
                                >
                                    <Link href={item.href}>
                                        <item.icon className="h-5 w-5" />
                                        {item.name}
                                    </Link>
                                </Button>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="mt-auto">
                    <Button variant="destructive" className="w-full">
                        Logout
                    </Button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 p-4 flex justify-end items-center md:justify-between">
                    {/* Mobile Sidebar Toggle */}
                    <Sheet>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <MenuIcon className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="left"
                            className="w-64 bg-gray-900 text-white p-4 flex flex-col border-r-gray-800"
                        >
                            <h2 className="text-2xl font-bold mb-8 text-white tracking-wider">
                                Neuralace
                            </h2>
                            <nav className="flex-1">
                                <ul className="space-y-2">
                                    {navItems.map((item) => (
                                        <li key={item.href}>
                                            <Button
                                                asChild
                                                variant={
                                                    isActive(item.href, item.exact) ? "secondary" : "ghost"
                                                }
                                                className={`w-full justify-start gap-3 ${isActive(item.href, item.exact)
                                                    ? "bg-gray-800 text-white"
                                                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                                                    }`}
                                            >
                                                <Link href={item.href}>
                                                    <item.icon className="h-5 w-5" />
                                                    {item.name}
                                                </Link>
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                            <div className="mt-auto">
                                <Button variant="destructive" className="w-full">
                                    Logout
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>

                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Conversation Task Process
                    </h1>
                    <div className="hidden md:block">
                        <Button variant="outline" className="text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50">
                            Logout
                        </Button>
                    </div>
                </header>

                {/* Main content area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-950 p-6 flex flex-col">
                    {children}
                </main>
            </div>
        </div>
    );
}
