"use client";

import { useState, useEffect } from "react";
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

interface AuthContentProps {
    initialMode?: "login" | "signup";
    onClose?: () => void;
    isModal?: boolean;
}

export const AuthContent = ({ initialMode = "login", onClose, isModal = false }: AuthContentProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLogin, setIsLogin] = useState(initialMode === "login");

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
            setIsLogin(initialMode === "login");
        }
    }, [initialMode]);

    const handleModeSwitch = (mode: "login" | "signup") => {
        setIsLogin(mode === "login");
        resetForm();

        // If not a modal (standalone page), we might want to actually navigate?
        // But for intercepting routes, switching mode inside the modal is often preferred to keep the background the same.
        // However, if we want to update URL:
        if (isModal) {
            // logic for modal switching if we want to change URL
            // For now, let's just switch state locally to be smooth
        } else {
            // If standalone, navigate to the other page
            router.push(`/${mode}`);
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
        } catch (err) {
            setError("An error occurred. Please try again.");
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
        } catch (err) {
            setError("Failed to send OTP. Please try again.");
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
        } catch (err) {
            setError("Failed to resend OTP. Please try again.");
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
            const response = await authService.signup({
                email: state.signupEmail,
                username: state.username,
                phone: state.phone,
                password: state.password,
                otp: state.otp,
            });

            if (response && response.success && response.user) {
                authLogin(response.user);
            }

            if (onClose) onClose();
            else router.push("/");
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full opacity-30 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-100 to-amber-100 rounded-full opacity-30 blur-3xl" />

            <AuthHeader isLogin={isLogin} />

            <div className="relative z-10 space-y-4 px-6 py-6">
                <ErrorAlert message={state.error} />

                {isLogin ? (
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
                    />
                ) : (
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
                                password={state.password}
                                confirmPassword={state.confirmPassword}
                                otp={state.otp}
                                loading={state.loading}
                                resendCountdown={state.resendCountdown}
                                onUsernameChange={(value) => updateField("username", value)}
                                onPhoneChange={(value) => updateField("phone", value)}
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
                )}

                <ModeSwitch isLogin={isLogin} onSwitch={handleModeSwitch} />
            </div>
        </div>
    );
};
