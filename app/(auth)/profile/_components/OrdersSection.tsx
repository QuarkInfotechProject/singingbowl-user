"use client";

import React, { useState, useEffect } from "react";
import { Package, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchOrders } from "@/lib/apiItems";
import { Order } from "./types";

export default function OrdersSection() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersPage, setOrdersPage] = useState(1);
    const [ordersTotalPages, setOrdersTotalPages] = useState(1);

    useEffect(() => {
        loadOrders(ordersPage);
    }, [ordersPage]);

    const loadOrders = async (page: number = 1) => {
        try {
            setOrdersLoading(true);
            const res = await fetchOrders(page);
            if (res?.data?.data && Array.isArray(res.data.data)) {
                setOrders(res.data.data);
                setOrdersPage(res.data.current_page);
                setOrdersTotalPages(res.data.last_page);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error("Failed to load orders", error);
        } finally {
            setOrdersLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

            {ordersLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-12">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">You have no active orders</p>
                    <Link href="/products">
                        <Button className="mt-4 bg-blue-600 text-white hover:bg-blue-700">
                            Start Shopping
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="hidden md:grid grid-cols-5 gap-4 px-4 py-3 bg-gray-50 rounded-lg text-sm font-medium text-gray-500">
                        <div className="col-span-1">Order ID</div>
                        <div className="col-span-1">Date</div>
                        <div className="col-span-1">Status</div>
                        <div className="col-span-1">Total</div>
                        <div className="col-span-1 text-right">Items</div>
                    </div>

                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-100 rounded-lg hover:border-gray-300 transition-colors items-center"
                        >
                            <div className="col-span-1 font-medium text-gray-900 flex justify-between md:block">
                                <span className="md:hidden text-gray-500 font-normal">Order ID:</span>
                                #{order.id}
                            </div>
                            <div className="col-span-1 text-gray-600 flex justify-between md:block">
                                <span className="md:hidden text-gray-500">Date:</span>
                                {order.date}
                            </div>
                            <div className="col-span-1 flex justify-between md:block">
                                <span className="md:hidden text-gray-500">Status:</span>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === "Completed"
                                        ? "bg-green-100 text-green-700"
                                        : order.status === "Cancelled"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-blue-100 text-blue-700"
                                        }`}
                                >
                                    {order.status}
                                </span>
                            </div>
                            <div className="col-span-1 font-medium text-gray-900 flex justify-between md:block">
                                <span className="md:hidden text-gray-500">Total:</span>
                                $.{order.total}
                            </div>
                            <div className="col-span-1 text-gray-600 text-right flex justify-between md:block">
                                <span className="md:hidden text-gray-500">Items:</span>
                                {order.itemsCount} item(s)
                            </div>
                        </div>
                    ))}

                    {/* Pagination */}
                    {ordersTotalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                            <Button
                                variant="outline"
                                disabled={ordersPage === 1}
                                onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
                            >
                                Previous
                            </Button>
                            <span className="flex items-center px-4 text-sm text-gray-600">
                                Page {ordersPage} of {ordersTotalPages}
                            </span>
                            <Button
                                variant="outline"
                                disabled={ordersPage === ordersTotalPages}
                                onClick={() => setOrdersPage((p) => Math.min(ordersTotalPages, p + 1))}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
