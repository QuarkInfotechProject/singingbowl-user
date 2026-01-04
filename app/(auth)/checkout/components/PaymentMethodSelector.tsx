"use client";
import React from 'react';
import { Lock, Banknote } from 'lucide-react';
import Image from 'next/image';

type PaymentMethod = "cod" | "getPay";

interface PaymentMethodSelectorProps {
    selectedMethod: PaymentMethod;
    onSelect: (method: PaymentMethod) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ selectedMethod, onSelect }) => {
    return (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 md:w-6 md:h-6 text-slate-700" />
                Payment Method
            </h2>

            <div className="space-y-3">
                {/* COD Payment Option */}
                <button
                    type="button"
                    onClick={() => onSelect("cod")}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${selectedMethod === "cod"
                        ? "border-green-500 bg-green-50/50"
                        : "border-slate-200 hover:border-slate-300"
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === "cod" ? "border-green-500" : "border-slate-300"
                            }`}>
                            {selectedMethod === "cod" && (
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                            )}
                        </div>
                        <Banknote className={`w-6 h-6 ${selectedMethod === "cod" ? "text-green-600" : "text-slate-400"}`} />
                        <div>
                            <div className="font-semibold text-slate-900">
                                Cash on Delivery (COD)
                            </div>
                            <div className="text-xs text-slate-500">
                                Pay when you receive your order
                            </div>
                        </div>
                    </div>
                </button>

                {/* GetPay Payment Option */}
                <button
                    type="button"
                    onClick={() => onSelect("getPay")}
                    className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all text-left ${selectedMethod === "getPay"
                        ? "border-blue-500 bg-blue-50/50"
                        : "border-slate-200 hover:border-slate-300"
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === "getPay" ? "border-blue-500" : "border-slate-300"
                            }`}>
                            {selectedMethod === "getPay" && (
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                            )}
                        </div>
                        <Image src="/assets/images/logo/getpay.webp" alt="Mastercard" width={50} height={50} />

                        <div>
                            <div className="font-semibold text-slate-900">
                                Pay via Debit/Credit Card
                            </div>
                            <div className="text-xs text-slate-500">
                                Secure payment via GetPay
                            </div>
                        </div>
                    </div>

                    {/* Card images */}
                    <div className="flex gap-3 items-center">
                        <Image src="/assets/images/logo/ime.jpeg" alt="Mastercard" width={130} height={50} />
                    </div>
                </button>
            </div>

            {/* Payment Info Box */}
            <div className="mt-4 bg-slate-50 rounded-lg p-4 border border-slate-200 text-sm text-slate-600">
                {selectedMethod === "cod" ? (
                    <p className="flex items-center gap-2">
                        <span className="text-lg">💵</span>
                        <span>Pay cash when your order is delivered. Please have the exact amount ready.</span>
                    </p>
                ) : (
                    <p className="flex items-center gap-2">
                        <span className="text-lg">💳</span>
                        <span>You will be redirected to a secure payment page after clicking &quot;Complete Purchase&quot;.</span>
                    </p>
                )}
            </div>
        </div>
    );
};

export default PaymentMethodSelector;
