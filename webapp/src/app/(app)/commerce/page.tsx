"use client";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import type { PaginatedResponse, Order, Product } from "@/types";
import Link from "next/link";

async function fetchCommerce() {
    const [products, orders] = await Promise.all([
        apiClient.get<PaginatedResponse<Product>>("/commerce/products/?page_size=10"),
        apiClient.get<PaginatedResponse<Order>>("/commerce/orders/?page_size=10"),
    ]);
    return { products: products.data, orders: orders.data };
}

export default function CommercePage() {
    const { data, isLoading } = useQuery({ queryKey: ["commerce"], queryFn: fetchCommerce });

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Commerce</h1>
            {isLoading ? <p className="text-gray-500">Loading…</p> : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Products */}
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-semibold text-gray-800">Products</h2>
                            <Link href="/commerce/products" className="text-sm text-primary-600 hover:underline">View all</Link>
                        </div>
                        <div className="bg-white rounded-2xl shadow overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                    <tr>
                                        {["Name", "SKU", "Price", "Stock"].map((h) => (
                                            <th key={h} className="px-4 py-3 font-medium">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {data?.products.results.map((p) => (
                                        <tr key={p.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium">{p.name}</td>
                                            <td className="px-4 py-3 text-gray-400 font-mono text-xs">{p.sku}</td>
                                            <td className="px-4 py-3">${parseFloat(p.price).toFixed(2)}</td>
                                            <td className="px-4 py-3">{p.stock}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                    {/* Orders */}
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
                            <Link href="/commerce/orders" className="text-sm text-primary-600 hover:underline">View all</Link>
                        </div>
                        <div className="bg-white rounded-2xl shadow overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                    <tr>
                                        {["Order #", "Status", "Amount", "Date"].map((h) => (
                                            <th key={h} className="px-4 py-3 font-medium">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {data?.orders.results.map((o) => (
                                        <tr key={o.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-mono text-xs">{o.order_number}</td>
                                            <td className="px-4 py-3 capitalize text-gray-600">{o.status}</td>
                                            <td className="px-4 py-3">${parseFloat(o.total_amount).toFixed(2)}</td>
                                            <td className="px-4 py-3 text-gray-400">{new Date(o.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}
