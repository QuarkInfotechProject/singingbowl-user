"use client";

import React, { useState, useEffect } from "react";
import { History, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchPurchases } from "@/lib/apiItems";
import { PurchaseItem, ReviewData } from "./types";
import ReviewModal from "./ReviewModal";
import PurchaseHistoryCard from "./PurchaseHistoryCard";

export default function PurchaseHistorySection() {
    const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);
    const [purchaseLoading, setPurchaseLoading] = useState(false);

    // Review Modal state
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState<PurchaseItem | null>(null);
    const [reviewData, setReviewData] = useState<ReviewData>({
        rating: 0,
        comment: "",
    });
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [reviewImages, setReviewImages] = useState<File[]>([]);
    const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
    const [reviewError, setReviewError] = useState<string | null>(null);
    const [reviewSuccess, setReviewSuccess] = useState(false);

    useEffect(() => {
        loadPurchases();
    }, []);

    const loadPurchases = async () => {
        try {
            setPurchaseLoading(true);
            const res = await fetchPurchases();
            if (res?.data && Array.isArray(res.data)) {
                setPurchaseItems(res.data);
            } else if (Array.isArray(res)) {
                setPurchaseItems(res);
            }
        } catch (error) {
            console.error("Failed to load purchases", error);
        } finally {
            setPurchaseLoading(false);
        }
    };

    // Review modal functions
    const openReviewModal = (purchase: PurchaseItem) => {
        setSelectedPurchase(purchase);
        setReviewData({ rating: 0, comment: "" });
        setReviewImages([]);
        setImagePreviewUrls([]);
        setReviewError(null);
        setReviewSuccess(false);
        setShowReviewModal(true);
    };

    const closeReviewModal = () => {
        setShowReviewModal(false);
        setSelectedPurchase(null);
        setReviewData({ rating: 0, comment: "" });
        imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
        setReviewImages([]);
        setImagePreviewUrls([]);
        setReviewError(null);
        setReviewSuccess(false);
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const remainingSlots = 5 - reviewImages.length;
        const filesToAdd: File[] = [];

        for (const file of files.slice(0, remainingSlots)) {
            if (file.size > 2 * 1024 * 1024) {
                setReviewError("Each image must be less than 2MB");
                continue;
            }
            filesToAdd.push(file);
        }

        if (filesToAdd.length > 0) {
            const newUrls = filesToAdd.map((file) => URL.createObjectURL(file));
            setReviewImages([...reviewImages, ...filesToAdd]);
            setImagePreviewUrls([...imagePreviewUrls, ...newUrls]);
            setReviewError(null);
        }

        e.target.value = "";
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...reviewImages];
        const newUrls = [...imagePreviewUrls];
        URL.revokeObjectURL(newUrls[index]);
        newImages.splice(index, 1);
        newUrls.splice(index, 1);
        setReviewImages(newImages);
        setImagePreviewUrls(newUrls);
    };

    const handleSubmitReview = async () => {
        if (!selectedPurchase) return;

        if (reviewData.rating === 0) {
            setReviewError("Please select a rating");
            return;
        }

        try {
            setReviewSubmitting(true);
            setReviewError(null);

            const formDataObj = new FormData();
            formDataObj.append("productId", selectedPurchase.productId);
            formDataObj.append("orderItemId", selectedPurchase.orderItemId.toString());
            formDataObj.append("rating", reviewData.rating.toString());
            formDataObj.append("comment", reviewData.comment);

            reviewImages.forEach((image) => {
                formDataObj.append("images[]", image);
            });

            const response = await fetch("/api/user/reviews/create", {
                method: "POST",
                body: formDataObj,
            });

            const result = await response.json();

            if (response.ok && (result.code === 0 || result.success)) {
                setReviewSuccess(true);
                setPurchaseItems((prev) =>
                    prev.map((item) =>
                        item.orderItemId === selectedPurchase.orderItemId
                            ? { ...item, isReviewed: true }
                            : item
                    )
                );
                setTimeout(() => closeReviewModal(), 2000);
            } else {
                setReviewError(result.error || result.message || "Failed to submit review");
            }
        } catch (error: any) {
            console.error("Review submission failed", error);
            setReviewError("Failed to submit review. Please try again.");
        } finally {
            setReviewSubmitting(false);
        }
    };

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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {purchaseItems.map((item) => (
                        <PurchaseHistoryCard
                            key={item.orderItemId}
                            item={item}
                            onOpenReviewModal={openReviewModal}
                        />
                    ))}
                </div>
            )}

            <ReviewModal
                showReviewModal={showReviewModal}
                selectedPurchase={selectedPurchase}
                reviewData={reviewData}
                setReviewData={setReviewData}
                reviewImages={reviewImages}
                imagePreviewUrls={imagePreviewUrls}
                reviewError={reviewError}
                reviewSuccess={reviewSuccess}
                reviewSubmitting={reviewSubmitting}
                hoveredRating={hoveredRating}
                setHoveredRating={setHoveredRating}
                onClose={closeReviewModal}
                onSubmitReview={handleSubmitReview}
                onImageSelect={handleImageSelect}
                onRemoveImage={handleRemoveImage}
            />
        </div>
    );
}
