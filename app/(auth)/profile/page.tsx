"use client";

import React, { useState } from "react";
import {
  User,
  Package,
  History,
  MapPin,
  Lock,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
  });

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

  const handleSaveProfile = () => {
    alert("Profile updated successfully!");
  };

  const handleSaveAddress = () => {
    alert("Address updated successfully!");
  };

  const handleSavePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password changed successfully!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleLogout = () => {
    alert("Logged out successfully!");
  };

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
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed lg:relative lg:translate-x-0 z-30 w-64 h-full bg-white border-r border-gray-200 transition-transform duration-300 overflow-y-auto`}
        >
          <div className="p-6">
            {/* Profile Section */}
            <div className="text-center mb-8">
              <div className="mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 mx-auto flex items-center justify-center text-white">
                  <User size={40} />
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
              <nav className="space-y-2 flex flex-col justify-start items-start text-start">
                <Button
                  onClick={() => {
                    setActiveSection("orders");
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex p-0 hover:bg-gray-400 items-center bg-transparent cursor-pointer gap-3 rounded-lg text-start transition-colors ${
                    activeSection === "orders"
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
                  className={`w-full flex p-0 hover:bg-gray-400 items-center bg-transparent cursor-pointer gap-3 rounded-lg text-start transition-colors ${
                    activeSection === "history"
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <History size={18} />
                  <span className="text-sm">Purchase History</span>
                </Button>
              </nav>
            </div>

            {/* Account Section */}
            <div className="mb-8">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                Account
              </h3>
              <nav className="space-y-2">
                <Button
                  onClick={() => {
                    setActiveSection("profile");
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex p-0 hover:bg-gray-400 items-center gap-3 bg-transparent cursor-pointer rounded-lg text-start transition-colors ${
                    activeSection === "profile"
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
                  className={`w-full flex p-0 hover:bg-gray-400 items-center gap-3 bg-transparent cursor-pointer rounded-lg text-start transition-colors ${
                    activeSection === "address"
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
                  className={`w-full flex p-0 hover:bg-gray-400 items-center bg-transparent cursor-pointer gap-3 rounded-lg text-start transition-colors ${
                    activeSection === "password"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
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
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}

            {/* Address */}
            {activeSection === "address" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  Address
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
                        value={addressData.firstName}
                        onChange={handleAddressChange}
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
                        value={addressData.lastName}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name (Optional)
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={addressData.company}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="streetAddress"
                      value={addressData.streetAddress}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apartment, Suite, etc. (Optional)
                    </label>
                    <input
                      type="text"
                      name="apartment"
                      value={addressData.apartment}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={addressData.city}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State / Province / Region
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={addressData.state}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code / ZIP
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={addressData.postalCode}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      name="country"
                      value={addressData.country}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Germany</option>
                      <option>France</option>
                      <option>Spain</option>
                      <option>Italy</option>
                      <option>Japan</option>
                      <option>Australia</option>
                      <option>India</option>
                      <option>Brazil</option>
                      <option>Mexico</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={addressData.phone}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                  <Button
                    onClick={handleSaveAddress}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Save Address
                  </Button>
                </div>
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
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Update Password
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
