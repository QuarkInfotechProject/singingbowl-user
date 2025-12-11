"use client";
import React, { useState } from "react";
import {
  CreditCard,
  Landmark,
  ChevronRight,
  Lock,
  Truck,
  Banknote,
  Loader2,
} from "lucide-react";
import AddressList from "@/components/Address/AddressList";
import { Address } from "@/types/address.types";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/lib/apiItems";
import { useRouter } from "next/navigation";

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const { cartItems, isLoading, clearCart } = useCart();
  const router = useRouter();

  const handleAddressSelect = (address: Address | null) => {
    setSelectedAddress(address);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError(null);

    if (!selectedAddress) {
      setOrderError("Please select a delivery address");
      return;
    }

    if (!selectedAddress.uuid) {
      setOrderError("Invalid address selected. Please select a different address.");
      return;
    }

    if (!agreedToTerms) {
      setOrderError("Please agree to the terms and conditions");
      return;
    }

    try {
      setIsSubmitting(true);

      const orderData = {
        addressId: selectedAddress.uuid,
        couponCodes: [] as string[],
        note: "",
        paymentMethod: paymentMethod === "cod" ? "cod" : paymentMethod,
        termsAndConditions: "true"
      };

      console.log("=== Order Data Being Sent ===");
      console.log(JSON.stringify(orderData, null, 2));
      console.log("Address UUID:", selectedAddress.uuid);

      await createOrder(orderData);

      // Clear cart after successful order
      await clearCart();

      // Redirect to success page or orders page
      router.push("/profile?tab=orders");

    } catch (error: any) {
      console.error("Order submission failed:", error);
      setOrderError(error.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate totals from cart items
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.price * (1 - (item.discount || 0) / 100);
    return sum + price * item.quantity;
  }, 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#A12717]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* Shipping Information */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border ">
                <div className="flex items-center gap-2 mb-6">
                  <Truck className="w-6 h-6" />
                  <h2 className="text-2xl font-bold text-slate-900">
                    Delivery Address
                  </h2>
                </div>

                <AddressList
                  onAddressSelect={handleAddressSelect}
                  selectedAddressId={selectedAddress?.uuid}
                  selectable={true}
                  showActions={true}
                  redirectPath="/checkout"
                />
              </div>

              {/* Payment Method Selection */}
              {selectedAddress && (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Lock className="w-6 h-6" />
                    Payment Method
                  </h2>

                  <div className="space-y-3 mb-6">
                    {/* Cash on Delivery */}
                    <div
                      onClick={() => setPaymentMethod("cod")}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition ${paymentMethod === "cod"
                        ? "border-green-500 bg-green-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "cod"}
                          onChange={() => setPaymentMethod("cod")}
                          className="w-5 h-5 text-green-500"
                        />
                        <Banknote className="w-5 h-5 text-green-700" />
                        <div>
                          <div className="font-semibold text-slate-900">
                            Cash on Delivery
                          </div>
                          <div className="text-sm text-slate-600">
                            Pay when you receive your order
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Credit Card */}
                    <div
                      onClick={() => setPaymentMethod("card")}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition ${paymentMethod === "card"
                        ? "border-green-500 bg-blue-50"
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
                      className={`p-4 rounded-xl border-2 cursor-pointer transition ${paymentMethod === "paypal"
                        ? "border-green-500 bg-blue-50"
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
                      className={`p-4 rounded-xl border-2 cursor-pointer transition ${paymentMethod === "bank"
                        ? "border-green-500 bg-blue-50"
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

                  {paymentMethod === "cod" && (
                    <div className="pt-6 border-t border-slate-200">
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-sm text-green-700">
                          💵 Pay with cash when your order is delivered. Please have the exact amount ready for the delivery person.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Terms and Conditions + Submit Button */}
              {selectedAddress && (
                <>
                  {/* Terms and Conditions Checkbox */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="w-5 h-5 mt-0.5 text-[#A12717] rounded border-slate-300 focus:ring-[#A12717]"
                      />
                      <span className="text-sm text-slate-700">
                        I agree to the{" "}
                        <a href="/terms" className="text-[#A12717] hover:underline font-medium">
                          Terms and Conditions
                        </a>{" "}
                        and{" "}
                        <a href="/privacy" className="text-[#A12717] hover:underline font-medium">
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>

                  {/* Error Message */}
                  {orderError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                      {orderError}
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || cartItems.length === 0}
                    className={`w-full bg-[#A12717] cursor-pointer text-white font-semibold py-4 rounded-xl transition transform hover:scale-105 flex items-center justify-center gap-2 ${isSubmitting || cartItems.length === 0 ? "opacity-50 cursor-not-allowed hover:scale-100" : ""
                      }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Complete Purchase
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                    <Lock className="w-4 h-4" />
                    Your payment information is secured and encrypted
                  </div>
                </>
              )}
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
                {cartItems.length === 0 ? (
                  <p className="text-slate-500 text-sm">Your cart is empty</p>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between pb-4 border-b border-slate-100"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 text-sm">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-slate-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))
                )}
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
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-900">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-[#A12717]">
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
