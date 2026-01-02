"use client";
import React, { useState, useEffect, useRef } from "react";
import { CreditCard, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle2, XCircle } from "lucide-react";

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

    // Payment Result Modal State
    const styles = `   
    
    @media (min-width: 1000px) {
        .parent-div.svelte-1i24pqq {
            padding: 2rem 4rem;
            display: grid;
            grid-template-columns: 1fr;
            grid-column-gap: 0px;
            grid-row-gap: 0px;
            grid-template-areas:
            "order summary"
            "information payment";
        }
    }
`;
    const [resultModal, setResultModal] = useState<{
        isOpen: boolean;
        type: 'success' | 'error';
        url: string;
        message?: string;
    }>({
        isOpen: false,
        type: 'success',
        url: '',
        message: ''
    });

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

    // Load payment config and check for preserved logs
    useEffect(() => {
        // preserve logs check
        const lastEvent = sessionStorage.getItem('lastGetPayEvent');
        if (lastEvent) {
            try {
                const parsed = JSON.parse(lastEvent);
                console.group("👉 PRESERVED GETPAY LOGS 👈");
                console.log(`Type: ${parsed.type}`);
                console.log("Data:", parsed.data);
                console.groupEnd();
                // sessionStorage.removeItem('lastGetPayEvent'); // Optional: Keep it until success?
            } catch (e) {
                console.error("Error parsing preserved logs", e);
            }
        }

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

            // Safe URL extraction - Check root properties first
            let successUrl = getPayOptionsFromConfig.successUrl;
            let failUrl = getPayOptionsFromConfig.failUrl;

            // Check callbackUrl structure if root properties are missing
            if (backendCallbackUrl) {
                if (typeof backendCallbackUrl === 'object' && backendCallbackUrl !== null) {
                    successUrl = successUrl || backendCallbackUrl.successUrl;
                    failUrl = failUrl || backendCallbackUrl.failUrl;
                } else if (typeof backendCallbackUrl === 'string') {
                    // IF callbackUrl is a string, it is typically the success URL
                    successUrl = successUrl || backendCallbackUrl;
                }
            }

            // Default fallbacks only if absolutely nothing was found
            if (!successUrl) {
                console.warn("No successUrl found in config. Using fallback.");
                successUrl = "https://www.singingbowlvillagenepal.com/checkout";
            }
            if (!failUrl) {
                failUrl = "https://www.singingbowlvillagenepal.com/checkout?error=failed";
            }

            const getPayOptions: Record<string, any> = {
                ...getPayOptionsFromConfig,
                containerId: "#checkout",
                successUrl: successUrl,
                failUrl: failUrl,
                onSuccess: (data: any) => {
                    console.log("GetPay Success Callback:", data);

                    // Persist log for debugging
                    sessionStorage.setItem('lastGetPayEvent', JSON.stringify({
                        type: 'SUCCESS',
                        timestamp: new Date().toISOString(),
                        data: data
                    }));

                    // Improved Success Check:
                    // The "config echo" usually contains 'containerId' or 'businessName'.
                    // Real success payload should NOT have these, or should have transaction details.
                    // We simply check if it's NOT just the config.
                    const isConfigEcho = data && (data.containerId || (data.getPayOptions && data.getPayOptions.containerId));

                    if (!isConfigEcho || (data.transactionId || data.status === 'SUCCESS')) {
                        console.log("Valid payment success detected. Showing popup...", successUrl);
                        setResultModal({
                            isOpen: true,
                            type: 'success',
                            url: successUrl,
                            message: "Your payment has been successfully processed."
                        });
                    } else {
                        console.warn("Premature/Invalid success callback (Config Echo). Ignoring.", data);
                    }
                },
                onError: (error: any) => {
                    console.error("GetPay Error Callback:", error);

                    // Persist log for debugging
                    sessionStorage.setItem('lastGetPayEvent', JSON.stringify({
                        type: 'ERROR',
                        timestamp: new Date().toISOString(),
                        error: error
                    }));

                    let retMsg = "There was an issue processing your payment.";
                    if (typeof error === 'string') retMsg = error;
                    else if (error?.message) retMsg = error.message;
                    else if (error?.data?.message) retMsg = error.data.message;

                    // Trigger Failure Popup
                    setResultModal({
                        isOpen: true,
                        type: 'error',
                        url: failUrl,
                        message: `${retMsg} (If amount was deducted, please contact support)`
                    });
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

    // Handle Modal Confirmation
    const handleModalConfirm = () => {
        if (resultModal.type === 'success') {
            window.location.href = resultModal.url;
        } else {
            // For error, maybe just close modal to let them retry, or redirect to fail URL?
            // Usually simpler to just close and let them retry the form if possible,
            // but GetPay iframe might need reload. Let's redirect to failUrl if provided, else close.
            if (resultModal.url && resultModal.url !== "undefined") {
                window.location.href = resultModal.url;
            } else {
                setResultModal(prev => ({ ...prev, isOpen: false }));
                // REMOVED window.location.reload() to preserve console logs for debugging
                console.log("Modal closed. Page not reloaded to preserve logs.");
            }
        }
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
        <div className="min-h-screen bg-slate-50 relative">
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

                        <div className="flex max-w-7xl items-start justify-between">

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
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ml-8 flex-1">
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

            {/* Success/Failure Modal */}
            <Dialog open={resultModal.isOpen} onOpenChange={(open) => {
                if (!open && resultModal.type === 'error') {
                    // Allow closing only on error
                    setResultModal(prev => ({ ...prev, isOpen: false }));
                }
            }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="flex flex-col items-center text-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${resultModal.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                            {resultModal.type === 'success' ? (
                                <CheckCircle2 className="w-8 h-8" />
                            ) : (
                                <XCircle className="w-8 h-8" />
                            )}
                        </div>
                        <DialogTitle className={`text-xl ${resultModal.type === 'success' ? 'text-green-700' : 'text-red-700'
                            }`}>
                            {resultModal.type === 'success' ? 'Payment Successful!' : 'Payment Failed'}
                        </DialogTitle>
                        <DialogDescription className="text-center pt-2">
                            {resultModal.message}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center w-full">
                        <Button
                            className={`w-full max-w-[200px] ${resultModal.type === 'success'
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-red-600 hover:bg-red-700'
                                }`}
                            onClick={handleModalConfirm}
                        >
                            {resultModal.type === 'success' ? 'Continue' : 'Close'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PaymentPage;
