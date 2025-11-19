"use client";

import React, { useState } from "react";
import { CreditCard, Landmark, ChevronRight, Lock, Truck } from "lucide-react";

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderPlaced(true);
    setTimeout(() => setOrderPlaced(false), 3000);
  };

  const cartItems = [
    { id: 1, name: "Tibetan Singing Bowl 7 inch", price: 89.99, quantity: 1 },
    { id: 2, name: "Wooden Mallet Set", price: 24.99, quantity: 2 },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 12.0;
  const tax = (subtotal + shipping) * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50">
      {/* Success Message */}
      {orderPlaced && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse">
          Order placed successfully! ✓
        </div>
      )}      

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* Shipping Information */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Truck className="w-6 h-6" />
                  Shipping Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="NY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="10001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Country
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Lock className="w-6 h-6" />
                  Payment Method
                </h2>

                <div className="space-y-3 mb-6">
                  {/* Credit Card */}
                  <div
                    onClick={() => setPaymentMethod("card")}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                      paymentMethod === "card"
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        className="w-5 h-5 text-blue-500"
                      />
                      <CreditCard className="w-5 h-5 text-slate-700" />
                      <div>
                        <div className="font-semibold text-slate-900">
                          Credit / Debit Card
                        </div>
                        <div className="text-sm text-slate-600">
                          Visa, Mastercard, American Express
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PayPal */}
                  <div
                    onClick={() => setPaymentMethod("paypal")}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                      paymentMethod === "paypal"
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "paypal"}
                        onChange={() => setPaymentMethod("paypal")}
                        className="w-5 h-5 text-blue-500"
                      />
                      <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        P
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">
                          PayPal
                        </div>
                        <div className="text-sm text-slate-600">
                          Fast and secure PayPal checkout
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bank Transfer */}
                  <div
                    onClick={() => setPaymentMethod("bank")}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                      paymentMethod === "bank"
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "bank"}
                        onChange={() => setPaymentMethod("bank")}
                        className="w-5 h-5 text-blue-500"
                      />
                      <Landmark className="w-5 h-5 text-slate-700" />
                      <div>
                        <div className="font-semibold text-slate-900">
                          Bank Transfer
                        </div>
                        <div className="text-sm text-slate-600">
                          Direct bank transfer (ACH/SEPA)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                {paymentMethod === "card" && (
                  <div className="pt-6 border-t border-slate-200 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="4532 1234 5678 9010"
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Expiry
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "bank" && (
                  <div className="pt-6 border-t border-slate-200">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-sm text-slate-600">
                        Bank transfer details will be provided after you
                        complete this checkout. Please allow 2-3 business days
                        for payment processing.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-xl transition transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Complete Purchase
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                <Lock className="w-4 h-4" />
                Your payment information is secured and encrypted
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                Order Summary
              </h3>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between pb-4 border-b border-slate-100"
                  >
                    <div>
                      <p className="font-medium text-slate-900 text-sm">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-slate-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3 mb-6 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="text-slate-900 font-medium">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Shipping</span>
                  <span className="text-slate-900 font-medium">
                    ${shipping.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tax</span>
                  <span className="text-slate-900 font-medium">
                    ${tax.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-900">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Lock className="w-4 h-4 text-green-600" />
                  SSL Secure Payment
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Truck className="w-4 h-4 text-blue-600" />
                  Free Returns within 30 days
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
