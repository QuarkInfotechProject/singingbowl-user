"use client";
import React, { useState, useEffect, useRef } from "react";
import { CreditCard, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

// Declare GetPay as global
declare global {
    interface Window {
        GetPay: any;
    }
}

interface PaymentConfig {
    getPayOptions?: {
        baseUrl?: string;
        containerId?: string;
        callbackUrl?: string | { successUrl?: string; failUrl?: string };
        websiteDomain?: string;
        [key: string]: any;
    };
    addressUuid?: string;
    [key: string]: any;
}

const PaymentPage = () => {
    const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);
    const [sdkLoading, setSdkLoading] = useState(true);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [sessionExpired, setSessionExpired] = useState(false);

    const scriptLoadedRef = useRef(false);
    const getpayInitializedRef = useRef(false);

    const { isLoggedIn, isLoading: authLoading } = useAuth();
    const router = useRouter();

    // Cart Context for Order Summary
    const {
        cartItems,
        cartTotal,
        grandTotal,
        shippingCharge,
        totalDiscount,
        couponDiscount
    } = useCart();

    // GetPay SDK URL
    const GETPAY_SDK_URL = process.env.NEXT_PUBLIC_GETPAY_SDK_URL;

    // Load payment config from sessionStorage on mount
    useEffect(() => {
        const storedConfig = sessionStorage.getItem('paymentConfig');

        if (!storedConfig) {
            setSessionExpired(true);
            setSdkLoading(false);
            return;
        }

        try {
            const config = JSON.parse(storedConfig) as PaymentConfig;
            console.log("Payment config loaded:", config);
            setPaymentConfig(config);
        } catch (error) {
            console.error("Error parsing payment config:", error);
            setSessionExpired(true);
            setSdkLoading(false);
        }
    }, []);

    // Load SDK script and initialize GetPay
    useEffect(() => {
        if (!paymentConfig) return;
        if (!GETPAY_SDK_URL) {
            setPaymentError("Payment SDK URL is not configured. Please contact support.");
            setSdkLoading(false);
            return;
        }

        // Prevent double-initialization
        if (getpayInitializedRef.current) {
            console.log("GetPay already initialized, skipping.");
            return;
        }

        let isMounted = true;

        const loadAndInit = async () => {
            // Check if script is already present
            if (!document.querySelector(`script[src="${GETPAY_SDK_URL}"]`)) {
                const script = document.createElement('script');
                script.src = GETPAY_SDK_URL;
                script.async = true;

                // Wait for load
                await new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = reject;
                    document.body.appendChild(script);
                });
                console.log("GetPay SDK script loaded");
                scriptLoadedRef.current = true;
            } else {
                console.log("GetPay SDK script already present");
                scriptLoadedRef.current = true;
            }

            // Small delay to ensure global object is ready and DOM is stable
            await new Promise(r => setTimeout(r, 500));

            if (!isMounted) return;

            initGetPayOps();
        };

        loadAndInit().catch(err => {
            console.error('Failed to load GetPay script:', err);
            if (isMounted) {
                setPaymentError("Failed to load payment SDK. Please refresh the page.");
                setSdkLoading(false);
            }
        });

        // Cleanup function
        return () => {
            isMounted = false;
            // NOTE: We do NOT reset getpayInitializedRef.current here because 
            // verifying unmount/remount in strict mode causes unwanted re-init.
        };
    }, [paymentConfig, GETPAY_SDK_URL]);

    // Separated initialization logic
    const initGetPayOps = () => {
        if (getpayInitializedRef.current) return;

        // Check availability
        if (typeof window.GetPay === 'undefined') {
            console.log("GetPay global not found even after load waiting.");
            return;
        }

        const container = document.getElementById("checkout");
        if (!container) {
            console.error("Checkout container #checkout not found in DOM.");
            setPaymentError("Payment form container missing.");
            setSdkLoading(false);
            return;
        }

        // --- Prevent Double/Dirty Init ---
        // If the container already has content (iframe), clear it or skip
        if (container.hasChildNodes()) {
            console.log("Container already populated, assuming init done.");
            // Optional: container.innerHTML = ''; // If we wanted to force re-render
            // For now, we assume it's fine.
        }

        console.log("Initializing GetPay...");
        getpayInitializedRef.current = true;

        try {
            const getPayOptionsFromConfig = paymentConfig?.getPayOptions || {};
            const backendCallbackUrl = getPayOptionsFromConfig.callbackUrl;

            // Safe URL extraction
            let successUrl = "https://www.singingbowlvillagenepal.com/checkout"; // Default fallback
            let failUrl = "https://www.singingbowlvillagenepal.com/checkout?error=failed";

            if (backendCallbackUrl) {
                if (typeof backendCallbackUrl === 'object' && backendCallbackUrl !== null) {
                    successUrl = backendCallbackUrl.successUrl || successUrl;
                    failUrl = backendCallbackUrl.failUrl || failUrl;
                } else if (typeof backendCallbackUrl === 'string') {
                    successUrl = backendCallbackUrl;
                }
            }

            const getPayOptions: Record<string, any> = {
                ...getPayOptionsFromConfig,
                containerId: "#checkout",
                successUrl: successUrl,
                failUrl: failUrl,
                onSuccess: (data: any) => {
                    console.log("GetPay Success Callback:", data);
                    // Robust check for success status
                    const isRealSuccess = data && (
                        data.transactionId ||
                        data.transaction_id ||
                        data.status === 'SUCCESS' ||
                        data.responseCode === '0' ||
                        data.response_code === '0'
                    );

                    if (isRealSuccess) {
                        console.log("Valid payment success. Redirecting to:", successUrl);
                        window.location.href = successUrl;
                    } else {
                        console.warn("Premature/Invalid success callback. Data:", data);
                    }
                },
                onError: (error: any) => {
                    console.error("GetPay Error Callback:", error);
                },
                // Pass structured callbackUrl for SDK compatibility
                callbackUrl: {
                    successUrl: successUrl,
                    failUrl: failUrl
                }
            };

            console.log("GetPay Final Options:", getPayOptions);

            const baseUrl = getPayOptionsFromConfig.baseUrl;
            const getpay = new window.GetPay(getPayOptions, baseUrl);
            getpay.initialize();

            console.log("GetPay initialized call done.");
            setSdkLoading(false);

        } catch (e: any) {
            console.error("GetPay initialization threw error:", e);
            setPaymentError(`Payment system error: ${e.message}`);
            setSdkLoading(false);
            getpayInitializedRef.current = false; // Allow retry if it crashed
        }
    };

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.push("/login?redirect=/checkout");
        }
    }, [isLoggedIn, authLoading, router]);

    // Handle back to checkout
    const handleBackToCheckout = () => {
        sessionStorage.removeItem('paymentConfig');
        router.push('/checkout');
    };

    // Loading state
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-[#A12717] rounded-full animate-spin" />
            </div>
        );
    }

    // Session expired state
    if (sessionExpired) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200 max-w-md w-full text-center">
                    <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Session Expired</h2>
                    <p className="text-slate-600 mb-6">
                        Your payment session has expired or is invalid. Please start the checkout process again.
                    </p>
                    <Button
                        onClick={handleBackToCheckout}
                        className="bg-[#A12717] hover:bg-[#8a2113] text-white px-8"
                    >
                        Back to Checkout
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className=" mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={handleBackToCheckout}
                        className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-2 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Checkout
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900">Complete Your Payment</h1>
                    <p className="text-slate-500 mt-1">Enter your card details below to finalize your order.</p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* LEFT COLUMN: Payment Form */}
                    <div className="space-y-6">
                        {/* Status Banner */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                            <span className="text-xl">⏳</span>
                            <div>
                                <h3 className="font-semibold text-amber-800">Payment Pending</h3>
                                <p className="text-amber-700 text-sm">
                                    Your order is reserved. Complete the payment below to confirm.
                                </p>
                            </div>
                        </div>

                        <div className="flex  items-start justify-between">

                            {/* RIGHT COLUMN: Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 sticky top-4">
                                    <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
                                        Order Summary
                                    </h3>

                                    <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {cartItems.length === 0 ? (
                                            <p className="text-slate-500 text-sm text-center py-4">Your cart information is loading...</p>
                                        ) : (
                                            cartItems.map((item) => (
                                                <div key={item.id} className="flex gap-4 mb-4 last:mb-0">
                                                    <div className="w-12 h-12 bg-slate-100 rounded-md flex items-center justify-center flex-shrink-0 text-xs text-slate-400 overflow-hidden">
                                                        {item.image ? (
                                                            <img
                                                                src={item.image.startsWith('http://') ? item.image.replace('http://', 'https://') : item.image}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            "Img"
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-slate-900 text-sm truncate">{item.name}</p>
                                                        <p className="text-xs text-slate-500 mt-1">Qty: {item.quantity}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-slate-900 text-sm">${item.lineTotal.toFixed(2)}</p>
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
                                            <span className="text-slate-600">Shipping</span>
                                            <span className="font-medium text-slate-900">{shippingCharge === 0 ? "Free" : `$${shippingCharge.toFixed(2)}`}</span>
                                        </div>
                                        {couponDiscount > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-green-600">Coupon Discount</span>
                                                <span className="font-medium text-green-600">-${couponDiscount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-base pt-2 border-t border-slate-100 mt-2">
                                            <span className="font-bold text-slate-900">Grand Total</span>
                                            <span className="font-bold text-[#A12717]">${grandTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Container */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                {/* Payment Header */}
                                <div className="bg-blue-600 p-5 text-white">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                            <CreditCard className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold">Secure Card Payment</h2>
                                            <p className="text-blue-100 text-sm">Your information is encrypted and secure</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Form Area */}
                                <div className="p-6">
                                    {/* GetPay Container */}
                                    <div className="relative min-h-[500px]">
                                        {sdkLoading && (
                                            <div className="absolute inset-0 bg-white flex flex-col items-center justify-center z-10">
                                                <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-4" />
                                                <p className="text-slate-700 font-medium">Loading payment form...</p>
                                                <p className="text-slate-400 text-sm">Connecting to secure gateway</p>
                                            </div>
                                        )}
                                        <div
                                            id="checkout"
                                            className={`min-h-[500px] transition-opacity duration-300 ${sdkLoading ? 'opacity-0' : 'opacity-100'}`}
                                        />
                                    </div>

                                    {/* Error Display */}
                                    {paymentError && (
                                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-semibold text-red-700">Payment Error</p>
                                                <p className="text-red-600 text-sm">{paymentError}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Security Features */}
                                    <div className="mt-6 pt-4 border-t border-slate-100">
                                        <div className="flex justify-center gap-8 text-center text-xs text-slate-500">
                                            <div className="flex flex-col items-center">
                                                <span className="text-lg mb-1">🔒</span>
                                                <span>SSL Encrypted</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-lg mb-1">🛡️</span>
                                                <span>Fraud Protection</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-lg mb-1">✅</span>
                                                <span>Verified Secure</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        {/* Footer */}
                        <p className="text-center text-xs text-slate-400 mt-6">
                            🔐 Secured by GetPay • 256-bit encryption • PCI DSS Compliant
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
