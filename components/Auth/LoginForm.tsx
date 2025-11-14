import { Button } from "@/components/ui/button";
import { EmailInput } from "./EmailInput";
import { PasswordInput } from "./PasswordInput";
import { GoogleSignIn } from "./GoogleSignIn";
import { AuthFormState } from "@/hooks/useAuthForm";

interface LoginFormProps {
  email: string;
  password: string;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  onGoogleSignIn: () => void;
}

export const LoginForm = ({
  email,
  password,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onGoogleSignIn,
}: LoginFormProps) => {
  return (
    <>
      <EmailInput value={email} onChange={onEmailChange} />
      <PasswordInput
        label="Password"
        value={password}
        onChange={onPasswordChange}
        id="login-password"
      />

      <Button
        onClick={onSubmit}
        className="w-full mt-4 bg-[#A12717] cursor-pointer hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 text-sm h-9"
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
