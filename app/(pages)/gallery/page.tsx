"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ImageData {
  id: number;
  src: string;
  alt: string;
  height: "tall" | "normal" | "wide";
}

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Curated dataset with mixed JPG and PNG images with varying heights
  const images: ImageData[] = [
    {
      id: 1,
      src: "/assets/images/product/1.jpg",
      alt: "Product 1",
      height: "normal",
    },
    {
      id: 2,
      src: "/assets/images/product/1.png",
      alt: "Product 2",
      height: "tall",
    },
    {
      id: 3,
      src: "/assets/images/product/3.jpg",
      alt: "Product 3",
      height: "wide",
    },
    {
      id: 4,
      src: "/assets/images/product/3.png",
      alt: "Product 4",
      height: "normal",
    },
    {
      id: 5,
      src: "/assets/images/product/4.jpg",
      alt: "Product 5",
      height: "tall",
    },
    {
      id: 6,
      src: "/assets/images/product/5.jpg",
      alt: "Product 6",
      height: "normal",
    },
    {
      id: 7,
      src: "/assets/images/product/6.jpg",
      alt: "Product 7",
      height: "wide",
    },
    {
      id: 8,
      src: "/assets/images/product/1.jpg",
      alt: "Product 8",
      height: "normal",
    },
    {
      id: 9,
      src: "/assets/images/product/2.jpg",
      alt: "Product 9",
      height: "tall",
    },
    {
      id: 10,
      src: "/assets/images/product/3.jpg",
      alt: "Product 10",
      height: "normal",
    },
    {
      id: 11,
      src: "/assets/images/product/4.jpg",
      alt: "Product 11",
      height: "wide",
    },
    {
      id: 12,
      src: "/assets/images/product/5.jpg",
      alt: "Product 12",
      height: "normal",
    },
    {
      id: 13,
      src: "/assets/images/product/1.jpg",
      alt: "Product 13",
      height: "normal",
    },
    {
      id: 14,
      src: "/assets/images/product/2.jpg",
      alt: "Product 14",
      height: "tall",
    },
    {
      id: 15,
      src: "/assets/images/product/5.jpg",
      alt: "Product 15",
      height: "normal",
    },
    {
      id: 16,
      src: "/assets/images/product/1.jpg",
      alt: "Product 16",
      height: "normal",
    },
    {
      id: 17,
      src: "/assets/images/product/1.jpg",
      alt: "Product 17",
      height: "normal",
    },
  ];

  const openImage = (index: number) => {
    setSelectedImage(index);
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

  // Helper function to get height class
  const getHeightClass = (height: string) => {
    switch (height) {
      case "tall":
        return "row-span-2";
      case "wide":
        return "col-span-2";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-6xl font-bold mb-4"
            style={{ color: "#A12717" }}
          >
            Media Gallery
          </h1>
          <p className="text-gray-600 text-lg">
            Discover our curated collection
          </p>
        </div>

        {/* Masonry-style Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${getHeightClass(
                image.height
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
              onClick={() => openImage(index)}
            >
              <div className="relative w-full h-full bg-gray-100">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
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
              {selectedImage !== null && (
                <div className="flex items-center justify-center w-full h-full p-8 md:p-16">
                  <div className="relative max-w-full max-h-full">
                    <Image
                      src={images[selectedImage].src}
                      alt={images[selectedImage].alt}
                      width={1920}
                      height={1080}
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
                  {selectedImage !== null ? images[selectedImage].alt : ""}
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

export default Gallery;
