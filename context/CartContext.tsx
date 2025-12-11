"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import { addToCart as apiAddToCart, fetchCart as apiFetchCart, removeFromCart as apiRemoveFromCart, clearCart as apiClearCart } from "@/lib/apiItems";
// import { toast } from "sonner"; // Removed as not installed

export interface CartItem {
    id: string; // Product ID
    cartItemId?: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    stock?: number;
    discount?: number;
    description?: string;
    url?: string;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: CartItem) => Promise<void>;
    removeFromCart: (cartId: string, id: string) => Promise<void>;
    clearCart: () => Promise<void>;
    isOpen: boolean;
    toggleCart: () => void;
    isLoading: boolean;
    refreshCart: () => Promise<void>;
    removingItemIds: string[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [removingItemIds, setRemovingItemIds] = useState<string[]>([]);

    const { isLoggedIn } = useAuth();
    const router = useRouter();

    const fetchCartItems = async (showLoading: boolean = true) => {
        if (!isLoggedIn) return;

        try {
            if (showLoading) {
                setIsLoading(true);
            }
            const data = await apiFetchCart();

            // Check if data has 'data' property (if apiFetchCart returns full axios response) or if it IS the data object
            const cartData = data.data || data;

            if (cartData && Array.isArray(cartData.items)) {
                // Determine structure of item
                const mappedItems = cartData.items.map((item: any) => ({
                    id: item.id?.toString(), // Use id from item, not productId if inconsistent
                    name: item.productName,
                    price: parseFloat(item.unitPrice || item.price || "0"), // Use unitPrice
                    quantity: item.quantity ? parseInt(item.quantity) : 1,
                    image: item.baseImage || item.image || "/assets/images/product/1.jpg",
                    cartItemId: item.cartId?.toString(),
                    url: item.slug
                }));
                setCartItems(mappedItems);
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
        if (isLoggedIn) {
            fetchCartItems();
        } else {
            setCartItems([]);
        }
    }, [isLoggedIn]);

    const addToCart = async (product: CartItem) => {
        if (!isLoggedIn) {
            router.push("/login");
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

            setIsOpen(true); // Open cart sidebar
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
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, isOpen, toggleCart, isLoading, refreshCart, removingItemIds }}>
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
