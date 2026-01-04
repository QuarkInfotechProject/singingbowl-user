"use client";
import React, { Suspense, useEffect, useState } from "react";
import { XCircle, ArrowLeft, RefreshCw, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

const PaymentFailedContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [orderId, setOrderId] = useState<string | null>(null);
    const [errorReason, setErrorReason] = useState<string | null>(null);

    useEffect(() => {
        // Get error details from URL params
        setOrderId(searchParams.get("orderId"));
        setErrorReason(searchParams.get("reason"));
    }, [searchParams]);

    const handleRetryPayment = () => {
        router.push("/checkout");
    };

    const handleBackToCart = () => {
        router.push("/cart");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-slate-50 to-red-50 flex items-center justify-center p-4">
            <div className="max-w-lg w-full">
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 text-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <XCircle className="w-12 h-12 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Payment Failed</h1>
                        <p className="text-red-100">
                            We couldn't process your payment
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Error Message */}
                        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                            <p className="text-red-800 text-sm">
                                {errorReason || "Your payment could not be completed. This could be due to insufficient funds, incorrect card details, or a temporary issue with your payment provider."}
                            </p>
                        </div>

                        {/* Order Info */}
                        {orderId && (
                            <div className="bg-slate-50 rounded-xl p-4">
                                <p className="text-sm text-slate-500 mb-1">Order Reference</p>
                                <p className="font-mono font-semibold text-slate-900">#{orderId}</p>
                            </div>
                        )}

                        {/* What to do next */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-slate-900">What you can do:</h3>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 mt-0.5">•</span>
                                    <span>Check your card details and try again</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 mt-0.5">•</span>
                                    <span>Ensure you have sufficient funds in your account</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 mt-0.5">•</span>
                                    <span>Try a different payment method</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 mt-0.5">•</span>
                                    <span>Contact your bank if the issue persists</span>
                                </li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 pt-2">
                            <Button
                                onClick={handleRetryPayment}
                                className="w-full bg-[#A12717] hover:bg-[#8a2113] text-white py-6 text-base font-semibold"
                            >
                                <RefreshCw className="w-5 h-5 mr-2" />
                                Try Again
                            </Button>
                            <Button
                                onClick={handleBackToCart}
                                variant="outline"
                                className="w-full py-6 text-base border-slate-300"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Back to Cart
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Help Section */}
                <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                    <h3 className="font-semibold text-slate-900 mb-3">Need Help?</h3>
                    <div className="space-y-2">
                        <a
                            href="mailto:support@singingbowlvillage.com"
                            className="flex items-center gap-3 text-sm text-slate-600 hover:text-[#A12717] transition-colors"
                        >
                            <Mail className="w-4 h-4" />
                            support@singingbowlvillage.com
                        </a>
                        <a
                            href="tel:+9771234567890"
                            className="flex items-center gap-3 text-sm text-slate-600 hover:text-[#A12717] transition-colors"
                        >
                            <Phone className="w-4 h-4" />
                            +977 1234567890
                        </a>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center text-xs text-slate-400 mt-6">
                    Your cart items are still saved. No amount has been deducted from your account.
                </p>
            </div>
        </div>
    );
};

// Loading fallback for Suspense
const LoadingFallback = () => (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-slate-50 to-red-50 flex items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-red-200 border-t-red-500 rounded-full animate-spin" />
    </div>
);

const PaymentFailedPage = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <PaymentFailedContent />
        </Suspense>
    );
};

export default PaymentFailedPage;
