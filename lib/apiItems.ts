import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    timeout: 60000,
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

// Fetch products by specific category name/slug
export const fetchProductsByCategoryName = async (categoryName: string) => {
    try {
        const response = await api.get(`/user/products/${categoryName}`);
        return response.data;
    } catch (error) {
        console.error("fetchProductsByCategoryName error:", error);
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
        return response.data;
    } catch (error) {
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
        return response.data;
    } catch (error) {
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
        const response = await api.post("/user/address/add", data);
        return response.data;
    } catch (error: any) {
        throw error;
    }
};

// Fetch all addresses
export const fetchAddresses = async () => {
    try {
        const response = await api.get("/user/address");
        return response.data;
    } catch (error) {
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

// Fetch Guest Token
export const fetchGuestToken = async () => {
    try {
        const response = await api.get("/token");
        return response.data;
    } catch (error) {
        console.error("fetchGuestToken error:", error);
        throw error;
    }
};

// Fetch Orders
export const fetchOrders = async (page: number = 1) => {
    try {
        const response = await api.get(`/user/orders?page=${page}`);
        return response.data;
    } catch (error) {
        console.error("fetchOrders error:", error);
        throw error;
    }
};

// Fetch Purchase History
export const fetchPurchases = async () => {
    try {
        const response = await api.get("/user/purchases");
        return response.data;
    } catch (error) {
        console.error("fetchPurchases error:", error);
        throw error;
    }
};

// Fetch Reviews for home page
export const fetchReviews = async () => {
    try {
        const response = await api.get("/user/reviews");
        return response.data;
    } catch (error) {
        console.error("fetchReviews error:", error);
        throw error;
    }
};

// Fetch Product Specification (includes reviews) by slug
export const fetchProductSpecification = async (slug: string) => {
    try {
        const response = await api.get(`/user/products/show/specification/${slug}`);
        return response.data;
    } catch (error) {
        console.error("fetchProductSpecification error:", error);
        throw error;
    }
};

// Fetch Similar Products by slug
export const fetchSimilarProducts = async (slug: string) => {
    try {
        const response = await api.get(`/user/products/show/similar/${slug}`);
        return response.data;
    } catch (error) {
        console.error("fetchSimilarProducts error:", error);
        throw error;
    }
};

// Fetch Galleries
export const fetchGalleries = async () => {
    try {
        const response = await api.get("/user/galleries");
        return response.data;
    } catch (error) {
        console.error("fetchGalleries error:", error);
        throw error;
    }
};

// Fetch Best Sellers
export const fetchBestSellers = async () => {
    try {
        const response = await api.get("/user/products/bestsellers");
        return response.data;
    } catch (error) {
        console.error("fetchBestSellers error:", error);
        throw error;
    }
};

// Search Products
export const searchProducts = async (query: string) => {
    try {
        const response = await api.get(`/user/search?q=${encodeURIComponent(query)}`);
        return response.data;
    } catch (error) {
        console.error("searchProducts error:", error);
        throw error;
    }
};

export default api;

