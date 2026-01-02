"use client";
import React, { useState, useEffect, useRef } from "react";
import { CreditCard, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// Declare GetPay as global
declare global {
    interface Window {
        GetPay: any;
    }
}

interface PaymentConfig {
    getPayOptions: {
        baseUrl: string;
        containerId: string;
        callbackUrl: string | { successUrl: string; failUrl: string };
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
        if (scriptLoadedRef.current) return;
        if (!GETPAY_SDK_URL) {
            setPaymentError("Payment SDK URL is not configured. Please contact support.");
            setSdkLoading(false);
            return;
        }

        const script = document.createElement('script');
        script.src = GETPAY_SDK_URL;
        script.async = true;

        script.onload = () => {
            console.log("GetPay SDK script loaded");
            scriptLoadedRef.current = true;

            // Wait a bit for SDK to initialize its global object
            setTimeout(() => {
                initializeGetPay();
            }, 300);
        };

        script.onerror = () => {
            console.error('Failed to load GetPay script');
            setPaymentError("Failed to load payment SDK. Please refresh the page.");
            setSdkLoading(false);
        };

        document.body.appendChild(script);

        return () => {
            // Clean up script on component unmount
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
            scriptLoadedRef.current = false;
            getpayInitializedRef.current = false;
        };
    }, [paymentConfig, GETPAY_SDK_URL]);

    // Initialize GetPay checkout
    const initializeGetPay = () => {
        if (getpayInitializedRef.current) return;
        if (!paymentConfig) return;

        // Check if GetPay is available
        if (typeof window.GetPay === 'undefined') {
            console.log("GetPay not available yet, retrying...");
            setTimeout(initializeGetPay, 200);
            return;
        }

        const container = document.getElementById("checkout");
        if (!container) {
            console.log("Container not found, retrying...");
            setTimeout(initializeGetPay, 200);
            return;
        }

        console.log("Initializing GetPay...");
        getpayInitializedRef.current = true;

        try {
            const backendCallbackUrl = paymentConfig.getPayOptions.callbackUrl;

            // Extract success and fail URLs from the callback config
            const successUrl = typeof backendCallbackUrl === 'object'
                ? backendCallbackUrl.successUrl
                : backendCallbackUrl;
            const failUrl = typeof backendCallbackUrl === 'object'
                ? backendCallbackUrl.failUrl
                : undefined;

            const getPayOptions = {
                ...paymentConfig.getPayOptions,
                containerId: "#checkout",
                successUrl: successUrl,
                failUrl: failUrl,
                // Remove onSuccess/onError callbacks - they cause immediate triggering
                // The backend handles success/fail via URL redirects
            };

            // Remove any existing callbacks that might have been spread from paymentConfig
            delete (getPayOptions as any).onSuccess;
            delete (getPayOptions as any).onError;
            delete (getPayOptions as any).callbackUrl; // Use successUrl/failUrl instead

            console.log("GetPay options:", getPayOptions);

            // Initialize GetPay
            const getpay = new window.GetPay(getPayOptions, paymentConfig.getPayOptions.baseUrl);
            getpay.initialize();

            console.log("GetPay initialized successfully");
            setSdkLoading(false);

        } catch (e: any) {
            console.error("GetPay initialization error:", e);
            setPaymentError(`Failed to initialize payment: ${e.message}`);
            setSdkLoading(false);
            getpayInitializedRef.current = false;
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-[#A12717] rounded-full animate-spin" />
            </div>
        );
    }

    // Session expired state
    if (sessionExpired) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 max-w-md text-center">
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50">
            <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={handleBackToCheckout}
                        className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-2 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Checkout
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Complete Your Payment</h1>
                    <p className="text-slate-500 mt-2">Enter your card details below to finalize your order.</p>
                </div>

                {/* Order Status Info Banner */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">⏳</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-amber-800">Payment Pending</h3>
                        <p className="text-amber-700 text-sm">
                            Your order is reserved and waiting for payment. Please complete the payment below to confirm your order.
                        </p>
                    </div>
                </div>

                {/* Payment Container */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                    {/* Payment Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Secure Card Payment</h2>
                                <p className="text-blue-100 text-sm">Your payment information is encrypted and secure</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form Area */}
                    <div className="p-6 md:p-8">
                        {/* GetPay Payment Container */}
                        <div className="relative" style={{ minHeight: '480px' }}>
                            {sdkLoading && (
                                <div className="absolute inset-0 bg-white flex flex-col items-center justify-center z-10 rounded-xl">
                                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                                    <p className="text-slate-700 font-medium text-lg">Loading payment form...</p>
                                    <p className="text-slate-400 text-sm mt-2">Connecting to secure payment gateway</p>
                                </div>
                            )}
                            {/* This is where GetPay SDK will render the payment form */}
                            <div
                                id="checkout"
                                className="w-full transition-opacity duration-300"
                                style={{
                                    minHeight: '450px',
                                    opacity: sdkLoading ? 0 : 1
                                }}
                            />
                        </div>

                        {/* Error Display */}
                        {paymentError && (
                            <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium">Payment Error</p>
                                    <p className="text-sm text-red-600">{paymentError}</p>
                                </div>
                            </div>
                        )}

                        {/* Security Features */}
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="flex flex-col items-center">
                                    <span className="text-2xl mb-1">🔒</span>
                                    <span className="text-xs text-slate-500">SSL Encrypted</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-2xl mb-1">🛡️</span>
                                    <span className="text-xs text-slate-500">Fraud Protection</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-2xl mb-1">✅</span>
                                    <span className="text-xs text-slate-500">Verified Secure</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Security Note */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-400 flex items-center justify-center gap-2">
                        <span>�</span>
                        Secured by GetPay • 256-bit encryption • PCI DSS Compliant
                    </p>
                </div>
            </div>


        </div>
    );
};

export default PaymentPage;
