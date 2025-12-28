"use client";

import Image from "next/image";
import Search from "../Searchsection/Search";
import Cart from "../CartComponent/Cart";
import Link from "next/link";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";


const Middlebar = () => {
  const { isLoggedIn, user } = useAuth();

  return (
    <div className="w-full px-2 md:px-20 mx-auto mb-2">
      <div className="flex items-center justify-between">
        {/* Logo on the left */}
        <Link href="/">
          <Image
            src="/assets/images/logo/logo.png"
            alt="Logo"
            width={150}
            height={50}
          />
        </Link>

        {/* Search (desktop) - centered */}
        <div className="hidden md:block flex-1 max-w-3xl mx-8">
          <Search />
        </div>

        {/* Search, Profile, and Cart grouped together on the right */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile Search Icon */}
          <div className="md:hidden">
            <Search />
          </div>

          {/* Profile/Login */}
          {isLoggedIn ? (
            <Link href="/profile">
              <Button
                variant="ghost"
                className="flex items-center gap-2 hover:opacity-70 text-black cursor-pointer bg-transparent hover:bg-transparent border-none p-0 transition"
              >
                <PersonOutlineOutlinedIcon />
                <p className="hidden sm:inline">{user?.name || "User"}</p>
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button
                variant="ghost"
                className="flex items-center gap-2 hover:opacity-70 text-black cursor-pointer bg-transparent hover:bg-transparent border-none p-0 transition"
              >
                <PersonOutlineOutlinedIcon />
                <p className="hidden sm:inline">Login/Signup</p>
              </Button>
            </Link>
          )}

          {/* Cart */}
          <Cart />
        </div>
      </div>
    </div>
  );
};
export default Middlebar