"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export const AuthContent = ({ initialMode = "login", onClose, isModal = false }: AuthContentProps) => {
    const router = useRouter();
    const [mode, setMode] = useState<"login" | "signup" | "reset-password">(initialMode);
    const [resetEmail, setResetEmail] = useState("");

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

            if (onClose) onClose();
            else router.push("/"); // fallback for standalone
        } catch (err: any) {
            const errorMessage = err?.response?.data?.error || err?.response?.data?.message || err?.message || "An error occurred. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            await authService.googleSignIn();
            if (onClose) onClose();
            else router.push("/");
        } finally {
            setLoading(false);
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
                {mode !== "reset-password" && <ErrorAlert message={state.error} />}

                {mode === "login" ? (
                    <LoginForm
                        email={state.loginEmail}
                        password={state.loginPassword}
                        loading={state.loading}
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
