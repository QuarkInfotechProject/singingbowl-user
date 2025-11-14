import { Button } from "../ui/button";

interface ModeSwitchProps {
  isLogin: boolean;
  onSwitch: (mode: "login" | "signup") => void;
}

export const ModeSwitch = ({ isLogin, onSwitch }: ModeSwitchProps) => {
  return (
    <div className="text-center text-xs mt-4">
      <p className="text-gray-700">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <Button variant="outline"
          onClick={() => onSwitch(isLogin ? "signup" : "login")}
          className="text-[#A12717] cursor-pointer hover:underline font-semibold transition-colors border-none p-0 bg-transparent hover:bg-transparent"
        >
          {isLogin ? "Sign up" : "Sign in"}
        </Button>
      </p>
    </div>
  );
};
