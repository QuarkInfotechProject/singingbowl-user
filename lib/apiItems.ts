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

// Add to Wishlist
export const addToWishlist = async (productId: string) => {
    try {
        const response = await api.post("/user/wishlist/add", { productId });
        return response.data;
    } catch (error) {
        console.error("addToWishlist error:", error);
        throw error;
    }
};

// Fetch Wishlist
export const fetchWishlist = async () => {
    try {
        const response = await api.get("/user/wishlist");
        return response.data;
    } catch (error) {
        console.error("fetchWishlist error:", error);
        throw error;
    }
};

// Remove from Wishlist
export const removeFromWishlist = async (productId: string) => {
    try {
        const response = await api.post("/user/wishlist/remove", { productId });
        return response.data;
    } catch (error) {
        console.error("removeFromWishlist error:", error);
        throw error;
    }
};

// Add Address
export const addAddress = async (data: any) => {
    try {
        console.log("=== addAddress Request ===");
        console.log("Request Body:", JSON.stringify(data, null, 2));
        const response = await api.post("/user/address/add", data);
        console.log("=== addAddress Success ===");
        console.log("Response:", response.data);
        return response.data;
    } catch (error: any) {
        console.log("=== addAddress Error ===");
        console.log("Status:", error.response?.status);
        console.log("Error Response Data:", JSON.stringify(error.response?.data, null, 2));
        console.log("Error Message:", error.message);
        throw error;
    }
};

// Fetch all addresses
export const fetchAddresses = async () => {
    try {
        const response = await api.get("/user/address");
        console.log("=== fetchAddresses Response ===");
        console.log("Full Response:", JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        console.error("fetchAddresses error:", error);
        throw error;
    }
};

// Fetch address by UUID
export const fetchAddressById = async (uuid: string) => {
    try {
        const response = await api.get(`/user/address/show/${uuid}`);
        return response.data;
    } catch (error) {
        console.error("fetchAddressById error:", error);
        throw error;
    }
};

// Update Address
export const updateAddress = async (data: any) => {
    try {
        const response = await api.post("/user/address/update", data);
        return response.data;
    } catch (error) {
        console.error("updateAddress error:", error);
        throw error;
    }
};

// Create Order
export const createOrder = async (data: {
    addressId: string;
    couponCodes: string[];
    note: string;
    paymentMethod: string;
    termsAndConditions: string;
}) => {
    try {
        const response = await api.post("/user/orders/create", data);
        return response.data;
    } catch (error) {
        console.error("createOrder error:", error);
        throw error;
    }
};

export default api;

