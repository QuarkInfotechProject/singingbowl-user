"use client";
import React, { useState, useEffect, useRef } from "react";
import { CreditCard, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
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
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [sessionExpired, setSessionExpired] = useState(false);

    const scriptLoadedRef = useRef(false);
    const getpayInitializedRef = useRef(false);

    const { clearCart } = useCart();
    const { isLoggedIn, isLoading: authLoading } = useAuth();
    const router = useRouter();

    // GetPay SDK URL
    const GETPAY_SDK_URL = process.env.NEXT_PUBLIC_GETPAY_SDK_URL;f

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
            // Build the options for GetPay
            const backendCallbackUrl = paymentConfig.getPayOptions.callbackUrl;

            const getPayOptions = {
                ...paymentConfig.getPayOptions,
                containerId: "#checkout",
                successUrl: typeof backendCallbackUrl === 'object' ? backendCallbackUrl.successUrl : backendCallbackUrl,
                failUrl: typeof backendCallbackUrl === 'object' ? backendCallbackUrl.failUrl : undefined,
                callbackUrl: backendCallbackUrl,
                onSuccess: (data: any) => {
                    console.log("Payment success:", data);
                    // Clear the session storage
                    sessionStorage.removeItem('paymentConfig');
                    // Clear cart and show success
                    clearCart();
                    setShowSuccessDialog(true);
                },
                onError: (err: any) => {
                    console.error("Payment error:", err);
                    setPaymentError(`Payment failed: ${err?.message || 'Unknown error'}`);
                    setSdkLoading(false);
                }
            };

            console.log("GetPay options:", getPayOptions);

            // Initialize GetPay - matching the pattern from the working project
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

    // Handle success dialog close
    const handleSuccessClose = () => {
        router.push("/profile?tab=orders");
    };

    // Loading state
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#A12717]" />
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
                        className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-2 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Checkout
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Complete Your Payment</h1>
                    <p className="text-slate-500 mt-2">Enter your card details below to complete the purchase.</p>
                </div>

                {/* Payment Container */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Secure Payment</h2>
                            <p className="text-slate-500 text-sm">Do not close this page until payment is complete.</p>
                        </div>
                    </div>

                    {/* GetPay Payment Container */}
                    <div className="relative" style={{ minHeight: '500px' }}>
                        {sdkLoading && (
                            <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-10 rounded-xl">
                                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                                <p className="text-slate-600 font-medium">Loading payment form...</p>
                                <p className="text-slate-400 text-sm mt-2">Please wait while we connect to the payment gateway</p>
                            </div>
                        )}
                        {/* This is where GetPay SDK will render the payment form */}
                        <div id="checkout" style={{ width: '100%', minHeight: '500px' }}></div>
                    </div>

                    {/* Error Display */}
                    {paymentError && (
                        <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{paymentError}</span>
                        </div>
                    )}
                </div>

                {/* Security Note */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                        <span>🔒</span>
                        Secured by GetPay • Your payment information is encrypted
                    </p>
                </div>
            </div>

            {/* Success Dialog */}
            <Dialog open={showSuccessDialog} onOpenChange={() => { }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-green-600">
                            <span className="text-2xl">🎉</span> Payment Successful!
                        </DialogTitle>
                        <DialogDescription>
                            Your payment has been processed successfully. Your order is now being prepared for shipment.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center">
                        <Button
                            type="button"
                            className="bg-[#A12717] hover:bg-[#8a2113] text-white w-full sm:w-auto px-8"
                            onClick={handleSuccessClose}
                        >
                            View My Orders
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PaymentPage;
