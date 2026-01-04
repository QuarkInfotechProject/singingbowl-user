"use client";
import React, { useState, useEffect } from 'react';
import { Tag, Loader2, X } from 'lucide-react';
import { useCart } from "@/context/CartContext";
import { fetchCoupons } from "@/lib/apiItems";

interface AvailableCoupon {
    name: string;
    code: string;
    value: string;
    type: string;
    minQuantity: number;
    applyAutomatically: boolean;
    expiryDate: string;
    paymentMethods: string[] | string;
}

interface OrderSummaryProps {
    selectedPaymentMethod: "cod" | "getPay";
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ selectedPaymentMethod }) => {
    const {
        cartItems,
        cartTotal,
        grandTotal,
        totalDiscount,
        appliedCoupon,
        couponDiscount,
        isApplyingCoupon,
        applyCoupon,
        removeCoupon,
        shippingCharge
    } = useCart();

    const [couponCode, setCouponCode] = useState("");
    const [couponError, setCouponError] = useState<string | null>(null);
    const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
    const [availableCoupons, setAvailableCoupons] = useState<AvailableCoupon[]>([]);
    const [loadingCoupons, setLoadingCoupons] = useState(false);

    // Fetch available coupons on mount
    useEffect(() => {
        const loadCoupons = async () => {
            try {
                setLoadingCoupons(true);
                const response = await fetchCoupons();
                if (response?.data) {
                    setAvailableCoupons(response.data);
                }
            } catch (error) {
                // Silently fail - coupons are optional
            } finally {
                setLoadingCoupons(false);
            }
        };
        loadCoupons();
    }, []);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            setCouponError("Please enter a coupon code");
            return;
        }
        setCouponError(null);
        setCouponSuccess(null);

        const result = await applyCoupon(couponCode.trim());
        if (result.success) {
            setCouponSuccess(result.message);
            setCouponCode("");
        } else {
            setCouponError(result.message);
        }
    };

    const handleRemoveCoupon = async () => {
        setCouponError(null);
        setCouponSuccess(null);
        const result = await removeCoupon();
        if (result.success) {
            setCouponSuccess(result.message);
        } else {
            setCouponError(result.message);
        }
    };

    const handleSelectCoupon = (code: string) => {
        setCouponCode(code);
        setCouponError(null);
    };

    // Filter coupons based on selected payment method
    const getFilteredCoupons = () => {
        return availableCoupons.filter(coupon => {
            let methods: string[] = [];
            if (typeof coupon.paymentMethods === 'string') {
                try {
                    methods = JSON.parse(coupon.paymentMethods);
                } catch {
                    methods = [];
                }
            } else if (Array.isArray(coupon.paymentMethods)) {
                methods = coupon.paymentMethods;
            }

            if (methods.length === 0) return true;

            const currentMethod = selectedPaymentMethod === 'getPay' ? 'card' : 'cod';
            return methods.includes(currentMethod);
        });
    };

    return (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 sticky top-24">
            <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
                Order Summary
            </h3>

            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-4">Your cart is empty</p>
                ) : (
                    cartItems.map((item) => (
                        <div key={item.id} className="flex gap-4 mb-4 last:mb-0">
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-900 text-sm truncate">{item.name}</p>
                                <p className="text-xs text-slate-500 mt-1">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-slate-900 text-sm">${item.lineTotal.toFixed(2)}</p>
                                {item.originalPrice > item.price && (
                                    <p className="text-[10px] text-green-600 line-through">${(item.originalPrice * item.quantity).toFixed(2)}</p>
                                )}
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
                {totalDiscount > 0 && !appliedCoupon && (
                    <div className="flex justify-between text-sm">
                        <span className="text-green-600">Discount</span>
                        <span className="font-medium text-green-600">-${totalDiscount.toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Standard shipping rate from Nepal</span>
                    <span className="font-medium text-slate-900">{shippingCharge === 0 ? "Free" : `$${shippingCharge.toFixed(2)}`}</span>
                </div>
                {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-green-600">Coupon Discount</span>
                        <span className="font-medium text-green-600">-${couponDiscount.toFixed(2)}</span>
                    </div>
                )}
            </div>

            {/* Coupon Section */}
            <div className="pt-4 border-t border-slate-100">
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Apply Coupon
                </h4>

                {appliedCoupon ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Tag className="w-4 h-4 text-green-600" />
                                <div>
                                    <span className="font-semibold text-green-700">{appliedCoupon.code}</span>
                                    <p className="text-xs text-green-600">
                                        {appliedCoupon.type === 'free_shipping' ? 'Free Shipping' : `$${appliedCoupon.discount.toFixed(2)} off`}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleRemoveCoupon}
                                disabled={isApplyingCoupon}
                                className="p-1 hover:bg-green-100 rounded-full transition-colors"
                                title="Remove coupon"
                            >
                                {isApplyingCoupon ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                                ) : (
                                    <X className="w-4 h-4 text-green-600" />
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => {
                                    setCouponCode(e.target.value.toUpperCase());
                                    setCouponError(null);
                                }}
                                placeholder="Enter coupon code"
                                className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A12717]/20 focus:border-[#A12717] placeholder:text-slate-400"
                            />
                            <button
                                onClick={handleApplyCoupon}
                                disabled={isApplyingCoupon || !couponCode.trim()}
                                className="px-4 py-2 bg-[#A12717] text-white text-sm font-medium rounded-lg hover:bg-[#8a2113] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                                {isApplyingCoupon ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    "Apply"
                                )}
                            </button>
                        </div>
                        {couponError && (
                            <p className="text-xs text-red-600 flex items-center gap-1">
                                <span>⚠️</span> {couponError}
                            </p>
                        )}
                    </div>
                )}

                {couponSuccess && (
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                        <span>✅</span> {couponSuccess}
                    </p>
                )}

                {/* Available Coupons List */}
                {!appliedCoupon && getFilteredCoupons().length > 0 && (
                    <div className="mt-4">
                        <p className="text-xs text-slate-500 mb-2">Available coupons (click to apply):</p>
                        <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar">
                            {getFilteredCoupons().map((coupon) => (
                                <button
                                    key={coupon.code}
                                    onClick={() => handleSelectCoupon(coupon.code)}
                                    disabled={isApplyingCoupon}
                                    className="w-full text-left p-2 rounded-lg border border-slate-200 hover:border-green-300 hover:bg-green-50/50 transition-all group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-xs font-mono font-semibold text-green-700 group-hover:text-green-800">
                                                {coupon.code}
                                            </span>
                                            <p className="text-[10px] text-slate-500">
                                                {coupon.name} • {coupon.type === 'free_shipping' ? 'Free Shipping' : `$${parseFloat(coupon.value).toFixed(2)} off`}
                                            </p>
                                        </div>
                                        <Tag className="w-3 h-3 text-slate-400 group-hover:text-green-600" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {loadingCoupons && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Loading available coupons...
                    </div>
                )}
            </div>

            {/* Grand Total - Redundant in this component if handled by page? No it's good here */}
            <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex justify-between items-end">
                    <span className="text-slate-600 font-medium">Grand Total</span>
                    <span className="text-3xl font-bold text-[#A12717]">${grandTotal.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
