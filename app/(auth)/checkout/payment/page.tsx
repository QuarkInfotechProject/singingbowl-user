"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { CreditCard, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Script from "next/script";
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
    const [sdkLoaded, setSdkLoaded] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [sessionExpired, setSessionExpired] = useState(false);

    const initAttemptRef = useRef(0);
    const getpayInstanceRef = useRef<any>(null);

    const { clearCart } = useCart();
    const { isLoggedIn, isLoading: authLoading } = useAuth();
    const router = useRouter();

    // GetPay SDK URL
    const GETPAY_SDK_URL = process.env.NEXT_PUBLIC_GETPAY_SDK_URL || "";

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
            setPaymentConfig(config);
        } catch (error) {
            setSessionExpired(true);
            setSdkLoading(false);
        }
    }, []);

    // Initialize GetPay SDK when both config and SDK are ready
    useEffect(() => {
        if (!paymentConfig || !sdkLoaded) return;

        initAttemptRef.current += 1;
        const currentAttempt = initAttemptRef.current;

        const initPayment = () => {
            if (currentAttempt !== initAttemptRef.current) return;

            const container = document.getElementById("checkout");
            if (!container) {
                setTimeout(initPayment, 100);
                return;
            }

            // Wait for GetPay to be available
            if (typeof window.GetPay === 'undefined') {
                setTimeout(initPayment, 100);
                return;
            }

            try {
                container.innerHTML = "";

                // Build the options for GetPay
                const backendCallbackUrl = paymentConfig.getPayOptions.callbackUrl;

                const getPayOptions = {
                    ...paymentConfig.getPayOptions,
                    containerId: "#checkout",
                    // Keep the original websiteDomain from backend (it should match production domain)
                    successUrl: typeof backendCallbackUrl === 'object' ? backendCallbackUrl.successUrl : backendCallbackUrl,
                    failUrl: typeof backendCallbackUrl === 'object' ? backendCallbackUrl.failUrl : undefined,
                    callbackUrl: backendCallbackUrl,
                    onSuccess: (data: any) => {
                        if (data && data.transactionId) {
                            // Clear the session storage
                            sessionStorage.removeItem('paymentConfig');
                            // Clear cart and show success
                            clearCart();
                            setShowSuccessDialog(true);
                        }
                    },
                    onError: (err: any) => {
                        if (err && (err.code || err.message)) {
                            setPaymentError(`Payment failed: ${err.message || 'Unknown error'}`);
                        }
                        setSdkLoading(false);
                    }
                };

                // Initialize GetPay
                const getpay = new window.GetPay(getPayOptions, paymentConfig.getPayOptions.baseUrl);
                getpayInstanceRef.current = getpay;
                getpay.initialize();
                setSdkLoading(false);

            } catch (e: any) {
                setPaymentError(`Failed to initialize payment: ${e.message}`);
                setSdkLoading(false);
            }
        };

        // Start initialization with small delay
        const timeoutId = setTimeout(initPayment, 300);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [paymentConfig, sdkLoaded, clearCart]);

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.push("/login?redirect=/checkout");
        }
    }, [isLoggedIn, authLoading, router]);

    // Handle SDK load
    const handleSdkLoad = () => {
        setSdkLoaded(true);
    };

    const handleSdkError = () => {
        setPaymentError("Failed to load payment SDK. Please refresh the page.");
        setSdkLoading(false);
    };

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
            {/* Load GetPay SDK directly on the page (no iframe) */}
            {GETPAY_SDK_URL && (
                <Script
                    src={GETPAY_SDK_URL}
                    onLoad={handleSdkLoad}
                    onError={handleSdkError}
                    strategy="afterInteractive"
                />
            )}

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
                    <div className="relative">
                        {sdkLoading && (
                            <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-10 rounded-xl">
                                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                                <p className="text-slate-600 font-medium">Loading payment form...</p>
                                <p className="text-slate-400 text-sm mt-2">Please wait while we connect to the payment gateway</p>
                            </div>
                        )}
                        {/* This is where GetPay SDK will render the payment form */}
                        <div
                            id="checkout"
                            className="w-full min-h-[500px] border border-slate-200 rounded-xl p-4"
                        />
                    </div>

                    {/* Error Display */}
                    {paymentError && (
                        <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
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
