"use client";

import React, { useEffect, useState, Suspense } from "react";
import { Menu, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  fetchUserProfile,
  updateUserProfile,
  logoutUser,
  changeUserPassword,
  fetchWishlist,
  removeFromWishlist,
  fetchOrders,
  fetchPurchases,
} from "@/lib/apiItems";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AddressList from "@/components/Address/AddressList";

// Import components
import {
  ProfileSidebar,
  ProfileDetails,
  PasswordSection,
  OrdersSection,
  PurchaseHistorySection,
  WishlistSection,
  ReviewModal,
  PurchaseItem,
  WishlistItem,
  Order,
  ProfileFormData,
  PasswordFormData,
  ReviewData,
  ActiveSection,
} from "./_components";

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState<ActiveSection>("profile");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Profile Data State
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profilePicture: "",
  });

  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Wishlist state
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Purchase History state
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  // Review Modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseItem | null>(null);
  const [reviewData, setReviewData] = useState<ReviewData>({
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);
  const [removingIds, setRemovingIds] = useState<string[]>([]);

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

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

  // Load data when section becomes active
  useEffect(() => {
    if (activeSection === "wishlist") loadWishlist();
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === "history") loadPurchases();
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === "orders") loadOrders(ordersPage);
  }, [activeSection, ordersPage]);

  // Data loading functions
  const loadWishlist = async () => {
    try {
      setWishlistLoading(true);
      const res = await fetchWishlist();
      if (res?.data && Array.isArray(res.data)) {
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
      if (res?.data && Array.isArray(res.data)) {
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
      if (res?.data?.data && Array.isArray(res.data.data)) {
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
      console.error("Failed to load profile", error);
    } finally {
      setLoading(false);
    }
  };

  // Handler functions
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const payload = { fullName, email: formData.email, phone: formData.phone };
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
        confirmPassword: passwordData.confirmPassword,
      });

      if (res.code === 0 || res.success) {
        alert(res.message || "Password changed successfully!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        alert(res.message || "Failed to change password");
      }
    } catch (error: any) {
      console.error("Password change failed", error);
      alert(error?.response?.data?.message || "Failed to change password.");
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

  // Review modal functions
  const openReviewModal = (purchase: PurchaseItem) => {
    setSelectedPurchase(purchase);
    setReviewData({ rating: 0, comment: "" });
    setReviewImages([]);
    setImagePreviewUrls([]);
    setReviewError(null);
    setReviewSuccess(false);
    setShowReviewModal(true);
  };

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

  const handleRemoveImage = (index: number) => {
    const newImages = [...reviewImages];
    const newUrls = [...imagePreviewUrls];
    URL.revokeObjectURL(newUrls[index]);
    newImages.splice(index, 1);
    newUrls.splice(index, 1);
    setReviewImages(newImages);
    setImagePreviewUrls(newUrls);
  };

  const handleSubmitReview = async () => {
    if (!selectedPurchase) return;

    if (reviewData.rating === 0) {
      setReviewError("Please select a rating");
      return;
    }

    try {
      setReviewSubmitting(true);
      setReviewError(null);

      const formDataObj = new FormData();
      formDataObj.append("productId", selectedPurchase.productId);
      formDataObj.append("orderItemId", selectedPurchase.orderItemId.toString());
      formDataObj.append("rating", reviewData.rating.toString());
      formDataObj.append("comment", reviewData.comment);

      reviewImages.forEach((image) => {
        formDataObj.append("images[]", image);
      });

      const response = await fetch("/api/user/reviews/create", {
        method: "POST",
        body: formDataObj,
      });

      const result = await response.json();

      if (response.ok && (result.code === 0 || result.success)) {
        setReviewSuccess(true);
        setPurchaseItems((prev) =>
          prev.map((item) =>
            item.orderItemId === selectedPurchase.orderItemId
              ? { ...item, isReviewed: true }
              : item
          )
        );
        setTimeout(() => closeReviewModal(), 2000);
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
        <ProfileSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          formData={formData}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-4 lg:p-8">
            {/* Profile Details */}
            {activeSection === "profile" && (
              <ProfileDetails
                formData={formData}
                onProfileChange={handleProfileChange}
                onSaveProfile={handleSaveProfile}
                saving={saving}
              />
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
              <PasswordSection
                passwordData={passwordData}
                onPasswordChange={handlePasswordChange}
                onSavePassword={handleSavePassword}
                passwordSaving={passwordSaving}
              />
            )}

            {/* Orders */}
            {activeSection === "orders" && (
              <OrdersSection
                orders={orders}
                ordersLoading={ordersLoading}
                ordersPage={ordersPage}
                ordersTotalPages={ordersTotalPages}
                setOrdersPage={setOrdersPage}
              />
            )}

            {/* Purchase History */}
            {activeSection === "history" && (
              <PurchaseHistorySection
                purchaseItems={purchaseItems}
                purchaseLoading={purchaseLoading}
                onOpenReviewModal={openReviewModal}
              />
            )}

            {/* Wishlist */}
            {activeSection === "wishlist" && (
              <WishlistSection
                wishlistItems={wishlistItems}
                wishlistLoading={wishlistLoading}
                removingIds={removingIds}
                onRemoveFromWishlist={handleRemoveFromWishlist}
              />
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
      <ReviewModal
        showReviewModal={showReviewModal}
        selectedPurchase={selectedPurchase}
        reviewData={reviewData}
        setReviewData={setReviewData}
        reviewImages={reviewImages}
        imagePreviewUrls={imagePreviewUrls}
        reviewError={reviewError}
        reviewSuccess={reviewSuccess}
        reviewSubmitting={reviewSubmitting}
        hoveredRating={hoveredRating}
        setHoveredRating={setHoveredRating}
        onClose={closeReviewModal}
        onSubmitReview={handleSubmitReview}
        onImageSelect={handleImageSelect}
        onRemoveImage={handleRemoveImage}
      />
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
