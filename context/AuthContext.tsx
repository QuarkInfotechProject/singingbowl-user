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
        const checkLoginStatus = () => {
            const loggedInCookie = Cookies.get("isLoggedIn");
            // Since we can't easily get the full user object from just "isLoggedIn=true" cookie 
            // without an API call, we might rely on localStorage or just decode token if available.
            // For now, let's try to get more info or at least set state to true if cookie exists.
            // However, the best practice is often to fetch /me or similar. 
            // But based on the token response provided by user, the user object IS returned on login.
            // We should persist this user object. LocalStorage is common for non-sensitive user info.

            if (loggedInCookie === "true") {
                setIsLoggedIn(true);
                const storedUser = localStorage.getItem("user_data");
                if (storedUser) {
                    try {
                        setUser(JSON.parse(storedUser));
                    } catch (e) {
                        console.error("Failed to parse user data", e);
                    }
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
