"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import { addToCart as apiAddToCart, fetchCart as apiFetchCart, removeFromCart as apiRemoveFromCart, clearCart as apiClearCart, fetchGuestToken } from "@/lib/apiItems";
import Cookies from "js-cookie";
// import { toast } from "sonner"; // Removed as not installed

export interface CartItem {
    id: string; // Product ID
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

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: CartItem, openCart?: boolean) => Promise<void>;
    removeFromCart: (cartId: string, id: string) => Promise<void>;
    clearCart: () => Promise<void>;
    isOpen: boolean;
    toggleCart: () => void;
    isLoading: boolean;
    refreshCart: () => Promise<void>;
    removingItemIds: string[];
    shippingCharge: number;
    shippingType: string;
    cartTotal: number;
    grandTotal: number;
    totalDiscount: number;
    totalWeight: number;
    cartUuid: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [removingItemIds, setRemovingItemIds] = useState<string[]>([]);
    const [shippingCharge, setShippingCharge] = useState<number>(0);
    const [shippingType, setShippingType] = useState<string>("");
    const [cartTotal, setCartTotal] = useState<number>(0);
    const [grandTotal, setGrandTotal] = useState<number>(0);
    const [totalDiscount, setTotalDiscount] = useState<number>(0);
    const [totalWeight, setTotalWeight] = useState<number>(0);
    const [cartUuid, setCartUuid] = useState<string>("");

    const { isLoggedIn } = useAuth();
    const router = useRouter();

    const ensureGuestToken = async () => {
        if (isLoggedIn) return true;

        let token = Cookies.get("guest_token");
        if (!token) {
            try {
                const response = await fetchGuestToken();
                if (response?.data?.guest_token) {
                    token = response.data.guest_token;
                    Cookies.set("guest_token", token as string, { expires: 7 }); // Expires in 7 days
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
            const data = await apiFetchCart();

            // Check if data has 'data' property (if apiFetchCart returns full axios response) or if it IS the data object
            const cartData = data.data || data;

            if (cartData && Array.isArray(cartData.items)) {
                // Map items with new API structure
                const mappedItems = cartData.items.map((item: any) => ({
                    id: item.id?.toString(),
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
            const hasGuestToken = await ensureGuestToken();
            if (!hasGuestToken) {
                // Could not get guest token, maybe redirect to login or show error
                // For now, let's try to proceed, likely will fail at API or be handled there
                console.error("Could not establish guest session");
                return;
            }
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

    const toggleCart = () => setIsOpen((prev) => !prev);

    const refreshCart = fetchCartItems;

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            clearCart,
            isOpen,
            toggleCart,
            isLoading,
            refreshCart,
            removingItemIds,
            shippingCharge,
            shippingType,
            cartTotal,
            grandTotal,
            totalDiscount,
            totalWeight,
            cartUuid
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
