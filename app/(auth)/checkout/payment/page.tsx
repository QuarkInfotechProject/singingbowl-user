"use client";
import React, { useState, useEffect, useRef } from "react";
import { CreditCard, ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Suspense } from 'react';

const GETPAY_SDK_URL = process.env.NEXT_PUBLIC_GETPAY_SDK_URL || 'https://minio.finpos.global/getpay-cdn/webcheckout/bundle.js';

const PaymentPageContent = () => {
    const [sdkStatus, setSdkStatus] = useState<'loading' | 'ready' | 'initializing' | 'success' | 'error'>('loading');
    const [sessionExpired, setSessionExpired] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [orderId, setOrderId] = useState<string | null>(null);
    const hasInitializedRef = useRef(false);

    const { isLoggedIn, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const { grandTotal } = useCart();
    const searchParams = useSearchParams();
    const orderIdParam = searchParams.get('orderId');

    // 1. Validate Session
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

    // 2. Auth Check
    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.push("/login?redirect=/checkout");
        }
    }, [isLoggedIn, authLoading, router]);

    // 3. Load SDK & Initialize
    useEffect(() => {
        if (sessionExpired || hasInitializedRef.current || !orderId) return;

        // Function to actually run the initialization
        const runInitialization = async () => {
            hasInitializedRef.current = true;
            setSdkStatus('initializing');
            console.log('PaymentPage: Starting initialization...');

            try {
                // Wait for SDK script to load
                await new Promise<void>((resolve, reject) => {
                    const existingScript = document.querySelector(`script[src="${GETPAY_SDK_URL}"]`);
                    if (existingScript) {
                        console.log('PaymentPage: Script already exists');
                        resolve();
                        return;
                    }

                    const script = document.createElement('script');
                    script.src = GETPAY_SDK_URL;
                    script.async = true;
                    script.onload = () => {
                        console.log('PaymentPage: Script loaded');
                        resolve();
                    };
                    script.onerror = () => reject(new Error('Failed to load payment SDK'));
                    document.body.appendChild(script);
                });

                // Wait for GetPay object
                await new Promise<void>((resolve, reject) => {
                    let attempts = 0;
                    const check = () => {
                        if ((window as any).GetPay) resolve();
                        else if (attempts > 50) reject(new Error('GetPay SDK failed to initialize'));
                        else {
                            attempts++;
                            setTimeout(check, 100);
                        }
                    };
                    check();
                });
                console.log('PaymentPage: GetPay object found');

                // Initialize GetPay
                const storedConfig = sessionStorage.getItem('paymentConfig');
                const config = JSON.parse(storedConfig || '{}');
                const isSdkInitialized = sessionStorage.getItem('sdkInitialized') === 'true';

                console.log(`PaymentPage: Init status [Initialized=${isSdkInitialized}]`);

                const getPayOptions = {
                    ...config.getPayOptions,
                    websiteDomain: window.location.origin,
                    callbackUrl: {
                        successUrl: `${window.location.origin}/api/user/orders/success/getPay/${config.orderId}`,
                        failUrl: `${window.location.origin}/checkout/payment-failed?orderId=${config.orderId}`
                    },
                    onSuccess: (data: any) => {
                        console.log('PaymentPage: onSuccess fired', data);
                        setSdkStatus('success');

                        // Strategy: Reload SDK script to force auto-render
                        console.log('PaymentPage: Reloading SDK script to trigger auto-render...');

                        const oldScript = document.querySelector(`script[src="${GETPAY_SDK_URL}"]`);
                        if (oldScript) {
                            oldScript.remove();
                            console.log('PaymentPage: Old script removed');
                        }

                        // Re-add script
                        const script = document.createElement('script');
                        script.src = GETPAY_SDK_URL;
                        script.async = true;
                        script.onload = () => console.log('PaymentPage: SDK script reloaded');
                        document.body.appendChild(script);
                    },
                    onError: (error: any) => {
                        console.error('PaymentPage: onError fired:', error);
                        setErrorMessage(error?.error || error?.message || 'Payment initialization failed');
                        setSdkStatus('error');
                    }
                };

                console.log('PaymentPage: Calling initialize()');
                try {
                    const getPay = new (window as any).GetPay(getPayOptions);
                    getPay.initialize();
                } catch (e) {
                    console.error('PaymentPage: CRITICAL - initialize() threw error:', e);
                }

                // Poll for changes in the #checkout div
                let checks = 0;
                const interval = setInterval(() => {
                    checks++;
                    const div = document.getElementById('checkout');
                    if (div) {
                        console.log(`PaymentPage [${checks * 0.5}s]:`, {
                            innerHTML: div.innerHTML.length,
                            children: div.children.length,
                            display: window.getComputedStyle(div).display
                        });

                        if (div.children.length > 0 || div.innerHTML.length > 0) {
                            console.log('PaymentPage: Content generated! Stopping checks.');
                            clearInterval(interval);
                        }
                    }
                    if (checks >= 10) clearInterval(interval);
                }, 500);

            } catch (error: any) {
                console.error('Initialization failed:', error);
                setErrorMessage(error.message);
                setSdkStatus('error');
            }
        };

        runInitialization();

    }, [sessionExpired, orderId]);

    const handleBackToCheckout = () => {
        sessionStorage.removeItem('paymentConfig');
        sessionStorage.removeItem('currentOrderId');
        sessionStorage.removeItem('sdkInitialized');
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
                        {/* Always visible div for SDK to render into */}
                        <div id="checkout" className="w-full"></div>

                        {(sdkStatus === 'loading' || sdkStatus === 'initializing') && (
                            <div className="absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center">
                                <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                                <p className="text-slate-500">Loading secure payment form...</p>
                            </div>
                        )}

                        {sdkStatus === 'error' && (
                            <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center text-center p-6">
                                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Payment Error</h3>
                                <p className="text-slate-600 mb-6">{errorMessage}</p>
                                <Button onClick={handleBackToCheckout} variant="outline">Try Again</Button>
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
