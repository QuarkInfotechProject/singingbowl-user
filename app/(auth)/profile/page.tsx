"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Package,
  History,
  MapPin,
  Lock,
  LogOut,
  Menu,
  X,
  Loader2,
  Heart,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchUserProfile, updateUserProfile, logoutUser, changeUserPassword, fetchWishlist, removeFromWishlist } from "@/lib/apiItems";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import AddressList from "@/components/Address/AddressList";

export default function ProfilePage() {
  const router = useRouter();
  const { logout } = useAuth(); // Update context if available
  const [activeSection, setActiveSection] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Profile Data State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profilePicture: "",
  });

  // Other states (Address/Password) kept as is for now or initialized
  const [addressData, setAddressData] = useState({
    firstName: "John",
    lastName: "Doe",
    company: "",
    streetAddress: "123 Main Street",
    apartment: "Apt 4B",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "United States",
    phone: "+1 (555) 123-4567",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Wishlist state
  interface WishlistItem {
    uuid: string;
    productName: string;
    slug?: string;
    url?: string;
    originalPrice: string;
    specialPrice?: string;
    baseImage?: string;
  }
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [removingIds, setRemovingIds] = useState<string[]>([]);

  useEffect(() => {
    loadProfile();
  }, []);

  // Load wishlist when section becomes active
  useEffect(() => {
    if (activeSection === "wishlist") {
      loadWishlist();
    }
  }, [activeSection]);

  const loadWishlist = async () => {
    try {
      setWishlistLoading(true);
      const res = await fetchWishlist();
      console.log("Wishlist API response:", res);
      if (res && res.data && Array.isArray(res.data)) {
        setWishlistItems(res.data);
      } else if (Array.isArray(res)) {
        setWishlistItems(res);
      }
    } catch (error) {
      console.error("Failed to load wishlist", error);
    } finally {
      setWishlistLoading(false);
    }
  };


  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      setRemovingIds((prev) => [...prev, productId]);
      await removeFromWishlist(productId);
      setWishlistItems((prev) => prev.filter((item) => item.uuid !== productId));
    } catch (error) {
      console.error("Failed to remove from wishlist", error);
    } finally {
      setRemovingIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await fetchUserProfile();
      if (res && res.data) {
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
      console.error("Failed to load profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setAddressData({
      ...addressData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const payload = {
        fullName,
        email: formData.email,
        phone: formData.phone,
        // Include other fields if API expects them to be preserved
      };

      const res = await updateUserProfile(payload);
      if (res.code === 0 || res.success) { // Adjust based on actual success response
        alert(res.message || "Profile updated successfully!");
      } else {
        alert(res.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAddress = () => {
    alert("Address updated successfully!");
  };

  const handleSavePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!passwordData.currentPassword) {
      alert("Please enter your current password");
      return;
    }

    try {
      setPasswordSaving(true);
      const res = await changeUserPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });

      if (res.code === 0 || res.success) {
        alert(res.message || "Password changed successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        alert(res.message || "Failed to change password");
      }
    } catch (error: any) {
      console.error("Password change failed", error);
      alert(error?.response?.data?.message || "Failed to change password. Please check your current password.");
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout(); // Context logout
      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
      // Force logout anyway
      logout();
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="w-full px-3 md:px-10 lg:px-26 min-h-screen bg-gray-50 flex flex-col">
      {/* Header for mobile */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Profile</h1>
        <Button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-600"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } fixed lg:relative lg:translate-x-0 z-30 w-64 h-full bg-white border-r border-gray-200 transition-transform duration-300 overflow-y-auto`}
        >
          <div className="p-6">
            {/* Profile Section */}
            <div className="text-center mb-8">
              <div className="mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 mx-auto flex items-center justify-center text-white overflow-hidden">
                  {formData.profilePicture ? (
                    <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
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
                  onClick={() => {
                    setActiveSection("orders");
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex justify-start p-0 hover:bg-gray-100 items-center bg-transparent cursor-pointer gap-3 rounded-lg transition-colors ${activeSection === "orders"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <Package size={18} />
                  <span className="text-sm">Orders</span>
                </Button>
                <Button
                  onClick={() => {
                    setActiveSection("history");
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex justify-start p-0 hover:bg-gray-100 items-center bg-transparent cursor-pointer gap-3 rounded-lg transition-colors ${activeSection === "history"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <History size={18} />
                  <span className="text-sm">Purchase History</span>
                </Button>
                <Button
                  onClick={() => {
                    setActiveSection("wishlist");
                    setSidebarOpen(false);
                  }}
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
                  onClick={() => {
                    setActiveSection("profile");
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex justify-start p-0 hover:bg-gray-100 items-center gap-3 bg-transparent cursor-pointer rounded-lg transition-colors ${activeSection === "profile"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <User size={18} />
                  <span className="text-sm">Profile Details</span>
                </Button>
                <Button
                  onClick={() => {
                    setActiveSection("address");
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex justify-start p-0 hover:bg-gray-100 items-center gap-3 bg-transparent cursor-pointer rounded-lg transition-colors ${activeSection === "address"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <MapPin size={18} />
                  <span className="text-sm">Address</span>
                </Button>
                <Button
                  onClick={() => {
                    setActiveSection("password");
                    setSidebarOpen(false);
                  }}
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
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-4 lg:p-8">
            {/* Profile Details */}
            {activeSection === "profile" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  Profile Details
                </h1>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleProfileChange}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Address */}
            {activeSection === "address" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  My Addresses
                </h1>
                <AddressList
                  showActions={true}
                  selectable={false}
                  redirectPath="/profile"
                />
              </div>
            )}

            {/* Change Password */}
            {activeSection === "password" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  Change Password
                </h1>
                <div className="space-y-6 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                  <Button
                    onClick={handleSavePassword}
                    disabled={passwordSaving}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                  >
                    {passwordSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Orders */}
            {activeSection === "orders" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  Orders
                </h1>
                <div className="text-center py-12">
                  <Package size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">You have no active orders</p>
                </div>
              </div>
            )}

            {/* Purchase History */}
            {activeSection === "history" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  Purchase History
                </h1>
                <div className="text-center py-12">
                  <History size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">You have no purchase history</p>
                </div>
              </div>
            )}

            {/* Wishlist */}
            {activeSection === "wishlist" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  My Wishlist
                </h1>
                {wishlistLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
                  </div>
                ) : wishlistItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Your wishlist is empty</p>
                    <Link href="/products">
                      <Button className="mt-4 bg-blue-600 text-white hover:bg-blue-700">
                        Browse Products
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                      <div
                        key={item.uuid}
                        className={`relative border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${removingIds.includes(item.uuid) ? "opacity-50" : ""
                          }`}
                      >
                        <Link href={`/products/${item.slug || item.url}`}>
                          <div className="aspect-square relative bg-gray-100">
                            <Image
                              src={item.baseImage || "/assets/images/product/1.jpg"}
                              alt={item.productName}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </Link>
                        <div className="p-4">
                          <Link href={`/products/${item.slug || item.url}`}>

                            <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 line-clamp-2">
                              {item.productName}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg font-bold text-green-600">
                              ${item.specialPrice || item.originalPrice}
                            </span>
                            {item.specialPrice && (
                              <span className="text-sm text-gray-400 line-through">
                                ${item.originalPrice}
                              </span>
                            )}
                          </div>
                          <Button
                            onClick={() => handleRemoveFromWishlist(item.uuid)}
                            disabled={removingIds.includes(item.uuid)}
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                          >
                            {removingIds.includes(item.uuid) ? (
                              <Loader2 className="animate-spin h-4 w-4" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                            <span>Remove</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>


        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
