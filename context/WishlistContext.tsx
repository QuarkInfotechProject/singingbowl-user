"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { fetchWishlist, addToWishlist, removeFromWishlist } from "@/lib/apiItems";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface WishlistContextType {
    wishlistIds: string[];
    isInWishlist: (productId: string) => boolean;
    toggleWishlist: (productId: string) => Promise<void>;
    removeFromWishlistById: (productId: string) => Promise<void>;
    isLoading: boolean;
    loadingProductId: string | null;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
    const [wishlistIds, setWishlistIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
    const { isLoggedIn, isLoading: authLoading } = useAuth();

    // Fetch wishlist when user logs in (wait for auth to finish loading first)
    useEffect(() => {
        const loadWishlist = async () => {
            // Wait for auth to finish loading before making decision
            if (authLoading) {
                return;
            }

            if (!isLoggedIn) {
                setWishlistIds([]);
                return;
            }

            try {
                setIsLoading(true);
                const res = await fetchWishlist();
                console.log("Wishlist API response:", res);
                const items = res?.data || res || [];
                if (Array.isArray(items)) {
                    // API returns 'id' field, not 'uuid' for wishlist items
                    const ids = items.map((item: any) => item.id);
                    console.log("Wishlist IDs loaded:", ids);
                    setWishlistIds(ids);
                }
            } catch (error) {
                console.error("Failed to load wishlist", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadWishlist();
    }, [isLoggedIn, authLoading]);

    const isInWishlist = useCallback((productId: string) => {
        return wishlistIds.includes(productId);
    }, [wishlistIds]);

    const toggleWishlist = async (productId: string) => {
        // Prevent unauthorized users
        if (!isLoggedIn) {
            toast.error("Please login to add items to wishlist");
            return;
        }

        if (loadingProductId) return; // Prevent multiple simultaneous toggles

        try {
            setLoadingProductId(productId);
            if (isInWishlist(productId)) {
                // Remove from wishlist
                await removeFromWishlist(productId);
                setWishlistIds((prev) => prev.filter((id) => id !== productId));
                toast.success("Removed from wishlist!");
            } else {
                // Add to wishlist
                await addToWishlist(productId);
                setWishlistIds((prev) => [...prev, productId]);
                toast.success("Added to wishlist!");
            }
        } catch (error) {
            console.error("Failed to toggle wishlist", error);
            toast.error("Failed to update wishlist");
        } finally {
            setLoadingProductId(null);
        }
    };

    const removeFromWishlistById = async (productId: string) => {
        // Prevent unauthorized users
        if (!isLoggedIn) {
            toast.error("Please login first");
            return;
        }

        if (loadingProductId) return;

        try {
            setLoadingProductId(productId);
            await removeFromWishlist(productId);
            setWishlistIds((prev) => prev.filter((id) => id !== productId));
            toast.success("Removed from wishlist!");
        } catch (error) {
            console.error("Failed to remove from wishlist", error);
            toast.error("Failed to remove from wishlist");
        } finally {
            setLoadingProductId(null);
        }
    };

    return (
        <WishlistContext.Provider value={{
            wishlistIds,
            isInWishlist,
            toggleWishlist,
            removeFromWishlistById,
            isLoading,
            loadingProductId
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};

