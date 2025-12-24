"use client";

import React from "react";
import { History, Loader2, Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { PurchaseItem } from "./types";

interface PurchaseHistorySectionProps {
    purchaseItems: PurchaseItem[];
    purchaseLoading: boolean;
    onOpenReviewModal: (purchase: PurchaseItem) => void;
}

export default function PurchaseHistorySection({
    purchaseItems,
    purchaseLoading,
    onOpenReviewModal,
}: PurchaseHistorySectionProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Purchase History</h1>

            {purchaseLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
                </div>
            ) : purchaseItems.length === 0 ? (
                <div className="text-center py-12">
                    <History size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">You have no purchase history</p>
                    <Link href="/products">
                        <Button className="mt-4 bg-blue-600 text-white hover:bg-blue-700">
                            Start Shopping
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {purchaseItems.map((item) => (
                        <div
                            key={item.orderItemId}
                            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <Link href={`/products/${item.slug}`}>
                                <div className="aspect-square relative bg-gray-100">
                                    <Image
                                        src={item.baseImage || "/assets/images/product/1.jpg"}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </Link>
                            <div className="p-4">
                                <Link href={`/products/${item.slug}`}>
                                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 line-clamp-2">
                                        {item.name}
                                    </h3>
                                </Link>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-lg font-bold text-green-600">
                                        ${item.unitPrice}
                                    </span>
                                    <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                                </div>
                                <div className="text-sm text-gray-600 mb-4">
                                    Total: <span className="font-semibold">${item.lineTotal}</span>
                                </div>

                                {item.isReviewed ? (
                                    <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                                        <Star size={16} className="fill-green-600" />
                                        <span>Review Submitted</span>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={() => onOpenReviewModal(item)}
                                        className="w-full bg-[#A12717] text-white hover:bg-[#8a2113] flex items-center justify-center gap-2"
                                    >
                                        <MessageSquare size={16} />
                                        Write Review
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
