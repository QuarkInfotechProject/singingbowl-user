"use client";

import { useState, useEffect } from "react";
import { CreditCard, ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Suspense } from 'react';

const GETPAY_SDK_URL = process.env.NEXT_PUBLIC_GETPAY_SDK_URL || 'https://minio.finpos.global/getpay-cdn/webcheckout/bundle.js';

const PaymentPageContent = () => {
    const [sdkLoaded, setSdkLoaded] = useState(false);
    const [sessionExpired, setSessionExpired] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);

    const { isLoggedIn, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const { grandTotal } = useCart();
    const searchParams = useSearchParams();
    const orderIdParam = searchParams.get('orderId');

    useEffect(() => {
        const stored = sessionStorage.getItem('paymentConfig');
        if (!stored) {
            setSessionExpired(true);
            return;
        }

        try {
            const config = JSON.parse(stored);
            setOrderId(config.orderId || orderIdParam);

            if (orderIdParam && String(config.orderId) !== String(orderIdParam)) {
                setSessionExpired(true);
            }
        } catch {
            setSessionExpired(true);
        }
    }, [orderIdParam]);

    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.push("/login?redirect=/checkout");
        }
    }, [isLoggedIn, authLoading, router]);

    useEffect(() => {
        if (sessionExpired) return;

        const loadSdk = () => {
            const existingScript = document.querySelector(`script[src="${GETPAY_SDK_URL}"]`);
            if (existingScript) existingScript.remove();

            const script = document.createElement('script');
            script.src = GETPAY_SDK_URL;
            script.async = true;
            script.onload = () => setSdkLoaded(true);
            document.body.appendChild(script);
        };

        loadSdk();
    }, [sessionExpired]);

    const handleBackToCheckout = () => {
        sessionStorage.removeItem('paymentConfig');
        sessionStorage.removeItem('currentOrderId');
        router.push('/checkout');
    };

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

    if (authLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-2xl mx-auto px-4 py-8">
                <button
                    onClick={handleBackToCheckout}
                    className="flex items-center text-slate-600 hover:text-slate-900 mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Checkout
                </button>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CreditCard className="w-6 h-6" />
                                <span className="text-xl font-bold">Secure Payment</span>
                            </div>
                            {orderId && (
                                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                                    Order #{orderId}
                                </span>
                            )}
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-blue-100">Total Amount</p>
                            <p className="text-3xl font-bold">${grandTotal?.toFixed(2) || '0.00'}</p>
                        </div>
                    </div>

                    <div className="p-6 min-h-[500px] relative">
                        <div id="checkout" className="w-full"></div>

                        {!sdkLoaded && (
                            <div className="absolute inset-0 bg-white flex flex-col items-center justify-center">
                                <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                                <p className="text-slate-500">Loading payment form...</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-400">
                    <span>🔒 SSL Encrypted</span>
                    <span>•</span>
                    <span>Powered by GetPay</span>
                </div>
            </div>
        </div>
    );
};

const PaymentPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        }>
            <PaymentPageContent />
        </Suspense>
    );
};

export default PaymentPage;
