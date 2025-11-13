"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { X } from "lucide-react";

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      title: "Jambati Bowls",
      price: 199.99,
      quantity: 1,
      image: "/assets/images/product/1.jpg",
    },
  ]);

  const addToCart = () => {
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      <Button
        onClick={addToCart}
        className="flex-1 bg-[#A12717] hover:bg-[#A12717] cursor-pointer text-white rounded-full py-6 font-semibold text-base"
      >
        Add to cart
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-sm"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-white">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 80px, 80px"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900 line-clamp-2">
                          {item.title}
                        </h3>
                        <p
                          className="mt-1 text-sm font-bold"
                          style={{ color: "#A12717" }}
                        >
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded transition-colors hover:bg-red-50"
                      aria-label="Remove item"
                    >
                      <X className="h-4 w-4 text-slate-400 hover:text-red-500" />
                    </button>
                  </div>
                ))}
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

              <Button
                onClick={() => setIsOpen(false)}
                className="w-full py-6 text-base font-semibold transition-all duration-300 hover:shadow-lg"
                style={{ backgroundColor: "#39B856" }}
              >
                Checkout
              </Button>

              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="w-full py-6 text-base font-semibold"
              >
                Continue Shopping
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
