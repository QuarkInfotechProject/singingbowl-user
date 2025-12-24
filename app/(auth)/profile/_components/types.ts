// Shared types for profile components

export interface PurchaseItem {
    orderItemId: number;
    productId: string;
    name: string;
    slug: string;
    quantity: number;
    unitPrice: string;
    lineTotal: string;
    baseImage: string;
    isReviewed: boolean;
}

export interface WishlistItem {
    uuid: string;
    productName: string;
    slug?: string;
    url?: string;
    originalPrice: string;
    specialPrice?: string;
    baseImage?: string;
}

export interface Order {
    id: number | string;
    date: string;
    status: string;
    total: string;
    itemsCount: number;
}

export interface ProfileFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profilePicture: string;
}

export interface PasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ReviewData {
    rating: number;
    comment: string;
}

export type ActiveSection = "profile" | "orders" | "history" | "wishlist" | "address" | "password";
