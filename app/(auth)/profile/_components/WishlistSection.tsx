"use client";

import React, { useState, useEffect } from "react";
import { Heart, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { fetchWishlist } from "@/lib/apiItems";
import { useWishlist } from "@/context/WishlistContext";
import { WishlistItem } from "./types";
import { WishlistSkeleton } from "@/components/ui/skeletons";

export default function WishlistSection() {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const { removeFromWishlistById, loadingProductId } = useWishlist();

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        try {
            setWishlistLoading(true);
            const res = await fetchWishlist();
            if (res?.data && Array.isArray(res.data)) {
                setWishlistItems(res.data);
            } else if (Array.isArray(res)) {
                setWishlistItems(res);
            }
        } catch (error) {
            console.error("Failed to load wishlist", error);
        } finally {
            setWishlistLoading(false);
        }
    };

    const handleRemoveFromWishlist = async (productId: string) => {
        await removeFromWishlistById(productId);
        // Update local state to remove the item from the list
        setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h1>

            {wishlistLoading ? (
                <WishlistSkeleton />
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
                            key={item.id}
                            className={`relative border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${loadingProductId === item.id ? "opacity-50" : ""
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
                                    onClick={() => handleRemoveFromWishlist(item.id)}
                                    disabled={loadingProductId === item.id}
                                    variant="outline"
                                    className="w-full flex items-center justify-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                                >
                                    {loadingProductId === item.id ? (
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
