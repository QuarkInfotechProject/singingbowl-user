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

    // Inline styles for GetPay SDK container
    const styles = {
        // Main container wrapper
        paymentWrapper: {
            width: '100%',
            maxWidth: '100%',
            margin: '0 auto',
            padding: '24px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            minHeight: '450px',
        } as React.CSSProperties,

        // SDK container styles - these will be applied to #checkout div
        sdkContainer: {
            width: '100%',
            margin: '0 auto',
            padding: '0',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#1e293b',
        } as React.CSSProperties,

        // Loading overlay styles
        loadingOverlay: {
            position: 'absolute' as const,
            inset: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
            borderRadius: '16px',
            backdropFilter: 'blur(4px)',
        } as React.CSSProperties,

        // Spinner styles
        spinner: {
            width: '56px',
            height: '56px',
            border: '4px solid #e2e8f0',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            marginBottom: '20px',
        } as React.CSSProperties,

        // Loading text styles
        loadingTitle: {
            fontSize: '18px',
            fontWeight: 600,
            color: '#1e293b',
            marginBottom: '8px',
        } as React.CSSProperties,

        loadingSubtext: {
            fontSize: '14px',
            color: '#94a3b8',
        } as React.CSSProperties,
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
                    <div style={{ padding: '24px 32px' }}>
                        {/* Inject CSS for GetPay SDK internal elements */}
                        <style>{`
                            #checkout {
                                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
                            }
                            #checkout iframe {
                                width: 100% !important;
                                min-height: 400px !important;
                                border: none !important;
                                border-radius: 12px !important;
                            }
                            #checkout input,
                            #checkout select {
                                width: 100% !important;
                                padding: 14px 16px !important;
                                border: 2px solid #e2e8f0 !important;
                                border-radius: 10px !important;
                                font-size: 16px !important;
                                background-color: #f8fafc !important;
                                transition: all 0.2s ease !important;
                                outline: none !important;
                            }
                            #checkout input:focus,
                            #checkout select:focus {
                                border-color: #3b82f6 !important;
                                background-color: #ffffff !important;
                                box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1) !important;
                            }
                            #checkout input::placeholder {
                                color: #94a3b8 !important;
                            }
                            #checkout label {
                                display: block !important;
                                font-size: 14px !important;
                                font-weight: 600 !important;
                                color: #334155 !important;
                                margin-bottom: 8px !important;
                            }
                            #checkout button[type="submit"],
                            #checkout .pay-button,
                            #checkout .submit-btn {
                                width: 100% !important;
                                padding: 16px 24px !important;
                                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
                                color: white !important;
                                font-size: 16px !important;
                                font-weight: 700 !important;
                                border: none !important;
                                border-radius: 12px !important;
                                cursor: pointer !important;
                                transition: all 0.3s ease !important;
                                text-transform: uppercase !important;
                                letter-spacing: 0.5px !important;
                                box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4) !important;
                            }
                            #checkout button[type="submit"]:hover,
                            #checkout .pay-button:hover,
                            #checkout .submit-btn:hover {
                                background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%) !important;
                                transform: translateY(-2px) !important;
                                box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5) !important;
                            }
                            #checkout .error,
                            #checkout .error-message {
                                color: #dc2626 !important;
                                font-size: 13px !important;
                                margin-top: 6px !important;
                            }
                            #checkout .form-group,
                            #checkout .field-wrapper {
                                margin-bottom: 20px !important;
                            }

                            @media (min-width: 1500px) {
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
                        `}</style>

                        {/* GetPay Payment Container */}
                        <div style={{ position: 'relative', minHeight: '480px' }}>
                            {sdkLoading && (
                                <div style={styles.loadingOverlay}>
                                    <div
                                        style={styles.spinner}
                                        className="animate-spin"
                                    />
                                    <p style={styles.loadingTitle}>Loading payment form...</p>
                                    <p style={styles.loadingSubtext}>Connecting to secure payment gateway</p>
                                </div>
                            )}
                            {/* This is where GetPay SDK will render the payment form */}
                            <div
                                id="checkout"
                                style={{
                                    ...styles.sdkContainer,
                                    minHeight: '450px',
                                    opacity: sdkLoading ? 0 : 1,
                                    transition: 'opacity 0.3s ease',
                                }}
                            />
                        </div>

                        {/* Error Display */}
                        {paymentError && (
                            <div style={{
                                marginTop: '24px',
                                padding: '16px',
                                backgroundColor: '#fef2f2',
                                borderRadius: '12px',
                                border: '1px solid #fecaca',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                            }}>
                                <AlertCircle style={{ width: '20px', height: '20px', color: '#dc2626', flexShrink: 0, marginTop: '2px' }} />
                                <div>
                                    <p style={{ fontWeight: 600, color: '#b91c1c', marginBottom: '4px' }}>Payment Error</p>
                                    <p style={{ fontSize: '14px', color: '#dc2626' }}>{paymentError}</p>
                                </div>
                            </div>
                        )}

                        {/* Security Features */}
                        <div style={{
                            marginTop: '32px',
                            paddingTop: '24px',
                            borderTop: '1px solid #e2e8f0',
                        }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '16px',
                                textAlign: 'center',
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <span style={{ fontSize: '28px', marginBottom: '8px' }}>🔒</span>
                                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>SSL Encrypted</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <span style={{ fontSize: '28px', marginBottom: '8px' }}>🛡️</span>
                                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Fraud Protection</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <span style={{ fontSize: '28px', marginBottom: '8px' }}>✅</span>
                                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Verified Secure</span>
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
