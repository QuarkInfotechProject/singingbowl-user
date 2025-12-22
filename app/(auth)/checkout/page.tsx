"use client";
import React, { useState, useEffect } from "react";
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

// Utility for safe logging
const safeLog = (label: string, data?: any) => {
  console.log(`[CheckoutDebug] ${label}`, data !== undefined ? data : "");
};

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Tab-based checkout state
  const [activeTab, setActiveTab] = useState<'checkout' | 'payment'>('checkout');
  const [paymentConfig, setPaymentConfig] = useState<any>(null);
  const [sdkLoading, setSdkLoading] = useState(false);

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

  // DEBUG: Track key state updates
  useEffect(() => { safeLog("State Update: paymentMethod", paymentMethod); }, [paymentMethod]);
  useEffect(() => { safeLog("State Update: isSubmitting", isSubmitting); }, [isSubmitting]);
  useEffect(() => { safeLog("State Update: activeTab", activeTab); }, [activeTab]);

  // GetPay SDK URL
  const GETPAY_SDK_URL = "https://minio.finpos.global/getpay-cdn/webcheckout/v5/bundle.js";

  // Initialize GetPay when payment tab becomes active using iframe
  useEffect(() => {
    if (activeTab !== 'payment' || !paymentConfig) return;

    safeLog("=== PAYMENT TAB ACTIVE - Creating iframe for GetPay ===");
    setSdkLoading(true);

    const container = document.getElementById("getpay-payment-container");
    if (!container) {
      safeLog("ERROR: Container not found!");
      setOrderError("Payment container not found. Please try again.");
      setSdkLoading(false);
      return;
    }

    // Clear container
    container.innerHTML = "";

    const origin = "https://www.singingbowlvillagenepal.com";
    const sdkUrl = GETPAY_SDK_URL;

    // Build the options for GetPay
    const getPayOptions = {
      ...paymentConfig.getPayOptions,
      containerId: "#checkout",
      callbackUrl: {
        successUrl: `${origin}/api/user/orders/success/${paymentConfig.orderId}`,
        failUrl: `${origin}/api/user/orders/payment-fail/${paymentConfig.orderId}/${paymentConfig.getPayOptions.price}/${paymentConfig.addressUuid}`
      }
    };

    // Create iframe HTML that loads GetPay SDK in isolation
    const iframeHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body { height: 100%; width: 100%; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fff; }
          #checkout { width: 100%; min-height: 600px; padding: 16px; }
          .loading { display: flex; align-items: center; justify-content: center; height: 400px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div id="checkout"><div class="loading">Initializing payment...</div></div>
        <script src="${sdkUrl}"><\/script>
        <script>
          (function() {
            console.log('[GetPayIframe] Starting initialization');
            
            function initGetPay() {
              if (typeof GetPay === 'undefined') {
                console.log('[GetPayIframe] GetPay not ready, retrying...');
                setTimeout(initGetPay, 100);
                return;
              }
              
              console.log('[GetPayIframe] GetPay available, initializing...');
              
              // Clear the container before SDK takes over
              document.getElementById('checkout').innerHTML = '';
              
              var options = ${JSON.stringify(getPayOptions)};
              options.onSuccess = function(data) {
                console.log('[GetPayIframe] onSuccess:', data);
                // Only treat as success if we have a transactionId (real payment)
                if (data && data.transactionId) {
                  window.parent.postMessage({ type: 'GETPAY_SUCCESS', data: data }, '*');
                } else {
                  console.log('[GetPayIframe] Init callback (no transactionId), ignoring...');
                }
              };
              options.onError = function(err) {
                console.log('[GetPayIframe] onError:', err);
                if (err && (err.code || err.message)) {
                  window.parent.postMessage({ type: 'GETPAY_ERROR', error: err }, '*');
                }
              };
              
              try {
                var getpay = new GetPay(options, '${paymentConfig.getPayOptions.baseUrl}');
                getpay.initialize();
                console.log('[GetPayIframe] GetPay initialized successfully');
                window.parent.postMessage({ type: 'GETPAY_READY' }, '*');
                
                // Log what the SDK rendered after a short delay
                setTimeout(function() {
                  var container = document.getElementById('checkout');
                  console.log('[GetPayIframe] Container innerHTML length:', container ? container.innerHTML.length : 0);
                }, 1000);
              } catch (e) {
                console.error('[GetPayIframe] Init error:', e);
                window.parent.postMessage({ type: 'GETPAY_ERROR', error: { message: e.message } }, '*');
              }
            }
            
            // Start initialization after DOM is ready
            if (document.readyState === 'complete') {
              setTimeout(initGetPay, 500);
            } else {
              window.onload = function() { setTimeout(initGetPay, 500); };
            }
          })();
        <\/script>
      </body>
      </html>
    `;

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.minHeight = '500px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '12px';

    container.appendChild(iframe);

    // Write content to iframe
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(iframeHtml);
      iframeDoc.close();
    }

    // Listen for messages from iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'GETPAY_READY') {
        safeLog("GetPay iframe ready");
        setSdkLoading(false);
      } else if (event.data?.type === 'GETPAY_SUCCESS') {
        safeLog("GetPay payment success:", event.data.data);
        clearCart();
        setShowSuccessDialog(true);
      } else if (event.data?.type === 'GETPAY_ERROR') {
        safeLog("GetPay payment error:", event.data.error);
        setOrderError(`Payment failed: ${event.data.error?.message || 'Unknown error'}`);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };

  }, [activeTab, paymentConfig, clearCart]);

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
        // CARD FLOW: Switch to payment tab
        if ((orderResponse.paymentMethod === "getpay" || orderResponse.paymentMethod === "getPay") && orderResponse.getPayOptions) {
          safeLog("Switching to payment tab...");

          // Store payment config for the payment tab
          const config = {
            ...orderResponse,
            addressUuid: selectedAddress?.uuid
          };
          setPaymentConfig(config);
          setActiveTab('payment');
          setIsSubmitting(false);
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

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => activeTab === 'payment' && paymentConfig ? null : setActiveTab('checkout')}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === 'checkout'
                ? 'text-[#A12717] border-b-2 border-[#A12717]'
                : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">1</span>
                Checkout
              </span>
            </button>
            <button
              disabled={!paymentConfig}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === 'payment'
                ? 'text-[#A12717] border-b-2 border-[#A12717]'
                : paymentConfig
                  ? 'text-slate-500 hover:text-slate-700 cursor-pointer'
                  : 'text-slate-300 cursor-not-allowed'
                }`}
            >
              <span className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${paymentConfig ? 'bg-slate-100' : 'bg-slate-50'
                  }`}>2</span>
                Payment
              </span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'checkout' ? (
          /* CHECKOUT TAB */
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
        ) : (
          /* PAYMENT TAB */
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">Secure Payment</h2>
                  <p className="text-slate-500 text-sm">Complete your payment below. Do not close this page.</p>
                </div>
              </div>

              {/* GetPay Payment Container - Always visible for SDK */}
              <div className="relative">
                {sdkLoading && (
                  <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-10 rounded-xl">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                    <p className="text-slate-600 font-medium">Loading payment form...</p>
                    <p className="text-slate-400 text-sm mt-2">Please wait while we connect to the payment gateway</p>
                  </div>
                )}
                <div
                  id="getpay-payment-container"
                  className="w-full min-h-[500px] border border-slate-200 rounded-xl p-4"
                />
              </div>

              {/* Back button */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <button
                  onClick={() => {
                    setActiveTab('checkout');
                    setPaymentConfig(null);
                  }}
                  className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-2"
                >
                  ← Back to Checkout
                </button>
              </div>
            </div>

            {/* Security Note */}
            <div className="mt-6 text-center">
              <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                <span>🔒</span>
                Secured by GetPay • Your payment information is encrypted
              </p>
            </div>
          </div>
        )}
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
    </div>
  );
};

export default Checkout;
