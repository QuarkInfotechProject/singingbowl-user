"use client";
import React, { useState, useEffect, useRef } from "react";
import { CreditCard, AlertCircle, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

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

import { Suspense } from 'react';

const PaymentPageContent = () => {
    // simple state state
    const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);
    const [sdkLoading, setSdkLoading] = useState(true);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [sessionExpired, setSessionExpired] = useState(false);
    const sdkInitializedRef = useRef(false);

    // Modal state
    const [resultModal, setResultModal] = useState<{
        isOpen: boolean;
        type: 'success' | 'error';
        url: string;
        message?: string;
        data?: any;
    }>({
        isOpen: false,
        type: 'success',
        url: '',
        message: ''
    });

    const { isLoggedIn, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const { cartItems, cartTotal, grandTotal, shippingCharge, couponDiscount } = useCart();

    const GETPAY_SDK_URL = process.env.NEXT_PUBLIC_GETPAY_SDK_URL;

    const searchParams = useSearchParams();
    const orderIdParam = searchParams.get('orderId');




    // DEBUG: Log everything on mount to trace the state
    useEffect(() => {
        const stored = sessionStorage.getItem('paymentConfig');
        console.log("=== PAYMENT PAGE MOUNTED ===");
        console.log("URL Order ID:", orderIdParam);
        console.log("Session Config Raw:", stored);
        if (stored) {
            const parsed = JSON.parse(stored);
            console.log("Session Order ID:", parsed.orderId);
            console.log("Session Timestamp:", parsed._timestamp);
        } else {
            console.error("NO SESSION CONFIG FOUND");
        }
    }, [orderIdParam]);

    // 1. Load Config on Mount & Validate against URL
    useEffect(() => {
        try {
            const stored = sessionStorage.getItem('paymentConfig');
            if (!stored) {
                setSessionExpired(true);
                return;
            }
            const config = JSON.parse(stored);

            // STRICT VALIDATION: URL Order ID must match Session Config Order ID
            // Using loose comparison for robust handling of string vs number
            if (orderIdParam && String(config.orderId) !== String(orderIdParam)) {
                console.error("Order ID Mismatch: Session has", config.orderId, "but URL requested", orderIdParam);
                setSessionExpired(true); // Force expire to prevent paying for wrong order
                return;
            }

            // Check if payment tokens are likely expired (CyberSource JWT expires in ~15 minutes)
            // We use 14 minutes to give a small buffer
            const SESSION_MAX_AGE_MS = 14 * 60 * 1000; // 14 minutes
            if (config._timestamp && (Date.now() - config._timestamp > SESSION_MAX_AGE_MS)) {
                console.warn("Payment session too old, tokens likely expired. Age:",
                    Math.round((Date.now() - config._timestamp) / 1000 / 60), "minutes");
                setSessionExpired(true);
                return;
            }

            setPaymentConfig(config);
        } catch (e) {
            console.error("Config parse error", e);
            setSessionExpired(true);
        }
    }, [orderIdParam]);

    // 2. Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.push("/login?redirect=/checkout");
        }
    }, [isLoggedIn, authLoading, router]);

    // 3. Robust SDK Loading & Initialization
    useEffect(() => {
        if (!paymentConfig || !GETPAY_SDK_URL || sdkInitializedRef.current) return;

        let script: HTMLScriptElement | null = null;
        let isMounted = true;
        let checkInterval: NodeJS.Timeout;

        const initSDK = () => {
            if (!document.getElementById("checkout")) {
                console.warn("Checkout container not found, retrying...");
                return;
            }

            try {
                if (sdkInitializedRef.current) return;

                if (!(window as any).GetPay) {
                    console.log("window.GetPay not ready yet in initSDK");
                    return;
                }

                const getPayOptions = {
                    ...paymentConfig.getPayOptions,
                    containerId: "checkout",
                    isRedirect: false,
                    websiteDomain: window.location.origin,

                    // CRITICAL: Explicitly set callback URLs with current order ID to prevent stale redirects
                    callbackUrl: {
                        successUrl: `${window.location.origin}/api/user/orders/success/getPay/${paymentConfig.orderId}`,
                        failUrl: `${window.location.origin}/checkout/payment-failed?orderId=${paymentConfig.orderId}`
                    },

                    // CRITICAL: Add these missing configurations
                    timeout: 180000, // 3 minutes for bank processing

                    // Handle timeout scenarios (like bank server not responding)
                    onTimeout: (data: any) => {
                        console.error("Payment timeout:", data);
                        const currentParams = new URLSearchParams(window.location.search);
                        const currentOrderId = currentParams.get('orderId');

                        if (currentOrderId && String(paymentConfig.orderId) !== String(currentOrderId)) {
                            console.warn("Ignoring stale timeout callback");
                            return;
                        }

                        setResultModal({
                            isOpen: true,
                            type: 'error',
                            data: data,
                            url: `${window.location.origin}/checkout/payment-failed?orderId=${paymentConfig.orderId}`,
                            message: "Payment timed out. The bank's authentication server didn't respond in time. Please try again."
                        });
                    },

                    // Handle user cancellation
                    onAbort: (data: any) => {
                        console.log("Payment aborted by user:", data);
                        const currentParams = new URLSearchParams(window.location.search);
                        const currentOrderId = currentParams.get('orderId');

                        if (currentOrderId && String(paymentConfig.orderId) !== String(currentOrderId)) {
                            console.warn("Ignoring stale abort callback");
                            return;
                        }

                        setResultModal({
                            isOpen: true,
                            type: 'error',
                            data: data,
                            url: `${window.location.origin}/checkout/payment-failed?orderId=${paymentConfig.orderId}`,
                            message: "Payment was cancelled. You can try again when ready."
                        });
                    },

                    onSuccess: (data: any) => {
                        // IMPORTANT: According to GetPay documentation, this callback fires when
                        // SDK INITIALIZATION succeeds, NOT when payment succeeds.
                        // The actual payment result is delivered via redirect to successUrl/failUrl.
                        // This callback receives the configuration object back.
                        console.log("=== GetPay SDK Initialization Success ===");
                        console.log("SDK initialized successfully. Payment form is ready.");
                        console.log("Config data received:", data);

                        // The SDK has been initialized successfully.
                        // The user will now see the payment form.
                        // After payment completion, GetPay will REDIRECT to:
                        // - successUrl (for successful payments)
                        // - failUrl (for failed/cancelled payments)
                        // We don't need to do anything here except confirm initialization worked.

                        // Note: The actual payment success is handled by:
                        // 1. GetPay redirecting to our successUrl (/api/user/orders/success/getPay/{orderId})
                        // 2. The backend verifying the payment with GetPay
                        // 3. The backend redirecting to /checkout/order-success
                    },

                    onError: (error: any) => {
                        const currentParams = new URLSearchParams(window.location.search);
                        const currentOrderId = currentParams.get('orderId');

                        if (currentOrderId && String(paymentConfig.orderId) !== String(currentOrderId)) {
                            console.warn("Ignoring stale error callback", {
                                configId: paymentConfig.orderId,
                                urlId: currentOrderId
                            });
                            return;
                        }

                        console.error("Error Callback:", error);

                        // Parse error message for user-friendly display
                        let errorMessage = "Payment processing failed.";
                        if (typeof error === 'string') {
                            errorMessage = error;
                        } else if (error?.message) {
                            errorMessage = error.message;
                        } else if (error?.error) {
                            errorMessage = error.error;
                        }

                        // Specific error handling based on error codes
                        if (error?.code === 'BANK_TIMEOUT' || errorMessage.includes('timeout')) {
                            errorMessage = "The bank's server didn't respond in time. Please try again.";
                        } else if (error?.code === 'AUTHENTICATION_FAILED') {
                            errorMessage = "Card authentication failed. Please verify your card details with your bank.";
                        } else if (error?.code === 'INSUFFICIENT_FUNDS') {
                            errorMessage = "Insufficient funds. Please try a different payment method.";
                        }

                        setResultModal({
                            isOpen: true,
                            type: 'error',
                            data: error,
                            url: `${window.location.origin}/checkout/payment-failed?orderId=${paymentConfig.orderId}`,
                            message: errorMessage
                        });
                    }
                };

                console.log("Initializing GetPay with Order ID:", paymentConfig.orderId);
                const getPay = new (window as any).GetPay(getPayOptions);
                getPay.initialize();

                sdkInitializedRef.current = true;
                if (isMounted) setSdkLoading(false);
                if (checkInterval) clearInterval(checkInterval);

            } catch (err: any) {
                console.error("SDK Init Error", err);
                if (isMounted) {
                    setPaymentError("Failed to initialize payment system: " + err.message);
                    setSdkLoading(false);
                }
            }
        };

        const checkAndInit = () => {
            if ((window as any).GetPay) {
                initSDK();
                return true;
            }
            return false;
        };

        const loadScript = () => {
            // Check if script is already present
            const existingScript = document.querySelector(`script[src="${GETPAY_SDK_URL}"]`);

            if (existingScript) {
                console.log("GetPay script already exists. Waiting for global object...");
                // Script exists, just wait for window.GetPay
                if (!checkAndInit()) {
                    checkInterval = setInterval(() => {
                        if (checkAndInit()) clearInterval(checkInterval);
                    }, 500);
                }
            } else {
                console.log("Loading GetPay script...");
                script = document.createElement("script");
                script.src = GETPAY_SDK_URL;
                script.async = true;
                script.onload = () => {
                    console.log("GetPay script loaded. Initializing...");
                    // Small delay to ensure execution
                    setTimeout(() => {
                        if (!checkAndInit()) {
                            // Fallback polling if onload fired but global not ready immediately
                            checkInterval = setInterval(() => {
                                if (checkAndInit()) clearInterval(checkInterval);
                            }, 500);
                        }
                    }, 100);
                };
                script.onerror = () => {
                    if (isMounted) {
                        setPaymentError("Failed to load payment script. Please check your connection.");
                        setSdkLoading(false);
                    }
                };
                document.body.appendChild(script);
            }
        };

        // Start loading
        loadScript();

        // Safety timeout: stop loading if it takes too long
        const safetyTimeout = setTimeout(() => {
            if (isMounted && sdkLoading && !sdkInitializedRef.current) {
                setPaymentError("Payment gateway is taking too long to load.");
                setSdkLoading(false);
            }
        }, 15000); // 15 seconds timeout

        return () => {
            isMounted = false;
            if (checkInterval) clearInterval(checkInterval);
            clearTimeout(safetyTimeout);
            // NOTE: We do NOT remove the script tag anymore to avoid race conditions on quick re-navigation
            // We only clean up the global instance reference if we want to force re-init next time
            if ((window as any).GetPay) {
                // Optional: delete (window as any).GetPay; 
                // Better to leave it and just re-instantiate with 'new'
            }
        };
    }, [paymentConfig, GETPAY_SDK_URL]);

    const handleBackToCheckout = () => {
        sessionStorage.removeItem('paymentConfig');
        router.push('/checkout');
    };

    const handleManualRetry = () => {
        setPaymentError(null);
        setSdkLoading(true);
        sdkInitializedRef.current = false;
        // Trigger re-run of effect by toggling a dummy state or just forcing component update?
        // Actually, since we cleared sdkInitializedRef, if we remount the effect it will run.
        // Simplest way: reload page or just let the user go back.
        // But to stay on page:
        window.location.reload();
    };

    const handleModalConfirm = () => {
        if (resultModal.url && resultModal.url !== "undefined") {
            window.location.href = resultModal.url;
        } else {
            setResultModal(prev => ({ ...prev, isOpen: false }));
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-[#A12717] rounded-full animate-spin" />
            </div>
        );
    }

    if (sessionExpired) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200 max-w-md w-full text-center">
                    <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Session Expired</h2>
                    <p className="text-slate-600 mb-6">Your payment session has expired. Please try checking out again.</p>
                    <Button onClick={handleBackToCheckout} className="bg-[#A12717] hover:bg-[#8a2113] text-white px-8">
                        Back to Checkout
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 relative">
            <div className="mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6">
                    <button onClick={handleBackToCheckout} className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-2 mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Checkout
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900">Complete Your Payment</h1>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Payment Form Area */}
                    <div className="space-y-6">

                        {/* Order Summary (Simplified View) */}
                        <div className="bg-white rounded-xl p-4 border border-slate-200 mb-4 flex justify-between items-center">
                            <div>
                                <span className="text-slate-500 text-sm">Total Amount</span>
                                <div className="text-2xl font-bold text-[#A12717]">${grandTotal.toFixed(2)}</div>
                            </div>
                            <div className="text-sm text-slate-500">Order ID: #{paymentConfig?.orderId}</div>
                        </div>

                        {/* Payment Container */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-blue-600 p-4 text-white flex items-center gap-3">
                                <CreditCard className="w-5 h-5" />
                                <span className="font-semibold">Secure Payment</span>
                            </div>

                            <div className="p-6 relative min-h-[400px]">
                                {sdkLoading && (
                                    <div className="absolute inset-0 bg-white flex flex-col items-center justify-center z-10 transition-opacity duration-300">
                                        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-4" />
                                        <p className="text-slate-500">Loading secure gateway...</p>
                                    </div>
                                )}

                                <div id="checkout" className={sdkLoading ? 'opacity-0' : 'opacity-100'} />

                                {paymentError && (
                                    <div className="absolute inset-0 bg-white flex flex-col items-center justify-center z-20 p-6 text-center">
                                        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Unavailable</h3>
                                        <p className="text-slate-600 mb-6">{paymentError}</p>
                                        <Button onClick={handleManualRetry} variant="outline">
                                            Retry Connection
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Result Modal */}
            <Dialog open={resultModal.isOpen} onOpenChange={(open) => {
                if (!open && resultModal.type === 'error') {
                    setResultModal(prev => ({ ...prev, isOpen: false }));
                }
            }}>
                <DialogContent className="sm:max-w-md text-center">
                    <DialogHeader>
                        <div className="mx-auto mb-4">
                            {resultModal.type === 'success' ? (
                                <CheckCircle2 className="w-12 h-12 text-green-600" />
                            ) : (
                                <XCircle className="w-12 h-12 text-red-600" />
                            )}
                        </div>
                        <DialogTitle className={resultModal.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                            {resultModal.type === 'success' ? 'Payment Successful' : 'Payment Failed'}
                        </DialogTitle>
                        <DialogDescription className="text-left space-y-2">
                            <p>{resultModal.message}</p>
                            {resultModal.type === 'error' && (
                                <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
                                    <p className="font-semibold mb-1">What to do:</p>
                                    <ul className="list-disc list-inside space-y-1 text-xs">
                                        <li>Check your internet connection</li>
                                        <li>Verify your card details with your bank</li>
                                        <li>Try a different payment method</li>
                                        <li>Contact support if the issue persists</li>
                                    </ul>
                                </div>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center flex gap-2">
                        {resultModal.type === 'error' && (
                            <Button
                                onClick={() => {
                                    setResultModal(prev => ({ ...prev, isOpen: false }));
                                    handleManualRetry();
                                }}
                                variant="outline"
                            >
                                Try Again
                            </Button>
                        )}
                        <Button
                            onClick={handleModalConfirm}
                            className={resultModal.type === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                        >
                            {resultModal.type === 'success' ? 'View Order' : 'Back to Checkout'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const PaymentPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-[#A12717] rounded-full animate-spin" />
            </div>
        }>
            <PaymentPageContent />
        </Suspense>
    );
};

export default PaymentPage;
