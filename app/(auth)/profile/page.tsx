"use client";

import React, { useEffect, useState, Suspense } from "react";
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
  Star,
  MessageSquare,
  ImagePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { fetchUserProfile, updateUserProfile, logoutUser, changeUserPassword, fetchWishlist, removeFromWishlist, fetchOrders, fetchPurchases } from "@/lib/apiItems";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import AddressList from "@/components/Address/AddressList";

// Purchase item type
interface PurchaseItem {
  orderItemId: number;
  productId: string;
  name: string;
  slug: string;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  baseImage: string;
  isReviewed: boolean;
}

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { logout } = useAuth();
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

  // Address state (kept for compatibility)
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

  // Purchase History state
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  // Review Modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseItem | null>(null);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: "",
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewImages, setReviewImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Orders State
  interface Order {
    id: number | string;
    date: string;
    status: string;
    total: string;
    itemsCount: number;
  }
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);
  const [removingIds, setRemovingIds] = useState<string[]>([]);

  useEffect(() => {
    loadProfile();
  }, []);

  // Handle URL query parameters for tabs
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      const allowedTabs = ["profile", "orders", "history", "wishlist", "reviews", "address", "password"];
      if (allowedTabs.includes(tab)) {
        setActiveSection(tab);
      }
    }
  }, [searchParams]);

  // Load wishlist when section becomes active
  useEffect(() => {
    if (activeSection === "wishlist") {
      loadWishlist();
    }
  }, [activeSection]);

  // Load purchase history when section becomes active
  useEffect(() => {
    if (activeSection === "history") {
      loadPurchases();
    }
  }, [activeSection]);

  const loadWishlist = async () => {
    try {
      setWishlistLoading(true);
      const res = await fetchWishlist();
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

  const loadPurchases = async () => {
    try {
      setPurchaseLoading(true);
      const res = await fetchPurchases();
      if (res && res.data && Array.isArray(res.data)) {
        setPurchaseItems(res.data);
      } else if (Array.isArray(res)) {
        setPurchaseItems(res);
      }
    } catch (error) {
      console.error("Failed to load purchases", error);
    } finally {
      setPurchaseLoading(false);
    }
  };

  const loadOrders = async (page: number = 1) => {
    try {
      setOrdersLoading(true);
      const res = await fetchOrders(page);
      if (res && res.data && Array.isArray(res.data.data)) {
        setOrders(res.data.data);
        setOrdersPage(res.data.current_page);
        setOrdersTotalPages(res.data.last_page);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === "orders") {
      loadOrders(ordersPage);
    }
  }, [activeSection, ordersPage]);


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
      };

      const res = await updateUserProfile(payload);
      if (res.code === 0 || res.success) {
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
      logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
      logout();
      router.push("/");
    }
  };

  // Open review modal
  const openReviewModal = (purchase: PurchaseItem) => {
    setSelectedPurchase(purchase);
    setReviewData({ rating: 0, comment: "" });
    setReviewImages([]);
    setImagePreviewUrls([]);
    setReviewError(null);
    setReviewSuccess(false);
    setShowReviewModal(true);
  };

  // Close review modal
  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedPurchase(null);
    setReviewData({ rating: 0, comment: "" });
    imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    setReviewImages([]);
    setImagePreviewUrls([]);
    setReviewError(null);
    setReviewSuccess(false);
  };

  // Handle image selection with 2MB validation
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 5 - reviewImages.length;
    const filesToAdd: File[] = [];

    for (const file of files.slice(0, remainingSlots)) {
      if (file.size > 2 * 1024 * 1024) {
        setReviewError("Each image must be less than 2MB");
        continue;
      }
      filesToAdd.push(file);
    }

    if (filesToAdd.length > 0) {
      const newUrls = filesToAdd.map((file) => URL.createObjectURL(file));
      setReviewImages([...reviewImages, ...filesToAdd]);
      setImagePreviewUrls([...imagePreviewUrls, ...newUrls]);
      setReviewError(null);
    }

    e.target.value = "";
  };

  // Submit review
  const handleSubmitReview = async () => {
    if (!selectedPurchase) return;

    if (reviewData.rating === 0) {
      setReviewError("Please select a rating");
      return;
    }

    try {
      setReviewSubmitting(true);
      setReviewError(null);

      const formData = new FormData();
      formData.append("productId", selectedPurchase.productId);
      formData.append("orderItemId", selectedPurchase.orderItemId.toString());
      formData.append("rating", reviewData.rating.toString());
      formData.append("comment", reviewData.comment);

      reviewImages.forEach((image) => {
        formData.append("images[]", image);
      });

      const response = await fetch("/api/user/reviews/create", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && (result.code === 0 || result.success)) {
        setReviewSuccess(true);
        // Mark item as reviewed in local state
        setPurchaseItems((prev) =>
          prev.map((item) =>
            item.orderItemId === selectedPurchase.orderItemId
              ? { ...item, isReviewed: true }
              : item
          )
        );
        setTimeout(() => {
          closeReviewModal();
        }, 2000);
      } else {
        setReviewError(result.error || result.message || "Failed to submit review");
      }
    } catch (error: any) {
      console.error("Review submission failed", error);
      setReviewError("Failed to submit review. Please try again.");
    } finally {
      setReviewSubmitting(false);
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

                {ordersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">You have no active orders</p>
                    <Link href="/products">
                      <Button className="mt-4 bg-blue-600 text-white hover:bg-blue-700">
                        Start Shopping
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="hidden md:grid grid-cols-5 gap-4 px-4 py-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-500">
                      <div className="col-span-1">Order ID</div>
                      <div className="col-span-1">Date</div>
                      <div className="col-span-1">Status</div>
                      <div className="col-span-1">Total</div>
                      <div className="col-span-1 text-right">Items</div>
                    </div>

                    {orders.map((order) => (
                      <div key={order.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-100 rounded-lg hover:border-gray-300 transition-colors items-center">
                        <div className="col-span-1 font-medium text-gray-900 flex justify-between md:block">
                          <span className="md:hidden text-gray-500 font-normal">Order ID:</span>
                          #{order.id}
                        </div>
                        <div className="col-span-1 text-gray-600 flex justify-between md:block">
                          <span className="md:hidden text-gray-500">Date:</span>
                          {order.date}
                        </div>
                        <div className="col-span-1 flex justify-between md:block">
                          <span className="md:hidden text-gray-500">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="col-span-1 font-medium text-gray-900 flex justify-between md:block">
                          <span className="md:hidden text-gray-500">Total:</span>
                          NRs.{order.total}
                        </div>
                        <div className="col-span-1 text-gray-600 text-right flex justify-between md:block">
                          <span className="md:hidden text-gray-500">Items:</span>
                          {order.itemsCount} item(s)
                        </div>
                      </div>
                    ))}

                    {/* Pagination */}
                    {ordersTotalPages > 1 && (
                      <div className="flex justify-center gap-2 mt-6">
                        <Button
                          variant="outline"
                          disabled={ordersPage === 1}
                          onClick={() => setOrdersPage(p => Math.max(1, p - 1))}
                        >
                          Previous
                        </Button>
                        <span className="flex items-center px-4 text-sm text-gray-600">
                          Page {ordersPage} of {ordersTotalPages}
                        </span>
                        <Button
                          variant="outline"
                          disabled={ordersPage === ordersTotalPages}
                          onClick={() => setOrdersPage(p => Math.min(ordersTotalPages, p + 1))}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Purchase History */}
            {activeSection === "history" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  Purchase History
                </h1>

                {purchaseLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
                  </div>
                ) : purchaseItems.length === 0 ? (
                  <div className="text-center py-12">
                    <History size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">You have no purchase history</p>
                    <Link href="/products">
                      <Button className="mt-4 bg-blue-600 text-white hover:bg-blue-700">
                        Start Shopping
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {purchaseItems.map((item) => (
                      <div
                        key={item.orderItemId}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <Link href={`/products/${item.slug}`}>
                          <div className="aspect-square relative bg-gray-100">
                            <Image
                              src={item.baseImage || "/assets/images/product/1.jpg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </Link>
                        <div className="p-4">
                          <Link href={`/products/${item.slug}`}>
                            <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 line-clamp-2">
                              {item.name}
                            </h3>
                          </Link>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-lg font-bold text-green-600">
                              ${item.unitPrice}
                            </span>
                            <span className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mb-4">
                            Total: <span className="font-semibold">${item.lineTotal}</span>
                          </div>

                          {item.isReviewed ? (
                            <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                              <Star size={16} className="fill-green-600" />
                              <span>Review Submitted</span>
                            </div>
                          ) : (
                            <Button
                              onClick={() => openReviewModal(item)}
                              className="w-full bg-[#A12717] text-white hover:bg-[#8a2113] flex items-center justify-center gap-2"
                            >
                              <MessageSquare size={16} />
                              Write Review
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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

      {/* Review Modal */}
      <Dialog open={showReviewModal} onOpenChange={(open) => !open && closeReviewModal()}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Write a Review</DialogTitle>
            <DialogDescription>
              Share your experience with {selectedPurchase?.name}
            </DialogDescription>
          </DialogHeader>

          {reviewSuccess ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={32} className="text-green-600 fill-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Thank you!</h3>
              <p className="text-gray-600">Your review has been submitted successfully.</p>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              {/* Product Info */}
              {selectedPurchase && (
                <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={selectedPurchase.baseImage || "/assets/images/product/1.jpg"}
                      alt={selectedPurchase.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 line-clamp-2">{selectedPurchase.name}</h4>
                    <p className="text-sm text-gray-500">Order Item #{selectedPurchase.orderItemId}</p>
                  </div>
                </div>
              )}

              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-1 transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        size={32}
                        className={`transition-colors ${star <= (hoveredRating || reviewData.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                          }`}
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-sm text-gray-600">
                    {reviewData.rating > 0
                      ? `${reviewData.rating} out of 5 stars`
                      : "Click to rate"}
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  rows={4}
                  placeholder="Share your experience with this product..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {reviewData.comment.length}/500 characters
                </p>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Photos (Optional)
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Upload up to 5 images (max 2MB each)
                </p>

                <div className="flex flex-wrap gap-3">
                  {/* Image Previews */}
                  {imagePreviewUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group"
                    >
                      <img
                        src={url}
                        alt={`Review image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = [...reviewImages];
                          const newUrls = [...imagePreviewUrls];
                          URL.revokeObjectURL(newUrls[index]);
                          newImages.splice(index, 1);
                          newUrls.splice(index, 1);
                          setReviewImages(newImages);
                          setImagePreviewUrls(newUrls);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  {/* Upload Button */}
                  {reviewImages.length < 5 && (
                    <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <ImagePlus size={20} className="text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">Add</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageSelect}
                      />
                    </label>
                  )}
                </div>

                {reviewImages.length > 0 && (
                  <p className="mt-2 text-xs text-gray-500">
                    {reviewImages.length}/5 images uploaded
                  </p>
                )}
              </div>

              {/* Error Message */}
              {reviewError && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {reviewError}
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleSubmitReview}
                disabled={reviewSubmitting || reviewData.rating === 0}
                className="w-full bg-[#A12717] text-white py-3 rounded-lg hover:bg-[#8a2113] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reviewSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
