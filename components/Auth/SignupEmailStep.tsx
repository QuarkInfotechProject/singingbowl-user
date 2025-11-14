import { Button } from "@/components/ui/button";
import { EmailInput } from "./EmailInput";

interface SignupEmailStepProps {
  email: string;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
}

export const SignupEmailStep = ({
  email,
  loading,
  onEmailChange,
  onSubmit,
}: SignupEmailStepProps) => {
  return (
    <>
      <EmailInput value={email} onChange={onEmailChange} />

      <Button
        onClick={onSubmit}
        className="w-full mt-4 bg-[#A12717] cursor-pointer text-white font-semibold py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 text-sm h-9"
        disabled={loading}
      >
        {loading ? "Sending..." : "Continue"}
      </Button>
    </>
  );
};
