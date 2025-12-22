"use client";
import React, { useState, useCallback } from "react";
import {
  CreditCard,
  ChevronRight,
  Lock,
  Truck,
  Banknote,
  Loader2,
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
import { createOrder } from "@/lib/apiItems";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// GetPay SDK URL
const GETPAY_SDK_URL = "https://minio.finpos.global/getpay-cdn/webcheckout/v5/bundle.js";

// Function to load GetPay SDK dynamically
const loadGetPaySDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if ((window as any).GetPay) {
      console.log("GetPay SDK already loaded");
      resolve();
      return;
    }

    // Check if script is already in DOM
    const existingScript = document.querySelector(`script[src="${GETPAY_SDK_URL}"]`);
    if (existingScript) {
      // Script exists but SDK might still be loading
      const checkLoaded = setInterval(() => {
        if ((window as any).GetPay) {
          clearInterval(checkLoaded);
          console.log("GetPay SDK loaded (waiting)");
          resolve();
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkLoaded);
        if (!(window as any).GetPay) {
          reject(new Error("GetPay SDK failed to load"));
        }
      }, 10000);
      return;
    }

    // Create and load script
    const script = document.createElement("script");
    script.src = GETPAY_SDK_URL;
    script.async = true;

    script.onload = () => {
      console.log("GetPay SDK script loaded");
      // Give it a moment to initialize
      setTimeout(() => {
        if ((window as any).GetPay) {
          console.log("GetPay SDK initialized successfully");
          resolve();
        } else {
          reject(new Error("GetPay SDK loaded but not initialized"));
        }
      }, 100);
    };

    script.onerror = () => {
      reject(new Error("Failed to load GetPay SDK script"));
    };

    document.head.appendChild(script);
  });
};

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isLoadingSDK, setIsLoadingSDK] = useState(false);

  const {
    cartItems,
    isLoading,
    clearCart,
    shippingCharge,
    shippingType,
    cartTotal,
    grandTotal,
    totalDiscount
  } = useCart();
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Pre-load GetPay SDK when card payment is selected
  useEffect(() => {
    if (paymentMethod === "card") {
      setIsLoadingSDK(true);
      loadGetPaySDK()
        .then(() => {
          console.log("GetPay SDK ready for use");
          setIsLoadingSDK(false);
        })
        .catch((err) => {
          console.error("Failed to pre-load GetPay SDK:", err);
          setIsLoadingSDK(false);
        });
    }
  }, [paymentMethod]);

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
        paymentMethod: paymentMethod === "cod" ? "cod" : "getPay",
        termsAndConditions: "true"
      };

      console.log("=== Order Data Being Sent ===");
      console.log(JSON.stringify(orderData, null, 2));
      console.log("Address UUID:", selectedAddress.uuid);

      const response = await createOrder(orderData);

      console.log("=== Order Response from Backend ===");
      console.log(JSON.stringify(response, null, 2));

      // Extract data from response (backend wraps in { code, message, data })
      const orderResponse = response.data || response;

      console.log("=== Debug Info ===");
      console.log("paymentMethod state:", paymentMethod);
      console.log("orderResponse:", orderResponse);
      console.log("orderResponse.paymentMethod:", orderResponse.paymentMethod);
      console.log("orderResponse.getPayOptions exists:", !!orderResponse.getPayOptions);

      // Handle GetPay payment for card payments
      if (paymentMethod === "card") {
        console.log("Entered card payment block");

        // Check if backend returned GetPay options
        if ((orderResponse.paymentMethod === "getpay" || orderResponse.paymentMethod === "getPay") && orderResponse.getPayOptions) {
          console.log("GetPay options check passed");

          // Ensure GetPay SDK is loaded
          try {
            await loadGetPaySDK();
          } catch (sdkError) {
            console.error("Failed to load GetPay SDK:", sdkError);
            setOrderError("Payment gateway failed to load. Please refresh the page and try again.");
            setIsSubmitting(false);
            return;
          }

          const GetPay = (window as any).GetPay;
          console.log("GetPay SDK from window:", GetPay);
          console.log("typeof GetPay:", typeof GetPay);

          if (!GetPay) {
            console.error("GetPay SDK not found on window object!");
            setOrderError("Payment gateway is not available. Please refresh the page and try again.");
            setIsSubmitting(false);
            return;
          }


          // 1. Cleanup: Ensure fresh mount by clearing container
          const checkoutContainer = document.getElementById("checkout");
          if (checkoutContainer) {
            checkoutContainer.innerHTML = "";
            // 2. Fix Width: Ensure container takes full width
            checkoutContainer.style.width = "100%";
            checkoutContainer.style.minHeight = "400px";
            checkoutContainer.style.display = "block"; // Ensure it's visible
          }

          console.log("=== Initializing GetPay SDK ===");
          console.log("GetPay Options:", JSON.stringify(orderResponse.getPayOptions, null, 2));

          const origin = process.env.NEXT_PUBLIC_USER_ORIGIN || "https://www.singingbowlvillagenepal.com";

          // 3. Override Configuration
          const options = {
            ...orderResponse.getPayOptions,
            // Override redirect URLs to use live site
            callbackUrl: {
              successUrl: `${origin}/api/user/orders/success?paymentMethod=getPay&orderId=${orderResponse.orderId}&`,
              failUrl: `${origin}/api/user/orders/payment-fail?orderId=${orderResponse.orderId}&amount=${orderResponse.getPayOptions.price}&uuid=${selectedAddress.uuid}`
            },
            // Prefill billing address
            prefill: {
              name: true,
              email: true,
              state: true,
              city: true,
              address: true,
              zipcode: true,
              country: true
            },
            onSuccess: () => {
              console.log("GetPay payment initiated successfully");
            },
            onError: (err: any) => {
              console.error("GetPay error:", err);
              setOrderError("Payment initialization failed. Please try again.");
              setIsSubmitting(false);
            },
          };

          console.log("Creating GetPay instance...");
          const getpay = new GetPay(options);
          console.log("GetPay instance created:", getpay);
          console.log("Calling initialize...");
          getpay.initialize();
          console.log("Initialize called");

          // Don't set isSubmitting to false here - GetPay will handle the redirect
          return;
        } else {
          // Card was selected but backend didn't return GetPay options
          console.error("GetPay options not received from backend. Response:", response);
          setOrderError("Payment gateway configuration error. Please try again or contact support.");
          setIsSubmitting(false);
          return;
        }
      }

      // For COD orders only, clear cart and show success
      await clearCart();
      setShowSuccessDialog(true);

    } catch (error: any) {
      console.error("Order submission failed:", error);
      setOrderError(error.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      // Only set isSubmitting to false if it's not a GetPay redirect
      if (paymentMethod === "cod") {
        setIsSubmitting(false);
      }
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

                    {/* GetPay Card Payment */}
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
                            Pay with Card (GetPay)
                          </div>
                          <div className="text-sm text-slate-600">
                            Secure payment via GetPay - Visa, Mastercard, and more
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* GetPay checkout container - SDK will render payment form here */}
                  <div id="checkout"></div>

                  {/* Payment Method Info */}
                  {paymentMethod === "card" && (
                    <div className="pt-6 border-t border-slate-200">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-blue-700">
                          💳 You will be redirected to GetPay&apos;s secure payment page to complete your payment with credit/debit card.
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
                          {item.weight && (
                            <span className="ml-2">• Weight: {item.weight}g</span>
                          )}
                        </p>
                        {item.originalPrice > item.price && (
                          <p className="text-xs text-green-600">
                            Save ${((item.originalPrice - item.price) * item.quantity).toFixed(2)}
                          </p>
                        )}
                      </div>
                      <p className="font-semibold text-slate-900">
                        ${item.lineTotal.toFixed(2)}
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
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="text-green-600 font-medium">
                      -${totalDiscount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">{shippingType || 'Shipping'}</span>
                  <span className="text-slate-900 font-medium">
                    {shippingCharge === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${shippingCharge.toFixed(2)}`
                    )}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-900">
                    Grand Total
                  </span>
                  <span className="text-2xl font-bold text-[#A12717]">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
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

      <Dialog open={showSuccessDialog} onOpenChange={() => { }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <span className="text-2xl">🎉</span> Order Placed Successfully!
            </DialogTitle>
            <DialogDescription>
              Your order has been placed successfully and is being processed. You can track your order status in the orders tab.
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
