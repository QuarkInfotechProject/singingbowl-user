import { MetadataRoute } from "next";
import { fetchProducts, fetchPosts } from "@/lib/apiItems";

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
        // Fetch products (fetchProducts returns categories with products)
        const productResponse = await fetchProducts(100);
        const categories = Array.isArray(productResponse) ? productResponse : productResponse?.data || [];

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

        // Fetch blog posts
        const postData = await fetchPosts(1);
        const posts = Array.isArray(postData) ? postData : postData?.data || [];

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
