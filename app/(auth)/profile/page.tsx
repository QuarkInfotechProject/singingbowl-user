"use client";

import React, { useEffect, useState, Suspense } from "react";
import { Menu, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/lib/apiItems";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AddressList from "@/components/Address/AddressList";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

// Import components
import {
  ProfileSidebar,
  ProfileDetails,
  PasswordSection,
  OrdersSection,
  PurchaseHistorySection,
  WishlistSection,
  ActiveSection,
} from "./_components";

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState<ActiveSection>("profile");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Handle URL query parameters for tabs
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      const allowedTabs: ActiveSection[] = ["profile", "orders", "history", "wishlist", "address", "password"];
      if (allowedTabs.includes(tab as ActiveSection)) {
        setActiveSection(tab as ActiveSection);
      }
    }
  }, [searchParams]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
      logout();
      router.push("/");
    }
  };

  return (
    <div className="w-full px-3 md:px-10 lg:px-26 min-h-screen bg-gray-50 flex flex-col">
      {/* Header for mobile */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Profile</h1>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-600">
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80">
            <ProfileSidebar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              onNavClick={() => setIsSheetOpen(false)}
              onLogout={handleLogout}
            />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0 h-full border-r border-gray-200">
          <ProfileSidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            onLogout={handleLogout}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-4 lg:p-8">
            {/* Profile Details */}
            {activeSection === "profile" && (
              <ProfileDetails />
            )}

            {/* Address */}
            {activeSection === "address" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">My Addresses</h1>
                <AddressList showActions={true} selectable={false} redirectPath="/profile" />
              </div>
            )}

            {/* Change Password */}
            {activeSection === "password" && (
              <PasswordSection />
            )}

            {/* Orders */}
            {activeSection === "orders" && (
              <OrdersSection />
            )}

            {/* Purchase History */}
            {activeSection === "history" && (
              <PurchaseHistorySection />
            )}

            {/* Wishlist */}
            {activeSection === "wishlist" && (
              <WishlistSection />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
