import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EmailInput } from "./EmailInput";
import { PasswordInput } from "./PasswordInput";
import { GoogleSignIn } from "./GoogleSignIn";

interface LoginFormProps {
  email: string;
  password: string;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  onGoogleSignIn: () => void;
  onForgotPassword: (email: string) => Promise<void>;
}

export const LoginForm = ({
  email,
  password,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onGoogleSignIn,
  onForgotPassword,
}: LoginFormProps) => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState("");

  const handleForgotSubmit = async () => {
    if (!forgotEmail) {
      setForgotError("Please enter your email");
      return;
    }
    setForgotError("");
    setForgotLoading(true);
    try {
      await onForgotPassword(forgotEmail);
      setForgotSuccess(true);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to send reset email. Please try again.";
      setForgotError(errorMessage);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setForgotEmail("");
    setForgotSuccess(false);
    setForgotError("");
  };

  if (showForgotPassword) {
    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Forgot Password</h3>
          <p className="text-sm text-gray-600 mt-1">
            Enter your email to receive a password reset link
          </p>
        </div>

        {forgotSuccess ? (
          <div className="text-center space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 text-sm">
                Password reset instructions have been sent to your email.
              </p>
            </div>
            <Button
              onClick={handleBackToLogin}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Back to Sign In
            </Button>
          </div>
        ) : (
          <>
            {forgotError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{forgotError}</p>
              </div>
            )}

            <EmailInput value={forgotEmail} onChange={setForgotEmail} />

            <Button
              onClick={handleForgotSubmit}
              className="w-full bg-[#A12717] cursor-pointer hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 text-sm h-9"
              disabled={forgotLoading}
            >
              {forgotLoading ? "Sending..." : "Send Reset Link"}
            </Button>

            <button
              onClick={handleBackToLogin}
              className="w-full text-sm text-gray-600 hover:text-[#A12717] transition-colors"
            >
              ← Back to Sign In
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <EmailInput value={email} onChange={onEmailChange} />
      <PasswordInput
        label="Password"
        value={password}
        onChange={onPasswordChange}
        id="login-password"
      />

      <div className="flex justify-end mt-1">
        <button
          type="button"
          onClick={() => setShowForgotPassword(true)}
          className="text-sm text-[#A12717] hover:text-amber-700 hover:underline transition-colors"
        >
          Forgot Password?
        </button>
      </div>

      <Button
        onClick={onSubmit}
        className="w-full mt-3 bg-[#A12717] cursor-pointer hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 text-sm h-9"
        disabled={loading}
      >
        {loading ? "Loading..." : "Sign In"}
      </Button>

      <div className="relative my-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-xs text-gray-600 font-medium">or</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>
      </div>

      <GoogleSignIn loading={loading} onSignIn={onGoogleSignIn} />
    </>
  );
};
