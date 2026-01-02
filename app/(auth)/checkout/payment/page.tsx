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
            // Safely access getPayOptions
            const getPayOptionsFromConfig = paymentConfig.getPayOptions || {};
            const backendCallbackUrl = getPayOptionsFromConfig.callbackUrl;

            // Safely extract success and fail URLs from the callback config
            let successUrl: string | undefined;
            let failUrl: string | undefined;

            if (backendCallbackUrl) {
                if (typeof backendCallbackUrl === 'object' && backendCallbackUrl !== null) {
                    successUrl = backendCallbackUrl.successUrl;
                    failUrl = backendCallbackUrl.failUrl;
                } else if (typeof backendCallbackUrl === 'string') {
                    successUrl = backendCallbackUrl;
                }
            }

            // If no callback URLs are available, log warning but continue
            if (!successUrl) {
                console.warn("No successUrl found in payment config, SDK may handle callbacks internally");
            }

            const getPayOptions: Record<string, any> = {
                ...getPayOptionsFromConfig,
                containerId: "#checkout",
            };

            // Only add URLs if they exist
            if (successUrl) {
                getPayOptions.successUrl = successUrl;
            }
            if (failUrl) {
                getPayOptions.failUrl = failUrl;
            }

            // Remove any existing callbacks that might have been spread from paymentConfig
            delete getPayOptions.onSuccess;
            delete getPayOptions.onError;
            delete getPayOptions.callbackUrl;

            console.log("GetPay options:", getPayOptions);

            // Initialize GetPay
            const baseUrl = getPayOptionsFromConfig.baseUrl;
            const getpay = new window.GetPay(getPayOptions, baseUrl);
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
            <div className="max-w-2xl mx-auto px-4 py-8">
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

                {/* Status Banner */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                    <span className="text-xl">⏳</span>
                    <div>
                        <h3 className="font-semibold text-amber-800">Payment Pending</h3>
                        <p className="text-amber-700 text-sm">
                            Your order is reserved. Complete the payment below to confirm.
                        </p>
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
                        {/* Clean CSS for GetPay SDK */}
                        <style>{`
                            #checkout {
                                font-family: system-ui, -apple-system, sans-serif;
                                width: 100%;
                            }
                            #checkout iframe {
                                width: 100% !important;
                                min-height: 400px;
                                border: none;
                            }
                            #checkout input,
                            #checkout select {
                                width: 100%;
                                padding: 12px 14px;
                                border: 1px solid #e2e8f0;
                                border-radius: 8px;
                                font-size: 16px;
                                background: #fff;
                                margin-bottom: 4px;
                            }
                            #checkout input:focus,
                            #checkout select:focus {
                                outline: none;
                                border-color: #3b82f6;
                                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                            }
                            #checkout label {
                                display: block;
                                font-size: 14px;
                                font-weight: 500;
                                color: #374151;
                                margin-bottom: 6px;
                            }
                            #checkout button[type="submit"],
                            #checkout .pay-button,
                            #checkout .submit-btn {
                                width: 100%;
                                padding: 14px 20px;
                                background: #3b82f6;
                                color: white;
                                font-size: 16px;
                                font-weight: 600;
                                border: none;
                                border-radius: 8px;
                                cursor: pointer;
                                margin-top: 16px;
                            }
                            #checkout button[type="submit"]:hover,
                            #checkout .pay-button:hover,
                            #checkout .submit-btn:hover {
                                background: #2563eb;
                            }
                            #checkout .error,
                            #checkout .error-message {
                                color: #dc2626;
                                font-size: 13px;
                                margin-top: 4px;
                            }
                            #checkout .form-group,
                            #checkout .field-wrapper {
                                margin-bottom: 16px;
                            }
                        `}</style>

                        {/* GetPay Container */}
                        <div className="relative min-h-[400px]">
                            {sdkLoading && (
                                <div className="absolute inset-0 bg-white flex flex-col items-center justify-center z-10">
                                    <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-4" />
                                    <p className="text-slate-700 font-medium">Loading payment form...</p>
                                    <p className="text-slate-400 text-sm">Connecting to secure gateway</p>
                                </div>
                            )}
                            <div
                                id="checkout"
                                className={`min-h-[400px] transition-opacity duration-300 ${sdkLoading ? 'opacity-0' : 'opacity-100'}`}
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

                {/* Footer */}
                <p className="text-center text-xs text-slate-400 mt-6">
                    🔐 Secured by GetPay • 256-bit encryption • PCI DSS Compliant
                </p>
            </div>
        </div>
    );
};

export default PaymentPage;
