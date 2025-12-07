import axios from "axios";

// Create an Axios instance for frontend -> Next.js API calls
const api = axios.create({
    baseURL: "/api", // Calls the Next.js API routes
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        // You can add auth tokens here if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error("API Call Failed:", error);
        return Promise.reject(error);
    }
);

// Fetch products by category
export const fetchProductsByCategory = async () => {
    try {
        // This calls /api/products/list-by-category
        // which maps to app/api/[...path]/route.ts with path=['products', 'list-by-category']
        // which maps to process.env.BASE_URL + /products/list-by-category
        const response = await api.get("/products/list-by-category");
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Fetch product details by slug
export const fetchProductBySlug = async (slug: string) => {
    try {
        const response = await api.get(`/products/show/${slug}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Fetch categories
export const fetchCategories = async () => {
    try {
        const response = await api.get("/categories");
        return response.data;
    } catch (error) {
        console.error("fetchCategories error:", error);
        throw error;
    }
};

// Fetch products list
export const fetchProducts = async (limit: number = 10) => {
    try {
        const response = await api.get("/products/list-by-category");
        return response.data;
    } catch (error) {
        console.error("fetchProducts error:", error);
        throw error;
    }
};

// Fetch blog posts list
export const fetchPosts = async (page: number = 1) => {
    try {
        const response = await api.post("/posts", { page });
        console.log("fetchPosts response:", response);
        return response.data;
    } catch (error) {
        console.error("fetchPosts error:", error);
        throw error;
    }
};

// Fetch blog post by slug
export const fetchPostBySlug = async (slug: string) => {
    try {
        const response = await api.get(`/posts/show?slug=${encodeURIComponent(slug)}`);
        return response.data;
    } catch (error) {
        console.error("fetchPostBySlug error:", error);
        throw error;
    }
};

export default api;
