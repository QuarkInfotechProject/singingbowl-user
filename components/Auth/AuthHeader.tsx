import Image from "next/image";

interface AuthHeaderProps {
  isLogin: boolean;
}

export const AuthHeader = ({ isLogin }: AuthHeaderProps) => {
  return (
    <div className="relative z-10 pb-4 pt-6 px-6 border-b border-amber-100">
      <div className="flex items-center justify-center mb-3">
        <div className="w-20 h-20 rounded-full flex items-center justify-center">
          {/* <div className="text-xl">🥣</div> */}
          <Image src="/assets/logo/logo.webp" alt="singing bowl village logo" width={50} height={50} className="w-full rounded-full"/>
        
        </div>
      </div>
      <h2 className="text-center text-xl font-semibold bg-gradient-to-r from-amber-900 to-orange-700 bg-clip-text text-transparent">
        {isLogin ? "Welcome Back" : "Join Our Community"}
      </h2>
      <p className="text-center text-xs text-gray-600 mt-1 font-light">
        {isLogin
          ? "Find your inner peace and harmony"
          : "Begin your journey to tranquility"}
      </p>
    </div>
  );
};
