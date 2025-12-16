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
    <div className="overflow-x-hidden w-full px-2 md:px-20 mx-auto mb-2">
      <div className="flex items-center gap-4 md:justify-between ">
        <Link href="/">
          <Image
            src="/assets/images/logo/logo.png"
            alt="Logo"
            width={150}
            height={50}
          />
        </Link>
        <Search />
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link href="/profile">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 hover:opacity-70 text-black cursor-pointer bg-transparent hover:bg-transparent border-none p-0 transition"
                >
                  <PersonOutlineOutlinedIcon />
                  <p className="hidden sm:inline">{user?.name || "User"}</p>
                </Button>
              </Link>
            </div>
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
          <Cart />
        </div>
      </div>
    </div>
  );
};
export default Middlebar