"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductGrid from "@/components/Products/ProductGrid";
import DetailBreadCrumbs from "@/components/Products/ProductDetails/DetailBreadCrumbs";
import IconCard from "@/components/Products/ProductDetails/IconCard";
import ProductHeroSection from "@/components/Products/ProductDetails/ProductHeroSection";
import DetailsSection from "@/components/Products/ProductDetails/DetailsSection";
import SimilarProductsGrid from "@/components/Products/SimilarProductsGrid";
import { fetchProductBySlug, fetchSimilarProducts } from "@/lib/apiItems";
import { ProductDetailSkeleton } from "@/components/ui/skeletons";
import BlogGrid from "@/components/Home/Blogs/BlogGrid";
import { SimilarProduct } from "@/components/Products/SimilarProductCard";

// Product detail interface based on API response
export interface ProductDetail {
  uuid: string;
  productName: string;
  url: string;
  originalPrice: string;
  specialPrice: string | null;
  discountPercentage: number;
  description: string;
  additionalDescription: string;
  quantity: number;
  inStock: boolean;
  review_count: number;
  average_rating: number;
  files: {
    baseImage: { url: string } | null;
    additionalImage: string[];
    descriptionVideo: string | null;
  };
  specifications: { icon: string; content: string }[];
  categories: { id: number; name: string }[];
  relatedProducts: any[];
}

const ProductDetail = () => {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const response = await fetchProductBySlug(slug);
        // API returns { data: [...] }, get first item
        const productData = response.data?.[0] || null;
        setProduct(productData);
      } catch (err) {
        console.error("Failed to load product", err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  // Fetch similar products
  useEffect(() => {
    const loadSimilarProducts = async () => {
      if (!slug) return;

      try {
        const response = await fetchSimilarProducts(slug);
        if (response.data && response.data[0]?.relatedProducts) {
          setSimilarProducts(response.data[0].relatedProducts);
        }
      } catch (err) {
        console.error("Failed to load similar products", err);
      }
    };

    loadSimilarProducts();
  }, [slug]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <p className="text-red-500">{error || "Product not found."}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-12 py-6">
        <div className="px-4 md:px-26 mx-auto w-full flex flex-col gap-12">
          <DetailBreadCrumbs productName={product.productName} />
          <ProductHeroSection product={product} />
        </div>
        <IconCard specifications={product.specifications} />
        <div className="px-4 md:px-26 mx-auto w-full flex flex-col gap-12">
          <SimilarProductsGrid
            title="You Might Also Like"
            products={similarProducts}
          />
          <DetailsSection
            description={product.description}
            additionalDescription={product.additionalDescription}
            slug={slug}
          />
          <BlogGrid />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
