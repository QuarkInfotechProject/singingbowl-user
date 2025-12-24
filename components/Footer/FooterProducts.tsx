"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Product {
    id: string | number;
    url: string;
    productName: string;
}

const FooterProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await fetch("/api/user/products/list-by-category");
                const result = await response.json();

                // Extract products from the response - structure: { data: [{ products: [...] }, ...] }
                let productList: Product[] = [];

                const rawData = result?.data || result;

                if (Array.isArray(rawData)) {
                    // The API returns categories, each with a products array
                    rawData.forEach((category: any) => {
                        if (category.products && Array.isArray(category.products)) {
                            category.products.forEach((prod: any) => {
                                productList.push({
                                    id: prod.id || prod.uuid,
                                    url: prod.url || prod.slug,
                                    productName: prod.productName || prod.name,
                                });
                            });
                        }
                    });
                }

                // Take first 5 products
                const firstFiveProducts = productList.slice(0, 5);
                setProducts(firstFiveProducts);
            } catch (error) {
                console.error("Failed to load footer products:", error);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    if (loading) {
        return (
            <div className="space-y-4">
                <h2 className="text-white text-lg font-semibold">Products</h2>
                <ul className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <li key={i}>
                            <div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-white text-lg font-semibold">Products</h2>
            <ul className="space-y-2">
                {products.map((product) => (
                    <li key={product.id}>
                        <Link
                            href={`/products/${product.url}`}
                            className="text-sm hover:text-white transition-colors"
                        >
                            {product.productName}
                        </Link>
                    </li>
                ))}
                <li className="pt-2">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-1 text-sm font-medium text-[#A12717] hover:text-[#c23020] transition-colors"
                    >
                        View All Products
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default FooterProducts;
