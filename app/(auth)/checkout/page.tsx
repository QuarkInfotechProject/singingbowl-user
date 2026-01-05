"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Address } from "@/types/address.types";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createOrder } from "@/lib/apiItems";
import { useRouter } from "next/navigation";
import AddressSection from "./components/AddressSection";
import PaymentMethodSelector from "./components/PaymentMethodSelector";
import OrderSummary from "./components/OrderSummary";

type PaymentMethod = "cod" | "getPay";

const GETPAY_SDK_URL = process.env.NEXT_PUBLIC_GETPAY_SDK_URL || 'https://minio.finpos.global/getpay-cdn/webcheckout/bundle.js';

const Checkout = () => {
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("cod");
    const [showPaymentInit, setShowPaymentInit] = useState(false);
    const checkoutInProgressRef = useRef(false);

    const { cartItems, isLoading, clearCart, appliedCoupon } = useCart();
    const { isLoggedIn, isLoading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        sessionStorage.removeItem('paymentConfig');
        sessionStorage.removeItem('currentOrderId');
        checkoutInProgressRef.current = false;
    }, []);

    useEffect(() => {
        if (selectedPaymentMethod === 'getPay') {
            const existingScript = document.querySelector(`script[src="${GETPAY_SDK_URL}"]`);
            if (!existingScript) {
                const script = document.createElement('script');
                script.src = GETPAY_SDK_URL;
                script.async = true;
                document.body.appendChild(script);
            }
        }
    }, [selectedPaymentMethod]);

    const waitForGetPay = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const check = () => {
                if ((window as any).GetPay) {
                    resolve();
                } else if (attempts > 50) {
                    reject(new Error('GetPay SDK failed to load'));
                } else {
                    attempts++;
                    setTimeout(check, 100);
                }
            };
            check();
        });
    };

    const initializeGetPay = async (orderResponse: any) => {
        await waitForGetPay();

        setShowPaymentInit(true);
        await new Promise(resolve => setTimeout(resolve, 100));

        const getPayOptions = {
            ...orderResponse.getPayOptions,
            websiteDomain: window.location.origin,
            callbackUrl: {
                successUrl: `${window.location.origin}/api/user/orders/success/getPay/${orderResponse.orderId}`,
                failUrl: `${window.location.origin}/checkout/payment-failed?orderId=${orderResponse.orderId}`
            },
            onSuccess: () => {
                window.location.href = `/checkout/payment?orderId=${orderResponse.orderId}`;
            },
            onError: (error: any) => {
                setShowPaymentInit(false);
                setOrderError('Payment initialization failed: ' + (error?.error || error?.message || 'Unknown error'));
                setIsSubmitting(false);
                checkoutInProgressRef.current = false;
            }
        };

        const getPay = new (window as any).GetPay(getPayOptions);
        getPay.initialize();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setOrderError(null);

        if (!selectedAddress?.uuid) {
            setOrderError("Please select a delivery address");
            return;
        }

        if (!agreedToTerms) {
            setOrderError("Please agree to the terms and conditions");
            return;
        }

        if (checkoutInProgressRef.current) return;
        checkoutInProgressRef.current = true;

        try {
            setIsSubmitting(true);
            sessionStorage.removeItem('paymentConfig');
            sessionStorage.removeItem('currentOrderId');

            const orderData = {
                addressId: selectedAddress.uuid,
                couponCodes: appliedCoupon ? [appliedCoupon.code] : [],
                note: "",
                paymentMethod: selectedPaymentMethod,
                termsAndConditions: "true",
                _t: Date.now()
            };

            const response = await createOrder(orderData);
            const orderResponse = response.data || response;

            if (selectedPaymentMethod === "cod") {
                clearCart();
                setShowSuccessDialog(true);
                setIsSubmitting(false);
                return;
            }

            if ((orderResponse.paymentMethod === "getpay" || orderResponse.paymentMethod === "getPay") && orderResponse.getPayOptions) {
                const config = {
                    ...orderResponse,
                    addressUuid: selectedAddress?.uuid,
                    _timestamp: Date.now()
                };
                sessionStorage.setItem('paymentConfig', JSON.stringify(config));
                sessionStorage.setItem('currentOrderId', String(orderResponse.orderId));

                await initializeGetPay(orderResponse);
            } else {
                throw new Error("Invalid payment configuration from server");
            }

        } catch (error: any) {
            setOrderError(error.response?.data?.error || error.response?.data?.message || "Failed to place order. Please try again.");
            setIsSubmitting(false);
            checkoutInProgressRef.current = false;
        }
    };

    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.push("/login?redirect=/checkout");
        }
    }, [isLoggedIn, authLoading, router]);

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#A12717]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8 md:py-12">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Checkout</h1>
                    <p className="text-slate-500 mt-2">Complete your order by providing delivery and payment details.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <AddressSection
                            onAddressSelect={setSelectedAddress}
                            selectedAddressId={selectedAddress?.uuid}
                        />

                        {selectedAddress && (
                            <PaymentMethodSelector
                                selectedMethod={selectedPaymentMethod}
                                onSelect={setSelectedPaymentMethod}
                            />
                        )}

                        {selectedAddress && (
                            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
                                <label className="flex items-start gap-3 cursor-pointer mb-6 group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={agreedToTerms}
                                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                                            className="peer w-5 h-5 cursor-pointer appearance-none rounded border border-slate-300 shadow-sm focus:ring-2 focus:ring-[#A12717]/20 checked:bg-[#A12717] checked:border-[#A12717] transition-all"
                                        />
                                        <svg className="absolute w-3.5 h-3.5 text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                                        I agree to the{" "}
                                        <a href="/terms-and-condition" className="text-[#A12717] hover:underline font-medium">Terms and Conditions</a>
                                        {" "}and{" "}
                                        <a href="/privacy-policy" className="text-[#A12717] hover:underline font-medium">Privacy Policy</a>
                                    </span>
                                </label>

                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || cartItems.length === 0}
                                    className={`w-full bg-[#A12717] text-white font-bold text-lg py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:bg-[#8a2113] active:scale-[0.99] flex items-center justify-center gap-2 ${isSubmitting || cartItems.length === 0 ? "opacity-50 cursor-not-allowed transform-none" : ""}`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            Processing Order...
                                        </>
                                    ) : (
                                        <>
                                            {selectedPaymentMethod === "cod" ? "Place Order" : "Complete Purchase"}
                                            <ChevronRight className="w-6 h-6" />
                                        </>
                                    )}
                                </button>

                                {orderError && (
                                    <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                                        <span className="text-xl">⚠️</span> {orderError}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1">
                        <OrderSummary selectedPaymentMethod={selectedPaymentMethod} />
                    </div>
                </div>
            </div>

            <Dialog open={showSuccessDialog} onOpenChange={() => { }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-green-600">
                            <span className="text-2xl">🎉</span> Order Placed Successfully!
                        </DialogTitle>
                        <DialogDescription>
                            Your order has been placed successfully! Please have the payment ready when your order arrives.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center">
                        <Button
                            type="button"
                            className="bg-[#A12717] hover:bg-[#8a2113] text-white w-full sm:w-auto px-8"
                            onClick={() => router.push("/profile?tab=orders")}
                        >
                            OK, Go to Orders
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {showPaymentInit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-8 text-center">
                        <Loader2 className="w-10 h-10 animate-spin text-[#A12717] mx-auto mb-4" />
                        <p className="text-slate-700 font-medium">Initializing payment...</p>
                        <p className="text-slate-500 text-sm mt-2">Please wait while we set up your secure payment</p>
                        <div id="checkout" className="mt-4"></div>
                    </div>
                </div>
            )}
            {!showPaymentInit && <div id="checkout" className="hidden"></div>}
        </div>
    );
};

export default Checkout;