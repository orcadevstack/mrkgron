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
        <div className="space-y-6">
            <section className="app-surface p-8 lg:p-10">
                <p className="page-eyebrow">Commerce</p>
                <h2 className="page-title">Retail operations snapshot</h2>
                <p className="page-copy">Stay close to catalog and order activity without breaking visual consistency across the workspace.</p>
            </section>
            {isLoading ? <p className="app-panel px-6 py-10 text-sm text-slate-500">Loading commerce data...</p> : (
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Products */}
                    <section id="products">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-semibold text-brand-dark">Products</h2>
                            <Link href="/commerce/products" className="text-sm font-semibold text-brand-accent hover:text-brand-blue">View all</Link>
                        </div>
                        <div className="app-panel overflow-hidden">
                            <table className="app-table">
                                <thead>
                                    <tr>
                                        {["Name", "SKU", "Price", "Stock"].map((h) => (
                                            <th key={h} className="px-4 py-3 font-medium">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.products.results.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-medium text-brand-dark">{p.name}</td>
                                            <td className="px-4 py-3 font-mono text-xs text-slate-400">{p.sku}</td>
                                            <td className="px-4 py-3">${parseFloat(p.price).toFixed(2)}</td>
                                            <td className="px-4 py-3">{p.stock}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                    {/* Orders */}
                    <section id="orders">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-semibold text-brand-dark">Recent Orders</h2>
                            <Link href="/commerce/orders" className="text-sm font-semibold text-brand-accent hover:text-brand-blue">View all</Link>
                        </div>
                        <div className="app-panel overflow-hidden">
                            <table className="app-table">
                                <thead>
                                    <tr>
                                        {["Order #", "Status", "Amount", "Date"].map((h) => (
                                            <th key={h} className="px-4 py-3 font-medium">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.orders.results.map((o) => (
                                        <tr key={o.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-mono text-xs">{o.order_number}</td>
                                            <td className="px-4 py-3 capitalize text-slate-600">{o.status}</td>
                                            <td className="px-4 py-3">${parseFloat(o.total_amount).toFixed(2)}</td>
                                            <td className="px-4 py-3 text-slate-400">{new Date(o.created_at).toLocaleDateString()}</td>
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
