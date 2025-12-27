import React from "react";
import { Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { PurchaseItem } from "./types";

interface PurchaseHistoryCardProps {
    item: PurchaseItem;
    onOpenReviewModal: (purchase: PurchaseItem) => void;
}

export default function PurchaseHistoryCard({
    item,
    onOpenReviewModal,
}: PurchaseHistoryCardProps) {
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col">
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
            <div className="p-3 flex flex-col flex-1">
                <Link href={`/products/${item.slug}`}>
                    <h3 className="font-semibold text-gray-900 mb-1 hover:text-blue-600 line-clamp-2 text-sm">
                        {item.name}
                    </h3>
                </Link>
                <div className="flex items-center justify-between mb-2 mt-auto">
                    <span className="text-base font-bold text-green-600">
                        ${item.unitPrice}
                    </span>
                    <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                </div>
                <div className="text-xs text-gray-600 mb-3">
                    Total: <span className="font-semibold">${item.lineTotal}</span>
                </div>

                {item.isReviewed ? (
                    <div className="flex items-center gap-1 text-green-600 text-xs font-medium justify-center py-2 bg-green-50 rounded">
                        <Star size={12} className="fill-green-600" />
                        <span>Reviewed</span>
                    </div>
                ) : (
                    <Button
                        onClick={() => onOpenReviewModal(item)}
                        size="sm"
                        className="w-full bg-[#A12717] text-white hover:bg-[#8a2113] flex items-center justify-center gap-2 text-xs h-8"
                    >
                        <MessageSquare size={12} />
                        Review
                    </Button>
                )}
            </div>
        </div>
    );
}
