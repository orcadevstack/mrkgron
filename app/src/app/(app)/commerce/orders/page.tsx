"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import type { PaginatedResponse, Order } from "@/types";

async function fetchOrders() {
  const { data } = await apiClient.get<PaginatedResponse<Order>>("/commerce/orders/?page_size=50");
  return data;
}

export default function OrdersPage() {
  const { data, isLoading } = useQuery({ queryKey: ["orders-full"], queryFn: fetchOrders });

  return (
    <div className="space-y-6">
      <section className="app-surface p-8 lg:p-10">
        <p className="page-eyebrow">Orders</p>
        <h2 className="page-title">Commerce order ledger</h2>
        <p className="page-copy">Track order volume, fulfillment status, and transaction visibility without leaving the workspace.</p>
      </section>
      <section className="app-panel overflow-hidden">
        {isLoading ? (
          <p className="px-6 py-10 text-sm text-slate-500">Loading orders...</p>
        ) : data?.results.length ? (
          <table className="app-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Status</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.results.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="font-mono text-xs text-slate-600">{order.order_number}</td>
                  <td><span className="status-chip bg-brand-accent/10 text-brand-blue">{order.status}</span></td>
                  <td className="text-slate-600">{order.customer}</td>
                  <td className="text-slate-700">${Number(order.total_amount).toFixed(2)}</td>
                  <td className="text-slate-500">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="px-6 py-10 text-sm text-slate-500">No orders available.</p>
        )}
      </section>
    </div>
  );
}