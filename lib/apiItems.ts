import axios from "axios";

const api = axios.create({
    baseURL: "/api",
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

        const response = await api.get("/user/products/list-by-category");
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Fetch products
export const fetchProductBySlug = async (slug: string) => {
    try {
        const response = await api.get(`/user/products/show/${slug}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Fetch categories
export const fetchCategories = async () => {
    try {
        const response = await api.get("/user/categories");
        return response.data;
    } catch (error) {
        console.error("fetchCategories error:", error);
        throw error;
    }
};

// Fetch products list
export const fetchProducts = async (limit: number = 10) => {
    try {
        const response = await api.get("/user/products/list-by-category");
        return response.data;
    } catch (error) {
        console.error("fetchProducts error:", error);
        throw error;
    }
};

// Fetch blog posts list
export const fetchPosts = async (page: number = 1) => {
    try {
        const response = await api.post("/user/posts", { page });
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
        const response = await api.get(`/user/posts/show?slug=${encodeURIComponent(slug)}`);
        return response.data;
    } catch (error) {
        console.error("fetchPostBySlug error:", error);
        throw error;
    }
};

// Fetch user profile
export const fetchUserProfile = async () => {
    try {
        const response = await api.get("/user/profile");
        return response.data;
    } catch (error) {
        console.error("fetchUserProfile error:", error);
        throw error;
    }
};

// Update user profile
export const updateUserProfile = async (data: any) => {
    try {
        const response = await api.post("/user/profile/update", data);
        return response.data;
    } catch (error) {
        console.error("updateUserProfile error:", error);
        throw error;
    }
};

// Change user password
export const changeUserPassword = async (data: any) => {
    try {
        const response = await api.post("/user/change-password", data);
        return response.data;
    } catch (error) {
        console.error("changeUserPassword error:", error);
        throw error;
    }
};

// Logout user
export const logoutUser = async () => {
    try {
        // We call the local API route which handles cookie clearing and backend logout
        const response = await axios.post("/api/user/auth/logout");
        return response.data;
    } catch (error) {
        console.error("logoutUser error:", error);
        // Even if error, we might want to redirect or handle it
        throw error;
    }
};

// Add to Cart
export const addToCart = async (products: { productId: string; quantity: string }[]) => {
    try {
        const response = await api.post("/cart/add", { products });
        return response.data;
    } catch (error) {
        console.error("addToCart error:", error);
        throw error;
    }
};

// Fetch Cart
export const fetchCart = async () => {
    try {
        const response = await api.get("/cart");
        console.log("fetchCart response:", response);
        return response.data;
    } catch (error) {
        console.error("fetchCart error:", error);
        throw error;
    }
};

// Remove from Cart
export const removeFromCart = async (data: { cartId: string; id: string }) => {
    try {
        const response = await api.post("/cart/remove", data);
        return response.data;
    } catch (error) {
        console.error("removeFromCart error:", error);
        throw error;
    }
};

// Clear Cart
export const clearCart = async () => {
    try {
        const response = await api.post("/cart/clear"); // Assuming POST based on user request context, usually clear is an action
        return response.data;
    } catch (error) {
        console.error("clearCart error:", error);
        throw error;
    }
};

export default api;
