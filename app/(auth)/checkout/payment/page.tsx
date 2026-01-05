"use client";
import React, { useState, useEffect } from "react";
import { CreditCard, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Suspense } from 'react';

// GetPay SDK URL - as per docs, just load the script on payment page
const GETPAY_SDK_URL = process.env.NEXT_PUBLIC_GETPAY_SDK_URL || 'https://minio.finpos.global/getpay-cdn/webcheckout/bundle.js';

const PaymentPageContent = () => {
    const [sdkLoaded, setSdkLoaded] = useState(false);
    const [sessionExpired, setSessionExpired] = useState(false);

    const { isLoggedIn, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const { grandTotal } = useCart();

    const searchParams = useSearchParams();
    const orderIdParam = searchParams.get('orderId');

    // Get order ID from sessionStorage for display
    const [displayOrderId, setDisplayOrderId] = useState<string | null>(null);

    // Check session on mount
    useEffect(() => {
        const stored = sessionStorage.getItem('paymentConfig');
        if (!stored) {
            console.error("No payment config found in session");
            setSessionExpired(true);
            return;
        }

        try {
            const config = JSON.parse(stored);
            setDisplayOrderId(config.orderId || orderIdParam);

            // Validate order ID matches
            if (orderIdParam && String(config.orderId) !== String(orderIdParam)) {
                console.error("Order ID mismatch:", config.orderId, "vs", orderIdParam);
                setSessionExpired(true);
            }
        } catch (e) {
            console.error("Failed to parse payment config:", e);
            setSessionExpired(true);
        }
    }, [orderIdParam]);

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.push("/login?redirect=/checkout");
        }
    }, [isLoggedIn, authLoading, router]);

    // Load GetPay SDK script (as per docs - just load script, SDK auto-renders)
    useEffect(() => {
        if (sessionExpired) return;

        console.log("Payment page: Loading GetPay SDK script...");

        // Check if script already exists
        const existingScript = document.querySelector(`script[src="${GETPAY_SDK_URL}"]`);
        if (existingScript) {
            console.log("GetPay script already loaded");
            setSdkLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = GETPAY_SDK_URL;
        script.async = true;
        script.onload = () => {
            console.log('GetPay SDK script loaded on payment page');
            setSdkLoaded(true);
        };
        script.onerror = () => {
            console.error('Failed to load GetPay SDK');
        };
        document.body.appendChild(script);

        return () => {
            // Don't remove script on unmount - SDK needs it
        };
    }, [sessionExpired]);

    // Debug: Check if SDK renders anything
    useEffect(() => {
        if (!sdkLoaded) return;

        const checkForContent = () => {
            const checkoutDiv = document.getElementById('checkout');
            console.log("Payment page: Checking checkout div...");
            console.log("Checkout div exists:", !!checkoutDiv);
            console.log("Checkout div innerHTML length:", checkoutDiv?.innerHTML?.length || 0);

            // Check for iframes
            const iframes = document.querySelectorAll('iframe');
            console.log("Total iframes on page:", iframes.length);
        };

        // Check immediately and after 2 seconds
        setTimeout(checkForContent, 500);
        setTimeout(checkForContent, 2000);
    }, [sdkLoaded]);

    const handleBackToCheckout = () => {
        // Clear session data
        sessionStorage.removeItem('paymentConfig');
        sessionStorage.removeItem('currentOrderId');
        router.push('/checkout');
    };

    // Session Expired State
    if (sessionExpired) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-amber-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Payment Session Expired</h2>
                    <p className="text-slate-600 mb-6">
                        Your payment session has expired or is invalid. Please start a new checkout.
                    </p>
                    <Button
                        onClick={() => router.push('/checkout')}
                        className="bg-[#A12717] hover:bg-[#8a2113] text-white px-8"
                    >
                        Return to Checkout
                    </Button>
                </div>
            </div>
        );
    }

    // Loading state
    if (authLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 relative">
            <div className="mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={handleBackToCheckout}
                        className="flex items-center text-slate-600 hover:text-slate-900 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Checkout
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900">Complete Your Payment</h1>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-6">
                        {/* Order Info */}
                        <div className="bg-white rounded-xl p-4 border border-slate-200 flex justify-between items-center">
                            <div>
                                <p className="text-sm text-slate-500">Total Amount</p>
                                <p className="text-2xl font-bold text-[#A12717]">
                                    ${grandTotal?.toFixed(2) || '0.00'}
                                </p>
                            </div>
                            {displayOrderId && (
                                <p className="text-sm text-slate-500">Order ID: #{displayOrderId}</p>
                            )}
                        </div>

                        {/* Payment Container */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-blue-600 p-4 text-white flex items-center gap-3">
                                <CreditCard className="w-5 h-5" />
                                <span className="font-semibold">Secure Payment</span>
                            </div>

                            <div className="p-6 relative min-h-[400px]">
                                {/* GetPay renders its form into this div automatically */}
                                {/* As per docs: just have this div, SDK auto-populates it */}
                                <div id="checkout"></div>

                                {/* Show loading state until SDK renders */}
                                {!sdkLoaded && (
                                    <div className="absolute inset-0 bg-white flex flex-col items-center justify-center z-10">
                                        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-4" />
                                        <p className="text-slate-500">Loading payment form...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Wrap in Suspense for useSearchParams
const PaymentPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
            </div>
        }>
            <PaymentPageContent />
        </Suspense>
    );
};

export default PaymentPage;
