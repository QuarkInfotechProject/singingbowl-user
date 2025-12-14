"use client";

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const Cart = () => {
  const { cartItems } = useCart();

  // Calculate total number of items in cart
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div>
      <Link href="/cart">
        <div className="relative flex items-center gap-1 cursor-pointer">
          <div className="relative">
            <ShoppingCartOutlinedIcon />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#A12717] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </div>
          <span className="hidden sm:inline">Cart</span>
        </div>
      </Link>
    </div>
  );
};
export default Cart;
