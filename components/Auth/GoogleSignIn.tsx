import { Button } from "@/components/ui/button";
import GoogleIcon from "@mui/icons-material/Google";

interface GoogleSignInProps {
  loading: boolean;
  onSignIn: () => void;
}

export const GoogleSignIn = ({ loading, onSignIn }: GoogleSignInProps) => {
  return (
    <Button
      onClick={onSignIn}
      variant="outline"
      className="w-full bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-900 font-medium text-sm py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md h-9"
      disabled={loading}
    >
      <GoogleIcon className="w-4 h-4 mr-2 text-[#A12717]" />
      Google
    </Button>
  );
};
