"use client";

import React from "react";
import { Heart, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { WishlistItem } from "./types";

interface WishlistSectionProps {
    wishlistItems: WishlistItem[];
    wishlistLoading: boolean;
    removingIds: string[];
    onRemoveFromWishlist: (productId: string) => void;
}

export default function WishlistSection({
    wishlistItems,
    wishlistLoading,
    removingIds,
    onRemoveFromWishlist,
}: WishlistSectionProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h1>

            {wishlistLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
                </div>
            ) : wishlistItems.length === 0 ? (
                <div className="text-center py-12">
                    <Heart size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Your wishlist is empty</p>
                    <Link href="/products">
                        <Button className="mt-4 bg-blue-600 text-white hover:bg-blue-700">
                            Browse Products
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                        <div
                            key={item.uuid}
                            className={`relative border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${removingIds.includes(item.uuid) ? "opacity-50" : ""
                                }`}
                        >
                            <Link href={`/products/${item.slug || item.url}`}>
                                <div className="aspect-square relative bg-gray-100">
                                    <Image
                                        src={item.baseImage || "/assets/images/product/1.jpg"}
                                        alt={item.productName}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </Link>
                            <div className="p-4">
                                <Link href={`/products/${item.slug || item.url}`}>
                                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 line-clamp-2">
                                        {item.productName}
                                    </h3>
                                </Link>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg font-bold text-green-600">
                                        ${item.specialPrice || item.originalPrice}
                                    </span>
                                    {item.specialPrice && (
                                        <span className="text-sm text-gray-400 line-through">
                                            ${item.originalPrice}
                                        </span>
                                    )}
                                </div>
                                <Button
                                    onClick={() => onRemoveFromWishlist(item.uuid)}
                                    disabled={removingIds.includes(item.uuid)}
                                    variant="outline"
                                    className="w-full flex items-center justify-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                                >
                                    {removingIds.includes(item.uuid) ? (
                                        <Loader2 className="animate-spin h-4 w-4" />
                                    ) : (
                                        <Trash2 size={16} />
                                    )}
                                    <span>Remove</span>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
