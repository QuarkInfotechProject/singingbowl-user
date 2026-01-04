"use client";
import React, { useState, useEffect, useRef } from "react";
import { CreditCard, AlertCircle, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
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

    // 1. Load Config on Mount
    useEffect(() => {
        try {
            const stored = sessionStorage.getItem('paymentConfig');
            if (!stored) {
                setSessionExpired(true);
                return;
            }
            const config = JSON.parse(stored);
            setPaymentConfig(config);
        } catch (e) {
            console.error("Config parse error", e);
            setSessionExpired(true);
        }
    }, []);

    // 2. Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.push("/login?redirect=/checkout");
        }
    }, [isLoggedIn, authLoading, router]);

    // 3. Load SDK & Initialize (ONLY when config is ready)
    useEffect(() => {
        if (!paymentConfig || !GETPAY_SDK_URL || sdkInitializedRef.current) return;

        let script: HTMLScriptElement | null = null;
        let isMounted = true;

        const initSDK = () => {
            if (!document.getElementById("checkout")) return;

            try {
                // Prevent re-init
                if (sdkInitializedRef.current) return;

                // Get options
                const getPayOptions = paymentConfig.getPayOptions || {};

                console.log("Initializing GetPay with Order ID:", paymentConfig.orderId);

                // Initialize
                const getPay = new (window as any).GetPay({
                    ...getPayOptions,
                    containerId: "checkout",
                    isRedirect: false,
                    websiteDomain: window.location.origin,
                    // Ensure top-level fields
                    orderId: paymentConfig.orderId,
                    paymentMethod: paymentConfig.paymentMethod,

                    onSuccess: (data: any) => {
                        // Filter out init echoes
                        if (!data.token && !data.id && !data.status) return;

                        console.log("Success Callback:", data);
                        setResultModal({
                            isOpen: true,
                            type: 'success',
                            data: data,
                            // Use the ID from config directly - simplest source of truth
                            url: `${window.location.origin}/checkout/order-success?orderId=${paymentConfig.orderId}`,
                            message: "Payment verified successfully!"
                        });
                    },
                    onError: (error: any) => {
                        console.error("Error Callback:", error);
                        setResultModal({
                            isOpen: true,
                            type: 'error',
                            data: error,
                            url: `${window.location.origin}/checkout/payment-failed?orderId=${paymentConfig.orderId}`,
                            message: typeof error === 'string' ? error : (error.message || "Payment processing failed.")
                        });
                    }
                });

                getPay.initialize();
                sdkInitializedRef.current = true; // Mark as done
                if (isMounted) setSdkLoading(false);

            } catch (err: any) {
                console.error("SDK Init Error", err);
                if (isMounted) {
                    setPaymentError("Failed to initialize payment system: " + err.message);
                    setSdkLoading(false);
                }
            }
        };

        const loadScript = () => {
            // FORCE CLEANUP: Remove any existing scripts to prevent stale state
            const existingScripts = document.querySelectorAll(`script[src="${GETPAY_SDK_URL}"]`);
            existingScripts.forEach(s => s.remove());

            // Delete existing global instance
            if ((window as any).GetPay) {
                // @ts-ignore
                delete (window as any).GetPay;
            }

            script = document.createElement("script");
            script.src = GETPAY_SDK_URL;
            script.async = true;
            script.onload = () => {
                setTimeout(initSDK, 100);
            };
            script.onerror = () => {
                if (isMounted) {
                    setPaymentError("Failed to load payment script");
                    setSdkLoading(false);
                }
            };
            document.body.appendChild(script);
        };

        loadScript();

        return () => {
            isMounted = false;
            // Cleanup script on unmount
            const existingScripts = document.querySelectorAll(`script[src="${GETPAY_SDK_URL}"]`);
            existingScripts.forEach(s => s.remove());
            if ((window as any).GetPay) {
                // @ts-ignore
                delete (window as any).GetPay;
            }
        };
    }, [paymentConfig, GETPAY_SDK_URL]);

    const handleBackToCheckout = () => {
        sessionStorage.removeItem('paymentConfig');
        router.push('/checkout');
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
                                    <div className="absolute inset-0 bg-white flex flex-col items-center justify-center z-10">
                                        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-4" />
                                        <p className="text-slate-500">Loading secure gateway...</p>
                                    </div>
                                )}

                                <div id="checkout" className={sdkLoading ? 'opacity-0' : 'opacity-100'} />

                                {paymentError && (
                                    <div className="mt-4 p-4 bg-red-50 text-red-700 rounded border border-red-200">
                                        {paymentError}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Result Modal */}
            <Dialog open={resultModal.isOpen} onOpenChange={(open) => !open && resultModal.type === 'error' && setResultModal(prev => ({ ...prev, isOpen: false }))}>
                <DialogContent className="sm:max-w-md text-center">
                    <DialogHeader>
                        <div className="mx-auto mb-4">
                            {resultModal.type === 'success' ? <CheckCircle2 className="w-12 h-12 text-green-600" /> : <XCircle className="w-12 h-12 text-red-600" />}
                        </div>
                        <DialogTitle className={resultModal.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                            {resultModal.type === 'success' ? 'Payment Successful' : 'Payment Failed'}
                        </DialogTitle>
                        <DialogDescription>{resultModal.message}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center">
                        <Button onClick={handleModalConfirm} className={resultModal.type === 'success' ? 'bg-green-600' : 'bg-red-600'}>
                            {resultModal.type === 'success' ? 'Continue' : 'Close'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PaymentPage;
