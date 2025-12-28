"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { memo } from "react";
import { Package, Users, GraduationCap, ImageIcon, BookOpen } from "lucide-react";

const MobileBottomNav = () => {
    const pathname = usePathname();

    const navItems = [
        {
            name: "Products",
            href: "/products",
            icon: Package
        },
        {
            name: "About Us",
            href: "/about_us",
            icon: Users
        },
        {
            name: "Blog",
            href: "/blog",
            icon: BookOpen,
            isCenter: true
        },
        {
            name: "Courses",
            href: "/courses",
            icon: GraduationCap
        },
        {
            name: "Gallery",
            href: "/gallery",
            icon: ImageIcon
        },
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
            <div className="flex items-center justify-around h-16 px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 ${item.isCenter
                                    ? "relative -top-4"
                                    : ""
                                }`}
                        >
                            {item.isCenter ? (
                                <div
                                    className={`rounded-full p-4 shadow-lg transition-all duration-200 ${isActive
                                            ? "bg-[#A12717]"
                                            : "bg-black hover:bg-gray-800"
                                        }`}
                                >
                                    <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                                </div>
                            ) : (
                                <div className={`p-2 rounded-lg transition-colors ${isActive ? "bg-gray-100" : ""
                                    }`}>
                                    <Icon
                                        className={`w-5 h-5 transition-colors ${isActive ? "text-[#A12717]" : "text-black"
                                            }`}
                                        strokeWidth={2}
                                    />
                                </div>
                            )}
                            <span
                                className={`text-[10px] font-medium transition-colors ${item.isCenter
                                        ? "text-black"
                                        : isActive
                                            ? "text-[#A12717]"
                                            : "text-black"
                                    }`}
                            >
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default memo(MobileBottomNav);
