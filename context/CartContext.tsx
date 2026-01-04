"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import { addToCart as apiAddToCart, fetchCart as apiFetchCart, removeFromCart as apiRemoveFromCart, clearCart as apiClearCart, fetchGuestToken, applyCoupon as apiApplyCoupon, removeCoupon as apiRemoveCoupon, updateCartQuantity as apiUpdateQuantity } from "@/lib/apiItems";
import Cookies from "js-cookie";
// import { toast } from "sonner"; // Removed as not installed

export interface CartItem {
    id: string; // Numeric Product ID
    productUuid?: string; // Product UUID for API calls
    cartItemId?: string;
    name: string;
    price: number; // unitPrice from API
    originalPrice: number; // originalPrice from API
    lineTotal: number; // lineTotal from API
    quantity: number;
    image: string;
    stock?: number;
    discount?: number;
    description?: string;
    url?: string;
    weight?: number | null;
    category?: string;
}

interface AppliedCoupon {
    code: string;
    discount: number;
    type: string;
    name: string;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: CartItem, openCart?: boolean) => Promise<void>;
    removeFromCart: (cartId: string, id: string) => Promise<void>;
    updateQuantity: (cartItemId: string, id: string, newQuantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    isOpen: boolean;
    toggleCart: () => void;
    isLoading: boolean;
    refreshCart: () => Promise<void>;
    removingItemIds: string[];
    updatingItemIds: string[];
    shippingCharge: number;
    shippingType: string;
    cartTotal: number;
    grandTotal: number;
    totalDiscount: number;
    totalWeight: number;
    cartUuid: string;
    appliedCoupon: AppliedCoupon | null;
    couponDiscount: number;
    applyCoupon: (couponCode: string) => Promise<{ success: boolean; message: string }>;
    removeCoupon: () => Promise<{ success: boolean; message: string }>;
    isApplyingCoupon: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [removingItemIds, setRemovingItemIds] = useState<string[]>([]);
    const [updatingItemIds, setUpdatingItemIds] = useState<string[]>([]);
    const [shippingCharge, setShippingCharge] = useState<number>(0);
    const [shippingType, setShippingType] = useState<string>("");
    const [cartTotal, setCartTotal] = useState<number>(0);
    const [grandTotal, setGrandTotal] = useState<number>(0);
    const [totalDiscount, setTotalDiscount] = useState<number>(0);
    const [totalWeight, setTotalWeight] = useState<number>(0);
    const [cartUuid, setCartUuid] = useState<string>("");
    const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
    const [couponDiscount, setCouponDiscount] = useState<number>(0);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    const { isLoggedIn } = useAuth();
    const router = useRouter();

    const ensureGuestToken = async () => {
        if (isLoggedIn) return true;

        let token = Cookies.get("guest_token");
        if (!token) {
            try {
                // @ts-ignore
                const response = await fetchGuestToken({ skipAuthRedirect: true });
                if (response?.data?.guest_token) {
                    token = response.data.guest_token;
                    Cookies.set("guest_token", token as string, { expires: 7 });
                }
            } catch (error) {
                console.error("Failed to fetch guest token", error);
                return false;
            }
        }
        return !!token;
    };

    const fetchCartItems = async (showLoading: boolean = true) => {
        // Allow fetch if logged in OR if we have a guest session (which we will attempt to establish)
        // If not logged in, we try to ensure a guest token exists. 
        // If it doesn't and we can't get one, we probably shouldn't fetch cart yet or it will be empty default.

        if (!isLoggedIn) {
            const hasGuestToken = await ensureGuestToken();
            if (!hasGuestToken) return;
        }

        try {
            if (showLoading) {
                setIsLoading(true);
            }
            // @ts-ignore
            const data = await apiFetchCart({ skipAuthRedirect: true });

            // Check if data has 'data' property (if apiFetchCart returns full axios response) or if it IS the data object
            const cartData = data.data || data;

            if (cartData && Array.isArray(cartData.items)) {
                // Map items with new API structure
                const mappedItems = cartData.items.map((item: any) => ({
                    id: item.id?.toString(),
                    productUuid: item.productId || item.productUuid || item.uuid, // Product UUID for API calls
                    name: item.productName,
                    price: parseFloat(item.unitPrice || "0"),
                    originalPrice: parseFloat(item.originalPrice || item.unitPrice || "0"),
                    lineTotal: item.lineTotal || 0,
                    quantity: typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity) || 1,
                    image: item.baseImage || item.image || "/assets/images/product/1.jpg",
                    cartItemId: item.cartId?.toString(),
                    url: item.slug,
                    weight: item.weight,
                    category: item.category,
                    stock: item.stock ?? item.Product?.stock ?? 100 // Fallback to 100 if undefined, but try to get from item or relation
                }));

                // Set all cart-level data from API response
                setCartItems(mappedItems);
                setShippingCharge(cartData.shipping_charge || 0);
                setShippingType(cartData.shipping_type || "");
                setCartTotal(cartData.total || 0);
                setGrandTotal(cartData.grand_total || 0);
                setTotalDiscount(cartData.total_discount || 0);
                setTotalWeight(cartData.total_weight || 0);
                setCartUuid(cartData.cart_id || "");

                // Set coupon-related data if present (API returns 'coupons' array)
                if (cartData.coupons && Array.isArray(cartData.coupons) && cartData.coupons.length > 0) {
                    const coupon = cartData.coupons[0]; // Get the first applied coupon
                    setAppliedCoupon({
                        code: coupon.code || '',
                        discount: coupon.discountAmount || 0,
                        type: coupon.type || 'free_shipping', // Default to free_shipping if not provided
                        name: coupon.name || ''
                    });
                    setCouponDiscount(coupon.discountAmount || 0);
                } else {
                    setAppliedCoupon(null);
                    setCouponDiscount(0);
                }
            } else if (Array.isArray(cartData)) {
                // Fallback
                setCartItems(cartData);
            }

        } catch (error) {
            console.error("Failed to fetch cart", error);
        } finally {
            if (showLoading) {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        // Fetch cart on mount/auth change.
        // If not logged in, ensureGuestToken will be called inside fetchCartItems
        fetchCartItems();
    }, [isLoggedIn]);

    const addToCart = async (product: CartItem, openCart: boolean = true) => {
        if (!isLoggedIn) {
            const currentPath = window.location.pathname;
            router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
            return;
        }

        try {
            setIsLoading(true);
            // Construct payload for API
            const payload = [{
                productId: product.id,
                quantity: product.quantity.toString()
            }];

            await apiAddToCart(payload);

            // Refresh cart to get updated backend state
            await fetchCartItems();

            if (openCart) {
                setIsOpen(true); // Open cart sidebar
            }
            // toast.success("Added to cart");

        } catch (error) {
            console.error("Error adding to cart:", error);
            // toast.error("Failed to add to cart");
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromCart = async (cartId: string, id: string) => {
        try {
            setRemovingItemIds((prev) => [...prev, id]);
            await apiRemoveFromCart({ cartId, id });
            await fetchCartItems(false);
        } catch (error) {
            console.error("Error removing from cart:", error);
        } finally {
            setRemovingItemIds((prev) => prev.filter((itemId) => itemId !== id));
        }
    };

    const clearCart = async () => {
        try {
            setIsLoading(true);
            await apiClearCart();
            setCartItems([]);
            // toast.success("Cart cleared");
        } catch (error) {
            console.error("Error clearing cart:", error);
            // toast.error("Failed to clear cart");
        } finally {
            setIsLoading(false);
        }
    };

    const updateQuantity = async (cartItemId: string, id: string, newQuantity: number) => {
        if (newQuantity < 1) return; // Don't allow quantity less than 1
        try {
            setUpdatingItemIds((prev) => [...prev, id]);
            await apiUpdateQuantity(cartItemId, id, newQuantity);
            await fetchCartItems(false);
        } catch (error) {
            console.error("Error updating quantity:", error);
        } finally {
            setUpdatingItemIds((prev) => prev.filter((itemId) => itemId !== id));
        }
    };

    const toggleCart = () => setIsOpen((prev) => !prev);

    const refreshCart = fetchCartItems;

    const applyCoupon = async (couponCode: string): Promise<{ success: boolean; message: string }> => {
        try {
            setIsApplyingCoupon(true);
            await apiApplyCoupon(couponCode);
            await fetchCartItems(false);
            return { success: true, message: "Coupon applied successfully!" };
        } catch (error: any) {
            console.error("Error applying coupon:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Failed to apply coupon"
            };
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const removeCoupon = async (): Promise<{ success: boolean; message: string }> => {
        if (!appliedCoupon || !cartUuid) {
            return { success: false, message: "No coupon to remove" };
        }
        try {
            setIsApplyingCoupon(true);
            await apiRemoveCoupon(cartUuid, appliedCoupon.code);
            await fetchCartItems(false);
            return { success: true, message: "Coupon removed successfully!" };
        } catch (error: any) {
            console.error("Error removing coupon:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Failed to remove coupon"
            };
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            isOpen,
            toggleCart,
            isLoading,
            refreshCart,
            removingItemIds,
            updatingItemIds,
            shippingCharge,
            shippingType,
            cartTotal,
            grandTotal,
            totalDiscount,
            totalWeight,
            cartUuid,
            appliedCoupon,
            couponDiscount,
            applyCoupon,
            removeCoupon,
            isApplyingCoupon
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
