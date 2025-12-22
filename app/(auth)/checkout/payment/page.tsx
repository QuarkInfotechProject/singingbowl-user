"use client";
import React, { useEffect, useState, useRef } from "react";
import { CreditCard, Loader2, ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

// GetPay SDK URL
const GETPAY_SDK_URL = "https://minio.finpos.global/getpay-cdn/webcheckout/v5/bundle.js";

// Utility for safe logging
const safeLog = (label: string, data?: any) => {
    console.log(`[PaymentPage] ${label}`, data !== undefined ? data : "");
};

// Function to load GetPay SDK dynamically
const loadGetPaySDK = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if ((window as any).GetPay) {
            safeLog("GetPay SDK already available");
            resolve();
            return;
        }

        let script = document.getElementById("getpay-sdk") as HTMLScriptElement;
        if (script) {
            const status = script.getAttribute("data-status");
            if (status === "loaded" && (window as any).GetPay) {
                resolve();
                return;
            }
            if (status === "error") {
                script.remove();
            }
        }

        if (!document.getElementById("getpay-sdk")) {
            safeLog("Creating new GetPay script tag...");
            const newScript = document.createElement("script");
            newScript.id = "getpay-sdk";
            newScript.src = GETPAY_SDK_URL;
            newScript.async = true;
            newScript.setAttribute("data-status", "loading");

            newScript.onload = () => {
                newScript.setAttribute("data-status", "loaded");
                safeLog("GetPay Script loaded");
                setTimeout(() => {
                    if ((window as any).GetPay) {
                        resolve();
                    } else {
                        reject(new Error("GetPay global not found after load"));
                    }
                }, 100);
            };

            newScript.onerror = () => {
                newScript.setAttribute("data-status", "error");
                reject(new Error("Failed to load GetPay SDK"));
            };

            document.body.appendChild(newScript);
        }
    });
};

const PaymentPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sdkInitialized, setSdkInitialized] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Get payment config from URL params (base64 encoded)
    const configParam = searchParams.get("config");

    useEffect(() => {
        safeLog("=== PAYMENT PAGE MOUNT ===");
        safeLog("Step 0: useEffect triggered");
        safeLog("Config param present:", !!configParam);

        if (!configParam) {
            safeLog("ERROR: No config param in URL!");
            setError("Missing payment configuration. Please return to checkout.");
            setIsLoading(false);
            return;
        }

        let paymentConfig: any;
        try {
            safeLog("Step 1: Decoding config from URL...");
            const decoded = atob(configParam);
            safeLog("Step 1.1: Base64 decoded, length:", decoded.length);
            paymentConfig = JSON.parse(decoded);
            safeLog("Step 1.2: JSON parsed successfully");
            safeLog("Payment Config:", {
                orderId: paymentConfig.orderId,
                paymentMethod: paymentConfig.paymentMethod,
                hasGetPayOptions: !!paymentConfig.getPayOptions,
                addressUuid: paymentConfig.addressUuid
            });
            if (paymentConfig.getPayOptions) {
                safeLog("GetPay Options:", {
                    baseUrl: paymentConfig.getPayOptions.baseUrl,
                    price: paymentConfig.getPayOptions.price,
                    clientRequestId: paymentConfig.getPayOptions.clientRequestId,
                    hasUserInfo: !!paymentConfig.getPayOptions.userInfo
                });
            }
        } catch (e) {
            safeLog("ERROR: Failed to parse config:", e);
            setError("Invalid payment configuration. Please return to checkout.");
            setIsLoading(false);
            return;
        }

        const initializePayment = async () => {
            try {
                safeLog("Step 2: Loading GetPay SDK...");
                const sdkLoadStart = Date.now();
                await loadGetPaySDK();
                safeLog(`Step 2.1: SDK loaded in ${Date.now() - sdkLoadStart}ms`);

                const GetPay = (window as any).GetPay;
                if (!GetPay) {
                    throw new Error("GetPay SDK not available after load");
                }
                safeLog("Step 2.2: GetPay global confirmed. Type:", typeof GetPay);

                safeLog("Step 3: Checking container...");
                const container = containerRef.current;
                if (!container) {
                    throw new Error("Payment container ref not found");
                }
                safeLog("Step 3.1: Container ref found:", container.id);

                // Clear and prepare container
                container.innerHTML = "";
                container.style.width = "100%";
                container.style.minHeight = "500px";
                safeLog("Step 3.2: Container cleared and sized");

                const origin = "https://www.singingbowlvillagenepal.com";
                safeLog("Step 4: Building GetPay options...");
                safeLog("Origin:", origin);

                const options = {
                    ...paymentConfig.getPayOptions,
                    callbackUrl: {
                        successUrl: `${origin}/api/user/orders/success?paymentMethod=getPay&orderId=${paymentConfig.orderId}&`,
                        failUrl: `${origin}/api/user/orders/payment-fail?orderId=${paymentConfig.orderId}&amount=${paymentConfig.getPayOptions.price}&uuid=${paymentConfig.addressUuid}`
                    },
                    onSuccess: function (data: any) {
                        safeLog("=== onSuccess CALLBACK FIRED ===");
                        safeLog("onSuccess data:", data);
                        safeLog("Has transactionId:", !!data?.transactionId);
                        if (data && data.transactionId) {
                            safeLog("REAL PAYMENT SUCCESS! TransactionId:", data.transactionId);
                            window.location.href = `${origin}/profile?tab=orders&payment=success`;
                        } else {
                            safeLog("Init callback (no transactionId), ignoring...");
                        }
                    },
                    onError: function (err: any) {
                        safeLog("=== onError CALLBACK FIRED ===");
                        safeLog("onError data:", err);
                        if (err && (err.code || err.message)) {
                            safeLog("REAL PAYMENT ERROR:", err.message || err.code);
                            setError(`Payment failed: ${err.message || JSON.stringify(err)}`);
                        } else {
                            safeLog("Init error callback, ignoring...");
                        }
                    }
                };

                safeLog("Step 4.1: Options built");
                safeLog("Callback URLs:", options.callbackUrl);
                safeLog("onSuccess type:", typeof options.onSuccess);
                safeLog("onError type:", typeof options.onError);

                safeLog("Step 5: Creating GetPay instance...");
                const getpay = new GetPay(options, paymentConfig.getPayOptions.baseUrl);
                safeLog("Step 5.1: GetPay instance created");

                safeLog("Step 6: Calling initialize()...");
                getpay.initialize();
                safeLog("Step 6.1: initialize() called successfully");

                setIsLoading(false);
                setSdkInitialized(true);
                safeLog("Step 7: React state updated (isLoading=false, sdkInitialized=true)");

                // Track container content at multiple intervals
                [100, 500, 1000, 2000, 3000, 5000, 10000].forEach((ms) => {
                    setTimeout(() => {
                        const c = document.getElementById("checkout");
                        const len = c?.innerHTML.length || 0;
                        safeLog(`[${ms}ms] Container innerHTML length: ${len}`);
                        if (len === 0) {
                            safeLog(`[${ms}ms] WARNING: Container is EMPTY!`);
                        } else if (len > 0 && len < 100) {
                            safeLog(`[${ms}ms] Container has minimal content:`, c?.innerHTML);
                        }
                    }, ms);
                });

            } catch (err: any) {
                safeLog("=== INITIALIZATION ERROR ===");
                safeLog("Error:", err);
                console.error("Payment initialization error:", err);
                setError(err.message || "Failed to initialize payment. Please try again.");
                setIsLoading(false);
            }
        };

        safeLog("Step 1.5: Starting async initialization...");
        initializePayment();

        return () => {
            safeLog("=== PAYMENT PAGE UNMOUNT ===");
        };
    }, [configParam]);

    const handleBackToCheckout = () => {
        router.push("/checkout");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50">
            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={handleBackToCheckout}
                        className="mb-4 text-slate-600 hover:text-slate-900"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Checkout
                    </Button>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-2">
                            <CreditCard className="w-6 h-6 text-blue-600" />
                            <h1 className="text-2xl font-bold text-slate-900">Secure Payment</h1>
                        </div>
                        <p className="text-slate-500">
                            Complete your payment securely. Do not close this page until payment is complete.
                        </p>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                        <div className="flex items-center gap-3 text-red-600">
                            <AlertTriangle className="w-6 h-6" />
                            <div>
                                <h3 className="font-semibold">Payment Error</h3>
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                        <Button
                            onClick={handleBackToCheckout}
                            className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                        >
                            Return to Checkout
                        </Button>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && !error && (
                    <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                        <p className="text-slate-600 font-medium">Loading payment form...</p>
                        <p className="text-slate-400 text-sm mt-2">Please wait while we connect to the payment gateway</p>
                    </div>
                )}

                {/* Payment Container */}
                <div
                    className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden ${isLoading || error ? 'hidden' : ''}`}
                >
                    <div
                        id="checkout"
                        ref={containerRef}
                        className="w-full min-h-[500px] p-4"
                    />
                </div>

                {/* Security Note */}
                {!error && (
                    <div className="mt-6 text-center">
                        <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                            <span>🔒</span>
                            Secured by GetPay • Your payment information is encrypted
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentPage;
