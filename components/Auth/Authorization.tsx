"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuthForm } from "@/hooks/useAuthForm";
import { authService } from "@/services/authService";
import { AuthHeader } from "./AuthHeader";
import { ErrorAlert } from "./ErrorAlert";
import { LoginForm } from "./LoginForm";
import { SignupEmailStep } from "./SignupEmailStep";
import { SignupDetailsStep } from "./SignupDetailsStep";
import { ModeSwitch } from "./ModeSwitch";
import { Button } from "../ui/button";

// Separate component that uses useSearchParams
const AuthorizationContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [open, setOpen] = useState(false);
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
    const mode = searchParams.get("mode");
    if (mode === "login" || mode === "signup") {
      setOpen(true);
      setIsLogin(mode === "login");
    }
  }, [searchParams]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      const pathWithoutQuery = window.location.pathname;
      router.push(pathWithoutQuery);
      resetForm();
    }
  };

  const handleModeSwitch = (mode: "login" | "signup") => {
    setIsLogin(mode === "login");
    resetForm();
    const currentPath = window.location.pathname;
    router.push(`${currentPath}?mode=${mode}`);
  };

  // Login handlers
  const handleLoginSubmit = async () => {
    setError("");
    if (!state.loginEmail || !state.loginPassword) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await authService.login(state.loginEmail, state.loginPassword);
      handleOpenChange(false);
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
      handleOpenChange(false);
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
      await authService.signup({
        email: state.signupEmail,
        username: state.username,
        phone: state.phone,
        password: state.password,
        otp: state.otp,
      });
      handleOpenChange(false);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
          const currentPath = window.location.pathname;
          router.push(`${currentPath}?mode=login`);
        }}
        className="flex items-center gap-2 hover:opacity-70 text-black cursor-pointer bg-transparent hover:bg-transparent border-none p-0 transition"
      >
        <PersonOutlineOutlinedIcon />
        <p className="hidden sm:inline">Login/Signup</p>
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[420px] border-0 bg-white shadow-2xl overflow-hidden p-0">
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
        </DialogContent>
      </Dialog>
    </>
  );
};

const Authorization = () => {
  return (
    <Suspense fallback={null}>
      <AuthorizationContent />
    </Suspense>
  );
};

export default Authorization;
