"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Cookies from "js-cookie";

interface User {
    name: string;
    userId: string;
    isUserLoggedIn: boolean;
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    login: (userData: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing login on mount
        const checkLoginStatus = async () => {
            const loggedInCookie = Cookies.get("isLoggedIn");

            if (loggedInCookie === "true") {
                setIsLoggedIn(true);
                // Try to get from local storage first for immediate UI
                const storedUser = localStorage.getItem("user_data");
                if (storedUser) {
                    try {
                        setUser(JSON.parse(storedUser));
                    } catch (e) {
                        console.error("Failed to parse user data", e);
                    }
                }

                // Always fetch fresh profile data to ensure syncing (especially after Google Login redirect)
                try {
                    const { fetchUserProfile } = await import("@/lib/apiItems");
                    const res = await fetchUserProfile();
                    if (res?.data) {
                        const userData: User = {
                            name: res.data.fullName,
                            userId: res.data.id || res.data.userId || "", // Handle potential ID field names
                            isUserLoggedIn: true
                        };
                        setUser(userData);
                        localStorage.setItem("user_data", JSON.stringify(userData));
                    }
                } catch (error) {
                    console.error("Failed to sync user profile", error);
                    // If fetch fails but cookie exists, we might want to logout or just stay in 'maybe logged in' state
                    // For now, keeping it simple - if fetch fails, we rely on storedUser or just isLoggedIn=true
                }
            }
            setIsLoading(false);
        };

        checkLoginStatus();
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        setIsLoggedIn(true);
        localStorage.setItem("user_data", JSON.stringify(userData));
        // Cookies are set by the API route response (httpOnly token + isLoggedIn)
        // We just need to sync the client state.
    };

    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem("user_data");
        // We should also call the logout API to clear cookies
        // fetch("/api/user/auth/logout", { method: "POST" });
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
