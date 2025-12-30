"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { fetchGalleries } from "@/lib/apiItems";
import { GalleryPageSkeleton } from "@/components/ui/skeletons";

interface GalleryImage {
  id: number;
  imageUrl: string;
  thumbnailUrl: string;
  mime: string;
  size: number;
  width: number;
  height: number;
  created_at: string;
  updated_at: string;
}

interface PaginationInfo {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

const GalleryPage = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Initial load
  useEffect(() => {
    const loadGalleries = async () => {
      try {
        setLoading(true);
        const response = await fetchGalleries(1);
        if (response.data?.data) {
          setImages(response.data.data);
          setPagination(response.data.pagination);
        }
      } catch (err) {
        console.error("Failed to fetch galleries:", err);
      } finally {
        setLoading(false);
      }
    };

    loadGalleries();
  }, []);

  // Load more function
  const loadMore = useCallback(async () => {
    if (!pagination || loadingMore || pagination.current_page >= pagination.last_page) {
      return;
    }

    try {
      setLoadingMore(true);
      const nextPage = pagination.current_page + 1;
      const response = await fetchGalleries(nextPage);

      if (response.data?.data) {
        // Append new images to existing ones
        setImages((prevImages) => [...prevImages, ...response.data.data]);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error("Failed to load more galleries:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [pagination, loadingMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && pagination && pagination.current_page < pagination.last_page) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore, loadingMore, pagination]);

  const openImage = (imageIndex: number) => {
    setSelectedImage(imageIndex);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const goToPrevious = () => {
    setSelectedImage((prev) =>
      prev === null
        ? images.length - 1
        : prev === 0
          ? images.length - 1
          : prev - 1
    );
  };

  const goToNext = () => {
    setSelectedImage((prev) =>
      prev === null ? 0 : prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "Escape") closeDialog();
  };

  // Helper function to get height class based on image dimensions
  const getHeightClass = (image: GalleryImage) => {
    const aspectRatio = image.width / image.height;
    if (aspectRatio < 0.8) return "row-span-2"; // Tall
    if (aspectRatio > 1.5) return "col-span-2"; // Wide
    return ""; // Normal
  };

  if (loading) {
    return <GalleryPageSkeleton />;
  }

  if (!images || images.length === 0) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-8 flex items-center justify-center">
        <p className="text-gray-500 text-lg">No images available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Gallery Header */}
        <div className="text-start mb-8">
          <h1
            className="text-4xl md:text-6xl font-bold mb-4"
            style={{ color: "#A12717" }}
          >
            Our Gallery
          </h1>
          <p className="text-gray-600 text-lg">
            All images are published by Singing Bowl Village is legally sourced and protected. Any infringement will be met with legal action.
          </p>
        </div>

        {/* Masonry-style Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-3">
          {images.map((image, imageIndex) => (
            <div
              key={image.id}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${getHeightClass(
                image
              )}`}
              style={{ boxShadow: "0 4px 6px rgba(161, 39, 23, 0.1)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 20px 25px -5px rgba(161, 39, 23, 0.3), 0 10px 10px -5px rgba(161, 39, 23, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 6px rgba(161, 39, 23, 0.1)";
              }}
              onClick={() => openImage(imageIndex)}
            >
              <div className="relative w-full h-full bg-gray-100">
                <Image
                  src={image.imageUrl}
                  alt={`Gallery Image ${imageIndex + 1}`}
                  fill
                  sizes={
                    image.width / image.height > 1.5
                      ? "(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                      : "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  }
                  quality={90}
                  className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                  loading="lazy"
                />
                {/* Overlay gradient */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(161, 39, 23, 0.6), transparent)",
                  }}
                />

                {/* Hover content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div
                    className="backdrop-blur-sm px-4 py-2 rounded-full border"
                    style={{
                      backgroundColor: "rgba(161, 39, 23, 0.1)",
                      borderColor: "rgba(161, 39, 23, 0.3)",
                    }}
                  >
                    <span className="text-white text-sm font-medium">View</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Trigger */}
        {pagination && pagination.current_page < pagination.last_page && (
          <div ref={observerTarget} className="flex justify-center py-8">
            {loadingMore && (
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#A12717" }} />
                <span>Loading more images...</span>
              </div>
            )}
          </div>
        )}

        {/* Image Dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent
            className="max-w-[95vw] md:max-w-7xl w-full h-[95vh] p-0 bg-black/98 border"
            style={{ borderColor: "rgba(161, 39, 23, 0.2)" }}
            onKeyDown={handleKeyDown}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <button
                onClick={closeDialog}
                className="absolute top-4 right-4 z-50 p-3 rounded-full backdrop-blur-sm transition-all duration-300 border"
                style={{
                  backgroundColor: "rgba(161, 39, 23, 0.2)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(161, 39, 23, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(161, 39, 23, 0.2)";
                }}
                aria-label="Close"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Previous Button */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 z-50 p-4 rounded-full backdrop-blur-sm transition-all duration-300 border"
                style={{
                  backgroundColor: "rgba(161, 39, 23, 0.2)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(161, 39, 23, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(161, 39, 23, 0.2)";
                }}
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>

              {/* Image Display */}
              {selectedImage !== null && images[selectedImage] && (
                <div className="flex items-center justify-center w-full h-full p-8 md:p-16">
                  <div className="relative max-w-full max-h-full">
                    <Image
                      src={images[selectedImage].imageUrl}
                      alt={`Gallery image ${selectedImage + 1}`}
                      width={1920}
                      height={1080}
                      quality={100}
                      className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
                      style={{
                        boxShadow:
                          "0 20px 25px -5px rgba(161, 39, 23, 0.3), 0 10px 10px -5px rgba(161, 39, 23, 0.2)",
                      }}
                      priority
                    />
                  </div>
                </div>
              )}

              {/* Next Button */}
              <button
                onClick={goToNext}
                className="absolute right-4 z-50 p-4 rounded-full backdrop-blur-sm transition-all duration-300 border"
                style={{
                  backgroundColor: "rgba(161, 39, 23, 0.2)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(161, 39, 23, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(161, 39, 23, 0.2)";
                }}
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>

              {/* Image Info Bar */}
              <div
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-3 rounded-full backdrop-blur-md border"
                style={{
                  backgroundColor: "rgba(161, 39, 23, 0.2)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                }}
              >
                <span className="text-white text-sm font-medium">
                  Our Gallery
                </span>
                <span className="text-gray-300 text-sm">
                  {selectedImage !== null ? selectedImage + 1 : 0} /{" "}
                  {images.length}
                </span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default GalleryPage;
