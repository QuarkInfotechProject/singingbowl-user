"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle2, Package, ArrowRight, Home, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const OrderSuccessPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [orderId, setOrderId] = useState<string | null>(null);
    const { clearCart } = useCart();

    useEffect(() => {
        // Get order ID from URL params
        setOrderId(searchParams.get("orderId"));

        // Clear the cart after successful payment
        clearCart();

        // Clear payment config from session storage
        sessionStorage.removeItem('paymentConfig');
        sessionStorage.removeItem('lastGetPayEvent');
    }, [searchParams, clearCart]);

    const handleViewOrders = () => {
        router.push("/profile?tab=orders");
    };

    const handleContinueShopping = () => {
        router.push("/products");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-slate-50 to-emerald-50 flex items-center justify-center p-4">
            <div className="max-w-lg w-full">
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <CheckCircle2 className="w-12 h-12 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Order Successful!</h1>
                        <p className="text-green-100">
                            Thank you for your purchase
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Success Message */}
                        <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                            <p className="text-green-800 text-sm">
                                Your payment has been processed successfully. We've sent a confirmation email with your order details.
                            </p>
                        </div>

                        {/* Order Info */}
                        {orderId && (
                            <div className="bg-slate-50 rounded-xl p-4 text-center">
                                <p className="text-sm text-slate-500 mb-1">Order Number</p>
                                <p className="font-mono text-xl font-bold text-slate-900">#{orderId}</p>
                            </div>
                        )}

                        {/* What happens next */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-slate-900">What happens next?</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-green-600 text-sm font-bold">1</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 text-sm">Order Confirmation</p>
                                        <p className="text-xs text-slate-500">You'll receive an email confirmation shortly</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-green-600 text-sm font-bold">2</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 text-sm">Processing</p>
                                        <p className="text-xs text-slate-500">We'll prepare your order for shipping</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-green-600 text-sm font-bold">3</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 text-sm">Shipped</p>
                                        <p className="text-xs text-slate-500">You'll receive tracking information via email</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 pt-2">
                            <Button
                                onClick={handleViewOrders}
                                className="w-full bg-[#A12717] hover:bg-[#8a2113] text-white py-6 text-base font-semibold"
                            >
                                <Package className="w-5 h-5 mr-2" />
                                View My Orders
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                            <Button
                                onClick={handleContinueShopping}
                                variant="outline"
                                className="w-full py-6 text-base border-slate-300"
                            >
                                <ShoppingBag className="w-5 h-5 mr-2" />
                                Continue Shopping
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center text-xs text-slate-400 mt-6">
                    🛡️ Your payment is secure and protected
                </p>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
