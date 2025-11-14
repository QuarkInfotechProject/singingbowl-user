import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface OTPFieldProps {
  otp: string;
  resendCountdown: number;
  onOtpChange: (value: string) => void;
  onResendOTP: () => void;
  loading: boolean;
}

export const OTPField = ({
  otp,
  resendCountdown,
  onOtpChange,
  onResendOTP,
  loading,
}: OTPFieldProps) => {
  return (
    <div className="col-span-2 space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="otp" className="text-gray-700 font-medium text-sm">
          OTP Verification
        </Label>
        <Button
          onClick={onResendOTP}
          variant="ghost"
          className="text-[#A12717] cursor-pointer font-medium text-xs py-0 px-2 h-auto disabled:opacity-50"
          disabled={resendCountdown > 0 || loading}
        >
          Resend Code
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Input
          id="otp"
          type="text"
          placeholder="000000"
          value={otp}
          onChange={(e) => onOtpChange(e.target.value.slice(0, 6))}
          maxLength={6}
          className="bg-gray-50 border-gray-300 focus:border-amber-400 focus:ring-amber-300 rounded-lg placeholder:text-gray-400 text-gray-900 text-xs h-8 tracking-widest text-center flex-1"
        />
        {resendCountdown > 0 && (
          <div className="text-xs text-gray-600 font-medium min-w-fit bg-gray-100 px-2 py-1 rounded">
            {resendCountdown}s
          </div>
        )}
      </div>
    </div>
  );
};
