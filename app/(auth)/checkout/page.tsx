"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
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

// GetPay SDK URL
const GETPAY_SDK_URL = "https://minio.finpos.global/getpay-cdn/webcheckout/v5/bundle.js";

// Utility for safe logging
const safeLog = (label: string, data?: any) => {
  console.log(`[CheckoutDebug] ${label}`, data ? data : "");
};

// Function to load GetPay SDK dynamically with robust state tracking
const loadGetPaySDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 1. Check if global is already available
    if ((window as any).GetPay) {
      safeLog("GetPay SDK global found immediately");
      resolve();
      return;
    }

    // 2. Check for existing script tag
    let script = document.getElementById("getpay-sdk") as HTMLScriptElement;

    if (script) {
      const status = script.getAttribute("data-status");
      safeLog(`GetPay script tag found. Status: ${status}`);

      // If previously errored, remove and retry
      if (status === "error") {
        safeLog("Removing failed GetPay script and retrying...");
        script.remove();
      }
      // If loaded but global missing (rare), verify again or fall through to poll
      else if (status === "loaded") {
        if ((window as any).GetPay) {
          resolve();
          return;
        }
        safeLog("Script marked loaded but global missing. Polling...");
        // Fall through to polling
      }
      else {
        // Poll for existing script to finish
        const checkInterval = setInterval(() => {
          if ((window as any).GetPay) {
            clearInterval(checkInterval);
            resolve();
          } else if (script.getAttribute("data-status") === "error") {
            clearInterval(checkInterval);
            reject(new Error("GetPay script failed to load (async check)"));
          }
        }, 100);

        // Timeout this polling after 10s
        setTimeout(() => {
          clearInterval(checkInterval);
          if (!(window as any).GetPay) reject(new Error("GetPay load timeout"));
        }, 10000);
        return;
      }
    }

    // 3. Create new script if not exists or was removed
    if (!document.getElementById("getpay-sdk")) {
      safeLog("Creating new GetPay script tag...");
      const newScript = document.createElement("script");
      newScript.id = "getpay-sdk";
      newScript.src = GETPAY_SDK_URL;
      newScript.async = true;
      newScript.defer = true; // Add defer to be safe
      newScript.setAttribute("data-status", "loading");

      newScript.onload = () => {
        newScript.setAttribute("data-status", "loaded");
        safeLog("GetPay Script onload triggered");
        // Give it a tick to execute
        setTimeout(() => {
          if ((window as any).GetPay) {
            safeLog("GetPay global confirmed available");
            resolve();
          } else {
            reject(new Error("GetPay script loaded but 'GetPay' global not found"));
          }
        }, 100);
      };

      newScript.onerror = () => {
        newScript.setAttribute("data-status", "error");
        safeLog("GetPay Script onerror triggered");
        reject(new Error("Failed to load GetPay SDK (Network Error)"));
      };

      // APPEND TO BODY INSTEAD OF HEAD
      // Some libraries require document.body to exist on load
      document.body.appendChild(newScript);
    }
  });
};

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Removed isLoadingSDK as we no longer preload

  // Payment Dialog State
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState<any>(null);

  // DEBUG: Track state updates
  useEffect(() => { safeLog("State Update: paymentMethod", paymentMethod); }, [paymentMethod]);
  useEffect(() => { safeLog("State Update: isSubmitting", isSubmitting); }, [isSubmitting]);
  useEffect(() => { safeLog("State Update: isPaymentDialogOpen", isPaymentDialogOpen); }, [isPaymentDialogOpen]);
  useEffect(() => { safeLog("State Update: paymentConfig present?", !!paymentConfig); if (paymentConfig) safeLog("paymentConfig data", paymentConfig); }, [paymentConfig]);
  useEffect(() => { if (orderError) safeLog("State Update: orderError", orderError); }, [orderError]);


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

  // Removed Pre-load useEffect

  // Handle GetPay Initialization logic when dialog opens
  useEffect(() => {
    let mounted = true;

    if (isPaymentDialogOpen && paymentConfig) {
      safeLog("Starting Payment Initialization Sequence...");

      const initializePayment = async () => {
        try {
          // 1. Ensure SDK is loaded (retrying if necessary)
          safeLog("Step 1: Ensuring SDK loaded...");
          await loadGetPaySDK();

          if (!mounted) {
            safeLog("Component unmounted during SDK load");
            return;
          }

          const GetPay = (window as any).GetPay;
          if (!GetPay) throw new Error("GetPay SDK not found after loading");
          safeLog("SDK Global found. Constructor type:", typeof GetPay);

          // 2. Ensure Container is Ready
          // Poll for container in case Dialog animation delays it
          let containerAttempts = 0;
          const waitForContainer = setInterval(() => {
            const container = document.getElementById("checkout");
            containerAttempts++;

            if (container) {
              clearInterval(waitForContainer);

              // Clear previous content
              container.innerHTML = "";
              container.style.width = "100%";
              container.style.minHeight = "600px";
              container.style.display = "block";
              // DEBUG: visual aid
              container.style.border = "2px solid red";

              safeLog("Step 2: Container found and reset. ID: #checkout. Added red border.");

              // Force live site origin
              const origin = "https://www.singingbowlvillagenepal.com";

              // IMPORTANT: GetPay SDK requires onSuccess and onError to be functions
              // BUT: These callbacks are triggered during INITIALIZATION, NOT after payment completion!
              // The actual payment result comes via the callbackUrl redirects (successUrl/failUrl)
              // So we should NOT close the dialog or show success here
              const handlePaymentSuccess = function (data: any) {
                safeLog("GetPay Callback: onSuccess triggered (SDK init callback, NOT payment completion)!", data);
                // DO NOT close dialog or clear cart here - this runs during SDK init, not after payment
                // Check if this looks like actual payment data vs just init options
                if (data && data.transactionId) {
                  // This looks like real payment confirmation (has transaction ID)
                  safeLog("Real payment confirmation received with transactionId:", data.transactionId);
                  if (mounted) {
                    clearCart();
                    setIsPaymentDialogOpen(false);
                    setShowSuccessDialog(true);
                    setIsSubmitting(false);
                  }
                } else {
                  // This is just initialization callback - do nothing, let user complete payment
                  safeLog("SDK init callback received, waiting for user to complete payment form...");
                }
              };

              const handlePaymentError = function (err: any) {
                safeLog("GetPay Callback: onError triggered!", err);
                // Only show error if it's a real error, not just init noise
                if (err && (err.code || err.message)) {
                  safeLog("Real payment error received:", err);
                  if (mounted) {
                    setOrderError(`Payment Gateway Error: ${err?.message || JSON.stringify(err)}`);
                    setIsSubmitting(false);
                  }
                } else {
                  safeLog("SDK callback received (may be init related), continuing...");
                }
              };

              const options = {
                ...paymentConfig.getPayOptions,
                callbackUrl: {
                  successUrl: `${origin}/api/user/orders/success?paymentMethod=getPay&orderId=${paymentConfig.orderId}&`,
                  failUrl: `${origin}/api/user/orders/payment-fail?orderId=${paymentConfig.orderId}&amount=${paymentConfig.getPayOptions.price}&uuid=${selectedAddress?.uuid}`
                },
                // SDK REQUIRES these to be functions - will throw "e.onError is not a function" if missing
                onSuccess: handlePaymentSuccess,
                onError: handlePaymentError
              };

              safeLog("Step 3: Instantiating GetPay with options (with required callbacks):", options);
              safeLog("onSuccess type:", typeof options.onSuccess);
              safeLog("onError type:", typeof options.onError);
              safeLog("Base URL:", paymentConfig.getPayOptions.baseUrl);

              try {
                const getpay = new GetPay(options, paymentConfig.getPayOptions.baseUrl);
                safeLog("Instance created. Calling initialize()...");
                getpay.initialize();
                safeLog("GetPay.initialize() called successfully");

                // Debug: Track container changes with MutationObserver
                const observer = new MutationObserver((mutations) => {
                  mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                      const c = document.getElementById("checkout");
                      safeLog("MutationObserver: Container child changed. Current innerHTML length:", c?.innerHTML.length);
                      if (mutation.removedNodes.length > 0) {
                        safeLog("MutationObserver: Nodes REMOVED from container:", mutation.removedNodes.length);
                      }
                      if (mutation.addedNodes.length > 0) {
                        safeLog("MutationObserver: Nodes ADDED to container:", mutation.addedNodes.length);
                      }
                    }
                  });
                });
                observer.observe(container, { childList: true, subtree: true });

                // Debug: Check content at multiple intervals
                [500, 1000, 2000, 3000, 5000].forEach((ms) => {
                  setTimeout(() => {
                    const c = document.getElementById("checkout");
                    if (c) {
                      safeLog(`Container InnerHTML Length after ${ms}ms:`, c.innerHTML.length);
                      if (c.innerHTML.length === 0) {
                        safeLog(`Container is EMPTY at ${ms}ms! Something cleared it.`);
                      }
                    } else {
                      safeLog(`Container #checkout NOT FOUND at ${ms}ms!`);
                    }
                  }, ms);
                });

              } catch (initErr) {
                console.error("CRITICAL EXCEPTION during GetPay.initialize:", initErr);
                if (mounted) setOrderError("Payment Gateway Error: Please try again or contact support.");
              }

            } else if (containerAttempts > 20) { // 2 seconds timeout
              clearInterval(waitForContainer);
              safeLog("CRITICAL: Container #checkout not found within 2s timeout");
              if (mounted) setOrderError("Payment form container failed to load.");
            }
          }, 100);

        } catch (error) {
          console.error("Payment Init Error:", error);
          if (mounted) {
            setOrderError("Failed to load payment gateway. Please check your internet connection and try again.");
            setIsPaymentDialogOpen(false);
          }
        }
      };

      initializePayment();
    }

    return () => {
      mounted = false;
    };
  }, [isPaymentDialogOpen, paymentConfig]);


  const handleAddressSelect = (address: Address | null) => {
    setSelectedAddress(address);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError(null);
    safeLog("Submit clicked. Method:", paymentMethod);

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

      const orderData = {
        addressId: selectedAddress.uuid,
        couponCodes: [] as string[],
        note: "",
        paymentMethod: paymentMethod === "cod" ? "cod" : "getPay",
        termsAndConditions: "true"
      };

      safeLog("Creating Order...", orderData);

      // Create Order on Backend
      const response = await createOrder(orderData);

      // Handle response wrapping
      const orderResponse = response.data || response;
      safeLog("Order Created Response:", orderResponse);

      if (paymentMethod === "card") {
        // CARD FLOW: Open Dialog with GetPay
        if ((orderResponse.paymentMethod === "getpay" || orderResponse.paymentMethod === "getPay") && orderResponse.getPayOptions) {
          setPaymentConfig(orderResponse);
          setIsPaymentDialogOpen(true);
          safeLog("Opening Dialog...");
        } else {
          throw new Error("Invalid payment configuration from server - Missing GetPay options");
        }
      } else {
        // COD FLOW: Instant Success
        safeLog("COD Flow - Success");
        await clearCart();
        setShowSuccessDialog(true);
        setIsSubmitting(false);
      }

    } catch (error: any) {
      console.error("Order submission failed:", error);
      setOrderError(error.response?.data?.message || "Failed to place order. Please try again.");
      setIsSubmitting(false);
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
      {/* Main Content - Expanded Width */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8 md:py-12">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition relative overflow-hidden ${paymentMethod === "cod"
                      ? "border-green-500 bg-green-50/50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                  >
                    <div className="flex items-center gap-3 relative z-10">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "cod" ? "border-green-500" : "border-slate-300"}`}>
                        {paymentMethod === "cod" && <div className="w-2.5 h-2.5 rounded-full bg-green-500" />}
                      </div>
                      <Banknote className={`w-6 h-6 ${paymentMethod === "cod" ? "text-green-600" : "text-slate-400"}`} />
                      <div>
                        <div className="font-semibold text-slate-900">
                          Cash on Delivery
                        </div>
                        <div className="text-xs text-slate-500">
                          Pay upon receipt
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* GetPay Card Payment */}
                  <div
                    onClick={() => setPaymentMethod("card")}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition relative overflow-hidden ${paymentMethod === "card"
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                  >
                    <div className="flex items-center gap-3 relative z-10">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "card" ? "border-blue-500" : "border-slate-300"}`}>
                        {paymentMethod === "card" && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                      </div>
                      <CreditCard className={`w-6 h-6 ${paymentMethod === "card" ? "text-blue-600" : "text-slate-400"}`} />
                      <div>
                        <div className="font-semibold text-slate-900">
                          Pay with Card
                        </div>
                        <div className="text-xs text-slate-500">
                          Secure via GetPay
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Info Box */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 text-sm text-slate-600">
                  {paymentMethod === "card" ? (
                    <p className="flex items-start gap-2">
                      <span className="text-lg">💳</span>
                      <span>You will be prompted to enter your card details in a secure popup after clicking "Complete Purchase".</span>
                    </p>
                  ) : (
                    <p className="flex items-start gap-2">
                      <span className="text-lg">💵</span>
                      <span>Please have the exact amount ready for the delivery driver.</span>
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
                    <a href="/terms" className="text-[#A12717] hover:underline font-medium">Terms and Conditions</a>
                    {" "}and{" "}
                    <a href="/privacy" className="text-[#A12717] hover:underline font-medium">Privacy Policy</a>
                  </span>
                </label>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || cartItems.length === 0}
                  className={`w-full bg-[#A12717] text-white font-bold text-lg py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:bg-[#8a2113] active:scale-[0.99] flex items-center justify-center gap-2 ${isSubmitting || cartItems.length === 0 ? "opacity-50 cursor-not-allowed transform-none" : ""
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Processing Order...
                    </>
                  ) : (
                    <>
                      Complete Purchase
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
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="font-medium text-green-600">-${totalDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">{shippingType || "Shipping"}</span>
                  <span className="font-medium text-slate-900">{shippingCharge === 0 ? "Free" : `$${shippingCharge.toFixed(2)}`}</span>
                </div>
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

      {/* Success Dialog */}
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

      {/* Payment Processing Dialog */}
      <Dialog
        open={isPaymentDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            // User closed the payment dialog manually
            safeLog("User closed payment dialog");
            setIsSubmitting(false);
            setIsPaymentDialogOpen(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-xl md:max-w-2xl bg-white p-0 overflow-hidden min-h-[650px] flex flex-col">
          <DialogHeader className="p-6 border-b border-slate-100 bg-slate-50/50">
            <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-blue-600" />
              Secure Payment
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Please complete your payment below. Do not close this window.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 w-full bg-slate-50 relative p-4" >
            {/* The Container for GetPay */}
            <div id="checkout" className="w-full h-full min-h-[500px]"></div>
            {/* Placeholder loader in case SDK takes time and container is empty */}
            {!paymentConfig && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Checkout;
