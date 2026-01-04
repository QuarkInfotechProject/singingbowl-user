"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  Lock,
  Truck,
  Loader2,
  Banknote,
  Tag,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddressList from "@/components/Address/AddressList";
import { Address } from "@/types/address.types";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createOrder, fetchCoupons } from "@/lib/apiItems";
import { useRouter } from "next/navigation";
import Image from "next/image";

type PaymentMethod = "cod" | "getPay";

interface AvailableCoupon {
  name: string;
  code: string;
  value: string;
  type: string;
  minQuantity: number;
  applyAutomatically: boolean;
  expiryDate: string;
  paymentMethods: string[] | string;
}

const Checkout = () => {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("cod");
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [availableCoupons, setAvailableCoupons] = useState<AvailableCoupon[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false); // Prevent duplicate submissions

  const {
    cartItems,
    isLoading,
    clearCart,
    shippingCharge,
    shippingType,
    cartTotal,
    grandTotal,
    totalDiscount,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    isApplyingCoupon
  } = useCart();
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const handleAddressSelect = (address: Address | null) => {
    setSelectedAddress(address);
  };

  // Fetch available coupons on mount
  useEffect(() => {
    const loadCoupons = async () => {
      try {
        setLoadingCoupons(true);
        const response = await fetchCoupons();
        if (response?.data) {
          setAvailableCoupons(response.data);
        }
      } catch (error) {
        // Silently fail - coupons are optional
      } finally {
        setLoadingCoupons(false);
      }
    };
    loadCoupons();
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
    setCouponError(null);
    setCouponSuccess(null);

    const result = await applyCoupon(couponCode.trim());
    if (result.success) {
      setCouponSuccess(result.message);
      setCouponCode(""); // Clear input on success
    } else {
      setCouponError(result.message);
    }
  };

  const handleRemoveCoupon = async () => {
    setCouponError(null);
    setCouponSuccess(null);
    const result = await removeCoupon();
    if (result.success) {
      setCouponSuccess(result.message);
    } else {
      setCouponError(result.message);
    }
  };

  const handleSelectCoupon = (code: string) => {
    setCouponCode(code);
    setCouponError(null);
  };

  // Filter coupons based on selected payment method
  const getFilteredCoupons = () => {
    return availableCoupons.filter(coupon => {
      // Parse paymentMethods if it's a string (JSON)
      let methods: string[] = [];
      if (typeof coupon.paymentMethods === 'string') {
        try {
          methods = JSON.parse(coupon.paymentMethods);
        } catch {
          methods = [];
        }
      } else if (Array.isArray(coupon.paymentMethods)) {
        methods = coupon.paymentMethods;
      }

      // If no payment methods specified, coupon applies to all
      if (methods.length === 0) return true;

      // Map payment method "cod" -> "cod", "getPay" -> "card"
      const currentMethod = selectedPaymentMethod === 'getPay' ? 'card' : 'cod';
      return methods.includes(currentMethod);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError(null);

    if (!selectedAddress?.uuid) {
      setOrderError("Please select a delivery address");
      return;
    }

    if (!agreedToTerms) {
      setOrderError("Please agree to the terms and conditions");
      return;
    }

    try {
      setIsSubmitting(true);
      setOrderCreated(true);

      // Clear ALL payment-related sessionStorage to prevent stale data
      sessionStorage.removeItem('paymentConfig');
      sessionStorage.removeItem('lastGetPayEvent');
      sessionStorage.removeItem('currentOrderId');

      const orderData = {
        addressId: selectedAddress.uuid,
        couponCodes: appliedCoupon ? [appliedCoupon.code] : [],
        note: "",
        paymentMethod: selectedPaymentMethod,
        termsAndConditions: "true"
      };

      // Create Order on Backend
      const response = await createOrder(orderData);

      // Handle response wrapping
      const orderResponse = response.data || response;

      // COD FLOW: Show success directly
      if (selectedPaymentMethod === "cod") {
        clearCart();
        setShowSuccessDialog(true);
        setIsSubmitting(false);
        return;
      }

      // GetPay FLOW: Store config and redirect to payment page
      if ((orderResponse.paymentMethod === "getpay" || orderResponse.paymentMethod === "getPay") && orderResponse.getPayOptions) {
        // DEBUG: Log the order response to identify orderId mismatch
        console.log('=== Order Created Debug ===');
        console.log('orderResponse.orderId:', orderResponse.orderId);
        console.log('orderResponse.getPayOptions.callbackUrl:', orderResponse.getPayOptions?.callbackUrl);
        console.log('orderResponse.getPayOptions.clientRequestId:', orderResponse.getPayOptions?.clientRequestId);
        console.log('Full orderResponse:', JSON.stringify(orderResponse, null, 2));

        // Store payment config in sessionStorage (survives page navigation)
        // Include a timestamp and store orderId separately for validation
        const config = {
          ...orderResponse,
          addressUuid: selectedAddress?.uuid,
          _timestamp: Date.now() // Help detect stale configs
        };
        sessionStorage.setItem('paymentConfig', JSON.stringify(config));
        // Store orderId separately as a backup validation source
        sessionStorage.setItem('currentOrderId', String(orderResponse.orderId));

        // Redirect to payment page
        router.push('/checkout/payment');
      } else {
        throw new Error("Invalid payment configuration from server - Missing GetPay options");
      }

    } catch (error: any) {
      setOrderError(error.response?.data?.error || error.response?.data?.message || "Failed to place order. Please try again.");
      setIsSubmitting(false);
      setOrderCreated(false); // Allow retry on error
    }
  };

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push("/login?redirect=/checkout");
    }
  }, [isLoggedIn, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#A12717]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50">
      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8 md:py-12">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Checkout</h1>
          <p className="text-slate-500 mt-2">Complete your order by providing delivery and payment details.</p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* LEFT COLUMN: Checkout Form */}
          <div className="lg:col-span-2 space-y-6">

            {/* Shipping Information */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <Truck className="w-5 h-5 md:w-6 md:h-6 text-slate-700" />
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">
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
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Lock className="w-5 h-5 md:w-6 md:h-6 text-slate-700" />
                  Payment Method
                </h2>

                <div className="space-y-3">
                  {/* COD Payment Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod("cod")}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${selectedPaymentMethod === "cod"
                      ? "border-green-500 bg-green-50/50"
                      : "border-slate-200 hover:border-slate-300"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPaymentMethod === "cod" ? "border-green-500" : "border-slate-300"
                        }`}>
                        {selectedPaymentMethod === "cod" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        )}
                      </div>
                      <Banknote className={`w-6 h-6 ${selectedPaymentMethod === "cod" ? "text-green-600" : "text-slate-400"}`} />
                      <div>
                        <div className="font-semibold text-slate-900">
                          Cash on Delivery (COD)
                        </div>
                        <div className="text-xs text-slate-500">
                          Pay when you receive your order
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* GetPay Payment Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod("getPay")}
                    className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all text-left ${selectedPaymentMethod === "getPay"
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-slate-200 hover:border-slate-300"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPaymentMethod === "getPay" ? "border-blue-500" : "border-slate-300"
                        }`}>
                        {selectedPaymentMethod === "getPay" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        )}
                      </div>
                      <Image src="/assets/images/logo/getpay.webp" alt="Mastercard" width={50} height={50} />

                      <div>
                        <div className="font-semibold text-slate-900">
                          Pay via Debit/Credit Card
                        </div>
                        <div className="text-xs text-slate-500">
                          Secure payment via GetPay
                        </div>
                      </div>
                    </div>

                    {/* Card images */}
                    <div className="flex gap-3 items-center">
                      <Image src="/assets/images/logo/ime.jpeg" alt="Mastercard" width={130} height={50} />
                    </div>
                  </button>
                </div>

                {/* Payment Info Box */}
                <div className="mt-4 bg-slate-50 rounded-lg p-4 border border-slate-200 text-sm text-slate-600">
                  {selectedPaymentMethod === "cod" ? (
                    <p className="flex items-center gap-2">
                      <span className="text-lg">💵</span>
                      <span>Pay cash when your order is delivered. Please have the exact amount ready.</span>
                    </p>
                  ) : (
                    <p className="flex items-center gap-2">
                      <span className="text-lg">💳</span>
                      <span>You will be redirected to a secure payment page after clicking &quot;Complete Purchase&quot;.</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Terms & Submit */}
            {selectedAddress && (
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
                {/* Terms Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer mb-6 group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="peer w-5 h-5 cursor-pointer appearance-none rounded border border-slate-300 shadow-sm focus:ring-2 focus:ring-[#A12717]/20 checked:bg-[#A12717] checked:border-[#A12717] transition-all"
                    />
                    <svg className="absolute w-3.5 h-3.5 text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                    I agree to the{" "}
                    <a href="/terms-and-condition" className="text-[#A12717] hover:underline font-medium">Terms and Conditions</a>
                    {" "}and{" "}
                    <a href="/privacy-policy" className="text-[#A12717] hover:underline font-medium">Privacy Policy</a>
                  </span>
                </label>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || orderCreated || cartItems.length === 0}
                  className={`w-full bg-[#A12717] text-white font-bold text-lg py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:bg-[#8a2113] active:scale-[0.99] flex items-center justify-center gap-2 ${isSubmitting || orderCreated || cartItems.length === 0 ? "opacity-50 cursor-not-allowed transform-none" : ""
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Processing Order...
                    </>
                  ) : (
                    <>
                      {selectedPaymentMethod === "cod" ? "Place Order" : "Complete Purchase"}
                      <ChevronRight className="w-6 h-6" />
                    </>
                  )}
                </button>

                {orderError && (
                  <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                    <span className="text-xl">⚠️</span> {orderError}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Order Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">Your cart is empty</p>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 mb-4 last:mb-0">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 text-sm truncate">{item.name}</p>
                        <p className="text-xs text-slate-500 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900 text-sm">${item.lineTotal.toFixed(2)}</p>
                        {item.originalPrice > item.price && (
                          <p className="text-[10px] text-green-600 line-through">${(item.originalPrice * item.quantity).toFixed(2)}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Calculations */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium text-slate-900">${cartTotal.toFixed(2)}</span>
                </div>
                {totalDiscount > 0 && !appliedCoupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="font-medium text-green-600">-${totalDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600"><span>Standard shipping rate from Nepal</span>
                  </span>
                  <span className="font-medium"></span>
                  <span className="font-medium text-slate-900">{shippingCharge === 0 ? "Free" : `$${shippingCharge.toFixed(2)}`}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Coupon Discount</span>
                    <span className="font-medium text-green-600">-${couponDiscount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Coupon Section */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Apply Coupon
                </h4>

                {appliedCoupon ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-green-600" />
                        <div>
                          <span className="font-semibold text-green-700">{appliedCoupon.code}</span>
                          <p className="text-xs text-green-600">
                            {appliedCoupon.type === 'free_shipping' ? 'Free Shipping' : `$${appliedCoupon.discount.toFixed(2)} off`}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        disabled={isApplyingCoupon}
                        className="p-1 hover:bg-green-100 rounded-full transition-colors"
                        title="Remove coupon"
                      >
                        {isApplyingCoupon ? (
                          <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-green-600" />
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
                          setCouponError(null);
                        }}
                        placeholder="Enter coupon code"
                        className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A12717]/20 focus:border-[#A12717] placeholder:text-slate-400"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon || !couponCode.trim()}
                        className="px-4 py-2 bg-[#A12717] text-white text-sm font-medium rounded-lg hover:bg-[#8a2113] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        {isApplyingCoupon ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Apply"
                        )}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <span>⚠️</span> {couponError}
                      </p>
                    )}
                  </div>
                )}

                {couponSuccess && (
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <span>✅</span> {couponSuccess}
                  </p>
                )}

                {/* Available Coupons List */}
                {!appliedCoupon && getFilteredCoupons().length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-slate-500 mb-2">Available coupons (click to apply):</p>
                    <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar">
                      {getFilteredCoupons().map((coupon) => (
                        <button
                          key={coupon.code}
                          onClick={() => handleSelectCoupon(coupon.code)}
                          disabled={isApplyingCoupon}
                          className="w-full text-left p-2 rounded-lg border border-slate-200 hover:border-green-300 hover:bg-green-50/50 transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs font-mono font-semibold text-green-700 group-hover:text-green-800">
                                {coupon.code}
                              </span>
                              <p className="text-[10px] text-slate-500">
                                {coupon.name} • {coupon.type === 'free_shipping' ? 'Free Shipping' : `$${parseFloat(coupon.value).toFixed(2)} off`}
                              </p>
                            </div>
                            <Tag className="w-3 h-3 text-slate-400 group-hover:text-green-600" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {loadingCoupons && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Loading available coupons...
                  </div>
                )}
              </div>

              {/* Grand Total */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex justify-between items-end">
                  <span className="text-slate-600 font-medium">Grand Total</span>
                  <span className="text-3xl font-bold text-[#A12717]">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Success Dialog (COD only) */}
      <Dialog open={showSuccessDialog} onOpenChange={() => { }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <span className="text-2xl">🎉</span> Order Placed Successfully!
            </DialogTitle>
            <DialogDescription>
              Your order has been placed successfully! Please have the payment ready when your order arrives.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              type="button"
              className="bg-[#A12717] hover:bg-[#8a2113] text-white w-full sm:w-auto px-8"
              onClick={() => router.push("/profile?tab=orders")}
            >
              OK, Go to Orders
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;
