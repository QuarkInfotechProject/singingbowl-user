"use client";

import React, { useState, useEffect } from "react";
import {
    User,
    Package,
    History,
    MapPin,
    Lock,
    LogOut,
    Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchUserProfile } from "@/lib/apiItems";
import { ActiveSection, ProfileFormData } from "./types";
import Image from "next/image";

interface ProfileSidebarProps {
    activeSection: ActiveSection;
    setActiveSection: (section: ActiveSection) => void;
    onNavClick?: () => void; // Callback to close sheet on mobile
    onLogout: () => void;
}

export default function ProfileSidebar({
    activeSection,
    setActiveSection,
    onNavClick,
    onLogout,
}: ProfileSidebarProps) {
    const [formData, setFormData] = useState<ProfileFormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        profilePicture: "",
    });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await fetchUserProfile();
                if (res?.data) {
                    const { fullName, email, phone, profilePicture } = res.data;
                    const nameParts = (fullName || "").split(" ");
                    const firstName = nameParts[0] || "";
                    const lastName = nameParts.slice(1).join(" ") || "";

                    setFormData({
                        firstName,
                        lastName,
                        email: email || "",
                        phone: phone || "",
                        profilePicture: profilePicture || "",
                    });
                }
            } catch (error) {
                console.error("Failed to load profile in sidebar", error);
            }
        };
        loadProfile();
    }, []);

    const handleNavClick = (section: ActiveSection) => {
        setActiveSection(section);
        if (onNavClick) {
            onNavClick();
        }
    };

    return (
        <div className="w-full h-full bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-6">
                {/* Profile Section */}
                <div className="text-center mb-8">
                    <div className="mb-4">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 mx-auto flex items-center justify-center text-white overflow-hidden">
                            {formData.profilePicture ? (
                                <div className="relative w-full h-full">
                                    <Image
                                        src={formData.profilePicture}
                                        alt="Profile"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <User size={40} />
                            )}
                        </div>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Welcome back
                    </h2>
                    <p className="text-sm text-gray-600">
                        {formData.firstName} {formData.lastName}
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                        Quick Actions
                    </h3>
                    <nav className="space-y-2 flex flex-col">
                        <Button
                            onClick={() => handleNavClick("orders")}
                            className={`w-full flex justify-start p-0 hover:bg-gray-100 items-center bg-transparent cursor-pointer gap-3 rounded-lg transition-colors ${activeSection === "orders"
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <Package size={18} />
                            <span className="text-sm">Orders</span>
                        </Button>
                        <Button
                            onClick={() => handleNavClick("history")}
                            className={`w-full flex justify-start p-0 hover:bg-gray-100 items-center bg-transparent cursor-pointer gap-3 rounded-lg transition-colors ${activeSection === "history"
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <History size={18} />
                            <span className="text-sm">Purchase History</span>
                        </Button>
                        <Button
                            onClick={() => handleNavClick("wishlist")}
                            className={`w-full flex justify-start p-0 hover:bg-gray-100 items-center bg-transparent cursor-pointer gap-3 rounded-lg transition-colors ${activeSection === "wishlist"
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <Heart size={18} />
                            <span className="text-sm">Wishlist</span>
                        </Button>
                    </nav>
                </div>

                {/* Account Section */}
                <div className="mb-8">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                        Account
                    </h3>
                    <nav className="space-y-2 flex flex-col">
                        <Button
                            onClick={() => handleNavClick("profile")}
                            className={`w-full flex justify-start p-0 hover:bg-gray-100 items-center gap-3 bg-transparent cursor-pointer rounded-lg transition-colors ${activeSection === "profile"
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <User size={18} />
                            <span className="text-sm">Profile Details</span>
                        </Button>
                        <Button
                            onClick={() => handleNavClick("address")}
                            className={`w-full flex justify-start p-0 hover:bg-gray-100 items-center gap-3 bg-transparent cursor-pointer rounded-lg transition-colors ${activeSection === "address"
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <MapPin size={18} />
                            <span className="text-sm">Address</span>
                        </Button>
                        <Button
                            onClick={() => handleNavClick("password")}
                            className={`w-full flex justify-start p-0 hover:bg-gray-100 items-center gap-3 bg-transparent cursor-pointer rounded-lg transition-colors ${activeSection === "password"
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <Lock size={18} />
                            <span className="text-sm">Change Password</span>
                        </Button>
                    </nav>
                </div>

                {/* Logout Button */}
                <Button
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </Button>
            </div>
        </div>
    );
}
