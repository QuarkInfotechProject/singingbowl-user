import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmailDisplay } from "./EmailDisplay";
import { PasswordInput } from "./PasswordInput";
import { OTPField } from "./OTPField";

interface SignupDetailsStepProps {
  email: string;
  username: string;
  phone: string;
  password: string;
  confirmPassword: string;
  otp: string;
  loading: boolean;
  resendCountdown: number;
  onUsernameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onOtpChange: (value: string) => void;
  onResendOTP: () => void;
  onSubmit: () => void;
}

export const SignupDetailsStep = ({
  email,
  username,
  phone,
  password,
  confirmPassword,
  otp,
  loading,
  resendCountdown,
  onUsernameChange,
  onPhoneChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onOtpChange,
  onResendOTP,
  onSubmit,
}: SignupDetailsStepProps) => {
  return (
    <>
      <EmailDisplay email={email} />

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label
            htmlFor="username"
            className="text-gray-700 font-medium text-sm"
          >
            Username
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="Your name"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            className="bg-gray-50 border-gray-300 focus:border-amber-400 focus:ring-amber-300 rounded-lg placeholder:text-gray-400 text-gray-900 text-xs h-8"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-gray-700 font-medium text-sm">
            Phone
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+977 9874563210"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className="bg-gray-50 border-gray-300 focus:border-amber-400 focus:ring-amber-300 rounded-lg placeholder:text-gray-400 text-gray-900 text-xs h-8"
          />
        </div>

        <PasswordInput
          label="Password"
          value={password}
          onChange={onPasswordChange}
          id="signup-password"
        />

        <PasswordInput
          label="Confirm Password"
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
          id="confirm-password"
        />

        <OTPField
          otp={otp}
          resendCountdown={resendCountdown}
          onOtpChange={onOtpChange}
          onResendOTP={onResendOTP}
          loading={loading}
        />
      </div>

      <Button
        onClick={onSubmit}
        className="w-full mt-4 bg-[#A12717] cursor-pointer text-white font-semibold py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 text-sm h-9"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Account"}
      </Button>
    </>
  );
};
