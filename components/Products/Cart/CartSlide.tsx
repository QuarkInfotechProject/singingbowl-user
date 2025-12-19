"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartSheet() {
  const { cartItems, isOpen, toggleCart, removeFromCart, removingItemIds } = useCart();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="w-full flex flex-col bg-white sm:w-96">
        <SheetHeader className="border-b border-slate-200 pb-4">
          <SheetTitle
            className="text-2xl font-bold"
            style={{ color: "#A12717" }}
          >
            Shopping Cart
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {cartItems.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center">
              <p className="text-slate-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => {
                const isRemoving = removingItemIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`flex gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-sm relative ${isRemoving ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    {isRemoving && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-lg z-10">
                        <Loader2 className="w-5 h-5 text-[#A12717] animate-spin" />
                      </div>
                    )}
                    <Link href={item.url ? `/products/${item.url}` : "#"} className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-white block" onClick={toggleCart}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 80px, 80px"
                      />
                    </Link>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link href={item.url ? `/products/${item.url}` : "#"} onClick={toggleCart}>
                          <h3 className="font-semibold text-slate-900 line-clamp-2 hover:text-[#A12717] transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <p
                          className="mt-1 text-sm font-bold"
                          style={{ color: "#A12717" }}
                        >
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                        {(item.stock !== undefined && item.stock <= 0) && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>

                    {item.cartItemId && (
                      <button
                        onClick={() => removeFromCart(item.cartItemId!, item.id)}
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded transition-colors hover:bg-red-50 cursor-pointer"
                        aria-label="Remove item"
                      >
                        <X className="h-4 w-4 text-slate-400 hover:text-red-500" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <SheetFooter className="border-t border-slate-200 pt-4">
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
              <span className="text-lg font-semibold text-slate-900">
                Total Price:
              </span>
              <span
                className="text-2xl font-bold"
                style={{ color: "#A12717" }}
              >
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <Link href="/cart" onClick={toggleCart}>
              <Button
                className="w-full py-6 text-base font-semibold cursor-pointer transition-all duration-300 hover:shadow-lg"
                style={{ backgroundColor: "#39B856" }}
              >
                View Cart
              </Button>
            </Link>
            <Link href="/checkout" onClick={toggleCart}>
              <Button
                variant="outline"
                className="w-full py-6 text-base font-semibold"
              >
                Checkout
              </Button>
            </Link>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
