"use client";

import { useState } from "react";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Truck,
  Lock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
  discount?: number;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Tibetan Brass Singing Bowl 7 inch",
      price: 89.99,
      quantity: 1,
      image: "/assets/images/product/1.jpg",
      stock: 15,
      discount: 10,
    },
    {
      id: "2",
      name: "Crystal Singing Bowl Set - Clear Quartz",
      price: 149.99,
      quantity: 1,
      image: "/assets/images/product/2.jpg",
      stock: 8,
      discount: 15,
    },
    {
      id: "3",
      name: "Chakra Singing Bowl Set - 7 Chakra Bowls",
      price: 199.99,
      quantity: 1,
      image: "/assets/images/product/3.jpg",
      stock: 5,
      discount: 20,
    },
    {
      id: "4",
      name: "Meditation Singing Bowl 5 inch",
      price: 59.99,
      quantity: 2,
      image: "/assets/images/product/4.jpg",
      stock: 25,
    },
    {
      id: "5",
      name: "Hand-Hammered Singing Bowl 8 inch",
      price: 129.99,
      quantity: 1,
      image: "/assets/images/product/5.jpg",
      stock: 12,
      discount: 12,
    },
    {
      id: "6",
      name: "Frosted Quartz Singing Bowl - Rose Quartz",
      price: 169.99,
      quantity: 1,
      image: "/assets/images/product/6.jpg",
      stock: 6,
    },
  ]);

  const updateQuantity = (id: string, change: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(
                1,
                Math.min(item.quantity + change, item.stock)
              ),
            }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.price * (1 - (item.discount || 0) / 100);
      return total + price * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const totalSavings = cartItems.reduce((savings, item) => {
    if (item.discount) {
      return savings + item.price * (item.discount / 100) * item.quantity;
    }
    return savings;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-slate-900">
                Shopping Cart
              </h1>
            </div>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
              {cartItems.length} items
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-xl text-slate-600">Your cart is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="relative flex-shrink-0 w-24 h-24 bg-slate-100 rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {item.discount && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                            -{item.discount}%
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-slate-900 text-lg">
                              {item.name}
                            </h3>
                            <p className="text-sm text-slate-500">
                              {item.stock > 0 ? (
                                <span className="text-green-600 font-medium">
                                  ✓ In Stock
                                </span>
                              ) : (
                                <span className="text-red-600 font-medium">
                                  Out of Stock
                                </span>
                              )}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex justify-between items-end">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-slate-900">
                                $
                                {(
                                  item.price *
                                  (1 - (item.discount || 0) / 100)
                                ).toFixed(2)}
                              </span>
                              {item.discount && (
                                <span className="text-sm text-slate-500 line-through">
                                  ${item.price.toFixed(2)}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              Subtotal: $
                              {(
                                item.price *
                                (1 - (item.discount || 0) / 100) *
                                item.quantity
                              ).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="mt-6 bg-white rounded-lg border border-slate-200 p-4">
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-slate-200 sticky top-24">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">
                    Order Summary
                  </h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal</span>
                      <span className="font-medium">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    {totalSavings > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Savings</span>
                        <span className="font-medium">
                          -${totalSavings.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-600">
                      <span className="flex items-center gap-1">
                        <Truck className="w-4 h-4" />
                        Shipping
                      </span>
                      <span className="font-medium">
                        {shipping === 0 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Tax</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-t border-blue-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-slate-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  <Link href="/checkout">
                    <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2 mb-3 shadow-lg hover:shadow-xl">
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </Link>

                  <button className="w-full border-2 border-slate-300 text-slate-700 font-semibold py-2 rounded-lg hover:bg-slate-50 transition-colors">
                    Continue Shopping
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="p-4 space-y-2 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span>Free shipping over $100</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="text-lg">✓</span>
                    <span>30-day money back guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
