"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/Auth/PasswordInput";
import { authService } from "@/services/authService";
import { Loader2, CheckCircle, Lock } from "lucide-react";
import { toast } from "sonner";

interface ResetPasswordFormProps {
    token?: string;
    email?: string;
    onBackToLogin?: () => void;
    onSuccess?: () => void;
}

export function ResetPasswordForm({ token: initialToken, email: initialEmail, onBackToLogin, onSuccess }: ResetPasswordFormProps) {
    const [token, setToken] = useState(initialToken || "");
    const [email, setEmail] = useState(initialEmail || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("Please enter your email.");
            return;
        }

        if (!token) {
            setError("Please enter the verification code.");
            return;
        }

        if (!password || !confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword(email, token, password, confirmPassword);
            setSuccess(true);
            toast.success("Password reset successfully!");
            if (onSuccess) onSuccess();
        } catch (err: any) {
            const errorMessage = err?.response?.data?.error || err?.response?.data?.message || err?.message || "Failed to reset password. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h1>
                <p className="text-gray-600 mb-6">
                    Your password has been reset successfully. You can now sign in with your new password.
                </p>
                {onBackToLogin && (
                    <Button
                        onClick={onBackToLogin}
                        className="w-full bg-[#A12717] hover:bg-[#8a2113] text-white font-semibold py-3 rounded-lg border-0 cursor-pointer"
                    >
                        Back to Login
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-[#A12717]" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Reset Your Password</h1>
                <p className="text-gray-600 mt-2">Enter the code from your email and your new password</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {!initialEmail && (
                    <div className="space-y-2">
                        <label className="text-gray-700 font-medium text-sm">Email Address</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A12717] focus:border-transparent transition-all"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-gray-700 font-medium text-sm">Verification Code</label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A12717] focus:border-transparent transition-all"
                        placeholder="Enter 6-digit code"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        required
                    />
                </div>

                <PasswordInput
                    id="reset-password"
                    label="New Password"
                    value={password}
                    onChange={setPassword}
                />

                <PasswordInput
                    id="reset-confirm-password"
                    label="Confirm Password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                />

                <Button
                    type="submit"
                    className="w-full bg-[#A12717] hover:bg-[#8a2113] text-white font-semibold py-3 rounded-lg transition-all border-0 shadow-lg hover:shadow-xl cursor-pointer"
                    disabled={loading}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Resetting...
                        </span>
                    ) : (
                        "Reset Password"
                    )}
                </Button>
            </form>

            <div className="mt-6 text-center">
                {onBackToLogin && (
                    <button
                        onClick={onBackToLogin}
                        className="text-sm text-gray-600 hover:text-[#A12717] transition-colors cursor-pointer hover:underline"
                    >
                        ← Back to Sign In
                    </button>
                )}
            </div>
        </div>
    );
}
