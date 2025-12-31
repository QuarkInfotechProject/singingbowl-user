"use client";

import { useCart } from "@/context/CartContext";
import {
  Trash2,
  ShoppingBag,
  Truck,
  Lock,
  ArrowRight,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";

const Cart = () => {
  const {
    cartItems,
    isLoading,
    removeFromCart,
    removingItemIds,
    cartTotal,
    grandTotal,
    shippingCharge,
    shippingType,
    totalDiscount
  } = useCart();

  // Separate cart items into in-stock and out-of-stock
  const { inStockItems, outOfStockItems } = useMemo(() => {
    const inStock = cartItems.filter(item => item.stock !== undefined && item.stock > 0);
    const outOfStock = cartItems.filter(item => item.stock !== undefined && item.stock <= 0);
    return { inStockItems: inStock, outOfStockItems: outOfStock };
  }, [cartItems]);

  // Calculate total savings from items where originalPrice > price (only in-stock items)
  const totalSavings = inStockItems.reduce((savings, item) => {
    if (item.originalPrice > item.price) {
      return savings + (item.originalPrice - item.price) * item.quantity;
    }
    return savings;
  }, 0);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading cart...</div>
  }

  // Cart Item Component for reuse
  const CartItemCard = ({ item, isOutOfStock = false }: { item: typeof cartItems[0], isOutOfStock?: boolean }) => {
    const isRemoving = removingItemIds.includes(item.id);

    return (
      <div
        key={item.id}
        className={`bg-white rounded-lg border p-4 transition-all relative ${isOutOfStock
          ? 'border-red-200 bg-red-50/50 opacity-75'
          : 'border-slate-200 hover:shadow-lg'
          } ${isRemoving ? 'opacity-50 pointer-events-none' : ''}`}
      >
        {isRemoving && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-lg z-10">
            <Loader2 className="w-6 h-6 text-[#A12717] animate-spin" />
          </div>
        )}
        <div className="flex gap-4">
          {/* Product Image */}
          <Link
            href={item.url ? `/products/${item.url}` : "#"}
            className={`relative flex-shrink-0 w-24 h-24 bg-slate-100 rounded-lg overflow-hidden block ${isOutOfStock ? 'grayscale' : ''
              }`}
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
            {!isOutOfStock && item.originalPrice > item.price && (
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
              </div>
            )}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                  Out of Stock
                </span>
              </div>
            )}
          </Link>

          {/* Product Details */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <Link href={item.url ? `/products/${item.url}` : "#"}>
                  <h3 className={`font-semibold text-lg transition-colors ${isOutOfStock
                    ? 'text-slate-500'
                    : 'text-slate-900 hover:text-[#A12717]'
                    }`}>
                    {item.name}
                  </h3>
                </Link>
                <p className="text-sm">
                  {isOutOfStock ? (
                    <span className="text-red-600 font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Out of Stock
                    </span>
                  ) : (
                    <span className="text-green-600 font-medium">
                      ✓ In Stock
                    </span>
                  )}
                </p>
              </div>
              {item.cartItemId && (
                <button
                  onClick={() => removeFromCart(item.cartItemId!, item.id)}
                  className="text-slate-400 hover:text-red-500 cursor-pointer transition-colors p-1"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Price and Quantity */}
            <div className="flex justify-between items-end">
              <div>
                <div className={`flex items-center gap-2 ${isOutOfStock ? 'opacity-60' : ''}`}>
                  <span className={`text-lg font-bold ${isOutOfStock ? 'text-slate-500' : 'text-slate-900'}`}>
                    ${item.price.toFixed(2)}
                  </span>
                  {item.originalPrice > item.price && (
                    <span className="text-sm text-slate-500 line-through">
                      ${item.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <p className={`text-sm mt-1 ${isOutOfStock ? 'text-slate-400' : 'text-gray-500'}`}>
                  Qty: {item.quantity}
                  {item.weight && (
                    <span className="ml-2 text-slate-500">
                      • Weight: {item.weight}kg
                    </span>
                  )}
                </p>
                {!isOutOfStock && (
                  <p className="text-sm font-medium text-slate-700 mt-1">
                    Line Total: ${item.lineTotal.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-[#A12717]" />
              <h1 className="text-3xl font-bold text-slate-900">
                Shopping Cart
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-[#A12717] text-white px-3 py-1 rounded-full text-sm font-semibold">
                {inStockItems.length} items
              </span>
              {outOfStockItems.length > 0 && (
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {outOfStockItems.length} unavailable
                </span>
              )}
            </div>
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
              {/* In-Stock Items Section */}
              {inStockItems.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Available Items ({inStockItems.length})
                  </h2>
                  {inStockItems.map((item) => (
                    <CartItemCard key={item.id} item={item} isOutOfStock={false} />
                  ))}
                </div>
              )}

              {/* Out-of-Stock Items Section */}
              {outOfStockItems.length > 0 && (
                <div className="space-y-4 mt-8">
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <div>
                      <h2 className="text-lg font-semibold text-red-700">
                        Out of Stock Items ({outOfStockItems.length})
                      </h2>
                      <p className="text-sm text-red-600">
                        These items are currently unavailable and will not be included in your order.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {outOfStockItems.map((item) => (
                      <CartItemCard key={item.id} item={item} isOutOfStock={true} />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty In-Stock Items Message */}
              {inStockItems.length === 0 && outOfStockItems.length > 0 && (
                <div className="text-center py-8 bg-amber-50 border border-amber-200 rounded-lg mb-8">
                  <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                  <p className="text-lg font-medium text-amber-700">
                    All items in your cart are out of stock
                  </p>
                  <p className="text-sm text-amber-600 mt-1">
                    Please remove these items and add new products to proceed.
                  </p>
                  <Link href="/products">
                    <button className="mt-4 px-6 py-2 bg-[#A12717] text-white rounded-lg font-medium hover:bg-[#8a2015] transition-colors">
                      Browse Products
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-slate-200 sticky top-24">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900">
                    Order Summary
                  </h2>

                  <div className="space-y-3 text-sm mt-4">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal ({inStockItems.length} items)</span>
                      <span className="font-medium">
                        ${cartTotal.toFixed(2)}
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
                    {totalDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span className="font-medium">
                          -${totalDiscount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-600">
                      <span className="flex items-center gap-1">
                        <Truck className="w-4 h-4" />
                        <span>Standard shipping rate from Nepal</span>
                      </span>
                      <span className="font-medium">
                        {shippingCharge === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          `$${shippingCharge.toFixed(2)}`
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-[#A12717]/5 to-indigo-50 border-t border-[#A12717]">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-slate-900">
                      Grand Total
                    </span>
                    <span className="text-2xl font-bold text-[#A12717]">
                      ${grandTotal.toFixed(2)}
                    </span>
                  </div>

                  {outOfStockItems.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                      <p className="text-xs text-amber-700">
                        <strong>Note:</strong> {outOfStockItems.length} item(s) in your cart are out of stock and will not be included in checkout.
                      </p>
                    </div>
                  )}

                  {inStockItems.length > 0 ? (
                    <Link href="/checkout">
                      <button className="w-full cursor-pointer bg-gradient-to-r from-[#A12717] to-[#A12717] text-white font-semibold py-3 rounded-lg hover:from-[#8a2015] hover:to-[#8a2015] transition-all flex items-center justify-center gap-2 mb-3 shadow-lg hover:shadow-xl">
                        Proceed to Checkout
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-slate-300 text-slate-500 font-semibold py-3 rounded-lg cursor-not-allowed flex items-center justify-center gap-2 mb-3"
                    >
                      No Items Available
                    </button>
                  )}
                  <Link href="/products">
                    <button className="w-full border-2 border-slate-300 text-slate-700 font-semibold py-2 rounded-lg hover:bg-slate-50 transition-colors">
                      Continue Shopping
                    </button>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="p-4 space-y-2 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span>Secure checkout</span>
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
