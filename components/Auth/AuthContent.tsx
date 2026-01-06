"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthForm } from "@/hooks/useAuthForm";
import { authService } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import { AuthHeader } from "./AuthHeader";
import { ErrorAlert } from "./ErrorAlert";
import { LoginForm } from "./LoginForm";
import { SignupEmailStep } from "./SignupEmailStep";
import { SignupDetailsStep } from "./SignupDetailsStep";
import { ModeSwitch } from "./ModeSwitch";

import { ResetPasswordForm } from "./ResetPasswordForm";

interface AuthContentProps {
    initialMode?: "login" | "signup";
    onClose?: () => void;
    isModal?: boolean;
}

// Inner component that uses useSearchParams (needs Suspense boundary)
const AuthContentInner = ({ initialMode = "login", onClose, isModal = false }: AuthContentProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [mode, setMode] = useState<"login" | "signup" | "reset-password">(initialMode);
    const [resetEmail, setResetEmail] = useState("");
    const [sessionExpiredMsg, setSessionExpiredMsg] = useState<string | null>(null);

    const [googleLoading, setGoogleLoading] = useState(false);

    const {
        state,
        updateField,
        resetForm,
        setError,
        setLoading,
        setSignupStep,
        setResendCountdown,
    } = useAuthForm();

    useEffect(() => {
        if (initialMode) {
            setMode(initialMode);
        }
    }, [initialMode]);

    // Check for session expired message from URL
    useEffect(() => {
        if (searchParams.get('expired') === 'true') {
            setSessionExpiredMsg('Your session has expired. Please log in again.');
        }
    }, [searchParams]);

    const handleModeSwitch = (newMode: "login" | "signup" | "reset-password") => {
        setMode(newMode);
        resetForm();

        // Only update URL for main login/signup switches if standalone
        if (!isModal && (newMode === "login" || newMode === "signup")) {
            router.push(`/${newMode}`);
        }
    };

    const { login: authLogin } = useAuth();

    // Login handlers
    const handleLoginSubmit = async () => {
        setError("");
        if (!state.loginEmail || !state.loginPassword) {
            setError("Please fill in all fields");
            return;
        }
        setLoading(true);
        try {
            const response = await authService.login(state.loginEmail, state.loginPassword);

            if (response.success && response.user) {
                authLogin(response.user);
            }

            if (onClose) {
                onClose();
            } else {
                // Force a hard reload to ensure cookies and new session state are correctly recognized
                // This fixes the issue where navigating to Cart immediately after login fails
                const redirectParams = new URLSearchParams(window.location.search);
                const redirectUrl = redirectParams.get('redirect') || '/';
                window.location.href = redirectUrl;
            }
        } catch (err: any) {
            const errorMessage = err?.response?.data?.error || err?.response?.data?.message || err?.message || "An error occurred. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        try {
            await authService.googleSignIn();
            if (onClose) onClose();
            else router.push("/");
        } finally {
            setGoogleLoading(false);
        }
    };

    // Signup handlers
    const handleSendOTP = async () => {
        setError("");
        if (!state.signupEmail) {
            setError("Please enter your email");
            return;
        }
        setLoading(true);
        try {
            await authService.sendOTP(state.signupEmail);
            setSignupStep("details");
            setResendCountdown(60);
        } catch (err: any) {
            const errorMessage = err?.response?.data?.error || err?.response?.data?.message || err?.message || "Failed to send OTP. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setError("");
        setLoading(true);
        try {
            await authService.resendOTP(state.signupEmail);
            setResendCountdown(60);
        } catch (err: any) {
            const errorMessage = err?.response?.data?.error || err?.response?.data?.message || err?.message || "Failed to resend OTP. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSignupSubmit = async () => {
        setError("");
        if (
            !state.username ||
            !state.phone ||
            !state.password ||
            !state.confirmPassword ||
            !state.otp
        ) {
            setError("Please fill in all fields");
            return;
        }
        if (state.password !== state.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            // Combine country code and phone number
            const fullPhone = `${state.countryCode} ${state.phone}`;
            const response = await authService.signup({
                email: state.signupEmail,
                username: state.username,
                phone: fullPhone,
                password: state.password,
                otp: state.otp,
            });

            if (response && response.success && response.user) {
                authLogin(response.user);
            }

            if (onClose) onClose();
            else router.push("/");
        } catch (err: any) {
            const errorMessage = err?.response?.data?.error || err?.response?.data?.message || err?.message || "An error occurred. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            {/* Only show AuthHeader for login/signup */}
            {(mode === "login" || mode === "signup") && (
                <AuthHeader isLogin={mode === "login"} />
            )}

            <div className="relative z-10 space-y-2 px-6 py-4">
                {sessionExpiredMsg && mode === "login" && (
                    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm flex items-center gap-2">
                        <span>⚠️</span> {sessionExpiredMsg}
                    </div>
                )}
                {mode !== "reset-password" && <ErrorAlert message={state.error} />}

                {mode === "login" ? (
                    <LoginForm
                        email={state.loginEmail}
                        password={state.loginPassword}
                        loading={state.loading}
                        googleLoading={googleLoading}
                        onEmailChange={(value) => updateField("loginEmail", value)}
                        onPasswordChange={(value) =>
                            updateField("loginPassword", value)
                        }
                        onSubmit={handleLoginSubmit}
                        onGoogleSignIn={handleGoogleSignIn}
                        onForgotPassword={async (email: string) => {
                            await authService.forgotPassword(email);
                        }}
                        onEnterVerificationCode={(email) => {
                            setResetEmail(email);
                            handleModeSwitch("reset-password");
                        }}
                    />
                ) : mode === "signup" ? (
                    <>
                        {state.signupStep === "email" ? (
                            <SignupEmailStep
                                email={state.signupEmail}
                                loading={state.loading}
                                onEmailChange={(value) => updateField("signupEmail", value)}
                                onSubmit={handleSendOTP}
                            />
                        ) : (
                            <SignupDetailsStep
                                email={state.signupEmail}
                                username={state.username}
                                phone={state.phone}
                                countryCode={state.countryCode}
                                password={state.password}
                                confirmPassword={state.confirmPassword}
                                otp={state.otp}
                                loading={state.loading}
                                resendCountdown={state.resendCountdown}
                                onUsernameChange={(value) => updateField("username", value)}
                                onPhoneChange={(value) => updateField("phone", value)}
                                onCountryCodeChange={(value) => updateField("countryCode", value)}
                                onPasswordChange={(value) => updateField("password", value)}
                                onConfirmPasswordChange={(value) =>
                                    updateField("confirmPassword", value)
                                }
                                onOtpChange={(value) => updateField("otp", value)}
                                onResendOTP={handleResendOTP}
                                onSubmit={handleSignupSubmit}
                            />
                        )}
                    </>
                ) : (
                    <ResetPasswordForm
                        email={resetEmail}
                        onBackToLogin={() => handleModeSwitch("login")}
                    />
                )}

                {(mode === "login" || mode === "signup") && (
                    <ModeSwitch isLogin={mode === "login"} onSwitch={() => handleModeSwitch(mode === "login" ? "signup" : "login")} />
                )}
            </div>
        </div>
    );
};

// Loading fallback for Suspense
const AuthContentLoading = () => (
    <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-[#A12717] rounded-full animate-spin" />
    </div>
);

// Exported wrapper with Suspense boundary
export const AuthContent = (props: AuthContentProps) => {
    return (
        <Suspense fallback={<AuthContentLoading />}>
            <AuthContentInner {...props} />
        </Suspense>
    );
};
