import { MetadataRoute } from "next";

// Server-side API base URL for build-time calls
const API_BASE_URL = process.env.BASE_URL || "https://api.singingbowlvillagenepal.com/api";

// Server-side fetch helpers for sitemap generation
async function fetchProductsForSitemap(): Promise<any[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/user/products/list-by-category`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            next: { revalidate: 3600 }, // Cache for 1 hour
        });
        if (!response.ok) return [];
        const data = await response.json();
        return Array.isArray(data) ? data : data?.data || [];
    } catch {
        return [];
    }
}

async function fetchPostsForSitemap(): Promise<any[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/user/posts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ page: 1 }),
            next: { revalidate: 3600 }, // Cache for 1 hour
        });
        if (!response.ok) return [];
        const data = await response.json();
        return Array.isArray(data) ? data : data?.data || [];
    } catch {
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://singingbowlvillagenepal.com";

    // Static routes
    const staticRoutes = [
        "",
        "/about_us",
        "/blog",
        "/contact_us",
        "/gallery",
        "/products",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1,
    }));

    let productRoutes: MetadataRoute.Sitemap = [];
    let blogRoutes: MetadataRoute.Sitemap = [];

    try {
        // Fetch products using server-side helper (uses absolute URL)
        const categories = await fetchProductsForSitemap();

        // Extract products from categories
        const products: any[] = [];
        if (Array.isArray(categories)) {
            categories.forEach((category: any) => {
                if (Array.isArray(category.products)) {
                    products.push(...category.products);
                }
            });
        }

        productRoutes = products.map((product: any) => ({
            url: `${baseUrl}/products/${product.slug || product.uuid}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }));

        // Fetch blog posts using server-side helper
        const posts = await fetchPostsForSitemap();

        blogRoutes = posts.map((post: any) => ({
            url: `${baseUrl}/blog/${post.slug || post.id}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }));

    } catch (error) {
        console.error("Error generating sitemap:", error);
    }

    return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
