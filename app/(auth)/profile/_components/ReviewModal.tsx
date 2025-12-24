"use client";

import React from "react";
import { Star, X, Loader2, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import { PurchaseItem, ReviewData } from "./types";

interface ReviewModalProps {
    showReviewModal: boolean;
    selectedPurchase: PurchaseItem | null;
    reviewData: ReviewData;
    setReviewData: React.Dispatch<React.SetStateAction<ReviewData>>;
    reviewImages: File[];
    imagePreviewUrls: string[];
    reviewError: string | null;
    reviewSuccess: boolean;
    reviewSubmitting: boolean;
    hoveredRating: number;
    setHoveredRating: React.Dispatch<React.SetStateAction<number>>;
    onClose: () => void;
    onSubmitReview: () => void;
    onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: (index: number) => void;
}

export default function ReviewModal({
    showReviewModal,
    selectedPurchase,
    reviewData,
    setReviewData,
    reviewImages,
    imagePreviewUrls,
    reviewError,
    reviewSuccess,
    reviewSubmitting,
    hoveredRating,
    setHoveredRating,
    onClose,
    onSubmitReview,
    onImageSelect,
    onRemoveImage,
}: ReviewModalProps) {
    return (
        <Dialog open={showReviewModal} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Write a Review</DialogTitle>
                    <DialogDescription>
                        Share your experience with {selectedPurchase?.name}
                    </DialogDescription>
                </DialogHeader>

                {reviewSuccess ? (
                    <div className="py-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Star size={32} className="text-green-600 fill-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Thank you!</h3>
                        <p className="text-gray-600">Your review has been submitted successfully.</p>
                    </div>
                ) : (
                    <div className="space-y-6 py-4">
                        {/* Product Info */}
                        {selectedPurchase && (
                            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                        src={selectedPurchase.baseImage || "/assets/images/product/1.jpg"}
                                        alt={selectedPurchase.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 line-clamp-2">
                                        {selectedPurchase.name}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        Order Item #{selectedPurchase.orderItemId}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Star Rating */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rating <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setReviewData({ ...reviewData, rating: star })}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                    >
                                        <Star
                                            size={32}
                                            className={`transition-colors ${star <= (hoveredRating || reviewData.rating)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                                }`}
                                        />
                                    </button>
                                ))}
                                <span className="ml-3 text-sm text-gray-600">
                                    {reviewData.rating > 0
                                        ? `${reviewData.rating} out of 5 stars`
                                        : "Click to rate"}
                                </span>
                            </div>
                        </div>

                        {/* Comment */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Your Review
                            </label>
                            <textarea
                                value={reviewData.comment}
                                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                rows={4}
                                placeholder="Share your experience with this product..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                {reviewData.comment.length}/500 characters
                            </p>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Add Photos (Optional)
                            </label>
                            <p className="text-xs text-gray-500 mb-3">
                                Upload up to 5 images (max 2MB each)
                            </p>

                            <div className="flex flex-wrap gap-3">
                                {/* Image Previews */}
                                {imagePreviewUrls.map((url, index) => (
                                    <div
                                        key={index}
                                        className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group"
                                    >
                                        <img
                                            src={url}
                                            alt={`Review image ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => onRemoveImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}

                                {/* Upload Button */}
                                {reviewImages.length < 5 && (
                                    <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                                        <ImagePlus size={20} className="text-gray-400 mb-1" />
                                        <span className="text-xs text-gray-500">Add</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={onImageSelect}
                                        />
                                    </label>
                                )}
                            </div>

                            {reviewImages.length > 0 && (
                                <p className="mt-2 text-xs text-gray-500">
                                    {reviewImages.length}/5 images uploaded
                                </p>
                            )}
                        </div>

                        {/* Error Message */}
                        {reviewError && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                {reviewError}
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            onClick={onSubmitReview}
                            disabled={reviewSubmitting || reviewData.rating === 0}
                            className="w-full bg-[#A12717] text-white py-3 rounded-lg hover:bg-[#8a2113] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {reviewSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                                    Submitting...
                                </>
                            ) : (
                                "Submit Review"
                            )}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
