"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import type { PaginatedResponse, Product } from "@/types";

async function fetchProducts() {
  const { data } = await apiClient.get<PaginatedResponse<Product>>("/commerce/products/?page_size=50");
  return data;
}

export default function ProductsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["products-full"], queryFn: fetchProducts });

  return (
    <div className="space-y-6">
      <section className="app-surface p-8 lg:p-10">
        <p className="page-eyebrow">Catalog</p>
        <h2 className="page-title">Product inventory</h2>
        <p className="page-copy">Review catalog pricing, availability, and SKU coverage from a single operational table.</p>
      </section>
      <section className="app-panel overflow-hidden">
        {isLoading ? (
          <p className="px-6 py-10 text-sm text-slate-500">Loading products...</p>
        ) : data?.results.length ? (
          <table className="app-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {data.results.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="font-medium text-brand-dark">{product.name}</td>
                  <td className="font-mono text-xs text-slate-500">{product.sku}</td>
                  <td className="text-slate-600">{product.category}</td>
                  <td className="text-slate-700">${Number(product.price).toFixed(2)}</td>
                  <td className="text-slate-600">{product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="px-6 py-10 text-sm text-slate-500">No products available.</p>
        )}
      </section>
    </div>
  );
}